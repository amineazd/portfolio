# amadesign portfolio — Claude Code context

Owner: AZENNOUD MOHAMED AMINE (Amine), Senior UX/UI & Brand Designer, studio name **amadesign**.
Treat him as a senior designer: skip beginner explanations, lead with strategy.
Use the full name "AZENNOUD MOHAMED AMINE" in signatures and formal deliverables.
Contact on site: contact@amadesign.online

## Project

- Live: https://amadesign.online (also amineazd.github.io/portfolio/)
- Repo: amineazd/portfolio — static site on GitHub Pages; domain + DNS managed in Vercel
- Stack: plain HTML/CSS/JS, GSAP 3.13.0 (ScrollTrigger, SplitText, ScrollSmoother, Draggable + Inertia), Lucide icons
- Files: `index.html`, `about.html`, `styles.css`, `app.js`, `assets/`, project pages below

## Design system (source of truth = `styles.css` :root)

- Background `#0a0a0f`, text `#f0eeeb`, accent electric lime `#c8ff00`, secondary indigo `#6366f1`, tertiary pink `#f472b6`
- Fonts: Syne 800 (display), DM Sans (body), JetBrains Mono (utility). Never Inter, Roboto, Open Sans.
- Every page must have: `amadesign.` logo + full nav, noise overlay, GSAP scroll reveals,
  footer `© 2026 amadesign — Designed & built with intention.`

## Case studies

Next Project chain (circular): Haushaltsankauf24 → VGK → Manuka Honey → Skillz-up → Haushaltsankauf24

| Page | Status |
|---|---|
| `project-haushaltsankauf.html` | Unified system, replaced SnapOps. Needs before/after screenshots + client brief |
| `project-skillzup.html` | Unified system. Hero `assets/Skillzup_screen.png` |
| `project-vgk-karting.html` | Unified system. Hero = `assets/vgk_screen.png`. Needs: brand identity, pricing accordion, desktop views |
| `project-manuka-honey.html` | Unified system. Hero = `assets/Makunahoney_screen.png`. Needs: homepage, product page + UMF switcher, mobile views |

Homepage Work = full-width case-study cards (problem → decision → result), image side alternating.
VGK, Manuka, Skillz-up use the real mobile shots in assets/. Haushaltsankauf24 uses a German SVG
wireframe placeholder — replace with a real desktop capture. Its P/D/R copy needs Amine's review.

## This weekend (Sept 26–27, 2026)

1. New case study: **AloCut** — barber haircut reservation product; 14-day free trial; barber onboarding questionnaire (12 questions). Start with case study structure.
2. Finish **Haushaltsankauf24** — page scaffolded (hero, overview, diagnosis, before/after intro).
   Before: haushaltsaufloesungennrw.de → After: haushaltsankauf24.de (WordPress + Elementor), client Gallery Jarrodi.
   Still needed from Amine: before screenshots (mobile + desktop), original brief, scope confirmation.
   Then add: before vs after visuals, client brief vs what was built, UX logic per decision.
3. Extend the Next Project chain to include both new pages.
4. Decide homepage card imagery now that the grid grows to 6.

Other open items: hero counters showing "0+" instead of real values (bug); GSAP Tier 2 (Flip card→case study transition, SplitText scramble on section numbers, Draggable + Inertia on Toolkit tags); Alf Al Faras case study planned later.

## Case-study page conventions

- Every case study inlines its own `<style>` (no shared stylesheet). Template = `project-skillzup.html`.
- Scroll reveals on case studies use a small IntersectionObserver (`.reveal` → `.visible`), not GSAP.
- Missing visuals are marked `<!-- VISUAL NEEDED: … -->` in the HTML — never publish "Replace with…" boxes.

## Hard-won rules

- Cinematic hero (laugon.com style): white text with `mix-blend-mode: difference` over portrait at ~`brightness(0.85)`. Not `background-clip: text`, `screen`, or `lighten`.
- With the preloader: init ScrollTrigger inside `window.addEventListener('load', ...)`. Set initial states with `gsap.set()` — never CSS `opacity: 0` on elements GSAP animates.
- After any JS edit, run `node --check` on `app.js` and on extracted inline scripts. Unclosed IIFE braces from string replacements have silently broken whole script blocks (including preloader removal).
- Icons: Lobe CDN `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/[slug].svg` (confirmed: figma, notion, openai). Adobe suite, WordPress, Elementor use custom inline SVGs.
- When no real screenshot exists, placeholder project screens are SVG renders using the client's actual brand colors and real-language copy (e.g. French).

## Working style

- Amine iterates visually and references live sites as targets; expect mid-session clarifications.
- Show changes page by page; commit in small, clearly described commits.
- Notion: portfolio workspace page `2ed144fd5dc580fbb249e8a6209af26d`, Case Studies DB `2ed144fd5dc581bbb44becea7da10238`.
