# PlantUML Diagrams — Spec (`diagrams/` + the ⑧ Diagrams section)

Architecture/behavior views that complement the ID graph. Source of truth = `.puml` files in
`diagrams/`; `requirement.html` embeds a copy of each and renders it via the public
plantuml.com server (no build step, no local Java needed).

## Which diagrams to produce (typical set, DIA-001…)

Pick the ones that fit the system; a good default covering most projects:

| ID | File | Type | Draw from |
|---|---|---|---|
| DIA-001 | `01-system-context.puml` | component/deployment | repos, services, DB schemas, external channels |
| DIA-002 | `02-usecases.puml` | use case | actors → UC-00x (grouped), matches section ③ IDs |
| DIA-003 | `03-erd.puml` | ERD (entity + crow's-foot) | the **real backend schema** (tables, enums, relations) |
| DIA-004 | `04-<domain>-state.puml` | state machine | a core status enum's lifecycle |
| DIA-005+ | `05-…-seq.puml` | sequence | the key workflows (one per important WF) |

Reference the ID graph in titles/notes (e.g. `WF-002`, `UC-005`, `API-006`) so diagrams and the
hub cross-link by eye.

## Authoring rules

- Keep each file valid standalone: `@startuml` … `@enduml`.
- **Sequence diagrams:** participants only via `participant/actor/database/boundary/control/entity/collections/queue`. `cloud`/`node`/`[component]` are **only** for component/deployment/use-case diagrams — using `cloud` in a sequence diagram is a syntax error (common mistake).
- Use `skinparam shadowing false` and a title. For ERDs use `hide circle` + `entity` with `||--o{` crow's-foot relations; mark planned/cross-schema links with dashed `..>` + a note.
- Draw ERD/state/sequence from the **real code** when it exists (schema enums, route names), not from imagination — that's what makes them trustworthy.
- Add a `diagrams/README.md` listing DIA-xxx ↔ file ↔ type, and how to view (VS Code PlantUML extension / `java -jar plantuml.jar -tsvg diagrams/*.puml`).

## Rendering in requirement.html (client-side, no build)

Each diagram is a card in the **⑧ Diagrams (PlantUML)** section. Embed the source inline in a
`<script type="text/plantuml">` block (readable + reviewable), and render it to an `<img>` by
hex-encoding the source and hitting the plantuml.com server with the `~h` prefix:

```js
var PLANTUML_BASE = 'https://www.plantuml.com/plantuml';
function pumlHex(text){
  var b = new TextEncoder().encode(text), h = '';
  for (var i=0;i<b.length;i++) h += b[i].toString(16).padStart(2,'0');
  return '~h' + h;                       // hex encoding — no deflate/base64 needed
}
// img.src = PLANTUML_BASE + '/svg/' + pumlHex(code)
// editor  = PLANTUML_BASE + '/uml/' + pumlHex(code)
```

Card structure per diagram:
- `<h3>` with `<span class="id-badge dia">DIA-00x</span>` + title, a `.chain` of chips to the WF/UC/API it visualizes.
- Tools row: **View source** (toggle the inline `<pre>`), **Open in PlantUML editor** (`/uml/` URL), **↓ .puml** (link to the file).
- A `.dia-view` container the script fills with the rendered `<img>`.

Render **lazily / bounded-concurrency** (a small queue, ~2 at a time) — plantuml.com renders each
SVG server-side and is slow/rate-limited; firing all at once stalls. Detached `new Image()` objects
ignore `loading="lazy"`, and IntersectionObserver may not fire in a headless preview, so use a queue
that chains on each image's `onload`/`onerror`. Provide an `onerror` fallback message (needs internet).

## Hub wiring

- Add a `--dia:#0ea5e9` token; `.id-badge.dia` / `.chip.dia` use it.
- Add the section to the sidebar nav and a legend row.
- Update the count summary + matrix footer to include the DIA total.

## Verify

- Serve the repo and confirm every diagram renders (check the returned SVG has no
  "syntax error" / "[From string" text — a tiny image usually means a PlantUML error).
- Confirm View-source and the editor link work.
