import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { photos } from '../content/photos'
import { vip } from '../content/site'
import { ArrowLink } from './ui/Buttons'
import { Picture } from './ui/Picture'
import { LineReveal, Reveal } from './ui/Reveal'

type Item = (typeof vip.items)[number]

/** Where each crop is anchored when it is shown as a wide banner on phones. */
const bannerFocus: Record<Item['id'], string> = {
  'bottle-service': 'object-[50%_18%]',
  'private-lounge': 'object-[50%_24%]',
  'private-party': 'object-[50%_38%]',
}

function Inclusions({ item }: { item: Item }) {
  return (
    <>
      <p className="text-[0.9375rem] leading-relaxed text-bone/85">{item.text}</p>
      <ul className="mt-4 border-t border-line">
        {item.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 border-b border-line py-2.5 text-sm text-bone/90">
            <span aria-hidden="true" className="h-px w-4 shrink-0 bg-gold" />
            {feature}
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Desktop panel, set like a magazine cover: a keylined photograph, the number as masthead,
 * the title at the foot. The inclusions rise from behind the title on hover or when opened.
 */
function Panel({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  const photo = photos[item.photo]
  const detailsId = `${item.id}-details`
  return (
    <li className="group relative isolate aspect-[3/4] overflow-hidden bg-ink">
      <Picture
        photo={photo}
        sizes="(min-width: 1280px) 24vw, 28vw"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.95] transition-[transform,filter] duration-[1800ms] ease-out-expo group-hover:scale-[1.04] group-hover:brightness-[0.68]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-ink/60 via-transparent via-35% to-ink/90" />
      {/* Keyline, like the printed border of a cover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-gold/30 transition-colors duration-[1400ms] ease-out-expo group-hover:border-gold/70"
      />

      <div className="flex h-full flex-col justify-between p-6 xl:p-7">
        <div className="flex items-start justify-between">
          <span className="display block text-[clamp(3.5rem,5.6vw,5.75rem)] leading-[0.78] text-gold-soft">{item.number}</span>
          <span className="eyebrow mt-1 !text-[0.625rem] !tracking-[0.3em] text-bone/70">VIP</span>
        </div>

        <div>
          <h3 className="display text-[clamp(1.75rem,2.5vw,2.4rem)] uppercase leading-[1.04] tracking-[0.06em] text-bone">
            {item.title}
          </h3>
          <div
            id={detailsId}
            className={`grid transition-[grid-template-rows,opacity] duration-[900ms] ease-out-expo group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 ${
              open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pt-4">
                <Inclusions item={item} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={`${item.title}: ${open ? 'hide' : 'show'} what’s included`}
            className="group/btn mt-5 flex w-full items-center justify-between border-t border-gold/40 pt-3.5 transition-colors duration-700 hover:border-gold"
          >
            <span className="eyebrow !text-[0.625rem] text-bone/85">What’s included</span>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.25}
              className={`size-4 text-gold-soft transition-transform duration-700 ease-out-expo group-hover/btn:translate-x-1 ${open ? 'rotate-90 group-hover/btn:translate-x-0' : ''}`}
            />
          </button>
        </div>
      </div>
    </li>
  )
}

/**
 * Phone row: a wide photographic banner with the number and title set across it.
 * Tapping opens the inclusions beneath — it reads as three covers, not a settings list.
 */
function Row({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  const photo = photos[item.photo]
  const detailsId = `${item.id}-row-details`
  return (
    <li className="-mx-(--gutter) border-b border-gold/25 first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={detailsId}
        className="group/btn relative block h-[7rem] w-full overflow-hidden text-left sm:h-32"
      >
        <Picture
          photo={photo}
          sizes="100vw"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover brightness-[1.02] ${bannerFocus[item.id]}`}
        />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/30 to-transparent" />
        <span className="relative flex h-full items-center gap-4 px-(--gutter)">
          <span className="display w-[3.25rem] text-[3rem] leading-none text-gold-soft">{item.number}</span>
          <span className="display flex-1 text-[1.45rem] uppercase leading-[1.05] tracking-[0.06em]">{item.title}</span>
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.25}
            className={`size-5 shrink-0 text-gold-soft transition-transform duration-700 ease-out-expo ${open ? 'rotate-90' : ''}`}
          />
        </span>
      </button>
      <div
        id={detailsId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-[800ms] ease-out-expo ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="ml-(--gutter) border-l border-gold/50 pb-5 pl-4 pr-(--gutter) pt-4">
            <Inclusions item={item} />
          </div>
        </div>
      </div>
    </li>
  )
}

export function Vip() {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id))

  return (
    <section
      id="vip"
      aria-labelledby="vip-title"
      className="section-y relative bg-[linear-gradient(to_bottom,var(--color-ink),var(--color-bronze)_12%,var(--color-bronze)_88%,var(--color-ink))]"
    >
      <div className="container-x grid gap-6 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-3 lg:pt-2">
          <Reveal>
            <p className="eyebrow text-gold">{vip.label}</p>
          </Reveal>
          <h2 id="vip-title" className="display mt-3 text-[clamp(2.1rem,3.7vw,3.4rem)] uppercase leading-[1.02] tracking-[0.03em]">
            {vip.headline.map((line, i) => (
              <LineReveal key={line} delay={i * 0.1}>
                {line}
              </LineReveal>
            ))}
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-bone/80 lg:mt-5">{vip.intro}</p>
            <ArrowLink to="vip" className="mt-5 lg:mt-6">
              Discover VIP
            </ArrowLink>
          </Reveal>
        </div>

        {/* Desktop: three covers. Phones: three banners that open. */}
        <ul className="hidden gap-3 md:grid md:grid-cols-3 lg:col-span-9">
          {vip.items.map((item) => (
            <Panel key={item.id} item={item} open={openId === item.id} onToggle={() => toggle(item.id)} />
          ))}
        </ul>
        <ul className="mt-1 md:hidden">
          {vip.items.map((item) => (
            <Row key={item.id} item={item} open={openId === item.id} onToggle={() => toggle(item.id)} />
          ))}
        </ul>
      </div>

      <div className="container-x mt-5 lg:mt-8">
        <p className="max-w-[70ch] text-[0.8125rem] leading-relaxed text-smoke lg:pl-[calc(25%+0.5rem)]">{vip.note}</p>
      </div>
    </section>
  )
}
