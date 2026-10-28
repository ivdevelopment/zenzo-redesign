/**
 * Image manifest.
 *
 * Almost every image is one of Zenzo's four own photographs, taken from the
 * public zenzobar.be website and cut into different crops (see docs/ASSETS.md).
 * They are colour-graded for this concept by scripts/build-assets.ts.
 *
 * The single exception is the Bruges canal photograph in the location panel: Zenzo's
 * site has no location imagery, so a free-licence stock photograph (Unsplash) is
 * used and credited. Widths, dimensions and tones come from the build script's
 * output, src/content/assets.generated.json.
 */
import generated from './assets.generated.json'

export type Credit = {
  name: string
  profileUrl: string
  pageUrl: string
}

export type Photo = {
  key: string
  /** Folder under /assets */
  dir: 'zenzo' | 'stock'
  alt: string
  widths: number[]
  /** Pixel size of the largest variant — also the aspect ratio */
  width: number
  height: number
  /** Dark average colour shown behind the image while it loads */
  tone: string
  /** Present only for non-Zenzo imagery */
  credit?: Credit
}

type Key = keyof typeof generated.images

function make(key: Key, alt: string, extra: { dir?: Photo['dir']; credit?: Credit } = {}): Photo {
  const meta = generated.images[key]
  return { key, dir: extra.dir ?? 'zenzo', alt, ...meta, credit: extra.credit }
}

export const photos = {
  hero: make('hero', 'The crowd on Zenzo’s dance floor, hands raised as confetti falls under red light'),
  heroMobile: make('hero-m', 'Raised arms in the crowd as confetti falls beneath the club lighting'),
  atmoMain: make('atmo-main', 'Silhouetted guests beneath a mirrored ceiling and lantern-shaped light fittings, in black and white'),
  atmoInset: make('atmo-inset', 'A ring of light and moving heads above the club floor'),

  g1: make('g1', 'A sparkler flaring above an ice bucket held high over the crowd'),
  g2: make('g2', 'A ring-shaped lighting rig and laser lines above the dance floor, seen from a balcony'),
  g3: make('g3', 'A raised arm in the crowd as confetti falls'),
  g4: make('g4', 'A mirror ceiling and a lantern-shaped fitting above the crowd, in black and white'),
  g5: make('g5', 'Close-up of a sparkler flaring above the ice bucket'),
  g6: make('g6', 'Two guests at a railing overlooking the floor, in black and white'),

  vipBottle: make('vip-bottle', 'An ice bucket with a sparkler, held aloft'),
  vipLounge: make('vip-lounge', 'Guests at a railing beneath the ring lighting'),
  vipParty: make('vip-party', 'Raised arms and falling confetti'),

  // Inner pages
  pageGallery: make('ph-gallery', 'A ring of light and laser lines above the dance floor'),
  pageVip: make('ph-vip', 'A sparkler flaring above an ice bucket held high over the crowd'),
  pageAbout: make('ph-about', 'A crowd beneath a mirrored ceiling and lantern-shaped fittings, in black and white'),
  pageLost: make('ph-lost', 'Silhouetted guests in a dim room, in black and white'),

  galRingWide: make('gal-ring-wide', 'The ring-shaped lighting rig and laser lines above the dance floor, seen from a balcony'),
  galBucketTall: make('gal-bucket-tall', 'An ice bucket with a sparkler held aloft, in black and white'),
  galScreenDetail: make('gal-screen-detail', 'A hexagonal light pattern glowing through haze'),
  galConfettiPano: make('gal-confetti-pano', 'Confetti falling over the crowd beneath the lit ceiling'),
  galRingDetail: make('gal-ring-detail', 'A moving head and the lit ring above it, in gold'),
  galLantern: make('gal-lantern', 'A lantern-shaped light fitting and mirrored ceiling, in gold'),
  galCeiling: make('gal-ceiling', 'Light beams crossing a mirrored ceiling'),
  galArmsNoir: make('gal-arms-noir', 'A raised fist in the crowd, in black and white'),
  galCrowdPano: make('gal-crowd-pano', 'Silhouettes in the crowd, in black and white'),
  galRailing: make('gal-railing', 'A balcony railing above the dance floor, in gold'),
  galLaserLines: make('gal-laser-lines', 'Laser lines sweeping across the ceiling'),
  galConfettiDetail: make('gal-confetti-detail', 'Confetti in the air above the crowd'),

  vipBottlePage: make('vipp-bottle', 'An ice bucket with a sparkler, held aloft above the crowd'),
  vipLoungePage: make('vipp-lounge', 'Guests at a railing beneath a ring of light and laser lines'),
  vipPartyPage: make('vipp-party', 'Raised arms and falling confetti on the dance floor'),

  cityTall: make('city-tall', 'Gabled brick buildings lit at night along a Bruges canal', {
    dir: 'stock',
    credit: {
      name: 'Cedric Letsch',
      profileUrl: 'https://unsplash.com/@cedricletsch',
      pageUrl: 'https://unsplash.com/photos/Tp5qZakZUrg',
    },
  }),

  city: make('city', 'Gabled brick buildings and a belfry along a Bruges canal at night', {
    dir: 'stock',
    credit: {
      name: 'Cedric Letsch',
      profileUrl: 'https://unsplash.com/@cedricletsch',
      pageUrl: 'https://unsplash.com/photos/Tp5qZakZUrg',
    },
  }),
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos

export function photoFile(photo: Photo, width: number) {
  return `${import.meta.env.BASE_URL}assets/${photo.dir}/${photo.key}-${width}.webp`
}

export function photoSrcSet(photo: Photo) {
  return photo.widths.map((w) => `${photoFile(photo, w)} ${w}w`).join(', ')
}

export const logo = {
  src: `${import.meta.env.BASE_URL}assets/zenzo/logo.png`,
  width: generated.logo.width,
  height: generated.logo.height,
}

/** The frames shown in the viewer, in order: the six gallery tiles (in DOM order), then two larger frames. */
export const gallerySequence: Photo[] = [
  photos.g2,
  photos.g1,
  photos.g4,
  photos.g3,
  photos.g5,
  photos.g6,
  photos.atmoMain,
  photos.hero,
]
