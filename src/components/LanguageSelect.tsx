import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { languages } from '../content/site'

/**
 * Language selector. The concept is English only for now, so NL and FR are
 * listed but disabled and marked "soon" — nothing here pretends to translate.
 */
export function LanguageSelect() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          root.current?.querySelector('button')?.focus()
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="EN, change language"
        onClick={() => setOpen((v) => !v)}
        className="eyebrow flex items-center gap-3 border border-line-strong px-3.5 py-2.5 text-bone transition-colors duration-500 hover:border-gold"
      >
        EN
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.25}
          className={`size-3.5 transition-transform duration-500 ease-out-expo ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          className="absolute right-0 top-full z-10 mt-2 min-w-40 border border-line-strong bg-coal py-1 motion-safe:animate-fade"
        >
          {languages.map((lang) => (
            <li key={lang.code}>
              {lang.available ? (
                <button
                  type="button"
                  aria-current="true"
                  onClick={() => setOpen(false)}
                  className="eyebrow flex w-full items-center justify-between px-4 py-2.5 text-gold-soft"
                >
                  {lang.code}
                  <span className="text-[0.625rem] normal-case tracking-normal text-mute">{lang.label}</span>
                </button>
              ) : (
                <span
                  aria-disabled="true"
                  className="eyebrow flex w-full items-center justify-between px-4 py-2.5 text-mute"
                >
                  {lang.code}
                  <span className="text-[0.625rem] normal-case tracking-normal">Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
