# Math verification track (MV) — additive, persona-based, granularity-laddered

Mathematics is roughly half of a physics review, so PR-review runs it as a track in its
own right, **on top of** the objective L5 formal-consistency floor (which is unchanged).
This file is loaded only when the math intensity is `standard` or `deep` (see SKILL.md
setup). At `off`, the MV track does not run — the L5 floor alone applies.

This track is **self-contained**: it does not invoke any other skill at run time. The
equation-audit checklist it needs is embedded below (§ Embedded equation-audit checklist).

## §0 Top principle: examples are seeds, not checklists

Every concrete example here — `d` used two ways, "proved a bound but the prose claims an
approximation", "an $i$-fold commutator", a specific limit — is **one instance** meant to
convey the *kind* of problem to look for. Do **not** fixate on the named example. From each
example, understand the *class* it represents and **generalize across the whole paper**:
every equation, every inline expression, every claim. The point is to catch the instances
the example never named.

Corollary discipline: **never declare a result simply "correct".** For every finding,
record what you `checked` and what you did `NOT` check. The checked/NOT-checked split is an
honest account of a real verification attempt, not an excuse to skip the math.

## Intensity axis (each level includes the one below it)

- **off** — MV track not run; only the objective L5 floor (definitions, types, dimensions,
  indices, notation drift) applies.
- **standard** — *follow the mathematics.* For every load-bearing equation, every
  theorem/proof, **and every inline or intermediate expression in the prose**, try to
  follow each step from the one before. Mark each step `followable` or `gap`. Apply the two
  cross-cutting principles below (prose↔math at all granularities; adversarial skepticism).
  This is where most of the value is.
- **deep** — additionally, wherever a step is a `gap` (cannot be followed from what the
  paper gives), **attempt to prove it yourself** with standard knowledge. If you can, the
  finding is "the paper omits an argument that exists — add it" (minor/major). If you
  cannot, the finding is "could not establish this step" — a candidate error/gap; flag it,
  do not assert it is wrong. At `deep`, when a step depends on a result borrowed from a
  reference, hand off to the reference deep-read track (`FLAG MV→REF`).

## Two cross-cutting principles (apply at EVERY granularity)

These are not a single rung — they run through the whole ladder.

1. **Prose↔math correspondence, everywhere.** A gap between *what the words say* and *what
   the math actually gives* is not only a top-level "central claim" problem. It happens at
   every scale: a paragraph's explanatory sentence vs the equation right after it; a
   qualifier like "clearly", "in general", "efficiently", "it follows that" vs the math
   that would have to hold for it; a definition sentence vs how the symbol is actually used
   later. At each rung ask: **is what the prose says here actually guaranteed by the
   mathematics?** Where the prose says more than the math gives, that is a finding (and a
   flag to L0/L2 if a load-bearing claim overreaches).

2. **Adversarial skepticism — be hard on math that is trying to fool you.** Some steps look
   fine and slip past author and readers alike. Actively try to *refute*, not just to
   follow. Watch for: a theorem applied outside its hypotheses; an implicit assumption of
   commutativity, independence, positivity, or regularity; an unjustified exchange of
   sums/integrals/limits; terms quietly dropped under $O(\cdot)$; "without loss of
   generality" that actually loses generality; over-generalizing from a special case;
   circular reasoning; a constant or sign silently changed. **When something feels "is this
   really OK?", treat that as a signal and try to break it.** If you cannot confirm it,
   say so (warning), rather than waving it through.

## The granularity ladder (whole paper → type level)

Run top-down; carry decisions down, raise flags up (same as the L0–L6 hierarchy). The two
cross-cutting principles above apply at every rung.

1. **Claim ↔ math (most important).** Does the central *mathematical* result actually
   support the paper's stated *claim*, at the strength the prose uses? A theorem can be
   correct in isolation yet not establish what the prose says (proves an upper bound but
   the prose claims an approximation; proves a special case but claims generality; proves
   existence but claims a construction). Overreach → `FLAG MV→L0` (and L2 as needed).
2. **Theorem.** Is each theorem/lemma well-posed? Are all hypotheses actually used, and all
   used hypotheses stated? Does the proof establish *exactly* the stated statement — not
   more, not less? Is any cited "standard" lemma actually standard and correctly invoked?
