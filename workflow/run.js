// pr-review v2 Workflow — dispatcher-split execution form.
//
// HOW TO RUN (from the orchestrator, NOT from inside another workflow):
//   1. Generate a timestamp yourself (shell: `date +%Y-%m-%d-%H%M`) — Workflow scripts
//      cannot call Date.now(). Pass it plus the other settings as the `args` object.
//   2. Invoke the Workflow tool with { scriptPath: "<this file>", args: { ... } }.
//
//   args (all optional except `stamp`):
//     stamp:   "YYYY-MM-DD-HHMM"   (REQUIRED — the per-run output dir name)
//     tex:     absolute path to the manuscript entry .tex   (default below)
//     skill:   absolute path to this skill's root           (default below)
//     model:   "haiku" | "sonnet" | "opus"                  (default "haiku")
//     synthModel: model for the synthesizer only            (default "opus" — see note)
//     journal: "PRB" | "PRL" | ...                          (default "PRB")
//     math:    "off" | "standard" | "deep"                  (default "standard")
//     ref:     "off" | "standard" | "deep"                  (default "standard")
//     maxchunk: integer cap on blocks per level             (default 6)
//
// WHY synthModel defaults to opus: in testing, finding-collection agents ran fine on
// Haiku, but the synthesizer's discipline (no broken tables, no "correct" verdicts,
// actually WRITING the report file) was only reliable on Opus. Collect cheap, synthesize
// carefully. Override if you want a uniform model.
//
// ANTI-CONTAMINATION: the orchestrator must pass NO paper-specific content here — only
// paths and settings. Every agent reads main.tex itself and discovers the paper. Do not
// inject the paper's topic, claims, notation, prior findings, or this session's context.
//
// SUBAGENT WRITE NOTE: in some harnesses the Write tool is blocked for subagents; agents
// then fall back to a shell heredoc to create their files. The prompts ask agents to write
// their own files; if a run produces findings but no report.md, re-run just the synthesizer
// pointed at the run dir.

export const meta = {
  name: 'pr-review',
  description: 'Dispatcher-split pre-submission consistency audit: one agent reads the whole paper and plans persona selection + a per-level workmap (line ranges) + a glossary; review agents then READ the whole paper but EVALUATE only their assigned block; objective L5/L6 + drift sweep + MV + REF tracks; an Opus synthesizer consolidates into one per-granularity-table report. Output goes to a per-run timestamped directory.',
  phases: [
    { title: 'Dispatch' }, { title: 'L0' }, { title: 'L1' }, { title: 'L2-L4' },
    { title: 'L5-L6' }, { title: 'Drift' }, { title: 'MV' }, { title: 'REF' }, { title: 'Synthesize' },
  ],
}

const A = (args && typeof args === 'object') ? args : {}
const STAMP = (A.stamp && String(A.stamp).trim()) || 'unstamped'
const SKILL = A.skill || '/home/user/.claude/skills/pr-review'
const TEX = A.tex || '/home/user/project/ffneg/main.tex'
const M = A.model || 'haiku'
const SYNTH_M = A.synthModel || 'opus'
const JOURNAL = A.journal || 'PRB'
const MATH = A.math || 'standard'
const REF = A.ref || 'standard'
const MAXCHUNK = A.maxchunk || 6
const RUNDIR = `${TEX.replace(/\/[^/]*$/, '')}/.pr-review/runs/${STAMP}`
const FIND = `${RUNDIR}/findings`
const REPORT = `${RUNDIR}/report.md`
const ROSTER = ['tasaki','lieb','nachtergaele','suzuki','childs','campbell','sandvik','troyer','cohen','preskill','sieberer']

const journalRule = JOURNAL.toUpperCase() === 'PRL'
  ? `apply ${SKILL}/references/PR.md AND layer ${SKILL}/references/PRL.md`
  : `apply ${SKILL}/references/PR.md (NOT the PRL rules)`

const common = `You are part of the pr-review skill: a pre-submission INTERNAL-CONSISTENCY audit for Physical Review manuscripts. Target journal: ${JOURNAL} — ${journalRule}. Read what you need from ${SKILL}/ and the manuscript ${TEX} (bibliography .bib/.bbl alongside). DISCOVER everything about the manuscript by reading it yourself — never assume its topic, claims, notation, or results. The run directory for THIS audit is ${RUNDIR}. Finding discipline (read ${SKILL}/SKILL.md "Discipline on findings" and "Output"): rows are ONE line, columns \`id | location | issue | sev | who(raised_by) | agreement | suggested-fix | checked | NOT-checked\`; sev in {critical,major,minor}; NEVER write a raw "|" inside a cell (write abs(...) / card(...) or escape \\|); never a literal newline inside a row; keep cells short; NEVER declare anything "correct"/"sound"/"valid"/"no issue"/"CHECK PASSED" — convey verification only via checked/NOT-checked; ids are <granularity>#<AXIS>-NNN (no loose C1/M2/S4); examples are seeds — generalize, do not fixate on literal examples.`

