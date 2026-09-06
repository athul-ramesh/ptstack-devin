---
name: create-verification-skill
description: "Generate a project-local verification skill that drives your app the way a user does. Use for /create-verification-skill, make a control skill for this repo, or when a project has no scripted way to prove UI/CLI/service behavior."
---

# Create a verification skill

Every serious project needs a scripted way to drive the real app and prove behavior. Launch it. Exercise a feature the way a user would. Capture evidence. This skill writes that as a project-local skill under `.devin/skills/verify-<app>/`. You write the output for the next agent, not for a human. It will be read cold, mid-task, by an agent that has never seen the app.

Read `skills/poteto-mode/references/verification.md` before writing Launch or Drive. There is no Devin `run` or `verify` skill. A test file is not proof.

## 1. Interview the repo, not the user

Answer these from the codebase. Ask the user only what you cannot observe.

- **Surface.** What does a user touch? Web UI, CLI, TUI, desktop app, API, mobile, library. A repo can have several. Pick the primary one and note the rest.
- **Run.** How does the app start locally? Prefer the repo's own documented command. Note ports, env vars, seed data, auth.
- **Drive.** How can an agent interact with it? Existing harnesses first. Playwright specs, expect scripts, PTY helpers, curl-able endpoints. Then the matching recipe in `verification.md`.
- **Observe.** What evidence can be captured? Transcripts, response bodies, logs, exit codes, DB state, screenshots when a browser exists.
- **Isolate.** Can two instances run side by side? If not, the generated skill must refuse to double-drive a shared instance.

If the checkout does not build or start as-is, fix that first, or report it precisely, before generating. A skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup, the generated skill may create it, marked as verification scaffolding, and remove it in cleanup.

## 2. Generate the skill

Write `.devin/skills/verify-<app>/SKILL.md` with YAML frontmatter. `name: verify-<app>`. `description` names the app, the surface, and when to reach for it. Without frontmatter the skill never registers.

Include these sections, each grounded in what the interview found. No placeholders.

- **Launch.** The exact command that starts the app for verification, and how to tell it is ready. Include teardown. For a short-lived CLI or TUI there is no server to keep alive. Build once, then start each drive in its own isolated PTY.
- **Doctor.** One read-only check that answers "is this instance worth driving?" Process up, right build, port owned by us, auth valid.
- **Drive.** The harness recipe with real selectors or commands from this repo. Prefer stable handles. ARIA labels, data attributes, prompt strings, route paths. Not coordinates.
- **Evidence.** What to capture and where it goes. Fill a `VerificationReceipt` per proof. Exercise the real user path. Capture the action and the resulting state. Verify side effects. Mock only at a production boundary.
- **Cleanup.** Tear down instances this run created. Never kill by process name. Cleanup removes instances and scratch state, never the evidence.
- **Helpers.** Any script the skill ships is executable. Its invocation is shown in the skill body.

## 3. Seed the feature map

Create `.devin/skills/verify-<app>/features/README.md` plus one file per user-facing feature you can identify. Aim for the top 3-5 from routes, commands, menus, or docs. Follow [`references/feature-map-example/`](references/feature-map-example/). Each file answers, from the user's point of view, what the feature is, how to reach it, how to drive it, and what observable end state proves it works. The four H2s are `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>`, and `Gotchas`.

## 4. Prove the generated skill before handing it over

Run its own instructions once. Launch, doctor, drive one mapped feature, capture a `VerificationReceipt`, clean up. After cleanup, confirm the evidence still exists at `artifactPath`. Fix what fails. Run cleanup after every failed iteration too. A generated skill that was never executed is a draft, not a deliverable.

## 5. Offer the maintenance loop

Point the user at `/pstack:maintain-verification-skill` for keeping the map honest as the app changes. Suggest a cadence only if they ask.
