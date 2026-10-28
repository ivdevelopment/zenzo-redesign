import { PageHero } from '../components/PageHero'
import { ArrowLink, OutlineButton } from '../components/ui/Buttons'
import { Picture } from '../components/ui/Picture'
import { ClipFrame, LineReveal, Reveal } from '../components/ui/Reveal'
import { contactPage } from '../content/pages'
import { photos } from '../content/photos'
import { concept, venue } from '../content/site'

export function ContactPage() {
  const credit = photos.cityTall.credit
  return (
    <>
      <PageHero
        label={contactPage.label}
        title={contactPage.title}
        intro={contactPage.intro}
        photo={photos.city}
        focus="object-[30%_55%]"
        compact
      />

      <section aria-labelledby="contact-page-title" className="bg-ink py-8 md:py-14">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-gold">Visit us</p>
            </Reveal>
            <h2
              id="contact-page-title"
              className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-[1.02] tracking-[0.03em]"
            >
              <span className="sr-only">Find Zenzo at </span>
              <LineReveal>{venue.street}</LineReveal>
              <LineReveal delay={0.08}>
                {venue.postcode} {venue.city}
              </LineReveal>
            </h2>
            <Reveal delay={0.1} className="mt-6">
              <OutlineButton href={venue.mapsUrl} external className="w-full sm:w-auto sm:min-w-72">
                Get directions
                <span className="sr-only"> (opens maps in a new tab)</span>
              </OutlineButton>
            </Reveal>

            {/* Where each kind of enquiry goes */}
            <Reveal delay={0.15}>
              <h3 className="eyebrow mt-8 text-gold md:mt-10">Where to ask</h3>
              <ul className="mt-4 border-t border-line-strong">
                {contactPage.routing.map((row) => (
                  <li
                    key={row.label}
                    className="grid gap-2 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-x-6 md:py-5"
                  >
                    <p className="eyebrow pt-1 !text-[0.6875rem] text-bone">{row.label}</p>
                    <div>
                      <p className="max-w-[46ch] leading-relaxed text-smoke">{row.text}</p>
                      {'href' in row && (
                        <ArrowLink href={row.href} external className="mt-2.5">
                          {row.action}
                        </ArrowLink>
                      )}
                      {'page' in row && (
                        <ArrowLink to="lost-found" className="mt-2.5">
                          Lost &amp; Found
                        </ArrowLink>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[56ch] text-[0.8125rem] leading-relaxed text-mute">
                {contactPage.note}{' '}
                <a href={concept.officialSite} target="_blank" rel="noopener noreferrer" className="link-line text-smoke">
                  {concept.officialSiteLabel}
                </a>
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <ClipFrame>
              <div className="relative aspect-[5/4] overflow-hidden bg-coal lg:aspect-[3/4]">
                <Picture
                  photo={photos.cityTall}
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[50%_60%] brightness-[0.95]"
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-gold/30 md:inset-3" />
              </div>
            </ClipFrame>
            <p className="eyebrow mt-3 !text-[0.5625rem] !tracking-[0.16em] text-bone/60">
              Illustrative ·{' '}
              <a href={credit?.profileUrl} target="_blank" rel="noopener noreferrer" className="link-line hover:text-bone">
                {credit?.name}
              </a>{' '}
              / Unsplash
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
