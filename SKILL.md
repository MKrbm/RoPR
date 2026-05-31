---
name: pr-review
description: Pre-submission consistency audit for Physical Review manuscripts (PR, PRL, PRA, PRB, PRX, PRE, PRD, PRResearch). Use this skill whenever the user wants their physics paper reviewed, audited, or consistency-checked before submitting — "review my paper before I submit", "check this manuscript for inconsistencies", "audit my PRL draft", "is my paper internally consistent", "find problems in main.tex before submission", "整合性チェック", "投稿前レビュー". It reads the manuscript at seven abstraction levels (whole-paper down to symbols), embeds several reviewer personas at the higher levels, and produces a structured report of inconsistencies to fix. It reports only; it does not rewrite the manuscript and does not give an accept/reject verdict. Prefer this over a generic "review my paper" pass whenever the goal is a thorough internal-consistency audit of a physics manuscript.
---

# PR-review — hierarchical pre-submission consistency audit

PR-review audits a Physical Review manuscript for **internal consistency** and produces
a report of what the author should fix before submitting. It does **not** simulate
referees, does **not** output accept/reject, and does **not** rewrite the manuscript.

## §0 Top principle: examples are seeds, not checklists

Every concrete example in this skill and its references is **one instance**, never an
exhaustive list. Its job is to convey the *kind* of problem to look for. When you run a
level, take the example, understand the class it represents, and **generalize it across
the whole manuscript** — find instances the example never named.

- Wrong: the doc says `d` is used for both dimension and distance, so you only check `d`.
- Right: from that example you understand "one symbol carrying several meanings", and
  you check *every* symbol for it.

This applies to every level, every aspect, every persona. It is the single most
important instruction here.

## Why this is hierarchical

Asking for "a review" in one pass collapses everything — global argument, flow, English,
terminology, symbols, equations, figures — and quality drops: the model chases typos and
loses the argument, or follows the argument and misses index drift. So PR-review reads at
**one abstraction level at a time**, from the largest unit to the smallest.

## Inputs and setup (do this first)

1. **Model choice — ASK THE USER FIRST.** Before running the audit, ask which model to
   run the level/persona agents on, because the cost/quality trade-off is large and it is
   the user's call. Offer:
   - **Opus 4.8** (`model: 'opus'`) — highest quality, best for L5 math/proofs and L0
     claim judgment; slower and more tokens.
   - **Sonnet** (`model: 'sonnet'`) — balanced.
   - **Haiku** (`model: 'haiku'`) — fast and cheap for a first-pass scan; weaker on math.
   A reasonable default to suggest: Opus for a serious pre-submission audit, Haiku for a
   quick look. When the audit runs as a Workflow, pass the chosen model to every `agent()`
   call (do not rely on the Explore default, which falls back to a light model). Carry the
   choice through all levels and the synthesizer.
1b. **Math (MV) and reference (REF) intensity — ASK (or read from arguments).** These two
   tracks run in addition to L0–L6 and vary a lot in cost, so let the user set each one.
   They can be passed as arguments (e.g. `--math=deep --ref=standard`); if not passed, ask
   before running. They are **independent axes**, each with three settings where a setting
   includes the one below it:
   - **Math** — `off` (do not run the MV track; only the objective L5 formal-consistency
     floor applies) / `standard` (follow every load-bearing equation, theorem/proof, **and
     inline/intermediate expression**, checking at all granularities that the prose is
     actually guaranteed by the math, and being adversarially skeptical of math that looks
     fine but may not be) / `deep` (additionally try to *prove* any step you cannot follow,
     using standard knowledge; reach into references for borrowed results). Method and the
     embedded equation-audit checklist live in `references/math-verification.md` — read it
     when the math intensity is `standard` or `deep`.
   - **Reference** — `off` (skip references) / `standard` (citation hygiene —
     missing/duplicate citations, correct bib fields, journal over arXiv — **verified by
     real web lookup**, plus placement: each citation in the right place and our
     description of a cited work matches what it says) / `deep` (additionally fetch and read
     the cited works and check whether borrowed results actually apply to our setting).
     Detail lives in `references/reference-check.md` — read it when the reference intensity
     is `standard` or `deep`.
   Suggested defaults (mathematics is ~half of a physics review): **math = `standard`,
   reference = `standard`**; recommend `math=deep` / `ref=deep` for a serious pre-submission
   audit, and `math=off` / `ref=off` for a quick look.
