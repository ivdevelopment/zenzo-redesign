import { useState } from 'react'
import { Lightbox } from '../components/Lightbox'
import { PageHero } from '../components/PageHero'
import { ArrowLink } from '../components/ui/Buttons'
import { Picture } from '../components/ui/Picture'
import { ClipFrame, Reveal } from '../components/ui/Reveal'
import { type Photo, photos } from '../content/photos'
import { altFor, fmt, useCopy } from '../content/copy'
import { useLang } from '../lib/routing'

/** The viewer order is the page order, top to bottom. */
const sequence: Photo[] = [
  photos.galRingWide,
  photos.galBucketTall,
  photos.galScreenDetail,
  photos.galConfettiPano,
  photos.galRingDetail,
  photos.galLantern,
  photos.galCeiling,
  photos.galArmsNoir,
  photos.galCrowdPano,
  photos.galRailing,
  photos.galLaserLines,
  photos.galConfettiDetail,
]

const at = (photo: Photo) => sequence.indexOf(photo)

type FrameProps = {
  photo: Photo
  sizes: string
  /** Frame ratio and stretch rules, per breakpoint */
  frame: string
  onOpen: (index: number) => void
  /** Hover-only caption — a quiet "View" */
  label?: boolean
}

/** One framed photograph that opens the viewer. */
function Frame({ photo, sizes, frame, onOpen, label = true }: FrameProps) {
  const { ui } = useCopy()
  const lang = useLang()
  const index = at(photo)
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={fmt(ui.openImage, { n: index + 1, total: sequence.length, alt: altFor(photo, lang) })}
      aria-haspopup="dialog"
      className={`group relative block w-full overflow-hidden bg-coal after:absolute after:inset-2 after:border after:border-gold/0 after:transition-colors after:duration-[1200ms] after:ease-out-expo hover:after:border-gold/45 focus-visible:after:border-gold/45 ${frame}`}
    >
      <Picture
        photo={photo}
        sizes={sizes}
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.88] transition-[transform,filter] duration-[1800ms] ease-out-expo group-hover:scale-[1.04] group-hover:brightness-100 group-focus-visible:brightness-100"
      />
      {label && (
        <span
          aria-hidden="true"
          className="eyebrow absolute bottom-4 left-4 !text-[0.625rem] translate-y-1 text-bone opacity-0 transition duration-700 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-md:hidden"
        >
          {ui.view}
        </span>
      )}
    </button>
  )
}

