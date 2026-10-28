/**
 * A very small path-based router.
 *
 * Why not hash routing or React Router: GitHub Pages serves static files, and the site's in-page
 * anchors (#about, #vip …) already use the hash. So every page is a real path
 * (`/<base>/gallery/`), the build writes one `index.html` per path (see vite.config.ts), and
 * this module only has to keep client-side navigation fast — a direct visit, a refresh or a
 * shared link all load the right page without any redirect trick.
 */
import { useSyncExternalStore } from 'react'

export type PageRoute = 'home' | 'gallery' | 'vip' | 'about' | 'contact' | 'lost-found'
export type RouteId = PageRoute | 'not-found'

export const routes: Record<PageRoute, { path: string; title: string }> = {
  home: { path: '', title: 'Zenzo' },
  gallery: { path: 'gallery/', title: 'Gallery' },
  vip: { path: 'vip/', title: 'VIP Experience' },
  about: { path: 'about/', title: 'About' },
  contact: { path: 'contact/', title: 'Contact' },
  'lost-found': { path: 'lost-found/', title: 'Lost & Found' },
}

/** Vite's base path: "/" locally, "/<repo>/" on GitHub Pages. Always ends with a slash. */
export const BASE = import.meta.env.BASE_URL

export function hrefFor(route: PageRoute, hash?: string) {
  return `${BASE}${routes[route].path}${hash ? `#${hash}` : ''}`
}

export function routeFromPath(pathname: string): RouteId {
  let rel: string
  if (pathname + '/' === BASE) rel = ''
  else if (pathname.startsWith(BASE)) rel = pathname.slice(BASE.length)
  else rel = pathname.replace(/^\//, '')
  rel = rel.replace(/index\.html$/, '').replace(/\/+$/, '')

  for (const [id, route] of Object.entries(routes)) {
    if (route.path.replace(/\/$/, '') === rel) return id as PageRoute
  }
  return 'not-found'
}

export function pageTitle(route: RouteId) {
  const suffix = 'Unofficial Redesign Concept'
  if (route === 'home') return `Zenzo — ${suffix}`
  const name = route === 'not-found' ? 'Page not found' : routes[route].title
  return `${name} — Zenzo (${suffix})`
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

/** The route for the current URL. Re-renders on link clicks and on back/forward. */
export function useRoute(): RouteId {
  const pathname = useSyncExternalStore(subscribe, () => window.location.pathname, () => BASE)
  return routeFromPath(pathname)
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
