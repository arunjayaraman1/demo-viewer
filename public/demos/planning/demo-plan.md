# STLC "Assurance Line" — Demo Prototype Plan

## Context

We are building a demoable, end-to-end **STLC (software testing lifecycle) prototype** that brings the
`stlc-assurance-blueprint.md` to life. The blueprint describes a non-GxP "Assurance Line": an
AI-assisted STLC where QA engineers assemble context from JIRA, author BDD test cases, generate
tool-agnostic automation, run it in CI across a browser×OS×auth matrix, and surface evidence in
BrowserStack — all orchestrated from a Claude Code-native **Assurance Workspace**, fed into an
**Assurance Platform**, executed by an **Assurance Pipeline**.

**Demo subject (decided in the prior session):** the **Medication Savings Finder** on
`https://www.pfizerforall.com/savings-support/prescription-assistance` — the only journey that is
interactive end-to-end in-domain, deterministic, business-meaningful, and splits cleanly into the
blueprint's happy-path / validation-rules / edge-case stories. Full rationale in
[site-analysis-findings.md](site-analysis-findings.md).

**The story we stage:** the feature was *planned + built in Sprints 1–2* (we create a JIRA board with
3 stories, all dev-complete). Now in **Sprint 3, QA engages** — assemble context, author, review/approve,
automate, self-heal, run in CI, and surface evidence. The whole thing must be walkable for a
**non-technical business stakeholder**.

**Build decisions (this session):**
1. **Fidelity: Maximal real** — real Atlassian Jira Cloud + Jira MCP, real GitHub Actions CI, real
   BrowserStack trial for evidence/reporting, real Claude Code skills, real Playwright/pytest runs
   against the live site.
2. **Assurance Platform: lightweight dashboard** — a static/JSON-backed SPA that tells the control-plane
   story (capability profile, review/approve gate, run history, portfolio roll-up, deep-links to evidence).
3. **Automation: both adapters** — author Gherkin once, generate **Playwright (TS)** and **pytest-bdd
   (Python)** implementations from it, to prove the tool-agnostic guarantee.

---

## Outcome / definition of done

A rehearsable run-of-show in which a presenter can, against real tooling:
walk a stakeholder through the JIRA board → run the `assure-*` workspace commands live → show authored
BDD cases approved → show automation generated for two tools → show a self-heal moment → trigger/show a
real GitHub Actions matrix run → land in a real BrowserStack reporting dashboard → and view the
portfolio roll-up in the Assurance Platform. With cached/recorded fallbacks so a live demo can't be
derailed by a flaky network or trial limit.

---

## 1. Repository / artifact layout

A single working directory (the current project root) containing the three components plus board data:

```text
stlc-prototype-1/
├─ stlc-assurance-blueprint.md        # source of truth (exists)
├─ site-analysis-findings.md              # feature analysis (exists)
├─ demo-plan.md                           # this plan
├─ jira/                                  # board seed + export (mirrors what's in real Jira)
│  ├─ seed-board.md / seed-board.json     # the epic + 3 stories, full detail (system of record = real Jira)
│  └─ consolidated-context.md             # OUTPUT of /assure-context
├─ .claude/
│  └─ skills/ (or commands/)              # the assure-* skills  ── Assurance Workspace (COMPONENT 1)
│     ├─ assure-context/  assure-author/
│     ├─ assure-automate/ assure-heal/  assure-pipeline/
├─ pfizerforall-tests/                    # the test repo  ── Assurance Pipeline source (COMPONENT 3)
│  ├─ .github/workflows/assurance.yml     # generated reusable matrix workflow
│  ├─ tests/                              # *.feature  (Gherkin, authored once)
│  ├─ steps/ts/                           # Playwright TS step impls
│  ├─ steps/py/                           # pytest-bdd Python step impls
│  ├─ fixtures/                           # cookie-dismiss, auth-per-mode, setup/teardown
│  ├─ utils/                              # shared helpers (selectors, waits)
│  ├─ data/                               # test data: medications + expected savings cards
│  ├─ browserstack.yml / conftest.py      # BrowserStack SDK + JUnit publish config
│  └─ assurance.profile                   # the Capability Profile for this repo
└─ platform/                              # Assurance Platform dashboard (COMPONENT 2)
   ├─ (Vite + React SPA)
   └─ data/*.json                         # profile, approval state, run history, roll-up
```

