/**
 * Builds the responsive WebP images used by the site from assets-src/.
 *
 * Zenzo supplies four photographs. This script cuts each into the different
 * crops the layout needs and applies a colour grade to them — a luminance-based
 * gradient map into the brand's black / red / amber / champagne range. The
 * subject matter is untouched; only the colour is remapped (the originals are
 * violet, green and magenta). Set `grade: 'none'` on an entry to use the
 * original colours.
 *
 *   npm run assets          # (re)build everything
 *
 * Outputs: public/assets/<dir>/<key>-<width>.webp, public/assets/zenzo/logo.png,
 * and src/content/assets.generated.json (widths, size, average tone per image).
 */
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = (name: string) => join(root, 'assets-src', name)
const outRoot = join(root, 'public', 'assets')

type Rgb = [number, number, number]
type Stop = [number, Rgb]

/** Luminance → colour ramps. */
const ramps = {
  // Black → deep red → amber → champagne highlights: the club-lighting look.
  ember: [
    [0, [8, 7, 6]],
    [0.2, [44, 9, 9]],
    [0.42, [128, 24, 18]],
    [0.64, [214, 104, 38]],
    [0.84, [244, 196, 128]],
    [1, [255, 243, 224]],
  ],
  // Warm monochrome: near-black → bone, with a trace of gold in the mids.
  noir: [
    [0, [8, 7, 6]],
    [0.45, [98, 90, 78]],
    [0.8, [206, 196, 178]],
    [1, [245, 240, 230]],
  ],
  // Gold monochrome: black → bronze → champagne. A third look for the same four photographs.
  gilt: [
    [0, [8, 7, 6]],
    [0.3, [46, 30, 16]],
    [0.58, [150, 108, 58]],
    [0.82, [222, 190, 128]],
    [1, [250, 238, 212]],
  ],
} satisfies Record<string, Stop[]>

type Grade = keyof typeof ramps | 'none'

type Entry = {
  key: string
  from: string
  /** Crop as fractions of the source: left, top, width, height */
  crop: [number, number, number, number]
  grade: Grade
  widths: number[]
  /** Contrast lift applied before the ramp (1 = none) */
  contrast?: number
  /** Tone curve exponent; below 1 lifts the shadows and mids */
  gamma?: number
  /** 0–1: how much of the grade to apply over the original colours (default 1) */
  mix?: number
  /** Output folder under public/assets */
  dir?: 'zenzo' | 'stock'
}

