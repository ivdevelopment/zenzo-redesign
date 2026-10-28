import { useState, type CSSProperties } from 'react'
import { gallerySequence, photos, type Photo } from '../content/photos'
import { gallery } from '../content/site'
import { Lightbox } from './Lightbox'
import { ArrowLink } from './ui/Buttons'
import { Picture } from './ui/Picture'
import { ClipFrame, LineReveal, Reveal } from './ui/Reveal'

type Tile = {
  photo: Photo
  /** Phones: a six-column grid. Frames either carry their own ratio or stretch to the row. */
  mobile: string
  /** From md: placement on a 12-column grid of two rows. */
  place: string
  sizes: string
}

/*
 * Two rows, three kinds of frame — two dominant landscapes, one narrow tall frame that
 * runs through both rows (set slightly lower, so the edge steps), and three small details:
 *
 *   ┌──────── g2 ────────┐ ┌ g1 ┐ ┌──── g4 ────┐
 *   │  dominant          │ │tall│ └────────────┘
 *   └────────────────────┘ │    │ ┌──── g3 ────┐
 *   ┌ g5 ┐ ┌──── g6 ─────┐ └────┘ └────────────┘
 *
 * DOM order is the viewer order (frames 1–6).
 */
const tiles: Tile[] = [
  {
    photo: photos.g2,
    mobile: 'col-span-6 aspect-[3/2]',
    place: 'md:col-span-6 md:col-start-1 md:row-start-1',
    sizes: '(min-width: 768px) 50vw, 100vw',
  },
  {
    photo: photos.g1,
    mobile: 'col-span-2 row-span-2',
    place: 'md:col-span-2 md:col-start-7 md:row-span-2 md:row-start-1 md:mt-[clamp(1rem,2.4vw,2.5rem)]',
    sizes: '(min-width: 768px) 17vw, 33vw',
  },
  {
    photo: photos.g4,
    mobile: 'col-span-4 aspect-[4/3]',
    place: 'md:col-span-4 md:col-start-9 md:row-start-1',
    sizes: '(min-width: 768px) 33vw, 66vw',
  },
  {
    photo: photos.g3,
    mobile: 'col-span-4 aspect-[16/9]',
    place: 'md:col-span-4 md:col-start-9 md:row-start-2',
    sizes: '(min-width: 768px) 33vw, 66vw',
  },
  {
    photo: photos.g5,
    mobile: 'col-span-2',
    place: 'md:col-span-2 md:col-start-1 md:row-start-2',
    sizes: '(min-width: 768px) 17vw, 33vw',
  },
  {
    photo: photos.g6,
    mobile: 'col-span-4 aspect-[16/9]',
    place: 'md:col-span-4 md:col-start-3 md:row-start-2',
    sizes: '(min-width: 768px) 33vw, 66vw',
  },
]

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-ink pt-9 md:pt-14">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow text-gold">{gallery.label}</p>
            </Reveal>
            <h2 id="gallery-title" className="display mt-3 text-[clamp(2rem,3.7vw,3.4rem)] uppercase leading-[1.02] tracking-[0.03em]">
              {gallery.headline.map((line, i) => (
                <LineReveal key={line} delay={i * 0.08}>
                  {line}
                </LineReveal>
              ))}
            </h2>
          </div>
          <Reveal className="pb-2">
            <ArrowLink to="gallery">
              <span className="sm:hidden">View all</span>
              <span className="hidden sm:inline">View full gallery</span>
            </ArrowLink>
          </Reveal>
        </div>

        <ClipFrame className="mt-6 md:mt-9">
          <ul
            className="grid grid-cols-6 gap-1.5 md:grid-cols-12 md:gap-3 md:[grid-template-rows:var(--r1)_var(--r2)]"
            style={{ '--r1': 'clamp(13rem, 21vw, 21rem)', '--r2': 'clamp(7.5rem, 11.5vw, 11.5rem)' } as CSSProperties}
          >
            {tiles.map((tile, i) => (
              <li key={tile.photo.key} className={`${tile.mobile} ${tile.place} md:aspect-auto`}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open image ${i + 1} of ${gallerySequence.length}: ${tile.photo.alt}`}
                  aria-haspopup="dialog"
                  className="group relative block h-full w-full overflow-hidden bg-coal after:absolute after:inset-2 after:border after:border-gold/0 after:transition-colors after:duration-[1200ms] after:ease-out-expo hover:after:border-gold/45 focus-visible:after:border-gold/45"
                >
                  <Picture
                    photo={tile.photo}
                    sizes={tile.sizes}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.85] transition-[transform,filter] duration-[1800ms] ease-out-expo group-hover:scale-[1.04] group-hover:brightness-100 group-focus-visible:brightness-100"
                  />
                  <span
                    aria-hidden="true"
                    className="eyebrow absolute bottom-4 left-4 !text-[0.625rem] translate-y-1 text-bone opacity-0 transition duration-700 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-md:hidden"
                  >
                    View
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </ClipFrame>
      </div>

      <Lightbox items={gallerySequence} index={open} onChange={setOpen} />
    </section>
  )
}
