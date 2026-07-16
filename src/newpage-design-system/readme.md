# Newpage Design System

The visual language of **Newpage Solutions** — a life-sciences digital engineering partner ("Trusted IT partner for Life Sciences"). This system supplies the colors, type, components, assets, and UI recreations needed to build on-brand presentations and product work.

> **Tagline:** Deliver breakthroughs.

---

## Company & product context

Newpage Solutions (newpage.io, founded 2017, remote-first, ~13+ countries) is an IT services / digital engineering partner for **pharma, biotech, and regulated enterprises**. Core offerings:

- **Data & AI** — scalable data/AI platforms, ML Ops, analytics.
- **Salesforce / Veeva** — CRM, omnichannel, Health Cloud.
- **Adobe Experience Cloud** — AEM, Workfront, Franklin for regulated marketing.
- **Digital Health** — patient engagement, connected health, companion apps.
- **Cloud & DevOps** — cloud-native apps, microservices, SRE.
- **Team augmentation & delivery** — GCC/ODC, strategic augmentation, remote-first managed teams. Centers: Chennai (Newton Center), Bangalore (Einstein Center); US offices Miami FL & Sanford NC.

Proof points used in copy: **200+ projects, 27+ countries, 60+ brands, 70–80% faster delivery** (proprietary *Accel* platform), 40–70% cost savings, **Scope 1&2 Net Zero (2025)**.

### Sources
- **Brand spec files** (provided, the basis for this system): `uploads/Newpage Design System - Deep Teal.html` and `uploads/Newpage Design System - Light Editorial.html` — two directional studies sharing one palette and type system. Decoded markup: `uploads/decoded-deepteal.txt`, `uploads/decoded-editorial.txt`.
- **Live site** (for copy/context only, not pixel reference): https://newpage.io , /our-services/, /about-us/.
- No source code or Figma was provided — UI kits are brand-faithful reconstructions, not captures of the production site.

---

## CONTENT FUNDAMENTALS

**Voice — precise, human, forward.** Newpage pairs the rigor of a regulated industry with the momentum of a modern tech partner.

- **Person:** "we" for Newpage, "you/your" for the client ("Transform *your* life sciences organization"). Outcome-led.
- **Tone:** confident and concrete, never hypey. Lead with the result, quantify it ("from four days to under five minutes"). Compliance-grade clarity.
- **Casing:** Sentence case for headlines and body. Eyebrows/labels are UPPERCASE mono with wide tracking. Title Case only for proper product names (Salesforce, Veeva, Adobe AEM, Net Zero, Accel).
- **Headlines:** short, declarative, verb-forward — "Deliver breakthroughs", "Transform life sciences with AI", "Ready to deliver breakthroughs?".
- **Body:** plain, trustworthy, jargon-light; technologies named directly (Salesforce/Veeva, AEM, AWS/Azure).
- **Numbers:** stat-forward with a teal accent suffix (`200+`, `27+`, `70–80%`). Pair a big numeral with a short label.
- **Punctuation:** em dashes for asides; "&" is fine in headings ("Data & AI"). No exclamation marks.
- **Emoji:** none. **No emoji anywhere.** Meaning is carried by line icons and type, not pictographs.
- **CTAs:** "Explore solutions", "Discover more", "Contact us", "Read the case study", "Talk to us" — always paired with a right-pointing arrow.

---

## VISUAL FOUNDATIONS

**Two directions (themes).** The brand ships **both** documented directions — they share one palette, type system, and components, differing only at the page/hero/ink level. Set `data-theme` on a wrapper and the page-level tokens re-resolve:

- **`deep-teal`** (default) — cool-gray canvas `#EAEDEF`, **dark Teal-Ink masthead** with a teal radial glow, gold eyebrow, Teal-Ink body text.
- **`editorial`** — warm cream canvas `#ECE9E1`, **light masthead** `#F4F2EC` with a dot-grid texture, deep-teal eyebrow, near-black `#0E1116` ink.

```html
<div data-theme="editorial"> … </div>   <!-- omit for deep-teal -->
```

Tokens live in `tokens/themes.css`: `--surface-page`, `--hero-surface`, `--hero-ink`, `--hero-ink-muted`, `--hero-eyebrow`. The teal-ink service cards, buttons, tags and stat blocks are identical in both directions. The Website UI kit has a live Deep Teal / Editorial toggle in its nav.

**Color.** A **teal-forward** identity. *Teal Ink* `#06302E` replaces pure black as the primary dark; *Teal* `#08BDB8` is the primary accent (CTAs, highlights); *Deep Teal* `#008C85` carries links/secondary emphasis. The logo's **Orange `#F47920`** and **Gold `#FDC72F`** are reserved for emphasis and data only — never large fields. A cool-gray neutral family (`#2C333D → #E6E8EC`) carries structure; *Teal Tint* `#E6FAF9` is the wash for tags and icon wells. Two canvases: cool **`#EAEDEF`** (app/product) and warm **`#ECE9E1`** (editorial). White `#FFFFFF` anchors content surfaces.

**Type.** Three families: **Space Grotesk** (display/headlines — engineered, tight negative tracking down to −2px), **IBM Plex Sans** (body — precise, legible, trustworthy), **IBM Plex Mono** (eyebrows, labels, codes, data captions — UPPERCASE, 1.5–2px tracking). Scale: Display 68 / H1 44 / H2 34 / H3 24 / Lead 20 / Body 17 / Label 13.

