### Prototype

**You own the design decision, not the code. The prototype is a throwaway instrument. The real build follows Feature.** For "prototype", "mock it up", "sketch this", "try this layout", or exploring a UI, interaction, or layout before committing. Also for settling an empirical fork by observing it run.

Speed over polish. Code quality does not matter. No planning. The rigor is in picking the right design cheaply. Be bold. Propose variations the user did not ask for, throw an approach away and try another.

1. Scope the decision the prototype exists to make. No decision means no prototype. Route to Feature.
2. Gather references when the design space is open. Skip when the direction is set.
3. Build throwaway in an isolated scratch dir, separate from production source. For a nontrivial code prototype, the root dispatches the implementation slice through the delegation gate and supplies the worker contract. For a visual decision, the lightest stack that renders the idea. For a behavioral or timing decision, the smallest script that exercises the question. No production framework, no tests, no abstractions.
4. When comparing alternatives, build them behind one switcher, each variant labeled so the user can name it. This is `skills/principle-exhaust-the-design-space/SKILL.md` made cheap.
5. Verify on the matching surface. For a visual decision, screenshot each variant and drive the interaction. The eye is the test. For a behavioral or timing decision, observe the thing you are deciding by logging the timing, printing the output, or watching the render.
6. Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Hand the chosen direction to Feature for the real build.

**Reply:** the variants explored, the evidence, tradeoffs, your recommendation, and the scratch path. Say plainly that the prototype is throwaway.
