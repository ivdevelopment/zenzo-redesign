import { ArrowUpRight } from 'lucide-react'
import { concept } from '../content/site'

/**
 * The "unofficial concept" notice: a slim strip above the header, always on
 * screen. Small and quiet, but set at a readable size in sentence case so it
 * never has to be hunted for — and it wraps rather than truncates on the
 * narrowest phones.
 */
export function ConceptStrip({ showLink = true }: { showLink?: boolean }) {
  return (
    <div className="border-b border-line bg-ink">
      <div className="container-x flex min-h-[var(--strip-h)] items-center justify-between gap-4 py-1">
        <p className="text-[0.6875rem] leading-snug tracking-[0.04em] text-smoke">{concept.disclaimer}</p>
        {showLink && (
          <a
            href={concept.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow link-line hidden shrink-0 items-center gap-1 !text-[0.625rem] !tracking-[0.2em] text-gold-soft sm:inline-flex"
          >
            Official site <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </a>
        )}
      </div>
    </div>
  )
}