2. **Manuscript:** read the main `.tex` and any `\input`/`\include` files in full (the
   entry file is often `main.tex`, but use whatever the manuscript provides). Note where
   the bibliography lives (`.bib` file and/or a `thebibliography` block).
3. **Target journal:** ask or infer (PR family vs PRL). Always apply
   `references/PR.md`. If the target is PRL, also layer `references/PRL.md`. Mechanical
   prose/equation rules are in `references/style.md` (used at L5/L6 and prose levels).
   Writing craft — paragraph architecture, sentence rhythm, calibrated register, what
   counts as good scientific English — is **not** a single shared rulebook here. It is
   carried by the personas: each persona card states that reviewer's own prose taste, so
   that at L3/L4 you get a *spread* of judgments on writing rather than one house style.
4. **Figures:** the paper references figures via `\includegraphics`. The `.tex` does not
   show what a figure contains — when a level needs to judge a figure, **open and read
   the referenced figure file** (the PDFs/PNGs the manuscript points to, wherever it keeps
   them — e.g. a `figures/` or `plots/` directory) as an image.
5. **Persona selection:** personas live in `personas/` and apply only at L0–L4. Do not
   run all of them. Pick the few whose expertise is closest to *this* manuscript's topic
   and to the level — see `personas/README.md`, which lists each persona's domain and how
   to match them to a paper. Read the selected cards before using them.

## The seven levels (analysis unit per level)

Run them in order, L0 → L6. The analysis unit is "what you treat as one object".

| Level | Unit | Central question |
|---|---|---|
| L0 Manuscript | the whole paper | What single claim is this, and does it close as one argument? |
| L1 Architecture | the skeleton itself (do not take the current sectioning as given) | Is the way the paper is carved into parts natural for the claim? |
| L2 Section | one section | Does this section deliver its role; does it cohere internally? |
| L3 Paragraph | one paragraph | Does it have one role and connect to its neighbours? |
| L4 Sentence | one sentence | Does it serve the paragraph and connect logically; is its claim calibrated? |
| L5 Equation/Symbol | one symbol or equation | Is it formally consistent (definition, type, dimension, indices)? |
| L6 Surface | one mark | Surface correctness (typos, grammar, APS style). |

Two boundaries to keep in mind. **L1 is different in kind** — it judges the skeleton
itself (whether something that is a section should be, whether something that is *not* a
section should become one, whether the carve-up and granularity fit the claim), not the
contents of a given section. **L5/L6 cross from meaning to form/surface** — from L0–L4
you are reading for meaning and the reader; at L5 you check formal consistency (not
whether the meaning is right, but whether types, dimensions, indices line up), and at L6
pure surface. That is why Narrative and prose-beauty are blank at L5/L6.

Order matters because edits at higher levels move more text; fixing English or APS style
first is wasted once a structural change rewrites the passage.

## What each level sees and ignores

Run each level on its row only. SEES = what to look at; IGNORES = what would be a
distraction at this level (these are the columns left blank in the aspect table below).
Boundaries between adjacent levels are cut by **analysis unit**: a problem spanning
several paragraphs belongs to a higher level, a problem contained in one sentence to a
lower one.

| Level | SEES | IGNORES |
|---|---|---|
| L0 | the paper as one claim, all aspects but only "as a whole" | — |
| L1 | skeleton validity: existence / granularity / placement of the parts | sentences, symbols, typos |
| L2 | a section's role and internal coherence | typos, grammar, prose beauty |
| L3 | a paragraph's role and connections to neighbours | symbol typos, equation correctness, grammar |
| L4 | sentence connection, claim strength, clarity of reference | formal symbol consistency, algebra correctness |
| L5 | formal consistency of a symbol/equation (the multi-axis check below) | Narrative, prose beauty |
| L6 | surface correctness (typo/grammar/APS) | Narrative, claims, terminology, equation content |

## The seven aspects, per level

At each level, look through these aspects. The same aspect asks a different question at a
different level (e.g. terminology is "is the central concept named consistently?" at L0,
"do equation symbols match the prose term?" at L5). Use the table as the menu for the
level you are on; blank cells are not examined at that level.

