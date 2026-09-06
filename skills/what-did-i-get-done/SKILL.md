---
name: what-did-i-get-done
description: Summarize authored commits over a user-specified time period into a concise update
---

# What did I get done

## Trigger

Need a short, high-signal summary of work completed in a specific time range. Yesterday, last 3 days, or last week.

## Workflow

1. Resolve the requested time window into concrete dates. State the range back.
2. Read [`../poteto-mode/references/evidence-source.md`](../poteto-mode/references/evidence-source.md). The source kind is `git-history`.
3. `exec` `git config user.email`, then `git log --author=<that email> --since=<start> --until=<end> --no-merges` with a format that includes sha, date, and subject. Exclude uncommitted changes.
4. Synthesize the most important shipped changes into a concise status update. Describe changes functionally. Do not infer intent.
5. Include the actual date range used.

## Guardrails

- Be extremely concise.
- Prioritize substantial behavior or architecture changes.
- Omit cosmetic-only changes.
- Do not invent commits. Cite shas from the log.
- If the log is empty, say so. That is a finding, not a failure.

## Output

- One short summary suitable for a status update
- Real date range
- Optional 2-5 bullets for major changes only
- `EvidenceSource` kind `git-history` with the sha range
