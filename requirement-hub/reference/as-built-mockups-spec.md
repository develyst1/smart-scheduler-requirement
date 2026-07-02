# As-Built Mockups — Reverse-Engineering from a Running App

Requirements are often written **after** the project already started. When the real
`-front`/`-back` app exists, the highest-value mockups are **as-built**: drawn from the
running app so `make-front/SCR-*.html` mirrors what actually ships — not an imagined wireframe.

Goal: a reader compares the mockup side-by-side with the live screen and they match.

## 1. Detect the stack (read, don't guess)

From `<project>-front`:
- `package.json` → framework + UI library (e.g. Next.js + Mantine, Vite + AntD, etc.), package manager.
- Theme/provider (colors, radius, shadows) — e.g. `MantineProviders.tsx`, `tailwind.config.ts`, a theme file.
- Route/page list (`src/app/**/page.tsx` or router config) → the real screen inventory → SCR mapping.
- Layout components (sidebar/header nav config), and each feature's `*Content` + modal components.
- Domain constants: status/type **labels + color maps**, enums, quotas (often in `types/**`).

From `<project>-back`:
- DB schema (entities, enums, relations) → ERD + state diagrams.
- Route handlers → API list + sequence diagrams.

`assets/app-skin.css` (bundled in this skill) already reproduces a calm Mantine-style shell
(sidebar+header, cards, badges, inputs, calendar grid, ring, KPI, switches). Adjust its
`:root` tokens to the target app's real palette (copy hex from the theme/tailwind config).

## 2. Run the app and capture the real screens

Use the **preview_* tools** (never Bash/claude-in-chrome for running the dev server):
1. Add configs to `.claude/launch.json` (backend + frontend). Start backend first if the FE needs it, or set the app's mock/offline env flag.
2. `preview_start` the frontend; wait for compile; `preview_eval` `location.href='/login'`.
3. Log in with the credentials the user gives (controlled inputs need real events — set value via the native setter + dispatch `input`/`change`, then click submit; a plain `.value=` won't update React state).
4. Navigate each route; `preview_screenshot` + `preview_snapshot`/`preview_inspect` to record exact layout, text, and colors. Open modals/edge states too.
5. Read the matching component source to get conditional states, button labels, and field order right.

Prefer real seeded data for authenticity; if a screen is empty, reproduce it populated using the component's known structure + real color system (legitimately "as-built" — it's how the component renders when it has data).

## 3. Reproduce with app-skin.css

- Wrap the canvas in `.device-canvas.app` → `.app-shell` (sidebar + header + content), matching the real nav items, active state, page title, and the user/avatar/logout header.
- Rebuild each screen's content with the `.m-*`/`.cal-*`/`.kpi`/`.ring` components. Match the real **status→color** mapping exactly (read it from the code, don't eyeball screenshots — light-tint badges can look like the wrong hue).
- Inline small lucide-style SVGs for icons the real app uses.
- Keep the requirement-hub chrome (`mockup-top` chain, `note-box`, comment panel) — only the `.device-canvas` interior changes.
- Tag it: put `<span class="as-built">as-built</span>` in the `screen-sub` and note the real route + framework (e.g. "วาดจากแอปจริง · /scheduler/calendar · Next.js + Mantine").

## 4. Be honest about what isn't built (Planned)

Screens with **no** real UI yet (greenfield sub-apps, LINE/native surfaces, unfinished modules)
must not masquerade as as-built. Keep a conceptual mockup but add a clear banner:

```html
<div class="note-box danger"><b>⏳ Planned / ยังไม่มี UI จริง:</b> ต่างจาก as-built screens —
หน้านี้เป็น mockup เชิงแนวคิด · <reason: repo greenfield / รอ deploy / API only></div>
```

Reflect the split in the `requirement.html` status badges (**Implemented / Partial / Planned**)
and, if helpful, in the README (which SCR are as-built vs planned).

## 5. Verify

- Serve `make-front/` (or the whole `-requirement` repo) with a static server via `preview_start` and screenshot each rewritten SCR; compare against the live-app screenshot.
- Confirm the comment panel still works and the back-link returns to the hub anchor.
- Do **not** edit the real `-front`/`-back` source — you only read it. The only app-side change allowed is adding a `.claude/launch.json` entry to preview it.
