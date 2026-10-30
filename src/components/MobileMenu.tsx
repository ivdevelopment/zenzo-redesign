import { ArrowUpRight, X } from 'lucide-react'
import type { MouseEvent, Ref } from 'react'
import { languages, useCopy } from '../content/copy'
import { concept, navAll, venue } from '../content/site'
import { hrefFor, navigate, useLang, type RouteId } from '../lib/routing'
import { ConceptStrip } from './ConceptStrip'
import { Link } from './ui/Link'
import { Logo } from './ui/Logo'

type MobileMenuProps = {
  ref: Ref<HTMLDialogElement>
  current: RouteId
}

/**
 * Full-height navigation for small screens, built on the native <dialog>:
 * showModal() makes the rest of the page inert, traps focus, closes on Escape
 * and restores focus to the menu button on close.
 */
export function MobileMenu({ ref, current }: MobileMenuProps) {
  const { ui, navLabels } = useCopy()
  const lang = useLang()
  const target = current === 'not-found' ? 'home' : current
  const close = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.closest('dialog')?.close()
  }

  return (
    <dialog
      ref={ref}
      aria-label={ui.siteNavigation}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-bone open:animate-curtain"
    >
      <div className="flex h-full flex-col">
        <ConceptStrip showLink={false} />
        <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
          <Link to="home" onClick={close} aria-label={ui.homeLabel}>
            <Logo className="h-11" />
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label={ui.closeMenu}
            className="-mr-2 grid size-11 place-items-center"
            autoFocus
          >
            <X aria-hidden="true" className="size-6" strokeWidth={1} />
          </button>
        </div>

        <nav aria-label={ui.navMenu} className="container-x flex flex-1 flex-col justify-center overflow-y-auto py-6">
          <ol>
            {navAll.map((item, i) => (
              <li
                key={item}
                className="border-b border-line first:border-t motion-safe:animate-rise"
                style={{ animationDelay: `${100 + i * 50}ms` }}
              >
                <Link
                  to={item}
                  onClick={close}
                  aria-current={current === item ? 'page' : undefined}
                  className="group flex items-baseline gap-5 py-[clamp(0.5rem,1.7vh,0.9rem)]"
                >
                  <span className="eyebrow w-6 tabular-nums text-mute group-aria-[current=page]:text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display text-[clamp(1.9rem,8.5vw,2.75rem)] uppercase tracking-[0.04em] transition-colors duration-500 group-hover:text-gold-soft group-aria-[current=page]:text-gold-soft">
                    {navLabels[item]}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="container-x shrink-0 space-y-5 border-t border-line py-5">
          <p className="eyebrow flex items-center gap-4 text-smoke">
            <span className="sr-only">{ui.language}</span>
            {languages.map((option) => (
              <a
                key={option.code}
                href={hrefFor(target, option.lang)}
                lang={option.lang}
                hrefLang={option.lang}
                aria-current={option.lang === lang ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  close(event)
                  navigate(hrefFor(target, option.lang))
                }}
                className={option.lang === lang ? 'border-b border-gold pb-0.5 text-bone' : 'pb-0.5 text-smoke hover:text-bone'}
              >
                {option.code}
              </a>
            ))}
            <span className="ml-1 text-[0.625rem] normal-case tracking-normal text-mute">{ui.frSoon}</span>
          </p>
          <div className="flex items-end justify-between gap-6 text-sm text-smoke">
            <address className="not-italic leading-relaxed">
              {venue.street}
              <br />
              {venue.postcode} {venue.city}
            </address>
            <a
              href={concept.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow link-line inline-flex items-center gap-1 text-gold-soft"
            >
              {ui.officialSite} <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </dialog>
  )
}
