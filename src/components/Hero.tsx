import { m } from 'motion/react'
import { photos } from '../content/photos'
import { hero, venue } from '../content/site'
import { OutlineButton } from './ui/Buttons'
import { Picture } from './ui/Picture'
import { LineReveal } from './ui/Reveal'

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[min(88svh,44rem)] flex-col overflow-hidden lg:min-h-[clamp(38rem,86svh,52rem)]"
    >
      {/* Photography */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
        <div className="h-full w-full motion-safe:animate-settle">
          <Picture
            photo={photos.hero}
            mobile={photos.heroMobile}
            priority
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-[50%_24%] brightness-[0.85] saturate-[1.05]"
          />
        </div>
        {/* The grade deepens toward the foot of the hero, where the wordmark sits in the crowd */}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 via-50% to-ink/25" />
        <div className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-ink/60 to-transparent max-md:hidden" />
        {/* Lights up: an ink veil lifts, so the photograph itself paints immediately */}
        <m.div
          aria-hidden="true"
          className="absolute inset-0 bg-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      </div>

      {/* One cluster, anchored to the foot of the photograph: label, wordmark, tagline, action */}
      <div className="container-x relative flex flex-1 flex-col justify-end pb-6 pt-[calc(var(--strip-h)+var(--header-h)+2rem)] md:pb-11">
        <m.p
          {...fadeIn(0.3)}
          className="eyebrow mb-5 w-fit border-l border-gold/60 pl-4 !leading-[1.85] !tracking-[0.34em] text-bone/90 md:mb-6"
        >
          {hero.label.map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </m.p>

        <h1
          id="hero-title"
          className="display uppercase leading-[0.84] tracking-[0.045em] text-[clamp(4.1rem,24vw,7rem)] md:text-[clamp(7rem,12.5vw,12.5rem)]"
        >
          <LineReveal immediate delay={0.4} innerClassName="gold-text-hero">
            Zenzo
          </LineReveal>
        </h1>

        <m.p {...fadeIn(0.9)} className="eyebrow mt-2 !tracking-[0.46em] text-smoke max-md:!tracking-[0.34em] md:mt-4">
          {hero.tagline.join(' — ')}
        </m.p>

        <div className="mt-6 flex flex-col gap-6 md:mt-9 md:flex-row md:items-end md:justify-between">
          <m.div {...fadeIn(1.1)}>
            <OutlineButton href="#about" className="w-full md:w-auto md:min-w-72">
              {hero.cta}
            </OutlineButton>
          </m.div>

          <m.div {...fadeIn(1.3)} className="flex items-end justify-between gap-8 md:justify-end">
            <address className="eyebrow border-l border-gold/60 pl-4 not-italic !leading-[1.8] !tracking-[0.2em] text-bone/90">
              {venue.street}
              <br />
              {venue.postcode} {venue.city}
            </address>
            <a
              href="#about"
              aria-label="Scroll to content"
              className="relative block h-10 w-px shrink-0 overflow-hidden bg-line-strong"
            >
              <span className="absolute inset-0 bg-gold motion-safe:animate-scroll-cue" />
            </a>
          </m.div>
        </div>
      </div>
    </section>
  )
}
