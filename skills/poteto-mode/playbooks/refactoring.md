### Refactoring

**You own the contract. The structure changes. The behavior does not.** For "refactor", "rename", "extract", "inline", "dedupe", "restructure", "move this module", "tidy up this area". Distinct from Feature, which adds behavior, and Bug fix, which corrects it.

A refactor that smuggles in a behavior change loses its safety net. If the cleanup reveals a missing feature or a real bug, split it out and ship the structural change first against the pinned contract. A redesign is allowed, but name it and route to Feature.

1. Pin the behavior contract first. Invoke `/pstack:how` over the affected subsystem to learn the contract, then write a characterization test, snapshot, or equivalence harness that captures current behavior before any structure moves. The harness makes "refactor" a checkable claim (`skills/principle-prove-it-works/SKILL.md`). If the area has no coverage, write the pin before touching structure. Type check and lint are not a pin.
2. Name the structure the code is missing per `skills/principle-model-the-domain/SKILL.md`. Boring code stays when the shape is already clear and local. The reshape must delete branches or invalid states, not add indirection.
3. Name the target shape. State what the module layout, types, and call graph should be if built today. If the target crosses a function boundary, invoke `/pstack:architect` for parallel design exploration of the shape before the move.
4. Subtract before you add. Delete dead weight, collapse one-caller wrappers, drop redundant validators, and remove orphan references before introducing the new shape. The smallest change that reaches the target shape ships. A speculative cleanup that "might help" gets reverted.
5. Move in small behavior-preserving steps, each keeping the pin green. For API reshapes, migrate every caller and delete the old API in the same wave. No compatibility shims. Spot-check every rename against the actual files. Delegate mechanical edits through [`../references/delegation.md`](../references/delegation.md) with the exact role key `feature, refactoring`. Review the diff yourself.
6. Prove behavior is unchanged on the real artifact, not "it compiles". For larger reshapes, run an equivalence check. A script that diffs old-vs-new outputs, a recorded baseline replayed against the new code, or a smoke run on the matching surface. Own the verification yourself.
7. Confirm the change earns its place. The success measure is reduced reader load. If the diff does not lower reader load somewhere, revert it.
8. Rebase into small ordered commits that tell the story. Stop at merge-ready. Do not open a PR unless the user asks.

**Reply:** the structure that changed, the pin you held it against, the equivalence proof, the reader-load delta, what shipped and what got reverted. No new behavior.
