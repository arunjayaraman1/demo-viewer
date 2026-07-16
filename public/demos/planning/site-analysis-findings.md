# PfizerForAll — Demo Feature Analysis (Playwright crawl)

**Date:** 2026-06-28
**Target site:** https://www.pfizerforall.com (substitute for pfizerpro.com, which is geo-blocked from this location)
**Method:** Interactive Playwright MCP crawl. WebFetch was insufficient — the key journeys are JS-rendered (autocomplete listboxes, client-side validation, dynamic result panels) and don't appear in server HTML.
**Goal:** Pick a real, form-driven, demoable feature that cleanly splits into the blueprint's three JIRA stories — *happy-path*, *validation-rules*, *edge-case* — with clear success states for evidence capture.

---

## Recommendation: **Medication Savings Finder** ⭐

**URL:** `/savings-support/prescription-assistance`

A search-driven journey, fully in-domain (no third-party redirect needed to reach the success state), backed by a deterministic Pfizer-medication catalog. It is the strongest fit: it maps onto all three story types naturally, has obvious business value (helping patients afford prescriptions), and demos well to a non-technical stakeholder.

### The journey
1. Land on the page → a prominent **"Find my medication"** combobox with autocomplete, plus six **Popular Searches** chips (ELIQUIS®, PAXLOVID™, NURTEC® ODT, INFLECTRA®, PREMPRO®, GENOTROPIN®).
2. Type a partial name → an autocomplete **listbox** filters the catalog (substring match) and shows matching brand+generic entries, e.g. `ELIQUIS® (apixaban)`. A **Clear input** button appears.
3. Select an option → a **tailored results panel** renders inline below the search box with medication-specific savings cards:
   - **Choose to self-pay** (→ external brand PDF)
   - **Get a co-pay card** with the actual co-pay terms ("as little as $10 per 30-day supply…") (→ external brand site)
   - **Get real-time answers** contact card (phone, hours)
4. Success state is the rendered, medication-specific savings panel — captured as evidence without ever leaving the domain or submitting personal data.

### Observed behavior (selectors / accessible names)
| Element | Accessible name / role | Notes |
|---|---|---|
| Search input | `textbox "Find my medication"` (inside `combobox`) | Substring match across full catalog |
| Autocomplete results | `listbox` → `option` (e.g. `"ELIQUIS® (apixaban)"`) | Appears as you type |
| Clear input | `button "Clear input"` | Appears once text entered |
| Popular search chips | `radio "ELIQUIS®"`, `"PAXLOVID™"`, etc. | Alternate quick entry |
| Result cards | headings `"Choose to self-pay"`, `"Get a co-pay card"` | Content varies per medication |

### Story mapping for the JIRA board
- **Happy-path story** — *Patient searches a known Pfizer medication and sees savings options.* Type `eli` → select `ELIQUIS® (apixaban)` → tailored savings panel renders. (Also reachable via a Popular Searches chip.)
- **Validation-rules story** — *Search input behaves correctly.* Single-character query (`e`) returns a broad substring-matched list (~40 brands); autocomplete is case-insensitive; Clear-input resets state; selecting from the listbox populates the field exactly. These are concrete, assertable rules.
- **Edge-case story** — *No-match handling.* A non-Pfizer term (e.g. `aspirin`) yields **no listbox / no results** — nothing is rendered, no error thrown. Good negative scenario the stories imply but don't state (a missing-scenario flag candidate per the blueprint's §7.1).

### Evidence captured
- `evidence/evidence-savings-eliquis-results.png` — happy-path success state (ELIQUIS savings panel).

---

## Fallback A: **Newsletter Sign-up form** (footer, every page)

The cleanest *textbook validation* surface on the site — useful if we want the validation-rules story to be hard field validation rather than search-input rules.

- Fields: `textbox "First name"`, `textbox "Last name"`, `textbox "Email"`, `button "Subscribe"` (+ one hidden textbox, likely a honeypot).
- **Empty submit** → three inline errors: *"Please enter a valid first name."*, *"Please enter a valid last name"*, *"Please enter a valid email address"*; each field shows an Error icon.
- **Invalid email** (`not-an-email`) with valid names → name errors clear (Clear-input buttons appear), email error persists.
- Evidence: `evidence/evidence-newsletter-validation.png`.
- **Caveat:** it's a thin "feature" on its own, and a *successful* submit is a real marketing opt-in (don't automate the positive submission — test validation only). Best used as a **supporting validation story** layered onto the Savings feature, not the headline demo.

---

## Fallback B (weak): **Talk to a Doctor / Find Care**

**URL:** `/find-care/talk-to-a-doctor`

A `combobox "Select a condition"` (Vaccines, COVID-19, Migraine, Menopause, ATTR-CM) that **routes** to condition landing pages (e.g. `/migraine/find-care`). Those pages present In-Person vs. Telehealth cards — but every actionable path **hands off to third parties** (UpScript telehealth, Zocdoc in-person, VaxAssist vaccine booking). The real interactive forms and success states live **off-domain**, so there's little in-app behavior to author tests against. Demoable as navigation, but weak on validation/edge surfaces. Not recommended as the primary subject.

*(Not crawled: AI Health Answers at `healthanswers.pfizer.com` — a separate domain mapping to the blueprint's AI-eval surface (§6 note), a different testing modality than the functional UI journey we want for this demo.)*

---

## Bottom line
Build the demo around the **Medication Savings Finder**. It's the one journey that is in-domain end-to-end, deterministic, business-meaningful, and splits cleanly into happy-path / validation / edge-case stories with capturable success states. Keep the **Newsletter form** as a ready validation-rules story if we want stricter field-validation coverage, and treat **Talk to a Doctor** only as a navigational fallback.

> Note: the live cookie-consent dialog (`button "Accept All"`) overlays the page on first load — it must be dismissed before interacting. This mirrors the blueprint's own "cookie banner hides the login button" anecdote (§4) and is a natural first self-heal/fixture scenario for the automation stories.
