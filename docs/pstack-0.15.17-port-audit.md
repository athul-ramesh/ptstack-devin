# Port pstack 0.15.17 ketchup and prompt reductions

Audited on 2026-10-12 against Devin baseline `a211528d4bd080c0712b6b79ad23892aab31504b`. Plugin version is 0.4.0, with 35 public skills, 24 internal principle leaves, and 20 playbooks.

## Source and scope

This port applies the two requested upstream changes from [cursor/plugins](https://github.com/cursor/plugins):

| Source | Port |
|---|---|
| `00b14f1df36b32a8dd1529324a3a459f6563b127`, [#538](https://github.com/cursor/plugins/pull/538) | Prompt reductions in all 33 changed skill files that this port ships |
| `978ca6e9c0e012047cd5058b8e829240336e704e`, [#539](https://github.com/cursor/plugins/pull/539), pstack 0.15.17 | Explicit-user ketchup, README entry, and poteto-help routing |

The previous port tracked 0.15.13. This is a selective port of #538 and #539, not a full synchronization of every intervening commit. The earlier #509 setup nudge and #511 Cursor model-default changes are outside this request. Existing Devin setup behavior, configured model pins, and perspective counts remain unchanged.

Reproduce the source inventory from an upstream checkout:

```sh
git show --stat 00b14f1 -- pstack
git diff --name-only 00b14f1^ 00b14f1 -- pstack/skills
git show 978ca6e -- pstack
```

## Adaptations and preserved contracts

Ketchup uses Devin `triggers: user` in place of Cursor `disable-model-invocation`. Its command is `/pstack:ketchup`; its voice reference resolves to the existing bro skill. It catches up from the last user message before invocation, excludes notifications and worker results from that boundary, and includes older unresolved user decisions. PR, CI, and agent status checks remain read-only. Unavailable checks and unknown costs or defaults must be disclosed. Work the agent can do is separate from user action items.

Prompt reductions cover architect, arena, benchmark-checklist, figure-it-out, how, interrogate and two references, poteto-mode and its Opening a PR and Trace forensics playbooks, ten principle leaves, reflect and four references, technical-writing, unslop, and why with four references. Repeated instructions and examples are condensed without importing Cursor dispatch or model fallback behavior.

- Panel resolution, separate fresh perspectives, same-pin implementation mapping, writer isolation, result collection, and recovery remain owned by the existing Devin references. Agent profiles and executable helpers are unchanged.
- How keeps simple and complex paths and its critique panel. Architect keeps distinct candidates, design screening, redesign on repeated friction, and the four checks for partial-context contributors. Arena keeps the cross-judge and records the base rationale, grafts, rejections, dropouts, convergence, and verification together in its output contract.
- Why retains all five confidence tiers, citations, contradictions, uncertainty, source availability, and unchased leads. Its registry still covers source control only. Git and GitHub access are checked separately. The changed Datadog and Sentry references are not shipped and remain excluded.
- Reflect retains transcript privacy, untrusted-transcript handling, three review lenses, every supported durable learning, structural enforcement preference, and explicit approval before skill edits. The port does not acquire Cursor transcript paths or tools.
- Benchmark-checklist retains OS-aware probes, all seven checks, five interleaved runs per side for comparisons, median/range, inconclusive outcomes, and the limited one-run ballpark exception.
- Poteto-mode keeps authorized reversible work, explicit delivery requests, operator merge authority, and the cut-workflow verdicts. Its separate principle catalog and playbook routing table already avoid the duplication #538 removes upstream; they stay intact. Opening a PR keeps the Devin forge and authorization rules. Trace forensics keeps source attribution, paired-capture confidence, and diagnosis without an unsolicited fix.
- Principle activation stays model-only. Technical-writing and unslop retain their Devin-specific additions, including the voice guidance. No public skill is removed.

## Verification

Run `node --test tests/*.test.mjs` and `git diff --check` from the Devin checkout. The baseline passed 41 tests. The final port passed all 42 tests and `git diff --check`. The port extends explicit-user activation coverage to ketchup and adds a relation check between the public skill directories and the help table. Existing checks cover links, principle discovery, dispatch fields, same-pin mapping, isolation, delivery exclusions, plan validation, model configuration, and logging helpers.

The source inventory check confirms that each of the 33 shipped files changed by #538 is addressed. Agent files, hooks, executable helpers, model setup, source registry, and delegation references are byte-identical to the baseline. The ketchup body matches #539 after the command and frontmatter adaptations.

Source-level scenario review:

| Situation | Expected instruction path |
|---|---|
| Ketchup after work and worker notifications | Anchor on the prior user message, include subsequent work and reports, check current state read-only |
| An older approval is still pending | Include it despite the recent-message boundary |
| Agent work remains, no user decision needed | Report zero action items and name remaining agent work separately |
| Nothing changed and no decision is pending | Say so and stop |
| PR/CI/agent status cannot be checked | Disclose the unavailable check; do not imply success |
| A decision has unknown costs or no known default | Say what is unknown instead of guessing; include recommendation and no-answer consequence when known |
| Help asks how to catch up on this chat | Suggest ketchup without invoking it or resuming the task |
| Why has local git but no PR access | Search local history and record the unavailable portion separately from empty results |
| Reflect finds an unused visible skill | Route to description tuning; retain approval before editing |
| A captured trace lacks a paired capture | Report a hypothesis rather than a confirmed cause |

These are instruction and structural checks, not a live model behavior evaluation. Devin CLI is unavailable in this environment. Native slash activation, read-only execution, and configured Devin panel passes were not run. No native dispatch or runtime model identity is claimed. Code-comment review is inapplicable to this prose port; the test change only extends structural coverage. Prompt and delivery text were reviewed against technical-writing and unslop.

Historical native evidence is in [port verification](port-verification.md). Do not treat it as a native test of 0.4.0.
