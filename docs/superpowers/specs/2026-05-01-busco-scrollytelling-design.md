# BUSco Scrollytelling Demo — Design Spec

**Date:** 2026-05-01
**Owner:** Helena (helenamariemuir@gmail.com)
**Purpose:** Demo of the scrollytelling skill, using the BUSco intro deck as content. Semi-private shareable link.

## Goal

Convert the 11-slide BUSco intro deck (PAYGo solar back-up servicer concept) into a single-page, scroll-driven web experience that:

1. Showcases what's possible with the scrollytelling skill.
2. Is good enough that Helena could share the link with a colleague or stakeholder as a "what if our materials looked like this?" example.
3. Sits behind Cloudflare Access (link-shareable, but not public/indexed).

## Source assets

Located in `G:/My Drive/Scrollytelling/BUS Intro Deck/`:

- `BUS intro deck.pdf` / `BUS intro deck.pptx` — content source (11 slides, content already extracted).
- `BUSco background image.png` — hero/closing photo (East African family with off-grid solar setup).
- `BUSco logo - navy.png` — primary logo on light backgrounds.
- `BUSco logo - white.png` — logo on dark/photo backgrounds.

## Narrative structure (10 scroll sections)

| # | Section | Source slide(s) | Scroll behavior |
|---|---|---|---|
| 1 | **Hero** | 1 | Full-bleed background photo with subtle Ken Burns zoom. White logo top-left, headline ("An industry-wide back-up servicer to ensure off-grid solar service continuity") fades in. Down-arrow scroll cue. |
| 2 | **The problem** | 2 | Pinned section. Five stakeholder cards (customers, PAYGo companies, lenders/investors, institutional capital, governments) reveal sequentially as the user scrolls, each with its consequence-of-failure. Builds cascading-risk feel. |
| 3 | **The solution** | 3 | Pinned. BUSco enters as a "safety net" — three protective layers (cash flow / devices / field operations) animate in. Followed by a quick scroll-fade list of the 7 benefits (reliable safety net, continuous operation, financial protection, etc.). |
| 4 | **Credibility stat** | 9 (extracted) | Full-screen moment: "$20B+ in solar loans backstopped by BUS structures" — number counts up on enter. Subline credits the team's prior North American securitization work. |
| 5 | **How the BUS works** | 6 | Marquee scrollytelling section. Pinned timeline showing the four phases (Pre-succession Standby → Activation/Transition → Active mode → Reversion/Wind-down). Sub-steps highlight in sequence as the user scrolls; phase labels swap. |
| 6 | **Use cases** | 4 | Two-column reveal: "On-balance-sheet lending" vs. "Off-balance-sheet securitizations (SPVs)". Plus frontier callouts (M300/government programs, Energy-as-a-Service). |
| 7 | **Operating principles** | 7 | Six principle cards (Robust capability/minimized cost; Leverage existing infra; Universal trust through neutrality; Built for the sector; Investment-grade credibility; Lean start-up approach) in a staggered grid that fades in. |
| 8 | **Capability map** | 8 | Seven capability domains as a hexagonal/faceted grid (echoing the BUSco geodesic logo). Click/hover to expand each domain's detail (data access, software, financial ops, hardware, legal, governance, field ops). |
| 9 | **The team** | 9 | Catalyst Off-Grid Advisors + Hyfin co-development story. Brief credibility lines. Backers row at the bottom (logos optional — text-only acceptable for demo). |
| 10 | **Get involved + contact** | 10, 11 | Background photo returns (closing bookend). Four numbered ways to engage. Contact emails as styled CTA buttons (Kat, Dan, Billy). |

## Visual direction

**Palette** (color-pick from logo + photo at implementation time; placeholders below):

- **Primary:** BUSco navy `#1B2C5C` (dominant — backgrounds of dark sections, headings on light sections).
- **Accent warm:** Terracotta/amber pulled from the background photo, ~`#C66B3D` (used sparingly — stat highlights, active timeline phase, hover states).
- **Neutral:** Off-white `#F7F4EE` (warm, not pure white) for light section backgrounds.
- **Supporting:** A muted sage or sand for tertiary accents if needed.

