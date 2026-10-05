# Port pstack 0.15.13 help and documentation

Audited on 2026-10-05 against the prior source baseline `e43c7ee26e0038c6c1fa8380dd34ce86ff94cb2a`, pstack 0.15.9. Target baseline is `cb0b785`, including the operator's current profile pins.

## Source changes

Source revision `2cbf58508f40de470d7490b55c51d71241928fa2` reports 0.15.13 in the manifest. The relevant commits after 0.15.9 are:

| Commit | Change | Port |
|---|---|---|
| `4e5b1cf` | Add poteto-help | Explicit-user help with a skill map and source links |
| `00b52d9` | Make help typed-only | Devin `triggers: user`, without Cursor metadata |
| `807c031` | Add prompting and recipe references | Both references, adapted for Devin |
| `2cbf585` | Refresh README and guide | README entry, compact Devin usage guide, and help links |

The diff changes 16 files: manifest, README, 11 guide pages, and three new help files. Existing workflow skills, agents, and automation files have no changes after the 0.15.9 baseline. Architect, correct, benchmark-checklist, and the earlier performance improvements were already ported. No further changes to those skills are needed for this update.

Reproduce the source audit from the upstream checkout:

```sh
git diff --stat e43c7ee 2cbf585 -- pstack
git diff --name-only e43c7ee 2cbf585 -- pstack/skills
```

## Adaptations

Help questions produce an answer, at most one suggested prompt, and a source link. Requests to do work route to poteto-mode. The map includes all 34 public skills in this port, including the eight Devin companion skills. Principle leaves remain internal model-triggered references.

Installation uses local Devin CLI. Setup reads registered aliases and preserves the role sheet. Cost guidance retains required perspective counts and explains that profile suffixes are labels while frontmatter pins select models. It does not import Cursor reasoning budgets, `auto`, or `inherit-parent`.

Native sticky mode guidance becomes the existing always-on rule and SessionStart routing, with explicit poteto-mode invocation when missed. Recall uses available conversation evidence, named exports, and live git or gh state. Local writers use verified worktrees or directories. Visual evidence requires an available adapter.

The usage guide carries the portable guide improvements: intent and done checks, restating noisy reports, read-only investigations, prototype evidence before plans, usage documentation before APIs, repeatable verification tools, benchmark vetting, stage evidence, repeated-mistake enforcement, and blind skill evaluation.

Long runs use bounded in-session iterations and resume notes. Pause and resume grant no commit or delivery authority. Shipping and both autopilot routes retain explicit cut verdicts and named in-session alternatives. Cursor Projects, scheduled automations, cloud worker isolation, Benny, and make-bot-ui remain outside this port. The existing profile pins, helpers, playbooks, and hooks are unchanged.

## Verification

`node --test tests/*.test.mjs` passed all 41 structural checks. `git diff --check` passed. A one-off source inspection confirmed explicit-user frontmatter and an exact match between all 34 public skills and the help table. The existing link check covers the new skill, references, README, and guide. Inspect the frontmatter for explicit user activation, all mapped routes for shipped targets, and source links for the Devin repository.

Trace these representative requests through the instructions:

| Request | Expected route or response |
|---|---|
| How do I install pstack? | Local install and setup instructions, no execution |
| Which skill reviews this branch? | Read interrogate, then suggest one namespaced prompt |
| How do I keep the mode on? | Existing default routing, no native sticky claim |
| Runs cost too much | Registered profiles, preserved perspective counts, no pin rewriting |
| Use pstack to fix this bug | Work request follows poteto-mode |
| Land the stack or run full autopilot | Delivery capability cut verdict and named alternative |
| Parallel agents overwrote files | Verified local worktrees or directories |
| Write a multi-PR plan | Plan deliverable without implementation authority |

These are source-level routing checks, not an agent behavior evaluation. Devin CLI 3000.11.3 was inspected. `devin plugins info pstack` resolves to another installed checkout at `/Users/athulramesh/src/ptstack-devin`, version 0.2.0. No installation was replaced. Native discovery, slash activation, and help behavior for 0.3.0 remain untested. Historical 0.2.0 native evidence remains in [port verification](port-verification.md).

No new executable logic was added. Code-comment review is inapplicable to this prose-only port. Skill prose and delivery text were reviewed against the repository's technical-writing and unslop standards.
