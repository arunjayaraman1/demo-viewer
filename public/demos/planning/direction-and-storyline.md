# Where we are, and what the storyline should become

**Purpose.** Step back before the next Sunil call. Part 1 states where we actually are. Part 2 is the
argument for reframing the demo storyline around **Testing-as-a-Service (TaaS)** — the enterprise
workflow — with the QA loop nested inside as the delivery engine. Part 3 answers the black/grey/white-box
question. Part 4 adopts Kiril's human-in-the-loop (HITL) model and pins each gate to a state transition.
Part 5 is a concrete act-by-act spec for rewriting `assurance-demo-brief.html`. Part 6 is the decisions I
need from you before I rewrite it.

This doc is the gate. Storyline → mockup → design doc → build, in that order. Nothing gets built until
the experience reads right end to end.

---

## Part 1 — Where we are

### What's already real and working
- **Jira board (live).** Project `SAA`, board 422. Epic *Medication Savings Finder* → stories SAA-2/3/4
  (happy / validation / edge) + sub-tasks, all Done, plus **one deliberate spec gap** left unstoried so
  `/assure-context` can flag it. Created via the Atlassian MCP.
- **The `assure-*` skills (live).** `context → author → automate → heal → pipeline`, plus `flaky`. Both
  automation adapters — **Playwright (TS)** and **pytest-bdd (Py)** — generate from one Gherkin set and run
  green locally (8/8), and the cookie-banner self-heal works.
- **The application under test.** `pfizerforall.com`, the **Medication Savings Finder** journey. Public,
  non-GxP, no login. The prototype run even surfaced a candidate bug and posted it back to Jira.
- **A control-plane story.** Two forms of it: the old Vite dashboard under `prototype/platform/`, and the
  productized direction — the **Assurance Platform** (Next.js on the Launchpad starter), specced in
  `assurance-platform-design-doc.md` + `assurance-platform-prd.md`, with a clickable mockup
  (`assurance-platform-mockup.html`, v7).

### What's decided (locked)
- **Non-GxP light-touch lane first** (~80% of the market — Bharath). GxP/CRS parked.
- **Sunil's four focus areas:** **Authoring → Automation → Integration → Evidence capture.** This is the
  spine of the *buildable* demo.
- **Tool-supported, not tool-agnostic.** The platform/orchestration/adapters are constant; the tool under
  them (Playwright, pytest-bdd, later Selenium/k6/etc.) is a choice. We built both adapters only to *prove*
  this — one tool is the product default.
- **Terminology:** **Application** (the product, owns integrations + env) → **Feature** (a Jira epic under
  assurance, owns suites/approval/findings). Three flows: **Connect Application → Set up Assurance
  (per app) → Validate Feature (per feature)**.
- **BrowserStack Test Management is in the MVP** (home of approved manual BDD cases + traceability;
  approval writes status back). **Test Observability** = evidence, read-only.
- **Findings carry an AI-drafted RCA**; authoring applies **ISTQB techniques** (BVA / equivalence /
  decision tables). Auth modes, tunnels, mobile, visual/Figma = phase 2/3. Unit-test (white-box) generation
  = dropped for now.

### The demo the current `assurance-demo-brief.html` tells
Setup (6 prereqs) → Situation + cast (Platform Lead, QA, PO) → two sprints of backstory → **6 acts**
(connect → set rules → context+author → PO gate → automate+heal → evidence) → **3 journeys**
(Connect Application / Set up Assurance / Validate Feature).

**It's good, and it's the delivery engine.** But it opens *inside* the QA team, mid-sprint. It answers
"how does QA assure a feature?" It does **not** yet answer the question the stakeholders actually framed:
**"how does a team buy testing as a service, and how is that engagement governed?"** That gap is the whole
of Part 2.

---

## Part 2 — The reframe: make the service workflow the spine

Re-read what Sunil, Kaushik and Bharath actually described. It is not a QA tool. It is a **service**:

- Kaushik: teams stop cloning a shared boilerplate; instead a **project team comes and requests the
  services it needs**, centrally managed, **billed** — "so revenue can be generated for the automation
  testing team… based on the services they choose, they will be charged."
- Srish's own worked example on the call: Kiril's app team builds a feature, the **PO requests TaaS** from
  Dan's team, a QA (Bharath) is **booked**, delivers, findings come back, green sign-off, **invoice**.
