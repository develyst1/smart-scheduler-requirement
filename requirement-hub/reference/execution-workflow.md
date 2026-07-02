# Execution Workflow — Detailed Checklists

## A. Cold start (fresh `-requirement` repo)

1. **Inventory & read sources.** List the original requirement files at repo root. Read all of them:
   - PDF → Read tool directly (≤20 pages per call; page through if longer).
   - DOCX → extract text with `python-docx` (install if missing) — pull paragraphs *and* tables.
   - PNG/diagram → Read tool (it shows the image); transcribe the meaningful content.
   Assign each source a `DOC-00x` and record it in the `#overview` section.

2. **Extract the hierarchy.** Find the big end-to-end Workflows first. Under each, enumerate Use Cases (by actor/role). For each UC, identify the Screen(s), the API(s) behind them, and the Test Case(s). Assign continuous IDs per type.

3. **Draft the mapping.** Before writing HTML, sketch the UC ↔ SCR ↔ API ↔ TC relationships (a scratch table). This drives both the chain components and the final matrix. Get N-to-N links right here.

4. **Generate `requirement.html`** per `reference/requirement-html-spec.md` — sidebar, all sections, chain on every UC card, hover-highlight JS, `:target` flash, embedded UI toggles on every SCR card, matrix.

5. **Seed `make-front/assets/`.** Copy this skill's `assets/style.css` and `assets/comments.js` into `<project>-requirement/make-front/assets/`. (Optionally rename the comment-key prefix in `comments.js` to the project code to avoid `file://` localStorage collisions across projects.)

6. **Generate every mockup.** One `make-front/SCR-XXX.html` per screen from `assets/SCR-template.html`, per `reference/mockup-and-comments-spec.md`. Encode the real business rules; use realistic sample data. Don't forget the comment panel + script include.

7. **Verify.**
   - Count-check balanced `<article>`/`<section>` tags and a single DOCTYPE/`</html>` in `requirement.html`.
   - Open `requirement.html` in a browser: hover highlights cross-section, chip clicks jump+flash, each Screen toggle loads its iframe.
   - Open one mockup standalone: comment add/copy/export works, back-link returns to the hub anchor.

8. **Hand off with the localStorage caveat.** Tell the user how comments flow back (Copy All / Export .md → paste/attach to chat).

## B. Incremental update / new screen

1. **Never renumber.** Existing IDs are stable references. New items append to the running number (if `SCR-014` exists, the next is `SCR-015`).
2. Update the affected Use Case card's chain + the corresponding matrix row(s).
3. Create the new `make-front/SCR-XXX.html` from the template (comment panel included).
4. Add the toggle block (button + iframe wrap) to that Screen's card in `requirement.html`.
5. If the user pastes comments copied/exported from a mockup, treat them as new requirements: fix the mockup, and if they change behavior, update the matching UC/API/TC content and chains in `requirement.html` too. Keep both in sync.

## C. When `-front` / `-back` are open in the same window

- You may cross-check which SCR/API are actually implemented and annotate status on the card (e.g. a small `Implemented` vs `Pending` badge).
- **Do not** edit or delete requirement content to match the current code. `requirement.html` is the plan, not a mirror of the code.
- If code and requirement disagree, surface it as a note for the user to decide — don't resolve it silently.

## D. Invocation phrasing (what triggers this skill)

New project:
> "อ่าน skill นี้ แล้วสร้าง requirement.html + make-front จากไฟล์ requirement ที่มีอยู่ใน repo นี้"

Add to existing:
> "เพิ่ม Screen ใหม่ SCR-0XX ตาม requirement ที่เพิ่มมา พร้อมอัปเดต chain ใน requirement.html"

Process feedback:
> "นี่คือคอมเมนต์จากหน้า SCR-0XX: <วาง> — ช่วยแก้ตาม"
