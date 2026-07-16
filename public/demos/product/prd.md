# Assurance Platform — Product Requirements Document (PRD)

**Version:** v1 (control-plane portal) · **Status:** Draft for build · **Date:** 2026-06-30
**Companion:** [assurance-platform-design-doc.md](assurance-platform-design-doc.md) (architecture, data model, IA),
clickable mockup at `assurance-platform-mockup.html`.

---

## 1. Summary

The **Assurance Platform** is the **control plane for the STLC Assurance Line** — a web app where teams
see and govern AI-assisted testing across their applications: capability profiles, **test cases (synced
with BrowserStack Test Management)**, the review/approve gate, CI run history with evidence, findings
(with AI-drafted RCA), and flaky management, rolled up across a portfolio.

**v1 delivers the platform** over already-instrumented repos (the Assurance Line skills + CI exist locally
today). **"Assurance AI Kit" is the separate local setup kit** — it installs everything a machine needs
(Claude Code, `assure-*` skills, MCP config, tools/Playwright, docs/automation) and scaffolds the test
repo. The Assurance AI Kit is a **milestone after the platform's phase-1 MVP** (see §12), not v1.

> **Positioning:** the platform is the **Delivery & Quality** surface of Pfizer's Assurance Line (within
> METRO) — JIRA, the STLC crew, gates, and **STLC deliverables**. Scoped **non-GxP first**. The upstream
> Solution Intelligence orchestrator (CMDB / risk / classification / supplier) and GxP are out of scope.

> **Terminology** (per design doc §2a): an **Application** is the product (e.g. *PfizerForAll*); a
> **Feature** is an epic/slice under assurance (e.g. *Medication Savings Finder* = a Jira Epic). A
> Feature owns its cases, approval gate, and findings; the Application owns integrations + environment.
> (Supersedes the earlier "App"/"Project" naming.)
>
> **Runs locally for the demo:** the whole platform runs via `docker compose` (Next.js + Postgres) on a
> laptop — no cloud hosting in this phase.

### Problem
Today the Assurance Line works but its state lives in scattered places (Jira, GitHub Actions,
BrowserStack, local files). There is no shared, persistent, role-aware surface for a QA, a PO, or a
stakeholder to see status, approve work, and triage findings across apps.

### Goals (v1)
- A persistent, multi-user, **Application/Feature-centric** control plane with real data from Jira / GitHub / BrowserStack.
- **Test cases synced with BrowserStack Test Management** — the home of the approved manual BDD cases + traceability.
- The **review & approve gate** as a first-class, audited action (identity-stamped; operates on the Test-Management cases; full RBAC later).
- **Run history + evidence** (video/trace/Observability deep-links) and **findings (with AI-drafted RCA) / flaky** visibility.
- A **portfolio roll-up** across Applications.
- A modern, polished, themeable UI (shadcn) on the org Launchpad stack, **runnable via `docker compose`**.

### Non-goals (v1)
- The **Assurance AI Kit** setup kit (a milestone after platform phase-1).
- Authoring/generating tests in-app — still done locally via the `/assure-*` skills; the **platform reflects and syncs** the authored cases to/from BrowserStack Test Management.
- Triggering CI from the platform (v1 reads results; trigger is a later enhancement).
- Auth modes (OIDC/OAuth/MyPfizer/GTX), BrowserStack Local private-environment tunnels, mobile, and visual/Figma testing (phase 2/3).
- Real-device grid execution; the upstream Solution Intelligence orchestrator and GxP lane.

---

## 2. Personas & roles

**v1 auth is intentionally minimal.** Better Auth ships in the Launchpad starter, so we get a real
login + identity cheaply — used to **stamp who approved** the gate and to show "signed in as". We
**seed a couple of users** (a QA and an Approver). **Full RBAC** (role management UI + server-side
enforcement of the matrix below) is **deferred to a later phase**; v1 shows the right controls per the
seeded user's role but does not invest in hardened enforcement.

