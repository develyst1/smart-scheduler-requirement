# ★ Interactive Graph — Spec (the `#graph` section)

A visual node graph that turns the whole ID web (`WF/UC/SCR/API/TC/DOC/DIA`) into something you can
*see, filter, and present* — for **PM** (coverage & backlog), **Dev** (trace a change end-to-end), and
**customer** demos. It sits at the **top** of `requirement.html` as the friendly entry point.

## The one rule that makes it low-maintenance: it is AUTO-DERIVED

`graph.js` builds every node and edge **at page-load from the existing cards**, not from any separate
data:

- **Nodes** = each `main article[id]` whose `id` matches `^(WF|UC|SCR|API|TC|DOC|DIA)-\d+`. Its
  **type** comes from the id prefix, **title** from the `<h3>` (minus the `.id-badge`/`.status` spans),
  **status** from the card's `.status` class (`done` / `partial` / `planned`; DOC/DIA usually have none).
- **Edges** = every `a[href="#ID"]` inside a card that points at another node id (deduped, undirected).
  This captures links in **both directions** (a UC card linking `#API-003`, *and* the API-003 card
  linking `#UC-001`), so the graph mirrors the real N-to-N chains.

**Consequence:** there is **nothing to hand-maintain** in the graph. Edit a card or a chain chip and
the graph reflects it next open. The *only* thing to keep accurate is the **chains themselves** — a
missing `<a class="chip …" href="#ID">` is a missing edge. (This is the same discipline the matrix and
hover-highlight already depend on.)

## What it does (features)

| Control | Behaviour |
|---|---|
| **Flow ⇄ Web** toggle | *Flow* = tidy left→right columns in type order `DOC·WF·UC·SCR·API·TC·DIA` (best for tracing coverage). *Web* = draggable force-directed layout (best for exploring / customer wow). |
| **Type filters** | One colour chip per present type; click to show/hide that type (relayouts + refits). Honours "…และต่างๆ" — every type is a first-class, toggleable node. |
| **Status filters** | Implemented / Partial / Planned toggles. Hiding *Implemented* leaves exactly the **backlog** on screen — the graph doubles as a visual to-do board. |
| **Search** | Dims non-matches by id or title (no relayout). |
| **Click node** | Focus: highlights the node + its neighbours, dims the rest, opens an info panel (status, neighbour chips, **↗ jump to full card**). **Double-click** = jump straight to the card (sets `location.hash`, triggering the card's `:target` flash). |
| **👤 Customer mode** | Swaps node labels to the plain (Thai) title and hides code IDs; cream background — reads well when presenting to the client. |
| **⬇ PNG** | Serialises the current SVG (WYSIWYG, current filters/zoom) → 2× canvas → PNG download. |
| Pan / zoom | Drag background to pan, mouse-wheel to zoom, **⤢ Fit** to reset. |

Status is also encoded on the node itself: **solid** = Implemented, **faded** = Partial,
**dashed outline** = Planned (mirrors the legend box).

## How to add it (3 inline insertions — keep requirement.html single-file)

Do **not** `<link>`/`<script src>` these — inline them so `requirement.html` stays one portable,
offline file (like the hover-highlight and diagrams JS already are):

1. **CSS** — paste the contents of **`assets/graph.css`** into the page's `<style>` block.
2. **Markup** — from **`assets/graph-section.html`**: add the `★` link as the first item in
   `<nav class="side-nav">`, and paste the `<section id="graph">…</section>` as the **first** main
   section (before `#overview`).
3. **JS** — paste the contents of **`assets/graph.js`** inside a `<script>` before `</body>`.

It reuses the shared colour tokens (`--wf/--uc/--scr/--api/--tc/--doc`), so no colour config is needed;
the sky Diagram colour `#0ea5e9` is hard-coded to match `--dia`.

## Portability / customisation knobs

- **Zero deps, offline.** Pure vanilla SVG + JS. No CDN, no build; works from `file://`.
- **Other id schemes.** If a project uses different type prefixes, edit the regex in `graph.js`
  (nodes step) and the `TYPE_ORDER` / `TYPE_META` maps — everything else follows.
- **Language.** Localise the Thai UI strings in `graph-section.html` + the info-panel/labels in
  `graph.js` to the requirement's language.
- Scales fine to ~100+ nodes (this hub: 95 nodes / 150 edges). Flow handles large sets via columns +
  fit; Web via pan/zoom.

## Verify

Serve the repo (static preview server) and open `requirement.html`:

- Graph renders at the top; node count == total cards; toolbar shows one chip per present type.
- Toggle a **type** off → those nodes disappear and it refits. Toggle **Implemented** off → only
  Partial/Planned remain (== the backlog count in the matrix footer).
- **Click** a node → info panel with the right neighbours; **double-click** → jumps + flashes the card.
- **Flow ⇄ Web**, **Customer mode**, **Fit**, and **PNG** all work with no console errors.
