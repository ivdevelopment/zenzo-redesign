import { m } from 'motion/react'
import type { ReactNode } from 'react'
import type { Photo } from '../content/photos'
import { Picture } from './ui/Picture'
import { LineReveal } from './ui/Reveal'

type PageHeroProps = {
  label: string
  /** The page title, one entry per line. */
  title: readonly string[]
  intro?: ReactNode
  photo: Photo
  /** object-position utility, e.g. "object-[50%_30%]" */
  focus?: string
  /** A shorter band, for pages that should stay quiet. */
  compact?: boolean
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
})

/**
 * The banner that opens every inner page: the homepage hero's language in a shorter format —
 * graded photograph, a keylined label, the title in the champagne gradient, a short intro.
 */
export function PageHero({ label, title, intro, photo, focus = 'object-[50%_40%]', compact = false }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className={`grain relative isolate flex flex-col justify-end overflow-hidden ${
        compact
          ? 'min-h-[min(48svh,22rem)] lg:min-h-[24rem]'
          : 'min-h-[min(68svh,33rem)] lg:min-h-[clamp(26rem,58svh,36rem)]'
      }`}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
        <div className="h-full w-full motion-safe:animate-settle">
          <Picture
            photo={photo}
            priority
            sizes="100vw"
            alt=""
            className={`h-full w-full object-cover brightness-[1.02] ${focus}`}
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 via-55% to-ink/20" />
        <div className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-ink/50 to-transparent max-md:hidden" />
        <m.div
          aria-hidden="true"
          className="absolute inset-0 bg-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </div>

      <div className="container-x relative pb-7 pt-[calc(var(--strip-h)+var(--header-h)+2rem)] md:pb-11">
        <m.p {...fadeIn(0.2)} className="eyebrow mb-4 w-fit border-l border-gold/60 pl-4 text-bone/90 md:mb-5">
          {label}
        </m.p>
        <h1
          id="page-title"
          className="display uppercase leading-[0.88] tracking-[0.045em] text-[clamp(2.4rem,11.5vw,5rem)] md:text-[clamp(3.75rem,8vw,7.5rem)]"
        >
          {title.map((line, i) => (
            <LineReveal key={line} immediate delay={0.3 + i * 0.1} innerClassName="gold-text">
              {line}
            </LineReveal>
          ))}
        </h1>
        {intro && (
          <m.p {...fadeIn(0.8)} className="mt-4 max-w-[44ch] text-[1.0625rem] leading-relaxed text-bone/85 md:mt-6 md:text-lg">
            {intro}
          </m.p>
        )}
      </div>
    </section>
  )
}
