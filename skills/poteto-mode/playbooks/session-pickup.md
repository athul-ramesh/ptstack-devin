### Session pickup

**You own the resume point. Read the prior trail, don't redo it.** For "take over this", "resume this conversation", "continue from this store", "you're taking over", "pick up where X left off", or a pushed branch you're meant to continue.

A pickup is inheritance. The prior agent already paid the cost of reading the code, running the repros, making the design choices. Redoing loses the bias check and burns context. Resist the urge to re-derive. Read.

1. Locate the prior trail. Read `references/program-state.md` and `references/evidence-source.md`. Prefer `<cwd>/.pstack/<slug>/` or a storePath the user named, then `$HOME/.config/devin/pstack/<slug>/`. Session bodies are this conversation or a user-named `devin --export` jsonl. A pushed branch is live git. Do not glob home config. Do not invent a private transcript directory. There is no cloud-agent handoff in this plugin.
2. Reconstruct operational state. The branch and worktree, what already landed (`exec` `git log`, `git diff` against the base), `units.tsv`, `resume.md`, `decisions.tsv`. Include each prior worker's identity, configured profile, assigned workspace, and recorded state. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work merely because a new turn began. Skip `verified` and `abandoned` units. Surface each worker whose recorded state is unknown as an open question instead of resolving it by guess. A "let me verify from scratch" pass is the tell that you're treating the trail as untrustworthy when it's actually authoritative.
4. Route the remaining work to the matching playbook and pick the verdict. Continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact (`skills/principle-prove-it-works/SKILL.md`). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, the `storePath`, and the outcome.
