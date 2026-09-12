# Incident & Postmortem Context

Not a separate source, a **cross-cutting angle**. Incidents often motivate defensive code ("we added this check after the X outage"), so if the target looks defensive (null checks, retry logic, timeout handling, rate limiting, feature flags), hunt for incident history inside source control:

- **Commits**: messages like "fix for incident", "add defensive check", "hotfix", and "revert" followed by "re-apply with..." are strong signals. Try `git log -i -E --grep='incident|hotfix|outage|sev|postmortem' -- <file>` on the target file and around the dates it was added.
- **PRs**: search merged PRs for incident language (`gh search prs 'incident' --merged --repo <owner/repo>`, `gh pr list --state merged --search 'sev OR postmortem OR outage' --repo <owner/repo>`). Review comments often mention "this broke in prod" or name the incident.
- **External links in PR bodies**: postmortem docs, incident tickets, and status-page links pasted into PRs or comments. Record them as cross-source leads for the parent to route or report as unchased.

If you find an incident reference, fetch the full PR thread. Postmortem action items often tie directly to the defensive code.

Worth spending time on when the code's defensive character makes an incident-driven origin plausible. Skip it for code that doesn't look defensive.