Rationale: matches the blueprint's prescribed test-repo structure (§8.3) and three-component model (§8),
so the demo's artifacts *are* the blueprint made concrete.

---

## 2. The JIRA board (maximal real)

**Setup:** a free **Atlassian Jira Cloud** site; project key e.g. `SAV`. Wire a **Jira MCP** into Claude
Code (official Atlassian Remote MCP Server via OAuth, or a community `mcp-atlassian` with an API token —
to be chosen at setup). `jira/seed-board.*` is the local mirror used to (a) create the issues and
(b) keep a reproducible copy for fallback.

**Epic:** `SAV — Medication Savings Finder`.

| Story | Type | Status | Gist | Acceptance criteria (Gherkin-style) |
|---|---|---|---|---|
| **SAV-1** | Happy path | Done | Search a Pfizer medication → tailored savings options | Given the savings page, When I type a partial name and select a medication from the autocomplete, Then a medication-specific savings panel renders (self-pay / co-pay card / contact). |
| **SAV-2** | Validation rules | Done | Search input behaves predictably | Substring match across catalog; case-insensitive; single char returns broad list; Clear-input resets; "Popular Searches" chips act as quick entry. |
| **SAV-3** | Edge case | Done | Graceful no-results | Given a non-Pfizer term (e.g. "aspirin"), When I type it, Then no listbox/results appear, no error is thrown, and the page stays stable. |

Each story carries: description, AC, dev sub-tasks (UI, autocomplete data, results panel), labels
(`savings`,`search`), story points, and is set **Done** (dev-complete). We add an open **QA sub-task**
("author + automate savings finder tests") to each, representing the Sprint-3 work we are about to do —
this reads naturally as "built, ready for QA."

**Deliberate gap (for the missing-scenario flag):** none of the three stories specify behavior for
**special characters / very long input / rapid typing (debounce)**. `/assure-context` will surface this
as a scenario no story covers — demonstrating the blueprint's §7.1 "quietly flag scenarios no story
specifies."

---

## 3. Component 1 — Assurance Workspace (Claude Code-native skills) — REAL

Real Claude Code skills/slash commands operating against the Capability Profile + adapters. Each writes
real artifacts so the demo shows tangible output.

| Command | Does | Reads | Writes / Acts |
|---|---|---|---|
| `/assure-context` | JQL across project key, consolidate the 3 stories, flag the missing scenario | Jira MCP | `jira/consolidated-context.md` |
| `/assure-author` | Generate Gherkin `.feature` files (happy/validation/edge + the flagged negative), MCP-friendly steps; publish for review | consolidated context | `pfizerforall-tests/tests/*.feature`; publish cases to **BrowserStack Test Management** |
| `/assure-automate` | From the `.feature` files, generate **both** adapters via the tool-adapter contract (steps, fixtures, utils, data) | `.feature` + `assurance.profile` | `steps/ts/*` (Playwright) + `steps/py/*` (pytest-bdd) + `fixtures/` + `data/` |
| `/assure-heal` | Run locally, hit the cookie-banner failure, classify *script-vs-app*, propose the cookie-dismiss fixture, wait for human approval, re-run green | local run output | fix to `fixtures/`, re-run |
| `/assure-pipeline` | Generate the GitHub Actions reusable matrix workflow from the profile | `assurance.profile` | `.github/workflows/assurance.yml` |

**Capability Profile** (`assurance.profile`): language `TypeScript + Python`; surface `frontend / e2e`;
tools `playwright, pytest-bdd`; auth modes `[public/sandbox]` (see §5 note); env `pfizerforall.com (public)`;
lane `non-GxP`. Both adapters and the pipeline are programmed against this profile, never hardcoded —
proving §6.

---

## 4. Component 3 — Assurance Pipeline (test repo + GitHub Actions) — REAL

