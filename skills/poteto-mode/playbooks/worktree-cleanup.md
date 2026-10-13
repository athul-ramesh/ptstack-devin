### Worktree and simulator cleanup

**You own the disk and the safety gate.** Prune merged or abandoned git worktrees and stale iOS simulators to reclaim space. Deletion is irreversible, so every step guards against deleting something in use or holding uncommitted work.

1. Snapshot and audit. Record `df -h /`, then run `skills/poteto-mode/scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]` under the installed plugin. The audit checks ancestry against `origin/HEAD`, falling back to `origin/main` or `origin/master`. Pass `-b origin/<branch>` when the PR targets another branch. Read the reported base before using its merge verdict. It reads paths from `git worktree list`, never hand-typed. It classifies each worktree by size, age, merge state, uncommitted work, and PR state, then suggests a bucket.
2. The bucket is advice, not permission. The pinned and active sessions are the real artifact. Get that set from the user or `devin list`. Cross-check every candidate. Do not search private session storage. The lever has marked `safe` a worktree the user still has open, so the live session set wins.
3. Verify usage before deleting. For anything you doubt, inspect the worktree path and the session list. A session whose cwd is that worktree is in use even when the audit bucket says safe.
4. Pause on irreversible loss. `wip:N` is N tracked uncommitted edits. Show the diff and get a decision first. Removing a clean worktree is recoverable from its branch. Uncommitted work is gone. `scratch:N` is untracked throwaway, safe to drop, but name the files. Clean, merged, and not-in-use proceeds. `wip` and in-use pause.
5. Prune the confirmed set. Per path, `git worktree remove --force <path>`. If the dir survives on ignored build artifacts, `rm -rf` it, then `git worktree prune`. Branch refs survive, so no commits are lost. Confirm with `df -h /` and re-list.
6. Simulators and other reclaimers. Simulators are usually the next-biggest win. `xcrun simctl --set testing delete all`, `xcrun simctl delete unavailable`, and `xcrun simctl runtime list` then `runtime delete <id>` for old runtimes. More when needed: Xcode `DerivedData` and `iOS DeviceSupport`. Package caches (pnpm, uv, brew, yarn). Clear only caches the user has not said to keep.

This is the one playbook that deletes user state with no code review to catch a slip, so the gates above are the review.

**Reply:** `df -h /` before and after with space reclaimed, the worktrees pruned, and a one-line reason for each held back (in-use by which session, or uncommitted work).
