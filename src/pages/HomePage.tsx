import { Atmosphere } from '../components/Atmosphere'
import { Contact } from '../components/Contact'
import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Vip } from '../components/Vip'

/** The approved homepage, unchanged apart from where its links lead. */
export function HomePage() {
  return (
    <>
      <Hero />
      <Atmosphere />
      <Gallery />
      <Vip />
      <Contact />
    </>
  )
}