| | Narrative | Claim/support | Terminology | Notation/convention | Math/physics | Algorithm/impl | Sci-English/style |
|---|---|---|---|---|---|---|---|
| **L0** | abstract/intro/results/conclusion tell the same paper | where the math result behind the central claim lives; do prose and math claims match in strength | central concept named consistently (method/framework/algorithm drift) | is there a notation policy; does the symbol system serve the story | "proved in theory" vs "actually computable" kept apart | if computability is claimed, is it explained (implementation gap) | tone of abstract/intro/conclusion |
| **L1** | skeleton validity: should-be / should-not-be a section, granularity, ordering | placement of derivations, assumptions, results; what theory shows vs what numerics check | where terms are defined (used in intro, defined only in methods; duplicate definitions) | where symbols are introduced (a place that gathers them; scattered; main-text vs appendix) | placement of derivation/assumptions/results | placement of algorithm description and numerical experiments | main/appendix/supplemental split; tone |
| **L2** | the section's role and internal coherence | does the section's stated goal get delivered inside it ("we derive" but only assume; "we evaluate numerically" but no procedure follows) | terms that should be introduced here are; same meaning as prior sections; not a one-section synonym | defined before use; prior convention respected; is a new symbol actually needed | (only as it supports the section's claim) | "we can compute" backed by an actual procedure | (not yet to typos) |
| **L3** | what the paragraph explains; flows in from before and out to next | the paragraph's prose claim is supported by a nearby equation | timing of new-term introduction; abrupt first use; restating a defined term differently | need for a new symbol; introduction breaking the flow; meaning before the equation, interpretation after | the equation contributes to the paragraph's topic; too technical here (move to appendix) | (as claim support) | clear topic sentence; readable as a paragraph; claim strength consistent; orphan sentence |
| **L4** | connects to neighbours; serves the paragraph; not floating | the sentence does not claim more than the equation shows | term already defined; sudden synonym; this method/approach/procedure unified | in-sentence symbol matches the equation right after; "where x is …" sufficient; explanation not breaking flow | therefore/thus/hence is an actual consequence | (as claim alignment) | colloquial/literary; vague it/this/these; clearly/obviously; show/prove/demonstrate/suggest calibrated; clear subject and verb |
| **L5** | — | which claim this equation supports; does this equation alone reach that claim; extra assumption needed | object name in the math matches the prose term (state/configuration/sample/trajectory distinguished) | **central**: n,m,d,N consistent; i,j,k convention; ambiguous μ; font (bold/italic/calligraphic/roman); same symbol two meanings / two symbols one meaning; **convention drift** (superscript↔subscript, Greek↔Latin, standard↔unfamiliar symbols, broken font discipline) | dimensions; left/right types; limits recover known results; normalization; matrix-product shapes; tensor-contraction indices; hidden conditions | (does the equation support the algorithm) | — |
| **L6** | — | — | — | equation/figure numbering, formatting | — | — | typo/grammar/punctuation/abbreviation/references/numbering/capitalization/units/APS style/abstract length/caption/data availability/supplement |

For the **L5 multi-axis check** (this is the level to be exhaustive — math errors matter
most): for each significant equation/symbol, run through, at least: definition (every
symbol defined at first use; no redefinition or undefined use); type/shape (sides match;
matrix-product and tensor-contraction shapes and indices consistent); dimension/units;
indices (convention consistent; sum ranges; free vs bound); symbol clashes (one symbol
two meanings, two symbols one meaning, n/m/d/N meaning drift); **convention consistency**
(the *style of the notation* not drifting — e.g. superscripts becoming subscripts, Greek
turning into Latin, a sudden unfamiliar symbol where standard ones were used, broken
font discipline — judged as "does the system sit well", not just "is it defined"); limits
and known results; normalization/conservation/symmetry; algebraic steps (gaps, hidden
assumptions); correspondence to prose (math object names vs prose terms; the claim the
equation actually reaches). Consult `references/style.md` for the mechanical rules.

## How levels pass information (single pass + flags)

- **Down (constraint = a decision):** when a higher level settles something, it fixes the
  criterion lower levels judge against. Carry the higher-level decisions forward as you
  descend. E.g. once L0 fixes the name of the central concept, L4 can check each "the
  method" against it; once L2 decides a section is "the algorithmic-realization section",
  L3 can ask whether "we can compute" there has a procedure.
- **Up (contradiction = a flag, the machine does not go back):** when a lower level finds
  a **fact** that contradicts a higher-level decision, record a flag `FLAG Lk→Lj`. Do not
  re-run the higher level; the human resolves the flag. E.g. L5 finds "the equation only
  shows existence" → `FLAG L5→L0` (whether the central "practical algorithm" claim
  overreaches is a judgment for the human). L5 finds "`d` is overloaded" → `FLAG L5→L1`
  (whether the notation needs a dedicated place is a skeleton judgment).

