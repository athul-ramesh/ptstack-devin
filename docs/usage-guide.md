# Use pstack in Devin CLI

Ask `/pstack:poteto-help` with a setup or workflow question. It answers, suggests one prompt, and links the source without starting the task. See the [skill map](../skills/poteto-help/SKILL.md) for individual skills.

## Start with a goal and a check

Install from the plugin checkout with `devin plugins install --local -y .`, then start a new session. Run [`/pstack:setup-pstack`](../skills/setup-pstack/SKILL.md) to configure registered profiles per role. It preserves existing choices and notes. Profile model pins remain authoritative; setup does not change them or reasoning budgets.

The always-on rule and SessionStart hook route nontrivial engineering work through poteto-mode. Devin has no native sticky mode for this plugin. Invoke `/pstack:poteto-mode` explicitly if routing is missed.

State the goal, a check that can pass or fail, the proof you want, known evidence, and real constraints:

```text
/pstack:poteto-mode add a --json flag to this command. text output stays byte-identical. verify both and show the actual output.
```

The playbook supplies the steps. A list of skills can override that order, so name a skill only when you want to change a default. Short follow-ups work when the conversation already holds the task. Say "new task" when changing subjects.

Workers and review panels spend extra tokens. Choose suitable registered profiles through setup. Preserve required perspective counts; repeated profiles still run separate fresh-context passes. A trivial edit needs no playbook or worker. This port does not offer `auto` or `inherit-parent` routing. The first line of a `run_subagent` task points at [worker.md](../skills/poteto-mode/worker.md). Child follow-through is locally observed on Devin CLI (Tier 2: WORKER_MD_OK, agent 8e71b7f6). Devin docs still do not document a kickoff file as a platform feature.

## Understand before editing

For a noisy report, ask the agent to restate the underlying issue before sharing your theory of the cause. For an unclear cause, request evidence and hypotheses without code changes.

[`/pstack:how`](../skills/how/SKILL.md) is one read-only explanation of how code works. During a change, poteto-mode traces the code itself. [`/pstack:why`](../skills/why/SKILL.md) cites the commits and PR discussion. [`/pstack:teach`](../skills/teach/SKILL.md) explains choices and tradeoffs in plain language. [`/pstack:recall`](../skills/recall/SKILL.md) uses this conversation, named Devin exports, and one investigator per git or `gh` source. Unavailable history stays an evidence gap.

For a captured profile, use [Trace forensics](../skills/poteto-mode/playbooks/trace-forensics.md). For a live leak, CPU spin, or glitch, use [Runtime forensics](../skills/poteto-mode/playbooks/runtime-forensics.md). Both produce diagnosis before a fix.

To understand a bug, or to explain it before a fix, run [`/pstack:understand-bug`](../skills/understand-bug/SKILL.md). It reproduces the defect, draws the failing path and the proposed path, and waits for approval before the Bug fix playbook.

Use [`/pstack:ketchup`](../skills/ketchup/SKILL.md) after stepping away from this chat. It reports changes since your last message and any unresolved decisions only you can make, including older ones. It stays read-only and does not resume the work.

## Settle the design before the plan

[`/pstack:architect`](../skills/architect/SKILL.md) traces every system the change touches, sketches two shapes, and picks the one with one owner per piece of state. A large or contested design runs [`/pstack:arena`](../skills/arena/SKILL.md) instead of sketching alone. If the same workaround keeps coming back, redesign instead of patching.

Use the [Prototype playbook](../skills/poteto-mode/playbooks/prototype.md) to answer open questions with executable probes. UI captures require an available adapter. For a new package, write a usage tutorial first and work back to the API. [`/pstack:arena`](../skills/arena/SKILL.md) compares attempts at one brief; [`/pstack:swarm`](../skills/swarm/SKILL.md) covers independent slices or declared races.

Once the design settles, request the [Multi-phase plan playbook](../skills/poteto-mode/playbooks/multi-phase-plan.md). The plan is the deliverable; the request does not authorize implementation. It is five steps, with one checkbox section per PR, and it does not run a plan checker. Execution starts when you say go. For exact migrations, state that existing behavior, including known bugs, must match.

## Prove behavior and vet numbers

Use [`/pstack:create-verification-skill`](../skills/create-verification-skill/SKILL.md) when the project has no scripted way to drive the app. Prove that harness once before relying on it. Test the actual command, flow, or stored value. A green build alone does not establish behavior.

Keep the verification skill with the project when delivery is authorized. Update it with [`/pstack:maintain-verification-skill`](../skills/maintain-verification-skill/SKILL.md) when behavior or the feature map changes. Prefer a reusable control CLI over repeated throwaway scripts. Useful commands have clear errors, rich help, machine-readable output, and dry runs for destructive operations. Repeatable seeded data and startup commands make evidence easier to reproduce.

[`/pstack:benchmark-checklist`](../skills/benchmark-checklist/SKILL.md) vets a number before reporting or acting on it. Comparisons require five interleaved runs per side, median and range, correct outputs, and proof that timed work happened. A requested ballpark can use one labeled run while retaining error and work checks. Missing evidence means inconclusive. Performance playbooks already apply this checklist.

Some bugs live on paths nobody drives: two retries that overlap, a lock that expires mid-write, a state change that arrives out of order. For code where such a bug is costly, use [`/pstack:create-formal-verification-skill`](../skills/create-formal-verification-skill/SKILL.md). The question picks the tool. TLA+ is the default for whether events can happen in a bad order. A verifier that runs on the code suits whether the code behaves for every input. When no verifier runs on the language, the agent says so and tests the real code with generated inputs. The plugin bundles no verifier, so the agent confirms the tool runs on this machine and asks before installing it. The check must fail on a broken variant, a finding stays a finding, and the generated skill under `.devin/skills/` records the covered code and the commit it last matched. After merges or refactors that skipped that skill, run [`/pstack:maintain-formal-verification-skill`](../skills/maintain-formal-verification-skill/SKILL.md). It updates the verification from the code, reruns it, and says whether each failure is drift or a bug.