3. **Derivation.** For each multi-step derivation, can each step be followed from the
   previous one (`standard`), or proved by us if not (`deep`)? Where is the hidden
   assumption, the dropped term, the unjustified exchange of limits/sums? **Apply the same
   rigor to inline and intermediate expressions** — the small equations spliced into prose
   and the steps joined by "therefore"/"hence" are where verification is most often skipped
   and where sleight of hand hides.
4. **Equation / type (the L5 floor, objective).** Internal coherence of the single
   equation: types, dimensions, index ranges, shapes, font/convention. Use the embedded
   equation-audit checklist below. This floor runs even at MV `off`.

The floor checks *form*; MV checks *content* (does the equation actually hold / is it
guaranteed). Keep the two apart in your findings.

## Embedded equation-audit checklist (cherry-picked, no external skill call)

Apply to any equation that was edited, restated, or translated between conventions, and to
load-bearing equations generally. Use the principles that fit; skip the ones that do not —
but do not skip any silently.

1. **Bookkeeping over eyeballing.** For each symbol/index family, count how many times it
   occurs in each role (summation variable, subscript, exponent, factorial argument, kernel
   power, range bound). Roles that should agree must agree; roles that should differ must
   differ exactly as the formula states. **Write the counts down**; do not infer them by
   reading.
2. **Ranges and complementarity.** When indices split between regions of an expression
   (outer chain vs inner expansion; fixed prefix vs active tail), name each range
   explicitly and check it is contiguous, disjoint where it should be, and together covers
   what it should.
3. **Smallest non-trivial substitution.** Pick the smallest non-trivial parameter values
   and expand every term explicitly, even when the general form "looks right". Include
   **one case above the minimum** — boundary terms (vanishing endpoints, identity factors,
   single-layer collapses) usually surface only at the second-smallest case.
4. **Mechanical source translation.** If the equation is "from"/"adapted from"/"restated
   from" another paper, **fetch the source** (do not rely on memory), quote the source
   statement verbatim, list the substitution rules, and apply them as textual replacement
   before simplifying. Differences from the manuscript form are bugs. If the source is
   unavailable, say so and lower confidence. (This overlaps the REF track — escalate via
   `FLAG MV→REF`.)
5. **Downstream propagation.** Any later equation, lemma, bound, or sentence that depends on
   a corrected form must be re-examined. Prose naming specific counts ("two factors of
   $X$", "an $i$-fold commutator", "a partition into $k$ parts") goes stale easily.

Anti-patterns: "the indices are obviously consistent" (without principle 1); "it matches
the cited paper" (without the verbatim quote and mechanical substitution of principle 4);
stopping after one principle catches a bug (the others catch different bug classes).

## Personas — applied at ALL granularities

Select the math/rigor-relevant personas from the shared pool (`personas/` — e.g. Lieb,
Nachtergaele, Suzuki, Childs, Tasaki, plus any topic-closest ones) and run them across
**every rung** of the ladder, not only the top. They bring different mathematical
obsessions — Lieb on claim-vs-proof reach, Nachtergaele on bounds and their
constants/regimes, Suzuki on decomposition-error orders, Childs on cost/complexity claims —
so the "is this trying to fool me?" check gets several independent eyes. Record `raised_by`;
compute **consensus** (strong signal) vs **split** (a real choice for the author — present
both sides, do not adjudicate).

Exception: the **L5 formal-consistency floor** (mechanical type/dimension/index coherence)
is `objective` — no persona. Everything else in MV (whether an equation actually holds or
is guaranteed) goes through personas at every granularity.

## Flags (track connections)

- Central claim overreaches its math → `FLAG MV→L0` (and `L2`).
- A step depends on a result borrowed from a reference → `FLAG MV→REF` (the reference
  deep-read track checks whether the borrowed result applies to our setting).

## Output

Findings with ids `MV#CLAIM-###`, `MV#THM-###`, `MV#DERIV-###` (equation/type form issues
stay on the L5 floor). Same row schema as the rest of the audit
(`id · location · issue · evidence · severity · suggested-fix · checked · NOT-checked`),
with `checked`/`NOT-checked` mandatory and `raised_by` set to the persona (or `objective`
for the floor). Write to `.pr-review/findings/MV-<persona-or-axis>.md`. Flag prose↔math
overreaches to L0/L2 and borrowed-result dependencies to REF.
