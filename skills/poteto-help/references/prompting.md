# Word the prompt

A prompt states the intent and the check for done. The playbook supplies the steps, so a few plain sentences beat a spec.

## Put in

- The goal. Say what is wrong or what the user wants.
- The done check. It can pass or fail. "Make it better" and a duration are not checks.
- The proof to show. Ask for real command output, a stored value, or a before and after number. Screenshots or video require an available UI adapter.
- What the user already knows. A symptom, a repro step, a log, or a link saves the agent a search.
- The real constraints. "repro first", "don't change any code yet", "zero behavior change", and "let me review before proceeding" each change what the agent does.

## Leave out

- The how. Say what to achieve, and leave the agent room to find a better way.
- A list of skills or steps. A hand-written order drops or reorders steps the playbook keeps. Name a skill only to override one choice.
- The user's theory of the cause, until the agent restates the problem. A stated guess narrows the search.

## Load the context first

- For a noisy report, ask the agent to restate the underlying issue in its own words and in plain English before it does anything else. A misreading shows up before any code exists.
- In a fresh chat, `/pstack:recall` earlier work on the topic. Use this conversation, user-named Devin exports, and live git or gh state. Unavailable history stays an evidence gap.
- Before a change to unfamiliar code, ask `/pstack:how` for the mechanics and `/pstack:why` for the reasons. An agent with no traced model fixes the symptom at the first plausible spot.
- Ask `/pstack:teach` to make the case for a choice, as in "convince me it fixes the cause and not the symptom". A case is easier to check than a summary.

## Design before the plan

- Never take the first design. Ask for prototypes of a few options, with executable probes and UI captures when an adapter is available, and pick from the evidence.
- Let prototypes answer the open questions. Don't review an abstract plan adversarially, because reviewers invent risks that never happen.
- For a shared package or API, ask for the README or a tutorial first, then work back to the code. The doc becomes the target the agent checks itself against.
- Ask for the plan only after the design is settled. Each step of the plan ends in a check.

## Follow up short

- "do it", "continue", and "keep going until done" are whole prompts once the chat holds the task.
- Start with "new task" when the subject changes. Otherwise the mode treats the message as the next step.

## Before stepping away

- State which reversible actions are authorized and which product decisions still need an answer.
- Write done as checks every iteration can run. Set an iteration bound for the Autonomous run playbook in the current session.
- Ask for a fresh worktree off a named base.
- Request commits, pushes, or a PR explicitly when wanted. Stepping away grants no delivery authority.
- Ask for a decision log to audit later.
- At the bound, write `resume.md` with completed work, evidence gaps, and next steps. The operator starts a new session to continue.

## Steer in one line

- Restate the goal: "i said the goal is to repro. i did not ask for a fix yet."
- Name the principle: "apply prove it works. show me the real output, not the build log."
- A principle name works when it changes a live decision. The agent reads the selected leaf before citing it, then names the choice it changed.