const entries: Entry[] = [
  // Hero — the confetti crowd, graded ember. A square crop is used on phones.
  { key: 'hero', from: 'zenzo/example4.jpg', crop: [0, 0, 1, 1], grade: 'ember', widths: [640, 1024, 1617], gamma: 0.62 },
  { key: 'hero-m', from: 'zenzo/example4.jpg', crop: [0.36, 0, 0.5, 1], grade: 'ember', widths: [480, 808], gamma: 0.62 },

  // Atmosphere: one dominant frame in warm monochrome, one smaller ember inset.
  { key: 'atmo-main', from: 'zenzo/example3.jpg', crop: [0, 0, 1, 1], grade: 'noir', widths: [640, 1024, 1618], contrast: 1.15 },
  { key: 'atmo-inset', from: 'zenzo/example2.jpg', crop: [0.3, 0.02, 0.5, 0.78], grade: 'ember', widths: [480, 808] },

  // Gallery — dominant landscape frames, a narrow tall frame, a panorama and small details.
  { key: 'g1', from: 'zenzo/example1.jpg', crop: [0.34, 0, 0.3, 1], grade: 'ember', widths: [320, 484] },
  { key: 'g2', from: 'zenzo/example2.jpg', crop: [0.12, 0, 0.76, 0.92], grade: 'ember', widths: [640, 1000, 1231] },
  { key: 'g3', from: 'zenzo/example4.jpg', crop: [0, 0.3, 0.55, 0.7], grade: 'ember', widths: [640, 889], gamma: 0.62 },
  { key: 'g4', from: 'zenzo/example3.jpg', crop: [0.1, 0, 0.7, 0.85], grade: 'noir', widths: [640, 1000, 1133], contrast: 1.15 },
  { key: 'g5', from: 'zenzo/example1.jpg', crop: [0.46, 0, 0.3, 0.34], grade: 'ember', widths: [320, 484] },
  { key: 'g6', from: 'zenzo/example2.jpg', crop: [0.05, 0.42, 0.7, 0.5], grade: 'noir', widths: [640, 1000, 1134], contrast: 1.1 },

  // VIP panels — portrait crops, one per experience.
  { key: 'vip-bottle', from: 'zenzo/example1.jpg', crop: [0.27, 0, 0.47, 1], grade: 'ember', widths: [480, 760], gamma: 0.68 },
  { key: 'vip-lounge', from: 'zenzo/example2.jpg', crop: [0.18, 0, 0.47, 1], grade: 'ember', widths: [480, 760], gamma: 0.74 },
  { key: 'vip-party', from: 'zenzo/example4.jpg', crop: [0.53, 0, 0.47, 1], grade: 'ember', widths: [480, 760], gamma: 0.62 },

  // Location — Bruges stock photograph (the only non-Zenzo image), kept in its own folder.
  // Cinematic crop, graded two-thirds of the way into the ember range and darkened, so it
  // sits quietly beside the nightclub photography instead of competing with it.
  { key: 'city', from: 'stock/city.jpg', crop: [0, 0.16, 1, 0.6], grade: 'ember', widths: [640, 1024, 1600], dir: 'stock', mix: 0.62, gamma: 1.12, contrast: 1.1 },

  // ---- Inner pages -------------------------------------------------------------------
  // Page heroes — wide, low crops of the four photographs.
  { key: 'ph-gallery', from: 'zenzo/example2.jpg', crop: [0, 0.06, 1, 0.62], grade: 'ember', widths: [640, 1024, 1620] },
  { key: 'ph-vip', from: 'zenzo/example1.jpg', crop: [0, 0.04, 1, 0.72], grade: 'ember', widths: [640, 1024, 1613] },
  { key: 'ph-about', from: 'zenzo/example3.jpg', crop: [0, 0, 1, 0.7], grade: 'noir', widths: [640, 1024, 1618], contrast: 1.15 },
  { key: 'ph-lost', from: 'zenzo/example3.jpg', crop: [0, 0.5, 1, 0.5], grade: 'noir', widths: [640, 1024, 1618], contrast: 1.2, gamma: 0.8 },

  // Gallery page — twelve frames from the same four photographs, varied in ratio, crop and grade
  // (ember, black-and-white and gilt) so the repetition is hard to spot.
  { key: 'gal-ring-wide', from: 'zenzo/example2.jpg', crop: [0, 0, 1, 1], grade: 'ember', widths: [640, 1024, 1620] },
  { key: 'gal-bucket-tall', from: 'zenzo/example1.jpg', crop: [0.3, 0, 0.4, 1], grade: 'noir', widths: [480, 645], contrast: 1.15 },
  { key: 'gal-screen-detail', from: 'zenzo/example1.jpg', crop: [0.64, 0.55, 0.28, 0.32], grade: 'ember', widths: [452], gamma: 0.8 },
  { key: 'gal-confetti-pano', from: 'zenzo/example4.jpg', crop: [0, 0.12, 1, 0.56], grade: 'ember', widths: [640, 1024, 1617], gamma: 0.62 },
  { key: 'gal-ring-detail', from: 'zenzo/example2.jpg', crop: [0.34, 0.04, 0.36, 0.34], grade: 'gilt', widths: [480, 583] },
  { key: 'gal-lantern', from: 'zenzo/example3.jpg', crop: [0.1, 0, 0.5, 0.62], grade: 'gilt', widths: [640, 809], contrast: 1.15 },
  { key: 'gal-ceiling', from: 'zenzo/example3.jpg', crop: [0.38, 0.08, 0.55, 0.62], grade: 'ember', widths: [640, 890] },
  { key: 'gal-arms-noir', from: 'zenzo/example4.jpg', crop: [0.62, 0.18, 0.38, 0.82], grade: 'noir', widths: [480, 614], gamma: 0.7 },
  { key: 'gal-crowd-pano', from: 'zenzo/example3.jpg', crop: [0, 0.5, 1, 0.5], grade: 'noir', widths: [640, 1024, 1618], contrast: 1.2, gamma: 0.8 },
  { key: 'gal-railing', from: 'zenzo/example2.jpg', crop: [0.38, 0.48, 0.42, 0.5], grade: 'gilt', widths: [480, 680], gamma: 0.85 },
  { key: 'gal-laser-lines', from: 'zenzo/example2.jpg', crop: [0, 0, 0.5, 0.55], grade: 'ember', widths: [640, 810] },
  { key: 'gal-confetti-detail', from: 'zenzo/example4.jpg', crop: [0.42, 0.3, 0.3, 0.34], grade: 'ember', widths: [320, 485], gamma: 0.62 },

  // VIP page — larger crops than the homepage panels, for the full-size chapters.
  { key: 'vipp-bottle', from: 'zenzo/example1.jpg', crop: [0.22, 0, 0.56, 1], grade: 'ember', widths: [640, 903], gamma: 0.8 },
  { key: 'vipp-lounge', from: 'zenzo/example2.jpg', crop: [0.04, 0, 0.92, 0.96], grade: 'ember', widths: [640, 1000, 1490] },
  { key: 'vipp-party', from: 'zenzo/example4.jpg', crop: [0.3, 0, 0.7, 1], grade: 'ember', widths: [640, 1000, 1132], gamma: 0.62 },

  // Contact page — a tall Bruges crop, graded like the location band.
  { key: 'city-tall', from: 'stock/city.jpg', crop: [0.04, 0, 0.4, 1], grade: 'ember', widths: [480, 960], dir: 'stock', mix: 0.62, gamma: 1.12, contrast: 1.1 },
]