Lower levels never fix the manuscript and never overrule a higher level — they surface the
fact and flag it.

## Persona use (L0–L4 only)

At L0–L4, read the level through the selected personas (their cards are in `personas/`).
The point is not roleplay; it is to surface the **spread** of judgment where there is no
single right answer:
- **Consensus** (several personas flag the same thing) is a confidence signal.
- **Split** (they disagree) is a genuine choice to show the author, with both sides — do
  not adjudicate it.
- **Single** (one persona) is recorded as a lighter-weight observation.

L5/L6 use no persona — they are objective checks.

## Discipline on findings

- **Never declare "correct".** Especially at L5 and for any math/physics finding, never
  write "this is right" / "no issues" / "mathematics sound". Such a verdict makes the
  author *stop looking* at a place you did not actually exhaust — the most dangerous thing a
  consistency audit can do. Instead, record only what you **checked** and what you did
  **NOT** check, and let those two fields carry the message. A "Correct Findings" or
  "No issues" subsection is forbidden in the report.
- Every finding is a structured row, not a paragraph of vague praise/criticism:
  `id · location · issue · severity · raised_by · agreement · suggested-fix · checked ·
  NOT-checked`. The `id` is a level/track prefix + number, e.g. `L5#SYM-012`, used as an
  anchor in Part B. Severity is `critical` (touches the central claim or correctness) /
  `major` (a supporting claim or important consistency problem) / `minor` (local, easily
  fixed).
- **`raised_by` records WHO** — the persona name(s), or `objective`. When a point comes from
  several personas, list them all (`Tasaki, Lieb`). Also record `agreement`
  (consensus/split/single/objective); for a split, a one-line `divergence` giving both
  sides. The reader must always be able to see, per finding, who said it.
- `suggested-fix` gives a direction only; the skill does not rewrite the manuscript.

## Output: the report

Produce a single report with these parts, in this order.

1. **Flags — points for the human to judge at a higher level.** Put this first so it is
   not buried. Each flag: `origin · target · the fact found · why it bears on the
   higher-level decision · related finding id`. Flags come from the levels and from the
   MV/REF tracks (e.g. `FLAG MV→L0`, `FLAG MV→REF`, `FLAG REF→MV`, `FLAG REF→L0`). Example:
   `FLAG L5→L0 | Eq. (8) shows only existence of the estimator | the main text's
   "practical algorithm" may overreach | L5#SYM-012`.
