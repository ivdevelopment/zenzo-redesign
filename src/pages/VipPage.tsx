import { PageHero } from '../components/PageHero'
import { ArrowLink, OutlineButton } from '../components/ui/Buttons'
import { Picture } from '../components/ui/Picture'
import { ClipFrame, LineReveal, Reveal } from '../components/ui/Reveal'
import { photos, type Photo } from '../content/photos'
import { useCopy, type Copy } from '../content/copy'
import { official } from '../content/site'

type Chapter = Copy['vipPage']['chapters'][number]

type Layout = {
  photo: Photo
  /** Image on the left or the right (from md) */
  side: 'left' | 'right'
  /** Column spans from lg, written out in full so Tailwind can see them */
  imageCols: string
  textCols: string
  /** Frame ratio */
  frame: string
  focus: string
  sizes: string
}

/** Three different compositions, alternating sides, so the chapters never read as a template. */
const layouts: Record<string, Layout> = {
  'bottle-service': {
    photo: photos.vipBottlePage,
    side: 'left',
    imageCols: 'lg:col-span-7',
    textCols: 'lg:col-span-5',
    frame: 'aspect-[4/5] md:aspect-[5/6]',
    focus: 'object-[50%_30%]',
    sizes: '(min-width: 1024px) 50vw, 100vw',
  },
  'private-lounge': {
    photo: photos.vipLoungePage,
    side: 'right',
    imageCols: 'lg:col-span-7',
    textCols: 'lg:col-span-5',
    frame: 'aspect-[3/2]',
    focus: 'object-[40%_50%]',
    sizes: '(min-width: 1024px) 58vw, 100vw',
  },
  'private-party': {
    photo: photos.vipPartyPage,
    side: 'left',
    imageCols: 'lg:col-span-6',
    textCols: 'lg:col-span-6',
    frame: 'aspect-[5/4] md:aspect-[4/5]',
    focus: 'object-[50%_40%]',
    sizes: '(min-width: 1024px) 46vw, 100vw',
  },
}

function Inclusions({ items }: { items: readonly string[] }) {
  return (
    <ul className="border-t border-line-strong">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-4 border-b border-line py-3 text-base text-bone/90">
          <span aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ChapterSection({ chapter }: { chapter: Chapter }) {
  const { vipPage } = useCopy()
  const layout = layouts[chapter.id]
  const imageFirst = layout.side === 'left'
  const headingId = `${chapter.id}-title`

  return (
    <article id={chapter.id} aria-labelledby={headingId} className="container-x scroll-mt-[calc(var(--strip-h)+var(--header-h)+1rem)]">
      <div className="grid items-end gap-5 md:gap-8 lg:grid-cols-12 lg:gap-x-10">
        <ClipFrame className={`${layout.imageCols} ${imageFirst ? '' : 'lg:order-last'}`}>
          <div className={`relative w-full overflow-hidden bg-coal ${layout.frame}`}>
            <Picture
              photo={layout.photo}
              sizes={layout.sizes}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover brightness-[0.95] ${layout.focus}`}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-gold/30 md:inset-3" />
          </div>
        </ClipFrame>

        <div className={layout.textCols}>
          <Reveal>
            <span className="display block text-[clamp(3.25rem,9vw,8rem)] leading-[0.8] text-gold-soft">{chapter.number}</span>
            <p className="eyebrow mt-4 text-gold">VIP</p>
            <h2
              id={headingId}
              className="display mt-3 text-[clamp(2.4rem,5.2vw,4.75rem)] uppercase leading-[0.98] tracking-[0.04em]"
            >
              {chapter.title.map((line, i) => (
                <LineReveal key={line} delay={i * 0.1}>
                  {line}
                </LineReveal>
              ))}
            </h2>
            <p className="mt-5 max-w-[38ch] text-[1.0625rem] leading-relaxed text-bone/85">{chapter.text}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-5">
            <Inclusions items={chapter.features} />
            <ArrowLink href={official.vip} external className="mt-6">
              {vipPage.enquire}
            </ArrowLink>
          </Reveal>
        </div>
      </div>
    </article>
  )
}

export function VipPage() {
  const { vipPage, ui } = useCopy()
  return (
    <>
      <PageHero
        label={vipPage.label}
        title={vipPage.title}
        intro={vipPage.intro}
        photo={photos.pageVip}
        focus="object-[50%_30%]"
      />

      {/* Warm bronze ground, like the homepage VIP section */}
      <div className="bg-[linear-gradient(to_bottom,var(--color-ink),var(--color-bronze)_8%,var(--color-bronze)_92%,var(--color-ink))] py-9 md:py-20">
        <div className="space-y-10 md:space-y-28">
          {vipPage.chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      <section aria-labelledby="vip-closing-title" className="border-t border-line bg-ink py-10 md:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-gold">{vipPage.closing.label}</p>
            </Reveal>
            <h2
              id="vip-closing-title"
              className="display mt-4 text-[clamp(2.1rem,4.6vw,4.25rem)] leading-[1.02] tracking-[0.01em]"
            >
              <LineReveal>{vipPage.closing.title[0]}</LineReveal>
              <LineReveal delay={0.1} innerClassName="gold-text">
                {vipPage.closing.title[1]}
              </LineReveal>
            </h2>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="max-w-[40ch] text-[1.0625rem] leading-relaxed text-bone/85">{vipPage.closing.text}</p>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <OutlineButton href={official.vip} external className="w-full sm:w-auto sm:min-w-64">
                {vipPage.enquire}
              </OutlineButton>
              <ArrowLink to="contact">{ui.visitDirections}</ArrowLink>
            </div>
            <p className="mt-6 max-w-[52ch] text-[0.8125rem] leading-relaxed text-mute">{vipPage.closing.note}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