**Spacing & layout.** 8-point rhythm (8/16/24/32/40/64/96). Content max-width ~1080–1180px, generous 40–56px gutters. Sections separated by large vertical space (~88–92px). Numbered section eyebrows ("01", "02") in mono.

**Backgrounds.** Flat color fields — **no photographic hero imagery, no busy gradients.** The only gradient is a soft single-color teal radial glow bleeding off the dark masthead. The faceted arrowhead appears oversized and low-opacity (full-color or pale tint) as a corner motif. The editorial direction adds a subtle dot-grid texture on light panels. Imagery, when used, stays cool/clinical.

**Corners & cards.** Three radii: **8 (sm)** inputs/tags, **14 (md)** cards/panels, **20 (lg)** hero blocks/mastheads; pills fully rounded. Cards are white with generous padding (28–32px) and a **soft shadow** (`0 1px 3px rgba(14,17,22,.10)`); the signature **service card** is a teal-ink surface with a teal icon well, title, body, and a "Discover more" arrow link. Borders are hairline `#E6E8EC`.

**Elevation.** Two levels only — *Soft* (resting) and *Lifted* (`0 10px 30px rgba(14,17,22,.14)`, on hover). Elevation signals interactivity, not decoration; most surfaces sit flat or soft.

**Motion.** Calm and precise — ease-out `cubic-bezier(0.22,1,0.36,1)`, ~140–220ms. Fades and small translateY lifts; the CTA arrow nudges ~3px right on hover. **No bounce, no infinite loops.**

**Hover / press states.** Primary button darkens teal (`#06A8A3`); outline gets a 5% ink wash; text/link buttons drop to ~70% opacity. Press shrinks solid controls to `scale(0.97)`. Cards lift (translateY −2/−3px) and deepen shadow. Inputs show a 3px teal focus halo.

**Transparency & blur.** Sparingly: sticky nav uses `rgba(255,255,255,0.86)` + 12px backdrop blur; modals dim the page with `rgba(6,48,46,0.5)` + 4px blur. On dark surfaces, white text is set at 60–74% opacity for hierarchy.

**Data viz.** Categorical sequence built from brand teals (`#06302E → #008C85 → #08BDB8 → #7FDAD7`) with orange/gold for highlights. Thin gridlines, no chartjunk, label directly.

---

## ICONOGRAPHY

- **Style:** geometric **line icons** — **1.5–1.75px stroke, round caps and joins, 24px grid.** Never filled, never skeuomorphic, never duotone. Default stroke is Teal Ink; teal for emphasis inside wells.
- **Set:** the brand spec drew bespoke line icons in exactly this style. For implementation we use **[Lucide](https://lucide.dev)** (loaded from CDN: `https://unpkg.com/lucide@latest`) — it matches the stroke weight, round caps, and 24px grid almost exactly. **⚠️ Substitution flag:** Lucide stands in for the original hand-built icon set; if Newpage has official icon SVGs/a font, drop them into `assets/icons/` and swap. Common icons in use: `brain-circuit` (AI/Data), `dna`, `heart-pulse`, `layout-dashboard`, `shield-check`, `cloud`, `git-branch`, `users-round`, `leaf` (Net Zero), `zap` (Accel), `arrow-right`.
- **Logo / mark:** the **faceted arrowhead** (teal · deep teal · orange · gold) — points ahead = momentum, "the next page". Stands alone as app icon/avatar/motif. Never recolor or reorder facets, never add shadow/outline/gradient.
- **No emoji. No unicode pictographs as icons.** Arrows in CTAs are real SVG (`arrow-right`).

---

## VISUAL ASSETS (`assets/`)
- `newpage-logo-color.png` — full-color lockup (mark + dark wordmark), for light backgrounds.
- `newpage-logo-white.png` — mark + white wordmark, for dark/teal-ink backgrounds.
- `newpage-arrowhead.png` — the faceted arrowhead mark alone (app icon / avatar / favicon).
- `newpage-arrowhead-tint.png` — oversized pale-tint arrowhead, for corner background motifs.

---

## INDEX / MANIFEST

**Root**
- `styles.css` — global entry point (consumers link this). `@import` manifest only.
- `readme.md` — this guide. `SKILL.md` — Agent-Skills front matter.

**`tokens/`** — `fonts.css` (Google Fonts: Space Grotesk, IBM Plex Sans, IBM Plex Mono), `colors.css`, `typography.css`, `spacing.css` (spacing/radius/elevation/motion).

**`components/core/`** — React primitives (`window.NewpageDesignSystem_9bff4f`): `Button`, `IconButton`, `Tag`, `Card`, `ServiceCard`, `StatBlock`, `Eyebrow`, `Input`. Each has `.jsx` + `.d.ts` + `.prompt.md`; `components.card.html` is the showcase.

**`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand, Iconography) shown in the Design System tab.

**`ui_kits/website/`** — interactive marketing-site recreation (`index.html` + `app.jsx`). A starting point.

**Webfonts** are loaded from the Google Fonts CDN (all three families are open-source). They are not bundled as binaries; consumers need network access, or self-host the woff2 files and add `@font-face` rules to `tokens/fonts.css`.
