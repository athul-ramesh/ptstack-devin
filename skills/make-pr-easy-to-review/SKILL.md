---
name: make-pr-easy-to-review
description: Prepare PRs for review by cleaning noisy history, improving PR descriptions, and adding reviewer guidance without changing code behavior. Use for "make this easy to review", "tidy this PR", "clean up commits", or "annotate the diff".
---

# Make PR easy to review

Prepare a PR so a reviewer can understand intent, important files, and risk. The default goal is reviewability without behavior changes.

Read [`../poteto-mode/references/delivery-capability.md`](../poteto-mode/references/delivery-capability.md).

## Workflow

1. Resolve the target PR from the user URL or the current branch. `exec` `gh pr view --json title,url,number,headRefName,baseRefName,state,commits,body`.
2. If `gh` reports no pull request, stop. The source is unavailable. Category `pr`. Reason `no active PR`.
3. Inspect commits, diff size, changed paths, generated files, and the PR body.
4. Name reviewability issues. Noisy commits, stale description, unrelated changes, mixed mechanical and logic changes, missing tests, or unclear entry points.
5. Propose a plan before rewriting history or force-pushing.
6. Apply safe improvements. Then verify the tree still matches the intended code.

## History cleanup

Rewrite history only when the user asks or agrees to the plan.

```
exec gh pr view <PR> --json title,headRefName,baseRefName,state,commits
exec git fetch origin <headRefName> <baseRefName>
ORIGINAL_TREE=$(git rev-parse origin/<headRefName>^{tree})
```

Good commit groupings follow dependency order.

1. Schema, storage, or generated API definitions.
2. Core logic.
3. Wiring and integration.
4. UI or surface behavior.
5. Tests.

After rewriting, verify content identity.

```
echo "Original tree: $ORIGINAL_TREE"
echo "Current tree:  $(git rev-parse HEAD^{tree})"
git diff origin/<headRefName> --stat
```

Do not push if the tree changed unintentionally.

## Reviewer guidance

When behavior stays untouched, prefer the PR body and review notes.

- Add a TL;DR that matches the actual diff.
- Separate core files from generated or mechanical files.
- Call out risky behavior, migration order, rollout, and test coverage.
- Link issue trackers or design docs when they explain intent.

## Guardrails

- Never hide meaningful behavior changes inside cleanup.
- Do not skip hooks unless the user asks.
- If the PR is too large to make reviewable with notes, recommend splitting.
- Do not merge. Merge authority stays with the operator.
