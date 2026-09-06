### Babysit

**You own the merge frontier. Declare a mode, clear one PR at a time, stop where the human's call begins.** For "babysit this", "get it green", "all green", "merge-ready", "watch CI", "address the bugbot comments", or "check on PR X".

This playbook supersedes `/pstack:babysit` inside poteto-mode. `/pstack:babysit` stays the standalone entry outside poteto-mode.

This session only. Devin cannot schedule a later turn. Do not claim a watch after this session ends.

Read [`../references/delivery-capability.md`](../references/delivery-capability.md).

1. **Declare the mode and use `gh` before any poll.** `drive` runs to merge-ready. `threads-only` answers review comments and touches nothing else. `check` is one status pass. Undeclared defaults to `drive`. Small or docs-only PRs get `check`, not `drive`. There is no background mode. A second plan still executing is `check`.
2. **Work the merge frontier and nothing above it.** The lowest unmerged PR is the only one that matters.
3. **One babysitter per stack.** If another session is already on it, stop.
4. **Never mutate stack topology.** No base retarget, rebase, or force-push from inside a babysit. Report rebase-shaped work. The one sanctioned creation is a new PR on top of the remaining stack when the owning PR has already merged.
5. **Order is conflicts, then review threads, then CI.** Batch known fixes into one push. A conflict is reported, not resolved, because resolving it is a restack. Say which branch needs the rebase and stop.
6. **Trust `gh`, not a green check list.** Ready means `gh pr view` reports mergeable, checks are green, and no unresolved blocking threads remain. Active CI uses `exec` `gh pr checks --watch`. That blocks until checks finish. Then re-read the PR. Awaiting a human reviewer means report and stop. Do not sleep. Stop `drive` when the frontier is merge-ready. Do not merge. Do not arm auto-merge.
7. **Classify CI before any retrigger.** Flake earns one fresh build, never a job retry. A failure in code the diff never touches is a stale base. Report it as needing a rebase.
8. **Review bots are triaged skeptically.** Classify fix, dismiss, or ask per [`../../babysit/references/bugbot-triage.md`](../../babysit/references/bugbot-triage.md). Fix real findings in the lowest owning PR.
9. **Stop at the human's line.** Owner approval is a wait. Babysitting never authorizes merging. This plugin does not ship a shipping playbook. After merge-ready, report status and stop.

**Reply:** the mode, the frontier and its `gh` state, what you fixed versus dismissed, what is still pending, and what needs the human.
