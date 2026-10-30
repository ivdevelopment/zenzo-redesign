# Zenzo — redesign concept

> **Unofficial redesign concept — Not affiliated with Zenzo.**
> An independently created portfolio study for [zenzobar.be](https://zenzobar.be/)
> (Zenzo, Eiermarkt 13, 8000 Brugge). Not endorsed or operated by the venue.

A portfolio redesign of the Zenzo nightclub website, in a black / bronze / champagne-gold system: Home, Gallery, VIP Experience, About,
Contact and Lost & Found, using Zenzo's own logo and photography. Available in English and Dutch (Nederlands).

**Live demo:** <https://ivdevelopment.github.io/zenzo-redesign/> · **Author:** Ian Verlinden

- Design system and mockup mapping: [docs/DESIGN.md](docs/DESIGN.md)
- Asset inventory and provenance: [docs/ASSETS.md](docs/ASSETS.md)
- QA reports: [docs/QA-P2.md](docs/QA-P2.md) (current), then [P1](docs/QA-P1.md), [P0-04](docs/QA-P0-04.md) and [P0-03](docs/QA-P0-03.md)
- Licences: [CREDITS.md](CREDITS.md)

> **Rights notice:** the Zenzo logo and photographs belong to Zenzo. Permission to use them in this unofficial redesign
> concept, including this public deployment, has been granted. This project claims no ownership of them and is not
> affiliated with, endorsed by or operated by Zenzo. The Bruges canal photograph is by Cedric Letsch (Unsplash License).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion (`motion/react`, lazy-loaded
`domAnimation` features) · Lucide icons · self-hosted Cormorant Garamond and Manrope. Images are built with
`sharp`. No backend, no analytics, no forms, no third-party requests at runtime.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

Production build and preview:

```bash
npm run build        # type-checks, then builds to dist/
npm run preview      # serves dist/ on http://localhost:4173
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b` + production build at base `/` |
| `npm run build:pages` | Production build for a GitHub Pages project site at `/zenzo-redesign/`, into `dist-pages/` |
| `npm run preview:pages` | Serve `dist-pages/` the way GitHub Pages does (directory indexes, trailing-slash redirect, `404.html`) at http://localhost:4174/zenzo-redesign/ |
| `npm run typecheck` | TypeScript project check |
| `npm run lint` | oxlint |
| `npm run preview` | Serve `dist/` on port 4173 |
| `npm run assets:fetch` | Download the Zenzo logo/photos (zenzobar.be) and the Bruges stock photo into `assets-src/` |
| `npm run assets` | Crop, colour-grade and resize them into `public/assets/` and `src/content/assets.generated.json` |
| `npm run qa` | Homepage Playwright + axe checks and screenshots against `npm run preview` (see below) |
| `npm run qa:links` | Link audit (internal + official + named links, from the homepage and a subpage) and Pages-readiness scan of `dist-pages/` (localhost, dev paths, base-aware URLs, secrets); needs `build:pages` first |
| `npm run qa:nl` | Dutch pages (7 pages × 4 widths: status, `lang`, title, h1, disclaimer, overflow, images, console, axe) and the language switcher both ways; needs `build:pages` first |
| `npm run qa:pages` | Inner pages + routing under the Pages base path (starts its own server on :4175; needs `build:pages` first) |
| `node scripts/shot.ts <width> <selector|page> <out.png>` | Screenshot one section (or the page) at a width, after reveals have fired |

## Pages and routing

| URL | Page |
| --- | --- |
| `/` | Home |
| `/gallery/` | Gallery |
| `/vip/` | VIP Experience |
| `/about/` | About |
| `/contact/` | Contact |
| `/lost-found/` | Lost & Found |

Dutch lives under `/nl/` with Dutch slugs: `/nl/`, `/nl/galerij/`, `/nl/vip/`, `/nl/over-zenzo/`, `/nl/contact/`, `/nl/gevonden-voorwerpen/`.
The language is part of the URL; the header switcher (and the phone menu) links each page to its twin. Copy lives in
`src/content/` — English in `site.ts` / `pages.ts` / `copy.ts`, Dutch in `nl.ts` (same shape, enforced by the type check).

Real paths with a tiny History-API router (`src/lib/routing.ts`); the build writes one `index.html` per route and a `404.html`, so direct links and
refreshes work on GitHub Pages with no redirect trick. Details: [docs/DESIGN.md](docs/DESIGN.md#routing).

## Deployment (GitHub Pages)

Deployed by GitHub Actions ([.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)) on every push to `main`: `npm ci`, then
`BASE_PATH=/zenzo-redesign/ npm run build`, then `dist/` is uploaded and published with the official Pages actions. No `gh-pages` branch.

The base path is the repository name. For a project site at `https://<user>.github.io/<repo>/`:

```bash
BASE_PATH=/<repo>/ npm run build      # output: dist/
```

`npm run build:pages` is the same for the expected repository name `zenzo-redesign` (base `/zenzo-redesign/`, output `dist-pages/`). Publish the
contents of that folder. The build writes `index.html` for every route and `404.html`; every asset URL goes through Vite's `BASE_URL`.
If the repository is named differently, use `BASE_PATH=/<other-name>/ npm run build` (and update the `/zenzo-redesign/` constants in
`scripts/qa-pages.ts` and `scripts/qa-links.ts` if you want the QA suites to follow).

Before publishing, run `npm run qa:links` (link audit and readiness scan).

## Concept safeguards

- Disclaimer strip above the header at every scroll position, repeated in the mobile menu and footer.
- Venue facts only from zenzobar.be, nothing invented. Opening hours omitted (the official site's NL and EN pages
  disagree). The language selector offers EN and NL; FR is shown as "soon" and disabled.
- No booking, payment, contact form, email or phone. Enquiries point to the official website.
- `noindex, nofollow` meta and a `Disallow: /` `robots.txt`. No analytics or trackers.

## QA

With `npm run preview` running in another terminal:

```bash
npm run qa
```

Writes viewport and full-page screenshots for 1440, 1024, 768, 390, 375 and 320px widths to
`qa/screenshots/`, plus `qa/report.json` (horizontal overflow, broken images, console
errors, failed requests, disclaimer visibility, axe-core WCAG A/AA violations, VIP photo/title sync, VIP
panel hover/toggle and mobile row expansion, language selector, active nav link, mobile menu keyboard flow,
lightbox keyboard flow, gallery hover, desktop tab order, reduced-motion state).

## Project layout

```
src/
  pages/         HomePage, GalleryPage, VipPage, AboutPage, ContactPage, LostFoundPage, NotFoundPage
  content/       site.ts (home copy + facts), pages.ts (inner-page copy), photos.ts (image manifest), assets.generated.json (build output)
  components/    Header, MobileMenu, PageHero, Hero, Atmosphere, Gallery, Lightbox, Vip, Contact, Footer; ui/ primitives (Link, Buttons, Reveal …)
  hooks/         scroll-state hook
  lib/           routing.ts (router), scroll.ts
scripts/         fetch-assets.ts, build-assets.ts, serve-static.ts, qa.ts, qa-pages.ts, shot.ts
public/          assets/ (zenzo/, stock/), robots.txt
assets-src/      downloaded originals (git-ignored)
docs/            DESIGN.md, ASSETS.md, QA-P1.md (+ QA-P0-04.md, QA-P0-03.md, QA-P0-02.md, history)
```

Footer attribution: "Unofficial redesign concept by Ian Verlinden" (`concept.author` in `src/content/site.ts`).
