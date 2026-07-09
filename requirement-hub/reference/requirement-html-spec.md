# `requirement.html` — Full Spec

The hub page. Single self-contained HTML file (inline `<style>` + `<script>`, no external deps except the `make-front/` mockups it iframes). Language attribute matches the requirement's language (e.g. `lang="th"`).

## Layout

- CSS Grid, two columns: `aside.sidebar` (sticky, dark, ~280px) + `main`.
- **Sidebar contains:** project title; a mini hierarchy-flow diagram (`WF → UC → SCR → API → TC` as colored steps); a color legend; a "how to read the links" box explaining hover-to-highlight; nav links to each section — with the **★ Graph** link first.
- **Main sections, in order:** `#graph` (★ Interactive Graph — see below) → `#overview` (DOC-00x cards for each source file) → `#workflows` → `#usecases` → `#screens` → `#apis` → `#testcases` → `#matrix` → `#diagrams` (PlantUML, DIA-00x).
- The sidebar legend + nav include the **Diagram** entry (`--dia:#0ea5e9`, sky). The matrix footer count includes the DIA total.

## Badges, chips, cards

- `.id-badge` — the entity's own label at the start of its `<h3>` (e.g. `<span class="id-badge uc">UC-004</span>`).
- `.chip` — a pill used inside relationship rows; when it points elsewhere it's an `<a href="#TARGET">`, colored by target type.
- Each `article` gets a left border in its type color (`.uc-card`, `.scr-card`, …) and `scroll-margin-top` so `:target` jumps clear any sticky header.

## Chain component (the heart of visible traceability)

Every Use Case card carries a full chain, not prose:

```html
<div class="chain">
  <a class="chip wf" href="#WF-002">WF-002</a><span class="arrow">&rarr;</span>
  <span class="chip uc active">UC-004</span><span class="arrow">&rarr;</span>
  <a class="chip scr" href="#SCR-004">SCR-004</a><span class="arrow">&rarr;</span>
  <a class="chip api" href="#API-004">API-004</a><span class="arrow">&rarr;</span>
  <a class="chip tc" href="#TC-001">TC-001</a>
</div>
```

- The entity itself renders as `<span class="chip … active">` (no href).
- If a link is missing (e.g. no test yet), render `<span class="chip none">no TC yet</span>` — never leave it blank.
- WF / SCR / API / TC cards use shorter chains showing only their own relationships, but still as colored chips, never plain `[UC-004]` text.

## Hover-to-highlight (required — do not omit)

Auto-derive the ID from `href` or text so nothing needs hand-tagging:

```js
document.querySelectorAll('.id-badge, .chip').forEach(function (el) {
  var id = el.hasAttribute('href')
    ? el.getAttribute('href').replace('#','').trim()
    : el.textContent.trim();
  if (id) el.dataset.linkid = id;
});
function setHl(id, on) {
  document.querySelectorAll('[data-linkid="' + CSS.escape(id) + '"]')
    .forEach(function (m) { m.classList.toggle('hl', on); });
}
document.querySelectorAll('[data-linkid]').forEach(function (el) {
  var id = el.dataset.linkid;
  el.addEventListener('mouseenter', function () { setHl(id, true); });
  el.addEventListener('mouseleave', function () { setHl(id, false); });
});
```

`.hl` must use a visible transform / box-shadow so it's obvious "this spot also refers to the same ID".

## Click-to-jump flash (pure CSS, no JS)

```css
article { scroll-margin-top: 16px; }
article:target { animation: flash 1.8s ease; }
@keyframes flash {
  0%   { box-shadow: 0 0 0 6px rgba(255,196,0,.85); }
  100% { box-shadow: 0 0 0 3px rgba(37,99,235,.35); }
}
```

## Embedded UI mockup toggle (links hub ↔ make-front/)

Every Screen card includes a toggle that lazy-loads the mockup iframe, plus a full-page link:

```html
<div class="ui-toggle-row">
  <button class="ui-btn view-ui-btn" data-target="frame-SCR-001">🖼 View UI Mockup ▾</button>
  <a class="ui-btn" href="make-front/SCR-001.html" target="_blank">↗ Open Full Page</a>
</div>
<div class="ui-frame-wrap" id="frame-SCR-001" hidden>
  <iframe data-src="make-front/SCR-001.html" loading="lazy"></iframe>
</div>
```

Toggle JS sets `iframe.src` from `data-src` only on first open (keeps the page light):

```js
document.querySelectorAll('.view-ui-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var wrap = document.getElementById(btn.dataset.target);
    var hidden = wrap.hasAttribute('hidden');
    if (hidden) {
      wrap.removeAttribute('hidden');
      var f = wrap.querySelector('iframe');
      if (f && !f.getAttribute('src')) f.setAttribute('src', f.dataset.src);
      btn.textContent = '🖼 Hide UI Mockup ▴'; btn.classList.add('open');
    } else {
      wrap.setAttribute('hidden', ''); btn.textContent = '🖼 View UI Mockup ▾'; btn.classList.remove('open');
    }
  });
});
```

`.ui-frame-wrap iframe` should be full width, ~640px tall, no border.

## ★ Graph section (`#graph`, first section)

An auto-derived interactive node graph of the whole ID web, placed at the **top** as the friendly
entry point. It reads the same cards + `.chain` links this page already has — **no data of its own** —
so it can never drift from the chains. Inline `assets/graph.css` into `<style>`, paste the
`assets/graph-section.html` markup (section + sidebar link), and inline `assets/graph.js` before
`</body>`. Features: Flow⇄Web layouts, filter by type/status, search, click-to-focus + jump, customer
mode, PNG export. Full contract, insertion points, and customisation are in **reference/graph-spec.md**.

## Diagrams section (⑧, PlantUML)

Final `#diagrams` section renders the `diagrams/*.puml` set as inline-rendered images via the
plantuml.com server (no build step). Each diagram is a `DIA-00x` card with a chain of chips to the
WF/UC/API it visualizes, a **View source** toggle, an **Open in PlantUML editor** link, and a
**↓ .puml** link. Full authoring + client-side render/encoding + lazy-queue details are in
**reference/diagrams-plantuml-spec.md**.

## Traceability matrix

Final `#matrix` section: a table with columns WF / UC / SCR / API / TC using `rowspan` to reflect the real N-to-N grouping, filled with the same colored chips (not plain text). This is the "one glance, whole system" summary for anyone in a hurry.

## Verify before finishing

- Balanced `<article>`/`</article>` and `<section>`/`</section>` counts (script-count them).
- Exactly one `<!DOCTYPE>` / `</html>`.
- Open in a browser: hover highlights across sections, chip clicks jump + flash, each Screen toggle loads its iframe.
- The ★ Graph renders (node count == number of cards), type/status filters + click-focus + Flow⇄Web + customer mode + PNG all work, and the console is clean.
