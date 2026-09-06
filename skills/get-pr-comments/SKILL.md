---
name: get-pr-comments
description: Fetch and summarize review comments from the active pull request
---

# Get PR comments

## Trigger

Need a concise, actionable summary of feedback on the active pull request.

## Workflow

1. Read [`../poteto-mode/references/evidence-source.md`](../poteto-mode/references/evidence-source.md).
2. Resolve the active PR for the current branch. `exec` `gh pr view --json number,url,title,reviewDecision`.
3. If `gh` reports no pull request for this branch, the source is `unavailable` with category `pr` and reason `no active PR`. Return that result. Stop.
4. Fetch review comments and discussion comments. `exec` `gh api` for the pull review comments and issue comments on that number. Kind `pr`. Locator is the PR number.
5. Group feedback by severity and actionability.
6. Return a concise action list.

## Output

- Grouped feedback summary, or the explicit no-active-PR result
- Action list ordered by priority
- Open questions that still need clarification
- `EvidenceSource` kind and locator
