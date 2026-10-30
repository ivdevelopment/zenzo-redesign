import { PageHero } from '../components/PageHero'
import { ArrowLink, OutlineButton } from '../components/ui/Buttons'
import { LineReveal, Reveal } from '../components/ui/Reveal'
import { useCopy } from '../content/copy'
import { photos } from '../content/photos'
import { official } from '../content/site'

/** Deliberately minimal: one statement, three steps on the official site, one action. */
export function LostFoundPage() {
  const { lostPage, ui } = useCopy()
  return (
    <>
      <PageHero
        label={lostPage.label}
        title={lostPage.title}
        intro={lostPage.intro}
        photo={photos.pageLost}
        focus="object-[50%_50%]"
        compact
      />

      <section aria-labelledby="lost-statement" className="bg-ink py-12 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-x-12">
          <h2
            id="lost-statement"
            className="display text-[clamp(2.1rem,4.6vw,4.25rem)] leading-[1.04] tracking-[0.01em] lg:col-span-6"
          >
            <LineReveal>{lostPage.statement[0]}</LineReveal>
            <LineReveal delay={0.1} innerClassName="gold-text">
              {lostPage.statement[1]}
            </LineReveal>
          </h2>

          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-gold">{lostPage.stepsLabel}</p>
            <ol className="mt-4 border-t border-line-strong">
              {lostPage.steps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-5 border-b border-line py-4">
                  <span className="display w-8 text-[1.6rem] leading-none text-gold-soft">{i + 1}</span>
                  <span className="text-[1.0625rem] leading-snug text-bone/90">{step}</span>
                </li>
              ))}
            </ol>
            <OutlineButton href={official.lostFound} external className="mt-7 w-full sm:w-auto sm:min-w-72">
              {lostPage.action}
              <span className="sr-only">{ui.opensOfficial}</span>
            </OutlineButton>
            <p className="mt-5 max-w-[44ch] text-[0.8125rem] leading-relaxed text-mute">{lostPage.note}</p>
            <div className="mt-6">
              <ArrowLink to="contact">{ui.contactDirections}</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
