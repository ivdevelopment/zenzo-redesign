import { ArrowRight } from 'lucide-react'
import { photos } from '../content/photos'
import { atmosphere } from '../content/site'
import { ArrowLink } from './ui/Buttons'
import { Picture } from './ui/Picture'
import { ClipFrame, LineReveal, Reveal } from './ui/Reveal'

const fadeMask = 'linear-gradient(to right, transparent 0%, #000 34%, #000 86%, transparent 100%)'

/**
 * The editorial spread under the hero. Three things are tied to one baseline:
 * the copy, the overlapping inset and the MUSIC / PEOPLE / ENERGY motif all end on the
 * same line near the foot of the section, and the inset crosses the edge of the main
 * photograph by a fixed amount rather than floating near it.
 */
export function Atmosphere() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative border-y border-line bg-ink">
      <div className="relative mx-auto max-w-[1680px] lg:min-h-[31rem]">
        {/* Dominant photograph — fades into the page at both ends */}
        <div
          className="relative h-[14rem] sm:h-[22rem] lg:absolute lg:inset-y-0 lg:left-[30%] lg:right-[18%] lg:h-auto"
          style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        >
          <div className="absolute inset-0 max-lg:[mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
            <Picture
              photo={photos.atmoMain}
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="h-full w-full object-cover object-[50%_40%]"
            />
          </div>
        </div>

        {/* Motif + inset: one unit, bottom-aligned with the copy. The inset overlaps the photograph's edge. */}
        <div className="absolute right-(--gutter) top-[9.5rem] z-10 w-[33%] max-w-60 sm:top-[16rem] lg:bottom-12 lg:right-[4%] lg:top-auto lg:flex lg:w-auto lg:max-w-none lg:items-end lg:gap-9">
          <ul
            aria-label="Music, people, energy"
            className="eyebrow hidden space-y-4 border-l border-gold/60 pl-5 !leading-none !tracking-[0.5em] text-bone [text-shadow:0_0_14px_rgb(0_0_0/0.9)] lg:block"
          >
            {atmosphere.motif.map((word) => (
              <li key={word}>{word}</li>
            ))}
          </ul>
          <ClipFrame className="w-full lg:w-[23vw] lg:max-w-[24rem]">
            <div className="aspect-[4/3] border border-gold/45 bg-ink">
              <Picture photo={photos.atmoInset} sizes="(min-width: 1024px) 24vw, 33vw" className="h-full w-full object-cover" />
            </div>
          </ClipFrame>
        </div>

        {/* Copy — its last line sits on the same baseline as the inset */}
        <div className="container-x relative z-10 -mt-12 pb-8 sm:-mt-16 lg:mt-0 lg:flex lg:min-h-[31rem] lg:items-end lg:pb-12 lg:pt-14">
          <div className="max-w-[26rem]">
            <div className="max-sm:max-w-[60%] sm:max-lg:max-w-[62%]">
              <Reveal>
                <p className="eyebrow text-gold">{atmosphere.label}</p>
              </Reveal>
              <h2
                id="about-title"
                className="display mt-3 text-[clamp(2.1rem,9.5vw,2.75rem)] leading-[0.98] tracking-[0.005em] md:text-[clamp(2.4rem,5vw,4.5rem)]"
              >
                {atmosphere.headline.map((line, i) => (
                  <LineReveal key={line} delay={i * 0.1} innerClassName="gold-text">
                    {line}
                  </LineReveal>
                ))}
              </h2>
            </div>
            <Reveal delay={0.15}>
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-smoke lg:mt-5">{atmosphere.body}</p>

              {/* "About Zenzo" opens the venue's own description and published figures */}
              <details className="group mt-5">
                <summary className="eyebrow inline-flex cursor-pointer list-none items-center gap-3 border-b border-line-strong pb-1.5 text-bone transition-colors duration-500 hover:border-gold hover:text-gold-soft [&::-webkit-details-marker]:hidden">
                  About Zenzo
                  <ArrowRight
                    aria-hidden="true"
                    strokeWidth={1.25}
                    className="size-3.5 transition-transform duration-500 ease-out-expo group-open:rotate-90"
                  />
                </summary>
                <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-smoke">{atmosphere.more}</p>
                <dl className="mt-5 grid grid-cols-3 border-t border-line">
                  {atmosphere.facts.map((fact) => (
                    <div key={fact.label} className="border-r border-line py-4 pl-4 first:pl-0 last:border-r-0">
                      <dd className="display text-[1.75rem] tabular-nums text-gold-soft">{fact.value}</dd>
                      <dt className="eyebrow mt-1 !text-[0.625rem] !tracking-[0.18em] text-mute">{fact.label}</dt>
                    </div>
                  ))}
                </dl>
                <div className="mt-5">
                  <ArrowLink to="about">Read more</ArrowLink>
                </div>
              </details>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
