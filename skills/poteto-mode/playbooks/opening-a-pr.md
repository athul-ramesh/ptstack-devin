### Opening a PR

Invoked only when the user asks to open a pull request.

Read [`../references/delivery-capability.md`](../references/delivery-capability.md).

**Worktree.** Work from the current branch unless the user named a worktree. Dirty unrelated work, stop and say so.

**Commits.** Rebase into small ordered commits before opening. Each commit is landable. Amend when the fix belongs in a just-made commit. Commit bodies do not restate the subject.

**PRs.** Run `/pstack:deslop` over the diff before commit and `/pstack:no-comments` before review. Write PR titles, descriptions, and commit bodies with `/pstack:technical-writing`, every layer except Diátaxis, then `/pstack:unslop`. Use one word per action, keep articles, and prefer a plain verb over `-ing` where one works.

**Titles.** Conventional Commits `type(scope): subject`. Types `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`. Short imperative subject. No trailing period.

**Descriptions.** A one-minute briefing for a reviewer who has the diff. Use short, simple sentences and few identifiers. Keep the body under about 40 lines. Use these sections in order. Keep required sections. Omit Tradeoffs only when empty.

- `## Why`. Intent and why this approach fits.
- `## What changed`. 1-3 short bullets. Name a symbol or path only when it carries the change. Name both sides of a rename or retarget.
- `## Scope`. Always state coverage and deliberate exclusions in 1-3 short items, without a file-by-file essay.
- `## Tradeoffs`. Real choices only. Skip when there are none.
- `## Blast Radius`. Who and what the change touches.
- `## Verification`. How you ran each check. Name `exec` commands. State the outcome.

Keep verification to 1-3 real run paths and their outcomes. Include at most one primary performance number with its unit and before/after values. Link detailed measurement evidence separately. Attach videos or screenshots only when they prove a claim.

Do not use `## Summary` or `## Test plan`.

**Forge.** `gh` only. Resolve the repository with `gh repo view` before the first PR operation.

**Size.** Prefer several narrow PRs to one large PR. A stack is a base-branch chain. The root PR targets trunk. Each child rebases onto its parent tip. Create a child with `gh pr create --base <parent-branch>`. Retarget with `gh pr edit <pr> --base <parent-branch>`.

**Readiness.** Open ready, never as a draft. Omit `--draft`. If it still opens as a draft, `gh pr ready <number>`. Then `gh pr view <number>`.

**Babysit.** Opening a PR does not start a babysit. Post the URL and stop. Run `/pstack:babysit` only when the user asks.

A subagent that opens a PR runs `/pstack:interrogate`, `/pstack:deslop`, and `/pstack:no-comments`. It returns the URL and does not babysit.

Never merge. Merge authority stays with the operator.
