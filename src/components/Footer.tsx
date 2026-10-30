import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { photos } from '../content/photos'
import { useCopy } from '../content/copy'
import { concept, navAll, venue } from '../content/site'
import { Link } from './ui/Link'
import { Logo } from './ui/Logo'

const year = new Date().getFullYear()

/**
 * Quiet footer: logo and navigation on one line, location and the concept notice on the
 * next, credits last. Thin rules do the separating — no boxed columns.
 */
export function Footer() {
  const { ui, navLabels } = useCopy()
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="container-x py-7 md:py-11">
        <div className="flex items-center justify-between gap-6 md:gap-10">
          <Link to="home" aria-label={ui.homeLabel} className="shrink-0">
            <Logo className="h-14 md:h-[4.5rem]" />
          </Link>

          <nav aria-label={ui.navFooter} className="hidden md:block">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 lg:gap-x-10">
              {navAll.map((item) => (
                <li key={item}>
                  <Link to={item} className="eyebrow link-line inline-block !text-[0.6875rem] text-smoke hover:text-bone">
                    {navLabels[item]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
            className="eyebrow link-line inline-flex shrink-0 items-center gap-2 !text-[0.6875rem] text-smoke hover:text-bone"
          >
            {ui.backToTop} <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={1.25} />
          </button>
        </div>

        <nav aria-label={ui.navFooterCompact} className="mt-5 border-t border-line pt-5 md:hidden">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {navAll.map((item) => (
              <li key={item}>
                <Link to={item} className="eyebrow link-line inline-block !text-[0.6875rem] text-smoke hover:text-bone">
                  {navLabels[item]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-5 grid gap-5 border-t border-line pt-5 md:mt-9 md:grid-cols-2 md:gap-12 md:pt-7">
          <div>
            <h2 className="eyebrow text-gold">{ui.location}</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-smoke">
              {venue.street}, {venue.postcode} {venue.city}, {ui.country}
              <br />
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-line mt-2.5 inline-flex items-center gap-1 !text-[0.6875rem] text-bone"
              >
                {ui.directions} <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only">{ui.opensMaps}</span>
              </a>
            </address>
          </div>
          <div>
            <h2 className="eyebrow text-gold">{ui.aboutConcept}</h2>
            <p className="mt-3 text-sm leading-relaxed text-smoke">
              <strong className="font-medium text-bone">{ui.disclaimer}</strong> {ui.conceptStudy}{' '}
              <a href={concept.officialSite} target="_blank" rel="noopener noreferrer" className="link-line text-bone">
                {ui.officialWebsite}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-xs text-mute md:mt-8 md:flex-row md:items-start md:justify-between">
          <p>
            {ui.attribution} {concept.author} · {year}
          </p>
          <details className="group md:max-w-[46ch] md:text-right">
            <summary className="eyebrow inline-flex cursor-pointer list-none items-center gap-2 !text-[0.625rem] text-mute hover:text-smoke [&::-webkit-details-marker]:hidden">
              {ui.credits}
              <span aria-hidden="true" className="text-base leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-left leading-relaxed">
              <li>
                {ui.creditRights}
              </li>
              <li>
                {ui.creditBruges}{' '}
                <a href={photos.city.credit?.pageUrl} target="_blank" rel="noopener noreferrer" className="link-line text-smoke">
                  {photos.city.credit?.name}
                </a>
                {ui.creditUnsplash}
              </li>
              <li>{ui.creditType}</li>
            </ul>
          </details>
        </div>
      </div>
    </footer>
  )
}
