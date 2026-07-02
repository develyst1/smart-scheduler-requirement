# `make-front/SCR-XXX.html` + Comment System — Full Spec

One mockup file per Screen. Each is a standalone, openable-via-`file://` page that also embeds cleanly inside `requirement.html` as an iframe.

## Required structure of every mockup

1. `<body data-page-id="SCR-XXX">` — binds the page to `comments.js` (its localStorage key).
2. `<link rel="stylesheet" href="assets/style.css">` — relative path so it works both standalone and iframed.
3. **Top bar** (`header.mockup-top`):
   - `← Back to Requirement Hub` linking to `../requirement.html#SCR-XXX`.
   - The screen's own chain as chips (`WF → UC → SCR(active) → API → TC`), every chip linking back to `../requirement.html#<ID>`.
4. **Device frame** (`div.device-frame`): a faux browser window (colored dots + fake URL bar) wrapping the real UI. Build the UI from the shared components in `style.css`:
   - `.mk-toolbar`, `.mk-btn` (`.primary/.success/.danger/.ghost/.amber/.violet`)
   - `.mk-tabs` / `.mk-tab.active`
   - `.mk-grid` + `.mk-field` + `.fake-input` (`.filled` / `.disabled`)
   - `table.mk-table`
   - `.badge-pill` (`.green/.amber/.red/.blue/.gray`)
   - `.kpi-row` / `.kpi-card`
   - `.flow-row` / `.flow-box` (`.hl`) — for step/sequence diagrams
   - `.note-box` (`.info` / `.danger`)
5. **Comment panel** (`section.comments-panel`) at the bottom — identical across files (see contract below).
6. `<script src="assets/comments.js"></script>` before `</body>`.

## Mockups must reflect real business logic

A mockup is not a generic empty form. It must visibly encode the rules from the requirement, e.g.:
- a strict-sequence document screen shows a numbered timeline that must not skip;
- a credit-note screen shows a **required** reference-to-original field and a running-balance calculation;
- a reconciliation screen shows system-side vs bank-side lines being matched;
- an approval-config screen shows the actual approval chain for that company's business logic.

Use realistic sample data (real-looking names, amounts, dates, IDs) so reviewers react to something concrete.

## Comment panel markup (copy into every file)

```html
<section class="comments-panel">
  <h2>💬 Feedback / Comments <span id="commentCount" class="count-badge"></span></h2>
  <p class="hint">คอมเมนต์บันทึกในเบราว์เซอร์นี้ (localStorage) เฉพาะไฟล์นี้ — กด "Copy All"
     เพื่อคัดลอกไปวางในแชทกับ AI หรือ "Export .md" เพื่อดาวน์โหลดไว้ให้ AI อ่านตอนแก้ UI</p>
  <textarea id="commentInput" placeholder="เช่น: อยากให้ย้ายปุ่มนี้... (Ctrl+Enter เพื่อส่ง)"></textarea>
  <div class="c-toolbar">
    <button id="addCommentBtn" class="btn primary">+ Add Comment</button>
    <button id="copyBtn" class="btn">📋 Copy All</button>
    <button id="exportBtn" class="btn">⬇ Export .md</button>
  </div>
  <div id="commentList"></div>
</section>
```

## Comment-system contract (`assets/comments.js`)

- Storage key = `'<prefix>-ui-comments::' + document.body.dataset.pageId` in `localStorage`; naturally isolated per screen.
- Supports: add, mark-done, reopen, delete; live open/total count badge.
- **Copy All** → formatted text to clipboard (fastest path for a reviewer to paste back into an AI chat).
- **Export .md** → downloads `SCR-XXX-feedback.md` (for saving a file the AI can read later).
- `Ctrl/Cmd+Enter` in the textarea submits.

## The limitation you must always state to the user

Comments live only in the browser's `localStorage` for that one file — they are **not** written back into the HTML on disk, so an AI can't see them just by reading the file. The reviewer must **Copy All** (paste into chat) or **Export .md** (and tell the AI to read it). There is no backend auto-sync. Whenever you hand off mockups for review, remind the user of this so feedback actually makes it back.

## Filling the template

`assets/SCR-template.html` is a ready skeleton with `{{PLACEHOLDER}}` tokens (screen id, title, chain IDs, canvas body). Copy it to `make-front/SCR-XXX.html`, replace tokens, and build the device-canvas body. Keep the top bar, comment panel, and script include exactly as templated.
