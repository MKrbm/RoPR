# Physical Review — criteria the review checks against (PR family, shared)

The basis PR-review uses to check, at each level, what a manuscript should satisfy.
A self-contained summary of the published editorial and submission standards of the
Physical Review family (PR, PRA, PRB, PRX, PRE, PRD, PRResearch). Letter-specific
additions live in `PRL.md`.

This file is the **only philosophy source** PR-review consults. It does not reference
any external skill or journal file.

---

## 1. What a good PR paper must be

- Scientifically correct, original, clearly written, well positioned relative to
  prior work, and organized so the main claim and its evidence are quick to grasp.
- Passing a format check is not enough. The contribution's value must be easy to
  recognize.

## 2. The seven questions a paper must answer clearly

1. What physical problem or question is studied?
2. Why is it important?
3. What was missing, unresolved, or limited in prior work?
4. What is new in this paper?
5. What evidence supports the claim?
6. What is the scope and limitation of the result?
7. How does it change understanding, method, or capability?

A paper where these are hard to find feels weak even when the science is sound.

## 3. Writing requirements

- Clear, not merely technical (not a private lab note or a compressed proof sketch;
  readable by a trained physicist outside the exact niche). Avoid unnecessary jargon,
  define specialized terms at first use, prefer direct sentences over overloaded ones,
  separate the physical idea from the technical machinery, keep the logic easy to follow.
- **State the main claim early** (title/abstract/opening: what was done, what was found,
  why it matters).
- **State significance explicitly** (do not assume it is obvious: resolves a known
  issue / improves precision or understanding / introduces a useful method / reveals a
  new phenomenon / settles a debate).
- **Be selective** (not a dump of everything tried; only material that strengthens the
  argument).

## 4. Function of each structural part

- **Title**: informative, identifies subject and key finding. Cryptic or overly broad
  titles are weak.
- **Abstract**: self-contained; both an index (subjects with new information) and a
  summary (main conclusions and results of general interest). State problem, method,
  main result, significance quickly. Not just a topic announcement.
- **Introduction**: argument, not a literature list. Broad context -> specific gap ->
  limitation of prior work -> the paper's contribution -> why it matters, leading
  naturally to the claim.
- **Body / results**: for each major result, make clear what is shown, how it was
  obtained, why it is trustworthy, what it means physically. Figures, equations, and
  numerics support the argument rather than interrupt it.
- **Discussion / conclusion**: not a repeat of the abstract; restate the achievement
  precisely, give the broader implication, note what remains open.

## 5. Literature and positioning

- Represent prior work fairly. Distinguish what was known / suspected / approximate /
  genuinely new here.
- Make novelty specific ("to our knowledge" alone is weak: first direct observation of
  X under condition Y, first controlled derivation of Z, major accuracy improvement,
  a new interpretation that resolves a contradiction).
- Do not overstate. Stating exactly what was achieved and where the limits are is more
  persuasive.

## 6. Evidence and presentation

- **Evidence must match the strength of the claim** (stronger claims need more care
  with robustness, controls, assumptions, uncertainties).
- Figures are informative, not decorative; readable from the caption alone (axes,
  units, symbols, legends clear).
- Equations serve communication, not difficulty display. Dense derivation without
  explanation hurts accessibility.
- Key approximations, regime of validity, uncertainties, and interpretation-affecting
  assumptions must be visible.

## 7. Readability

- One main idea per paragraph; topic sentences; clear transitions; minimal notation
  overload; consistent terminology and symbols; no rhetorical inflation.
- Common failures: introducing notation before the physical idea; burying the main
  claim; long sentences with many qualifiers; mixing results, interpretation, and
  literature review without structure; assuming specialist knowledge.

## 8. Submission baseline (shared)

- Follow originality and exclusive-review policy. Authorship accurate and responsible.
- References complete and correctly formatted. The article stands on its own without
  supplemental material.
- Satisfy data-availability and transparency requirements where applicable.

---

## Mapping to levels (how PR-review uses this)

- **L0** (claim, significance, reader value): the seven questions (§2), no overstating
  (§3), specific novelty (§5).
- **L1** (architecture): function of structural parts (§4), main/appendix/supplemental split.
- **L2/L3** (sections, paragraphs): one idea per paragraph and topic sentences (§7),
  selectivity (§3).
- **L4** (sentences): clarity and no overstating (§3), transitions (§7).
- **L5** (symbols, equations): equations serve communication and assumptions visible
  (§6), consistent terminology and symbols (§7).
- **L6** (surface): title/abstract form (§4), references and data availability (§8),
  mechanical rules in `style.md`.
