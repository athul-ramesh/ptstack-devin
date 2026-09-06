---
name: babysit
description: Watch an open PR. Fix failing CI, handle straightforward review comments, and drive it to a mergeable state. Use after opening a PR when the user wants the agent to shepherd it without re-prompting.
---

# Babysit a PR

Standalone `/pstack:babysit` for one PR outside a poteto-mode run. Inside poteto-mode, [`../poteto-mode/playbooks/babysit.md`](../poteto-mode/playbooks/babysit.md) owns mode, frontier, and stop conditions.

This session only. Devin cannot schedule a later turn. Do not claim a watch that outlives this session.

Read [`../poteto-mode/references/delivery-capability.md`](../poteto-mode/references/delivery-capability.md).

## When to use

- An open PR and the user wants it kept green, and you are not already inside poteto-mode.
- The user invokes `/pstack:babysit` directly.
- A subagent that opens a PR does not babysit. Return to the parent.

## Steps

1. Fetch PR state.

   ```
   exec gh pr view <number> --json number,title,state,mergeable,reviewDecision,statusCheckRollup,mergeStateStatus,comments,reviews
   ```

   If `gh` reports no pull request, stop. Category `pr`. Reason `no active PR`.

2. Triage in priority order.
   - Merge conflicts (`mergeStateStatus` DIRTY). Report which branch needs the rebase. Do not restack unless this branch is yours and the user asked.
   - Failing checks. `exec` `gh run view <run-id> --log-failed`. Fix the cause. Commit. Push.
   - Review comments. Act only on feedback you agree with. A mechanical answer gets an edit and a quoted commit message. A judgment call stays open with a reply that says what you would have done.
   - Review-bot comments. Classify fix, dismiss, or ask per [`references/bugbot-triage.md`](references/bugbot-triage.md). Ask by default on security, data, and high-severity findings.

3. Recheck in this session. Active CI uses `exec` `gh pr checks --watch`. That command blocks until checks finish. Awaiting a reviewer means report and stop. Write what remains. Do not sleep.

4. Stop when
   - checks are green, comments you agreed to fix are resolved, and `gh pr view` reports mergeable. Call it ready. Do not merge.
   - three fix, push, recheck rounds still fail. Summarize what is broken.
   - the next fix is a design choice. Pause and ask.

5. Report. Fixes, comments addressed, comments deferred with reason, current PR status. Cite each commit SHA.

## Hard rules

- Do not rewrite history on a branch others may have pulled unless the user clears it.
- Do not tweak expected test values just to pass.
- Never skip hooks.
- Never mark a failing check as not required.
- `gh pr ready` only when checks are green and no unresolved review comments remain.
- Never merge or arm auto-merge. This plugin does not ship a shipping playbook.
