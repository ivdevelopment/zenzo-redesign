import { useRef } from 'react'
import { useCopy } from '../content/copy'
import { navLayout } from '../content/site'
import { useScrolled } from '../hooks/useScrolled'
import { type PageRoute, type RouteId, useRoute } from '../lib/routing'
import { ConceptStrip } from './ConceptStrip'
import { LanguageSelect } from './LanguageSelect'
import { MobileMenu } from './MobileMenu'
import { Link } from './ui/Link'
import { Logo } from './ui/Logo'

function NavLinks({ items, current, className = '' }: { items: readonly PageRoute[]; current: RouteId; className?: string }) {
  const { navLabels } = useCopy()
  return (
    <ul className={`flex items-center gap-[clamp(1.25rem,2.6vw,2.75rem)] ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Link
            to={item}
            aria-current={current === item ? 'page' : undefined}
            className="eyebrow group relative block py-3 text-smoke transition-colors duration-500 hover:text-bone aria-[current=page]:text-bone"
          >
            {navLabels[item]}
            {/* Gold indicator: draws in on hover, stays under the current page */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out-expo group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Header() {
  const scrolled = useScrolled(30)
  const route = useRoute()
  const { ui } = useCopy()
  const menuRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <ConceptStrip />

        <div
          className={`border-b transition-colors duration-500 ${
            scrolled ? 'border-line bg-ink' : 'border-transparent bg-linear-to-b from-ink/85 to-transparent'
          }`}
        >
          <div className="container-x grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-6">
            <nav aria-label={ui.navPrimary} className="hidden lg:block">
              <NavLinks items={navLayout.left} current={route} />
            </nav>

            <Link
              to="home"
              className="col-start-1 justify-self-start lg:col-start-2 lg:justify-self-center"
              aria-label={ui.homeLabel}
            >
              <Logo className="h-11 lg:h-[3.25rem]" />
            </Link>

            <div className="col-start-3 flex items-center justify-end gap-8">
              <nav aria-label={ui.navSecondary} className="hidden lg:block">
                <NavLinks items={navLayout.right} current={route} />
              </nav>
              <div className="hidden lg:block">
                <LanguageSelect />
              </div>
              <button
                type="button"
                onClick={() => menuRef.current?.showModal()}
                aria-haspopup="dialog"
                aria-label={ui.openMenu}
                className="-mr-2 grid size-11 place-items-center lg:hidden"
              >
                <span aria-hidden="true" className="flex w-6 flex-col gap-[6px]">
                  <span className="h-px w-full bg-bone" />
                  <span className="h-px w-full bg-bone" />
                  <span className="h-px w-full bg-bone" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu ref={menuRef} current={route} />
    </>
  )
}
