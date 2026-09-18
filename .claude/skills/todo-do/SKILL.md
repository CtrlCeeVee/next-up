---
name: todo-do
description: >
  Pick up and work todo.md entries one at a time, with a human approval gate.
  Use whenever resolving, completing, processing, or working through items in a
  project's todo.md — a single id, a batch ("do the critical/security ones"), a
  described item, or "what's next". Triggers on: "do todo", "/todo-do", "resolve
  the todos", "work the todo list", "knock out T-014", "tackle the critical
  items", "complete this todo", "let's clear the backlog". Defers to /todo-add
  for the canonical todo.md / DONE.md format (entry shape, states, sorting,
  archival format) — this skill owns the *doing* workflow and the completion
  report.
---

# /todo-do — Work todo.md entries, one at a time

This skill isn't a one-shot command — it's a **working contract you kick off
once and then drive conversationally**. Invoke it to start; after that, just say
"next", "approved", or "change X". The format lives in `/todo-add`; this file
owns how work gets done and reported.

## The contract (state it, then honour it)

> One item at a time. Implement → sanity-check → report → **wait for your
> explicit thumbs up.** Nothing advances or commits without it.

When invoked, briefly say this back so the human knows the rules are in force,
then begin.

## 1. Resolve scope

Read `todo.md` at the project root, then figure out what to work:

- **An id** (`/todo-do T-014`) → that item.
- **A described item** ("fix the comment leak") → match it to an entry, confirm
  which id if ambiguous.
- **A batch** ("the critical/security ones", "all the bugs") → that set, worked
  **in severity order**, still one at a time.
- **Nothing** → list the open Active items and **recommend a starting point**
  ("I'd start with T-014 + T-009 — both CRIT"). Don't silently pick; let the
  human choose.

If there's no `todo.md`, say so and point to `/todo-add`.

## 2. Per-item loop

For each item, in order:

1. **Implement** the change.
2. **Sanity-check** — run the relevant typecheck / build (and a quick smoke
   check if cheap). If it doesn't pass, fix it before reporting — don't hand off
   broken work.
3. **Report** (see the contract below), then flip the item to `[~]`
   (done, awaiting verification) in `todo.md`.
4. **Wait.** Do not advance on silence or a vague reply — require an explicit
   affirmative ("approved", "looks good", "ship it", "next"). Anything unclear →
   ask.
5. **On approval:**
   - Flip `[~]` → `[x]`, add a brief done-note (what got done).
   - **Commit** the changes — one commit per todo, message referencing the
     `T-NNN` id, following the repo's commit conventions and your standing git
     rules.
   - Record the commit SHA in the entry and **archive it to `DONE.md`** (newest
     first), per the format in `/todo-add`. *Exception:* resolved `DECISION`
     items stay in the Decisions section — never archived.
   - Emit a one-line **checkpoint** and tee up the next item:
     *"✅ T-014 done & committed `a1b2c3d`, archived. Next: T-009 (CRIT — JWT
     none). Clean point to `/compact` before we continue."*
6. **If changes are requested** instead of approval → iterate, re-report, and
   wait again. The item stays `[~]`.

After the first invocation, run conversationally — no need to re-invoke the skill.

## The completion report (every item, no exceptions)

This is the contract from the global CLAUDE.md, applied per item. Report in chat,
**uniformly, every time, however trivial it seemed** — you surface, the human
triages what's worth documenting deeper. Never pre-filter on their behalf.

- **TL;DR** — what was done.
- **How to test** — concrete steps the human can run to confirm it. Distinguish
  *what you already verified* (typecheck/build passed, repro gone) from *what
  they should check*.
- **For bugs, also:** *why it was happening* (root cause) and *what the fix was*.
- **Headline actionable follow-ups — as the final line, never buried.** End the
  report with a distinct, scannable callout of anything the work surfaced that
  the human may want to act on: known limitations, shortcuts taken, deferred
  edge cases, discovered bugs, recommended next steps. This is their cue to
  decide what to `/todo-add` (the capture gate still applies — surface, don't
  silently log), so it must stand out on its own line, not be tucked inside the
  TL;DR. If there genuinely are none, say so ("No follow-ups.").

Keep it tight and skimmable — it's their review surface, not a treatise.

## Edge cases

- **Blocked mid-way** (needs a decision, an external dep, or info you don't
  have): flip the item to `[!]` with `— blocked: <reason>` inline, report why,
  and move on / stop — don't fake completion.
- **New work discovered** while implementing: surface it and offer to `/todo-add`
  it — don't silently expand scope or slip entries in (global capture gate).
- **Compaction:** because each item ends committed and self-contained, the
  conversation can be `/compact`-ed between items without losing the thread. The
  checkpoint line is the resume pointer.

## Do / don't

- **Do** wait for an explicit thumbs up before `[x]`, commit, or archive.
- **Do** sanity-check before reporting; hand off working changes.
- **Do** give the full report every time, even for trivial items.
- **Don't** mark `[x]`, commit, or archive on silence or your own judgement.
- **Don't** work more than one item ahead of approvals.
- **Don't** restate the format here — defer to `/todo-add` (single source of truth).