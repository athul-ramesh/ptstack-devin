### Eval

**You own the experiment design. Plan, blind, run, synthesize.**

Evals test how a change affects agent behavior before promoting it. A new skill variant, a structural change, a prompt tweak. The failure mode is the observer effect. An agent that knows it's being evaluated behaves differently, so candidates must run blind.

**Non-negotiables for blinding:**

- No `eval`, `test`, `judge`, `experiment`, `rubric`, `score`, `compare`, `benchmark`, `candidate`, or `arena` in any directory, file, or prompt the candidate sees.
- The candidate prompt looks like an organic user request. State the goal, not the meta. "build me a small todo cli" not "show me how you follow the principles chain".
- No chain-eliciting cues. Don't ask the candidate to list which skills, principles, or files they applied. That meta-prompt inflates citation behavior. Ask for design notes generally and grade chain-following from code shape, not self-report.
- Sanitize directory and slug names. Use project-shaped names a user might pick, not labels like `candidate-1` or `agent-a`.
- Don't tell the candidate other candidates exist.
- The judge can know it's judging but sees outputs by sanitized label only, never by model name.
- Comparing two variants. One judge scores both sets in a single pass on one scale, blind to which set each came from. Two judge runs with different prompts don't compare. The calibration drifts.

**Steps:**

1. **Frame.** State what variant is under test and what behavior counts as success. Write the rubric (3-6 concrete criteria) for the judge only. Hold it back from candidates.
2. **Set up sanitized environments.** Per-candidate working dir with the variant in place. Plant any context an organic task would have. A project skeleton, the skills the candidate would naturally read.
3. **Author one organic prompt.** What a user would type. No leakage of what's being measured.
4. **Spawn N candidates** on different panel profiles per `/pstack:arena` Phase B. Each works in its own sanitized directory. Use the same prompt for each. Parallel calls set `is_background: true`; repeated profiles run as separate sequential calls. An unavailable model pin leaves the panel incomplete rather than changing its schedule or profile.
5. **Spawn one blinded judge** on a different panel profile per `/pstack:arena` Phase C. Judge sees outputs by sanitized label and the rubric, never a model name.
6. **Verify the chain from session evidence, not self-report.** Read `references/evidence-source.md`. Use this conversation or a user-named `devin --export` jsonl for each candidate dir. Do not glob home config. Look at which files each candidate actually opened. Citing a principle is not reading its leaf skill, and reading it is not applying it. Grade chain-following from the files it really read plus the shape of the code, never from the candidate's own claims.
7. **Read every candidate output yourself** end to end. Compare to the judge's verdict. Disagreement means a model is biased or the rubric is ambiguous. Synthesize.

**Reply:** variant under test, rubric, per-candidate notes, judge's verdict, your synthesis, and a recommendation for whether to promote the variant.
