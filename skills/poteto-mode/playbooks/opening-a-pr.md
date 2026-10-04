### Opening a PR

Invoked only when the user asks to open a pull request.

Read [`../references/delivery-capability.md`](../references/delivery-capability.md).

**Worktree.** Work from the current branch unless the user named a worktree. Dirty unrelated work, stop and say so.

**Commits.** Rebase into small ordered commits before opening. Each commit is landable. Amend when the fix belongs in a just-made commit.

**PRs.** Run `/pstack:deslop` over the diff before commit. Run `/pstack:no-comments` before review. Write every PR title, PR description, and commit body with `/pstack:technical-writing`, then `/pstack:unslop`.

**Titles.** Conventional Commits `type(scope): subject`. Types `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`. Short imperative subject. No trailing period.

**Descriptions.** These sections in order. Keep required sections. Omit Tradeoffs only when empty.

- `## Why`. Intent and why this approach fits.
- `## What changed`. Concrete changes from the diff, with real symbols and paths.
- `## Scope`. Always state coverage and deliberate exclusions.
- `## Tradeoffs`. Real choices only. Skip when there are none.
- `## Blast Radius`. Who and what the change touches.
- `## Verification`. How you ran each check. Name `exec` commands. State the outcome.

Keep verification outcomes concise and include at most one primary performance number. Link detailed measurement evidence separately.

Do not use `## Summary` or `## Test plan`.

**Forge.** `gh` only. Resolve the repository with `gh repo view` before the first PR operation.

**Size.** Prefer several narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child rebases onto its parent tip. Create a child with `gh pr create --base <parent-branch>`. Retarget with `gh pr edit <pr> --base <parent-branch>`.

**Readiness.** Open ready, never as a draft. Omit `--draft`. If it still opens as a draft, `gh pr ready <number>`. Then `gh pr view <number>`.

**Babysit.** Opening a PR does not start a babysit. Post the URL and stop. Run `/pstack:babysit` only when the user asks.

A subagent that opens a PR runs `/pstack:interrogate`, `/pstack:deslop`, and `/pstack:no-comments`. It returns the URL and does not babysit.

Never merge. Merge authority stays with the operator.