const SPLIT = `CRITICAL SPLITTING PRINCIPLE — read vs evaluate are separate: READ the WHOLE paper (you need context: where each symbol is defined, where each claim is supported, neighbouring sections). But you EVALUATE and emit findings ONLY for your assigned block (lines {RANGE}, "{LABEL}"). Scrutinize that block hard and exhaustively. If you notice a problem OUTSIDE your block while reading, do NOT file it as a finding — raise a one-line FLAG/note and leave it to that block's own agent. Splitting concentrates attention; it does not save reading.`

phase('Dispatch')
const dispatch = await agent(
  `${common}\n\nYou are the DISPATCHER. Read the ENTIRE manuscript ${TEX}, ${SKILL}/personas/README.md and ${SKILL}/SKILL.md. PLAN the audit (concentrate each later agent on one block to raise quality), returning:\n1) personas from this roster ONLY (basenames): ${ROSTER.join(', ')}. 3-4 for judgment levels L0-L4 fitting THIS paper; 3-4 for the math track (strongest rigor fit).\n2) workmap: for each of L2,L3,L4,L5,L6 a list of blocks to evaluate. Base unit = natural boundaries (\\section/\\subsection); SPLIT a long section into multiple blocks; you MAY merge very short adjacent sections. Each block = {label, lines:[start,end]} (1-indexed into ${TEX}). HARD CAP ${MAXCHUNK} blocks/level. L0/L1 are whole-paper (not in workmap).\n3) glossary: key symbols & terms with first introduction — symbols:[{name,first_line,section,notation}], terms:[{name,first_line,section}].\nReturn ONLY the structured object.`,
  { model: M, phase: 'Dispatch', label: 'dispatcher', schema: {
    type:'object', properties:{
      personas:{type:'object',properties:{l0_l4:{type:'array',items:{type:'string'}},mv:{type:'array',items:{type:'string'}}},required:['l0_l4','mv'],additionalProperties:false},
      workmap:{type:'object',properties:{
        L2:{type:'array',items:{type:'object',properties:{label:{type:'string'},lines:{type:'array',items:{type:'number'}}},required:['label','lines'],additionalProperties:false}},
        L3:{type:'array',items:{type:'object',properties:{label:{type:'string'},lines:{type:'array',items:{type:'number'}}},required:['label','lines'],additionalProperties:false}},
        L4:{type:'array',items:{type:'object',properties:{label:{type:'string'},lines:{type:'array',items:{type:'number'}}},required:['label','lines'],additionalProperties:false}},
        L5:{type:'array',items:{type:'object',properties:{label:{type:'string'},lines:{type:'array',items:{type:'number'}}},required:['label','lines'],additionalProperties:false}},
        L6:{type:'array',items:{type:'object',properties:{label:{type:'string'},lines:{type:'array',items:{type:'number'}}},required:['label','lines'],additionalProperties:false}},
      },required:['L2','L3','L4','L5','L6'],additionalProperties:false},
      glossary:{type:'object',properties:{
        symbols:{type:'array',items:{type:'object',properties:{name:{type:'string'},first_line:{type:'number'},section:{type:'string'},notation:{type:'string'}},required:['name'],additionalProperties:false}},
        terms:{type:'array',items:{type:'object',properties:{name:{type:'string'},first_line:{type:'number'},section:{type:'string'}},required:['name'],additionalProperties:false}},
      },required:['symbols','terms'],additionalProperties:false},
    }, required:['personas','workmap','glossary'], additionalProperties:false } }
)
const pick = (a)=>(a||[]).map(s=>String(s).toLowerCase().replace(/\.md$/,'').trim()).filter(s=>ROSTER.includes(s))
let L04=pick(dispatch.personas?.l0_l4); if(!L04.length) L04=['tasaki','lieb','nachtergaele']
let MVp=pick(dispatch.personas?.mv); if(!MVp.length) MVp=['lieb','nachtergaele','tasaki']
const wm=dispatch.workmap||{L2:[],L3:[],L4:[],L5:[],L6:[]}
for(const k of ['L2','L3','L4','L5','L6']) wm[k]=(wm[k]||[]).slice(0,MAXCHUNK)
const glossaryStr=JSON.stringify(dispatch.glossary||{}).slice(0,4000)
log(`Dispatcher: personas L0-L4=[${L04}] MV=[${MVp}]; blocks L2=${wm.L2.length} L3=${wm.L3.length} L4=${wm.L4.length} L5=${wm.L5.length} L6=${wm.L6.length}; run dir ${RUNDIR}`)

