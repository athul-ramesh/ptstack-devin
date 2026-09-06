# Verification recipes

Parent-owned record for one live proof. A test file is not a receipt.

```
VerificationReceipt
  surface          cli | tui | web | unsupported
  launchCommand    string
  input            string
  observedState    string
  artifactPath     string
  passPredicate    string
```

There is no Devin `run` or `verify` skill. Do not invent one.

## Surfaces

**CLI.** `exec` the real binary or documented command. Capture stdout, stderr, and exit code. `passPredicate` names the exact output or exit that means the user-visible behavior happened.

**TUI.** `exec` the real binary in a PTY or tmux session the skill starts. Drive by sending keys. Capture a transcript or screen dump. Do not attach to a user's already-open terminal.

**Web.** Drive only with a browser mechanism this Devin session actually exposes. If none is visible, `surface` is `unsupported`. Do not pretend `exec curl` is a UI proof unless the product itself is an HTTP API.

**Unsupported.** Name the surface, the control path that is missing, and what a later session would need. Do not fill a fake pass. Do not fall back to unit tests as a substitute.

## Fill

1. `launchCommand` is the exact command that started the instance or process under test.
2. `input` is the user action. A command, a key sequence, a click target. Not an internal setter.
3. `observedState` is what the user-facing surface showed or returned after that action.
4. `artifactPath` is where that evidence still lives after cleanup. Cleanup never deletes the proof.
5. `passPredicate` is a check a later agent can re-run. Exit code, substring, file contents, ARIA text, pixel diff.

## Rules

- Exercise the real user path. Not test-only endpoints, not mocks of the app itself.
- Capture the action and the resulting state. A final screenshot with no action record fails.
- Verify side effects. Files written, rows inserted, messages sent.
- Mock only at a production boundary that already isolates an external system.
- A dry-run or test mode is not proof until you observe what it skipped.
- Two instances share nothing. If the app cannot isolate, refuse to double-drive it.
- Never kill by process name. Kill only what this run started.