| Role (target model) | Can |
|---|---|
| **Admin** | Manage org, members/roles, integrations, Applications. All Approver/QA rights. |
| **QA Engineer** | Create/configure Applications & Features, view everything, triage findings/flaky, request approval. |
| **Approver (PO/SM)** | Review & **approve/revoke** the gate; comment; view everything. |
| **Viewer (stakeholder)** | Read-only: dashboards, runs, evidence, findings. |

Sessions are cookie/JWT per the Launchpad pattern. Approvals are **identity-stamped and audited** in v1.

---

## 3. Information architecture

```
Dashboard · Applications · Skills · Integrations · Team · Settings
Application detail → its Features
Feature detail → Overview · Test Cases · Approvals · Runs · Findings · Flaky
```
(Onboard — the Assurance AI Kit setup-kit page — is added with the kit milestone, after platform phase-1.)

---

## 4. Functional requirements (by area)

Each requirement: **FR-#** + user story + Given/When/Then acceptance criteria.

### 4.1 Authentication & access
- **FR-1 Sign in.** *As a user, I sign in so I can access my org's control plane.*
  - Given valid credentials, When I sign in, Then I land on the Dashboard scoped to my org.
  - Given I am unauthenticated, When I open any app route, Then I am redirected to `/login`.
- **FR-2 Roles (v1 minimal).** *As a seeded user, my role determines which controls I see.*
  - Given I am signed in as an Approver, Then the approve/revoke control is available; as a QA, it is not.
  - v1 shows role-appropriate controls from the **seeded** user's role; **role management UI + hardened
    server-side enforcement are deferred** to a later phase.

### 4.2 Dashboard (portfolio)
- **FR-3 Portfolio health.** *As any user, I see overall assurance health at a glance.*
  - Then I see KPIs: Applications onboarded, 7-day pass rate (+sparkline), open findings, scenarios automated.
  - Then I see an **Applications** list (status pill, pass rate, finding count) and a **Needs attention**
    list (open bugs, proposed-scenario gaps, observations) and **Recent runs**.
  - When I click an Application / run / finding, Then I navigate to its detail.

