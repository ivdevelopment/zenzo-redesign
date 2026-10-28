import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { photoSrcSet, type Photo } from '../content/photos'
import { Picture } from './ui/Picture'

type LightboxProps = {
  items: Photo[]
  /** Index of the open image, or null when closed. */
  index: number | null
  onChange: (index: number | null) => void
}

const pageButton =
  'grid size-12 place-items-center border border-line-strong transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink'

/**
 * Accessible image viewer on the native <dialog>: focus is contained and
 * returned to the triggering tile, Escape closes, arrow keys and swipes page.
 */
export function Lightbox({ items, index, onChange }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const open = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Warm the cache for neighbours so paging feels instant.
  useEffect(() => {
    if (index === null) return
    for (const offset of [-1, 1]) {
      const photo = items[(index + offset + items.length) % items.length]
      const img = new Image()
      img.sizes = '90vw'
      img.srcset = photoSrcSet(photo)
    }
  }, [index, items])

  const step = (delta: number) => {
    if (index === null) return
    onChange((index + delta + items.length) % items.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') step(1)
    if (event.key === 'ArrowLeft') step(-1)
  }

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const dx = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
  }

  const photo = index !== null ? items[index] : null

  return (
    <dialog
      ref={dialogRef}
      aria-label="Gallery viewer"
      onClose={() => onChange(null)}
      onKeyDown={onKeyDown}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-bone open:animate-fade"
    >
      {photo && index !== null && (
        <div className="flex h-full flex-col">
          <div className="container-x flex h-16 shrink-0 items-center justify-between border-b border-line">
            <p className="eyebrow tabular-nums text-smoke" aria-live="polite">
              <span className="text-gold-soft">{String(index + 1).padStart(2, '0')}</span>
              <span className="mx-2 text-mute">/</span>
              {String(items.length).padStart(2, '0')}
            </p>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="eyebrow -mr-2 flex items-center gap-2 px-2 py-3"
              autoFocus
            >
              Close <X aria-hidden="true" className="size-4" strokeWidth={1.25} />
            </button>
          </div>

          <figure
            className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 touch-pan-y md:px-24"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <Picture
              key={photo.key}
              photo={photo}
              priority
              sizes="90vw"
              className="max-h-full w-auto max-w-full select-none object-contain motion-safe:animate-fade"
              draggable={false}
            />
          </figure>

          <div className="container-x flex shrink-0 flex-col gap-4 border-t border-line py-5 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[64ch] text-sm leading-relaxed text-smoke">
              {photo.alt}.{' '}
              <span className="text-mute">
                {photo.credit
                  ? `Photograph by ${photo.credit.name} on Unsplash.`
                  : 'Photograph from zenzobar.be, colour-graded for this concept.'}
              </span>
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} className={pageButton} aria-label="Previous image">
                <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.25} />
              </button>
              <button type="button" onClick={() => step(1)} className={pageButton} aria-label="Next image">
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