export function GalleryPage() {
  const { galleryPage, ui } = useCopy()
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <PageHero
        label={galleryPage.label}
        title={galleryPage.title}
        intro={galleryPage.intro}
        photo={photos.pageGallery}
        focus="object-[50%_35%]"
      />

      <section aria-label={ui.photographs} className="bg-ink pb-10 pt-8 md:pb-16 md:pt-12">
        {/* I — one dominant landscape, a tall black-and-white frame set lower, a small detail on the baseline */}
        <div className="container-x">
          <ClipFrame>
            <ul className="grid grid-cols-6 gap-1.5 md:grid-cols-12 md:items-start md:gap-4">
              <li className="col-span-6 md:col-span-7">
                <Frame photo={photos.galRingWide} sizes="(min-width: 768px) 56vw, 100vw" frame="aspect-[3/2] md:aspect-[16/10]" onOpen={setOpen} />
              </li>
              <li className="col-span-4 md:col-span-3 md:mt-[clamp(2rem,6vw,6rem)]">
                <Frame photo={photos.galBucketTall} sizes="(min-width: 768px) 24vw, 66vw" frame="aspect-[4/5] md:aspect-[3/4]" onOpen={setOpen} />
              </li>
              <li className="col-span-2 md:col-span-2 md:self-end">
                <Frame photo={photos.galScreenDetail} sizes="(min-width: 768px) 16vw, 33vw" frame="h-full md:h-auto md:aspect-square" onOpen={setOpen} label={false} />
              </li>
            </ul>
          </ClipFrame>
        </div>

        {/* A full-width moment: runs edge to edge */}
        <ClipFrame className="mt-1.5 md:mt-16">
          <ul>
            <li>
              <Frame photo={photos.galConfettiPano} sizes="100vw" frame="aspect-[2.2/1] md:aspect-[3.2/1]" onOpen={setOpen} />
            </li>
          </ul>
        </ClipFrame>

        {/* Statement — the page's negative space, with one gold detail */}
        <div className="container-x my-8 grid items-end gap-6 md:my-20 md:grid-cols-12 md:gap-x-6">
          <Reveal className="md:col-span-7">
            <p className="eyebrow text-gold">{galleryPage.statementLabel}</p>
            <p className="display mt-4 text-[clamp(2.1rem,4.6vw,4.25rem)] leading-[1.02] tracking-[0.01em] text-bone">
              {galleryPage.statement[0]} <em className="text-gold-soft">{galleryPage.statement[1]}</em>
            </p>
          </Reveal>
          <ClipFrame className="md:col-span-3 md:col-start-10">
            <Frame photo={photos.galRingDetail} sizes="(min-width: 768px) 24vw, 66vw" frame="aspect-[4/3]" onOpen={setOpen} label={false} />
          </ClipFrame>
        </div>

        {/* II — three frames of different widths and ratios, the last set higher */}
        <div className="container-x">
          <ClipFrame>
            <ul className="grid grid-cols-6 gap-1.5 md:grid-cols-12 md:items-start md:gap-4">
              <li className="col-span-2 md:col-span-4 md:mt-[clamp(1rem,4vw,4rem)]">
                <Frame photo={photos.galLantern} sizes="(min-width: 768px) 32vw, 33vw" frame="h-full md:h-auto md:aspect-[4/3]" onOpen={setOpen} />
              </li>
              <li className="col-span-4 md:col-span-5">
                <Frame photo={photos.galCeiling} sizes="(min-width: 768px) 42vw, 66vw" frame="aspect-[4/3] md:aspect-[16/10]" onOpen={setOpen} />
              </li>
              <li className="col-span-6 md:col-span-3 md:-mt-[clamp(0rem,2vw,2rem)]">
                <Frame photo={photos.galArmsNoir} sizes="(min-width: 768px) 24vw, 100vw" frame="aspect-[16/9] md:aspect-[3/4]" onOpen={setOpen} />
              </li>
            </ul>
          </ClipFrame>
        </div>

        {/* A second full-width moment, in black and white */}
        <ClipFrame className="mt-1.5 md:mt-16">
          <ul>
            <li>
              <Frame photo={photos.galCrowdPano} sizes="100vw" frame="aspect-[2.2/1] md:aspect-[3.6/1]" onOpen={setOpen} />
            </li>
          </ul>
        </ClipFrame>

        {/* III — closing trio, details */}
        <div className="container-x mt-1.5 md:mt-4">
          <ClipFrame>
            <ul className="grid grid-cols-6 gap-1.5 md:grid-cols-12 md:items-end md:gap-4">
              <li className="col-span-4 md:col-span-5">
                <Frame photo={photos.galRailing} sizes="(min-width: 768px) 42vw, 66vw" frame="aspect-[4/3] md:aspect-[3/2]" onOpen={setOpen} />
              </li>
              <li className="col-span-2 md:col-span-3 md:mb-[clamp(1rem,4vw,4rem)]">
                <Frame photo={photos.galLaserLines} sizes="(min-width: 768px) 24vw, 33vw" frame="h-full md:h-auto md:aspect-[4/5]" onOpen={setOpen} />
              </li>
              <li className="col-span-6 md:col-span-4">
                <Frame photo={photos.galConfettiDetail} sizes="(min-width: 768px) 32vw, 100vw" frame="aspect-[16/7] md:aspect-[3/2]" onOpen={setOpen} />
              </li>
            </ul>
          </ClipFrame>
        </div>

        <div className="container-x mt-6 flex flex-col gap-5 border-t border-line pt-5 md:mt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[60ch] text-[0.8125rem] leading-relaxed text-mute">{galleryPage.note}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <ArrowLink to="vip">{ui.theVipExperience}</ArrowLink>
            <ArrowLink to="contact">{ui.visitDirections}</ArrowLink>
          </div>
        </div>
      </section>

      <Lightbox items={sequence} index={open} onChange={setOpen} />
    </>
  )
}
