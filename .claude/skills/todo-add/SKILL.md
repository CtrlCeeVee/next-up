---
name: todo-add
description: >
  Capture discovered work into a project's todo.md following the canonical todo
  format. Use whenever logging a bug, feature, security issue, chore, or decision
  into todo.md — one item or a batch (e.g. from a review, UAT pass, or planning
  session). Triggers on: "add to todo", "log it", "log this", "capture this",
  "add a todo", "make a todo list", recording a bug/feature/chore/decision for
  later, or writing/creating todo.md entries. This skill OWNS the canonical
  todo.md / DONE.md format (entry shape, IDs, tags, severity, states, sections,
  sorting) — it is the single source of truth that /todo-do references.
---

# /todo-add — Capture work into `todo.md`

Turn discovered work into well-formed `todo.md` entries. This file is the
**canonical spec** for the todo format; `/todo-do` (which completes entries)
defers to it. If the format ever changes, it changes here.

## The capture gate (read first)

A human invoking `/todo-add <thing>` **is** the go-ahead to log that thing — add it.

But do **not** inflate the request: if, while logging, you notice *additional*
uncaptured work, surface it plainly ("I also spotted Y — log it too?") and wait
for a yes. Never slip speculative entries in, and never silently drop something
you raised. (Same discipline as the global CLAUDE.md `<critical>` block.)

## Files

- **`todo.md`** — project root. Open/in-flight work + the decisions log.
- **`DONE.md`** — sibling of `todo.md`. Archive of verified `[x]` and cancelled `[-]`
  items. *You* don't write here — `/todo-do` archives on completion. Format is
  documented below so the two skills stay in sync.

## Canonical format

### File skeleton (use verbatim when creating `todo.md`)

```markdown
<!-- [ ] todo · [~] done, awaiting verification · [x] verified · [-] cancelled · [!] blocked
     Tags: BUG FEAT SEC CHORE DECISION · Sev: CRIT HIGH MED LOW
     Next ID: T-001 · Spec: /todo-add
     [x] + [-] (except DECISIONs) → DONE.md · resolved decisions stay below -->

# Todo — <Project Name>

## Active

## Decisions
```

### Entry shape

```
- [state] T-NNN TAG SEV — description _(src: ref)_
        optional indented context (needs / accept / repro) — only when needed
```

- **state** — one of the five symbols (see states below).
- **T-NNN** — zero-padded to 3 digits. Allocated from the `Next ID` marker.
  **Never reused, never renumbered**, even after archival.
- **TAG** — uppercase, one of `BUG FEAT SEC CHORE DECISION`.
- **SEV** — uppercase `CRIT HIGH MED LOW`. **Omit** for `CHORE` and `DECISION`
  (they're unprioritised).
- **description** — one line, lean but complete: enough that any agent can pick
  it up cold. Name the *where* (file / endpoint / page) when known.
- **`_(src: ref)_`** — where it came from (UAT #, bug #, review, `chat MM-DD`,
  another `T-NNN`). Encouraged; omit only if genuinely sourceless.
- **indented context** — 6-space indent, on its own line(s). Add **only** when
  the item can't be understood from the header line: `needs: T-009`,
  `accept: <criteria>`, `repro: <steps>`. If you need 5+ lines, the item is too
  big — split it into separate entries.

### States

| Symbol | Meaning | Lives in |
|---|---|---|
| `[ ]` | to do | Active / Decisions |
| `[~]` | done by agent, **awaiting human verification** | Active (until human flips it) |
| `[x]` | human-verified complete | DONE.md (decisions: stay in Decisions) |
| `[-]` | cancelled / won't-do | DONE.md |
| `[!]` | blocked — append ` — blocked: <reason>` inline | Active |

An agent may move an item to `[~]` but **never** to `[x]` — verification is the
human's gate.

### Tags & severity (classify honestly)

- **BUG** — something is broken. **FEAT** — new capability. **SEC** — security
  issue. **CHORE** — maintenance/cleanup, no user-facing behaviour change.
  **DECISION** — a choice to make or a choice to record.
- **CRIT** — data loss, security breach, system down, or a core flow blocked.
  **HIGH** — major feature broken / important. **MED** — noticeable, workaround
  exists. **LOW** — minor or cosmetic.

### Sections & sorting

- **`## Active`** — everything except decisions. Sorted by severity
  `CRIT → HIGH → MED → LOW`, then sev-less items (`CHORE`) at the bottom. Ties
  broken by **ID ascending**. `[~]` and `[!]` items keep their severity position.
- **`## Decisions`** — `DECISION` items only, open and resolved. Resolved
  decisions (`[x]`) **stay here** — they're a living reference, the one exception
  to archival. Order by ID ascending.

### DONE.md format (archived by `/todo-do`, documented here for the spec)

```markdown
# Done — <Project>  (archive; newest first)

- [x] T-013 BUG  HIGH — cross-org assignment allowed — done 2026-05-30, verified ✅
      fix: org check in assign handler (ticket.routes.ts) · commit 0eddd01
- [-] T-010 FEAT MED  — CSV export of ticket list — cancelled 2026-05-28, superseded by API access
```

Newest entries go on top.

## Procedure

1. **Locate `todo.md`** at the project root. If it doesn't exist, create it from
   the skeleton above — title from the project/dir name, `Next ID: T-001`.
2. **Read the `Next ID`** marker.
3. **For each new item:**
   - Classify TAG and (unless CHORE/DECISION) SEV.
   - Write one lean line per the entry shape; add the source ref; add indented
     context only if needed.
   - Assign the current `Next ID`, then increment it for the next item.
   - Place it: `DECISION` → Decisions section; everything else → Active in its
     correct sorted position.
4. **Write back** the bumped `Next ID` marker.
5. **Report** to the human: the IDs you assigned, one line each, so they can
   sanity-check your tag/severity calls. Keep it short.

## Worked example

Input: *"log it"* after finding internal comments leak to external users on the
timeline endpoint (from UAT test 23), and a chore to drop an unused column.

`Next ID` was `T-014`. After:

```markdown
<!-- ... Next ID: T-016 ... -->

## Active
- [ ] T-014 SEC CRIT — internal comments leak to external users on timeline endpoint _(src: UAT #23)_
- [ ] T-015 CHORE — drop unused legacy_status column _(src: schema audit)_
```

Report back: *"Logged T-014 (SEC/CRIT — timeline comment leak) and T-015 (CHORE — drop legacy_status). Next ID now T-016."*

## Do / don't

- **Do** keep entries to one line; split anything that needs more.
- **Do** name the location and attach a source ref.
- **Do** classify severity honestly — the top of Active must be the urgent stuff.
- **Don't** write acceptance specs or essays for trivial items.
- **Don't** reuse or renumber IDs, ever.
- **Don't** mark anything `[x]`, and don't archive — that's `/todo-do`'s job.
- **Don't** emit a completion report here — this skill only captures work.