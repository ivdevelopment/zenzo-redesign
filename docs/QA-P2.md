# P2 — Pre-deployment finalization

> Unofficial redesign concept — Not affiliated with Zenzo.

Fresh builds, 2026-10-28. Commands: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build:pages`, then `npm run qa` (homepage, root
build), `npm run qa:pages` (pages + routing, Pages build under `/zenzo-redesign/`), `npm run qa:links` (link audit + readiness scan).

## Changes in this pass
- **Attribution:** footer reads "Unofficial redesign concept by Ian Verlinden · 2026"; the separate "Not affiliated with Zenzo" disclaimer is unchanged.
- **Rights wording:** footer credits, CREDITS.md and ASSETS.md say the Zenzo logo belongs to Zenzo, the photographs to Zenzo and/or their rights holders,
  the Bruges photograph to its photographer, and that nothing is claimed as the designer's own.
- **About:** body-copy spacing tightened; MUSIC / PEOPLE / ENERGY now sets each word and number over the foot of its photograph (graded, keylined, like the homepage
  VIP covers), with the line beneath.
- **VIP (mobile):** gaps between the three experiences reduced (~25%); images unchanged.
- **Contact:** compact banner, tighter section and enquiry-list spacing; content and layout unchanged.
- **Tooling:** `qa:links`; `.gitignore` rewritten (see README).

## Results
| Check | Result |
| --- | --- |
| Typecheck / lint | Pass / 0 warnings |
| Root build / Pages build | Pass — JS 382 kB (117 kB gzip) |
| Homepage suite, 6 widths | Clean (overflow, images, console, network, axe, VIP sync, disclaimer, menu, lightbox, reduced motion) |
| Pages suite, 36 page × width combinations | 36 / 36; 0 axe violations anywhere |
| Navigation, back/forward, mobile menu, direct visit + reload, `/gallery` redirect, `#anchor` on load, 404 | All pass under `/zenzo-redesign/` |
| Link audit | 0 problems: 6 internal targets all 200; every named link (5 pages, logo, footer nav, directions, official site) correct from the homepage and from a subpage; VIP, contact and Lost & Found enquiry links go to `zenzobar.be/#vip`, `#contact`, `#contact?type=lost-found`; all external links `https`, new tab, `noopener` |
| Pages readiness scan | Route files + `404.html` + `robots.txt` present; no localhost / dev paths / non-base-aware URLs / credentials in `dist-pages/`; no `.env` or key patterns in source |
| Reduced motion | Hero and title animations off, smooth scroll off |

## Remaining risks
1. Zenzo's logo and photographs: permission for this concept's public deployment was granted after this report (see P3).
2. Official deep links use the anchors zenzobar.be uses today; not fetched live in QA.
3. Client-rendered pages (fine under `noindex`; prerender for a real launch).
4. Safari, Firefox, a physical phone and a screen reader are untested.
5. The repository name must match the base path, or the build must be re-run with the real name.
