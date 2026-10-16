### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box and the operator audits from the evidence.** For work that spans phases or stacked PRs. The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. For a question about layout, timing, behavior, or whether an API works, run `playbooks/prototype.md`. Keep the branch, the SHA, and artifacts appropriate to the actual surface for Appendix A. CLI evidence may be a transcript or structured result; screenshots require an available UI adapter. Ask the operator only about a product or preference call that no run can settle. Give options (`skills/principle-never-block-on-the-human/SKILL.md`).
3. Explore in subagents with `run_subagent` (`skills/principle-guard-the-context-window/SKILL.md`). Each returns file pointers, conventions, test commands, and entry points. No inlined dumps.
4. Copy the skeleton below into the plan file and fill every placeholder. Unless the operator names a path, write the file under `docs/` in the repo or `~/.config/devin/pstack/<slug>/docs/`. Keep every heading in the order shown. One section per PR. One PR is one change with its own evidence (`skills/principle-sequence-verifiable-units/SKILL.md`). Name Feature, Bug fix, or Refactoring as the execution playbook. Do not name shipping or autopilot. Those playbooks are cut.
5. Write short declarative sentences. Each heading states the task or the finding. No long dashes. No mid-sentence colons.
6. Validate the completed plan with `node <installed-plugin-root>/skills/poteto-mode/scripts/check-plan.mjs <plan.md>`. Resolve the installed root from the loaded skill path, not the consuming repository. Fix every line-specific diagnostic and rerun until exit 0. This checks structure, not execution evidence.
7. Hand back. Post the plan path, then stop. Execution starts on the operator's explicit go.

**Verification.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked (`skills/principle-prove-it-works/SKILL.md`). That sentence is the verification rule. Every verification block opens with it. The live block is mandatory. Drive the real surface with `exec` for CLIs and TUIs, and with the browser mechanism only when Devin exposes one. Declare the actual control path in How to read this. A surface with no available control path is an evidence gap in Appendix C; name the missing adapter and do not claim live verification.

Record the code-ready SHA and run gates and relevant live/performance behavior at that exact revision. Require at least two independent audit passes with distinct focuses, using configured local profiles. Repeated profiles mean separate fresh-context calls; disclose sequential execution and repeat the SHA and focus in every result. Run the full audit set once, at the code-ready SHA. Run it again only for new behavior, a redesign, or a large new diff. A rebase, a merge-conflict resolution, or a minor fix gets one fresh-context verifier at the new head. Keep the merge base through fix rounds; rebase again only for merge preparation, a demonstrated trunk conflict, or trunk-caused CI failure. When trunk lacks the feature, prove the added behavior and use an absolute performance budget rather than compare unlike workloads.

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it with an explicit `Evidence:` receipt on the same line. Check a box only when its evidence exists. A file, a log line, a screenshot, a test run, or a SHA.

The program runs `skills/poteto-mode/playbooks/<execution playbook>.md` from the installed plugin. The operator decides merges. Stop at merge-ready unless the operator asks to open or merge a PR.

Control path: <Available local CLI command or adapter. If unavailable, name the gap and the affected live check.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on an explicit go. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] On that go, write this exact text into the standing orders and restate it in your todolist. "<The plan path, the PR ids in order, the verification rule, who merges, and the done condition.>" Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Read these from the installed plugin at program start. Re-read them at each in-session checkpoint. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
  - [ ] `skills/poteto-mode/playbooks/<execution playbook>.md` Evidence: <Specific receipt path, command output, SHA, or operator decision.>
  - [ ] `<control procedure>` Evidence: <Specific receipt path, command output, SHA, or operator decision.>
  - [ ] `skills/<each shipped leaf skill the program uses>/SKILL.md` Evidence: <Specific receipt path, command output, SHA, or operator decision.>

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Follow this dependency graph. Start dependent work only after its parent is merge-ready, or base it on the parent branch when stacking. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `<resolved trunk branch>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
  - [ ] <PR id> after <PR id>. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`. Never require a stacked-PR vendor CLI. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Stop at merge-ready unless the operator asks to open a PR. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Run the repo's lint and typecheck once before any PR-facing push. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

### Verdict, for every PR

- [ ] Record the code-ready SHA. At that exact SHA, re-run gates and relevant live/performance checks, then collect two independent fresh-context audits with distinct focuses from configured local profiles. Repeated profiles run sequentially and disclose that fact. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner, including a defect a lane filed as a note. After a patch-changing push, run the full audit set again only for new behavior, a redesign, or a large new diff, and otherwise one fresh-context verifier at the new head; preserve the merge base through fixes and rebase only for merge preparation, a demonstrated trunk conflict, or trunk-caused CI failure. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Create `<path>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Delete `<path>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**Build.**

- [ ] <One change. Name the symbol and the file.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Lane 1. Regression lane against trunk. Run <the same load-bearing scenario> at trunk and the code-ready SHA. If trunk lacks the feature, verify the added behavior directly and disclose that difference. Save `<surface-appropriate artifact path>`. Pass when <predicate>. Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Lane 2. <Scenario.> Save `<surface-appropriate artifact path>`. Pass when <predicate>. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured at the exact code-ready SHA; compare trunk only for equivalent workloads.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Probe. <The command or procedure.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Baseline. <Record the comparable trunk value, or state that trunk lacks the feature.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>
- [ ] Rule. <Regression limit for equivalent workloads, or an absolute performance budget for a new feature.> Evidence: <Specific receipt path, command output, SHA, or operator decision.>

**Review gate.** The operator reviews before merge.

- [ ] Post evidence in chat. Stop at merge-ready. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

## Close the program

- [ ] Every box above is checked with its evidence. Evidence: <Specific receipt path, command output, SHA, or operator decision.>

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>
````

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved and what stays unproven.
