# Reference / citation verification track (REF) — granularity-laddered

References are a distinct review target with their own depth. This file is loaded only when
the reference intensity is `standard` or `deep` (see SKILL.md setup). At `off`, the REF
track does not run.

This track is **self-contained** (no other skill is invoked at run time) and uses the web
directly: bibliographic facts are verified by actual lookup, not from memory.

## §0 Top principle: examples are seeds, not checklists

Every concrete example here — a particular missing citation, an arXiv-only entry, a
"following Ref. [x]" mischaracterization — is **one instance** to convey the *kind* of
problem. Do not fixate on the named example. Generalize each to its class across the
**whole bibliography and every citation site**. The bibliography is usually a `.bib` file
plus a `\bibliography{...}`/`thebibliography` block — read it, and read **every**
`\cite`/`\cref` site in the text. Never declare a reference "fine" without saying what you
`checked` and what you did `NOT` check.

## Intensity axis (each level includes the one below it)

- **off** — REF track not run.
- **standard** — **hygiene + placement.** Bibliographic hygiene (missing/duplicate
  citations, correct and complete bib fields, journal-over-arXiv), **verified by real web
  lookup** (§ Verifying bib entries on the web), *and* placement (each citation in the
  right place; our description of a cited work matches what it actually says).
  **Every entry must be web-verified — no sampling, no "representative subset".** A single
  agent runs out of budget and silently checks only a handful (observed: 7 of ~70); when
  running this track, split the bibliography into batches so that, across agents, *all*
  entries are covered. Any entry not actually looked up goes in `NOT-checked`, never quietly
  skipped.
- **deep** — additionally read the cited work itself (fetch the arXiv/journal version via
  `WebFetch`/`WebSearch` when not local) and, for any result or mathematics we *borrow*,
  evaluate whether that borrowed result actually applies to our setting. This is the
  reference∩math overlap and the most expensive level.

## standard — hygiene checklist

- Every statement that needs a citation has one (claims of prior results, datasets,
  methods, "it is known that…", "first shown in…").
- No duplicate bibliography entries (same paper under two keys); no unused entries.
- Each bib entry is correct and complete (authors, title, journal, volume, year, DOI),
  confirmed by web lookup (below).
- **Published over preprint:** if a cited work has appeared in a journal, cite the journal
  version, not the arXiv preprint. Flag arXiv entries that have a published counterpart.
- Consistent citation style; `\cite`/`\cref` used (not hand-written "Ref. [3]"); sensible
  citation order.

### Verifying bib entries on the web (do this, don't trust memory)

Use `WebSearch`/`WebFetch` to confirm each non-trivial entry. Bib metadata is exactly the
kind of thing memory gets subtly wrong, so check it against real sources. Watch the traps:

- **arXiv may show only an older version.** A search might surface the preprint while a
  journal version exists. For an arXiv-only entry, actively search by title/authors for a
  **published version** before concluding none exists.
- **Titles can differ between arXiv and journal.** A title mismatch does **not** by itself
  mean "different paper" — identify the work by authors + year + content, not title string.
- Watch preprint-vs-published confusion, same-name-different-paper, and version-number
  drift. When you cannot confirm an entry, record it as `NOT-checked` rather than guessing.

## standard — placement checklist

- Each citation supports the *specific* sentence it is attached to (not a vaguely related
  paper dropped at a paragraph's end).
- Our characterization of a cited work is faithful: if we say "Ref. [x] proved Y" or
  "following the approach of [x]", that is actually what [x] does. Catch miscitation,
  overstatement of what a reference established, and attribution to the wrong paper.
- Priority/novelty claims ("first to…", "unlike previous work…") are consistent with the
  cited literature.

## deep — read the cited work (reference ∩ math)

- For each result, bound, theorem, or method the paper *borrows* from a reference, fetch
  and read the reference (`WebFetch`/`WebSearch` for the arXiv/journal version when not
  local) and check: do the borrowed result's **assumptions and regime** match our setting?
  Is it applied within its stated validity? Are constants/conditions carried over correctly?
  (Use the embedded equation-audit checklist in `math-verification.md` if the borrowed
  formula is restated.)
- A borrowed result that does **not** obviously apply to our case is a substantive finding —
  `FLAG REF→MV` (and `REF→L0`/`L2` if the central claim leans on it).
- Distinguish "the reference supports this" from "the reference is merely related".
- If a cited work cannot be obtained, record `NOT-checked` and leave the gap visible in
  Coverage — do not let the report read as if everything was read.

## Personas

Hygiene is largely objective (`raised_by: objective`). Placement and deep-read benefit from
the math/rigor personas when the citation concerns a mathematical result (does the borrowed
theorem really apply?). Record `raised_by`; consensus vs split as usual.

## Flags (track connections)

- Borrowed result does not apply to our setting → `FLAG REF→MV`, and `FLAG REF→L0`/`L2` if
  a load-bearing claim depends on it.

## Output

Findings with ids `REF#HYG-###` (hygiene), `REF#PLACE-###` (placement), `REF#DEEP-###`
(deep-read). Same row schema (`id · location · issue · evidence · severity · suggested-fix
· checked · NOT-checked`), with `checked`/`NOT-checked` mandatory and `raised_by` set.
Write to `<run-dir>/findings/REF-<axis>.md` (the run dir is the current
`.pr-review/runs/<YYYY-MM-DD-HHMM>/` chosen for this run).
