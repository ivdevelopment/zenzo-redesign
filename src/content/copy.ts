/**
 * All translatable copy, per language.
 *
 * English is assembled from site.ts and pages.ts (the copy the concept was written in) plus the
 * interface strings below; Dutch lives in nl.ts and must have exactly the same shape — the type
 * check enforces it. Facts (address, figures, links) never differ between languages and stay in site.ts.
 */
import { useLang, type Lang, type PageRoute } from '../lib/routing'
import { nl } from './nl'
import type { Photo } from './photos'
import { aboutPage, contactPage, galleryPage, lostPage, notFoundPage, vipPage } from './pages'
import { atmosphere, gallery, hero, visit, vip } from './site'

/** The same shape with literal types widened, so a translation can be checked against English. */
type Loosen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Loosen<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Loosen<T[K]> }
      : T

/** Interface strings: navigation, buttons, labels for assistive technology. */
const ui = {
  disclaimer: 'Unofficial redesign concept — Not affiliated with Zenzo.',
  skipToContent: 'Skip to content',
  homeLabel: 'Zenzo — home',
  navPrimary: 'Primary',
  navSecondary: 'Secondary',
  navMenu: 'Menu',
  navFooter: 'Footer',
  navFooterCompact: 'Footer (compact)',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  siteNavigation: 'Site navigation',
  officialSite: 'Official site',
  officialWebsite: 'Official website',
  backToTop: 'Back to top',
  location: 'Location',
  directions: 'Directions',
  getDirections: 'Get directions',
  opensMaps: ' (opens maps in a new tab)',
  opensOfficial: ' (opens the official website in a new tab)',
  findZenzoAt: 'Find Zenzo at ',
  aboutConcept: 'About this concept',
  conceptStudy: 'An independently created redesign study, not endorsed or operated by the venue.',
  attribution: 'Unofficial redesign concept by',
  credits: 'Credits & licences',
  creditRights:
    'The Zenzo logo and photographs belong to Zenzo and their respective rights holders. They are taken from zenzobar.be for this unofficial portfolio concept, cropped and colour-graded, and are not claimed as the designer’s own.',
  creditBruges: 'Bruges canal photograph:',
  creditUnsplash: ', Unsplash License.',
  creditType: 'Type: Cormorant Garamond and Manrope (SIL OFL). Icons: Lucide (ISC).',
  language: 'Language',
  changeLanguage: 'EN, change language',
  soon: 'Soon',
  frSoon: 'FR soon',
  illustrative: 'Illustrative',
  viewAll: 'View all',
  viewFullGallery: 'View full gallery',
  view: 'View',
  openImage: 'Open image {n} of {total}: {alt}',
  galleryViewer: 'Gallery viewer',
  close: 'Close',
  previousImage: 'Previous image',
  nextImage: 'Next image',
  photoBy: 'Photograph by {name} on Unsplash.',
  photoFrom: 'Photograph from zenzobar.be, colour-graded for this concept.',
  aboutZenzo: 'About Zenzo',
  readMore: 'Read more',
  discoverVip: 'Discover VIP',
  whatsIncluded: 'What’s included',
  hideIncluded: '{title}: hide what’s included',
  showIncluded: '{title}: show what’s included',
  allContact: 'All contact details',
  lostFound: 'Lost & Found',
  contactDirections: 'Contact & directions',
  visitDirections: 'Visit & directions',
  exploreGallery: 'Explore the gallery',
  theVipExperience: 'The VIP experience',
  backHome: 'Back to the homepage',
  nextSteps: 'Next steps',
  theVenue: 'The venue',
  musicPeopleEnergy: 'Music, people, energy',
  venueFacts: 'Venue facts',
  photographs: 'Photographs',
  whereToAsk: 'Where to ask',
  visitUs: 'Visit us',
  scrollToContent: 'Scroll to content',
  country: 'Belgium',
}

/** Page names, as they appear in the navigation. */
const navLabels: Record<PageRoute, string> = {
  home: 'Home',
  gallery: 'Gallery',
  vip: 'VIP Experience',
  about: 'About',
  contact: 'Contact',
  'lost-found': 'Lost & Found',
}

const en = {
  alts: {} as Record<string, string>, ui, navLabels, hero, atmosphere, gallery, vip, visit, galleryPage, vipPage, aboutPage, contactPage, lostPage, notFoundPage }

export type Copy = Loosen<typeof en>

/** The language switcher: English and Dutch exist; French is announced but disabled. */
export const languages = [
  { code: 'EN', lang: 'en', label: 'English' },
  { code: 'NL', lang: 'nl', label: 'Nederlands' },
] as const

export const copy: Record<Lang, Copy> = { en, nl }

export function useCopy() {
  return copy[useLang()]
}

/** Replace `{name}` placeholders. */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

/** Alt text for a photograph in the given language (English is stored on the photo itself). */
export function altFor(photo: Photo, lang: Lang) {
  return lang === 'nl' ? (nl.alts[photo.key] ?? photo.alt) : photo.alt
}
