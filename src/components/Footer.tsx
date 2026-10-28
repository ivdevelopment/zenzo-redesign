import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { photos } from '../content/photos'
import { concept, navAll, venue } from '../content/site'
import { Link } from './ui/Link'
import { Logo } from './ui/Logo'

const year = new Date().getFullYear()

/**
 * Quiet footer: logo and navigation on one line, location and the concept notice on the
 * next, credits last. Thin rules do the separating — no boxed columns.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="container-x py-7 md:py-11">
        <div className="flex items-center justify-between gap-6 md:gap-10">
          <Link to="home" aria-label="Zenzo — home" className="shrink-0">
            <Logo className="h-14 md:h-[4.5rem]" />
          </Link>

          <nav aria-label="Footer" className="hidden md:block">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 lg:gap-x-10">
              {navAll.map((item) => (
                <li key={item.route}>
                  <Link to={item.route} className="eyebrow link-line inline-block !text-[0.6875rem] text-smoke hover:text-bone">
                    {item.label}
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
            Back to top <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={1.25} />
          </button>
        </div>

        <nav aria-label="Footer (compact)" className="mt-5 border-t border-line pt-5 md:hidden">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {navAll.map((item) => (
              <li key={item.route}>
                <Link to={item.route} className="eyebrow link-line inline-block !text-[0.6875rem] text-smoke hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-5 grid gap-5 border-t border-line pt-5 md:mt-9 md:grid-cols-2 md:gap-12 md:pt-7">
          <div>
            <h2 className="eyebrow text-gold">Location</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-smoke">
              {venue.street}, {venue.postcode} {venue.city}, {venue.country}
              <br />
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow link-line mt-2.5 inline-flex items-center gap-1 !text-[0.6875rem] text-bone"
              >
                Directions <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                <span className="sr-only"> (opens maps in a new tab)</span>
              </a>
            </address>
          </div>
          <div>
            <h2 className="eyebrow text-gold">About this concept</h2>
            <p className="mt-3 text-sm leading-relaxed text-smoke">
              <strong className="font-medium text-bone">{concept.disclaimer}</strong> An independently created redesign
              study, not endorsed or operated by the venue.{' '}
              <a href={concept.officialSite} target="_blank" rel="noopener noreferrer" className="link-line text-bone">
                Official website
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 text-xs text-mute md:mt-8 md:flex-row md:items-start md:justify-between">
          <p>
            Unofficial redesign concept by {concept.author} · {year}
          </p>
          <details className="group md:max-w-[46ch] md:text-right">
            <summary className="eyebrow inline-flex cursor-pointer list-none items-center gap-2 !text-[0.625rem] text-mute hover:text-smoke [&::-webkit-details-marker]:hidden">
              Credits &amp; licences
              <span aria-hidden="true" className="text-base leading-none transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-left leading-relaxed">
              <li>
                The Zenzo logo and photographs belong to Zenzo and their respective rights holders. They are taken from zenzobar.be for this
                unofficial portfolio concept, cropped and colour-graded, and are not claimed as the designer’s own.
              </li>
              <li>
                Bruges canal photograph:{' '}
                <a href={photos.city.credit?.pageUrl} target="_blank" rel="noopener noreferrer" className="link-line text-smoke">
                  {photos.city.credit?.name}
                </a>
                , Unsplash License.
              </li>
              <li>Type: Cormorant Garamond and Manrope (SIL OFL). Icons: Lucide (ISC).</li>
            </ul>
          </details>
        </div>
      </div>
    </footer>
  )
}
