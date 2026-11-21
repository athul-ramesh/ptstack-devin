# figure-it-out plan (plan-only smoke)

Objective: greetAlias(name) exists in repo, returns same string as greet(name) for probes, one test exits 0, hello.js and hello.test.js unchanged vs fa71c00.

Design: strictest reading of "without rewriting hello.js" is zero edits to it. greetAlias lives in a new module hello-alias.js that requires ./hello and delegates. Test lives in hello-alias.test.js mirroring hello.test.js style. Sequential units, no fan-out (cap N<=2 unused).

## Units

| id | deps | owner profile | evidence expected |
|---|---|---|---|
| u1-baseline | - | pstack:panel-swe | baseline.txt: `node hello.test.js` output, `greet()` probe outputs, git sha |
| u2-alias-module | u1-baseline | pstack:poteto-agent-swe | test-output.txt: `node hello-alias.test.js` exit 0; worker worktree `.pstack/wt-alias` |
| u3-parent-verify | u2-alias-module | pstack:panel-swe | verdict.txt: diff of hello.js/hello.test.js vs fa71c00 empty; greetAlias===greet on probes; verdict VERIFIED/NOT VERIFIED/INCONCLUSIVE |

Execution was not authorized. All units remain pending.
