# Mechanical LaTeX style — Physical Review family (self-contained for PR-review)

The mechanical APS-family style rules PR-review checks against at L5 (symbols/equations),
L6 (surface), and L3/L4 (prose discipline). This is a **checklist**; the *why* lives in
`PR.md`/`PRL.md`. When PR-review finds a violation, it raises it at the appropriate level
(L6 mainly; equation-related at L5; prose-related at L3/L4). Self-contained; references no
external journal/rules file.

§0 principle (examples are seeds): each rule below is **one example**. Generalize to the
same *class* of violation and search the whole manuscript for it.

---

## Equation formatting (mainly L5/L6)

- **No `\[...\]`.** Numbered display math uses `equation`/`align`; unnumbered uses
  `equation*`/`align*`.
- **No `$$...$$`.** Plain TeX spacing is inconsistent. Display uses `equation`, inline
  uses `$...$`.
- **Inline math is `$...$`** only (single dollars).
- **No prose annotation inside equation blocks.** Forbidden: trailing
  `\quad \text{where ...}`; `\underbrace{X}_{\text{meaning}}`; parenthetical asides
  like `(\text{the factor } \alpha)`; `\tag{...}` used to gloss. A symbol's meaning,
  why a form holds, or when it applies goes in the prose *before/after* the equation.
  `\text{}` inside math is acceptable only for: case labels in `\begin{cases}`; units
  (` eV`, ` K`); short function names without a macro (`\text{Tr}`, `\text{diag}`).
- **Keep equations simple.** Do not pack two statements onto one line with
  `\qquad`/`\quad`. Paired definitions or upper/lower bounds go one-per-line in
  `aligned` inside an `equation`. Avoid custom formatting that fights the style file.
- **No `\asymp`.** "Asymptotically equivalent" is ambiguous (it conflates $\Theta$,
  $\sim$, and approximate equality). State the intended relation exactly:
  `\Theta(\cdot)`, `\mathcal O(\cdot)`, `\sim`, `\ge`/`\le`, or `=f(x)+O(\cdot)`.
  Applies to main text, appendix, and proofs.

## Prose discipline (mainly L3/L4)

- **No `--` (double hyphen) in prose — main text or appendix.** APS does not use
  em-dash-style asides. Rewrite with a subordinate clause, a comma, or a new sentence.
  Same for `—` (em-dash).
- **Avoid parentheses `()` in prose when feasible.** A parenthetical usually signals
  uncertainty about whether the thought belonged; integrate it as a clause or drop it.
  Parentheses for `\cite{…}` output or math clarity (`the factor $(1-\epsilon)$`) are fine.
- **Avoid semicolons `;` in prose when feasible.** Two sentences almost always read
  better. The acceptable case is a list of three or more items with internal commas.
- **Use `\cref`/`\cite` for references.** Never hand-write "Eq. (3)", "Fig. 2",
  "Section 4" — use `\cref{eq:foo}`, `\cref{fig:bar}`, `\cref{sec:baz}`, `\cite{…}`.
- **State the result, not the plot's appearance.** Avoid describing curves ("the thin
  curve sits above the tight curve") and colloquial/anthropomorphic verbs; state the
  quantitative relation between named quantities (exceeds, overestimates, scales as,
  grows as, is larger by). Keep precise domain terms like "decade" (a factor of ten on
  a log axis); do not soften to "order of magnitude".

## `\paragraph{}` discipline (mainly L1/L2/L3)

- **Allowed as a top-level section marker (required in PRL).**
  `\paragraph*{Introduction. ---}` form. In full-length papers prefer
  `\section`/`\subsection`.
- **Not allowed as an internal mile-marker inside a proof, derivation, or conceptual
  explanation.** One argument should read as continuous narrative. Chopping the interior
  with `\paragraph{Setup.}` `\paragraph{Bound on …}` headers is a list pretending to be
  prose; carry the reader with connectives instead. Pre-write check: if removing every
  `\paragraph{}` still reads as a continuous argument, do not add them. Post-write check:
  count `\paragraph{}` headers in a touched subsection — more than one inside a
  derivation, an explanation, or a single mathematical construction is almost always
  wrong (the exception is an algorithmic procedure).
- **Allowed for algorithmic / protocol steps** (`\paragraph{Initialize.}` etc., steps
  executed in order, procedures a reviewer audits step by step).

## Don't coin new terms (mainly terminology at L0–L4)

- Every new noun is reader overhead. Default to existing vocabulary and bare symbols.
  Introduce a new term only when it has no standard alternative and is reused at distance.
- **Don't replace a symbol with a verbal label.** If the object has a symbol, refer to
  it by the symbol.
- **Don't rebrand a standard concept.** "upper bound", "approximation", "remainder",
  "kernel" already mean things; don't swap in author-coined synonyms.
- **Don't introduce a noun for a one-line construction.** A "split rule" used once is
  just *the split*.
- **If a new term is genuinely needed, define it explicitly at first use**
  ("We call X a Y when ...") and use it consistently afterward.
- **Spell out abbreviations on first use** in body text (e.g. *Hermitian-involution
  decomposition (h.i.)*, then "h.i."). Section titles do not count as a definition.

---

## Pre-finish checklist (run every time, even for short edits)

- Any `\[`, `\]`, or `$$` written or left in.
- Any `\qquad`/`\quad` packing two statements onto one display line. Use `aligned`,
  one per line.
- Any `\asymp`. Replace with the precise relation.
- `\text{}` inside an equation that isn't a case label, unit, or function name.
- Any `--` / `—` (em-dash aside) in prose. Restructure.
- Any `;` in prose. Two sentences usually read better (exception: 3+ item list with
  internal commas).
- Count `\paragraph{}` headers in every touched subsection. More than one inside a
  derivation/explanation/single construction is almost always wrong.
- Hand-written "Eq. (…)", "Fig. …", "Section …" instead of `\cref`/`\cite`.
- Any coined noun phrase for an object that already has a symbol or standard name. Drop
  it, or define explicitly at first use.
- Any abbreviation introduced without a spelled-out first occurrence in body text.
- Any figure/result sentence narrating curve appearance or having an algorithm "pay" a
  cost, instead of stating the relation between named quantities. Conversely, check a
  precise term like "decade" was not softened.
