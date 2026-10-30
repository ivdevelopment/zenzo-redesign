# P1 — Remaining pages: QA report

> Unofficial redesign concept — Not affiliated with Zenzo.

Run: 2026-10-28 · Chromium (Playwright). Inner pages and routing are tested against the **GitHub-Pages build** (`npm run build:pages`, base
`/zenzo-redesign/`) served by `scripts/serve-static.ts`, which reproduces Pages' behaviour (directory index, trailing-slash 301, `404.html` with a 404
status, nothing served outside the base). The homepage suite runs against the root build.
Reproduce: `npm run build && npm run preview` → `npm run qa`; `npm run build:pages && npm run qa:pages`. Raw results: `qa/report.json`, `qa/report-pages.json`.

## Checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass, 0 warnings |
| `npm run build` (root) | Pass — JS 382 kB (117 kB gzip), CSS 63 kB |
| `npm run build:pages` (`/zenzo-redesign/`) | Pass — writes `index.html` for `/`, `gallery/`, `vip/`, `about/`, `contact/`, `lost-found/` and `404.html`; every asset URL carries the base |
| Five pages + 404 × six widths (1440 / 1024 / 768 / 390 / 375 / 320) = **36 combinations** | **36 / 36 pass** every check below |
| …correct status (200; 404 on the missing page) and page `<title>` | Yes |
| …exactly one `<h1>`, with the expected text | Yes |
| …current page marked (`aria-current="page"`) in the header | Yes (none on 404) |
| …horizontal overflow / overflowing elements | None at any width |
| …broken images, console errors, failed requests | 0 / 0 / 0 |
| …axe-core WCAG 2.0/2.1 A + AA | **0 violations** |
| …disclaimer visible in the header strip and present in the footer | Yes at every width |
| …no `<form>` / input / textarea / select | Confirmed on every page |
| …every `target=_blank` link has `rel=noopener`; no internal link points outside the base | Yes |
| …`noindex` meta | Present on every page |
| …body text smaller than 12px (excluding the uppercase labels) | None |
| Homepage suite (6 widths) | Clean — overflow, images, console/network, axe, VIP sync, disclaimer, menu, lightbox, reduced motion |

## Routing and navigation

| Check | Result |
| --- | --- |
| Header links → each page | URL, title, h1, current-page marker correct; scroll at top; focus moved to `<main>` |
| Navigation is client-side | A `window` marker set before a link click survives (no full reload) |
| Back / forward | Return to the previous / next page |
| Logo, footer links and homepage links (Discover VIP, View full gallery, Read more, All contact details) | Go to `/vip/`, `/gallery/`, `/about/`, `/contact/` |
| Header hrefs are real URLs | `/zenzo-redesign/`, `/zenzo-redesign/gallery/` … (open-in-new-tab and copy-link work) |
| **Direct navigation under the base path** — each of the six pages | Loads with status 200 and the right page; **reload keeps it** |
| `/zenzo-redesign/gallery` (no trailing slash) | 301 → `/zenzo-redesign/gallery/`, renders |
| `/zenzo-redesign/vip/#private-lounge` | Scrolls to the chapter on first load (bug found and fixed in this pass) |
| `/zenzo-redesign/nope/` | HTTP 404 with the in-app "Page not found" page and a link home |
| Outside the base (`/gallery/`) | 404 — nothing resolves outside `/zenzo-redesign/` |
| Image URLs outside the base | None |
| Mobile menu → each page | Menu closes, URL and h1 correct, current page marked in the menu |

## Page behaviour

| Check | Result |
| --- | --- |
| Gallery page | 12 frames, 11 distinct frame sizes; lightbox opens from the first and last tile, arrows wrap (01 ← → 12), Escape returns focus to the tile |
| Official routing links | Contact form → `https://zenzobar.be/#contact`; VIP → `https://zenzobar.be/#vip`; Lost & Found → `https://zenzobar.be/#contact?type=lost-found` (the site's own link); all open in a new tab |
| Reduced motion (VIP page) | Hero settle animation `none`, title transform `none`, smooth scroll off; chapter images show without the wipe |

## Bugs found and fixed during this pass

1. **Anchor on first load.** `/vip/#private-lounge` opened at the top, because the browser scrolls before React renders. The app now scrolls to the
   anchor after render and again once layout has settled.
2. **Page-title contrast on light photographs** (About banner): thin gold on grey. Banner scrim strengthened and the baseline-darkening gradient dropped from
   page titles.
3. A test-script slip that corrupted `qa-pages.ts` (a `$\`` sequence in a replacement string) was caught by the type-check and repaired byte-exactly.

## Screenshots

`qa/screenshots/pages/` (74 files). Homepage set in `qa/screenshots/`; P0-04 baseline in `qa/baseline-p0-04/`.

| Requested | File |
| --- | --- |
| Desktop 1440 — Gallery, VIP, About, Contact, Lost & Found | `desktop-gallery-0-full.png`, `desktop-vip-0-full.png`, `desktop-about-0-full.png`, `desktop-contact-0-full.png`, `desktop-lost-found-0-full.png` |
| Mobile 390 — same five | `mobile-gallery-0-full.png`, `mobile-vip-0-full.png`, `mobile-about-0-full.png`, `mobile-contact-0-full.png`, `mobile-lost-found-0-full.png` |

Also: `<viewport>-<page>-1-hero.png` (first screen, with header) for every page and width (`desktop`, `laptop` 1024, `tablet` 768, `mobile` 390,
`mobile-375`, `mobile-small` 320), `<viewport>-not-found-*`, `mobile-menu-open.png`, `desktop-gallery-lightbox.png`.

## Homepage: only what the new pages required

Links now lead to pages ("View full gallery" → `/gallery/`, "Discover VIP" → `/vip/`, a "Read more" link in the About reveal, "All contact details" and
"Lost & Found" under the location band). Header and footer navigation became routes. Page height changed by +41 px at 1440 (3 741 → 3 782) and +74 px at 390
(4 131 → 4 205). No layout, type or colour changes.

## Known limitations

1. **Four photographs.** The gallery page uses twelve crops in three grades, which hides the repetition well but cannot remove it — the same four moments
   still recur. This is the strongest argument for new photography before launch.
2. **Official deep links.** `#contact`, `#vip` and `#contact?type=lost-found` are the anchors zenzobar.be itself uses today; if the official site is
   restructured they will land at its top. The "Lost & Found" steps describe the form as it exists now.
3. **Sparse pages by design.** Contact and Lost & Found rely on layout, imagery and the Bruges photograph, not content — the brief forbids inventing any.
4. **Language selector** still listed NL/FR as disabled at this stage; Dutch was added afterwards (see README).
5. **Pages are client-rendered.** Each route's `index.html` is the same app shell; the page title and content appear only after JavaScript runs. With
   `noindex` that does not matter here; for a real site, prerender.
6. **Not verified:** Safari/Firefox, a physical phone, a screen reader; axe covers only part of accessibility.

## Rights reminder

The Zenzo logo and photographs belong to Zenzo. Permission to use them in this unofficial concept, including its public deployment, was granted after this report. See `docs/ASSETS.md`.
