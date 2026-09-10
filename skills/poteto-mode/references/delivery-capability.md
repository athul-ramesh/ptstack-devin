# Delivery capability

Verdict for each source shipping workflow. Read this before naming a delivery playbook.

```
DeliveryCapability
  name       source skill or playbook id
  kind       public-skill | playbook
  verdict    proven | narrowed | cut
  primitive  gh | none
  wake       none
  merge      operator
```

`wake` is always `none`. This plugin has no agent-callable scheduled wakeup. Cloud Devin scheduling exists but is a separate, unverified workstream. A watch that needs a later session is a cut.

`merge` is always `operator`. Do not merge, arm auto-merge, or land unless the user asked in this session.

`verdict` is a port verdict, not a platform verdict. `cut` means the workflow is absent from this port. It does not mean Devin cannot ever do the work. Never report a `cut` as a universal Devin limitation.

## Routing

When a request explicitly names a source shipping workflow, look it up here before choosing a playbook.

- `proven` or `narrowed`: use the named route.
- `cut`: answer with the capability verdict. Name the specific gap, say it is unavailable in this port, and offer the supported bounded in-session alternative. `shipping` maps to Babysit, then Opening a PR. `autopilot-full` and `autopilot-stack` map to Orchestrate plus Babysit for verified in-session work. The operator keeps the landing.
- Never let an explicit shipping or autopilot request fall through to `figure-it-out` unnamed.

| name | kind | verdict | primitive | why |
|---|---|---|---|---|
| make-pr-easy-to-review | public-skill | proven | gh | One-shot inspect and describe. No wake. |
| babysit | public-skill | narrowed | gh | In-session `gh pr checks --watch` and comment triage. No scheduled recheck. |
| opening-a-pr | playbook | narrowed | gh | Opens only when the user asks. No auto babysit. |
| babysit | playbook | narrowed | gh | Same session bound as the skill. |
| shipping | playbook | cut | none | Needs a watch that outlives this session and merge authority this plugin will not take. In-session alternative: Babysit, then Opening a PR. |
| autopilot-full | playbook | cut | none | Needs scheduled ticks and a parent notify. In-session alternative: Orchestrate with root verification. |
| autopilot-stack | playbook | cut | none | Needs scheduled ticks and a topology writer across wakes. In-session alternative: Orchestrate, then Opening a PR for an ordered stack. |

Do not invent a route for a `cut` row. Do not ship a degraded name that promises the source behavior. Do not silently substitute the generic fallback.
