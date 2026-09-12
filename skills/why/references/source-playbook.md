# Source registry

Only categories registered below are searched. An installed connector alone does not expand the sweep. Each investigator reads its assigned category's playbook.

| Category | Playbook | Tools it documents |
|---|---|---|
| Source control history | [`code-archaeology.md`](./sources/code-archaeology.md) | git, `gh` |

To add a connector, add a category row and a playbook describing its required read tools, availability/authentication check, search scope, citation locators, and source-specific pitfalls. Reuse an existing category for another provider of the same evidence. Use the shared investigator output contract; keep source-specific instructions in the playbook. Record unavailable tools as coverage gaps, not empty search results.

Cross-cutting:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). Add this to the source-control investigator if the target code looks defensive (null checks, retry, timeout, rate limit, feature flag, egress guard, OOM handler).
