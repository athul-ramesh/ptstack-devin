# Port pstack 0.15.46 to Devin (statechart only)

Audited on 2026-11-22 on branch `port/pstack-0.15.46-statechart-wt` (base `77050f17`, plugin 0.12.1). Selective port of upstream pstack 0.15.44–0.15.46; only statechart #1292 lands.

## Source commits

| Commit | PR | Topic |
| --- | --- | --- |
| `e58dd043` | [#1283](https://github.com/cursor/plugins/pull/1283) | Gemini Neon panel seat |
| `dd24b670` | [#1284](https://github.com/cursor/plugins/pull/1284) | Neon pin follow-up |
| `0b46ec39` | [#1292](https://github.com/cursor/plugins/pull/1292) | Statechart Windows / CRLF / janitor |

## Disposition

| Upstream change | Devin disposition |
| --- | --- |
| `kill.ts`, `janitor.ts`, CRLF `splitLines`, JVM UTF-8 encodings, `windowsHide`, Node janitor | **Adapted.** Matches upstream #1292 under `skills/statechart/scripts/`. Devin `SKILL.md` keeps `triggers: user`, skill-dir resolution, `exec`, mise ask-before-install, and Mermaid/Obsidian notes; adds the upstream native-Windows Node invocation sentence. |
| Windows CRLF tests in `cli.test.ts` and `messages.test.ts` | **Adapted.** |
| Neon / `gemini-4-neon-*` panel pins (#1283, #1284) | **Skipped.** This plugin has no Gemini panel seat. Shipped pins stay `gpt-6-1-sol-medium`, `glm-5-3-flash-high`, `swe`, and `gpt-6-1-terra-medium`. `devin models` may list `gemini-4-neon-*`; inventing a new Neon seat is out of scope for this selective port. |

## Checks

Measured on 2026-11-22 in the port worktree without installing TLC:

- `node --test test/messages.test.ts` under `skills/statechart/scripts`: 8 passed, including the new Windows CRLF case.
- `node --test test/cli.test.ts`: 158 passed, 1 failed. The failure is `the launcher reached through an absolute and a relative symlink writes the committed chart on this Node` (`undefined !== ''`). The same failure reproduces on clean `origin/main` at `77050f1`, so it is not from this port. New Windows corpus cases passed.
- `node --test tests/*.test.mjs`: 54 passed. `tests/port-contracts.test.mjs` expects plugin version `0.12.1`.
- `git diff --check` passes.

Native Devin activation of 0.12.1 is untested.