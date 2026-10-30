import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { languages, useCopy } from '../content/copy'
import { hrefFor, navigate, useLang, useRoute } from '../lib/routing'

/**
 * Language selector. English and Dutch are real: each option links to the same page in the other
 * language. French is listed but disabled and marked "soon" — nothing here pretends to translate.
 */
export function LanguageSelect() {
  const lang = useLang()
  const route = useRoute()
  const { ui } = useCopy()
  const current = languages.find((l) => l.lang === lang)!
  const target = route === 'not-found' ? 'home' : route
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
        aria-label={ui.changeLanguage}
        onClick={() => setOpen((v) => !v)}
        className="eyebrow flex items-center gap-3 border border-line-strong px-3.5 py-2.5 text-bone transition-colors duration-500 hover:border-gold"
      >
        {current.code}
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
          {languages.map((option) => (
            <li key={option.code}>
              <a
                href={hrefFor(target, option.lang)}
                lang={option.lang}
                hrefLang={option.lang}
                aria-current={option.lang === lang ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  setOpen(false)
                  navigate(hrefFor(target, option.lang))
                }}
                className={`eyebrow flex w-full items-center justify-between px-4 py-2.5 transition-colors duration-500 hover:text-bone ${
                  option.lang === lang ? 'text-gold-soft' : 'text-smoke'
                }`}
              >
                {option.code}
                <span className="text-[0.625rem] normal-case tracking-normal text-mute">{option.label}</span>
              </a>
            </li>
          ))}
          <li>
            <span aria-disabled="true" className="eyebrow flex w-full items-center justify-between px-4 py-2.5 text-mute">
              FR
              <span className="text-[0.625rem] normal-case tracking-normal">{ui.soon}</span>
            </span>
          </li>
        </ul>
      )}
    </div>
  )
}
