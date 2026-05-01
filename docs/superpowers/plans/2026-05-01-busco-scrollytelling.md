# BUSco Scrollytelling Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. ALSO: Before starting visual section tasks (Tasks 4–13), invoke the `scrollytelling` skill — it contains GSAP/ScrollTrigger conventions this plan assumes.

**Goal:** Build a 10-section single-page scrollytelling demo of the BUSco intro deck, deployed to Cloudflare Pages behind Cloudflare Access.

**Architecture:** Vanilla HTML/CSS/JS single page. GSAP + ScrollTrigger (CDN) for scroll-driven animation. Lenis (CDN) for smooth scrolling. Google Fonts (Fraunces + Inter). Static assets in `assets/`. No build step. Git repo under `catalyst-offgrid` org → Cloudflare Pages auto-deploys → Cloudflare Access gates the URL with email-PIN policy.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flex), vanilla JS (ES2022), GSAP 3.12+, ScrollTrigger, Lenis 1.x, Cloudflare Pages, Cloudflare Zero Trust Access.

**Testing posture:** This is a visual demo, not a unit-tested app. Verification = open the page in a browser and confirm the section behaves as described. Each task ends with a browser-verify step + commit. Use a local static server (`python -m http.server 8000`) during development. Test in latest Chrome at minimum; spot-check Firefox + Safari at the end.

**Reference spec:** `docs/superpowers/specs/2026-05-01-busco-scrollytelling-design.md`

---

## File Structure

```
G:/My Drive/Scrollytelling/
├── docs/superpowers/
│   ├── specs/2026-05-01-busco-scrollytelling-design.md   (exists)
│   └── plans/2026-05-01-busco-scrollytelling.md          (this file)
├── BUS Intro Deck/                                        (source assets, do not modify)
└── site/                                                  (CREATE — the deployable site)
    ├── index.html        — all 10 sections, semantic HTML
    ├── style.css         — global styles + per-section styles, ordered top→bottom
    ├── script.js         — GSAP/ScrollTrigger setup + Lenis init + per-section animations
    ├── assets/
    │   ├── hero-bg.jpg          — compressed background photo (~200KB target)
    │   ├── logo-white.png       — copied from source
    │   ├── logo-navy.png        — copied from source
    │   └── favicon.svg          — small geodesic mark
    ├── robots.txt        — Disallow: *
    ├── README.md         — what this is, how to run locally
    └── .gitignore        — node_modules, .DS_Store, etc.
```

**One file per concern.** `style.css` and `script.js` will grow but stay single-file for the demo (no module bundler). Use clear section comment banners like `/* === SECTION 5: HOW THE BUS WORKS === */` so navigation stays easy.

---

## Task 1: Project scaffold + git init

**Files:**
- Create: `site/index.html`, `site/style.css`, `site/script.js`, `site/README.md`, `site/.gitignore`, `site/robots.txt`
- Create: `site/assets/` (directory)

- [ ] **Step 1: Create the `site/` directory and subdirectory**

```bash
cd "G:/My Drive/Scrollytelling"
mkdir -p site/assets
```

- [ ] **Step 2: Create `site/.gitignore`**

```
.DS_Store
Thumbs.db
node_modules/
.vscode/
*.log
```

- [ ] **Step 3: Create `site/robots.txt`**

```
User-agent: *
Disallow: /
```

- [ ] **Step 4: Create `site/README.md`**

```markdown
# BUSco Scrollytelling Demo

Single-page scroll-driven presentation of the BUSco intro deck.

## Run locally

```bash
cd site
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy

Pushed to `main` → Cloudflare Pages auto-deploys → gated by Cloudflare Access.
```

- [ ] **Step 5: Create minimal `site/index.html` (placeholder, will be filled in Task 3)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>BUSco — Industry-wide back-up servicer</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main><!-- sections will be added in Task 3 --></main>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 6: Create empty `site/style.css` and `site/script.js` files**

```css
/* style.css — populated in subsequent tasks */
```

```js
// script.js — populated in subsequent tasks
```

- [ ] **Step 7: Initialize git repo at the project root**

```bash
cd "G:/My Drive/Scrollytelling"
git init
git add site/ docs/
git status
```

Expected: `site/` and `docs/` files staged, no errors.

- [ ] **Step 8: First commit**

```bash
git commit -m "scaffold: project structure for BUSco scrollytelling demo"
```

---

## Task 2: Asset preparation

**Files:**
- Create: `site/assets/hero-bg.jpg`, `site/assets/logo-white.png`, `site/assets/logo-navy.png`

- [ ] **Step 1: Copy logos as-is (already small enough)**

```bash
cp "G:/My Drive/Scrollytelling/BUS Intro Deck/BUSco logo - white.png" "G:/My Drive/Scrollytelling/site/assets/logo-white.png"
cp "G:/My Drive/Scrollytelling/BUS Intro Deck/BUSco logo - navy.png" "G:/My Drive/Scrollytelling/site/assets/logo-navy.png"
```

- [ ] **Step 2: Compress background image to JPG (~200KB target)**

The source is a 2.4MB PNG. We want JPG at ~85% quality, max 1920px wide, for the hero. Use Python with Pillow (already installed via the pptx skill dependencies):

```bash
python -c "
from PIL import Image
img = Image.open('G:/My Drive/Scrollytelling/BUS Intro Deck/BUSco background image.png').convert('RGB')
w, h = img.size
target_w = 1920
if w > target_w:
    new_h = int(h * target_w / w)
    img = img.resize((target_w, new_h), Image.LANCZOS)