function ramp(stops: Stop[], t: number): Rgb {
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i]
    if (t <= t1) {
      const [t0, c0] = stops[i - 1]
      const k = (t - t0) / (t1 - t0)
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k]
    }
  }
  return stops[stops.length - 1][1]
}

async function gradeBuffer(
  input: Buffer,
  width: number,
  height: number,
  mode: Exclude<Grade, 'none'>,
  contrast: number,
  gamma: number,
  mix: number,
) {
  const { data } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const stops = ramps[mode]
  // 256-entry lookup, so grading costs one table read per pixel.
  const lut = Array.from({ length: 256 }, (_, i) => {
    const l = i / 255
    const curved = Math.min(1, Math.max(0, (l - 0.5) * contrast + 0.5))
    return ramp(stops, Math.pow(curved, gamma))
  })
  const out = Buffer.alloc(width * height * 3)
  for (let p = 0, o = 0; p < data.length; p += 3, o += 3) {
    const lum = (data[p] * 54 + data[p + 1] * 183 + data[p + 2] * 19) >> 8
    const c = lut[lum]
    out[o] = c[0] * mix + data[p] * (1 - mix)
    out[o + 1] = c[1] * mix + data[p + 1] * (1 - mix)
    out[o + 2] = c[2] * mix + data[p + 2] * (1 - mix)
  }
  return sharp(out, { raw: { width, height, channels: 3 } })
}

const manifest: Record<string, { widths: number[]; width: number; height: number; tone: string }> = {}
const wanted = new Map<string, Set<string>>()

for (const e of entries) {
  const dir = e.dir ?? 'zenzo'
  const meta = await sharp(src(e.from)).metadata()
  const [fl, ft, fw, fh] = e.crop
  const region = {
    left: Math.round(fl * meta.width!),
    top: Math.round(ft * meta.height!),
    width: Math.round(fw * meta.width!),
    height: Math.round(fh * meta.height!),
  }
  // Rounding can push the box one pixel past the edge.
  region.width = Math.min(region.width, meta.width! - region.left)
  region.height = Math.min(region.height, meta.height! - region.top)
  const cropped = await sharp(src(e.from)).extract(region).toBuffer()

  await mkdir(join(outRoot, dir), { recursive: true })
  const used: number[] = []
  for (const target of e.widths) {
    const w = Math.min(target, region.width) // never upscale
    const h = Math.round((w * region.height) / region.width)
    const resized = await sharp(cropped).resize(w, h, { kernel: 'lanczos3' }).toBuffer()
    const pipeline =
      e.grade === 'none' ? sharp(resized) : await gradeBuffer(resized, w, h, e.grade, e.contrast ?? 1.08, e.gamma ?? 0.92, e.mix ?? 1)
    const file = `${e.key}-${w}.webp`
    await pipeline.webp({ quality: w > 1000 ? 66 : 74, effort: 5 }).toFile(join(outRoot, dir, file))
    used.push(w)
    ;(wanted.get(dir) ?? wanted.set(dir, new Set()).get(dir)!).add(file)
  }
  const unique = [...new Set(used)]

  // Average colour, used as the placeholder behind the image while it loads.
  const { dominant } = await sharp(join(outRoot, dir, `${e.key}-${unique[0]}.webp`)).stats()
  const tone = '#' + [dominant.r, dominant.g, dominant.b].map((v) => Math.round(v * 0.55).toString(16).padStart(2, '0')).join('')

  manifest[e.key] = { widths: unique, width: region.width, height: region.height, tone }
  console.log(`${e.key.padEnd(11)} ${e.grade.padEnd(6)} ${region.width}x${region.height}  → ${unique.join(', ')}`)
}

// The logo: trim the transparent margin only — pixels are untouched.
await mkdir(join(outRoot, 'zenzo'), { recursive: true })
const logo = sharp(src('zenzo/logo.png')).trim({ threshold: 1 })
const logoInfo = await logo.clone().png({ compressionLevel: 9 }).toFile(join(outRoot, 'zenzo', 'logo.png'))
console.log(`logo        trimmed ${logoInfo.width}x${logoInfo.height}`)
await copyFile(src('zenzo/favicon-32x32.png'), join(outRoot, 'zenzo', 'favicon-32x32.png'))

// Prune stale variants
for (const [dir, files] of wanted) {
  for (const f of await readdir(join(outRoot, dir))) {
    if (f.endsWith('.webp') && !files.has(f)) await rm(join(outRoot, dir, f))
  }
}

await writeFile(
  join(root, 'src', 'content', 'assets.generated.json'),
  JSON.stringify({ logo: { width: logoInfo.width, height: logoInfo.height }, images: manifest }, null, 2) + '\n',
)
