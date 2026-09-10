### Investigation

**You own the answer. Plan, route, write.**

Read-only requests. "How does X work?", "why was Y built this way?", "are we sure about Z?", "should we do X or Y?". They produce a cited explanation or a recommendation, not a code change.

1. Inspect the affected files with `read`, `grep`, and `glob`. For "how does X work?" invoke `/pstack:how`. For motivation, rationale, regressions, postmortems, or data-backed thresholds invoke `/pstack:why`. For "are we sure?", critique. For a narrow question with no sibling skill, explain here. Cite history you can actually read.
2. Throughput checkpoint stays one line. `throughput checkpoint: n/a, read-only investigation`. The four-item version is for code-shaped work.
3. Produce an Overview, Key Concepts, How It Works, Where Things Live, and Gotchas answer, or a recommendation with a tradeoffs table if the request is a decision between alternatives.
4. Write the reply per poteto-mode Writing the reply.

No PR. No design exploration unless the investigation precedes a code change. If it does, hand back to the user and re-route to Bug fix or Feature.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong.
