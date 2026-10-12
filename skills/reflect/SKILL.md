---
name: reflect
description: Spawn three parallel review subagents over the active transcript, surface learnings, and route each to a concrete edit on an existing skill. Use when the user says reflect.
---

# Reflect

Mine this session for durable learnings. Route them into skill edits.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md). Record a `PanelRun` before the first `run_subagent` call.

## When to use

- The user said "reflect" or "/reflect".
- A complex task (5+ tool calls) landed cleanly and the recipe is worth keeping.
- Dead ends, then a path that generalizes.
- The user corrected the approach mid-task.
- A non-trivial workflow emerged that no skill captures.

Skip trivia, off-topic chat, and work an existing skill already covered.

## 1. Evidence for this session

Devin does not expose a private per-project transcript directory this plugin can search. Do not invent a path. Do not glob home config for other sessions.

Use, in order:

1. This conversation, already in context.
2. An export path the user named. `devin --export` writes jsonl. Read that file with `read`.
3. If neither is enough, write a tight digest of this session and pass that.

`devin list --format json` names sessions in this directory. It does not return message bodies. Do not treat a session id as a transcript.

## 2. Three reviewers

Three `run_subagent` calls. Sequential when `executionMode` is sequential. Say so. Reviewers may use MCP tools for context the evidence names. They must not write files.

| Lens | Profile role | Prompt |
|---|---|---|
| Judgment | reflect judgment, divergent, synthesizer | [`references/judgment-reviewer.md`](references/judgment-reviewer.md) |
| Tooling | reflect tooling | [`references/tooling-reviewer.md`](references/tooling-reviewer.md) |
| Divergent | reflect judgment, divergent, synthesizer | [`references/divergent-reviewer.md`](references/divergent-reviewer.md) |

Fill the template with the export path or the digest.

## 3. Synthesize

One `run_subagent` on the reflect-judgment profile. [`references/synthesizer.md`](references/synthesizer.md) with each reviewer's full output inlined. It returns Accepted / Rejected / Backlog. It must not write files.

## 4. Structural check

If a lint, script, metadata flag, or runtime check would enforce an Accepted item more reliably, move it to Backlog. Read `skills/principle-encode-lessons-in-structure/SKILL.md`.

## 5. Apply

Present the full Accepted / Rejected / Backlog list and wait for explicit approval before applying edits. The user picks the subset and may redirect routing. Do not auto-apply.

Backlog items go to whatever tracker this team already uses. Only Accepted waits.

For each approved row, follow Routing:

- Trivial existing-skill edit. Parent does it.
- Substantive existing-skill edit. Follow `skills/poteto-mode/playbooks/authoring-a-skill.md`.
- `tune description: <skill path>`. Same playbook, description loop.
- `new skill via authoring-a-skill: <kebab-name>`. Same playbook. Do not invent the shape ad hoc.

## 6. Summarize

- Edits applied. Path and one line.
- New skills created. Path and one line.
- Backlog filed. Title.
- Dropped. One line per rejection plus the synthesizer reason.

## Models

`$HOME/.config/devin/pstack-models.md` overrides these defaults.

- reflect tooling: `pstack:panel-sonnet`
- reflect judgment, divergent, synthesizer: `pstack:panel-opus`
