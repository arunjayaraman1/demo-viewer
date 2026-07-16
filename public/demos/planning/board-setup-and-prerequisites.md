# Board Setup & Prerequisites — STLC Demo

Companion to [demo-plan.md](demo-plan.md). This doc covers (A) how we connect to and populate the
**real** Jira board, and (B) a full analysis of everything else required to build the prototype, given
the now-confirmed accounts.

## What changed from the plan's assumptions

| Assumption in demo-plan.md | Reality | Impact |
|---|---|---|
| Free Atlassian Jira, project key `SAV` | **Enterprise** Jira at `newpagedt.atlassian.net`, project key **`SAA`**, board **422** (already created) | Enterprise governance applies (admin-controlled MCP/API access). Key is **SAA** everywhere. |
| Real BrowserStack trial for grid + reporting | **Free** BrowserStack account | Grid (Automate) is trial-limited (~100 min, expires). **Test Management** + **Test Observability** are *permanent free* tiers → use those as the evidence surface; don't lean on the grid. |

## Decisions locked (this session)

1. **Jira connection:** **Official Atlassian Remote MCP (OAuth 2.1)** — try first (Option 1 below). Fall
   back to REST + personal token only if the admin blocks the OAuth app.
2. **Board creation:** **I create the issues directly via API/MCP** from `jira/seed-board.json`; you review
   in the SAA board.
3. **Execution architecture:** **Full matrix on free GitHub Actions runners → publish to BrowserStack Test
   Observability** (free). The grid is reserved/skipped to stay within free limits.

---

## Part A — Connecting Claude Code to Jira (SAA) & seeding the board

### A1. Connection options (enterprise considerations)

| Option | How it works | Live MCP in demo? | Enterprise gotcha |
|---|---|---|---|
| **1. Official Atlassian Remote MCP (OAuth 2.1)** — *recommended to try first* | GA Feb 2026; connect Claude Code to `mcp.atlassian.com` via OAuth consent | ✅ Yes — `assure-context` pulls stories live via MCP | Org admin grants access at the **permission-group** level; the OAuth app may need **admin approval** |
| **2. Official Atlassian MCP via API token** | Same server, Basic `base64(email:api_token)` auth (machine-to-machine) | ✅ Yes | **API-token auth for MCP must be explicitly enabled by your Cloud admin** |
| **3. Direct REST API v3 + personal API token** | Scripts call `/rest/api/3/issue` with Basic auth (email + token) | ❌ No live MCP (we script board creation; `assure-context` reads via a thin wrapper) | Most likely to work **without** special admin enablement — standard API tokens, unless the org disabled them |

**Recommendation:** try **Option 1** (best demo story — Jira is live in Claude Code). If the admin blocks
the OAuth app or token auth, fall back to **Option 3** for reliable board seeding and have `assure-context`
read through whatever channel is available. Board *creation* works the same via any of them.

> Note: Atlassian's legacy `/v1/sse` MCP endpoint stops working after **June 30, 2026** — we use the
> current `/v1/mcp/authv2` endpoint / OAuth flow only.

### A2. Inputs needed from you (to connect)

1. **Project type of SAA:** *company-managed* or *team-managed*? (Affects parent/child linking — modern
   Jira uses the `parent` field for both, but the workflow/statuses differ. Tell me, or I'll detect it on
   first connect.)
2. **Atlassian API token** — create at `id.atlassian.com/manage-profile/security/api-tokens` (needed for
   Options 2 & 3, and as MCP fallback).
3. **Admin check** — can the **Atlassian Remote MCP (OAuth app)** be approved, and/or **API-token auth**
   enabled, for `newpagedt.atlassian.net`? (Determines Option 1/2 vs 3.)
4. **Your permission** to create Epics/Stories/Sub-tasks in SAA (project role).
5. **Workflow statuses** available in SAA (so we map to "Done" / a "Ready for QA" state) — I can read these
   once connected.
6. **Board 422 type** — Scrum or Kanban? (Scrum → we place stories in a sprint or backlog; Kanban → columns.)

### A3. What we create in SAA (the board content)

One Epic + three Stories (each with sub-tasks), authored to split cleanly into the blueprint's story types.
Source of truth mirrored locally in `jira/seed-board.json` for reproducibility/fallback.

```
EPIC  SAA — "Medication Savings Finder"
 ├─ STORY (Happy path)      Search a Pfizer medication → tailored savings options   [Done]
 │    └─ sub-tasks: search UI · autocomplete data · results panel  (all Done)
 │    └─ QA sub-task: "author + automate savings finder tests"     (To Do)  ← Sprint-3 work
 ├─ STORY (Validation)      Search input behaves predictably (substring/case/clear/chips)  [Done]
 │    └─ sub-tasks (Done) + QA sub-task (To Do)
 └─ STORY (Edge case)       Graceful no-results for non-Pfizer terms                [Done]
      └─ sub-tasks (Done) + QA sub-task (To Do)
```

- Each Story gets: description, **Gherkin-style acceptance criteria**, labels (`savings`, `search`),
  story points, and is set **Done** (dev-complete) with an **open QA sub-task** — reads as "built, ready for QA."
- **Deliberate spec gap:** no story specifies **special characters / very long input / rapid-typing
  (debounce)** behavior → `/assure-context` flags this as a missing scenario (blueprint §7.1).

