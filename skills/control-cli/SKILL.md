---
name: control-cli
description: Build or adapt a local harness to drive, inspect, and profile an interactive CLI or TUI without external services. Use for CLI UX checks, startup regressions, memory leaks, hangs, prompt flows, or terminal demos.
triggers:
  - user
---

# Control CLI

Use a repeatable local harness to exercise an interactive CLI instead of poking at it manually. Drive the product under test through a real terminal layer. Do not treat a one-shot `exec` of the binary as proof of prompts, focus, resize, or TUI layout. First reuse the repo's own test/demo harness if it exists. Otherwise pick a terminal layer below and `exec` its commands. A `VerificationReceipt` from [Verification recipes](../poteto-mode/references/verification.md) records the proof. For a durable project harness, use `/pstack:create-verification-skill`.

## What It Is Used For

- Reproducing CLI/TUI bugs with deterministic input.
- Verifying keyboard flows, prompts, interrupts, resize behavior, and terminal layout.
- Capturing before/after transcripts for bug fixes.
- Profiling startup time, slow operations, hangs, or memory growth.
- Recording a short terminal demo when output is easier to show than explain.

## Harness Loop

1. Identify the command under test and the smallest reproducible workspace.
2. Discover existing local harnesses: package scripts, e2e tests, demo recorders, expect scripts, or PTY helpers.
3. If no harness exists, launch the CLI in an isolated terminal session with deterministic env vars.
4. Capture the current screen before interacting.
5. Send one action at a time: text, Enter, arrows, Escape, Ctrl-C, resize.
6. Wait for a concrete screen pattern or prompt before the next action.
7. Save the transcript and any profile artifacts.
8. Tear down only blocks or sessions this run created.

## Harness Options

Pick the first that works in this session.

1. Repo-native harness: checked-in scripts that know startup, env, and prompts.
2. **Rex** (Superlogical): when `command -v rex` succeeds and `rex whoami --json` reaches a server. Prefer this over tmux on machines that run Rex.
3. `tmux`: managed sessions, `capture-pane`, `send-keys`, attach/detach.
4. PTY probe: short Python, Node, or Expect script when Rex and tmux are unavailable.
5. Runtime inspector: Node or Bun inspector for CPU profiles, heap snapshots, and live evaluation.
6. Terminal recorder: repo-local demo tools or asciinema-compatible tools when the user asks for a demo.

Non-interactive one-shots may still use `exec` on the real binary. Interactive prompts and TUIs need Rex, tmux, or a PTY.

## Minimal Rex Harness

Label every harness block so cleanup cannot hit the user's workspace. Save the block id from `--json`. Prefer a dedicated session or a new tab for the product under test. Do not type into the agent's own block unless the user asked to drive that pane.

```bash
mkdir -p .pstack/cli-harness
created=$(rex run --label cli-harness --focus=false -c "$PWD" --json -- <command-under-test>) || exit
block=$(printf '%s' "$created" | jq -er '.block_ids[0]') || exit
rex capture -b "$block" --trim
rex send -b "$block" $'help\n'
rex capture -b "$block" --trim > .pstack/cli-harness/after.txt
rex send-key -b "$block" ctrl+c
rex block close "$block"
```

For a command that should exit with a status:

```bash
rex run --label cli-harness --focus=false --wait -c "$PWD" --json -- <command-under-test>
```

If `REX_SESSION` is unset, pass `-s` from `rex whoami --json` or `rex ls --json`. If `rex` is missing or the server is unreachable, fall through to tmux or PTY and say so in the receipt.

## Minimal tmux Harness

```bash
SESSION="cli-harness-$(date +%s)"
tmux new-session -d -s "$SESSION" -- <command-under-test>
tmux capture-pane -pt "$SESSION"
tmux send-keys -t "$SESSION" "help" Enter
tmux capture-pane -pt "$SESSION"
tmux kill-session -t "$SESSION"
```

For Node CLIs:

```bash
NODE_OPTIONS="--inspect=127.0.0.1:0" tmux new-session -d -s "$SESSION" -- <node-cli-command>
```

Read the terminal output to find the inspector URL, then use Chrome DevTools-compatible tooling if profiling is needed.

## Minimal PTY Harness

Use a PTY script when you need deterministic waits in a repo that does not have tmux or a demo harness. Keep it temporary unless the user asks to add a reusable test.

```python
import os
import pty
import select
import subprocess
import time

master_fd, slave_fd = pty.openpty()
proc = subprocess.Popen(
    ["<command>", "<arg>"],
    stdin=slave_fd,
    stdout=slave_fd,
    stderr=slave_fd,
    close_fds=True,
)
os.close(slave_fd)

deadline = time.time() + 30
buffer = b""
while time.time() < deadline:
    ready, _, _ = select.select([master_fd], [], [], 0.25)
    if not ready:
        continue
    chunk = os.read(master_fd, 4096)
    buffer += chunk
    if b"<ready text>" in buffer:
        os.write(master_fd, b"help\n")
        break

print(buffer.decode(errors="replace"))
proc.terminate()
os.close(master_fd)
```

If the CLI needs richer terminal control, use `pty.fork()` or an existing PTY library.

## Profiling Recipes

- Startup regression: capture baseline and treatment startup timings under the same machine, env, and command.
- Slow operation: start a CPU profile, perform the operation, stop the profile, and compare top self-time functions.
- Memory leak: force GC if available, take a heap snapshot, perform the operation repeatedly, force GC again, and take another snapshot.
- Hang: capture the screen, active handles/resources, and a stack/CPU sample before interrupting.

## Guardrails

- Prefer deterministic waits over sleeps. If you must sleep, explain why.
- Do not send credentials or destructive commands into a controlled session.
- Keep harness artifacts under the project checkout, such as `.pstack/cli-harness/`, unless the repo already has a testing/demo harness. Devin denies writes outside the workspace, so do not use `/tmp`.
- Do not hard-code paths from another repository. Adapt commands to the current repo's scripts and runtime.
- Clean up only Rex blocks, tmux sessions, temp dirs, inspector processes, and demo artifacts this run created. Never `rex kill` a whole user session to finish a harness.