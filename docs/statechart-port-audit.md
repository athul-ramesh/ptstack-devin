# Statechart port to Devin CLI

Release 0.9.0 ports `pstack/skills/statechart` from [cursor/plugins at c742dd6](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/statechart). The scripts and regression corpus are copied unchanged. This supersedes the statechart exclusions in the 0.15.32 and 0.15.35 audits.

## Design

Keep the upstream compiler and Pele SVG instructions. Adapt skill activation to Devin's `triggers: user`, resolve the installed skill path, and run commands in the foreground. Check prerequisites before the helper can install TLC and Java through mise. Existing installations can use `TLA2TOOLS` and `JAVA`.

The alternative was a text-only checker without the renderer. Keeping SVG generation preserves the chart for external viewers without depending on terminal rendering. The reply includes complete Mermaid text for Obsidian and SVG file paths. Obsidian's Mermaid rendering may differ from Pele styling. Embed the SVG when appearance matters.

The toolchain and renderer are not bundled. Rendering failure does not change a model-checking result. The skill still requires replaying bug paths against the real code before treating them as code defects.

## Verification

- `node --test tests/*.test.mjs`: 53 passed, including user activation and relative links. The link walker excludes installed `node_modules` from shipped Markdown checks.
- `TLA2TOOLS=/workspace/scratch/tla2tools.jar npm test --prefix skills/statechart/scripts`: 367 tests, 362 passed and five container shutdown failures. No skips. Real TLC comparisons, Mermaid parsing, and Pele rendering passed. All five failures passed unchanged in the subreaper reruns described below.
- The executable launcher ran the CounterJump model against real TLC. The report found `NotThree` breaking after one `Jump`, with `NoDeadlock` holding. Pele 1.9.0 rendered its chart to a 6,332-byte SVG.

Node 24.19.0 and Java 21 were used. The runtime scripts and fixtures match upstream byte for byte. A local `.gitignore` excludes test dependencies.

The first full run exposed five shutdown-test failures because container PID 1 left killed descendants as zombies. All ten SIGKILL, SIGINT, and SIGTERM tests, plus the view-triggered shutdown test, passed unchanged under a Linux child subreaper. No checker code was changed for this environment.

Native Devin skill registration and invocation, inline CLI rendering, and Obsidian UI rendering are untested. This environment has no Devin CLI. Automatic mise installation is untested; checks use the pinned TLC 1.7.4 jar through `TLA2TOOLS` and Java 21. The jar's SHA-256 matches the upstream pin. The port remains local Devin CLI only.
