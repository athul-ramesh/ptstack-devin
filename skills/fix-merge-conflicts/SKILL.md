---
name: fix-merge-conflicts
description: Resolve merge conflicts non-interactively, validate build and tests, and finalize conflict resolution
---

# Fix merge conflicts

## Trigger

Branch has unresolved merge conflicts and needs a reliable path to a buildable state.

## Workflow

1. Detect all conflicting files from `git status` and conflict markers. Use `exec`.
2. Resolve each conflict with minimal, correctness-first edits.
3. Prefer preserving both sides when safe. Otherwise choose the variant that compiles and keeps public behavior stable.
4. Regenerate lockfiles with package manager tools instead of hand-editing.
5. Run the repository's focused check. Compile, lint, or the relevant tests via `exec`. Do not treat a new test file as proof the conflict is gone. The focused check plus a clean working tree is the proof.
6. Stage resolved files and summarize key decisions.

## Guardrails

- Keep changes minimal and readable.
- Do not leave conflict markers in any file.
- Avoid broad refactors while resolving conflicts.
- Do not push or tag during conflict resolution.

## Output

- Files resolved
- Notable resolution choices
- Focused check outcome
