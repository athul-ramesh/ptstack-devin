### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead.

1. Invoke `/pstack:how` over the affected subsystem before changing it. Scale it as the how skill prescribes: one readonly explainer for a narrow module or function, explorers plus synthesis when the subsystem spans files or services. Inspect with `read`, `grep`, and `glob` as needed.
2. Invoke `/pstack:architect` before code that crosses a function boundary, including within one module. It grounds the design and compares at least two structurally distinct candidates before synthesis. Skipping stays as `architect skipped: <reason>`. Do not fold the design decision silently into implementation.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Delegate code-writing through [`../references/delegation.md`](../references/delegation.md) with the exact role key `feature, refactoring`. Give a specific scope, absolute file paths, the named data shape, and its organizing structure from the applicable Model the Domain leaf. Review the diff yourself. When the implementation admits multiple valid shapes, invoke `/pstack:arena`.
5. Verify on the matching surface. Detect the control tool that surface needs before claiming evidence; a missing tool is a precise limitation, not a pass. "Inconclusive" or wrong-surface is not a pass. Flag it. A build or exit-code success is not proof of the changed behavior.
6. Use `skills/principle-sequence-verifiable-units/SKILL.md`. Build and verify each small unit before the next. Commit or rebase only within the user's requested delivery scope.
7. If the design is contested, invoke `/pstack:interrogate` before shipping.
8. Stop at merge-ready. Do not open a PR unless the user asks. When they ask, `playbooks/opening-a-pr.md`.

Code-coupled work (one feature, one migration) stays with one worker. The root dispatches additional independent slices only after evidence shows their prerequisites are complete. Concurrent writers require a root-provisioned, verified, recorded worktree or directory per [`../references/delegation.md`](../references/delegation.md); a separate branch in the shared checkout is not isolation. Otherwise serialize them. Workers return unresolved slices to the root instead of dispatching them.

**Reply:** what you built, what you chose and why, the throughput checkpoint and chosen decomposition with its reason (including why one worker may be best), open decisions. Tables for design alternatives.