- Sunil: the **bill is generated up-front** based on which services (functional, load with N threads,
  accessibility, security…) the team pre-books. The consumer picks what matters ("internal app — skip SEO,
  security matters, I'll live without perf").

So there are **two sides**, and the demo currently only shows one:

| | **Consumer** (app team) | **Provider** (Assurance / DevSecOps team) |
|---|---|---|
| Who | Requesting PO / App Lead (the Kiril-analog) | Assurance Lead (Dan/Sunil-analog) + QA Engineer (Bharath-analog) |
| Wants | "Assure my feature, tell me it's safe to release" | Scope it, price it, deliver it, evidence it |
| Sees | Intake form, scope/estimate, a health dashboard, sign-off | The delivery engine (the `assure-*` loop) |

**The service lifecycle becomes the metro line.** The QA loop we already built is the *middle* of it, not
the whole of it:

```
 REQUEST  →  SCOPE & AGREE  →  CONNECT  →  ONBOARD  →  ┌── ASSURE (the engine) ──┐  →  SIGN-OFF  →  (BILL)
 (intake)    (service menu +   (wire app  (QA set-up)  │ context→author→GATE→    │     accept &
             estimate, GATE)    once)                  │ automate→heal→run→triage│     mark Assured
                                                       └── evidence ────────────┘
 └─ consumer ─┘   └── provider (lead) ──┘   └── provider (QA) — Sunil's 4: Author·Automate·Integrate·Evidence ──┘   └─ consumer ─┘
```

Why this is the right move:
1. **It matches how they think.** Intake, scope, resource booking, sign-off, billing are *their* words. The
   demo should mirror their landscape back at them — that's the credibility we're buying with this call.
2. **It makes workflows and roles prominent**, which is exactly what you asked for. Enterprise teams don't
   buy a script generator; they buy a *governed engagement*.
3. **Intake carries the context that changes everything downstream.** "PfizerForAll is an existing site;
   we're testing **1 new feature**, not a new app" is not a footnote — it decides scope, whether we plug
   into an existing test repo vs. create one, and how much regression surrounds the change. Capturing
   *new-app vs. new-feature-on-existing*, *stage/sprint*, *which features*, and *lane* at intake is what
   makes the rest honest.
4. **The engine stays exactly what we built.** Nothing we've built is wasted; it becomes "how the service
   is delivered" inside stage 5.

### Honesty about what's live vs. narrated
The current brief boasts "nothing is mocked." After the reframe that's no longer literally true, and that's
fine — we just have to be explicit:
- **Live/real:** the engine — `assure-*` skills, both adapters, self-heal, CI matrix, BrowserStack
  evidence, the Jira board.
- **Shown in the Platform UI (mock data), narrated:** intake, service catalog + estimate, connect-app,
  onboarding wizard, the health roll-up, sign-off. These are the enterprise wrapper. They *look* like a
  product because the Platform mockup exists — we lean on it.

The line to hold on the call: *"The wrapper is the product surface; the engine underneath is real and
running against a live site today."*

---

## Part 3 — Black / grey / white-box testing (the answer)

You asked whether there's merit here and said you're not a QA. Short version: **these three terms describe
how much the tester can see inside the code — nothing more.** They are not products or lanes. Here's the
whole thing, and where it lands for us.

| | **Black-box** | **Grey-box** | **White-box** |
|---|---|---|---|
| Visibility | None — test through the UI/API like a user, against the requirements | Partial — you know the architecture, DB schema, API internals, logs | Full — you design tests against the source code itself |
| Typical tests | E2E / functional / UI, API-from-outside | UI action verified against DB/state; API tests knowing validation rules; architecture-aware RCA | Unit tests, branch/path coverage, static analysis |
| ISTQB techniques | Equivalence partitioning, **boundary-value analysis**, decision tables, state transition | — | Statement/branch/condition coverage |
| Who owns it | QA | QA (with dev context) | Developers |

**What this maps to for us:**
- **Our core loop is black-box functional E2E.** We drive the Medication Savings Finder through the browser
  as a user and check outputs against the stories. That *is* the 80% non-GxP lane. The ISTQB techniques
  Bharath keeps citing (BVA, equivalence, decision tables) are black-box techniques — they're already the
  "to your rigour" promise in `/assure-author`.
- **Grey-box is our natural next layer, and we're already leaning into it.** The moment the agent reads the
  **Jira stories + the repo + the architecture** to author better tests, flag missing scenarios, and draft
  an architecture-aware RCA ("this UI failure traces to that flow"), it's using partial internal knowledge —
  that's grey-box. Adding **API-level checks alongside the UI checks** (Bharath: "UI validation + API,
  then the login page is 100%") is the concrete grey-box expansion. This is a roadmap item, not MVP.
- **White-box (unit/coverage) we deliberately left to developers.** We already dropped unit-test
  generation for the MVP. Bharath's own suggestion — hand devs a skill to generate unit tests from a story
  + the code file — is exactly this, and it belongs as an *optional dev-side add-on later*, not in the QA
  service.

**Recommendation.** Do **not** expose black/grey/white as a user-facing toggle — it would confuse the
buyer. Instead:
1. Keep it as the vocabulary that *maps our test-type services onto QA-standard language*. Our audience are
   career QAs (Bharath, Kaushik, Rodrigo) — using the model correctly signals we speak their language.
2. Add **one explainer slide**: "How deep does assurance go?" — black now (E2E, the 80% lane) → grey next
   (API + UI, architecture-aware authoring & RCA) → white = dev-owned (optional later). It doubles as the
   roadmap and ties directly to the service catalog (test types *are* the services).

That's the merit: it's a credibility and roadmap device, not a feature.

---

## Part 4 — Human-in-the-loop: adopt Kiril's model

Kiril's instinct is right and we should adopt it wholesale: **autonomous for analysis and execution, human-
gated at every point where something becomes official or changes state.** HITL is not a review after every
agent step — it's tied to **risk-bearing state transitions**. This is also, conveniently, exactly what makes
the *workflow* visible, which is what you want the demo to foreground. The gates *are* the enterprise
governance.

Mapping his six points onto our lifecycle as explicit gates:

| Gate | Where | Who | State transition it guards | Kiril's point |
|---|---|---|---|---|
| **A. Engagement** | after Scope | Assurance Lead (+ consumer accepts) | request → funded/booked engagement | (the TaaS wrapper) |
| **B. Cases signed off** | after `/assure-author` | Product Owner + QA | draft cases → approved, automation unlocked | #1 |
| **C. Automation merged** | after `/assure-automate` | QA | generated code → merged to the official test repo (via PR) | #3 |
| **D. Self-heal approved** | inside `/assure-heal` | QA | proposed selector/script fix → applied (show the **diff + rationale**) | #4 |
| **E. Failure classified** | after a red run | QA | app-bug / test-issue / flaky / env → *confirmed* before it writes a Jira defect or flips status | #5 |
| **F. Evidence accepted** | after the run | QA + PO | "tests passing" → **"feature Assured"** (a human-accepted state) | #6 |

Two principles from Kiril to state on their own, because they cut across gates:
- **#2 — Nothing writes to a system of record silently.** Any write to Jira / BrowserStack / GitHub status /
  the feature's assurance state is either approved or, at minimum, clearly reviewable. In the demo, every
  write-back is visibly attributable to a gate above.
- **"Passing" ≠ "Assured."** Gate F is the one most orgs skip and the one that makes this a *governed
  service* rather than a CI job. Keep it prominent.

Everything *between* gates runs autonomously: context gathering, coverage mapping, drafting cases,
generating automation, running the suite, collecting evidence. That contrast — autonomous engine, gated
transitions — is the story.

His caveat stands: this is from the demo screens, not the code. Once he has the repo he'll place these gates
precisely (UI layer vs. workflow/state-machine vs. action policy vs. integration layer vs. agent runtime).
For the storyline we only need them as *narrative* gates; the architectural placement is a design-doc
question for later.

---

## Part 5 — Proposed storyline (spec for the HTML rewrite)

Reframe `assurance-demo-brief.html` from "6 QA acts" to "the service lifecycle, with the engine inside it."
Keep the visual language (metro line, act slides, journey tracks, light/dark) — it already fits a "line"
with "stations" and "gates." Proposed spine:

**Opening**
1. **Title** — reposition subtitle from "AI-assisted assurance" to **"Testing-as-a-Service for the
   Assurance Line"**. Keep the integrates-strip.
2. **The shift** (new) — one slide: from *"clone the boilerplate, manage it yourself"* to *"request the
   services you need, centrally delivered, evidenced, billed."* Kaushik's problem statement in one frame.
3. **Two sides, one line** (new) — the consumer/provider table as a visual; introduces the expanded cast.

**Section A — The engagement (the new wrapper; shown in Platform UI, narrated)**
4. **Act 1 · Request** — the app team's PO submits **intake**: *new feature on an existing site
   (PfizerForAll), Sprint 3, these features, non-GxP.* Captures new-app-vs-new-feature, stage, features,
   lane.
5. **Act 2 · Scope & agree** — the **service catalog** (functional/E2E now; API, performance, accessibility,
   visual, security later) → pick what matters → an **estimate** → **Gate A**. This is where the
   black→grey→white "how deep" slide can live, or adjacent.
6. **Act 3 · Connect** — Platform Lead wires the Application to Jira / repo / environment / BrowserStack
   once; features sync from Jira. (≈ current Act 1.)
7. **Act 4 · Onboard** — QA's **Set up Assurance** wizard: one framework, matrix, lane, test repo. (≈
   current Act 2; this is the "current onboarding flow" you referenced.)

