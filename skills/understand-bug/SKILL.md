---
name: understand-bug
description: "Use for 'understand this bug', 'explain the bug before fixing', or /pstack:understand-bug. Reproduces a defect, traces its root cause, draws the failing path in Mermaid before and after, explains it plainly, then stops for approval before any fix."
---

# Understand bug

Understand the bug before you change it. This skill wraps the [Bug fix playbook](../poteto-mode/playbooks/bug-fix.md) with a diagnosis gate. The user requested the gate. poteto-mode route 1 follows an explicitly requested workflow, so the gate overrides [principle-never-block-on-the-human](../principle-never-block-on-the-human/SKILL.md) for this run.

## Understand

You own the reproduction and the diagnosis. Do not change production code. Repro scripts and temporary instrumentation are allowed. Remove both before the gate. The regression test comes after approval.

1. Reproduce the defect yourself on the matching surface. Drive CLIs and TUIs with `exec`. Drive a web UI only with the browser mechanism Devin actually exposes. Quote the decisive failing output. If you cannot reproduce it, stop and report how far you got. Do not invent a cause, a diagram, or a fix for a defect you did not reproduce.

2. Find the root cause per `/pstack:principle-fix-root-causes`. Form hypotheses and binary-search them with runtime evidence. Use `/pstack:how` on the subsystem. Use `/pstack:why` for the regression history. Name the first wrong decision at `file:line`.

3. Draw two fenced blocks with the info string `mermaid`. Draw the current failing path and mark the faulty step. Draw the same path after the proposed fix. Use `sequenceDiagram` when calls cross components. Use `flowchart` for logic in one place. Emit the raw blocks, because the host may not render Mermaid. When the bug is a bad state transition, offer `/pstack:statechart` instead of those blocks.

4. Explain the bug per `/pstack:teach`. Do not repeat the how and why passes from step 2. Say what breaks, why it breaks, and why it was not caught. If the bad state is legitimate, handle it. If the bad state should never exist, fix what produced it. Name the other places with the same pattern.

5. Propose the smallest change the evidence justifies. Name the files it touches and the regression test from `/pstack:tdd`. When the change crosses modules, invoke `/pstack:blast-radius` and report what it finds. Name any hypothesis you have not ruled out.

## Gate

Stop. Do not edit production code. Do not commit. Do not start the fix. Wait for the user's explicit approval of this diagnosis and this proposed fix. An approval tells you to proceed with both. A question or silence is not approval. This stop overrides principle-never-block-on-the-human for this run.

## Fix after approval

Follow steps 3 through 6 of the Bug fix playbook. When `/pstack:tdd` says the test path is cheap, write the failing regression test first. Run it and show that it fails for the right reason. Apply the fix through the playbook's implementation step. Rerun the original repro and the nearby tests, type checks, and lint. Commit the failing test before the fix. Stop at merge-ready.

**Reply before the gate:** the repro, the root cause, both diagrams or the statechart offer, the explanation, and the proposed fix. Run `/pstack:unslop` on that reply.
