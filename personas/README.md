# Persona library (v1: lightweight description cards)

Each card describes one reviewer persona with five fields — **Name, Field, Style,
Cares about, Prose taste** — plus a reminder of the §0 seed principle. v1 deliberately
uses written descriptions, not raw sample text; the raw-text approach is deferred to a
later version.

**Writing/English judgment lives in the personas, not in a shared rulebook.** Each card's
*Prose taste* field states that reviewer's own aesthetic for scientific English and
paragraph craft. This is deliberate: at L3/L4 we want a *spread* of judgments on writing
(Tasaki's plain clarity, Lieb's spare economy, Preskill's vivid memorability, …), not one
house style imposed on everyone. Consensus across personas on a prose issue is a strong
signal; a split is a genuine stylistic choice to show the author.

Personas apply only at levels **L0–L4** (judgment-heavy levels with no single right
answer). L5/L6 are objective checks and use no persona.

The orchestrator does **not** run all personas on every paper or every level. It picks
the few whose expertise is closest to *this* manuscript's topic and to the level in
question, using the table below to match. The general method:
- Read the manuscript's topic (subfield, methods, what is proved vs computed).
- Pick 4–6 personas whose **Lens** overlaps that topic most directly as the primary
  reviewers, plus 2–3 **rigor-lens** personas (e.g. Lieb, Nachtergaele, Tasaki) whenever
  the paper makes mathematical claims, plus a **significance** persona (e.g. Preskill) for
  L0. There is no fixed default — the right set depends on the paper in front of you.
- Match by the actual content: a sign-problem paper pulls Troyer/Cohen/Sandvik; a
  Hamiltonian-simulation paper pulls Childs/Campbell/Suzuki; a rigorous-bounds paper pulls
  Lieb/Nachtergaele; and so on. Skip personas with no bearing on the topic.

| File | Persona | Region | Lens (their expertise) |
|---|---|---|---|
| tasaki.md | Hal Tasaki | math-phys | definition/assumption/claim separation, beauty, no overclaim |
| lieb.md | Elliott Lieb | math-phys | inequalities, claim only to the reach of the proof |
| nachtergaele.md | Bruno Nachtergaele | math-phys | Lieb-Robinson bounds tracked with constants and regime |
| suzuki.md | Masuo Suzuki | quantum comp | Suzuki-Trotter, error order and validity regime |
| childs.md | Andrew Childs | quantum comp | cost/complexity stated precisely, regime-aware |
| campbell.md | Earl Campbell | quantum comp | randomized/probabilistic methods, bias and variance |
| sandvik.md | Anders Sandvik | numerics | QMC estimators, statistical error, convergence |
| troyer.md | Matthias Troyer | numerics | sign problem, possible-vs-computable |
| cohen.md | Guy Cohen | numerics | real-time QMC, dynamical sign problem |
| preskill.md | John Preskill | concept | broad significance, reader takeaway |
| sieberer.md | Lukas Sieberer | Trotter error | Trotter error as physics, threshold/regime |
