# Zenzo redesign — design system (P0-03)

> Unofficial redesign concept — Not affiliated with Zenzo.

Rebuilt from the approved visual reference: a luxurious, image-driven nightclub site — black, warm bronze,
champagne gold, with red and amber supplied by the photography. The previous (editorial / violet) direction
was rejected and fully replaced.

## Mockup → page

| Mockup | Implementation |
| --- | --- |
| Thin header; logo centred; links split left / right; EN selector in a gold-bordered box | `Header.tsx` — 3-column grid. Left: Home, Gallery, VIP Experience. Centre: Zenzo logo. Right: About, Contact, Lost & Found, language selector. Gold underline draws in on hover and stays under the current section. Phones: logo left, three-line menu button, full-height menu (`MobileMenu.tsx`). |
| Fullscreen hero, ZENZO in gold, BRUGES / NIGHTLIFE / REDEFINED, MUSIC — PEOPLE — ENERGY, outlined CTA, address bottom right | `Hero.tsx` — graded confetti-crowd photograph fills the section; label top-left; ZENZO bottom-left in champagne gradient; outlined CTA; address with a vertical rule at right. Separate phone crop. |
| "More than a night out" editorial band | `Atmosphere.tsx` — noir photograph fading into the page behind a gold headline; stacked MUSIC / PEOPLE / ENERGY / ZENZO; ember inset overlapping the main frame; "About Zenzo" opens the venue's own description and published figures. |
| MOMENTS AT ZENZO + strip of varied-width images | `Gallery.tsx` — one edge-to-edge strip of six frames of different widths; the hovered frame widens. Phones: a compact six-column grid. Opens the lightbox. |
| A MORE EXCLUSIVE NIGHT on a bronze ground; three numbered photo panels | `Vip.tsx` — bronze gradient section; three panels with large number, serif title, round arrow. Inclusions slide up on hover or when opened. Phones: three rows that open to a larger photo and the inclusions. |
| Location photo + address + GET DIRECTIONS, then compact footer | `Contact.tsx` + `Footer.tsx` — Bruges photograph flush to the page edge beside the address headline; footer with logo, navigation, location, concept notice and credits. |

## Colour

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#080807` | Page background |
| `coal` | `#11100e` | Menus, panels |
| `bronze` / `bronze-deep` | `#281a13` / `#1b120d` | VIP section ground |
| `bone` | `#f1ece2` | Primary text |
| `smoke` | `#a9a39a` | Secondary text (≥ 7:1 on ink) |
| `mute` | `#857f75` | Captions, metadata on ink only (≥ 4.9:1) |
| `gold` | `#c8a978` | Rules, labels, hover fills, active states |
| `gold-soft` | `#e6d3a3` | Numbers, links on hover |
| `gold-text` | gradient `#f4e8c4 → #dcc28c → #b08f58` | ZENZO and the "More than a night out" headline only |
| `line` / `line-strong` | gold @ 20% / 42% | Hairline borders |

Red and amber appear only in the photographs. The real logo is a paler yellow-gold (`#E8D992`) than the UI gold;
it is used unaltered.

## Typography

Four candidates were rendered in the real treatments (hero wordmark at 118px, the gold headline, a panel title with
its number) on the page's black: Cormorant Garamond 300, Bodoni Moda 400, DM Serif Display 400 and Instrument Serif
(the previous iteration's face). **Cormorant Garamond** won: at light weight it has the thin, elegant capitals of the
reference and still holds at 13rem for the hero and 1.5rem for panel titles. Bodoni Moda was heavier and read as
fashion retail; DM Serif Display was far too bold; Instrument Serif was narrower and more modern-editorial than
luxurious. Cormorant defaults to old-style figures ("01" read as "o1"), so `display` forces lining numerals.

| Role | Face | Setting |
| --- | --- | --- |
| Display | Cormorant Garamond 300/400 | Hero: caps, 0.045em tracking, gold gradient. Section titles: caps, 0.03em. "More than a night out": mixed case, gold gradient. |
| Interface & body | Manrope (variable) | Labels `eyebrow`: 11px, 500, 0.24em tracking, caps. Body 15–17px, 1.55–1.7 leading. |

## Space & layout

- Gutter `clamp(1.25rem, 4.6vw, 5rem)`; max content 1680px.
- Section padding `clamp(3.5rem, 7vw, 6.5rem)` — about half of the previous iteration. Hero, atmosphere and gallery
  have tighter bespoke spacing.
- Hairlines, not boxes: 1px gold at 20% separates sections and rows. No rounded cards; the only round shapes are the VIP
  arrow buttons.

## Motion

Slow, one-time, quiet. Hero photograph settles from 110% to 100% over 3.2s; hero title and section headlines rise
out of a mask; images unveil with a clip wipe; the gold underline in the nav draws in; the gallery strip widens the
hovered frame; VIP inclusions slide up. No parallax, no loops except the small scroll cue. Under
`prefers-reduced-motion`: Motion drops transforms, CSS animations and transitions are neutralised, smooth scrolling is
off, and the image wipes are skipped.

## Concept safeguards

- Disclaimer strip above the header at every scroll position (sentence case, 11px, wraps rather than truncates),
  repeated in the mobile menu and footer.
- Facts only from zenzobar.be: address, VIP services and inclusions, "Established 2025 / 3 VIP areas / 280+ capacity",
  the description of sound, lighting and DJ talent. Left out: opening hours (conflicting NL/EN), email, phone, prices,
  DJs, events.
- No booking, payment, contact form or analytics. `noindex, nofollow` meta and `robots.txt`.
- Language selector lists NL and FR as disabled ("soon") — nothing pretends to be translated.

## P0-04 polish

Same identity; every section was tuned to read as art direction rather than components.

- **Hero** — label, wordmark, tagline and action are one cluster at the foot of the photograph. The label and the
  address share a gold keyline; the wordmark's champagne gradient deepens toward its baseline so it settles into the
  crowd. Title size unchanged. Phones: ~10% shorter, cluster anchored to the bottom, no empty band above it.
- **Gallery** — two rows built from three kinds of frame: two dominant landscapes, one narrow tall frame (set lower, so
  the top edge steps) and three small details; the largest frame is ~5.7× the area of the smallest. Phones: a six-column
  grid mixing a full-width frame, a tall narrow frame beside two stacked frames, then a small + wide pair.
- **VIP** — covers, not cards: keylined photograph, number as masthead, title at the foot, a ruled "What's included"
  line with a small arrow instead of a button. Inclusions rise from behind the title on hover. Phones: three
  photographic banners with the number and title across them; they open to a ruled list.
- **Atmosphere** — the copy's last line, the motif and the overlapping inset share one baseline; the inset crosses the
  photograph's edge by a fixed amount; the motif has a gold spine like the hero label.
- **Location** — cinematic 2.5:1 crop, graded 62% toward ember and darkened; the image runs off the left edge and
  dissolves under the address. Caption is small and shadowed.
- **Footer** — logo and navigation on one line; location and the concept notice side by side; credits last. Thin rules
  only. Social links removed. The disclaimer remains full-strength bone.
- **Type** — section headlines share one scale (`clamp(2.1rem, 3.7vw, 3.4rem)`, 1.02 leading, 0.03em tracking);
  gold is reserved for labels, numerals and the two gradient headlines.
- **Motion** — slower, quieter: gallery image scale 1.8s with a keyline that fades in; VIP image scale 1.8s and
  keyline brighten; CTA fill 700ms. Nothing new was added.
- **Bug fixed** — the Bruges photographer's name had been dropped by the image manifest (caption and credits showed a
  blank name). Now covered by a QA check.

