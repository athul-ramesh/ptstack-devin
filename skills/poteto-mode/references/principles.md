# Principle selection

Read this catalog only when a live decision needs more than the default engineering rules. Select the relevant leaf and read it in full. Resolve `skills/` paths from the installed plugin root, not the consuming project. Workers read only the leaves named in their brief.

**Core**

- **Laziness Protocol** (`skills/principle-laziness-protocol/SKILL.md`). Refactoring, sizing a diff, or tempted to add abstractions, layers, or signal threading. Bias to deletion and the smallest change that solves the problem.
- **Foundational Thinking** (`skills/principle-foundational-thinking/SKILL.md`). Before writing logic. Core types and data structures, scaffold-vs-feature sequencing, what concurrent actors share.
- **Redesign from First Principles** (`skills/principle-redesign-from-first-principles/SKILL.md`). Integrating a new requirement into an existing design. Redesign as if it had been foundational from day one.
- **Subtract Before You Add** (`skills/principle-subtract-before-you-add/SKILL.md`). Sequencing an addition, refactor, or rewrite. Remove dead weight first, then build on the simpler base.
- **Minimize Reader Load** (`skills/principle-minimize-reader-load/SKILL.md`). Reviewing or shaping code that's hard to trace. Count layers and hidden state, collapse one-caller wrappers, shrink mutable scope.
- **Outcome-Oriented Execution** (`skills/principle-outcome-oriented-execution/SKILL.md`). Planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture. Do not preserve throwaway compatibility states.
- **Experience First** (`skills/principle-experience-first/SKILL.md`). Product, UX, or feature-scope tradeoffs. Choose user delight over implementation convenience.
- **Exhaust the Design Space** (`skills/principle-exhaust-the-design-space/SKILL.md`). A novel interaction or architectural decision with no precedent. Build 2-3 competing prototypes and compare before committing.
- **Build the Lever** (`skills/principle-build-the-lever/SKILL.md`). Any non-trivial work. Build the tool that does or proves it, not by hand. The tool is the artifact a reviewer reruns.

**Architecture**

- **Model the Domain** (`skills/principle-model-the-domain/SKILL.md`). Writing stateful logic, or code that branches a lot or repeats a shape assumption across files. Encode the domain in a structure instead of scattered conditionals.
- **Boundary Discipline** (`skills/principle-boundary-discipline/SKILL.md`). Wiring validation, error handling, or framework adapters. Guards at system boundaries, trust internal types, keep business logic pure.
- **Type System Discipline** (`skills/principle-type-system-discipline/SKILL.md`). Designing types or a signature in any typed language. Make illegal states unrepresentable, brand primitives, parse external data at boundaries.
- **Make Operations Idempotent** (`skills/principle-make-operations-idempotent/SKILL.md`). Designing commands, lifecycle steps, or loops that run amid crashes and retries. Converge to the same end state.
- **Migrate Callers Then Delete Legacy APIs** (`skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md`). Introducing a new internal API while old callers exist. Migrate and delete in one wave.
- **Separate Before Serializing Shared State** (`skills/principle-separate-before-serializing-shared-state/SKILL.md`). Concurrent actors might write the same file, branch, key, or object. Eliminate the sharing first.

**Verification**

- **Prove It Works** (`skills/principle-prove-it-works/SKILL.md`). After a task, before declaring done. Verify against the real artifact, not a proxy or "it compiles".
- **Fix Root Causes** (`skills/principle-fix-root-causes/SKILL.md`). Debugging. Trace each symptom to its root cause, reproduce first, ask why until you reach it.
- **Sequence Work into Verifiable Units** (`skills/principle-sequence-verifiable-units/SKILL.md`). Multi-step work and how you stack commits and PRs. Break work into small units that each end in a check.

**Delegation**

- **Guard the Context Window** (`skills/principle-guard-the-context-window/SKILL.md`). Context fills up. Route bulk to subagents, keep summaries in the main thread.
- **Never Block on the Human** (`skills/principle-never-block-on-the-human/SKILL.md`). Tempted to ask "should I do X?" on reversible work. Proceed, present the result, let the human course-correct.

**Meta**

- **Encode Lessons in Structure** (`skills/principle-encode-lessons-in-structure/SKILL.md`). You catch yourself writing the same instruction a second time. Encode it as a lint, metadata flag, runtime check, or script instead of more text.
