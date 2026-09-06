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

`wake` is always `none`. Devin cannot schedule a later turn. A watch that needs a later session is a cut.

`merge` is always `operator`. Do not merge, arm auto-merge, or land unless the user asked in this session.

| name | kind | verdict | primitive | why |
|---|---|---|---|---|
| make-pr-easy-to-review | public-skill | proven | gh | One-shot inspect and describe. No wake. |
| babysit | public-skill | narrowed | gh | In-session `gh pr checks --watch` and comment triage. No scheduled recheck. |
| opening-a-pr | playbook | narrowed | gh | Opens only when the user asks. No auto babysit. |
| babysit | playbook | narrowed | gh | Same session bound as the skill. |
| shipping | playbook | cut | none | Needs a watch that outlives the session and merge authority this plugin will not take. |
| autopilot-full | playbook | cut | none | Needs scheduled ticks and a parent notify. |
| autopilot-stack | playbook | cut | none | Needs scheduled ticks and a topology writer across wakes. |

Do not invent a route for a `cut` row. Do not ship a degraded name that promises the source behavior.