- **Both adapters** implement the same Gherkin: `steps/ts/` (Playwright Test + `@cucumber`/Gherkin) and
  `steps/py/` (pytest-bdd + playwright-python). One `tests/*.feature` set drives both.
- **Fixtures** encode the cookie-consent dismissal (the blueprint's "cookie banner hides the button"
  anecdote, §4 — which we observed live) and per-auth-mode session handling.
- **`assurance.yml`** = reusable/composite GitHub Actions workflow, parameterised by the profile:
  set up runtime → configure BrowserStack → run the suite via each tool adapter across the
  **browser × OS × auth** matrix → publish normalised results to BrowserStack. Runs on a **private repo**
  (free Actions minutes, ~2,000/mo cap — matrix kept small), GitHub-hosted runners, results published
  to BrowserStack Test Observability (the grid is reserved) — the blueprint's §8.3 model.

---

## 5. Execution matrix & the auth dimension (decision to confirm)

`pfizerforall.com` is a **public site with no login**, but the blueprint's matrix includes auth modes
(OIDC/OAuth/MyPfizer/GTX/sandbox) that belong to *Pfizer Pro*. **Plan:** keep the **auth axis present** in
the matrix as a profile dimension set to `public/sandbox` (a no-op login fixture), so the demo *shows the
matrix capability* and the Auth/Env adapter shape, with a clear narration that real auth modes attach when
the app-under-test is Pfizer Pro. Concretely the demo matrix is **browser {Chromium, WebKit, Firefox} ×
OS {ubuntu, windows} × auth {public}** — kept small to respect BrowserStack trial minutes.

---

## 6. Evidence & Reporting (BrowserStack) — REAL

- **Test Management:** authored cases published here for the **review/approve gate** (Act 3).
- **Test Reporting & Analytics / Observability:** run results, pass/fail, video + log timeline, AI
  root-cause, flaky detection, trends. A **shared dashboard link** is the stakeholder-facing evidence
  surface — replacing today's "download-a-zip."
- **Publish path:** Playwright via the **BrowserStack SDK**; pytest via **JUnit XML upload** — both
  per blueprint §8.2, proving the Report adapter normalises across tools.
- **Trial constraint:** BrowserStack trials are minute-limited; we keep the matrix small and cache a
  reference run for fallback.

---

## 7. Component 2 — Assurance Platform (lightweight dashboard) — REAL build, static/JSON

A **Vite + React SPA** (no backend) reading JSON the workflow/skills update:
- **Capability Profile** view (renders `assurance.profile`).
- **Review & Approve gate** — the PO/SM step; toggling "approve" flips approval state JSON and is what
  "unlocks" automation in the narrative (mirrors §7.2). Deep-links to the cases in BrowserStack TM.
- **Run history + Portfolio roll-up** — status, pass-rate, trend for the app, shown in a portfolio
  shell that implies "many apps." Deep-links into the BrowserStack reporting run.

This tells the entire control-plane story (§8.2) without standing up a real backend/auth.

---

## 8. Demo run-of-show (8 acts → surfaces the stakeholder sees)

| Act | What happens | Surface shown |
|---|---|---|
| 0 · Setup | "Feature built in Sprints 1–2, now Sprint 3 QA" | **Jira board** (epic + 3 Done stories) |
| 1 · Assemble | `/assure-context SAV` → consolidated context + **flagged missing scenario** | Claude Code + `consolidated-context.md` |
| 2 · Author | `/assure-author` → Gherkin `.feature` files for all scenarios | Claude Code + `.feature` files |
| 3 · Review/approve | Cases published; PO approves the gate | **BrowserStack Test Mgmt** + **Platform** approve toggle |
| 4 · Automate | `/assure-automate` → Playwright **and** pytest-bdd from one Gherkin set | Claude Code + `steps/ts` + `steps/py` |
| 5 · Self-heal | Local run fails on cookie banner → `/assure-heal` classifies + proposes fixture → approve → green | Claude Code (the human-in-the-loop moment) |
| 6 · Pipeline + CI | `/assure-pipeline` → push → **real matrix run** | **GitHub Actions** live run |
| 7 · Evidence | Results, video/log timeline, AI RCA, trends | **BrowserStack reporting** shared link |
| 8 · Roll-up + triage | Portfolio view; a failure → RCA → PO sets P0/P1/P2 | **Platform dashboard** |

