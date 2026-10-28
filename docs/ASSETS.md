# Asset inventory & provenance

> Unofficial redesign concept — Not affiliated with Zenzo.

Reviewed and downloaded on **2026-10-28**. Nothing is hotlinked at runtime: every file below is served from
`public/assets/`. Re-create everything with:

```bash
npm run assets:fetch   # download sources into assets-src/ (git-ignored)
npm run assets         # crop, grade and resize into public/assets/ + src/content/assets.generated.json
```

## Rights

- **Zenzo logo and photographs** belong to Zenzo. They were taken from the public website zenzobar.be to
  build this unofficial portfolio concept. Permission to use the logo and website photography in this concept, including
  its public GitHub Pages deployment, has been granted. This concept claims no ownership of them.
- **One image is not Zenzo's** — the Bruges canal photograph (see below), used under the Unsplash License.

## Zenzo assets (source: zenzobar.be)

Zenzo's site has exactly one logo file and **four** photographs. (The photographs are literally named
`example1–4.jpg` on the live site, so they may be placeholders there too.) All other imagery on the concept is
a crop of these four.

| Source URL | Local source (git-ignored) | Original size | Notes |
| --- | --- | --- | --- |
| https://zenzobar.be/images/logo.png | `assets-src/zenzo/logo.png` | 500 × 500 PNG, transparent | Pale gold (≈ `#E8D992`). Stacked monogram + wordmark. |
| https://zenzobar.be/images/example1.jpg | `assets-src/zenzo/example1.jpg` | 1613 × 904 | Ice bucket held aloft with a sparkler, over the crowd |
| https://zenzobar.be/images/example2.jpg | `assets-src/zenzo/example2.jpg` | 1620 × 923 | Ring-shaped lighting rig, lasers, two guests at a railing |
| https://zenzobar.be/images/example3.jpg | `assets-src/zenzo/example3.jpg` | 1618 × 921 | Mirror ceiling and lantern fixture over a crowd |
| https://zenzobar.be/images/example4.jpg | `assets-src/zenzo/example4.jpg` | 1617 × 914 | Dance floor, raised hands, falling confetti |
| https://zenzobar.be/images/favicon_io/favicon-32x32.png | `assets-src/zenzo/favicon-32x32.png` | 32 × 32 | Used as the tab icon |

### The logo

`public/assets/zenzo/logo.png` is the official file with **only its transparent margin trimmed** (500 × 500 →
419 × 340). Pixels are untouched: not recoloured, redrawn, stretched or re-proportioned. It is shown at its
native aspect ratio (`width: auto`). It is the only logo variant the site publishes; its pale-gold line work
suits the dark background as-is.

### Crops and colour grade

The originals are violet, green and magenta. To fit the dark / red-amber / champagne direction, each crop is run
through a **luminance-based colour grade** (`scripts/build-assets.ts`): either `ember` (black → deep red → amber →
champagne) or `noir` (warm monochrome). Only colour is remapped — composition and subject matter are untouched.
This is a design treatment; set `grade: 'none'` on an entry to use the original colours.

Output files are `public/assets/zenzo/<key>-<width>.webp` (widths never exceed the crop's real pixel width — no
upscaling).

| Key | Source | Crop (left, top, width, height) | Grade | Output size | Used in |
| --- | --- | --- | --- | --- | --- |
| `hero` | example4 | full frame | ember (lifted) | 1617 × 914 | Hero, desktop/tablet |
| `hero-m` | example4 | 0.36, 0, 0.50, 1 | ember (lifted) | 808 × 914 | Hero, phones (< 768px) |
| `atmo-main` | example3 | full frame | noir | 1618 × 921 | Atmosphere — dominant photograph; viewer frame 7 |
| `atmo-inset` | example2 | 0.30, 0.02, 0.50, 0.78 | ember | 808 × 720 | Atmosphere — overlapping inset |
| `g2` | example2 | 0.12, 0, 0.76, 0.92 | ember | 1231 × 849 | Gallery 1 — dominant landscape |
| `g1` | example1 | 0.34, 0, 0.30, 1 | ember | 484 × 904 | Gallery 2 — narrow tall frame |
| `g4` | example3 | 0.10, 0, 0.70, 0.85 | noir | 1133 × 783 | Gallery 3 — second dominant frame |
| `g3` | example4 | 0, 0.30, 0.55, 0.70 | ember (lifted) | 889 × 640 | Gallery 4 |
| `g5` | example1 | 0.46, 0, 0.30, 0.34 | ember | 484 × 307 | Gallery 5 — detail |
| `g6` | example2 | 0.05, 0.42, 0.70, 0.50 | noir | 1134 × 462 | Gallery 6 — panorama |
| `vip-bottle` | example1 | 0.27, 0, 0.47, 1 | ember (lifted) | 758 × 904 | VIP 01 — Bottle Service |
| `vip-lounge` | example2 | 0.18, 0, 0.47, 1 | ember (lifted) | 760 × 923 | VIP 02 — Private Lounge |
| `vip-party` | example4 | 0.53, 0, 0.47, 1 | ember (lifted) | 760 × 914 | VIP 03 — Private Party |
| `logo` | logo.png | trim margin only | none | 419 × 340 | Header, mobile menu, footer |