img.save('G:/My Drive/Scrollytelling/site/assets/hero-bg.jpg', 'JPEG', quality=85, optimize=True)
print('done')
"
ls -la "G:/My Drive/Scrollytelling/site/assets/hero-bg.jpg"
```

Expected: file exists, well under 500KB.

- [ ] **Step 3: Color-pick the palette from the logo and the photo**

Use Python to extract dominant colors so the palette is data-driven, not guessed:

```bash
python -c "
from PIL import Image
# Logo: pick the navy
logo = Image.open('G:/My Drive/Scrollytelling/site/assets/logo-navy.png').convert('RGB')
# Sample center-ish pixel of the wordmark
print('logo sample:', logo.getpixel((logo.width//2, logo.height//2)))
# Background photo: dominant warm tone
photo = Image.open('G:/My Drive/Scrollytelling/site/assets/hero-bg.jpg')
small = photo.resize((50, 50))
pixels = list(small.getdata())
# Average
r = sum(p[0] for p in pixels) // len(pixels)
g = sum(p[1] for p in pixels) // len(pixels)
b = sum(p[2] for p in pixels) // len(pixels)
print(f'photo avg: rgb({r},{g},{b}) = #{r:02X}{g:02X}{b:02X}')
"
```

Note the navy hex (likely close to `#1B2C5C`) and the warm-photo hex (likely a muted brown/terracotta). Record these — they'll be used as CSS custom properties in Task 3.

- [ ] **Step 4: Commit assets**

```bash
cd "G:/My Drive/Scrollytelling"
git add site/assets/
git commit -m "assets: hero photo (compressed) + logos"
```

---

## Task 3: Base HTML + global CSS + font loading + section skeletons

**Files:**
- Modify: `site/index.html`, `site/style.css`

- [ ] **Step 1: Replace `site/index.html` with the full skeleton**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="BUSco — an industry-wide back-up servicer for off-grid solar.">
  <title>BUSco — Industry-wide back-up servicer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="site-nav">
    <img src="assets/logo-white.png" alt="BUSco" class="site-nav__logo">
  </header>

  <main>
    <section id="hero" class="section section--hero" data-section="1"></section>
    <section id="problem" class="section section--problem" data-section="2"></section>
    <section id="solution" class="section section--solution" data-section="3"></section>
    <section id="stat" class="section section--stat" data-section="4"></section>
    <section id="how" class="section section--how" data-section="5"></section>
    <section id="usecases" class="section section--usecases" data-section="6"></section>
    <section id="principles" class="section section--principles" data-section="7"></section>
    <section id="capabilities" class="section section--capabilities" data-section="8"></section>
    <section id="team" class="section section--team" data-section="9"></section>
    <section id="cta" class="section section--cta" data-section="10"></section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace `site/style.css` with the global base**

Substitute `--color-navy` and `--color-warm` with the actual hex values from Task 2 Step 3.

```css
/* === RESET & BASE === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-navy: #1B2C5C;          /* TODO: replace with extracted hex from logo */
  --color-navy-deep: #11193A;
  --color-warm: #C66B3D;          /* TODO: replace with extracted hex from photo */
  --color-warm-soft: #E2A47A;
  --color-cream: #F7F4EE;
  --color-ink: #1A1A1A;
  --color-muted: #6B6B6B;

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  --section-pad-y: clamp(4rem, 10vh, 8rem);
  --container-max: 1200px;
  --content-max: 880px;
}

html, body { background: var(--color-cream); color: var(--color-ink); }

body {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1vw + 0.6rem, 1.125rem);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

h1 { font-size: clamp(2.25rem, 5vw + 0.5rem, 4.5rem); }
h2 { font-size: clamp(1.75rem, 3vw + 0.5rem, 3rem); }
h3 { font-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem); }

a { color: inherit; }
img { max-width: 100%; display: block; }

/* === LAYOUT PRIMITIVES === */
.section {
  position: relative;
  min-height: 100vh;
  padding: var(--section-pad-y) 5vw;
  display: flex;
  align-items: center;
}

.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
}

/* === NAV === */
.site-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1.25rem 2rem;
  pointer-events: none;
}
.site-nav__logo {
  height: 32px;
  width: auto;
  opacity: 0;            /* faded in by JS once past the hero */
  transition: opacity 0.4s ease;
}
.site-nav.is-visible .site-nav__logo { opacity: 1; }

/* === SECTION COLOR THEMES (placeholder backgrounds — overridden per section in later tasks) === */
.section--hero      { background: #000; color: var(--color-cream); }
.section--problem   { background: var(--color-cream); }
.section--solution  { background: var(--color-navy); color: var(--color-cream); }
.section--stat      { background: var(--color-navy-deep); color: var(--color-cream); }
.section--how       { background: var(--color-cream); }
.section--usecases  { background: var(--color-cream); }
.section--principles{ background: var(--color-navy); color: var(--color-cream); }
.section--capabilities { background: var(--color-cream); }
.section--team      { background: var(--color-cream); }
.section--cta       { background: #000; color: var(--color-cream); }

/* === REDUCED MOTION === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Replace `site/script.js` with Lenis + GSAP bootstrap**

```js
// === BOOTSTRAP ===
(function() {
  // Smooth scroll via Lenis
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Bridge Lenis ↔ ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Show nav logo once we've left the hero
  const nav = document.querySelector('.site-nav');
  ScrollTrigger.create({
    trigger: '#problem',
    start: 'top 80%',
    onEnter: () => nav.classList.add('is-visible'),
    onLeaveBack: () => nav.classList.remove('is-visible'),
  });
})();
```

- [ ] **Step 4: Verify in browser**

```bash
cd "G:/My Drive/Scrollytelling/site"
python -m http.server 8000
```

Open http://localhost:8000. Expected: 10 colored full-height sections stack vertically. Smooth scrolling works (Lenis active). No console errors. Logo appears in top-left after scrolling past hero.

- [ ] **Step 5: Commit**

```bash
cd "G:/My Drive/Scrollytelling"
git add site/index.html site/style.css site/script.js
git commit -m "base: skeleton + global styles + Lenis/GSAP bootstrap"
```

---

## Task 4: Section 1 — Hero

**Files:**
- Modify: `site/index.html` (replace `#hero` content), `site/style.css` (append), `site/script.js` (append)

- [ ] **Step 1: Replace the `#hero` section markup**

```html
<section id="hero" class="section section--hero" data-section="1">
  <div class="hero__bg" style="background-image: url('assets/hero-bg.jpg');"></div>
  <div class="hero__scrim"></div>
  <div class="hero__content container">
    <img src="assets/logo-white.png" alt="BUSco" class="hero__logo">
    <p class="hero__eyebrow">Spearheaded by Catalyst &amp; Hyfin</p>
    <h1 class="hero__headline">An industry-wide back-up servicer to ensure off-grid solar service continuity.</h1>
    <div class="hero__cue" aria-hidden="true">
      <span>Scroll</span>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append hero styles to `style.css`**

```css
/* === SECTION 1: HERO === */
.section--hero {
  padding: 0;
  overflow: hidden;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  will-change: transform;
}
.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%);
}
.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 5vw;
}
.hero__logo { height: 56px; width: auto; opacity: 0; }
.hero__eyebrow {
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-warm-soft);
  opacity: 0;
}
.hero__headline {
  max-width: 22ch;
  opacity: 0;
}
.hero__cue {
  position: absolute;
  bottom: 3rem;
  left: 5vw;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-cream);
  opacity: 0.7;
  animation: cuePulse 2.4s ease-in-out infinite;
}
@keyframes cuePulse {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50%      { transform: translateY(6px); opacity: 1; }
}
```

- [ ] **Step 3: Append hero JS to `script.js`**

```js
// === SECTION 1: HERO ===
(function() {
  // Entrance: stagger fade-in
  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .to('.hero__logo',     { opacity: 1, y: 0, duration: 0.8 })
    .to('.hero__eyebrow',  { opacity: 1, duration: 0.6 }, '-=0.4')
    .to('.hero__headline', { opacity: 1, y: 0, duration: 1.0 }, '-=0.3');

  // Ken Burns: slow zoom + slight pan tied to scroll within the hero
  gsap.to('.hero__bg', {
    scale: 1.15,
    yPercent: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Reload http://localhost:8000. Expected: full-bleed photo with dark scrim. Logo, eyebrow text, and headline fade in in sequence. Scroll cue pulses at bottom. As you scroll, the background image slowly zooms and pans. No console errors.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 1: hero with Ken Burns scroll-zoom"
```

---

## Task 5: Section 2 — The problem (pinned, 5 stakeholder cards)

**Files:**
- Modify: `site/index.html` (replace `#problem`), `site/style.css` (append), `site/script.js` (append)

- [ ] **Step 1: Replace `#problem` markup**

```html
<section id="problem" class="section section--problem" data-section="2">
  <div class="problem__inner container">
    <div class="problem__intro">
      <p class="eyebrow">The vulnerability</p>
      <h2>When a PAYGo company fails, the damage cascades.</h2>
      <p class="problem__lede">The current PAYGo solar model creates vulnerabilities for everyone touching it.</p>
    </div>
    <ol class="problem__cards" role="list">
      <li class="problem__card" data-stakeholder="customers">
        <span class="problem__card-num">01</span>
        <h3>Customers</h3>
        <p>Total dependency on a single provider means that if a company fails, the technology locks and the lights go out — stripping customers of essential energy access through no fault of their own.</p>
      </li>
      <li class="problem__card" data-stakeholder="companies">
        <span class="problem__card-num">02</span>
        <h3>PAYGo companies</h3>
        <p>The absence of a safety net makes it nearly impossible to restructure during financial distress, turning manageable operational hurdles into total business collapses.</p>
      </li>
      <li class="problem__card" data-stakeholder="lenders">
        <span class="problem__card-num">03</span>
        <h3>Lenders &amp; investors</h3>
        <p>Without a back-up servicer, operator insolvency severs the technical and field-level links to underlying cash flows — substantial capital loss, stranded assets.</p>
      </li>
      <li class="problem__card" data-stakeholder="capital">
        <span class="problem__card-num">04</span>
        <h3>Institutional capital</h3>
        <p>Operator-default risk is a roadblock for investors and rating agencies, preventing the massive investment needed to achieve universal energy access.</p>
      </li>
      <li class="problem__card" data-stakeholder="governments">
        <span class="problem__card-num">05</span>
        <h3>Governments</h3>
        <p>Unmanaged company failures compromise national electrification targets and undermine public trust in off-grid energy.</p>
      </li>
    </ol>
  </div>
</section>
```

- [ ] **Step 2: Append problem styles**

```css
/* === SECTION 2: THE PROBLEM === */
.section--problem {
  align-items: stretch;
  padding: 0;
  min-height: 250vh;          /* tall — drives the pinned timeline */
}
.problem__inner {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(0, 1.3fr);
  gap: 4rem;
  align-items: start;
  padding: var(--section-pad-y) 5vw;
}
.problem__intro {
  position: sticky;
  top: 20vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-warm);
  font-weight: 600;
}
.problem__lede {
  color: var(--color-muted);
  max-width: 30ch;
}
.problem__cards {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.problem__card {
  background: #fff;
  border-left: 4px solid var(--color-warm);
  padding: 1.5rem 1.75rem;
  border-radius: 4px;
  box-shadow: 0 4px 24px -16px rgba(27,44,92,0.25);
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
  opacity: 0;
  transform: translateY(40px);
}
.problem__card-num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.75rem;
  color: var(--color-warm);
  grid-row: span 2;
  align-self: start;
}
.problem__card h3 { color: var(--color-navy); }
.problem__card p  { color: var(--color-ink); font-size: 0.98rem; }
```

- [ ] **Step 3: Append problem JS — stagger reveal as user scrolls through pinned section**

```js
// === SECTION 2: PROBLEM ===
(function() {
  gsap.utils.toArray('.problem__card').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
})();
```

- [ ] **Step 4: Verify in browser**

Reload, scroll into Section 2. Expected: left column (intro) sticks while right column (5 cards) scrolls. Each card fades in + slides up as it enters the viewport. Reverse on scroll-back works.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 2: problem — sticky intro + sequential card reveal"
```

---

## Task 6: Section 3 — The solution (3-layer safety net)

**Files:**
- Modify: `site/index.html` (replace `#solution`), `site/style.css` (append), `site/script.js` (append)

- [ ] **Step 1: Replace `#solution` markup**

```html
<section id="solution" class="section section--solution" data-section="3">
  <div class="solution__inner container">
    <div class="solution__intro">
      <p class="eyebrow eyebrow--warm">The answer</p>
      <h2>BUSco. A neutral, pan-African back-up servicer.</h2>
      <p class="solution__lede">A reliable safety net for the entire PAYGo industry — keeping the lights on, the cash flowing, and capital protected.</p>
    </div>

    <div class="safety-net" aria-hidden="true">
      <div class="safety-net__layer safety-net__layer--3" data-label="Field operations"></div>
      <div class="safety-net__layer safety-net__layer--2" data-label="Devices"></div>
      <div class="safety-net__layer safety-net__layer--1" data-label="Cash flow"></div>
      <div class="safety-net__caption">BUSco protects three things at once.</div>
    </div>

    <ul class="solution__benefits" role="list">
      <li>Continuous operation — payment processing and system continuity after step-in.</li>
      <li>Financial protection — investor capital preserved through smooth transitions.</li>
      <li>Positive user experience — customers keep their power, stay on the path to ownership.</li>
      <li>Industry professionalisation through better data quality.</li>
      <li>Opens funding avenues — removes major risks for large-scale commercial capital.</li>
      <li>Lowers cost of capital — reduces risk premiums on borrowing.</li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Append solution styles**

```css
/* === SECTION 3: SOLUTION === */
.section--solution {
  min-height: 200vh;
  align-items: stretch;
  padding: 0;
}
.solution__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 3rem 4rem;
  padding: var(--section-pad-y) 5vw;
  align-items: center;
}
.solution__intro { grid-column: 1; grid-row: 1; }
.eyebrow--warm { color: var(--color-warm-soft); }

.safety-net {
  grid-column: 2;
  grid-row: 1 / span 2;
  position: relative;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.safety-net__layer {
  position: absolute;
  left: 50%;
  border: 2px solid var(--color-warm);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.6);
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-warm-soft);
  padding-bottom: 0.5rem;
}
.safety-net__layer::before {
  content: attr(data-label);
}
.safety-net__layer--1 { top: 50%; width: 140px; height: 140px; border-color: var(--color-warm); }
.safety-net__layer--2 { top: 50%; width: 240px; height: 240px; border-color: rgba(226,164,122,0.6); }
.safety-net__layer--3 { top: 50%; width: 340px; height: 340px; border-color: rgba(226,164,122,0.3); }
.safety-net__caption {
  position: absolute;
  bottom: -3rem;
  left: 0; right: 0;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-warm-soft);
  letter-spacing: 0.05em;
  opacity: 0;
}

.solution__benefits {
  grid-column: 1;
  grid-row: 2;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 1.02rem;
  color: var(--color-cream);
}
.solution__benefits li {
  padding-left: 1.25rem;
  position: relative;
  opacity: 0;
}
.solution__benefits li::before {
  content: '';
  position: absolute;
  left: 0; top: 0.65em;
  width: 6px; height: 6px;
  background: var(--color-warm);
  border-radius: 50%;
}
```

- [ ] **Step 3: Append solution JS — animate the safety-net layers in + benefits stagger**

```js
// === SECTION 3: SOLUTION ===
(function() {
  // Safety-net layers: cascade outward as user enters the section
  gsap.timeline({
    scrollTrigger: {
      trigger: '#solution',
      start: 'top 60%',
      toggleActions: 'play none none reverse',
    },
    defaults: { duration: 0.8, ease: 'power3.out' },
  })
    .to('.safety-net__layer--3', { opacity: 1, scale: 1 })
    .to('.safety-net__layer--2', { opacity: 1, scale: 1 }, '-=0.5')
    .to('.safety-net__layer--1', { opacity: 1, scale: 1 }, '-=0.5')
    .to('.safety-net__caption',  { opacity: 1, y: 0 }, '-=0.3');

  // Benefits: stagger as the bottom row enters
  gsap.to('.solution__benefits li', {
    opacity: 1,
    y: 0,
    stagger: 0.12,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.solution__benefits',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 3. Expected: dark navy background. Three concentric rings cascade outward (largest first), with labels visible as they appear. The 6 benefits stagger-fade in from below.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 3: solution — animated safety-net + benefit stagger"
```

---

## Task 7: Section 4 — Big stat moment ($20B+ count-up)

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#stat` markup**

```html
<section id="stat" class="section section--stat" data-section="4">
  <div class="container stat__container">
    <p class="eyebrow eyebrow--warm">Track record</p>
    <div class="stat__big">
      <span class="stat__currency">$</span><span class="stat__number" data-target="20">0</span><span class="stat__unit">B+</span>
    </div>
    <p class="stat__caption">in solar loans backstopped by BUS structures, originated by the Hyfin founding team in North America. We're bringing that infrastructure to the off-grid sector.</p>
  </div>
</section>
```

- [ ] **Step 2: Append stat styles**

```css
/* === SECTION 4: STAT === */
.section--stat {
  text-align: center;
  position: relative;
}
.section--stat::before {
  /* faint geodesic backdrop */
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(198,107,61,0.12) 0%, transparent 60%);
  pointer-events: none;
}
.stat__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}
.stat__big {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(5rem, 18vw, 14rem);
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-cream);
  display: flex;
  align-items: baseline;
  gap: 0.05em;
  font-variant-numeric: tabular-nums;
}
.stat__currency { color: var(--color-warm); font-size: 0.6em; }
.stat__unit     { color: var(--color-warm); font-size: 0.55em; }
.stat__caption  {
  max-width: 48ch;
  color: var(--color-cream);
  opacity: 0.85;
  font-size: 1.05rem;
}
```

- [ ] **Step 3: Append stat JS — count-up animation**

```js
// === SECTION 4: STAT ===
(function() {
  const num = document.querySelector('.stat__number');
  const target = Number(num.dataset.target);
  const counter = { val: 0 };

  ScrollTrigger.create({
    trigger: '#stat',
    start: 'top 60%',
    onEnter: () => {
      gsap.to(counter, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => { num.textContent = Math.round(counter.val); },
      });
    },
    onLeaveBack: () => {
      counter.val = 0;
      num.textContent = '0';
    },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 4. Expected: deep navy background with subtle warm glow. Number counts from 0 to 20 over ~1.4s when the section enters view. Scroll back up resets it. Caption visible below.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 4: stat — animated count-up to \$20B"
```

---

## Task 8: Section 5 — How the BUS works (timeline scrollytelling)

This is the marquee section. The user scrolls through a pinned panel, advancing through 4 phases × multiple sub-steps.

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#how` markup**

```html
<section id="how" class="section section--how" data-section="5">
  <div class="how__pin">
    <div class="container how__container">
      <header class="how__header">
        <p class="eyebrow">From setup to activation</p>
        <h2>How the BUS works.</h2>
      </header>

      <div class="how__phases">
        <div class="how__phase" data-phase="0">
          <span class="how__phase-label">Pre-succession</span>
          <span class="how__phase-name">Standby</span>
        </div>
        <div class="how__phase" data-phase="1">
          <span class="how__phase-label">Activation</span>
          <span class="how__phase-name">Transition</span>
        </div>
        <div class="how__phase" data-phase="2">
          <span class="how__phase-label">Live</span>
          <span class="how__phase-name">Active</span>
        </div>
        <div class="how__phase" data-phase="3">
          <span class="how__phase-label">Resolution</span>
          <span class="how__phase-name">Reversion</span>
        </div>
        <div class="how__progress"><div class="how__progress-fill"></div></div>
      </div>

      <div class="how__steps">
        <article class="how__step" data-step="0" data-phase="0">
          <h3>Screening &amp; diligence</h3>
          <p>Viability assessment and portfolio quality check. Identifying red flags and risks early to ensure the BUS is viable.</p>
        </article>
        <article class="how__step" data-step="1" data-phase="0">
          <h3>Structuring &amp; design</h3>
          <p>Triggers, mandates, and step-in rights defined. Core functionality, roles, and responsibilities established.</p>
        </article>
        <article class="how__step" data-step="2" data-phase="0">
          <h3>Contracting &amp; onboarding</h3>
          <p>Legal agreements (BSA), data access signed. Pipelines established, CRM access arranged, test runs validate integration.</p>
        </article>
        <article class="how__step" data-step="3" data-phase="1">
          <h3>Trigger invocation</h3>
          <p>Pre-agreed triggers hit — insolvency, covenant breach, PAR threshold. Standby flips to active mode.</p>
        </article>
        <article class="how__step" data-step="4" data-phase="2">
          <h3>Successor servicing</h3>
          <p>BUS assumes full control: data, payments, field operations, call centre. Customers stay on; collections keep flowing to lenders.</p>
        </article>
        <article class="how__step" data-step="5" data-phase="3">
          <h3>Reversion or wind-down</h3>
          <p>Portfolio handed back to a recapitalised operator, transferred to a new owner, or liquidated in an orderly fashion.</p>
        </article>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append how styles**

```css
/* === SECTION 5: HOW THE BUS WORKS === */
.section--how {
  padding: 0;
  min-height: 600vh;          /* tall scroll = generous timeline */
  align-items: stretch;
}
.how__pin {
  height: 100vh;
  display: flex;
  align-items: center;
  padding: 5vh 5vw;
}
.how__container {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 2.5rem;
  height: 100%;
  align-content: start;
}
.how__header { display: flex; flex-direction: column; gap: 0.75rem; }
.how__header h2 { color: var(--color-navy); }

.how__phases {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  position: relative;
  padding-bottom: 1rem;
}
.how__phase {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 0.75rem;
  opacity: 0.35;
  transition: opacity 0.4s ease, color 0.4s ease;
}
.how__phase.is-active { opacity: 1; }
.how__phase-label {
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-warm);
}
.how__phase-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.5rem;
  color: var(--color-navy);
}
.how__progress {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 3px;
  background: rgba(27,44,92,0.1);
  border-radius: 2px;
  overflow: hidden;
}
.how__progress-fill {
  height: 100%;
  width: 0%;
  background: var(--color-warm);
  transform-origin: left center;
  transition: width 0.1s linear;
}

.how__steps {
  position: relative;
  min-height: 200px;
}
.how__step {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: var(--content-max);
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
}
.how__step.is-active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.how__step h3 { color: var(--color-navy); }
.how__step p  { color: var(--color-ink); max-width: 60ch; }
```

- [ ] **Step 3: Append how JS — pin + step + phase progression**

```js
// === SECTION 5: HOW THE BUS WORKS ===
(function() {
  const section = document.querySelector('#how');
  const pin = section.querySelector('.how__pin');
  const steps = gsap.utils.toArray('.how__step');
  const phases = gsap.utils.toArray('.how__phase');
  const progressFill = section.querySelector('.how__progress-fill');
  const totalSteps = steps.length;

  function activate(stepIdx) {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === stepIdx));
    const activePhase = Number(steps[stepIdx].dataset.phase);
    phases.forEach((p, i) => p.classList.toggle('is-active', i <= activePhase));
  }
  activate(0);

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    pin: pin,
    pinSpacing: false,
    onUpdate: (self) => {
      const progress = self.progress;
      progressFill.style.width = `${progress * 100}%`;
      const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
      activate(idx);
    },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 5. Expected: the panel pins to the viewport. As you continue scrolling, the progress bar fills, the phase pills light up cumulatively (Standby → Transition → Active → Reversion), and the step text swaps through 6 stages. Reverse scroll works. Section unpins at end and the page continues to Section 6.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 5: how it works — pinned timeline scrollytelling"
```

---

## Task 9: Section 6 — Use cases (two-column reveal)

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#usecases` markup**

```html
<section id="usecases" class="section section--usecases" data-section="6">
  <div class="container usecases__container">
    <header class="usecases__header">
      <p class="eyebrow">Flexible by design</p>
      <h2>One BUS. Multiple funding structures.</h2>
      <p class="usecases__lede">Critical infrastructure for both today's lending needs and the future of securitization.</p>
    </header>

    <div class="usecases__grid">
      <article class="usecase usecase--current">
        <span class="usecase__tag">Today</span>
        <h3>On-balance-sheet lending</h3>
        <ul>
          <li><strong>Latent demand.</strong> Conventional structures used by DFIs, impact investors, regional development banks.</li>
          <li><strong>Lender cushion.</strong> Protection layer for underperformance or operational standstill.</li>
          <li><strong>Applicability.</strong> Traditional corporate lending, or emerging structures like RBF-secured loans.</li>
        </ul>
      </article>

      <article class="usecase usecase--future">
        <span class="usecase__tag">Tomorrow</span>
        <h3>Off-balance-sheet securitizations (SPVs)</h3>
        <ul>
          <li><strong>The path to scale.</strong> Securitization is currently limited but unlocks institutional capital.</li>
          <li><strong>A bankability requirement.</strong> Robust back-up servicing is a prerequisite for institutional investors.</li>
          <li><strong>Focus.</strong> Securitizing receivables, managing SPV-specific risks.</li>
        </ul>
      </article>
    </div>

    <div class="usecases__frontier">
      <p class="eyebrow">Frontier &amp; emerging</p>
      <div class="usecases__frontier-grid">
        <div>
          <h4>M300 &amp; government-financed programs</h4>
          <p>Tailored for ASCENT, DARES, and similar large-scale initiatives where high-volume public and bank financing requires servicing resilience.</p>
        </div>
        <div>
          <h4>Energy as a Service (EaaS)</h4>
          <p>Long-term service contracts require ongoing performance monitoring — a BUS becomes structurally necessary.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append usecases styles**

```css
/* === SECTION 6: USE CASES === */
.section--usecases { padding-top: var(--section-pad-y); padding-bottom: var(--section-pad-y); }
.usecases__container { display: flex; flex-direction: column; gap: 3rem; }
.usecases__header { display: flex; flex-direction: column; gap: 0.75rem; max-width: var(--content-max); }
.usecases__header h2 { color: var(--color-navy); }
.usecases__lede { color: var(--color-muted); }

.usecases__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.usecase {
  background: #fff;
  padding: 2rem;
  border-radius: 6px;
  border-top: 4px solid var(--color-navy);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(30px);
}
.usecase--future { border-top-color: var(--color-warm); }
.usecase__tag {
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-warm);
  font-weight: 600;
}
.usecase h3 { color: var(--color-navy); }
.usecase ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.98rem; }
.usecase li::before { content: '— '; color: var(--color-warm); }

.usecases__frontier {
  border-top: 1px solid rgba(27,44,92,0.15);
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.usecases__frontier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.usecases__frontier h4 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}
```

- [ ] **Step 3: Append usecases JS**

```js
// === SECTION 6: USE CASES ===
(function() {
  gsap.utils.toArray('.usecase').forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 6. Expected: header + lede, two cards side-by-side that fade-in staggered (navy left, warm-orange right), then a frontier section below.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 6: use cases — dual-column + frontier callouts"
```

---

## Task 10: Section 7 — Operating principles (staggered grid)

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#principles` markup**

```html
<section id="principles" class="section section--principles" data-section="7">
  <div class="container principles__container">
    <header class="principles__header">
      <p class="eyebrow eyebrow--warm">Built for the sector</p>
      <h2>Six principles that shape BUSco.</h2>
      <p class="principles__lede">Commitments to the market, to capital providers, to companies, and to customers.</p>
    </header>

    <ul class="principles__grid" role="list">
      <li class="principle">
        <h3>Robust capability, minimized cost</h3>
        <p>Professional-grade back-up servicing with strong value for money for investors and operators alike.</p>
      </li>
      <li class="principle">
        <h3>Leverage existing infrastructure</h3>
        <p>Harmonized with established CRM platforms, third-party call centres, and existing field networks wherever possible.</p>
      </li>
      <li class="principle">
        <h3>Universal trust through neutrality</h3>
        <p>Structured as a social enterprise with clear roles, responsibilities, and triggers — agreed upfront with partners.</p>
      </li>
      <li class="principle">
        <h3>Built for the sector</h3>
        <p>Designed with market sustainability in mind. Standards, protocols, partnerships, and governance shaped together — before any crisis.</p>
      </li>
      <li class="principle">
        <h3>Investment-grade credibility</h3>
        <p>Functions as investor insurance — securing payment continuity and preserving asset value during crisis.</p>
      </li>
      <li class="principle">
        <h3>Lean start-up approach</h3>
        <p>Front-loaded work to test critical assumptions — stakeholder acceptance, financial viability, regulatory barriers — before scaling.</p>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Append principles styles**

```css
/* === SECTION 7: PRINCIPLES === */
.section--principles { padding-top: var(--section-pad-y); padding-bottom: var(--section-pad-y); }
.principles__container { display: flex; flex-direction: column; gap: 3rem; }
.principles__header { max-width: var(--content-max); display: flex; flex-direction: column; gap: 0.75rem; }
.principles__lede { color: rgba(247,244,238,0.75); }

.principles__grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 2rem;
}
.principle {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-left: 2px solid var(--color-warm);
  background: rgba(255,255,255,0.04);
  border-radius: 0 6px 6px 0;
  opacity: 0;
  transform: translateY(30px);
}
.principle h3 {
  font-size: 1.15rem;
  color: var(--color-cream);
}
.principle p {
  font-size: 0.95rem;
  color: rgba(247,244,238,0.8);
}
```

- [ ] **Step 3: Append principles JS**

```js
// === SECTION 7: PRINCIPLES ===
(function() {
  gsap.to('.principle', {
    opacity: 1,
    y: 0,
    stagger: { each: 0.1, from: 'start' },
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.principles__grid', start: 'top 75%', toggleActions: 'play none none reverse' },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 7. Expected: navy background, six cards in a 3×2 grid (2×3 on tablet, 1×6 on mobile — handled in Task 14), each fades + slides up in sequence.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 7: principles — staggered 3x2 grid reveal"
```

---

## Task 11: Section 8 — Capability hex-grid (interactive)

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#capabilities` markup**

```html
<section id="capabilities" class="section section--capabilities" data-section="8">
  <div class="container capabilities__container">
    <header class="capabilities__header">
      <p class="eyebrow">Operational components</p>
      <h2>Seven capability domains.</h2>
      <p class="capabilities__lede">Each required for a credible, investment-grade back-up servicer. Hover or tap any domain to see what it includes.</p>
    </header>

    <ul class="hex-grid" role="list">
      <li class="hex" data-domain="data">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Portfolio &amp; data access</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Customer &amp; loan datasets</li>
            <li>Real-time API access</li>
            <li>Early warning analytics</li>
            <li>Reporting templates</li>
            <li>Fraud / tamper detection</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="software">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Software &amp; digital infrastructure</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Device lock / unlock control</li>
            <li>Token / service continuity</li>
            <li>Customer account re-hosting</li>
            <li>Omnichannel communications</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="financial">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Financial &amp; payment operations</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Wallet rerouting</li>
            <li>Mobile money integration</li>
            <li>Automated reconciliation</li>
            <li>Cash waterfall management</li>
            <li>Multi-currency support</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="hardware">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Hardware &amp; technical assets</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Master key management</li>
            <li>Inventory management</li>
            <li>Logistics &amp; distribution</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="legal">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Legal &amp; regulatory compliance</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Back-Up Servicing Agreement</li>
            <li>Pre-negotiated step-in rights</li>
            <li>Data portability agreements</li>
            <li>Novation rights</li>
            <li>Jurisdictional compliance</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="governance">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Governance &amp; strategic management</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Operations management team</li>
            <li>Documented SOPs</li>
            <li>KPI monitoring</li>
            <li>Vendor oversight</li>
            <li>Stakeholder communication</li>
          </ul>
        </div>
      </li>
      <li class="hex" data-domain="field">
        <button class="hex__face" type="button" aria-expanded="false">
          <span class="hex__title">Field &amp; customer support</span>
        </button>
        <div class="hex__detail">
          <ul>
            <li>Local-language call centres</li>
            <li>Technician network</li>
            <li>Field collections</li>
            <li>Agent absorption protocols</li>
            <li>Warranty fulfillment</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Append capabilities styles (hex via clip-path)**

```css
/* === SECTION 8: CAPABILITIES === */
.section--capabilities { padding-top: var(--section-pad-y); padding-bottom: var(--section-pad-y); }
.capabilities__container { display: flex; flex-direction: column; gap: 3rem; }
.capabilities__header { max-width: var(--content-max); display: flex; flex-direction: column; gap: 0.75rem; }
.capabilities__header h2 { color: var(--color-navy); }
.capabilities__lede { color: var(--color-muted); }

.hex-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.hex {
  position: relative;
  aspect-ratio: 1 / 1;
  opacity: 0;
  transform: scale(0.85);
}
.hex__face {
  width: 100%; height: 100%;
  background: var(--color-navy);
  color: var(--color-cream);
  border: none;
  cursor: pointer;
  clip-path: polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  transition: background 0.3s ease, transform 0.3s ease;
}
.hex__face:hover,
.hex.is-open .hex__face {
  background: var(--color-warm);
  transform: scale(1.04);
}
.hex__detail {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  width: 280px;
  background: #fff;
  border: 1px solid rgba(27,44,92,0.12);
  border-radius: 6px;
  box-shadow: 0 12px 36px -16px rgba(27,44,92,0.3);
  padding: 1rem 1.25rem;
  font-size: 0.9rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 5;
}
.hex.is-open .hex__detail,
.hex:hover .hex__detail {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
.hex__detail ul { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
.hex__detail li { color: var(--color-ink); }
.hex__detail li::before { content: '· '; color: var(--color-warm); }
```

- [ ] **Step 3: Append capabilities JS**

```js
// === SECTION 8: CAPABILITIES ===
(function() {
  // Reveal hexes with stagger
  gsap.to('.hex', {
    opacity: 1,
    scale: 1,
    stagger: { each: 0.07, from: 'start' },
    duration: 0.5,
    ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.hex-grid', start: 'top 75%', toggleActions: 'play none none reverse' },
  });

  // Click-to-toggle for touch devices (hover handles desktop)
  gsap.utils.toArray('.hex').forEach((hex) => {
    const face = hex.querySelector('.hex__face');
    face.addEventListener('click', () => {
      const isOpen = hex.classList.toggle('is-open');
      face.setAttribute('aria-expanded', String(isOpen));
      // Close siblings
      gsap.utils.toArray('.hex').forEach((other) => {
        if (other !== hex) {
          other.classList.remove('is-open');
          other.querySelector('.hex__face').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 8. Expected: 7 hexagonal tiles in a 4-column grid (last row has 3). Hover (or tap on touch) any hex → it turns warm-orange, and a popover with the capability list appears below it. Stagger reveal on enter.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 8: capabilities — interactive hex-grid"
```

---

## Task 12: Section 9 — Team

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#team` markup**

```html
<section id="team" class="section section--team" data-section="9">
  <div class="container team__container">
    <header class="team__header">
      <p class="eyebrow">The team</p>
      <h2>Industry and global expertise on BUS instruments and the PAYGo model.</h2>
    </header>

    <div class="team__grid">
      <article class="team__card">
        <h3>Catalyst Off-Grid Advisors</h3>
        <p class="team__role">Driving technical design of the BUS</p>
        <p>Undertook the most substantive PAYGo BUS design scoping work (2021) and due diligence of incumbent instruments (2025) in the industry. Team comes from the PAYGo industry — a practitioner lens.</p>
      </article>
      <article class="team__card">
        <h3>Hyfin</h3>
        <p class="team__role">Co-developing the BUS alongside Catalyst</p>
        <p>Founding team pioneered securitization in North America, originating over $20B in solar loans backstopped by BUS structures. Brings deep knowledge of commercial investor expectations and bankable structures.</p>
      </article>
    </div>

    <div class="team__backers">
      <p class="eyebrow">Institutional backers supporting BUSco</p>
      <p class="team__backers-note">Mobilized institutional capital underscores investors' view that a robust BUS is a must for the off-grid solar industry.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append team styles**

```css
/* === SECTION 9: TEAM === */
.section--team { padding-top: var(--section-pad-y); padding-bottom: var(--section-pad-y); }
.team__container { display: flex; flex-direction: column; gap: 3rem; }
.team__header h2 { color: var(--color-navy); max-width: 32ch; }

.team__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.team__card {
  background: #fff;
  padding: 2rem;
  border-radius: 6px;
  border-left: 4px solid var(--color-navy);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(30px);
}
.team__card h3 { color: var(--color-navy); }
.team__role {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  color: var(--color-warm);
  font-weight: 600;
}

.team__backers {
  border-top: 1px solid rgba(27,44,92,0.15);
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.team__backers-note { color: var(--color-muted); max-width: 60ch; }
```

- [ ] **Step 3: Append team JS**

```js
// === SECTION 9: TEAM ===
(function() {
  gsap.to('.team__card', {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.team__grid', start: 'top 80%', toggleActions: 'play none none reverse' },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll into Section 9. Expected: header, two team cards (Catalyst left, Hyfin right) fade-in staggered, backers callout below.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 9: team — Catalyst + Hyfin cards + backers note"
```

---

## Task 13: Section 10 — CTA / Get involved

**Files:**
- Modify: `site/index.html`, `site/style.css`, `site/script.js`

- [ ] **Step 1: Replace `#cta` markup**

```html
<section id="cta" class="section section--cta" data-section="10">
  <div class="cta__bg" style="background-image: url('assets/hero-bg.jpg');"></div>
  <div class="cta__scrim"></div>
  <div class="container cta__container">
    <header class="cta__header">
      <p class="eyebrow eyebrow--warm">Get involved</p>
      <h2>We're seeking partners to co-develop and pilot the BUS.</h2>
      <p class="cta__lede">PAYGo companies to pilot with us. Investors and lenders to embed the BUS into financing structures.</p>
    </header>

    <ol class="cta__steps" role="list">
      <li><span>01</span><div><h4>Engage bilaterally</h4><p>Share your feedback on broad principles. Tell us what works, what concerns you, what to consider.</p></div></li>
      <li><span>02</span><div><h4>Join the consultation</h4><p>Participate in Phase 1 design interviews. Help determine how the BUS functions, what data access looks like, how transitions are managed.</p></div></li>
      <li><span>03</span><div><h4>Signal willingness</h4><p>Sign a non-binding expression of interest. Helps us demonstrate market traction to funders and DFIs.</p></div></li>
      <li><span>04</span><div><h4>Connect us</h4><p>Warm intros to your lenders, peers, and service providers accelerate the loop of demand that makes BUSco a market standard.</p></div></li>
    </ol>

    <div class="cta__contact">
      <p class="eyebrow">Get in touch</p>
      <div class="cta__contacts">
        <a href="mailto:kat@catalyst-advisors.com" class="cta__email"><strong>Kat Harrison</strong>kat@catalyst-advisors.com</a>
        <a href="mailto:dan@catalyst-advisors.com" class="cta__email"><strong>Dan Murphy</strong>dan@catalyst-advisors.com</a>
        <a href="mailto:billy@hyfin.earth" class="cta__email"><strong>Billy Parish</strong>billy@hyfin.earth</a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append CTA styles**

```css
/* === SECTION 10: CTA === */
.section--cta {
  padding: var(--section-pad-y) 5vw;
  position: relative;
  overflow: hidden;
  align-items: center;
}
.cta__bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: saturate(0.85);
}
.cta__scrim {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(17,25,58,0.85) 0%, rgba(17,25,58,0.92) 100%);
}
.cta__container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.cta__header { display: flex; flex-direction: column; gap: 0.75rem; max-width: 40ch; }
.cta__header h2 { color: var(--color-cream); }
.cta__lede { color: rgba(247,244,238,0.85); }

.cta__steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.cta__steps li {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  border-top: 2px solid var(--color-warm);
}
.cta__steps span {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-warm);
}
.cta__steps h4 { font-family: var(--font-display); font-size: 1.1rem; color: var(--color-cream); }
.cta__steps p  { font-size: 0.92rem; color: rgba(247,244,238,0.82); }

.cta__contact { display: flex; flex-direction: column; gap: 1rem; }
.cta__contacts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.cta__email {
  background: var(--color-warm);
  color: var(--color-navy-deep);
  padding: 1rem 1.25rem;
  border-radius: 4px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease;
}
.cta__email strong {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
}
.cta__email:hover { transform: translateY(-2px); background: var(--color-warm-soft); }
```

- [ ] **Step 3: Append CTA JS — staggered step entrance**

```js
// === SECTION 10: CTA ===
(function() {
  gsap.from('.cta__steps li', {
    opacity: 0, y: 30, stagger: 0.12, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta__steps', start: 'top 80%', toggleActions: 'play none none reverse' },
  });
  gsap.from('.cta__email', {
    opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '.cta__contacts', start: 'top 85%', toggleActions: 'play none none reverse' },
  });
})();
```

- [ ] **Step 4: Verify in browser**

Scroll to bottom. Expected: dark photo bookend with deep navy overlay. Header, four numbered "ways to engage" cards in a row, three contact email buttons in warm orange. All elements stagger in. Email links open mailto:.

- [ ] **Step 5: Commit**

```bash
git add site/index.html site/style.css site/script.js
git commit -m "section 10: CTA — get involved + contact buttons"
```

---

## Task 14: Mobile responsive pass

**Files:**
- Modify: `site/style.css` (append responsive overrides)

- [ ] **Step 1: Append mobile media queries to `style.css`**

```css
/* === RESPONSIVE === */

/* Tablet: ≤ 960px */
@media (max-width: 960px) {
  .problem__inner { grid-template-columns: 1fr; gap: 2rem; }
  .problem__intro { position: static; }
  .solution__inner { grid-template-columns: 1fr; }
  .safety-net { grid-column: 1; height: 280px; }
  .safety-net__layer--3 { width: 260px; height: 260px; }
  .safety-net__layer--2 { width: 180px; height: 180px; }
  .safety-net__layer--1 { width: 100px; height: 100px; }
  .usecases__grid,
  .usecases__frontier-grid,
  .team__grid { grid-template-columns: 1fr; }
  .principles__grid { grid-template-columns: 1fr 1fr; }
  .hex-grid { grid-template-columns: repeat(3, 1fr); }
  .cta__steps { grid-template-columns: 1fr 1fr; }
  .cta__contacts { grid-template-columns: 1fr; }
  .how__phases { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .how__phase-name { font-size: 1.15rem; }
}

/* Mobile: ≤ 640px */
@media (max-width: 640px) {
  .section { padding: var(--section-pad-y) 6vw; }
  .principles__grid { grid-template-columns: 1fr; }
  .hex-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
  .hex__face { font-size: 0.85rem; padding: 1rem 0.75rem; }
  .hex__detail { width: 240px; font-size: 0.85rem; }
  .cta__steps { grid-template-columns: 1fr; }
  .stat__big { font-size: clamp(4rem, 22vw, 8rem); }
  .hero__cue { font-size: 0.75rem; }
}

/* Disable pinning on touch devices for the "how" section — too disorienting on small screens */
@media (max-width: 640px) {
  .section--how { min-height: auto; }
  .how__pin { height: auto; padding: var(--section-pad-y) 6vw; }
  .how__step {
    position: static;
    opacity: 1;
    transform: none;
    pointer-events: auto;
    margin-bottom: 2rem;
  }
  .how__steps { min-height: auto; }
  .how__phases { display: none; }
}
```

- [ ] **Step 2: Update `script.js` to skip `how` pinning on mobile**

Replace the existing `ScrollTrigger.create` for `#how` so the pinning only runs above 640px. Find this block in `script.js`:

```js
ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    pin: pin,
    pinSpacing: false,
    onUpdate: (self) => {
      const progress = self.progress;
      progressFill.style.width = `${progress * 100}%`;
      const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
      activate(idx);
    },
  });
```

Wrap it in a media-query check:

```js
if (window.matchMedia('(min-width: 641px)').matches) {
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    pin: pin,
    pinSpacing: false,
    onUpdate: (self) => {
      const progress = self.progress;
      progressFill.style.width = `${progress * 100}%`;
      const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
      activate(idx);
    },
  });
} else {
  // Mobile fallback: all steps visible (handled by CSS)
  steps.forEach((s) => s.classList.add('is-active'));
}
```

- [ ] **Step 3: Verify in browser**

In Chrome DevTools, toggle device toolbar (Cmd/Ctrl+Shift+M). Test at iPhone 14 (390×844) and iPad (820×1180). Expected:
- Mobile: all sections single-column. The "how" section is no longer pinned — steps stack vertically. Hex grid is 2-col. CTA steps stack to 1-col.
- Tablet: 2-col grids where appropriate. Hex grid 3-col.
- Desktop (>960px): original layout.

No horizontal scroll. No overflow.

- [ ] **Step 4: Commit**

```bash
git add site/style.css site/script.js
git commit -m "responsive: tablet + mobile breakpoints; disable how-pinning on mobile"
```

---

## Task 15: Polish + cross-browser smoke test

**Files:**
- Modify: `site/index.html` (favicon + open graph), `site/style.css` (any polish)

- [ ] **Step 1: Add a small geodesic favicon SVG to `site/assets/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#1B2C5C" stroke-width="3" stroke-linejoin="round">
  <polygon points="32,4 58,18 58,46 32,60 6,46 6,18"/>
  <polyline points="32,4 32,32 58,46"/>
  <polyline points="32,32 6,46"/>
  <polyline points="32,32 6,18"/>
  <polyline points="32,32 58,18"/>
</svg>
```

- [ ] **Step 2: Wire up favicon + Open Graph tags in `index.html` `<head>`**

Add after the `<title>` tag:

```html
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<meta property="og:title" content="BUSco — Industry-wide back-up servicer">
<meta property="og:description" content="A neutral pan-African back-up servicer for off-grid solar.">
<meta property="og:image" content="assets/hero-bg.jpg">
<meta property="og:type" content="website">
```

- [ ] **Step 3: Confirm reduced-motion fallback**

In macOS System Settings → Accessibility → Display → "Reduce motion" (or Windows equivalent), enable it. Reload the site. Expected: animations skip but content is still visible (the `prefers-reduced-motion` rule from Task 3 handles it). All cards/sections appear without staggered fades.

If anything is still hidden when reduced-motion is on, append to `style.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .problem__card, .usecase, .principle, .team__card,
  .hex, .solution__benefits li, .safety-net__layer { opacity: 1; transform: none; }
  .hero__logo, .hero__eyebrow, .hero__headline { opacity: 1; }
}
```

- [ ] **Step 4: Cross-browser smoke test**

Open in: Chrome (latest), Firefox (latest), Safari (latest, if on Mac — otherwise note as untested). Expected: all sections render, animations work, no console errors. If Safari has issues with `clip-path` on hexes, they may need `-webkit-clip-path`. Add the prefix if needed:

```css
.hex__face {
  -webkit-clip-path: polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%);
  clip-path: polygon(25% 5%, 75% 5%, 98% 50%, 75% 95%, 25% 95%, 2% 50%);
}
```

- [ ] **Step 5: Run Lighthouse (Chrome DevTools → Lighthouse → Performance + Best Practices)**

Expected: Performance ≥ 85, Best Practices ≥ 95. If Performance is below 85, inspect: is `hero-bg.jpg` truly compressed (check the file size from Task 2)? Are GSAP/Lenis loading from CDN with caching?

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "polish: favicon, og tags, reduced-motion fallback, browser prefixes"
```

---

## Task 16: Create GitHub repo and push

**Files:** none (git/gh operations only)

- [ ] **Step 1: Verify gh authentication and org access**

```bash
"/c/Program Files/GitHub CLI/gh.exe" auth status
"/c/Program Files/GitHub CLI/gh.exe" api orgs/catalyst-offgrid -q .login
```

Expected: auth status shows Helena's account logged in with `admin:org, repo, workflow` scopes. The org API call returns `catalyst-offgrid`. If the org call returns 404 or "must accept SSO", run `gh auth refresh -s admin:org,repo,workflow` and complete the SSO authorization in the browser.

- [ ] **Step 2: Generate an unguessable repo name**

```bash
python -c "import secrets, string; print('busco-preview-' + ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(8)))"
```

Note the output (e.g., `busco-preview-x7k2p9aq`). Use this as `<REPO>` below.

- [ ] **Step 3: Create the remote repo as public (required for free Cloudflare Pages connection)**

Public is fine — privacy comes from obscurity + Cloudflare Access. The `robots.txt` blocks indexing.

```bash
"/c/Program Files/GitHub CLI/gh.exe" repo create catalyst-offgrid/<REPO> \
  --public \
  --description "BUSco scrollytelling demo (gated via Cloudflare Access)" \
  --disable-issues \
  --disable-wiki
```

Expected: repo created at https://github.com/catalyst-offgrid/<REPO>

- [ ] **Step 4: Add remote and push**

The git repo at `G:/My Drive/Scrollytelling/` already has all the commits from Tasks 1–15. We need to set up the remote and push only the `site/` subdirectory tree contents — but the simpler path is to push the whole working repo (the docs/ folder is fine to publish too; it documents the project).

Decision: push the whole repo. Cloudflare Pages will be configured with `site/` as the build output directory.

```bash
cd "G:/My Drive/Scrollytelling"
git branch -M main
git remote add origin https://github.com/catalyst-offgrid/<REPO>.git
git push -u origin main
```

Expected: push succeeds. Open https://github.com/catalyst-offgrid/<REPO> in a browser to confirm the files are there.

- [ ] **Step 5: Verify the file structure on GitHub**

```bash
"/c/Program Files/GitHub CLI/gh.exe" api repos/catalyst-offgrid/<REPO>/contents/site -q '.[].name'
```

Expected output includes: `assets`, `index.html`, `script.js`, `style.css`, `README.md`, `robots.txt`.

---

## Task 17: Connect Cloudflare Pages (manual — guided)

**Files:** none (browser/dashboard operations)

This step requires Helena to be logged into the Cloudflare account at `ian@catalyst-advisors.com`. The Claude session cannot complete OAuth flows on her behalf.

- [ ] **Step 1: Open Cloudflare Pages**

Navigate to: https://dash.cloudflare.com/?to=/:account/pages

- [ ] **Step 2: Create a new Pages project, connect to Git**

Click **Create a project** → **Connect to Git**. If GitHub isn't already authorized, click **Connect GitHub account**. When prompted, grant access to the `catalyst-offgrid` org. Select the `<REPO>` from the list.

- [ ] **Step 3: Configure the build settings**

- **Project name:** `busco-preview` (or accept default)
- **Production branch:** `main`
- **Framework preset:** None
- **Build command:** *(leave blank)*
- **Build output directory:** `site`
- **Root directory (advanced):** *(leave blank)*

Click **Save and Deploy**.

- [ ] **Step 4: Wait for first deploy**

Cloudflare will clone, "build" (just copy the `site/` folder), and deploy. Takes ~30 seconds. When done, you'll get a URL like `https://busco-preview.pages.dev` or `https://busco-preview-x7k.pages.dev`.

- [ ] **Step 5: Open the URL and confirm the site loads**

Click the deployment URL. Expected: the BUSco site loads, all sections render, scrolling works. (Anyone can access at this point — Access gating happens in the next task.)

- [ ] **Step 6: Note the final `.pages.dev` URL**

Record it — it's needed for the Access policy in Task 18.

---

## Task 18: Set up Cloudflare Access gate (manual — guided)

**Files:** none (browser/dashboard operations)

- [ ] **Step 1: Open Cloudflare Zero Trust**

Navigate to: https://one.dash.cloudflare.com/

If this is the first time using Zero Trust on this Cloudflare account, you'll be prompted to choose a team name (e.g., `catalyst`) and select the **Free** plan (50 users, sufficient for a demo). Complete the setup.

- [ ] **Step 2: Configure a one-time PIN identity provider**

In Zero Trust → **Settings** → **Authentication** → **Login methods**, ensure **One-time PIN** is enabled. (It's enabled by default. No configuration needed.)

- [ ] **Step 3: Create the Access application**

Go to **Access** → **Applications** → **Add an application** → **Self-hosted**.

- **Application name:** `BUSco demo`
- **Session duration:** 24 hours
- **Application domain:** the Pages subdomain noted in Task 17 Step 6 (e.g., `busco-preview.pages.dev`). Cloudflare will auto-fill the host; leave path blank.

Click **Next**.

- [ ] **Step 4: Add an Access policy**

- **Policy name:** `Allow with PIN`
- **Action:** Allow
- **Configure rules → Include:** select **Emails** and enter the addresses you want to grant access to (e.g., `helenamariemuir@gmail.com`, `ian@catalyst-advisors.com`, plus any colleagues). Or select **Everyone** if you want true link-shareable + PIN-gate (anyone who knows the URL can request a PIN to their own email).

Click **Next** → leave defaults on the remaining screens → **Add application**.

- [ ] **Step 5: Test the gate**

Open the `.pages.dev` URL in an **incognito window**. Expected: instead of the site, you see Cloudflare's email-prompt page. Enter your email → check inbox → enter the 6-digit code → site loads.

- [ ] **Step 6: Confirm session works**

Refresh the page in the same incognito window. Expected: site loads directly (session cookie active for 24h).

- [ ] **Step 7: Final check from a phone**

Open the URL on your phone. Expected: same gate flow works, site is responsive and usable.

---

## Task 19: Wrap-up — share the link

- [ ] **Step 1: Document the result**

Append to `site/README.md`:

```markdown
## Live URL

https://<your-pages-subdomain>.pages.dev

Gated by Cloudflare Access — visitors enter their email, receive a one-time PIN, and get a 24-hour session.

## Updating

Push to `main`. Cloudflare Pages auto-deploys within ~30 seconds.
```

- [ ] **Step 2: Commit the README update**

```bash
cd "G:/My Drive/Scrollytelling"
git add site/README.md
git commit -m "docs: live URL and update flow"
git push
```

- [ ] **Step 3: Final smoke test of the deployed site**

Wait ~30s for the auto-deploy, then refresh the live URL. Confirm the README change pushed and everything still works.

---

## Open follow-ups (out of scope for this plan)

- Replace placeholder navy/warm hex values in `style.css` with the actual colors picked in Task 2 Step 3.
- If backers' logos become available, drop into `site/assets/backers/` and render in Section 9.
- Custom domain: in Cloudflare Pages → Custom domains, add e.g. `busco-demo.catalyst-advisors.com`.
- Analytics: Cloudflare Web Analytics is free and privacy-respecting; one-line embed.