**Typography:**

- **Headlines:** Fraunces (variable serif) — confident, slightly editorial.
- **Body:** Inter — clean, neutral.
- **Numerals (stats):** Inter tabular figures, heavy weight.
- Both are Google Fonts (free, no licensing).

**Motif:**

The geodesic facets from the BUSco logo are used as a recurring graphic element — section dividers, behind the big stat number, as the underlying grid for the capability map (section 8). One motif, repeated, ties the whole site to the brand.

**Photography use:**

The background photo bookends the experience (sections 1 and 10) only. Middle sections are content-dense and need restraint — whitespace, type, and the geodesic motif carry them.

## Tech stack

- **Vanilla HTML / CSS / JS.** No framework, no bundler, no build step. Single `index.html` + `assets/` + `style.css` + `script.js`.
- **GSAP + ScrollTrigger** (CDN) — scroll-driven animation and pinning.
- **Lenis** (CDN) — smooth scroll.
- **Google Fonts** — Fraunces + Inter via `<link>`.

Rationale: A vanilla stack is the right fit for a single-page demo. Cloudflare Pages serves it as static files — no Node build required.

## Repository & deployment

**Repository:**

- Created under the `catalyst-offgrid` GitHub org.
- Name: unguessable slug (e.g., `busco-preview-x7k2p9`) so the URL isn't discoverable by enumeration.
- Public visibility (required for free Cloudflare Pages connection — but obscurity + Access gate handles privacy).
- `robots.txt` disallowing all crawlers + `<meta name="robots" content="noindex">` as belt-and-braces.

**Hosting & access:**

- **Cloudflare Pages** project connected to the GitHub repo. Auto-deploys on push to `main`.
- **Cloudflare Access** application gating the `.pages.dev` URL with a one-time-PIN policy: any visitor enters their email, receives a 6-digit code, gets in.
- Custom domain optional (out of scope for demo).

**Setup steps the user must perform** (cannot be automated):

1. Authorize `gh` CLI for the `catalyst-offgrid` org (one-time browser auth flow).
2. In Cloudflare dashboard: connect the GitHub repo to a new Pages project (one-time OAuth).
3. In Cloudflare Zero Trust dashboard: add an Access application with email-PIN policy targeting the Pages URL.

All other steps (repo creation, code push, build config) can be automated.

## Scope boundaries

**In scope:**

- 10-section single-page scrollytelling site as described.
- BUSco branding (color, type, motif, logos).
- Cross-browser support: latest Chrome, Safari, Firefox on desktop.
- Mobile responsive — scroll behaviors gracefully degrade (timeline becomes vertical stack, pinned sections become tall scroll sections, capability hex-grid stacks).
- Cloudflare Pages deploy + Access gate working end-to-end.

**Out of scope:**

- Custom domain.
- Analytics.
- CMS or content editing UI.
- Multi-page navigation.
- Backers' logos (text-only acceptable for demo unless trivially available).
- Internationalization.
- WCAG AA conformance audit (basic accessibility — alt text, semantic HTML, keyboard scroll — yes; full audit no).

## Success criteria

- All 10 sections present and visually polished.
- The "How the BUS works" timeline (section 5) and the capability hex-grid (section 8) feel genuinely scroll-driven, not just fade-ins.
- Site loads in under 3 seconds on a typical broadband connection (assets compressed, photo served at appropriate resolution).
- Helena can open the Cloudflare-Access-gated URL on her phone, enter a PIN, and the site works.
- No console errors.

## Risks / open questions

- **Logo color extraction:** Final palette will be picked from the actual logo + photo PNGs at implementation time. Hex codes above are placeholders.
- **Backers' logos on team slide:** Source deck has placeholders only. Text-only treatment is fine for the demo; if Helena has logo files later, they can be dropped in.
- **`gh` CLI org access:** The `catalyst-offgrid` org may require admin approval for personal access tokens. If the auth flow blocks repo creation, fallback is for Helena to create the empty repo manually and grant push access.
- **Cloudflare Access free-tier limits:** 50 users on the free Zero Trust plan. More than sufficient for a demo.
