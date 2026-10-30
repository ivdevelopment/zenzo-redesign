import { PageHero } from '../components/PageHero'
import { OutlineButton } from '../components/ui/Buttons'
import { useCopy } from '../content/copy'
import { photos } from '../content/photos'

export function NotFoundPage() {
  const { notFoundPage, ui } = useCopy()
  return (
    <>
      <PageHero
        label={notFoundPage.label}
        title={notFoundPage.title}
        intro={notFoundPage.intro}
        photo={photos.pageLost}
        compact
      />
      <section aria-label={ui.nextSteps} className="bg-ink py-12">
        <div className="container-x">
          <OutlineButton to="home" className="w-full sm:w-auto sm:min-w-64">
            {ui.backHome}
          </OutlineButton>
        </div>
      </section>
    </>
  )
}
