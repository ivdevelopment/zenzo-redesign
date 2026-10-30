import type { PageRoute } from '../lib/routing'

/**
 * Site copy and facts.
 *
 * Two kinds of content, kept apart:
 *  - FACTS: taken from the venue's current website (zenzobar.be, reviewed 2026-10-28):
 *    address, the VIP services and their inclusions, the "established 2025 / 3 VIP areas /
 *    280+ capacity" figures, the description of sound, lighting and DJ talent.
 *  - CONCEPT COPY: short headlines for this redesign (hero label, section titles,
 *    "music — people — energy"). They set a mood; they promise no service, event or schedule.
 *
 * Deliberately left out: opening hours (the Dutch and English pages of the official site
 * disagree), email, phone, prices, DJ names, events.
 */

export const concept = {
  /** Footer attribution. Set to the designer’s name before sharing. */
  author: 'Ian Verlinden',
  officialSite: 'https://zenzobar.be/',
  officialSiteLabel: 'zenzobar.be',
}

/** Where real enquiries go: sections of the official website. */
export const official = {
  home: concept.officialSite,
  contact: `${concept.officialSite}#contact`,
  vip: `${concept.officialSite}#vip`,
  /** The official site's own Lost & Found link (pre-selects the subject in its contact form) */
  lostFound: `${concept.officialSite}#contact?type=lost-found`,
}

export const venue = {
  name: 'Zenzo',
  street: 'Eiermarkt 13',
  postcode: '8000',
  city: 'Brugge',
  country: 'Belgium',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Eiermarkt+13%2C+8000+Brugge%2C+Belgium',
  /** Zenzo’s own public profiles, as linked from zenzobar.be */
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/zenzo_club/' },
    { label: 'Facebook', href: 'https://www.facebook.com/p/ZenZo-61581402942673/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@zenzo_club' },
  ],
}

/** Which pages sit on which side of the header; labels live in copy.ts. */
export const navLayout: Record<'left' | 'right', readonly PageRoute[]> = {
  left: ['home', 'gallery', 'vip'],
  right: ['about', 'contact', 'lost-found'],
}

export const navAll: readonly PageRoute[] = [...navLayout.left, ...navLayout.right]

export const hero = {
  label: ['Bruges', 'Nightlife', 'Redefined'],
  tagline: ['Music', 'People', 'Energy'],
  cta: 'Discover the experience',
}

export const atmosphere = {
  label: 'The atmosphere',
  headline: ['More than a', 'night out'],
  body: 'Zenzo is the newest nightlife destination in Bruges, where music, luxury and unforgettable nights come together.',
  motif: ['Music', 'People', 'Energy', 'Zenzo'],
  /** Revealed by "About Zenzo" — the venue’s own description */
  more: 'Our vision is to blend cutting-edge music, sophisticated design and exceptional service — with a state-of-the-art sound system, immersive lighting design and carefully curated international DJ talent.',
  facts: [
    { value: '2025', label: 'Established' },
    { value: '3', label: 'VIP areas' },
    { value: '280+', label: 'Capacity' },
  ],
}

export const gallery = {
  label: 'Gallery',
  headline: ['Moments', 'at Zenzo'],
}

export const vip = {
  label: 'VIP experience',
  headline: ['A more', 'exclusive night'],
  intro: 'Elevate your night with our exclusive VIP services, designed for those who demand the best.',
  note: 'Services as listed on Zenzo’s current website. Availability and terms are set by the venue — this concept takes no bookings.',
  /** Services and inclusions as listed on zenzobar.be */
  items: [
    {
      id: 'bottle-service',
      number: '01',
      title: 'Bottle Service',
      photo: 'vipBottle',
      text: 'Premium spirits and champagne, served at your private table.',
      features: ['Exclusive liquor selection', 'Personalised mixology service', 'Dedicated VIP host'],
    },
    {
      id: 'private-lounge',
      number: '02',
      title: 'Private Lounge',
      photo: 'vipLounge',
      text: 'Exclusive lounge areas with privacy.',
      features: ['Reserved luxury seating', 'Private VIP entrance', 'Premium sound system'],
    },
    {
      id: 'private-party',
      number: '03',
      title: 'Private Party',
      photo: 'vipParty',
      text: 'Private party packages for events worth remembering.',
      features: ['Dedicated event coordinator', 'Customisable music and lighting', 'Exclusive VIP area access'],
    },
  ],
} as const

export const visit = {
  label: 'Visit us',
  note: 'This concept has no contact form and sends nothing anywhere — nothing you do here reaches Zenzo.',
  enquiriesLabel: 'Enquiries',
  enquiriesText: 'VIP reservations and private events — via the official site,',
  lostText: 'Lost property is handled by Zenzo through the same official site.',
}
