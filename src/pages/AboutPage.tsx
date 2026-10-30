import { PageHero } from '../components/PageHero'
import { ArrowLink, OutlineButton } from '../components/ui/Buttons'
import { Picture } from '../components/ui/Picture'
import { ClipFrame, LineReveal, Reveal } from '../components/ui/Reveal'
import { photos, type Photo } from '../content/photos'
import { useCopy } from '../content/copy'
import { venue } from '../content/site'

/** One image per word of the MUSIC / PEOPLE / ENERGY motif, in three different grades. */
const motifPhotos: Photo[] = [photos.galRingDetail, photos.galArmsNoir, photos.galLaserLines]
const motifFrames = ['aspect-[5/4]', 'aspect-[5/4] md:aspect-[4/5]', 'aspect-[5/4]']

function CityCredit({ className = '' }: { className?: string }) {
  const { ui } = useCopy()
  const credit = photos.cityTall.credit
  return (
    <p className={`eyebrow !text-[0.5625rem] !tracking-[0.16em] text-bone/60 ${className}`}>
      {ui.illustrative} ·{' '}
      <a href={credit?.profileUrl} target="_blank" rel="noopener noreferrer" className="link-line hover:text-bone">
        {credit?.name}
      </a>{' '}
      / Unsplash
    </p>
  )
}

export function AboutPage() {
  const { aboutPage, atmosphere, ui } = useCopy()
  return (
    <>
      <PageHero
        label={aboutPage.label}
        title={aboutPage.title}
        intro={aboutPage.intro}
        photo={photos.pageAbout}
        focus="object-[50%_30%]"
      />

      {/* The oversized statement */}
      <section aria-labelledby="about-statement" className="border-b border-line bg-ink py-12 md:py-20">
        <div className="container-x">
          <h2
            id="about-statement"
            className="display max-w-[22ch] text-balance text-[clamp(2.3rem,6vw,5.5rem)] leading-[1] tracking-[0.005em]"
          >
            <LineReveal>{aboutPage.statement[0]}</LineReveal>
            <LineReveal delay={0.1} innerClassName="gold-text">
              {aboutPage.statement[1]}
            </LineReveal>
          </h2>
        </div>
      </section>

      {/* Image / text composition: a black-and-white frame with an ember inset crossing its corner */}
      <section aria-label={ui.theVenue} className="bg-ink py-12 md:py-20">
        <div className="container-x grid items-center gap-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="relative lg:col-span-7">
            <ClipFrame>
              <div className="relative aspect-[4/3] overflow-hidden bg-coal md:aspect-[16/10]">
                <Picture
                  photo={photos.atmoMain}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-gold/30 md:inset-3" />
              </div>
            </ClipFrame>
            <ClipFrame className="absolute -bottom-6 right-4 z-10 w-[42%] max-w-72 md:-bottom-10 md:right-[-2rem]">
              <div className="aspect-[4/3] border border-gold/45 bg-ink">
                <Picture photo={photos.atmoInset} sizes="(min-width: 1024px) 24vw, 42vw" alt="" className="h-full w-full object-cover" />
              </div>
            </ClipFrame>
          </div>

          <div className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <Reveal>
              <p className="eyebrow text-gold">{atmosphere.label}</p>
              <div className="mt-4 space-y-3">
                {aboutPage.paragraphs.map((text) => (
                  <p key={text} className="max-w-[36ch] text-[1.0625rem] leading-[1.55] text-bone/85">
                    {text}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MUSIC / PEOPLE / ENERGY */}
      <section aria-labelledby="motif-title" className="border-y border-line bg-coal py-10 md:py-16">
        <div className="container-x">
          <h2 id="motif-title" className="sr-only">
            {ui.musicPeopleEnergy}
          </h2>
          <ol className="grid gap-8 md:grid-cols-3 md:gap-x-6">
            {aboutPage.motif.map((item, i) => (
              <Reveal as="li" key={item.word} delay={i * 0.08} className="md:[&:nth-child(2)]:mt-12">
                <div className={`relative isolate overflow-hidden bg-ink ${motifFrames[i]}`}>
                  <Picture
                    photo={motifPhotos[i]}
                    sizes="(min-width: 768px) 32vw, 100vw"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Like the homepage VIP covers: the word and number are set over the foot of the photograph */}
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/90 via-transparent via-55% to-ink/30" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-gold/30" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
                    <h3 className="display text-[clamp(2.4rem,4vw,3.5rem)] uppercase leading-none tracking-[0.06em]">{item.word}</h3>
                    <span className="display text-[1.75rem] leading-none tabular-nums text-gold-soft">0{i + 1}</span>
                  </div>
                </div>
                <p className="mt-4 max-w-[34ch] text-[1rem] leading-relaxed text-bone/80">{item.line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Published figures */}
      <section aria-label={ui.venueFacts} className="bg-ink py-10 md:py-16">
        <div className="container-x">
          <dl className="grid grid-cols-3 border-y border-line-strong">
            {atmosphere.facts.map((fact) => (
              <Reveal key={fact.label} className="border-r border-line py-6 pl-4 first:pl-0 last:border-r-0 md:py-9 md:pl-8">
                <dd className="display text-[clamp(2.4rem,7vw,6.5rem)] leading-none tabular-nums text-gold-soft">{fact.value}</dd>
                <dt className="eyebrow mt-3 text-mute">{fact.label}</dt>
              </Reveal>
            ))}
          </dl>
          <p className="mt-4 text-[0.8125rem] text-mute">{aboutPage.factsNote}</p>
        </div>
      </section>

      {/* Bruges context */}
      <section aria-labelledby="place-title" className="border-t border-line bg-ink py-12 md:py-20">
        <div className="container-x grid items-end gap-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <ClipFrame>
              <div className="relative aspect-[4/5] overflow-hidden bg-coal max-md:aspect-[5/4]">
                <Picture
                  photo={photos.cityTall}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
                />
              </div>
            </ClipFrame>
            <CityCredit className="mt-3" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="eyebrow text-gold">{aboutPage.place.label}</p>
            </Reveal>
            <h2 id="place-title" className="display mt-4 text-[clamp(2.4rem,5.2vw,4.75rem)] uppercase leading-[0.98] tracking-[0.03em]">
              {aboutPage.place.title.map((line, i) => (
                <LineReveal key={line} delay={i * 0.1}>
                  {line}
                </LineReveal>
              ))}
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-bone/85">{aboutPage.place.text}</p>
              <address className="mt-4 text-sm not-italic text-smoke">
                {venue.street}, {venue.postcode} {venue.city}, {ui.country}
              </address>
              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <OutlineButton to="contact" className="w-full sm:w-auto sm:min-w-64">
                  {ui.visitDirections}
                </OutlineButton>
                <ArrowLink to="gallery">{ui.exploreGallery}</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
