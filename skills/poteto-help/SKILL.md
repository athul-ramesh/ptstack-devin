---
name: poteto-help
description: Guides users through pstack setup, /pstack:poteto-mode, and picking the skill, playbook, or principle for a task. Use for /pstack:poteto-help with a question.
triggers:
  - user
---

# Poteto help

Answer the user's question about pstack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a pstack run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use pstack to fix this bug", is not a help question. Read [`poteto-mode`](../poteto-mode/SKILL.md) and do the work under it.

This file maps questions to the skills and guide pages that hold the answers. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map. The links here point into the installed plugin, which the user may not be able to open, so give the user the file's public copy: `https://github.com/athul-ramesh/ptstack-devin/blob/main/` followed by its path.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `/pstack:poteto-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make pstack my own

Check the state that changes the answer, and mention it only when it does:

- No `$HOME/.config/devin/pstack-models.md` means each role uses its skill's default profile unless another explicit configuration applies.
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `/pstack:create-verification-skill` when the question is about proving a change works.
- No formal verification skill in the project means no property is checked past what tests reach. Mention `/pstack:create-formal-verification-skill` when the question is about a race, an invariant, or another case tests rarely hit. When one exists and the code it covers changed after the commit it records as last in sync, mention `/pstack:maintain-formal-verification-skill` if the question touches that code.

## Get set up

1. Install from the plugin checkout with `devin plugins install --local -y .`, then start a new session. This port targets local Devin CLI; cloud sessions do not load its plugin agents or SessionStart hook.
2. Run [`/pstack:setup-pstack`](../setup-pstack/SKILL.md). It reads `devin models list`, preserves existing role choices and notes, and writes `$HOME/.config/devin/pstack-models.md`. Start a new session afterward.
3. Start a real task with `/pstack:poteto-mode`, a goal, and a check that can pass or fail.

The plugin's always-on rule and SessionStart hook route nontrivial engineering work through poteto-mode. Help questions stay answers. See the [README](../../README.md) and [usage guide](../../docs/usage-guide.md). Read [`references/prompting.md`](references/prompting.md) before helping word a first prompt.

If cost is the worry, explain that workers and review panels spend extra tokens. `/pstack:setup-pstack` changes role routing, not model pins or reasoning budgets. Choose from registered profiles and retain required perspective counts. Repeated profiles still run separate fresh-context passes. A profile's `model:` pin is authoritative; its suffix is an alias. This port does not support `auto` or `inherit-parent` routing. Obvious small edits need no workers or playbook.

## Start a task with `/pstack:poteto-mode`

`/pstack:poteto-mode` matches the task to a playbook, tracks the playbook's outcomes and checks in a compact checklist, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one. [The usage guide](../../docs/usage-guide.md) has examples.

Devin has no native sticky mode for this plugin. The always-on rule and SessionStart hook provide default routing. If that routing is missed, invoke `/pstack:poteto-mode` explicitly. Say "new task" when the subject changes, or say the turn does not need the mode. Scoped workers follow their briefs and do not reload the root mode or dispatch more workers. Read [poteto-mode](../poteto-mode/SKILL.md) before explaining worker profiles.

## Pick a skill