const SEES={
  L0:`LEVEL L0 (whole paper as ONE claim): do abstract/intro/results/conclusion tell the same paper; central claim strength vs what math establishes; central concept named consistently; coherent notation policy; "proved" vs "computable"; tone. Produce the paper map + global weaknesses + DECISIONS lower levels inherit.`,
  L1:`LEVEL L1 (the SKELETON itself — do NOT take current sectioning as given): carve-up natural; should something be/not be a section; granularity; ordering; placement of derivations/assumptions/results/symbol-introductions; main vs appendix. IGNORE sentences, symbols, typos.`,
  L2:`LEVEL L2 (a section): delivers its stated goal & coheres internally; terms/symbols defined before use & consistent with earlier sections. IGNORE typos, grammar, prose beauty.`,
  L3:`LEVEL L3 (paragraphs): each paragraph has one role & connects to neighbours; prose claim supported by a nearby equation; new-term timing; topic sentence; orphans. IGNORE symbol typos, equation correctness, grammar.`,
  L4:`LEVEL L4 (sentences): each sentence connects & serves its paragraph; claims no more than the equation shows; clear reference; therefore/thus real consequence; show/prove/suggest calibrated. IGNORE formal symbol consistency & algebra.`,
}
async function wholeLevel(level,personas,decisions,grp){
  const res=await parallel(personas.map(p=>()=>agent(
    `${common}\n\nEmbody ONE persona; read ${SKILL}/personas/${p}.md and review through that lens & prose taste.\n\n${SEES[level]}\n\nInherited DECISIONS:\n${decisions||'(none — top level)'}\n\nWrite findings to ${FIND}/${level}-${p}.md (one-line rows, ids ${level}#<AXIS>-NNN, raised_by=${p}, critical->major->minor; FLAG lines at top). End with "decisions to carry down". Return <=6 lines.`,
    {model:M,phase:grp,label:`${level}:${p}`})))
  return res.map((r,i)=>r?`[${level}/${personas[i]}] ${r}`:null).filter(Boolean).join('\n')
}
phase('L0'); const d0=await wholeLevel('L0',L04,'','L0'); let decisions=`From L0:\n${d0}`
phase('L1'); const d1=await wholeLevel('L1',L04,decisions,'L1'); decisions+=`\n\nFrom L1:\n${d1}`

phase('L2-L4')
function chunkPrompt(level,b,p){
  const range=`${b.lines?.[0]}-${b.lines?.[1]}`
  const sp=SPLIT.split('{RANGE}').join(range).split('{LABEL}').join(b.label)
  return `${common}\n\nEmbody ONE persona; read ${SKILL}/personas/${p}.md and review through that lens & prose taste.\n\n${sp}\n\n${SEES[level]}\n\nInherited DECISIONS:\n${decisions}\n\nGlossary:\n${glossaryStr}\n\nWrite findings (ONLY block ${range}) to ${FIND}/${level}-${range}-${p}.md (one-line rows, ids ${level}#<AXIS>-NNN, raised_by=${p}; out-of-block facts as FLAG at top). At END append an "EXTRACTION TABLE": symbols & terms used in your block (name | role | notation | line) for the drift check. Return <=5 lines.`
}
for(const lv of ['L2','L3','L4']){
  const blocks=wm[lv]||[]; if(!blocks.length){log(`${lv}: no blocks`);continue}
  const tasks=[]; for(const b of blocks) for(const p of L04) tasks.push(()=>agent(chunkPrompt(lv,b,p),{model:M,phase:'L2-L4',label:`${lv}:${(b.label||'').slice(0,16)}:${p}`}))
  await parallel(tasks)
}

