---
name: requirement-hub
description: Generates a single-page requirement traceability hub (requirement.html) — including an auto-derived interactive node graph — plus clickable, commentable UI mockups (make-front/SCR-*.html) and PlantUML architecture diagrams (diagrams/*.puml) from raw requirement sources such as PDF, DOCX, or PNG — or, when the project's real app already exists, reverse-engineered as-built from the running code/UI. Use when working in a "*-requirement" repo, or whenever the user wants to build or update a requirement.html, convert requirements into use cases, produce a traceability document linking Workflows to Use Cases to Screens to APIs to Test Cases with unique IDs, add or improve the interactive requirement graph / node map, scaffold reviewable UI screen mockups, add PlantUML diagrams (context / use-case / ERD / state / sequence), or set up a requirement hub that stands in for the original requirement files. Trigger phrases include "requirement.html", "use case document", "traceability", "graph node", "node graph", "แผนผังกราฟ", "make-front", "UI mockup for review", "plantuml", "diagram", "as-built", "ศูนย์รวม requirement", or "สร้าง requirement".
---

# Requirement Hub

Turn raw, scattered requirement sources — **or an existing, already-built project** — into a **visual, self-contained hub** that any reader (human or AI) can open and understand the whole system from, without opening the original PDF/DOCX/PNG or reading the codebase.

You are acting as a **Senior System Analyst + AI-Driven Software Architect**. Output is never plain prose: it is a linked, color-coded, N-to-N traceability graph, real clickable UI mockups, and PlantUML diagrams.

## Two modes — know which one you're in

| Mode | When | How mockups are drawn |
|---|---|---|
| **Greenfield (spec-first)** | Only requirement files exist; app not built yet | Mockups are designed from the written rules (wireframe fidelity) |
| **As-built (reverse-requirement)** | The real `-front`/`-back` app already exists (common — requirements are often written *after* the project starts) | Mockups are **drawn from the running app**: read its UI framework + components, log in, screenshot, and reproduce the real look. Tag them `as-built`. Screens not yet built are tagged `Planned`. |

Always check first whether the sibling `-front`/`-back` repos contain a real app. If they do, prefer **as-built** — it's the honest, high-value output (see **reference/as-built-mockups-spec.md**).

## What you produce (three artifacts, kept in sync)

1. **`requirement.html`** — one self-contained page holding every Workflow, Use Case, Screen, API, Test Case, and Diagram, each with a unique ID, cross-linked so any change traces through the whole chain. Relationships are *visible* (color chips, full chains, hover-to-highlight), not just described. It opens with an **★ Interactive Graph** — an auto-derived node map (Flow ⇄ Web, filter by type/status, click-to-focus, customer mode, PNG export) that reads the same cards + chains, so it never needs its own data. See **reference/graph-spec.md**.
2. **`make-front/`** — real UI mockups, one `SCR-XXX.html` per screen, embedded into `requirement.html` via iframe and openable full-page. Each carries its own back-link chain and an in-page comment box for reviewer feedback an AI can later act on.
3. **`diagrams/`** — PlantUML source (`DIA-XXX`, `*.puml`) for architecture/behavior views (context, use-case, ERD, state machine, sequence), rendered inside `requirement.html`'s Diagrams section. See **reference/diagrams-plantuml-spec.md**.

These together must be able to **replace the original requirement files** as the reference of record.

## Multi-repo context

Each project has several repos open together in one VS Code window:

| Repo | Role |
|---|---|
| `<project>-front` | real Frontend source (read it — it's the source of truth for as-built mockups) |
| `<project>-back` | real Backend source (read it for real entities, enums, endpoints → ERD/state/sequence diagrams) |
| `<project>-requirement` | **where this skill runs** — original requirement files + `requirement.html` + `make-front/` + `diagrams/` |

Rules:
- Original requirement files stay untouched at the repo root; they are the "first read" source of truth only.
- `requirement.html` + `make-front/` + `diagrams/` are the maintained outputs.
- When `-front`/`-back` are open, cross-check what's implemented and annotate status (**Implemented / Partial / Planned**). Draw as-built mockups + diagrams from the real code. But **`requirement.html` stays the planning source of truth** — never silently rewrite requirements to match code; flag mismatches for the user.

## The hierarchy (never skip a level)

`WF → UC → SCR → API → TC` (+ `DIA` cross-cutting, + `DOC` sources)

| ID | Entity | Note |
|---|---|---|
| `WF-00x` | Workflow | end-to-end process, contains many UCs |
| `UC-00x` | Use Case | **the hub entity** — its card shows the full `WF→UC→SCR→API→TC` chain |
| `SCR-00x` | Screen / UI | must have a real mockup file in `make-front/` |
| `API-00x` | Backend endpoint | connects a screen to data |
| `TC-00x` | Test Case | always references back to a UC and a SCR |
| `DIA-00x` | Diagram | a PlantUML view in `diagrams/`; references the WF/UC/API it visualizes |
| `DOC-00x` | Source doc | each original requirement file you read (PDF/DOCX/PNG) |

Numbering runs continuously *within* each type. **Never renumber existing IDs** — new items append.

## Color system (identical across every file, meaning is fixed)

```css
--wf:  #d97706;  /* Workflow  - amber  */
--uc:  #2563eb;  /* Use Case  - blue   */
--scr: #059669;  /* Screen    - green  */
--api: #7c3aed;  /* API       - violet */
--tc:  #e11d48;  /* Test Case - rose   */
--dia: #0ea5e9;  /* Diagram   - sky    */
--doc: #64748b;  /* Source doc ref - slate */
```

A given ID type uses its color everywhere it appears — badge, card border, chip, table header — so the eye maps color → entity type instantly.

## Deliverable structure

```
<project>-requirement/
├── (original requirement files — do not edit)
├── requirement.html      ← hub page; opens with the ★ Graph (graph.css + graph.js inlined, no separate file)
├── make-front/
│   ├── assets/
│   │   ├── style.css      ← copy from this skill (hub chrome + comment panel)
│   │   ├── comments.js    ← copy from this skill (comment engine)
│   │   └── app-skin.css   ← copy from this skill (as-built app shell/components — Mantine-like)
│   ├── SCR-001.html       ← one file per screen, from assets/SCR-template.html
│   └── ...
└── diagrams/
    ├── README.md          ← how to view/regenerate
    ├── 01-system-context.puml
    ├── 02-usecases.puml
    ├── 03-erd.puml
    ├── 04-<state>.puml
    └── 05-…-seq.puml
```

`assets/style.css`, `assets/comments.js`, `assets/app-skin.css`, and `assets/SCR-template.html` are **bundled in this skill** — copy them into the project's `make-front/assets/` as the baseline. This keeps every project visually consistent.

The graph is also bundled: **`assets/graph.css`**, **`assets/graph.js`**, **`assets/graph-section.html`**. Unlike the mockup assets these are **inlined into `requirement.html`** (not linked, not copied into `make-front/assets/`) so the hub stays one portable, offline file. See **reference/graph-spec.md**.

## Workflow (summary)

**Cold start (new `-requirement` repo):**
1. **Detect mode.** Check whether `-front`/`-back` hold a real app. If yes → as-built; else → greenfield.
2. Read every original requirement file (PDF via Read ≤20 pages/call; DOCX via python-docx; PNG via Read). Assign each a `DOC-00x`.
3. Extract Workflows → UC → SCR → API → TC and assign IDs. Draft the N-to-N mapping (drives chains + matrix).
4. Generate `requirement.html` per **reference/requirement-html-spec.md** (incl. the **★ Graph** section at the top and the **⑧ Diagrams** section). Inline `assets/graph.css` + `assets/graph.js` and paste the `assets/graph-section.html` markup per **reference/graph-spec.md** — the graph auto-derives from the cards, so it needs no data.
5. Copy `assets/style.css` + `assets/comments.js` (+ `app-skin.css` for as-built) into `make-front/assets/`.
6. Generate one `make-front/SCR-XXX.html` per screen. **As-built:** run the app, log in, screenshot each screen, read its components, reproduce with `app-skin.css` (per **reference/as-built-mockups-spec.md**). **Greenfield:** build from `assets/SCR-template.html` per **reference/mockup-and-comments-spec.md**.
7. Author `diagrams/*.puml` from the real backend schema/routes (or the spec) per **reference/diagrams-plantuml-spec.md**; embed + render them in the Diagrams section.
8. Verify: balanced tags; hover-highlight; **★ Graph renders (node count == cards) with type/status filters, click-focus, Flow⇄Web, customer mode, PNG all working, no console errors**; iframe toggles load; comment box saves; every diagram renders without PlantUML errors.

**Incremental update / new screen:** append new IDs (never renumber), update affected UC chains + matrix, add the mockup + its toggle block, add/refresh any impacted diagram. **The graph needs no manual update** — it re-derives from the new card + chains automatically; just keep the chains accurate. If the user pastes copied/exported comments from a mockup, treat them as new requirements and fix both the mockup and (if impacted) `requirement.html`.

Full step-by-step is in **reference/execution-workflow.md**.

## Reference files (read on demand)

- **reference/requirement-html-spec.md** — layout, chain component, hover-highlight JS, `:target` flash, embedded-iframe toggle, traceability matrix, **Graph section**, **Diagrams section**.
- **reference/graph-spec.md** — the **★ Interactive Graph**: how it auto-derives nodes/edges from cards + chains, its features (Flow⇄Web, type/status filters, click-focus, customer mode, PNG), the 3 inline insertion points, and customisation knobs.
- **reference/mockup-and-comments-spec.md** — structure of each `SCR-XXX.html`, mockup building blocks, and the comment-system contract (storage, Copy All / Export .md, localStorage limitation).
- **reference/as-built-mockups-spec.md** — how to reverse-engineer mockups from a running app (detect stack, run + log in with preview/browser tools, screenshot, reproduce with `app-skin.css`, tag `as-built` vs `Planned`).
- **reference/diagrams-plantuml-spec.md** — which diagrams to produce, how to author `.puml`, and how to render them in `requirement.html` via the plantuml.com server (`~h` hex, no build step).
- **reference/execution-workflow.md** — detailed cold-start and incremental checklists, plus `-front`/`-back` cross-checking.
- **assets/style.css**, **assets/comments.js**, **assets/app-skin.css**, **assets/SCR-template.html** — copy-in baselines for `make-front/`.
- **assets/graph.css**, **assets/graph.js**, **assets/graph-section.html** — the ★ Graph, **inlined into `requirement.html`** (not linked). Generic + auto-deriving; reused as-is across projects.
