---
name: automate-me
description: "Use for \"automate me\", \"create/update/refresh my -mode skill\", \"turn/capture my preferences or working style into a skill\", or wanting agents to follow how the user works. Drafts or revises a personal -mode skill via authoring-a-skill and unslop, optionally pulling fresh evidence from this conversation or a named Devin export."
---

# Automate me

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (for example `jay-mode`, `priya-mode`).

This skill sequences three things. An inline mining pass (see step 1), `playbooks/authoring-a-skill.md` (authoring), and `/pstack:unslop` (prose discipline). It sequences them. It doesn't replace them.

## Flow

### 0. Check for an existing skill

Look recursively for `.devin/skills/**/*-mode/SKILL.md` and `$HOME/.config/devin/skills/*-mode/SKILL.md` matching the user's handle. Mode skills can live in a personal category directory (`.devin/skills/<handle>/`), not only at the top level. If one exists, ask in ordinary prose unless they already said "update my skill" or similar:

- Update the existing skill (default for repeat runs)
- Start fresh (rare; ask why before doing it)

Update mode changes the rest of the flow:

- Step 1 mines only history since the skill was last edited (`exec` `git log -1 --format=%cI <path>`).
- Step 2 asks what's changed or missing, not what to capture from zero.
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

Do not search `~/.claude/` or `.claude/skills/`.

### 1. Mine their history

Read [`../poteto-mode/references/evidence-source.md`](../poteto-mode/references/evidence-source.md). Session bodies are this conversation or a user-named `devin --export` jsonl. `devin list` is an index, not a transcript. Do not glob home config.

If the user named no export and this conversation is thin, say the session category is `unavailable` and ask for an export path or continue from what they tell you now.

Survey that scoped evidence for recurring patterns. When several named exports exist, one `run_subagent` per file on `pstack:panel-opus`. Sequential when `executionMode` is sequential. Say so. Each worker returns a short structured list of patterns with evidence pointers. Default signals worth hunting:

- Response preferences (length, tone, format, "dumb it down" corrections)
- Delegation habits (subagents, models, specialized workflows, parallelism)
- Verification posture (what "done" means; unit tests vs live repro; reviewers)
- Code and prose discipline (style, principles cited, lint/format tools)
- Process conventions (worktrees, commits, PRs, review/merge tooling)
- Meta preferences (fixing skills mid-task, proposing new ones)

Cross-check across slices before elevating a signal. Patterns seen in 2+ slices are high-confidence. Lone signals are weak and usually get dropped.

### 2. Ask the user directly

Mining misses intent that hasn't come up yet. Ask in ordinary prose. One or two questions with 4-6 options each, multiple choice allowed. Start broad ("Which areas matter most?"), then follow up on selected areas. After those rounds, one free-form question catches anything the options missed.

Don't dump 20 questions. Two structured rounds plus one open question is usually enough.

### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

- **Response style.** Length, tone, format.
- **Autonomy.** How much to do without asking.
- **Understand first.** Which skills to reach for when scoping or investigating a change.
- **Subagents.** Default, parallelism, model-to-task, specialized workflows.
- **Prose / code discipline.** Principles, lint tools, style guides.
- **Review and verify.** Repro posture, verification skills, live-testing tools.
- **Process.** Git worktrees, commits, PRs, review/merge tooling.
- **Skills.** Skill-authoring habits, fix-the-skill-first, proposing new skills.

`skills/poteto-mode/SKILL.md` shows the shape. Read it for granularity. Don't copy its content. The user's rules are not the same as poteto-mode's.

### 4. Draft the skill

Follow `skills/poteto-mode/playbooks/authoring-a-skill.md`. Placement:

- Path. Preserve an existing mode skill's category. For a new mode, use `.devin/skills/<handle>/<handle>-mode/SKILL.md` when the repo has an established personal category for that handle. Otherwise default to `.devin/skills/<handle>-mode/SKILL.md` in the project. Use `$HOME/.config/devin/skills/<handle>-mode/` only when the user prefers a personal skill outside the repo.
- Handle. The user's first name or chosen identifier.
- Frontmatter `description`. Trigger on their name + `/<handle>-mode` + "work in their style", not on generic keywords like "write code" or "review PR".
- Frontmatter. Documented Devin fields only. `name` and `description`. Tool names are `read`, `edit`, `grep`, `glob`, `exec`, `skill`, and `run_subagent`. Do not add undocumented keys.

### 5. Iterate on prose

Apply `/pstack:unslop` to every line.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

### 6. Land it

Stop at merge-ready. Commit and open a PR only when the user asks. Don't push to main.

## Guardrails

- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple instances before codifying it.
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts.
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name. Others may read or adopt the skill.
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely. Sparse is fine. Bloated is not.

## Evaluation

A `-mode` skill is subjective output. A test/iterate benchmark loop isn't useful here. Vibe-check with the user. Does it read like them? Did it miss anything? Then stop.

## When not to use

- User wants a task-specific skill (not working conventions). Use `playbooks/authoring-a-skill.md` alone. No mining required.
- User wants to capture one narrow workflow (for example "how I write commit messages"). That's a regular skill, not a mode skill.

## Reference files

- `skills/poteto-mode/SKILL.md`. Example of the output shape.
- `/pstack:unslop`. Prose discipline for every line.
- `skills/poteto-mode/playbooks/authoring-a-skill.md`. Skill authoring process.
