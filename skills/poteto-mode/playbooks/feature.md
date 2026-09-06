### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead.

1. Inspect the affected subsystem with `read`, `grep`, and `glob` before changing it.
2. Invoke `/pstack:architect` before code that crosses a module boundary. Skipping stays as `architect skipped: <reason>`. Do not fold the design decision silently into implementation.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Delegate code-writing with `run_subagent` using the feature model from poteto-mode Models. Give a specific scope. File paths, named data shape, and its organizing structure per `skills/principle-model-the-domain/SKILL.md`. Review the diff yourself. When the implementation admits multiple valid shapes, invoke `/pstack:arena`.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass. Flag it.
6. Rebase into small, ordered commits. Use `skills/principle-sequence-verifiable-units/SKILL.md`. Build, verify, and commit each small unit before the next.
7. If the design is contested, invoke `/pstack:interrogate` before shipping.
8. Stop at merge-ready. Do not open a PR unless the user asks. When they ask, `playbooks/opening-a-pr.md`.

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts.

**Reply:** what you built, what you chose and why, open decisions. Tables for design alternatives.
