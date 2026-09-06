# Program state

Durable record for figure-it-out, orchestrate, autonomous-run, pause-safely, and session-pickup.

```
ProgramState
  slug              [a-z0-9-]+
  objective         one-line falsifiable predicate
  storePath         repo .pstack/<slug>/ or $HOME/.config/devin/pstack/<slug>/
  ownerProfile      parent session, or a registered pstack profile
  lastVerifiedHead  git sha, or empty
  units[]
    id
    ownerProfile
    state           pending | in-progress | verified | not-verified | inconclusive | abandoned
    evidence        pointer, not prose
    deps            comma-separated unit ids, or empty
    lastVerifiedHead
```

## Where it lives

Default is repo-local `<cwd>/.pstack/<slug>/`.
A program that must outlive this checkout uses `$HOME/.config/devin/pstack/<slug>/`.
Never write `~/.claude/` or a guessed private transcript directory.

## Files and writers

One writer per file. Readers aggregate at read time.

| File | Writer | Rule |
|---|---|---|
| `objective.txt` | init | First write wins. Same text is a no-op. |
| `units.tsv` | parent or coordinator | Keyed by `id`. Identical fields are a no-op. |
| `decisions.tsv` | `skills/show-me-your-work/scripts/log.sh` | Append only. Never edit a prior row. |
| `resume.md` | pause-safely | Replace on each pause. |
| `status.md` | `program-state.sh status` | Derived from `units.tsv`. Do not hand-edit. |

`units.tsv` header is `id`, `owner`, `state`, `deps`, `evidence`, `head`.

## Scripts

```
exec skills/poteto-mode/scripts/program-state.sh init <dir> <objective>
exec skills/poteto-mode/scripts/program-state.sh set <dir> <id> <owner> <state> <deps> <evidence> <head>
exec skills/poteto-mode/scripts/program-state.sh status <dir>
exec skills/show-me-your-work/scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>
```

## Wake

Devin cannot schedule a later turn. Bound the iteration count in this session. Then write `resume.md` and stop. The operator starts a new session and resumes from `storePath`.

## Resume

Read `units.tsv`. Skip `verified` and `abandoned`. Continue the first `in-progress` or `pending` unit. Do not redo a verified unit.
