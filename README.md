# pr-review

A pre-submission **internal-consistency audit** skill for Physical Review physics
manuscripts (PR, PRL, PRA, PRB, PRX, PRE, PRD, PRResearch). It reports the inconsistencies
an author should fix before submitting — it does **not** simulate referees, give an
accept/reject verdict, or rewrite the manuscript.

## What it does

The skill reads a manuscript at **seven abstraction levels** (L0 whole-paper → L6 surface),
one level at a time, so that global-argument problems and index-drift problems are not
chased in the same pass. At the judgment-heavy levels (L0–L4) it embeds several **reviewer
personas** to surface a *spread* of opinions rather than one house style. On top of the
levels it runs two additive, intensity-tunable tracks:

- **MV — math verification:** follow (and at `deep`, prove) the mathematics across all
  granularities, check that the prose is actually guaranteed by the math, and stay
  adversarially skeptical of plausible-but-wrong steps. Self-contained equation-audit
  checklist; no external skill calls.
- **REF — reference verification:** citation hygiene (verified by real web lookup),
  placement, and at `deep` reading the cited works to check borrowed results apply.

The output is a single structured report: **Flags** (points for the human to judge),
**Part A** (findings by level then by track, with who raised each), **Part B** (a
fix-order index), and **Coverage** (what was and was not checked).

## Usage

Invoke the skill on a physics manuscript ("review my paper before I submit", "audit this
PRB draft for inconsistencies", "整合性チェック"). It asks which model to run on and at
what math/reference intensity (`off` / `standard` / `deep`, also settable via
`--math=… --ref=…`), then writes findings to `.pr-review/` in the target repository.

## Layout

```
pr-review/
├── SKILL.md              # orchestrator: levels, aspects, flow, run procedure
├── references/
│   ├── PR.md, PRL.md     # Physical Review editorial criteria
│   ├── style.md          # mechanical prose/equation rules
│   ├── math-verification.md   # MV track (loaded on demand)
│   └── reference-check.md     # REF track (loaded on demand)
└── personas/             # reviewer persona cards + selection guide
```

The skill is general: it carries no assumptions about any particular paper.
