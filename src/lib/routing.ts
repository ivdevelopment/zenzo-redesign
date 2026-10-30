/**
 * A very small path-based router.
 *
 * Why not hash routing or React Router: GitHub Pages serves static files, and the site's in-page
 * anchors (#about, #vip …) already use the hash. So every page is a real path
 * (`/<base>/gallery/`), the build writes one `index.html` per path (see vite.config.ts), and
 * this module only has to keep client-side navigation fast — a direct visit, a refresh or a
 * shared link all load the right page without any redirect trick.
 *
 * Languages: English lives at the root, Dutch under `nl/` with Dutch page slugs
 * (`/<base>/nl/galerij/`). The language is part of the URL, so there is no state to restore.
 */
import { useSyncExternalStore } from 'react'

export type Lang = 'en' | 'nl'
export const langs: readonly Lang[] = ['en', 'nl']

export type PageRoute = 'home' | 'gallery' | 'vip' | 'about' | 'contact' | 'lost-found'
export type RouteId = PageRoute | 'not-found'

/** Path of each page, relative to the language root. */
export const slugs: Record<PageRoute, Record<Lang, string>> = {
  home: { en: '', nl: '' },
  gallery: { en: 'gallery/', nl: 'galerij/' },
  vip: { en: 'vip/', nl: 'vip/' },
  about: { en: 'about/', nl: 'over-zenzo/' },
  contact: { en: 'contact/', nl: 'contact/' },
  'lost-found': { en: 'lost-found/', nl: 'gevonden-voorwerpen/' },
}

/** Page names, for the document title. */
const titles: Record<Lang, Record<RouteId, string>> = {
  en: { home: 'Zenzo', gallery: 'Gallery', vip: 'VIP Experience', about: 'About', contact: 'Contact', 'lost-found': 'Lost & Found', 'not-found': 'Page not found' },
  nl: { home: 'Zenzo', gallery: 'Galerij', vip: 'VIP-beleving', about: 'Over Zenzo', contact: 'Contact', 'lost-found': 'Gevonden voorwerpen', 'not-found': 'Pagina niet gevonden' },
}
const suffixes: Record<Lang, string> = { en: 'Unofficial Redesign Concept', nl: 'Onofficieel redesignconcept' }

/** Vite's base path: "/" locally, "/<repo>/" on GitHub Pages. Always ends with a slash. */
export const BASE = import.meta.env.BASE_URL

/** Path (relative to the base) of a page in a language. Dutch lives under `nl/`. */
export function pathFor(route: PageRoute, lang: Lang) {
  return `${lang === 'nl' ? 'nl/' : ''}${slugs[route][lang]}`
}

export function hrefFor(route: PageRoute, lang: Lang, hash?: string) {
  return `${BASE}${pathFor(route, lang)}${hash ? `#${hash}` : ''}`
}

export function parsePath(pathname: string): { lang: Lang; route: RouteId } {
  let rel: string
  if (pathname + '/' === BASE) rel = ''
  else if (pathname.startsWith(BASE)) rel = pathname.slice(BASE.length)
  else rel = pathname.replace(/^\//, '')
  rel = rel.replace(/index\.html$/, '').replace(/\/+$/, '')

  const lang: Lang = rel === 'nl' || rel.startsWith('nl/') ? 'nl' : 'en'
  if (lang === 'nl') rel = rel.slice(2).replace(/^\//, '')

  for (const [id, slug] of Object.entries(slugs)) {
    if (slug[lang].replace(/\/$/, '') === rel) return { lang, route: id as PageRoute }
  }
  return { lang, route: 'not-found' }
}

export function pageTitle(route: RouteId, lang: Lang) {
  const suffix = suffixes[lang]
  if (route === 'home') return `Zenzo — ${suffix}`
  return `${titles[lang][route]} — Zenzo (${suffix})`
}

const NAVIGATE_EVENT = 'zenzo:navigate'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(NAVIGATE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(NAVIGATE_EVENT, onChange)
  }
}

function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => BASE)
}

/** The route for the current URL. Re-renders on link clicks and on back/forward. */
export function useRoute(): RouteId {
  return parsePath(usePathname()).route
}

/** The language of the current URL. */
export function useLang(): Lang {
  return parsePath(usePathname()).lang
}

/** Client-side navigation to a URL produced by `hrefFor`. */
export function navigate(href: string) {
  const target = new URL(href, window.location.href)
  const samePage = target.pathname === window.location.pathname
  if (!samePage || target.hash !== window.location.hash) {
    window.history.pushState({}, '', target.pathname + target.search + target.hash)
  }
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}