**Inner pages (P1).** Same four photographs, new crops; a third grade, `gilt` (black → bronze → champagne), was added so the
repetition is hard to see. All output sizes are real crop widths — no upscaling.

| Key | Source | Grade | Output | Used in |
| --- | --- | --- | --- | --- |
| `ph-gallery` | example2 | ember | 1620 × 572 | Gallery page banner |
| `ph-vip` | example1 | ember | 1613 × 651 | VIP page banner |
| `ph-about` | example3 | noir | 1618 × 645 | About page banner |
| `ph-lost` | example3 (lower half) | noir | 1618 × 460 | Lost & Found banner; 404 page |
| `gal-ring-wide` | example2 | ember | 1620 × 923 | Gallery 1 (dominant) |
| `gal-bucket-tall` | example1 | noir | 645 × 904 | Gallery 2 |
| `gal-screen-detail` | example1 | ember | 452 × 289 | Gallery 3 (detail) |
| `gal-confetti-pano` | example4 | ember (lifted) | 1617 × 512 | Gallery 4 (full width) |
| `gal-ring-detail` | example2 | gilt | 583 × 314 | Gallery 5; About “Music” |
| `gal-lantern` | example3 | gilt | 809 × 571 | Gallery 6 |
| `gal-ceiling` | example3 | ember | 890 × 571 | Gallery 7 |
| `gal-arms-noir` | example4 | noir | 614 × 749 | Gallery 8; About “People” |
| `gal-crowd-pano` | example3 (lower half) | noir | 1618 × 460 | Gallery 9 (full width) |
| `gal-railing` | example2 | gilt | 680 × 462 | Gallery 10 |
| `gal-laser-lines` | example2 | ember | 810 × 508 | Gallery 11; About “Energy” |
| `gal-confetti-detail` | example4 | ember (lifted) | 485 × 311 | Gallery 12 |
| `vipp-bottle` / `vipp-lounge` / `vipp-party` | example1 / 2 / 4 | ember | 903 × 904 / 1490 × 886 / 1132 × 914 | VIP page chapters 01–03 |
| `city-tall` (`stock/`) | Cedric Letsch (Unsplash) | ember 62% | 960 × 1600 | Contact and About pages (credited) |

The gallery viewer on the homepage shows the six tiles in DOM order (g2, g1, g4, g3, g5, g6), then `atmo-main` and `hero` (8 frames).

> Captions and alt text describe what a picture shows. None claims a particular room, table or event. The VIP
> photographs are crops of Zenzo's own photos and are **not** labelled as a specific VIP area, because the site does
> not say which area any photo shows.

## Non-Zenzo asset

| Source | Local source | Original | Licence | Used in |
| --- | --- | --- | --- | --- |
| [Cedric Letsch on Unsplash](https://unsplash.com/photos/Tp5qZakZUrg) — Bruges canal at night | `assets-src/stock/city.jpg` | 2400 × 1600 (as fetched) | [Unsplash License](https://unsplash.com/license) | Contact / location band (`public/assets/stock/city-*.webp`; 2400 × 960 cinematic crop, graded 62% toward the ember range and darkened so it stays secondary to the nightclub photography) |

Zenzo's website has no location or exterior photography, so this is the one stock image. It is captioned
"Illustrative · Cedric Letsch / Unsplash" in the page and credited in the footer.

## Typefaces & icons

- **Cormorant Garamond** (display) — SIL OFL 1.1, via Fontsource.
- **Manrope** (interface and body) — SIL OFL 1.1, via Fontsource.
- **Lucide** icons — ISC.

Fonts are self-hosted; no third-party font requests.
