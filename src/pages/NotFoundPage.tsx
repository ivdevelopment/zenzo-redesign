import { PageHero } from '../components/PageHero'
import { OutlineButton } from '../components/ui/Buttons'
import { notFoundPage } from '../content/pages'
import { photos } from '../content/photos'

export function NotFoundPage() {
  return (
    <>
      <PageHero
        label={notFoundPage.label}
        title={notFoundPage.title}
        intro={notFoundPage.intro}
        photo={photos.pageLost}
        compact
      />
      <section aria-label="Next steps" className="bg-ink py-12">
        <div className="container-x">
          <OutlineButton to="home" className="w-full sm:w-auto sm:min-w-64">
            Back to the homepage
          </OutlineButton>
        </div>
      </section>
    </>
  )
}
