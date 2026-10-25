# Port pstack 0.15.26 to 0.15.32 to Devin

Audited on 2026-10-26 on top of `main` at `28917b5` (PRs #8 and #9 merged). Plugin version is 0.7.0, with 39 public skills, 24 internal principle leaves, and 20 playbooks.

## Source and coverage

Upstream range: [`99743e9...e73df47`](https://github.com/cursor/plugins/compare/99743e9c151c8537cbbf1f98bb38f34ef3368453...e73df471cd4bd918367e99f3dd9c51bd53ddf5f0) (`pstack/`, 0.15.25 to 0.15.32 and six follow-ups). All 32 commits that touch `pstack/` were read.

| Upstream change | Devin disposition |
| --- | --- |
| [#700](https://github.com/cursor/plugins/commit/0317eb8) brand with a type guard, not `as` | Ported. The Branded types row and the `AgentId` example use an `isAgentId` guard. |
| [#692](https://github.com/cursor/plugins/commit/16541c6), [#708](https://github.com/cursor/plugins/commit/bc14437) ketchup lists every waiting item | Adapted. The story stays under 100 words, each item gets about 30 words with its link, user change, evidence, risk, and pick, and items are never cut to meet a word count. Rendered pictures stay conditional on the Devin host and the text fallback is kept. |
| [#712](https://github.com/cursor/plugins/commit/75fabac), [#729](https://github.com/cursor/plugins/commit/88d4751) sharpen returns only the rewritten prompt | Ported in its final form, the four numbered asks and a rewrite. One Devin line is added: hand back only the rewrite and do not start the task, because this plugin's always-on rule otherwise routes nontrivial work to poteto-mode. Help, recipes, README, and usage guide follow. |
| [#709](https://github.com/cursor/plugins/commit/4382e68), [#721](https://github.com/cursor/plugins/commit/6b78e9f), [#716](https://github.com/cursor/plugins/commit/7b353f7), [#724](https://github.com/cursor/plugins/commit/d457567) create and maintain formal verification skills | Adapted as explicit-user `/pstack:create-formal-verification-skill` and `/pstack:maintain-formal-verification-skill`. Generated skills go under `.devin/skills/`. The plugin bundles no verifier, so the agent confirms the tool runs with `exec`, asks before installing a toolchain, and reports a check that could not run as blocked. The TLA+ default and the generated-input fallback are kept. Maintenance stops at merge-ready. |
| [#715](https://github.com/cursor/plugins/commit/f9be7aa) formal verification in setup, help, and guide | Help state check, routing rows, and recipes ported. The setup offer is skipped: this port's `/pstack:setup-pstack` only writes the role sheet and has no verification offer step to extend. Cursor guide pages are not shipped; the usage guide gains the equivalent section. |
| [#794](https://github.com/cursor/plugins/commit/00d5dec) generated verify skills read results with `/statechart` | Skipped. `/statechart` is not shipped. Counterexamples are still told as steps in the code's words. |
| [#741](https://github.com/cursor/plugins/commit/eb4db2b), [#776](https://github.com/cursor/plugins/commit/7698375), [#779](https://github.com/cursor/plugins/commit/4ec7ffa), [#791](https://github.com/cursor/plugins/commit/076f4b2) statechart skill and Pele renderer | Skipped as uncertain. About 12,000 lines of Node scripts and tests (about 5,200 without tests) that install TLC and Java with mise (about 305 MB), render PNGs with Pele and resvg, and expect the agent to look at each PNG. Devin documents image attachments as input, not inline image output in the CLI. A separate port needs native testing first. |
| [#797](https://github.com/cursor/plugins/commit/3c0fdb4) ketchup-video | Skipped as uncertain. It needs a video renderer and inline video in the reply. Devin documents neither, and this plugin ships no renderer. |
| [#800](https://github.com/cursor/plugins/commit/7054003) reflect edits leave the plugin cache | Adapted. Reflect never edits a skill inside an installed plugin. A remote plugin is re-fetched by `devin plugins update`; a `--local` plugin is linked to its checkout. Edits go to a copy under `.devin/skills/` or `~/.config/devin/skills/`, shown before approval, with no PR or push. |
| [#702](https://github.com/cursor/plugins/commit/a968159) name every skill after its folder | Already satisfied. A contract test now enforces it, since Devin uses the folder as the skill identifier. |
| [#807](https://github.com/cursor/plugins/commit/e73df47) swarm Phase A numbering and table reference | Already satisfied. This port's swarm is numbered 1 to 4 and Phase C keeps the result table that Phase D reports. |
| [#801](https://github.com/cursor/plugins/commit/96dec8e), [#802](https://github.com/cursor/plugins/commit/fe096ef) watch-pr fork heads and deadline sleeps; [#804](https://github.com/cursor/plugins/commit/3c596e7) orch prefers the active PR | Not applicable. The Bun watch-pr and orch scripts are not shipped in this port. `worktree-audit.sh` already prefers an open PR per branch. |
| [#803](https://github.com/cursor/plugins/commit/86c2448) inline code delimiters in check-plan | Not applicable. This port's `check-plan.mjs` validates structure and has no prose lint that strips inline code. |
| [#805](https://github.com/cursor/plugins/commit/f83fbe6) GNU stat and date in worktree-audit | Not applicable. This port's `worktree-audit.sh` reads no transcript mtimes; it uses `git log --format=%ct`, which is portable. |
| [#637](https://github.com/cursor/plugins/commit/182f2ce), [#705](https://github.com/cursor/plugins/commit/1b80080), [#806](https://github.com/cursor/plugins/commit/a0b0ad9) Claude Code plugin, adapter, and auto-update note | Skipped. Claude Code only. |
| [#704](https://github.com/cursor/plugins/commit/019a6a2) docs refresh and docs-vs-tree check | Skipped. Cursor README and guide wording plus a repo script for the generated Claude Code tree. The existing link and help-table tests cover this port's docs. |
| [#710](https://github.com/cursor/plugins/commit/0b8e952), [#713](https://github.com/cursor/plugins/commit/0148b78), [#792](https://github.com/cursor/plugins/commit/642289e), [#798](https://github.com/cursor/plugins/commit/b1a1298) version bumps | Plugin bumped independently to 0.7.0. |

## Devin compatibility

| Capability | Evidence |
| --- | --- |
| Explicit-user skills and folder names | `triggers` and `name` are documented; the directory name is the identifier. [Creating skills](https://docs.devin.ai/cli/extensibility/skills/creating-skills). |
| Project and global skill paths | `.devin/skills/`, `.agents/skills/`, `.windsurf/skills/`, `~/.config/devin/skills/`. [Skills overview](https://docs.devin.ai/cli/extensibility/skills/overview). |
| Plugin update and local links | `devin plugins info`, `devin plugins update` re-fetches, and `--local` installs link to the source folder. [Plugins](https://docs.devin.ai/cli/extensibility/plugins/overview). |
| Inline images, video, Mermaid | Not documented for the CLI terminal. [CLI changelog](https://docs.devin.ai/cli/changelog/stable). Ketchup keeps its text fallback; statechart and ketchup-video are not shipped. |
| Verifier toolchains | Not provided by Devin or this plugin. The agent runs them with `exec` only after confirming they exist, and asks before installing. |

The other changes are prose and touch no Devin tool, profile, hook, or helper.

## Verification and limits

`node --test tests/*.test.mjs` passes, including new contract tests for skill folder names and this port's Devin paths, tool limits, and reflect destinations. These are static checks. Native 0.7.0 skill registration, a real TLA+ or other verifier run through the new skills, and inline rendering in Devin are untested.