### 4.3 Applications & Features (creating an assurance scope)
- **FR-4 Connect an Application (one-time, lead/admin).** *As a lead/admin, I connect a product so its
  features can be assured — before QAs start.*
  - When I add an Application, Then I set name + team and link a **Jira project, a GitHub repo (the app's
    source, not the test repo), and an environment** (+ BrowserStack), from connected Integrations.
  - Then its **features are pulled from the Jira project's epics** automatically (no hand entry); a QA is
    granted access and does not create the Application.
  - **Feature data provenance:** dev status from Jira epic/story statuses; sprint(s) from the Jira sprint
    field (active sprint shown as context — the app does **not** track a user's join sprint); deployment
    is **confirmed in the wizard** in v1 (auto-detect via the deploy pipeline is later); assurance status
    from the platform's own records. Default Feature = Jira Epic.
- **FR-5 Set up assurance (per Application, once).** *As a QA/lead, I configure the app's assurance one
  time.* A guided flow (design doc §2b):
  - Step 1 — **choose ONE E2E framework**: Playwright (TS) *or* pytest-bdd (Py); Cypress/Selenium
    roadmap. Switchable later (profile change). **Not** multi-select — two E2E tools = duplicate
    coverage. Separately, **test types** (E2E now; API / performance / accessibility later) are
    distinct adapters/modalities, surfaced as extensibility.
  - Step 2 — **matrix** (browser × OS) + **environment** + **lane**. *(Auth modes, private-environment
    tunnels, and mobile are deferred — see Non-goals; not in phase-1.)*
  - Step 3 — create the **one test repo** for the app (scaffolded with the framework's suite + skills +
    CI). *(Use-existing-repo is a later option.)*
  - Step 4 — Review → Create: persists the Application's **capability profile** (`assurance.profile`)
    and creates the repo.
- **FR-6 Validate a feature (per feature, repeated).** *As a QA, I validate a dev-complete feature using
  the app's existing setup.*
  - Given the app's assurance is set up, When I pick a dev-complete feature (Jira epic), Then it
    **inherits the app profile** (no tool re-pick) and I run `/assure-context → author → (approve) →
    automate → heal → run`; tests land in the shared repo tagged to that feature.
  - Then the feature shows its inherited **capability profile** (framework, matrix, environment, lane)
    and quick links to repo / Jira epic / Observability.
  - **Advanced (later):** per-feature overrides (different matrix / extra test type) on top of the profile.

### 4.4 Test Cases (synced with BrowserStack Test Management)
- **FR-7 Authored cases.** *As any user, I see what is being tested.*
  - Then I see suites and scenario counts, each linked to its Jira story, with review state
    (approved / pending / proposed).
  - Then **proposed** suites (flagged gaps with no story) are clearly marked.
  - Then each case shows its **BrowserStack Test Management** link + **sync state** (in-sync / drifted).
  - **Authoring rigor:** authored cases apply **ISTQB test-design techniques** (boundary-value analysis,
    equivalence partitioning, decision tables); the technique(s) used are visible per scenario.
    *(Authoring runs locally via `/assure-author`; the platform reflects + links what was published.)*
- **FR-7a Publish/sync to Test Management.** *As QA, my authored manual BDD cases live in Test Management.*
  - When cases are authored/updated, Then they are **published to BrowserStack Test Management** (created
    or updated, idempotently), and the platform shows each case's TM id + last-synced time.
  - Then the `.feature`/automation in the test repo and the TM cases stay reconciled (drift is surfaced).

### 4.5 Approvals (the gate)
- **FR-8 Review & approve.** *As an Approver, I approve the authored cases to unlock automation.*
  - Given I am an Approver and the gate is pending, When I approve, Then the gate flips to **Approved**,
    is **persisted**, stamped with my identity + timestamp, recorded in the audit log, **and the status is
    written back to BrowserStack Test Management** (recommended default; configurable to deep-link only).
  - Given the gate is approved, When I revoke, Then it returns to pending (audited; TM status updated).
  - Given I am QA/Viewer, Then the approve/revoke control is not available to me.
  - Then approved/pending/proposed state is reflected per case; deep-links to Jira + Test Management.
- **FR-9 Approval history.** Then I can see who approved/revoked and when.

### 4.6 Runs & evidence
- **FR-10 Run history.** *As any user, I see CI runs and outcomes.*
  - Then I see runs (time, trigger, change, jobs passed/total, status) sorted recent-first, with a link
    to the GitHub Actions run.
- **FR-11 Run detail (matrix).** When I open a run, Then I see each matrix cell (adapter × browser × OS)
  with status, duration, and **evidence deep-links** (BrowserStack video/trace; Observability build).
- **FR-12 Ingestion.** Runs are ingested from GitHub (run summary) and enriched with BrowserStack
  Observability references. *(v1: pull/poll or receive a posted summary; webhook automation may follow.)*

### 4.7 Findings & triage
- **FR-13 Findings list.** *As QA, I triage what automation surfaced.*
  - Then I see findings (Bug / Observation) with severity, classification, status, browser, source, and
    Jira link; filterable by type/status.
- **FR-14 Classification clarity.** Then product-intermittent issues (e.g. SAA-16) are shown as **Bugs**,
  explicitly distinct from flaky tests.
- **FR-15 RCA + triage action.** *As QA, I provide a root-cause analysis; the PO sets priority* (matches
  the real Pfizer flow — QA gives the RCA, the PO decides P0/P1/P2).
  - Then each finding carries an **AI-drafted RCA** (from the failure + trace/evidence) that the QA can
    edit and confirm; the **PO sets priority** (P0/P1/P2). *(v1 sets platform-side status + RCA +
    deep-link; write-back to Jira is configurable.)*

### 4.8 Flaky
- **FR-16 Flaky register.** *As QA, I see and manage flaky tests.*
  - Then I see flaky tests with pass-rate, classification (test vs product), and quarantine state.
  - Given none are flaky, Then I see an explicit empty state explaining the suite is deterministic and
    that product-intermittent issues are tracked as Bugs (not quarantined).

### 4.9 Skills catalog
- **FR-17 Skills.** *As any user, I see the `assure-*` skills + versions the Assurance AI Kit installs.*
  - Then I see each skill, a one-line description, and its version; the active bundle version is shown.

### 4.10 Integrations
- **FR-18 Connect integrations.** *As Admin, I connect Jira / GitHub / BrowserStack (Test Management +
  Observability).*
  - When I connect, Then I store config + a **secret reference** (secrets encrypted at rest, never
    rendered back); connection status is shown (connected / error).
  - Then Applications can be linked to specific projects/repos from connected integrations, including a
    **BrowserStack Test Management** project (cases) and a **Test Observability** project (evidence).

### 4.11 Team & settings
- **FR-19 Team.** Admin lists members and roles; invites are a later enhancement (v1 may seed members).
- **FR-20 Settings.** Profile, theme (light/dark), personal access tokens, and the org **audit log**.

---

## 5. Data model (v1)

See design doc §8. v1 entities: `organization`, `user`, `application`, `feature`, `integration`,
`capability_profile`, `suite` (+ `tm_suite_id`), `scenario` (+ `tm_case_id`, `technique`), `approval`
(+ `tm_status_pushed`), `run`, `job_result`, `finding` (+ `priority`, `rca_text`), `flaky_record`,
`audit_log`. (`onboarding_token`, `kit_install` arrive with the **Assurance AI Kit** milestone.)

---

## 6. Integration contracts (v1)

| System | v1 reads | v1 writes |
|---|---|---|
| **Jira (Atlassian)** | epics (= features), stories, statuses, sprint, links | (optional) create/update finding bugs |
| **GitHub** | Actions run summaries (status, jobs, commit, URL) | — (no triggering in v1) |
| **BrowserStack — Test Management** | manual BDD cases, suites, approval/run status | **publish/update cases; write approval status** |
| **BrowserStack — Test Observability** | build/results refs, evidence (video/trace) deep-links | — |

Ingestion is **pull/poll or posted-summary** in v1; signed webhooks are an enhancement. Test Management
is **read/write** (the only v1 write to BrowserStack).

---

## 7. Non-functional requirements

- **NFR-1 Security (v1):** secrets encrypted at rest, never returned to the client; audit log for all
  state changes; approvals identity-stamped. *(Full server-side RBAC enforcement is a later phase.)*
- **NFR-2 Performance:** dashboard interactive < 2s on typical data; lists paginate beyond ~50 rows.
- **NFR-3 Accessibility:** WCAG 2.1 AA — keyboard nav, visible focus, semantic roles, contrast; honors
  `prefers-reduced-motion` and `prefers-color-scheme`.
- **NFR-4 Responsive:** usable from ~360px to wide desktop; tables scroll within their container.
- **NFR-5 Theming:** light/dark via shadcn/next-themes; chosen cool-slate neutrals + cyan accent;
  semantic colors (pass/fail/flaky) distinct from the accent.
- **NFR-6 Quality:** Vitest unit + Playwright E2E (we dog-food our own Assurance Line on the platform);
  Biome lint/format clean; typechecks pass.
- **NFR-7 Observability:** structured logging; error boundaries; sane empty/loading/error states.

---

## 8. Tech & architecture (summary)

Built on the org **Launchpad** starter: Next.js 16 (App Router) + React 19, **shadcn/Tailwind**,
**Drizzle + Postgres**, **Better Auth** (minimal in v1), route handlers/server actions for the API,
**LLM module** available for later assist features. **Runs via `docker compose` (Next.js + Postgres)
locally for the demo** — cloud deploy (Cloudflare/OpenNext) deferred. Full mapping in design doc §9.

---

## 9. UX principles

- Summary before detail; **state encoded as pills/dots/severity**, scannable at a glance.
- Approve/primary actions obvious; destructive/role-gated actions guarded.
- Real, recognizable copy ("Approve" → toast "Approved"); helpful empty states; no dead ends.
- Evidence is one click from a run; Jira/Observability deep-links everywhere they help.

---

## 10. Milestones (v1 build)

- **M0 Design-first:** refine wireframes for all screens → clickable Next.js UI shell (shadcn, mock
  data), reviewed. *(current step)*
- **M1 Shell + auth:** scaffold from Launchpad (Drizzle/pg, Better Auth — minimal); sidebar nav, theme, seeded users; `docker compose` up.
- **M2 Apps + profile + cases:** App CRUD, capability profile display, test-cases view **synced with BrowserStack Test Management** (seeded from the prototype).
- **M3 Approvals + audit:** persistent role-gated gate (on the Test-Management cases, **status write-back**) + history + audit log.
- **M4 Runs + evidence + findings + flaky:** ingestion from GitHub/BrowserStack/Jira; detail + deep-links; **findings carry AI-drafted RCA + PO priority**.
- **M5 Dashboard + portfolio roll-up.**
- **M6 Harden + package:** security/secrets, a11y pass, E2E, **one-command `docker compose` demo run**. (RBAC + cloud deploy = later.)
- **(post phase-1) Assurance AI Kit:** the local setup kit + Onboard page (see §12).
- **(phase 2/3) Roadmap:** visual / Figma-conformance testing; matrix dimensions (auth modes, Local tunnel, mobile); GxP lane; Jira-status-driven trigger.

---

## 11. Success metrics

- Time for a stakeholder to answer "is App X healthy?" drops from multi-tool hunt to **one screen**.
- 100% of approvals captured with identity + timestamp (auditable).
- Every run's evidence reachable in **≤ 2 clicks**.
- Findings no longer lost between Jira/CI/BrowserStack — single triage surface.

---

## 12. Next milestone (post phase-1): the **Assurance AI Kit** setup kit

A **`curl … | bash` downloadable script** (single-use, short-TTL, scoped token) — **this is what "AI Auto
Kit" is** — that installs Claude Code, Node/Python/Playwright, the `assure-*` skills bundle, MCP config,
and scaffolds the test repo, then registers with the platform (live status on an **Onboard** page). No
long-lived secrets in the script. Details in design doc §4. (`aak` CLI explicitly deferred.)

---

## 13. Open questions / assumptions

- **Naming/scope:** *Resolved* — product = **Assurance Platform**; **Assurance AI Kit** = the local setup kit (post phase-1).
- **Test Management:** *Resolved (in scope)* — BrowserStack Test Management is an MVP integration; approval write-back default **on**.
- **Auth modes:** *Resolved (deferred)* — OIDC/OAuth/MyPfizer/GTX + private-env tunnels + mobile are phase 2/3.
- **Positioning:** confirm what existing **Lumi / Hydra** agents already do (Solution Intelligence side) to avoid duplication.
- **Hosting/DB:** *Resolved* — local **Docker** (`docker compose`: Next.js + Postgres) for the demo; cloud deploy deferred.
- **Run ingestion:** *Resolved (push model — see [assurance-architecture.md](assurance-architecture.md)).*
  The engine/CI **pushes** a signed run summary to the platform; the platform does **not** poll vendors and
  holds no vendor API clients.
- **Jira write-back:** *Resolved (push model).* The **engine** creates/updates Jira bugs with the user's own
  MCP (HITL via the host's tool-approval prompt); the **platform deep-links only** and never writes to Jira.
- **Connect Application / auth:** *Resolved.* "Connect Application" is **metadata registration only** (no
  credentials, no OAuth); vendors are reached only by the engine (user MCP / CI secrets). First Jira read +
  feature-sync happens at **Set up Assurance** in Claude Code, which **pushes** the feature list + status.
- **Portability:** *Resolved (architecture).* The engine ships as a **portable plugin/MCP** — host-agnostic
  (Claude Code · Desktop · Cursor · Copilot · CI GitHub Action for autonomous runs) and framework-agnostic
  (Playwright/pytest-bdd/Selenium/… via adapters). No lock-in on either axis; one governance plane.
- **Seeding:** M2–M5 use the prototype's real data (Savings Finder / SAA / runs) as the first Application.