**Open decision (A):** once connected, do you want me to **create the issues directly via API/MCP**, or
**generate the payloads/scripts for you to run**? (See questions at end.)

---

## Part B — Everything else required (full gap analysis)

| # | Requirement | Detail | Status / who provides |
|---|---|---|---|
| 1 | **Jira connection** | API token + admin enablement (Part A) | ⛔ Needs you (token + admin check) |
| 2 | **BrowserStack — Test Management (free)** | Hosts authored cases + the **review/approve gate** (Act 3) | ✅ Free tier; confirm enabled on your account |
| 3 | **BrowserStack — Test Observability (free)** | The **evidence/reporting** surface (Act 7): results, video/log timeline, RCA, flaky, trends. **Ingests results from tests run anywhere** via `browserstack-node-sdk` (Node) + JUnit upload (pytest) | ✅ Free tier; confirm enabled |
| 4 | **BrowserStack — Automate grid (trial)** | *Optional* small "real cross-browser on BrowserStack cloud" showcase. ~100 trial min, expires | ⚠️ Conserve — see execution decision below |
| 5 | **BrowserStack credentials** | `BROWSERSTACK_USERNAME` + `BROWSERSTACK_ACCESS_KEY` → local `.env` + GitHub secrets | ⛔ Needs you (share or set as env) |
| 6 | ~~**(Optional) OSS lifetime-free BrowserStack**~~ | Requires a **public** repo — but `pfizerforall-tests` is **private**, so this offer is **N/A**. Use the standard free Test Management + Test Observability tiers. | ❌ Not available (private repo) |
| 7 | **(Optional) BrowserStack MCP** | Official MCP (`browserstack/mcp-server`) so the Workspace can drive BrowserStack from Claude Code | Optional, nice-to-have |
| 8 | **GitHub** | **Private** repo `srishnewpage/pfizerforall-tests` (Actions on the free ~2,000-min/mo cap, not unlimited — keep matrix small); BrowserStack creds set as **Environment `qa`** secrets | ✅ Repo created; `gh` authed as `srishnewpage`; `qa` env secrets set |
| 9 | **Local toolchain** | Node 20+ & npm (Playwright + `playwright-bdd`/Cucumber); Python 3.11+ & pip (`pytest-bdd`, `playwright`/pytest); the Playwright browsers | I install in the repo; you confirm Node/Python present |
| 10 | **Secrets management** | `.env` (gitignored) locally; GitHub Actions **secrets** in CI; never commit Jira token or BrowserStack key | I scaffold; you populate secrets |
| 11 | **Assurance Platform hosting** | Vite + React SPA run locally for the demo (optional GitHub Pages deploy later) | I build |
| 12 | **MCP config in Claude Code** | Add Jira MCP (and optionally BrowserStack MCP) to the Claude Code MCP config | I configure; you authorize OAuth/token |

### Recommended execution architecture (conserves the free grid)

Run the **full browser × OS matrix on free GitHub-hosted runners** (local Playwright + pytest-bdd) and
**publish results to BrowserStack Test Observability** (free, ingests from any CI). Optionally fire **one
small Automate-grid run** to show "really running on BrowserStack's cloud." This keeps us inside the free
limits while still using BrowserStack as the system-of-record reporting surface — exactly the blueprint's
"publish normalised results to BrowserStack" (§8.2), just sourced from GitHub runners instead of the grid.

### Carry-over open decision (from demo-plan §5)

`pfizerforall.com` has **no login**, so the blueprint's auth matrix (OIDC/OAuth/MyPfizer/GTX) is
represented as a single `public/sandbox` axis with narration that real auth modes attach when the
app-under-test becomes Pfizer Pro.

---

## Immediate next steps (critical path to a populated board)

1. **You:** create an Atlassian **API token**; check with admin whether the **Atlassian Remote MCP** /
   API-token auth is allowed; tell me **company- vs team-managed** for SAA and **Scrum vs Kanban** for board 422.
2. **You:** confirm **Test Management** + **Test Observability** are enabled on the BrowserStack account and
   share the **username + access key** (or set them as env vars).
3. **Me:** wire the chosen Jira connection, read SAA's workflow/statuses, and **seed the board** from
   `jira/seed-board.json` (Epic + 3 Stories + sub-tasks + deliberate gap).
4. **Me:** then proceed to Phase 2 of demo-plan.md (`/assure-context` → `/assure-author`).

---

## Sources

- [BrowserStack — usage limits / plans](https://www.browserstack.com/support/faq/plans-pricing/usage-plans-pricing/is-usage-limited-and-if-so-what-are-those-limits)
- [BrowserStack — Test Observability with Playwright + GitHub Actions](https://www.browserstack.com/docs/automate/playwright/github-actions)
- [BrowserStack — official MCP server](https://github.com/browserstack/mcp-server)
- [Atlassian — official remote MCP server (OAuth 2.1 / API token)](https://github.com/atlassian/atlassian-mcp-server)
- [Atlassian — API-token auth for the Rovo MCP server](https://community.atlassian.com/forums/Atlassian-Remote-MCP-Server/Announcing-authentication-via-API-token-for-Atlassian-Rovo-MCP/ba-p/3197014)
- [Jira Cloud REST API — create issue](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/)