phase('L5-L6')
function objChunk(level,b,sees){
  const range=`${b.lines?.[0]}-${b.lines?.[1]}`
  const sp=SPLIT.split('{RANGE}').join(range).split('{LABEL}').join(b.label)
  return `${common}\n\nOBJECTIVE check (NO persona). ${sp}\n\n${sees}\n\nGlossary:\n${glossaryStr}\n\nWrite findings (ONLY block ${range}) to ${FIND}/${level}-${range}.md (one-line rows, ids ${level}#<AXIS>-NNN, raised_by=objective; out-of-block facts as FLAG at top). For L5 also append an "EXTRACTION TABLE" of every symbol in the block (name | role | notation | line). Return <=5 lines.`
}
const L5sees=`LEVEL L5 (each symbol/equation in your block — EXHAUSTIVE): multi-axis formal consistency — definition at first use; type/shape; dimension/units; index convention & sum ranges & free/bound; symbol clashes; convention drift (superscript<->subscript, Greek<->Latin, font discipline); limits recover known results; normalization/conservation/symmetry; algebraic steps (gaps, hidden assumptions); math-name vs prose-term. Apply the embedded equation-audit checklist in ${SKILL}/references/math-verification.md to load-bearing/restated equations. Consult ${SKILL}/references/style.md. No raw "|" in cells (write abs(...)).`
const L6sees=`LEVEL L6 (each surface mark in your block): typo/grammar/punctuation/abbreviation/numbering/capitalization/units/APS style/caption/data-availability. Consult ${SKILL}/references/style.md and ${SKILL}/references/PR.md. IGNORE claims, terminology, equation content.`
{
  const tasks=[]
  for(const b of (wm.L5||[])) tasks.push(()=>agent(objChunk('L5',b,L5sees),{model:M,phase:'L5-L6',label:`L5:${(b.label||'').slice(0,16)}`}))
  for(const b of (wm.L6||[])) tasks.push(()=>agent(objChunk('L6',b,L6sees),{model:M,phase:'L5-L6',label:`L6:${(b.label||'').slice(0,16)}`}))
  if(tasks.length) await parallel(tasks); else log('L5/L6: no blocks')
}

phase('Drift')
await agent(
  `${common}\n\nDRIFT SWEEP (objective, NO persona). Do NOT re-read the whole paper. Read the EXTRACTION TABLES the L3/L4/L5 chunk agents appended to their files in ${FIND}/ (every file there) plus this glossary:\n${glossaryStr}\n\nFrom these tables alone, find CROSS-SECTION drift: a symbol whose notation changes between sections (superscript<->subscript, Greek<->Latin, italic<->bold), a concept named differently in different sections, a symbol reused for two meanings, two symbols for one meaning. Write findings to ${FIND}/DRIFT.md (one-line rows, ids L5#DRIFT-NNN, raised_by=objective; FLAG ->L1 where a missing notation policy is the cause). No raw "|" in cells. NEVER declare "consistent/correct". Return <=6 lines.`,
  {model:M,phase:'Drift',label:'drift-sweep'})

phase('MV')
if (MATH !== 'off') {
  const mvP=(p)=>`${common}\n\nMATH-VERIFICATION (MV) track, intensity ${MATH.toUpperCase()}, persona ${p} (read ${SKILL}/personas/${p}.md and ${SKILL}/references/math-verification.md). READ the whole paper. Follow MV across ALL rungs (claim<->math, theorem, derivation incl. inline/intermediate): (a) prose<->math correspondence at every granularity — is the prose actually GUARANTEED by the math? (b) be adversarially skeptical — try to REFUTE plausible steps.${MATH==='deep'?' At deep, attempt to prove gaps yourself; if you cannot, record "could not establish".':''} Use the embedded equation-audit checklist for restated/load-bearing equations. Inherited decisions:\n${decisions}\n\nWrite findings to ${FIND}/MV-${p}.md (one-line rows, ids MV#CLAIM/THM/DERIV-NNN, raised_by=${p}; FLAG MV->L0/MV->REF at top; end with Coverage). No raw "|" in cells; never declare correct. Return <=5 lines.`
  const mvObj=`${common}\n\nMV objective equation-audit floor (NO persona). Read ${SKILL}/references/math-verification.md and apply the embedded 5-principle checklist to load-bearing/restated equations across the paper. FORM check only. Write to ${FIND}/MV-objective.md (one-line rows, ids MV#EQ-NNN, raised_by=objective; FLAG MV->REF at top; end with Coverage). No raw "|" in cells; NEVER declare "correct"/"sound" — state what was checked. Return <=5 lines.`
  await parallel([...MVp.map(p=>()=>agent(mvP(p),{model:M,phase:'MV',label:`MV:${p}`})), ()=>agent(mvObj,{model:M,phase:'MV',label:'MV:objective'})])
} else log('MV: off')