## Deliver in this session

Request commits, pushes, or a PR explicitly. Opening a PR does not start babysitting. [`/pstack:babysit`](../skills/babysit/SKILL.md) handles checks and feedback in the current session through the bundled `watch-pr` watcher (Bun plus `gh` fallback). Merge remains with the operator.

[`/pstack:control-ui`](../skills/control-ui/SKILL.md) and [`/pstack:control-cli`](../skills/control-cli/SKILL.md) are the default harness recipes when the project has no verify skill yet.

Concurrent writers need root-provisioned, verified worktrees or directories. Branches in one checkout do not isolate writes. Worktrees share machine resources, so account for ports and build output too.

Before a bounded autonomous run, observe a successful pass, give the agent the verifier and signals needed, and ensure each stage can stop on missing evidence. Inspect transcripts and encode repeated failures before relying on repeated execution.

The [Autonomous run playbook](../skills/poteto-mode/playbooks/autonomous-run.md) uses a checkable finish condition and an iteration bound in this session. At the bound, it checkpoints for operator-started continuation. [Pause safely](../skills/poteto-mode/playbooks/pause-safely.md) leaves ordinary dirty work uncommitted and writes a resume note; [Session pickup](../skills/poteto-mode/playbooks/session-pickup.md) continues without redoing completed work. Stepping away or resuming grants no delivery authority.

Shipping, Autopilot-full, and Autopilot-stack are cut from this port. Scheduled wakeups, Cursor Projects, cloud worker isolation, Benny automations, and bot UI setup are outside this local port. Read [Delivery capability](../skills/poteto-mode/references/delivery-capability.md) for named in-session alternatives. Devin's interactive `/loop` is diff auto-review, not an agent-callable scheduler.

## Improve the environment after repeated failures

[`/pstack:correct`](../skills/correct/SKILL.md) requires at least two real occurrences of a mistake. It prefers architecture, then types, lint or CI, behavioral tests, and documentation last. Each new check must reject a historical bad form. Human review is not a substitute for enforcement.

[`/pstack:reflect`](../skills/reflect/SKILL.md) reads the transcript itself, keeps only lessons that would change a future agent's work, and waits for approval before editing. [`/pstack:automate-me`](../skills/automate-me/SKILL.md) drafts a personal workflow from available history. Start with the failures you observe rather than adding skills without a task for them.

Fix a misbehaving skill in its own PR. The [Eval playbook](../skills/poteto-mode/playbooks/eval.md) tests variants on the same task without telling candidates they are being evaluated. Inspect every output and question the rubric when the verdict conflicts with evidence.

The help skill's [prompting reference](../skills/poteto-help/references/prompting.md) and [recipes](../skills/poteto-help/references/recipes.md) provide prompts and short steering messages.

## Play back the goal and catch up

Use `/pstack:in-your-own-words` to hear the goals and problem the agent understood. This explicit-user skill restates them without starting a workflow or adding a confirmation gate.

Use `/pstack:sharpen <the prompt you're about to send>` when you are unsure a prompt is aimed right. It hands back the prompt rewritten deeper, not bigger, with an outside check. The rewrite asks the agent to prototype a choice an experiment can settle and recommend from what it observed. Product and preference choices stay with you. It does not do the task. Send the rewrite yourself.

Use `/pstack:reframe` on your own description and files when you can't name what you're after:

```text
/pstack:reframe the settings page saves some fields right away and others only on submit, and people lose edits.
```

If the description could name more than one problem, the agent lists the two or three it could be, with the term that names each and the sign that tells them apart, then teaches the words for the most likely one and says why. It gives 8 to 12 expert terms, ranked by how much each would change what you build. Each term comes with the part of your description it names, a real project that uses it, with the link checked, and what it lets you ask an agent for. It also borrows terms from 2 or 3 neighboring fields that solved the same problem under other names, and says where each analogy breaks. Then it rewrites your description with the new words. It does not do the task. Send the rewrite, or run `/pstack:sharpen` on it.

Use `/pstack:ketchup` to catch up since your previous message. The story stays under 100 words. Every call waiting on you gets its own bullet with its link, what it changes, the evidence, the risk, and a pick, including older unresolved decisions, so a large batch makes a long reply instead of a cut list. Existing captures and available diagrams show status and before/after options. When the Devin host cannot render them, compact text includes the same facts and unknowns. The skill does not start an app, install a renderer, or post anything to produce a visual.

Verification skills must launch a usable app from an empty data directory. Include migrations and seed data. Missing journey preconditions are failed checks, not a reason to weaken the journey. Proof from a stand-in must identify target setup steps it has not exercised.

## Statecharts

Invoke [`/pstack:statechart`](../skills/statechart/SKILL.md) to check a TLA+ model and show the paths that break its rules. The skill returns Mermaid text, a report, and SVG output through Pele. Paste the complete Mermaid code block into Obsidian, or embed the SVG to preserve Pele styling. Native Devin CLI inline rendering is untested.

The checker needs a supported TypeScript runtime, TLC, and Java. It can use an existing TLC jar through `TLA2TOOLS`, or install TLC and Java through mise after authorization. Renderer installation also requires authorization. See the [statechart port audit](statechart-port-audit.md) for source and verification limits.
