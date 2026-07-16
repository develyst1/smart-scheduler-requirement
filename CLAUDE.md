# CLAUDE.md — smart-scheduler-requirement (the control center 🎯)

Guides Claude Code (and any AI session) working in — or **directed from** — this repo. For the
cross-repo product map, see the workspace root `../CLAUDE.md`.

> 📌 **เริ่ม session ใหม่แบบไม่มี context?** อ่าน **[HANDOFF-2026-07-16.md](HANDOFF-2026-07-16.md)** ก่อน —
> สรุปงานปัจจุบัน (อัปเดต requirement.html ให้ตรงโค้ด + เคลียร์ Auto-cut/Income-ceiling/LINE),
> as-built status ที่ verify แล้ว, และดีไซน์ที่ตกลงไว้แล้ว.

## Why this repo matters most

This is the **single source of truth for scope, status, and "what to do next"** across the whole
Smart Tutoring Scheduler product (4 code repos). **The owner assigns work by pointing at this repo**
— e.g. "ทำ UC-020", "ดูที่ requirement", "แก้ข้อนี้ให้ Implemented". Treat instructions as references
into the artifacts here.

> **There are no `todo.md` / `mastertodo.md` files anywhere in the workspace** — they were deleted
> on **2026-07-08** and replaced by this repo. **Do not recreate them.** The backlog is the set of
> `Partial` / `Planned` items in `requirement.html`.

## The artifacts (read/maintain these)

| File | Role |
|------|------|
| **[requirement.html](requirement.html)** | ⭐ The **traceability hub** — one page linking **Workflows (WF) → Use Cases (UC) → Screens (SCR) → APIs → Test Cases (TC)**, each with a **status badge**. This is the live task board. Open it first. |
| **[requirement-timeline.md](requirement-timeline.md)** | The **living spec** (DOC-001) — a timeline newest→oldest; **the top entry wins on conflict**. |
| [propasal.md](propasal.md) · [start_phase.md](start_phase.md) | Commercial proposal (A/B/C) + deposit (client chose **Option C**). |
| [make-front/](make-front/) | As-built UI mockups (SCR-\*) — drawn from the real running apps, not wireframes. |
| [diagrams/](diagrams/) | PlantUML source (context / use-case / ERD / state / sequence). |
| [requirement-hub/](requirement-hub/) | The skill that generates/updates all of the above. |

## Status badges = the work queue

In `requirement.html` every WF/UC/SCR/API/TC carries one of:

- `Implemented` (green) — built **and** verified in the code repos.
- `Partial` (amber) — partly built; the `<b>…</b>` note says what's missing. **These are the backlog.**
- `Planned` (gray) — not started.

**"What's left to do" = grep `requirement.html` for `status partial` and `status planned`.**

## The task loop (every request)

1. **Locate** the WF/UC/SCR/API/TC **IDs** the request maps to (search `requirement.html`).
2. **Implement** in the correct code repo (see the table below) — follow **that repo's `CLAUDE.md`**.
3. **Verify** (build/tests) in that repo.
4. **Update the status badge + note** for those IDs in `requirement.html` so it reflects reality.
   If you add an endpoint/screen, wire its chip into the item's `.chain` and the Traceability Matrix.
5. If **code and requirement disagree**, this hub is the **plan, not a code mirror** — leave a note /
   flag it here rather than silently changing code or spec.

## Which repo builds what

| Surface | Repo | Stack |
|---------|------|-------|
| Frontoffice web (calendar/bookings/attendance) | `smart-scheduler-front` | Next.js 16 + Mantine v9 |
| Scheduling API | `smart-scheduler-back` | Bun + Hono + Drizzle |
| Backoffice web (wallet/inventory/payroll/reports) | `smart-scheduler-backoffice-front` | Next.js 16 + Mantine v9 |
| Finance/Ops API | `smart-scheduler-backoffice-back` | Bun + Hono + Drizzle |

## Maintaining the hub

- `requirement.html` is **hand-editable** — it's a single static HTML file (status = `<span class="status
  partial|done|planned">`). Small status flips: just edit the badge + the `<b>note</b>`.
- The **★ Graph section** (`#graph`) is **auto-derived at page-load** from each card's `id` + `.chain`
  links (vanilla JS/SVG, zero deps, works offline). **There is no node/edge data to maintain** — add or
  edit a card or a chain chip and the graph reflects it on next open. So keep chains accurate: a missing
  `<a class="chip …" href="#ID">` = a missing edge in the graph. Nodes = `WF/UC/SCR/API/TC/DOC/DIA`;
  status styling (solid/faded/dashed) comes from the card's status badge.
- For larger regeneration (new UCs, re-derive as-built from the running apps), use the
  **`requirement-hub` skill** (`requirement-hub/`). Comments on mockups live in **browser
  localStorage only** — use the mockup's **📋 Copy All / ⬇ Export .md** to hand them to an AI.
- Keep counts in the footer/README roughly in sync when you add items.
- Preserve **Thai** domain terms in user-facing copy.