The default answer is `/pstack:poteto-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/pstack:poteto-mode`](../poteto-mode/SKILL.md) |
| Check that the agent understood the goals and the problem | [`/pstack:in-your-own-words`](../in-your-own-words/SKILL.md) |
| Get a prompt rewritten deeper, not bigger, before sending it: what a top professional would add, their raw material and methods, and an outside check. It returns the prompt and doesn't do the task | [`/pstack:sharpen`](../sharpen/SKILL.md) |
| Know how code works now, or where new code should live | [`/pstack:how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/pstack:why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/pstack:teach`](../teach/SKILL.md) |
| Catch up on changes since their last message, in plain words and small available visuals, with every item waiting on them listed and decidable from the reply alone | [`/pstack:ketchup`](../ketchup/SKILL.md) |
| Catch up on their own recent work on a topic | [`/pstack:recall`](../recall/SKILL.md) |
| Know what a small diff could break outside itself | [`/pstack:blast-radius`](../blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`/pstack:architect`](../architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`/pstack:arena`](../arena/SKILL.md) |
| Run parallel checks over slices, or race workers, with local isolated workspaces | [`/pstack:swarm`](../swarm/SKILL.md) |
| Have several models try to break a diff, keeping only findings a run proves | [`/pstack:interrogate`](../interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`/pstack:tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/pstack:typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/pstack:no-comments`](../no-comments/SKILL.md) |
| Clean AI tells out of prose | [`/pstack:unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/pstack:technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/pstack:bro`](../bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/pstack:create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/pstack:maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Formally verify a race, invariant, or other property that tests rarely reach | [`/pstack:create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| Bring a formal verification back in line after the code it covers changed, and learn whether a failure is drift or a bug | [`/pstack:maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/pstack:benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`/pstack:figure-it-out`](../figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`/pstack:show-me-your-work`](../show-me-your-work/SKILL.md) |
| Configure registered profiles for each role | [`/pstack:setup-pstack`](../setup-pstack/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/pstack:automate-me`](../automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/pstack:reflect`](../reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/pstack:correct`](../correct/SKILL.md) |
| Clean AI-generated code style | [`/pstack:deslop`](../deslop/SKILL.md) |
| Get CI failures green | [`/pstack:fix-ci`](../fix-ci/SKILL.md) |
| Resolve demonstrated merge conflicts | [`/pstack:fix-merge-conflicts`](../fix-merge-conflicts/SKILL.md) |
| Read PR feedback | [`/pstack:get-pr-comments`](../get-pr-comments/SKILL.md) |
| Make a PR easier to review | [`/pstack:make-pr-easy-to-review`](../make-pr-easy-to-review/SKILL.md) |
| Summarize authored commits | [`/pstack:what-did-i-get-done`](../what-did-i-get-done/SKILL.md) |
| Drive PR checks and feedback in this session | [`/pstack:babysit`](../babysit/SKILL.md) |
| Review code quality closely | [`/pstack:thermo-nuclear-code-quality-review`](../thermo-nuclear-code-quality-review/SKILL.md) |
| Find their way around pstack | `/pstack:poteto-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `/pstack:how` explains what the code does. `/pstack:why` explains the reasons. `/pstack:teach` runs one or both and explains the result plainly.
- `/pstack:arena` gives every worker the same brief and merges the best parts. `/pstack:swarm` splits work into slices or a race and returns one report.
- `/pstack:architect` implements right after it settles the design. Add "with checkpoint" to review the design before it writes code.
- `/pstack:interrogate` reviews the diff. `/pstack:blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/pstack:recall` rebuilds context from this conversation, named exports, and the shared record. Unavailable history remains a gap. Resuming one specific chat or branch is the Session pickup playbook.
- `/pstack:figure-it-out` designs one rigorous run. The Orchestrate playbook runs a program that spans days and many PRs. The Autonomous run playbook drives one task to a finish condition.

Port boundaries:

- This port includes `/pstack:deslop` and the other Devin companion skills listed above. Do not send users to Cursor's team-kit plugin.
- `control-cli`, `control-ui`, `/create-skill`, and `/make-bot-ui` are not shipped here. Use the skill-authoring playbook for skill work. Detect an available UI or CLI adapter before promising visual proof.
- Devin's `/loop <prompt>` is an interactive command that auto-reviews a diff. It is not an agent-callable timer or unattended scheduler.
- Orchestrate is a `/pstack:poteto-mode` playbook, not a public `/orchestrate` skill.
- Upstream `/statechart` and `/ketchup-video` are not shipped here. They need a TLA+ toolchain with a chart renderer, or a video renderer, and Devin documents no inline image or video output in the CLI. Formal verification skills bundle no verifier; the agent confirms the tool runs on this machine and asks before installing one.

## Playbooks and principles

Playbooks are step lists inside `/pstack:poteto-mode`, not skills, so they have no slash command. Inside `/pstack:poteto-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. Merge remains with the operator.
- "land the stack" asks for Shipping, which is cut from this port. Read [Delivery capability](../poteto-mode/references/delivery-capability.md) and explain the bounded in-session alternative.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "full autopilot on this queue" and "stack them, don't ship" name cut workflows. Read [Delivery capability](../poteto-mode/references/delivery-capability.md). Do not promise later wakeups or substitute an unnamed route.
- "run the eval playbook" runs Eval.

Inside poteto-mode, use its Babysit playbook. The standalone `/pstack:babysit` is also shipped. The Playbooks section of [`poteto-mode`](../poteto-mode/SKILL.md) lists every playbook and when it applies. The [usage guide](../../docs/usage-guide.md) covers verification and delivery. Opening a PR requires a delivery request and does not start babysitting.

pstack has no public planning skill. For work that spans phases or stacked PRs, asking `/pstack:poteto-mode` for a plan runs the [Multi-phase plan playbook](../poteto-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `/pstack:architect` settles it in code first.

Principles are one-rule skills that `/pstack:poteto-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Principle leaves are model-triggered internal references, not public slash commands. [Principle selection](../poteto-mode/references/principles.md) lists them. Cite only leaves read in this session.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| Default engineering routing was missed | Invoke `/pstack:poteto-mode` explicitly. Inspect the installed plugin Source and SessionStart routing; do not claim native sticky behavior. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | Start a new session after setup. Check the role sheet, registered profiles, and actual frontmatter pins; setup does not change pins. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Check its frontmatter and plugin source. `/pstack:poteto-help` and other explicit-user skills require user activation; poteto-mode does not invoke every skill. |
| Parallel agents overwrote each other | Give each writer a root-provisioned, verified worktree or directory. Separate branches in one checkout are not isolation. |
| A long run moved but finished nothing | Give a predicate and bounded iterations. The Autonomous run playbook checkpoints in this session; no scheduled wakeup is shipped. |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. [The usage guide](../../docs/usage-guide.md) has more pitfalls and the recipes worth copying.

## Make pstack my own

- [`/pstack:automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/pstack:poteto-mode`.
- [`/pstack:reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/pstack:poteto-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

[The usage guide](../../docs/usage-guide.md) covers each of these.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