---

## 9. Build sequencing (phases)

- **Phase 0 — Prereqs & scaffolding.** Stand up the repo layout; provision the three accounts; wire the
  Jira MCP into Claude Code; create `assurance.profile`. *(Blocked on user-provided accounts/creds — see §10.)*
- **Phase 1 — Jira board.** Create epic + 3 stories (full detail, Done) + the deliberate gap; mirror in
  `jira/seed-board.*`.
- **Phase 2 — Workspace skills (author side).** Build `/assure-context` + `/assure-author`; produce
  `consolidated-context.md` and `tests/*.feature`.
- **Phase 3 — Test repo + both adapters + self-heal.** Build `/assure-automate` → `steps/ts` + `steps/py`,
  fixtures, utils, data; run locally; build `/assure-heal` and stage the cookie-banner heal to green.
- **Phase 4 — Pipeline + CI + evidence.** Build `/assure-pipeline`; push to the private GitHub repo; get a
  green matrix run; wire BrowserStack publish (SDK + JUnit) and confirm the reporting dashboard.
- **Phase 5 — Platform dashboard.** Build the SPA; wire profile / approval / run-history / roll-up JSON;
  deep-link into BrowserStack.
- **Phase 6 — Rehearse & harden.** Dry-run the 8 acts; capture cached evidence + short screen recordings
  as fallbacks; write a presenter script.

**Minimum demoable slice (if we need something showable fast):** Phases 1 → 2 → 3 with a *local*
Playwright run and the self-heal moment, plus the Jira board. That already demonstrates the AI-assisted
authoring + automation + human-in-the-loop heal story end-to-end without depending on CI/BrowserStack
trial timing. CI + BrowserStack + Platform then layer on as the "it's really wired up" payoff.

---

## 10. External prerequisites (user must provide / decide at Phase 0)

1. **Atlassian Jira Cloud** — a free site, project key, and the **Jira MCP choice**: official Atlassian
   Remote MCP (OAuth) vs. community `mcp-atlassian` (email + API token). Need credentials.
2. **GitHub** — account + a **private** repo for the test code (free Actions minutes, ~2,000/mo cap).
3. **BrowserStack** — trial account + credentials, and confirmation of **which products** the trial
   includes (Automate, Test Management, Test Observability/Reporting), since that gates Acts 3 & 7.

---

## 11. Risks & guardrails

- **Trial/minute limits** (BrowserStack) → small matrix + cached reference run.
- **Live-site fragility** — pfizerforall.com showed console errors and a cookie gate; Playwright worked,
  but we add resilient waits + the cookie fixture, and cache a recorded run for fallback.
- **No real auth on the AUT** → auth matrix demonstrated as `public/sandbox` with narration (see §5).
- **No real PII** — synthetic test data only; never complete the newsletter opt-in or any irreversible
  submission (the savings finder success state is reached without submitting personal data).
- **Maximal-real = more moving parts** → Phase 6 reliability fallbacks are non-optional for a live demo.

---

## 12. Verification (end-to-end dry run)

1. `/assure-context SAV` → `consolidated-context.md` lists all 3 stories **and** flags the
   special-char/long-input/debounce gap.
2. `/assure-author` → `tests/*.feature` covers happy/validation/edge + the flagged negative; cases appear
   in BrowserStack Test Management.
3. Approve the gate in the Platform/BrowserStack → automation "unlocked."
4. `/assure-automate` → both `steps/ts/` and `steps/py/` generated from the same `.feature` files.
5. Local run → cookie-banner failure → `/assure-heal` proposes the fixture → approve → suite green
   locally for **both** tools.
6. `/assure-pipeline` → push → **GitHub Actions** matrix run goes green; results publish to BrowserStack.
7. **BrowserStack** dashboard shows pass/fail + video/log timeline + RCA via a shared link.
8. **Platform** dashboard shows the capability profile, the approval, run history, and a portfolio
   roll-up that deep-links into the BrowserStack run.