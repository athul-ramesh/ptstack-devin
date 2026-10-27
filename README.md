# pstack for Devin CLI

Local Devin CLI plugin. It does not load in cloud Devin sessions.

Install from this directory, then start a new session:

```
devin plugins install --local -y .
```

Public skills are `/pstack:<name>`. Principle leaves are model-triggered only. SessionStart injects a route to `/pstack:poteto-mode` on local Devin CLI.

`/pstack:setup-pstack` preserves configured roles and notes in `$HOME/.config/devin/pstack-models.md`, populating missing roles from `aliases:` lines in `devin models list`. Poteto keeps dispatch at root and resolves code-writing passes through the deterministic same-pin counterpart `pstack:panel-<alias>` → `pstack:poteto-agent-<alias>`. Background workers require already-approved permissions and return results through completion notifications; every dispatch records the returned identity, configured profile pin, and assigned workspace, is collected with `read_subagent` by agent id, and is inspected by the root before the parent verdict. Concurrent writers get a root-provisioned, verified worktree or directory, never two writers in one checkout.

`shipping`, `autopilot-full`, and `autopilot-stack` are cut from this port. An explicit request for one gets that capability verdict and the bounded in-session alternative, not a silent fallback to figure-it-out. Merge stays with the operator. This plugin has no agent-callable scheduled wakeup. `/loop <prompt>` is an interactive command that runs a prompt then auto-reviews the diff in a loop, not a time-based scheduler.

Pause and resume do not create delivery authority. An ordinary pause records each worker's identity, profile, workspace, and state in a `resume.md` a cold-start session can read back.

Shipped behavior is in [`docs/release-notes.md`](docs/release-notes.md).

The 0.2.0 release was verified against Devin CLI 3000.11.3 (9c803229faa4), local CLI on macOS. Historical native observations are in [port verification](docs/port-verification.md). Native activation of 0.5.0 remains untested. See the latest port audit for evidence limits.

Avoid installing two copies with the same plugin name. Devin may source-qualify inventory names while loading skills from an older copy; verify the path returned by the skill tool.

## Using 0.8.0

Ask `/pstack:poteto-help` with a setup or workflow question. This explicit-user skill answers with one suggested prompt and a source link. It does not start a task for a help question. A request to do work follows poteto-mode instead.

Invoke [`/pstack:ketchup`](skills/ketchup/SKILL.md) to catch up on this chat since your last message. It is explicit-user and read-only. It keeps the story short, then lists every call waiting on you, each with its link, what it changes, the evidence, the risk, and a pick, so you can decide from the reply alone. A large batch makes a long reply rather than a cut list. Small visuals appear only when the host renders them; the CLI uses compact text otherwise.

The [usage guide](docs/usage-guide.md) covers prompting, investigation, prototypes before plans, real behavior verification, benchmark evidence, repeated-mistake enforcement, and bounded in-session delivery. The help skill includes [prompting guidance](skills/poteto-help/references/prompting.md) and [copyable recipes](skills/poteto-help/references/recipes.md).

Invoke [`/pstack:sharpen`](skills/sharpen/SKILL.md) on a prompt before you send it. The agent says what a top professional would add, the raw material and methods they would use, and an outside check, then hands back the rewritten prompt with your choices left open. It does not do the task. It runs only when requested.

Invoke [`/pstack:create-formal-verification-skill`](skills/create-formal-verification-skill/SKILL.md) when tests cannot reach the case that breaks a race, retry, state machine, parser, or unsafe code. It verifies one property with a tool that fits and runs on your machine, shows the check failing on a broken variant, and writes a project skill under `.devin/skills/` to recheck it. [`/pstack:maintain-formal-verification-skill`](skills/maintain-formal-verification-skill/SKILL.md) brings that verification back in line after the covered code changes. This plugin bundles no verifier; the agent asks before installing one.

Invoke [`/pstack:in-your-own-words`](skills/in-your-own-words/SKILL.md) to hear the goals and problem the agent understood. It runs only when requested and adds no confirmation gate.

Release 0.8.0 selectively ports upstream pstack 0.15.33 through 0.15.35 to `ab1f702`; see the [0.15.35 port audit](docs/pstack-0.15.35-port-audit.md). Release 0.7.0 selectively ported upstream pstack 0.15.26 through 0.15.32 and follow-ups to `e73df47`; see the [0.15.32 port audit](docs/pstack-0.15.32-port-audit.md). Release 0.6.1 selectively ported upstream pstack 0.15.25; see the [0.15.25 port audit](docs/pstack-0.15.25-port-audit.md). Release 0.6.0 selectively ported upstream pstack 0.15.24; see the [0.15.24 port audit](docs/pstack-0.15.24-port-audit.md). The prior release selectively ported upstream pstack 0.15.23. It adds goal playback, shorter ketchup replies, usable-state verification, a cheap observability proposal after deep debugging, robust Markdown fence checks, and configurable worktree merge bases. Devin dispatch, profile pins, and delivery authority are preserved. See the [port audit](docs/pstack-0.15.23-port-audit.md) for source coverage, exclusions, and evidence limits. Earlier audits cover [0.15.17](docs/pstack-0.15.17-port-audit.md) and [0.15.13](docs/pstack-0.15.13-port-audit.md).

## Features retained from 0.2.0

- Invoke `/pstack:correct` when the same repository mistake keeps recurring. It looks for at least two occurrences and favors structural enforcement, with proof that the check rejects a historical bad form.
- Invoke `/pstack:benchmark-checklist` before trusting a measured speedup or regression. Comparisons require at least five interleaved runs per side, median and range, correct outputs, and proof that the timed work happened. A requested ballpark permits one labeled run with errors and actual work still checked.
- Run `/pstack:setup-pstack` without losing your configured role lists or notes. Explicit role changes use repeatable `--role "role=profile[,profile...]"` arguments to its installed `write-models.mjs` helper. Repeated profiles remain separate fresh-context perspectives.
- Existing performance workflows now use the measurement checklist and try avoiding work before optimizing its cost. Follow-ups after a completed worker use a fresh context; permission repair retains the same worker.
- Multi-phase plans must pass the installed `check-plan.mjs` helper. Verification records the exact code-ready SHA and two independent audit focuses. CLI evidence can be a transcript; screenshots require a UI adapter.
- Decision logs retain their history and identify separate runs. PR descriptions now include both What changed and Scope, with deliberate exclusions stated explicitly.

Profile pins and merge authority are unchanged. Native verification confirmed routing, both new slash commands, foreground workers, separate sequential passes, and background collection. Narrowly approved background permissions and same-worker permission repair remain untested.

## Checks

Structural contract checks:

```
node --test tests/*.test.mjs
```

They cover relative reference resolution, the principle catalog, registered profile mapping and same-pin comparison, explicit cut-workflow routing, writer workspace provisioning, and the documented `run_subagent` fields. They are static checks, not native Devin execution.
