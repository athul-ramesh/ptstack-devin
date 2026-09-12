---
name: recall
description: "Reconstruct recent working context from this conversation, a user-named Devin export, live git and gh state, and the shared record, then hand back a tight current-state brief. Use for 'recall my work on X', 'catch me up', 'what have I been working on', 'where did I leave off', before starting or resuming work."
---

# Recall

Rebuild the user's recent working context before you start or resume. Hand back a tight capsule of where things stand and what to do next. Use for "recall my work on X", "catch me up", "what have I been working on", or "where did I leave off".

Keep it tight. Read only what the in-scope threads need, then stop. Heavy reading fans out to `run_subagent`. The main thread keeps findings and the brief.

Context lives in two records. Session evidence is this conversation and any export the user named. The shared record is everything that happened around the same code under other names. Symptoms, shipped then reverted fixes, errors still firing. `/pstack:why` searches that record. Do not reconstruct a named feature from session evidence alone.

Read [`../poteto-mode/references/evidence-source.md`](../poteto-mode/references/evidence-source.md). Every source you use or skip is an `EvidenceSource`.

1. Classify, then route. This skill loads working context across recent session evidence before you act. A human-readable authored-commit summary is `/pstack:what-did-i-get-done`. If the user already gave a full state capsule (paths, branch, the change), use it and skip the mining. Resume from a pause note or `ProgramState` store via `skills/poteto-mode/playbooks/session-pickup.md`. Habit capture is `/pstack:automate-me`.

2. Lock the scope before searching. Pin the window. "Recent" is a real range. Default the last 7 days. Pin the topic if named. Workspace is this repo. Never read another project's files without being asked. State the scope back. Never quietly turn "all" into "recent N".

3. Collect session evidence. Use the session-bodies order in `evidence-source.md`. For one named export, `read` it here. For several named exports, one `run_subagent` per file on `pstack:panel-opus`. Sequential when `executionMode` is sequential. Say so. Each worker returns topic, the user's goal, decisions, open threads, struggles, and artifacts, citing the export path. Raw files stay with the workers.

4. Sweep the shared record whenever the topic names a feature, file, subsystem, area, or bug. This is the default. "My work on X" does not skip it. Invoke `/pstack:why`. Steer the question to current state, what was tried and did not hold, and what users still report. why records a `PanelRun` and reports source coverage failures and unchased leads. Copy those gaps as `unavailable` sources with their reasons. Run this with the session mining, not after it.

5. Verify against live state. An export or a stale ticket is history. Take PRs, branches, and tickets the mining surfaced and check them with `exec` git and `gh`. When the answer hinges on what an agent did, read the full named export, not a digest.

6. Write the brief to the contract below. Group by thread. Stay on the named topic.

## Output contract

Lead with the capsule, then the thread status, then the problems, then the next move. Cut deeper detail.

- **Capsule.** At most 5 bullets. What this work is and where it stands.
- **Threads.** One line each, prefixed with exactly one status tag: `[merged #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`. Tag every thread.
- **Problems.** At most 5, the recurring ones. Include symptoms users keep reporting and any fix that shipped and was reverted.
- **Next move.** The single most useful next action, concrete.

An adjacent feature or ticket stays out unless it blocks this one. When the capsule and thread lines outgrow a screen, cut detail before you cut threads. Write the brief clean. Follow `/pstack:unslop`. Cite session findings by export path or "this conversation". Cite shared-record findings by `EvidenceSource` kind and locator. Sanitize private context before any public output. List unavailable sources.

**Reply:** the brief, to the contract above.
