import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { pageTitle, useRoute, type RouteId } from './lib/routing'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { LostFoundPage } from './pages/LostFoundPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { VipPage } from './pages/VipPage'

function Page({ route }: { route: RouteId }) {
  switch (route) {
    case 'home':
      return <HomePage />
    case 'gallery':
      return <GalleryPage />
    case 'vip':
      return <VipPage />
    case 'about':
      return <AboutPage />
    case 'contact':
      return <ContactPage />
    case 'lost-found':
      return <LostFoundPage />
    default:
      return <NotFoundPage />
  }
}

export default function App() {
  const route = useRoute()
  const firstRender = useRef(true)

  // On every page change: set the title, go to the #anchor if there is one (else return to the top), and hand
  // focus to <main> so keyboard and screen-reader users start at the new page rather than the old link.
  // A direct visit to /page/#anchor is handled too: the browser tries to scroll before React has rendered the
  // page, so it is retried once the layout has settled.
  useEffect(() => {
    document.title = pageTitle(route)
    const hash = window.location.hash.slice(1)
    const toAnchor = () => document.getElementById(hash)?.scrollIntoView()
    if (hash && hash !== 'main') {
      requestAnimationFrame(toAnchor)
      const later = window.setTimeout(toAnchor, 500)
      return () => window.clearTimeout(later)
    }
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [route])

  return (
    // reducedMotion="user": Motion skips transform animations when the visitor
    // has asked their OS for reduced motion.
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <a
          href="#main"
          className="eyebrow fixed left-4 top-4 z-50 -translate-y-24 bg-gold px-4 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <div key={route} className="motion-safe:animate-fade">
            <Page route={route} />
          </div>
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  )
}
