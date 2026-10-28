# Prompts worth copying

Swap in the real paths, skills, and done checks. Informal wording works.

## Understand

- `/pstack:poteto-mode read <thread>. restate the underlying issue in your own words, in plain english.`
- `/pstack:poteto-mode investigate why <symptom>. give me what we know, what data you used, and your best hypotheses. don't change any code yet.`
- `use /pstack:how to understand <subsystem>. then use /pstack:why to find out why it broke recently.`
- `/pstack:recall my work on <topic> from last week, then read <issue>.`
- `/pstack:teach me why you implemented it this way and not <other way>. what did you trade off?`
- `/pstack:poteto-mode take over this branch. read the decision log, find what's done, and continue. don't redo finished work.`

## Build

- Bug: `/pstack:poteto-mode <symptom>. repro first, then fix and verify.`
- Bug in an app: `/pstack:poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show the actual flow through an available adapter, or report the missing control tool.`
- Bug with a cheap test: `/pstack:poteto-mode repro <bug> first. if there's a cheap test path, /pstack:tdd it. then fix and rerun.`
- Feature: `/pstack:poteto-mode add <behavior>. <current output> stays byte-identical. verify both.`
- Refactor: `/pstack:poteto-mode move <code> into one module, zero behavior change. record the current output first and prove it's unchanged after.`
- Perf: `/pstack:poteto-mode <operation> takes <time> on <fixture>. trace it, fix the measured cause, show me before and after.`

## Design and plan

- `/pstack:poteto-mode prototype a few options for <feature>. show runnable probes and, with an available UI adapter, captures for me to compare.`
- `/pstack:poteto-mode we need <feature>. /pstack:architect it first, and answer open questions with prototypes. let me review before proceeding.`
- `/pstack:poteto-mode write a tutorial for how i would use <new package> first. then /pstack:teach me why it beats the current one.`
- `ask /pstack:arena for a second opinion on this thread and our approach.`
- `/pstack:poteto-mode turn this design into a plan. small verifiable PRs, each with its own verification steps.`
- `/pstack:poteto-mode plan the migration of <library> to <target>. small verifiable PRs. the result must match the original exactly, bugs included.`

## Review and ship

- `/pstack:interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's a real bug or regression.` Read the Dropped list too.
- `/pstack:create-formal-verification-skill prove <property> holds in <module>, even when <steps> interleave or retry.` After merges or refactors in that code: `/pstack:maintain-formal-verification-skill`.
- `/pstack:swarm check every package under <dir> against its check script. one worker per package. one report.`
- `/pstack:poteto-mode open the pr. small ordered commits, evidence in the description.`
- `/pstack:poteto-mode babysit this pr. get it green.` For status only: `/pstack:poteto-mode check on pr <number>. anything outstanding?`
- Shipping is cut from this port. Use in-session Babysit and Opening a PR where authorized; the operator lands it.

## Away and back

- `/pstack:poteto-mode run <goal> in a fresh worktree off <base>. done means <checks>. bound this session to <N> iterations. keep a decision log. at the bound, write resume.md with the remaining work.`
- `/pstack:show-me-your-work catch me up on the completed run.` Read its Attention section first.
- `/pstack:ketchup` catches you up on this chat since your last message and lists every call that waits on you.
- Autopilot-full and Autopilot-stack are cut from this port. Read [Delivery capability](../../poteto-mode/references/delivery-capability.md) for supported in-session alternatives.
- `/pstack:reflect capture what we learned so the next run doesn't repeat it.` Approve only edits that change a future decision.
- `/pstack:bro` restates the last reply in plain words.

## Check the goal

```text
/pstack:in-your-own-words
```

Use this to hear the goals and problem the agent understood. It does not add a confirmation gate to ordinary work.

## Sharpen a prompt before you send it

```text
/pstack:sharpen <the prompt you're about to send>
```

The agent names what a top professional would do that you didn't ask for, the raw material they'd start from, their methods and tools, and an outside check that the result is right. It hands back your prompt rewritten to ask for that, leaves your choices open, and doesn't do the task. Send the rewrite when it reads right, for example with `/pstack:poteto-mode`.

- `/pstack:statechart check <model.tla> and give me Mermaid text to paste into Obsidian, plus an SVG.`