**Section B — The engine (live/real; Sunil's four: Author · Automate · Integrate · Evidence)**
8. **Act 5 · Context & author** — `/assure-context` flags the unstoried gap; `/assure-author` writes
   ISTQB-rigorous BDD into Test Management. → **Gate B** (PO signs off cases).
9. **Act 6 · Automate** — `/assure-automate` generates the suite into a **branch/PR**. → **Gate C** (QA
   reviews/merges).
10. **Act 7 · Heal** — `/assure-heal` triages script-vs-app, proposes a fix **with diff + rationale**. →
    **Gate D** (QA approves) — back to green.
11. **Act 8 · Integrate & run** — `/assure-pipeline` → CI matrix; evidence (video/trace) lands in
    BrowserStack. A real bug surfaces with an **AI-drafted RCA**. → **Gate E** (QA confirms
    classification before it writes a defect).

**Section C — The close (consumer-facing)**
12. **Act 9 · Assure & sign off** — evidence rolls up on the Platform; **Gate F** separates "passing" from
    **"Assured."** Stakeholder reads health; PO makes the release call. (later: **Bill** — services
    consumed → invoice.)

**Reference section — the journeys (keep, extend)**
13. Keep the three journey metro-maps; **add a fourth upstream journey: *Request & Scope an Engagement***
    (consumer + lead), so the reusable-flows section matches the new spine.
14. **Gate legend** — a single slide listing gates A–F and the "nothing writes silently / passing ≠
    assured" principles. This is the HITL story on one page for Kiril and the stakeholders.

Net effect: same engine, now wrapped in the service workflow, with governance (the gates) as the visible
connective tissue. Roles are prominent; the buyer sees themselves in Acts 1–2 and 9.

---

## Part 6 — Decisions (locked 2026-07-05)

1. **Commercial wrapper: governance only, no pricing.** Intake + scope (features / test types / lane /
   matrix) + sign-off. **No estimate, booking or bill anywhere.** The service catalog still appears (test
   types = the menu) but carries no money. The story is a *governed, agreed engagement* — not a quote.
2. **Show both consumer and provider sides — lightly.** Consumer = the app team; provider = the assurance
   team. This is what makes it read as TaaS.
3. **Cast (4):** *Sofia Mehta — Requesting Product Owner* (consumer: intake, Gate B, Gate F); *Marcus Reyes
   — Assurance Lead* (provider: scope, connect, Gate A); *Lena Park — QA Engineer* (provider: the engine,
   Gates C/D/E); plus *Stakeholder (viewer)*. Colours: consumer/PO = amber (`po`), Lead = slate (`lead`),
   QA = teal (`qa`).
4. **Black→grey→white explainer: include, one slide** ("How deep does assurance go?"). Doubles as roadmap +
   service-catalog tie-in.
5. **HITL gates: B, D, E, F get full storyline beats; A and C are lighter touchpoints** — so the demo
   isn't a gauntlet of approvals (respects Kiril's "not after every step").
6. **Sequencing:** storyline HTML now → mockup → design doc → build. This rewrite = `assurance-demo-brief.html`
   to the Part 5 spec, with the decisions above.
