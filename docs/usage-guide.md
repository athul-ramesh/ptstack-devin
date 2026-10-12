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

Workers and review panels spend extra tokens. Choose suitable registered profiles through setup. Preserve required perspective counts; repeated profiles still run separate fresh-context passes. A trivial edit needs no playbook or worker. This port does not offer `auto` or `inherit-parent` routing.

## Understand before editing

For a noisy report, ask the agent to restate the underlying issue before sharing your theory of the cause. For an unclear cause, request evidence and hypotheses without code changes.

[`/pstack:how`](../skills/how/SKILL.md) traces mechanics. [`/pstack:why`](../skills/why/SKILL.md) finds reasons and history. [`/pstack:teach`](../skills/teach/SKILL.md) explains choices and tradeoffs in plain language. [`/pstack:recall`](../skills/recall/SKILL.md) uses this conversation, named Devin exports, and the shared record. Unavailable history stays an evidence gap.

For a captured profile, use [Trace forensics](../skills/poteto-mode/playbooks/trace-forensics.md). For a live leak, CPU spin, or glitch, use [Runtime forensics](../skills/poteto-mode/playbooks/runtime-forensics.md). Both produce diagnosis before a fix.

Use [`/pstack:ketchup`](../skills/ketchup/SKILL.md) after stepping away from this chat. It reports changes since your last message and any unresolved decisions only you can make, including older ones. It stays read-only and does not resume the work.

## Settle the design before the plan

[`/pstack:architect`](../skills/architect/SKILL.md) compares designs for changes crossing function boundaries. Add "with checkpoint" to review before implementation. If implementation needs repeated workarounds or forced casts, revisit the design.

Use the [Prototype playbook](../skills/poteto-mode/playbooks/prototype.md) to answer open questions with executable probes. UI captures require an available adapter. For a new package, write a usage tutorial first and work back to the API. [`/pstack:arena`](../skills/arena/SKILL.md) compares attempts at one brief; [`/pstack:swarm`](../skills/swarm/SKILL.md) covers independent slices or declared races.

Once the design settles, request the [Multi-phase plan playbook](../skills/poteto-mode/playbooks/multi-phase-plan.md). The plan is the deliverable; the request does not authorize implementation. Each PR unit ends in evidence. For exact migrations, state that existing behavior, including known bugs, must match.

## Prove behavior and vet numbers

Use [`/pstack:create-verification-skill`](../skills/create-verification-skill/SKILL.md) when the project has no scripted way to drive the app. Prove that harness once before relying on it. Test the actual command, flow, or stored value. A green build alone does not establish behavior.

Keep the verification skill with the project when delivery is authorized. Update it with [`/pstack:maintain-verification-skill`](../skills/maintain-verification-skill/SKILL.md) when behavior or the feature map changes. Prefer a reusable control CLI over repeated throwaway scripts. Useful commands have clear errors, rich help, machine-readable output, and dry runs for destructive operations. Repeatable seeded data and startup commands make evidence easier to reproduce.

[`/pstack:benchmark-checklist`](../skills/benchmark-checklist/SKILL.md) vets a number before reporting or acting on it. Comparisons require five interleaved runs per side, median and range, correct outputs, and proof that timed work happened. A requested ballpark can use one labeled run while retaining error and work checks. Missing evidence means inconclusive. Performance playbooks already apply this checklist.

## Deliver in this session

Request commits, pushes, or a PR explicitly. Opening a PR does not start babysitting. [`/pstack:babysit`](../skills/babysit/SKILL.md) handles checks and feedback in the current session. Merge remains with the operator.

Concurrent writers need root-provisioned, verified worktrees or directories. Branches in one checkout do not isolate writes. Worktrees share machine resources, so account for ports and build output too.

Before a bounded autonomous run, observe a successful pass, give the agent the verifier and signals needed, and ensure each stage can stop on missing evidence. Inspect transcripts and encode repeated failures before relying on repeated execution.

The [Autonomous run playbook](../skills/poteto-mode/playbooks/autonomous-run.md) uses a checkable finish condition and an iteration bound in this session. At the bound, it checkpoints for operator-started continuation. [Pause safely](../skills/poteto-mode/playbooks/pause-safely.md) leaves ordinary dirty work uncommitted and writes a resume note; [Session pickup](../skills/poteto-mode/playbooks/session-pickup.md) continues without redoing completed work. Stepping away or resuming grants no delivery authority.

Shipping, Autopilot-full, and Autopilot-stack are cut from this port. Scheduled wakeups, Cursor Projects, cloud worker isolation, Benny automations, and bot UI setup are outside this local port. Read [Delivery capability](../skills/poteto-mode/references/delivery-capability.md) for named in-session alternatives. Devin's interactive `/loop` is diff auto-review, not an agent-callable scheduler.

## Improve the environment after repeated failures

[`/pstack:correct`](../skills/correct/SKILL.md) requires at least two real occurrences of a mistake. It prefers architecture, then types, lint or CI, behavioral tests, and documentation last. Each new check must reject a historical bad form. Human review is not a substitute for enforcement.

[`/pstack:reflect`](../skills/reflect/SKILL.md) proposes skill improvements from a finished session and waits for approval before editing. [`/pstack:automate-me`](../skills/automate-me/SKILL.md) drafts a personal workflow from available history. Start with the failures you observe rather than adding skills without a task for them.

Fix a misbehaving skill in its own PR. The [Eval playbook](../skills/poteto-mode/playbooks/eval.md) tests variants on the same task without telling candidates they are being evaluated. Inspect every output and question the rubric when the verdict conflicts with evidence.

The help skill's [prompting reference](../skills/poteto-help/references/prompting.md) and [recipes](../skills/poteto-help/references/recipes.md) provide prompts and short steering messages.