2. **Part A — one table per granularity (the primary record).** This is where the "why"
   lives. Emit a **separate markdown table for each granularity**, in this order:
   `L0`, `L1`, `L2`, `L3`, `L4`, `L5`, `L6`, then the MV rungs `MV#CLAIM`, `MV#THM`,
   `MV#DERIV`, `MV#EQ` (when MV ran), then the REF axes `REF#HYG`, `REF#PLACE`, `REF#DEEP`
   (when REF ran). Skip a table only if that granularity produced no findings (say so in
   one line). Use these exact columns:

   | id | location | issue | sev | who (raised_by) | agreement | suggested-fix | checked | NOT-checked |

   Rules for the table:
   - **`who` is mandatory and never collapsed.** List the *names* of everyone who raised the
     point — e.g. `Tasaki, Lieb, Troyer` — not a count and not a bare "personas". For an
     objective check (L5/L6 floor, REF hygiene, MV#EQ floor) write `objective`. When the
     synthesizer MERGES the same finding from several persona files, the merged row's `who`
     must list **all** of those personas together; that is the whole point of the column.
   - **`agreement`** ∈ `consensus` (≥2 personas, same point — strong signal) / `split`
     (personas disagree) / `single` / `objective`. For a `split`, add a one-line
     `divergence:` note under the table giving both sides — do not adjudicate.
   - Order rows critical → major → minor within each table (`sev` column).
   - **Never write a row that just says something is "correct"** (see Discipline on
     findings). A genuinely verified item is recorded by its `checked` / `NOT-checked`
     content, not a "no issues / sound" row. Do NOT add "Correct Findings" subsections.
     This also forbids verdict words inside a cell — no `CHECK PASSED`, `correct`,
     `sound`, `valid`, `no issue` in any field; state what was checked instead.
   - Do not drop lower-level (L2–L4) findings into "propagates from above"; if a persona
     file recorded a row, it must appear in its granularity's table (merge duplicates, but
     keep the union of `who`). The per-level persona files under the run's `findings/` are
     the source of truth — read them all and lose nothing.
   - **Keep tables from breaking.** A markdown table row must be ONE line with exactly the
     9 columns above. Inside any cell: never use a raw `|` (write the math word, e.g.
     "abs(W(c))" instead of `|W(c)|`, or escape it as `\|`); never use a literal newline
     (collapse to one line); keep each cell short (put detail in `checked`/`NOT-checked`,
     not a paragraph). A cell that would carry a long derivation should summarize and point
     to the source finding file instead.
   - ** id scheme is fixed — do not invent per-persona ids.** Every id is
     `<granularity>#<AXIS>-<NNN>`: levels `L0#…`–`L6#…` (axis = the aspect, e.g.
     `L0#CLAIM-001`, `L5#SYM-004`, `L6#STYLE-002`); MV `MV#CLAIM/THM/DERIV/EQ-NNN`; REF
     `REF#HYG/PLACE/DEEP-NNN`; drift `L5#DRIFT-NNN`. The synthesizer RENUMBERS as it
     merges so each id is unique across the whole report (the raw per-chunk files may use
     loose local labels like `C1`/`M2`; normalize them — never emit `C1`/`M2`/`S4` in the
     final report).
3. **Part B — fix-order index (where to start).** All findings re-sorted into fix order:
   claim/architecture → narrative flow → claim-math alignment → terminology → notation →
   derivation/math (incl. MV) → references (REF) → figures/captions → scientific English →
   APS/submission. Each line is a pointer to Part A by id (e.g. `1. [architecture]
   L1#ARCH-002 (critical) → Part A L1`), not a copy of the finding.
4. **Coverage — what was and was not checked.** Aggregate the NOT-checked notes so the
   author sees the gaps in the audit. Include the MV and REF tracks explicitly: which
   equations/proofs were followed vs left unverified, and which cited works were
   web-verified vs not. Do not let the report read as "everything was verified". Note: at
   REF `standard`, hygiene is supposed to be checked by *real web lookup* (not from
   memory); if web verification was skipped or partial, that belongs in Coverage as a gap,
   and the affected REF rows must say so in their `NOT-checked` field.

### Where output goes — a per-run timestamped directory

Every run writes into its own folder so runs never overwrite each other (two runs sharing
one `findings/` is a real failure mode). The run directory is:

```
.pr-review/runs/<YYYY-MM-DD-HHMM>/
    findings/      ← every level/track/persona agent writes its file here
    report.md      ← the synthesizer writes the final report here
```

- Pick `<YYYY-MM-DD-HHMM>` once at the start of the run (the orchestrator decides it and
  passes it to every agent — Workflow scripts cannot generate timestamps themselves, so the
  caller supplies it). Use seconds (`-HHMMSS`) if two runs may start in the same minute.
- All paths elsewhere in this skill that say `.pr-review/findings/…` or `.pr-review/report.md`
  mean **inside the current run directory** (`.pr-review/runs/<stamp>/findings/…` and
  `.pr-review/runs/<stamp>/report.md`).
- The synthesizer writes `report.md` itself (do not rely on a human to save it afterward),
  reading only the `findings/` inside the same run directory — never a sibling run's.

## Run procedure (v1, single context)

0. Setup: confirm target journal (PR default; layer PRL if applicable); read the
   manuscript in full; note where the figure files live; pick the personas for this paper.
1. **L0** (with personas): apply the selected cards; produce the L0 output (the paper's
   map + global weaknesses). These become decisions carried downward. Record
   consensus/split and any flags.
2. **L1 → L4** (with personas): judge each level on its SEES only (respect IGNORES),
   carrying down the decisions from above. Record findings, consensus/split, flags. Open
   referenced figure files where a figure is in question. At L3/L4 (and L0–L2 tone),
   writing quality is judged through each persona's own prose taste (their cards), giving
   a spread rather than one house style; mechanical violations cite `references/style.md`.
   Keep the two kinds of finding apart.
