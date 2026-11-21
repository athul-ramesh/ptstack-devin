# Re-smoke + remaining Free gaps (2026-11-21)

**Commit under test:** `14ef603` (swarm/arena/how isolation + checklist fixes).  
**Session:** Rex `resmoke-isolation`, Devin `swe-2-high` + smart.  
**Captures:** `captures/resmoke-capture-1.txt`, `captures/gaps-capture-1.txt`.

## Arena/swarm `.pstack/` re-smoke

| Run | Result | Agents | Evidence |
| --- | --- | --- | --- |
| swarm N=2 | PASS | `375a4e1e`, `12d96b76` (`panel-swe`) | `.pstack/swarm-resmoke/worker-{1,2}/out.txt` match `head -1` |
| arena N=2 | PASS | `2d6412eb`, `892ad9d6` (`poteto-agent-swe`) | `.pstack/arena-resmoke/candidate-{1,2}/candidate.txt`; no `/tmp`; hello.js untouched |

## Dual-writer + interrogate

| Probe | Result | Agents | Evidence |
| --- | --- | --- | --- |
| Dual-writer worktrees | PASS | `621bfe39`, `ec0e1e2d` (`poteto-agent-swe`) | `.pstack/wt-a` / `wt-b` each have unique README line; main README clean |
| interrogate N=2 | PASS | `15fdf54f`, `57e5cada` (`panel-swe`) | 5 run-verified findings on `greet()`; sequential FG (BG denies `exec`) |

## New harness note

Background workers auto-deny `exec`. Writers completed via read/edit only. Shell probes (tests, reproduction) need foreground workers or root `exec`.

## Budget

One additional Free session for re-smoke + gaps. Pro not measured in capture footer; soft ceiling still not breached for Med/High (0 used).
