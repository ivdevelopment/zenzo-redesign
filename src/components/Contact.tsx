import { photos } from '../content/photos'
import { useCopy } from '../content/copy'
import { concept, venue } from '../content/site'
import { ArrowLink, OutlineButton } from './ui/Buttons'
import { Picture } from './ui/Picture'
import { ClipFrame, LineReveal, Reveal } from './ui/Reveal'

/**
 * Location band. The Bruges photograph is a cinematic strip that runs off the left edge and
 * dissolves into the page beneath the address — darkened and warmed so it stays secondary to
 * the nightclub photography.
 */
export function Contact() {
  const { ui, visit } = useCopy()
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative border-t border-line bg-ink">
      <div className="relative mx-auto max-w-[1680px] lg:min-h-[28rem]">
        <ClipFrame className="relative aspect-[16/8] sm:aspect-[2/1] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[70%]">
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] lg:[mask-image:linear-gradient(to_right,#000_36%,transparent_90%)]">
            <Picture
              photo={photos.city}
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="h-full w-full object-cover object-[28%_55%] brightness-[0.85]"
            />
          </div>
          <p className="eyebrow absolute right-(--gutter) top-3 !text-[0.5625rem] !tracking-[0.16em] text-bone/60 [text-shadow:0_0_8px_rgb(0_0_0/0.9)] lg:bottom-5 lg:left-(--gutter) lg:right-auto lg:top-auto">
            {ui.illustrative} ·{' '}
            <a
              href={photos.city.credit?.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line hover:text-bone"
            >
              {photos.city.credit?.name}
            </a>{' '}
            / Unsplash
          </p>
        </ClipFrame>

        <div className="relative z-10 -mt-4 px-(--gutter) pb-8 lg:ml-[48%] lg:mt-0 lg:flex lg:min-h-[28rem] lg:flex-col lg:justify-center lg:py-12 lg:pl-12 lg:pr-(--gutter)">
          <Reveal>
            <p className="eyebrow text-gold">{visit.label}</p>
          </Reveal>
          <h2 id="contact-title" className="display mt-3 text-[clamp(2.2rem,4.2vw,3.9rem)] uppercase leading-[1.02] tracking-[0.03em]">
            <span className="sr-only">{ui.findZenzoAt}</span>
            <LineReveal>{venue.street}</LineReveal>
            <LineReveal delay={0.08}>
              {venue.postcode} {venue.city}
            </LineReveal>
          </h2>
          <Reveal delay={0.1} className="mt-5 lg:mt-6">
            <OutlineButton href={venue.mapsUrl} external className="w-full sm:w-auto sm:min-w-64">
              {ui.getDirections}
              <span className="sr-only">{ui.opensMaps}</span>
            </OutlineButton>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-7 divide-y divide-line border-y border-line text-sm">
              <div className="grid gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                <dt className="eyebrow pt-0.5 !text-[0.625rem] text-mute">{visit.enquiriesLabel}</dt>
                <dd className="leading-relaxed text-smoke">
                  {visit.enquiriesText}{' '}
                  <a href={concept.officialSite} target="_blank" rel="noopener noreferrer" className="link-line text-bone">
                    {concept.officialSiteLabel}
                  </a>
                </dd>
              </div>
              <div
                id="lost-found"
                className="grid scroll-mt-[calc(var(--strip-h)+var(--header-h)+1.5rem)] gap-1 py-3 sm:grid-cols-[8.5rem_1fr] sm:gap-4"
              >
                <dt className="eyebrow pt-0.5 !text-[0.625rem] text-mute">{ui.lostFound}</dt>
                <dd className="leading-relaxed text-smoke">
                  {visit.lostText}
                </dd>
              </div>
            </dl>
            <p className="mt-4 max-w-[52ch] text-[0.8125rem] leading-relaxed text-mute">{visit.note}</p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              <ArrowLink to="contact">{ui.allContact}</ArrowLink>
              <ArrowLink to="lost-found">{ui.lostFound}</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