## P1 — inner pages

All pages reuse the homepage system: Header, MobileMenu, ConceptStrip, Footer, LanguageSelect, Lightbox, the colour and type tokens, LineReveal / ClipFrame /
Reveal and OutlineButton / ArrowLink. The one new shared component is PageHero — the homepage hero's language in a shorter format (graded photograph, keylined
label, champagne title, short intro). No page has its own palette or type.

| Page | Route | Composition |
| --- | --- | --- |
| Gallery | /gallery/ | Twelve frames in six movements: a dominant landscape with a tall frame set lower and a small detail; a full-width panorama; a statement line with a gold detail; three frames of different widths, ratios and heights; a second full-width panorama (black-and-white); a closing trio. Frames are ember, black-and-white or gilt so the four photographs do not read as repeats. 11 distinct frame sizes. Opens the existing lightbox (12 frames). |
| VIP Experience | /vip/ | Bronze ground like the homepage VIP section. Three full-size chapters (01 Bottle Service, 02 Private Lounge, 03 Private Party), each a keylined photograph beside a masthead number, a large serif title, the venue's own description and its three inclusions as ruled rows, and a link to the official site. The three layouts differ (different sides, column splits and ratios) so they do not read as a template. Closing band: "Three experiences. One place to enquire." |
| About | /about/ | Oversized statement; black-and-white photograph with an ember inset crossing its corner beside two short paragraphs; MUSIC / PEOPLE / ENERGY as three framed images with one line each; the published figures; a Bruges band with the credited canal photograph. |
| Contact | /contact/ | The Bruges photograph as a banner and again as a framed tall crop; the address as the headline, directions, and a ruled "where to ask" list routing general enquiries, VIP and Lost & Found to the official site, with opening hours deferred to it. |
| Lost & Found | /lost-found/ | Deliberately minimal: a shorter banner, one statement, three ruled steps on the official site, one button. |
| 404 | any other path | Same banner and a button home. |

Copy for every page is in src/content/pages.ts; facts are worded close to zenzobar.be and nothing names an event, DJ, date, price or hour.

### Routing

Real paths, not hashes. src/lib/routing.ts is a ~60-line History-API router (useSyncExternalStore); <Link> renders an ordinary <a href> (so it opens in a new
tab, can be copied and works with modifier keys) and navigates client-side on a plain click. Everything resolves against Vite's BASE_URL, so the same code runs
at / and at /<repo>/.

GitHub Pages cannot rewrite URLs, so vite.config.ts (plugin zenzo-static-routes) writes a copy of index.html into gallery/, vip/, about/, contact/ and
lost-found/, plus 404.html (also the app shell, which renders the 404 page). A direct visit, a refresh or a shared link therefore loads the right page with no
redirect script, and Pages' own trailing-slash redirect handles /gallery. To add a route: add it to routes (routing.ts) and routePaths (vite.config.ts), plus a
page component and a nav entry.

Why not React Router or hash routing: the site is five static pages; a router library would add weight for behaviour a 60-line router already has, and hash
routing would collide with in-page anchors and give ugly shared URLs.

On a page change the router updates document.title, scrolls to the top (or to the #anchor, including on a direct visit), and moves focus to <main>.
