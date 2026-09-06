### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** For work that spans phases or stacked PRs. The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. For a question about layout, timing, behavior, or whether an API works, run `playbooks/prototype.md`. Keep the branch, the SHA, and the screenshots for Appendix A. Ask the operator only about a product or preference call that no run can settle. Give options (`skills/principle-never-block-on-the-human/SKILL.md`).
3. Explore in subagents with `run_subagent` (`skills/principle-guard-the-context-window/SKILL.md`). Each returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file under `docs/` in the repo or `~/.config/devin/pstack/<slug>/docs/`. Keep every heading in the order shown. One section per PR. One PR is one change with its own evidence (`skills/principle-sequence-verifiable-units/SKILL.md`). Name Feature, Bug fix, or Refactoring as the execution playbook. Do not name shipping or autopilot. Those playbooks are cut.
5. Write short declarative sentences. Each heading states the task or the finding. No long dashes. No mid-sentence colons.
6. Hand back. Post the plan path, then stop. Execution starts on the operator's explicit go.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked (`skills/principle-prove-it-works/SKILL.md`). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. Drive the real surface with `exec` for CLIs and TUIs, and with the browser mechanism only when Devin exposes one. A surface with no control path is a risk in Appendix C, and its live block still names how each lane drives it.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. Check a box only when its evidence exists. A file, a log line, a screenshot, a test run, or a SHA.

The program runs `skills/poteto-mode/playbooks/<execution playbook>.md` from the installed plugin. The operator decides merges. Stop at merge-ready unless the operator asks to open or merge a PR.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on an explicit go.
- [ ] On that go, write this exact text into the standing orders and restate it in your todolist. "<The plan path, the PR ids in order, the verification rule, who merges, and the done condition.>"
- [ ] Read these from the installed plugin at program start. Re-read them at every tick.
  - [ ] `skills/poteto-mode/playbooks/<execution playbook>.md`
  - [ ] `<control procedure>`
  - [ ] `skills/<each shipped leaf skill the program uses>/SKILL.md`

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent is merge-ready, or base it on the parent branch when stacking.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `main`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`. Never require a stacked-PR vendor CLI.
- [ ] Stop at merge-ready unless the operator asks to open a PR.
- [ ] Run the repo's lint and typecheck once before any PR-facing push.

### Verdict, for every PR

- [ ] At the merge-ready head SHA, re-run the gates, prove the load-bearing behavior live, and audit the receipts against the diff.
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Lane 1. Regression lane against trunk. Run <the same load-bearing scenario> at trunk and head. Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <predicate>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured at both trunk and head.>
- [ ] Probe. <The command or procedure.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails.>

**Review gate.** The operator reviews before merge.

- [ ] Post evidence in chat. Stop at merge-ready.

## Close the program

- [ ] Every box above is checked with its evidence.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven.
