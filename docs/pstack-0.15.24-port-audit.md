# Port pstack 0.15.24 to Devin

Audited on 2026-10-15 against Devin baseline `01bc45a`. Plugin version is 0.6.0, with 37 public skills, 24 internal principle leaves, and 20 playbooks.

## Source and coverage

Upstream range: [`dbf4981...1e5c90a`](https://github.com/cursor/plugins/compare/dbf49813a39c1a5389c5e28cb8e4c1c2379e2454...1e5c90a4b6f249917bd21fe361b3a2a7deb741b8) (`pstack/`, 0.15.23 to 0.15.24). The previous audit already covers the 0.15.23 baseline, including #539, #570, #571, #575, #577, #602, and #606, so no earlier prerequisite is missing.

| Upstream change | Devin disposition |
| --- | --- |
| [#615](https://github.com/cursor/plugins/pull/615) `/sharpen` | Ported as `/pstack:sharpen` with `triggers: [user]`, the documented Devin equivalent of `disable-model-invocation: true`. Help entry and recipe added. |
| [#609](https://github.com/cursor/plugins/pull/609) ketchup rewrite | Ported. Under-150-word budget that counts visual and fallback words, bro voice without its task, two-line action items, unasked irreversible steps, box and label limits. Retains the host-rendering limit and text fallback. Drops `/visualize`, which this port does not ship. |
| [#613](https://github.com/cursor/plugins/pull/613) per-spawn effort and fast-mode rule | Adapted to one statement in poteto-mode Models. Devin `run_subagent` takes a profile, not a model, so there is no per-call reasoning or speed knob. The rule's one-liners in arena, how, why, interrogate, swarm, reflect, recall, and other playbooks are not added. |
| #613 `cursor-grok-*` and `composer-*` family fallbacks | Skipped. Cursor model slugs. This port ships no Cursor slugs. |
| #613 swarm cadence | Adapted in multi-phase-plan. The full audit set runs once at the code-ready SHA, and again only for new behavior, a redesign, or a large diff. Rebases, conflict resolutions, and minor fixes get one fresh-context verifier. |
| #613 orchestrate, shipping, autopilot drop Graphite and prefer Origin | Already satisfied for Graphite. Fork prose and helpers use `gh` only. Origin CLI preference skipped. It is a Cursor forge, not part of the Devin docs. Shipping and autopilot remain cut. The `orch.ts` frontier rewrite is skipped because this port has no orch helper. |
| #613 `worktree-audit.sh` Origin branch | Skipped for the same reason. The `gh` path is unchanged. |
| #613 `watch-pr` GitHub changes | Skipped. This port has no watch-pr helper. |
| [#616](https://github.com/cursor/plugins/pull/616) autopilot catches up with ketchup | Skipped. Autopilot-full and autopilot-stack are cut. |
| [#617](https://github.com/cursor/plugins/pull/617) version bump | Plugin bumped independently to 0.6.0. |
| #613 `/loop 1h` tick and Cursor cloud agent owners | Skipped. Devin `/loop` is not a timer. |

## Devin compatibility

| Capability | Evidence |
| --- | --- |
| User-only skills | Documented `triggers` field, default `[user, model]`. [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills). |
| No per-dispatch model or effort | Documented. "The `run_subagent` tool takes a profile, not a model." [Subagents](https://docs.devin.ai/cli/subagents). |
| Plugin skills and agents | Local CLI and Desktop only. [Plugins](https://docs.devin.ai/cli/extensibility/plugins/overview). |
| `/loop` | Interactive review loop, not a scheduler. [Commands](https://docs.devin.ai/cli/reference/commands). |

## Verification and limits

`node --test tests/*.test.mjs` passes. The test suite adds `sharpen` to the user-activation contract. These are static checks. Native 0.6.0 skill registration, slash activation, and visual rendering are untested.
