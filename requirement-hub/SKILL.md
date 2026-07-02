---
name: requirement-hub
description: Generates a single-page requirement traceability hub (requirement.html) plus clickable, commentable UI mockups (make-front/SCR-*.html) from raw requirement sources such as PDF, DOCX, or PNG. Use when working in a "*-requirement" repo, or whenever the user wants to build or update a requirement.html, convert requirements into use cases, produce a traceability document linking Workflows to Use Cases to Screens to APIs to Test Cases with unique IDs, scaffold reviewable UI screen mockups, or set up a requirement hub that stands in for the original requirement files. Trigger phrases include "requirement.html", "use case document", "traceability", "make-front", "UI mockup for review", "ศูนย์รวม requirement", or "สร้าง requirement".
---

# Requirement Hub

Turn raw, scattered requirement sources into a **visual, self-contained hub** that any reader (human or AI) can open and understand the whole system from — without ever opening the original PDF/DOCX/PNG again.

You are acting as a **Senior System Analyst + AI-Driven Software Architect**. Output is never plain prose: it is a linked, color-coded, N-to-N traceability graph plus real clickable UI mockups.

## What you produce (two artifacts, always together)

1. **`requirement.html`** — one self-contained page holding every Workflow, Use Case, Screen, API, and Test Case, each with a unique ID, cross-linked so any change can be traced through the whole chain. Relationships must be *visible* (color chips, full chains, hover-to-highlight), not just described in text.
2. **`make-front/`** — a folder of real UI mockups, one `SCR-XXX.html` per screen, embedded into `requirement.html` via iframe and openable full-page. Every mockup carries its own back-link chain and an in-page comment box so reviewers can leave UI feedback that an AI can later read and act on.

These two together must be able to **replace the original requirement files** as the reference of record.

## Multi-repo context

Each project has three repos open together in one VS Code window:

| Repo | Role |
|---|---|
| `<project>-front` | real Frontend source |
| `<project>-back` | real Backend source |
| `<project>-requirement` | **where this skill runs** — original requirement files + `requirement.html` + `make-front/` |

Rules:
- Original requirement files stay untouched at the repo root; they are the "first read" source of truth only.
- `requirement.html` + `make-front/` are the maintained outputs.
- If `-front`/`-back` are open too, you may cross-check which SCR/API are implemented and annotate status — but **`requirement.html` stays the planning source of truth**. Never silently rewrite requirements to match current code; flag mismatches for the user instead.

## The 5-level hierarchy (never skip a level)

`WF → UC → SCR → API → TC`

| ID | Entity | Note |
|---|---|---|
| `WF-00x` | Workflow | end-to-end process, contains many UCs |
| `UC-00x` | Use Case | **the hub entity** — its card shows the full `WF→UC→SCR→API→TC` chain |
| `SCR-00x` | Screen / UI | must have a real mockup file in `make-front/` |
| `API-00x` | Backend endpoint | connects a screen to data |
| `TC-00x` | Test Case | always references back to a UC and a SCR |
| `DOC-00x` | Source doc | each original requirement file you read (PDF/DOCX/PNG) |

Numbering runs continuously *within* each type. **Never renumber existing IDs** — new items append to the running number.

## Color system (identical across every file, meaning is fixed)

```css
--wf:  #d97706;  /* Workflow  - amber  */
--uc:  #2563eb;  /* Use Case  - blue   */
--scr: #059669;  /* Screen    - green  */
--api: #7c3aed;  /* API       - violet */
--tc:  #e11d48;  /* Test Case - rose   */
--doc: #64748b;  /* Source doc ref - slate */
```

A given ID type uses its color everywhere it appears — badge, card border, chip, table header — so the eye maps color → entity type instantly.

## Deliverable structure

```
<project>-requirement/
├── (original requirement files — do not edit)
├── requirement.html
└── make-front/
    ├── assets/
    │   ├── style.css      ← copy from this skill's assets/ (shared design system)
    │   └── comments.js    ← copy from this skill's assets/ (shared comment engine)
    ├── SCR-001.html       ← one file per screen, based on assets/SCR-template.html
    ├── SCR-002.html
    └── ...
```

`assets/style.css`, `assets/comments.js`, and `assets/SCR-template.html` are **bundled in this skill** — copy them into the project's `make-front/assets/` as the baseline, then fill mockups from the template. This keeps every project visually consistent.

## Workflow (summary)

**Cold start (new `-requirement` repo):**
1. Read every original requirement file (PDF via Read tool ≤20 pages/call; DOCX via python-docx; PNG via Read tool). Assign each a `DOC-00x`.
2. Extract Workflows first, then break down into UC → SCR → API → TC and assign IDs.
3. Draft the UC↔SCR↔API↔TC mapping (drives the chain components and the matrix).
4. Generate `requirement.html` per **reference/requirement-html-spec.md**.
5. Copy `assets/style.css` + `assets/comments.js` into `make-front/assets/`.
6. Generate one `make-front/SCR-XXX.html` per screen per **reference/mockup-and-comments-spec.md**.
7. Verify: balanced tags, hover-highlight works, iframe toggles load, comment box saves.

**Incremental update / new screen:** append new IDs (never renumber), update the affected UC chains + matrix, add the new mockup file and its toggle block in `requirement.html`. If the user pastes copied/exported comments from a mockup, treat them as new requirements and fix both the mockup and (if impacted) `requirement.html`.

Full step-by-step is in **reference/execution-workflow.md**.

## Reference files (read on demand)

- **reference/requirement-html-spec.md** — exact layout, chain component, hover-highlight JS, `:target` flash, embedded-iframe toggle, traceability matrix.
- **reference/mockup-and-comments-spec.md** — required structure of each `SCR-XXX.html`, the mockup building blocks, and the comment-system contract (storage, Copy All / Export .md, and the localStorage limitation to warn the user about).
- **reference/execution-workflow.md** — the detailed cold-start and incremental checklists, plus how to handle `-front`/`-back` cross-checking.
- **assets/style.css**, **assets/comments.js**, **assets/SCR-template.html** — copy-in baselines.
