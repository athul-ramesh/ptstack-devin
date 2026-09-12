# Evidence source

Tagged source for recall, what-did-i-get-done, get-pr-comments, and any brief that mixes records.

```
EvidenceSource
  kind        this-conversation | devin-export | session-index | durable-state | git-history | pr | issue | unavailable
  locator     export path, session id, store path, sha range, PR number, or ticket id. Empty when kind is this-conversation.
  category    git | session | pr | issue | docs | chat | errors | other. Required when kind is unavailable.
  reason      why this category is missing. Required when kind is unavailable.
```

## Collect

Name every source you used. Name every category you could not search. A missing tracker is a finding. Hide nothing.

## Session bodies

Devin does not expose a private per-project transcript directory this plugin can search. Do not invent a path. Do not glob home config.

Session message bodies come from, in order:

1. This conversation. Kind `this-conversation`.
2. An export path the user named. `devin --export` writes jsonl. `read` that file. Kind `devin-export`.
3. `exec` `devin list --format json` for session ids in this directory. Kind `session-index`. An id is not a transcript. Do not treat it as message bodies.

## Durable state

A `ProgramState` store is a first-class resume source. Read `<cwd>/.pstack/<slug>/` or the `storePath` the user named: `resume.md`, `units.tsv`, `decisions.tsv`. Kind `durable-state`, locator the store path. A worker status the store records as unknown stays unknown. Do not infer a completed or abandoned worker from silence. Only a fresh live check resolves it.

## Live checks

`exec` git and `gh` beat a stale export or ticket. Cite the live command.

## Unavailable

Do not add backends this session has not configured. Copy `/pstack:why` coverage failures and unchased leads as `kind: unavailable`, preserving their locator and reason. Use the matching category, or `other` for a category outside the enum. Distinguish an unregistered source from a configured tool that failed. Synthesis that leans on a missing category must say so.

## Cite

Each claim names `kind` and `locator`. Session findings cite the export path or "this conversation". Shared-record findings cite PR number, ticket id, commit sha, or the unavailable reason.
