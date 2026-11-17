### Opening a PR

Invoked only when the user asks to open a pull request. Read [`../references/delivery-capability.md`](../references/delivery-capability.md). Opening a PR does not start a babysit. Never merge.

Work from the current branch unless the user named a worktree, and keep unrelated work out of it. Rebase into small, landable commits. Run `/pstack:deslop` over the diff before commit and `/pstack:no-comments` before review. Write the title, body, and commit text with `/pstack:technical-writing`, every layer except Diátaxis, then `/pstack:unslop`.

Title: `type(scope): subject`, naming a real symbol when one carries the change. Body: a one-minute briefing under 40 lines with these `##` headings in order, dropping empty ones: `## Why`, `## What changed`, `## Scope`, `## Tradeoffs` (only rejected alternatives a reviewer would otherwise ask about), `## Blast Radius`, `## Verification`. Open `## Why` with the user's goal.

Stack follow-ups by base branch with `gh`. Resolve the repository with `gh repo view` before the first PR operation. Open PRs ready. Use `gh pr create` without `--draft`. If it still opens as a draft, run `gh pr ready <number>`.
