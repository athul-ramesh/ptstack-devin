---
name: architect
description: "Sketch types, signatures, and module structure before code, then stay in the loop while implementation fills in. Use for /architect, 'architect this', 'design this', or non-trivial work where jumping to code would lock in the wrong shape."
---

# Architect

Design before implementing. Sketch types, signatures, class shapes, and module boundaries with `not implemented` bodies. Synthesize across independent candidates. Fill in against the chosen sketch. If implementation proves the sketch wrong, throw it out.

Resolve profiles from [`../poteto-mode/references/panel-run.md`](../poteto-mode/references/panel-run.md).

## Start

Open a todolist with one entry per phase.

1. Ground
2. Sketch
3. Agree
4. Implement
5. Scrap

## Phase A: Ground

Build a real model of every system the new code touches. Invoke `/pstack:how` over those subsystems. Critique mode when existing structure is the constraint.

Naming a file is not grounding. Produce the traced model how prescribes. If the design redefines ownership or layering, also invoke `/pstack:why` so the rationale is a constraint.

Skip Phase A only for genuine greenfield work.

## Phase B: Sketch

Invoke `/pstack:arena` with the design-sketch task and Phase A artifacts. Pass [`references/runner-prompt.md`](references/runner-prompt.md) as each runner's prompt. Each candidate produces a package shaped per [`references/rationale-template.md`](references/rationale-template.md). Usage first, then types, signatures, module map, rationale.

Use architect-runners profiles.

Design it twice. At least two structurally distinct candidates before synthesis. Whole-shape alternatives, not point fixes.

Screen every candidate against [`references/design-red-flags.md`](references/design-red-flags.md) before synthesis.

Prefer the design that hides more complexity behind a smaller public surface.

Arena returns one synthesized package. The pick fills "Synthesis decision".

## Phase C: Agree (opt-in)

Default: implement. No human checkpoint.

Checkpoint only when the invoker asks to stop and show the sketch first.

The synthesis can ship as its own commit. Later commits fill bodies against that contract. For adversarial pressure, invoke `/pstack:interrogate` on the sketch.

If the human pushes back on the shape, that is Phase A evidence. Re-ground. Re-run Phase B.

## Phase D: Implement

Replace `not implemented` with code. The sketch is the contract.

A new parameter the sketch missed is a signal. Ask whether the sketch was wrong, the requirement was missed, or the implementation is overreaching. Surface it. Do not bolt it on.

## Phase E: Scrap

If implementation keeps producing friction the sketch cannot absorb, throw the sketch out.

The signal is a pattern:

- The same workaround in unrelated code
- Unrelated edge cases that all need special-case branches
- Types that need escape hatches to compile
- A lock reflex when the sketch said state was not shared
- Callers who must know internal rules
- Two or more independent Phase D deviations of the same shape

A few edge cases do not condemn a design.

When you scrap:

1. Invoke `/pstack:how` over what was built.
2. Redesign as if the new constraints were day-one assumptions. Read `skills/principle-redesign-from-first-principles/SKILL.md`.
3. Subtract first. Read `skills/principle-subtract-before-you-add/SKILL.md`. The new sketch starts smaller.
4. Return to Phase B.

## Outputs

Caller's usage first. Type sketch derived from it. One file for small changes. Module map plus types for larger work. Rationale beside it, including the synthesis decision.

## Models

`$HOME/.config/devin/pstack-models.md` overrides this default.

- architect runners: `pstack:panel-opus`, `pstack:panel-swe`, `pstack:panel-sonnet`