3. **L5 → L6** (no personas, objective): formal consistency (L5: the multi-axis check,
   be exhaustive on math) and surface (L6). Never declare correct — record checked /
   NOT-checked. Open referenced figure files for figure/caption checks. Record flags.
   Each unit writes its findings file under `.pr-review/findings/`.
3.5. **MV and REF tracks** (run after L0–L6, per the chosen intensities; skip a track set
   to `off`). Read the track reference file first: `references/math-verification.md` for MV
   (`standard`/`deep`) and `references/reference-check.md` for REF (`standard`/`deep`).
   MV runs the selected math/rigor personas across **all** granularity rungs (claim↔math,
   theorem, derivation incl. inline/intermediate), with the objective L5 floor underneath;
   REF verifies bib hygiene by real web lookup + placement (`standard`) and reads cited
   works (`deep`). Be adversarially skeptical of plausible-but-wrong math; never declare
   correct; record checked/NOT-checked and `raised_by`. Raise flags (`MV→L0/L2/REF`,
   `REF→MV/L0/L2`). Each writes its findings file under `.pr-review/findings/`
   (`MV-<persona-or-axis>.md`, `REF-<axis>.md`).
4. **Synthesize:** the dedicated synthesizer reads `.pr-review/findings/` and assembles
   Flags, Part A (levels then MV/REF tracks, with `raised_by` preserved), Part B, Coverage
   into `.pr-review/report.md`.

## Verifying the mathematics, not just auditing consistency (L5 floor + MV track)

The mathematics is where errors matter most, and an audit that only records "not checked"
for every derivation is failing its job. Two layers handle this, and PR-review is
**self-contained** — neither calls any other skill:
- **L5 floor (objective, always runs):** formal consistency of each equation — the
  multi-axis check above. Apply the **embedded equation-audit checklist** in
  `references/math-verification.md` (cherry-picked from `tex-formula-audit`: bookkeeping of
  index roles, range complementarity, smallest non-trivial substitution, mechanical source
  translation, downstream propagation) to load-bearing or restated/cited equations. Do
  **not** invoke an external skill.
- **MV track (when math intensity is `standard`/`deep`):** actually *follow* and, at
  `deep`, *prove* the steps, across all granularities, with personas — see
  `references/math-verification.md`. Be adversarially skeptical: try to refute steps that
  look fine.
- Either way, say specifically what you verified and what you could not (e.g. "checked the
  algebra of Eq. (12)→(13); did NOT verify the cited bound's constant"). checked/NOT-checked
  is an honest account of a *real* verification attempt, not an excuse to skip the math.
- Prefer a strong model (Opus) for the math; weak models under-verify it. The setup model
  question (setup item 1) exists partly for this.

## Choosing the model (recap)

Per setup item 1, ask the user which model to run on. Mathematics-heavy levels (L5) and
claim-judgment (L0) benefit most from Opus; surface (L6) tolerates a lighter model. When
running as a Workflow, pass the chosen model to every `agent()` call explicitly — do not
let agents fall back to a default light model, or the math verification (above) will be
weak.

This single-context procedure is the v1. The same structure ports to an Opus 4.8 Workflow:
a `pipeline` over the levels (carrying decisions between stages), `parallel` personas inside
L0–L4, and a final synthesizer. In the Workflow form, **every level/persona agent writes
its own file to `.pr-review/findings/`** and the synthesizer agent reads that directory —
so the per-persona findings (with `raised_by`) survive as artifacts and the report is not
the only output. Pass the user-chosen model to every `agent()` call.

## Known v1 implementation pitfalls (fix these when running)

These were observed on the first real run and must not recur:
1. **Report not written to disk.** The audit must write `report.md` (inside the run dir)
   itself. Also: never let two runs share a `findings/` dir — use the per-run timestamped
   directory above, or a finished run's files get overwritten by the next.
2. **`raised_by` lost in synthesis.** The synthesizer dropped the persona column, so the
   report read as if everyone agreed. Persist per-persona findings files AND keep the
   `raised_by` column in Part A.
3. **Math not actually verified.** A light model plus a consistency-only L5 prompt produced
   "not checked" for nearly all derivations. Use Opus for the math, apply the embedded
   equation-audit checklist (in `references/math-verification.md`), run the MV track at
   `standard`/`deep`, and re-derive load-bearing steps. Do not rely on an external skill.