phase('REF')
if (REF !== 'off') {
  const deep = REF==='deep' ? ' Additionally (deep): fetch and read borrowed references and check whether their assumptions/regime apply to this paper; FLAG REF->MV / REF->L0 when a borrowed result does not clearly apply.' : ''
  await agent(
    `${common}\n\nREFERENCE-VERIFICATION (REF) track, intensity ${REF.toUpperCase()}. Read ${SKILL}/references/reference-check.md and follow it. STANDARD = hygiene (verified by REAL WEB LOOKUP — use WebSearch/WebFetch; do NOT trust memory) + placement. Hygiene: every claim needing a citation has one; no duplicate/unused entries; bib fields correct; published journal version over arXiv. TRAPS: arXiv may show only an OLD version while a journal version exists; titles can DIFFER between arXiv and journal (mismatch alone is not a different paper — identify by authors+year+content). Unconfirmable -> NOT-checked. Placement: each citation supports its specific sentence; characterization of cited works faithful; priority/novelty claims consistent.${deep} Read .bbl/.bib and every \\cite site in ${TEX}. Write findings to ${FIND}/REF-track.md (one-line rows, ids REF#HYG-NNN/REF#PLACE-NNN/REF#DEEP-NNN, raised_by=objective; FLAG REF->MV/REF->L0 at top; end Coverage: how many entries web-verified vs not). No raw "|" in cells. Return <=6 lines.`,
    {model:M,phase:'REF',label:'REF:'+REF})
} else log('REF: off')

phase('Synthesize')
const synth=await agent(
  `${common}\n\nYou are the SYNTHESIZER. Read ALL finding files in ${FIND}/ (every .md, incl. DRIFT.md and all chunked L2-L6 files) and WRITE the single report to ${REPORT} — you MUST create the file (use the Write tool; if Write is unavailable to you, create it via a shell heredoc). Do NOT only print it. Follow ${SKILL}/SKILL.md "Output: the report" EXACTLY:\n(1) Flags first (origin.target.fact.why.related-id; level + MV/REF/DRIFT flags).\n(2) Part A = ONE markdown table per granularity in order L0,L1,L2,L3,L4,L5,L6, then MV rungs (MV#CLAIM,MV#THM,MV#DERIV,MV#EQ), then REF axes (REF#HYG,REF#PLACE,REF#DEEP), plus a DRIFT table. Columns EXACTLY: | id | location | issue | sev | who (raised_by) | agreement | suggested-fix | checked | NOT-checked |. TABLE HYGIENE IS CRITICAL: each row ONE physical line with exactly 9 columns; NEVER a raw "|" inside a cell (rewrite abs(...) / card(...) or escape \\|); NEVER a literal newline inside a row; keep cells short (push detail to checked/NOT-checked). 'who' lists the NAMES of every persona who raised the point; MERGE duplicates across chunk/persona files and keep the UNION of names; never collapse to a count. RENUMBER ids unique as <granularity>#<AXIS>-NNN; no loose C1/M2/S4. One-line divergence note under a table for any 'split'. Order critical->major->minor. Do NOT drop L2-L4 findings as "propagates from above". FORBIDDEN anywhere: "Correct Findings"/"no issues"/"sound"/"valid"/"CHECK PASSED"/"is correct" as a verdict — verification only via checked/NOT-checked.\n(3) Part B = fix-order index, each line a pointer to Part A by id.\n(4) Coverage = aggregate checked/NOT-checked incl. MV (equations followed vs not) and REF (entries web-verified vs not).\nHeader: manuscript + target journal (${JOURNAL}), model note (findings on ${M}; synthesized on ${SYNTH_M}), intensities (MV ${MATH}/REF ${REF}), dispatcher-split v2, run ${STAMP}. Do NOT invent findings. After writing, return <=8 lines: totals by severity, #flags, #drift, and CONFIRM the absolute path written.`,
  {model:SYNTH_M,phase:'Synthesize',label:'synthesizer'})
log('Synthesis complete')
return {runDir:RUNDIR, report:REPORT, personas:{l0_l4:L04,mv:MVp}, blocks:{L2:wm.L2.length,L3:wm.L3.length,L4:wm.L4.length,L5:wm.L5.length,L6:wm.L6.length}, summary:synth}
