/**
 * Copy for the inner pages.
 *
 * Same rule as site.ts: facts come from the venue's own website (zenzobar.be, reviewed
 * 2026-10-28) and are worded close to it; the rest is short framing copy. Nothing here names
 * an event, a DJ, a date, a price, an opening time or a booking process.
 */
import { official } from './site'

export const galleryPage = {
  label: 'Gallery',
  title: ['Moments', 'at Zenzo'],
  intro: 'The atmosphere of a night out, in frames. Select any image to view it larger.',
  statementLabel: 'One frame at a time',
  statement: ['Unforgettable nights,', 'one frame at a time.'],
  note: 'Photographs from zenzobar.be, cropped and colour-graded for this concept. They carry no event names, dates or artists.',
}

export const vipPage = {
  label: 'VIP experience',
  title: ['VIP', 'Experience'],
  intro: 'Elevate your night with our exclusive VIP services, designed for those who demand the best.',
  enquire: 'Enquire at zenzobar.be',
  /** Services, descriptions and inclusions as listed on zenzobar.be */
  chapters: [
    {
      id: 'bottle-service',
      number: '01',
      title: ['Bottle', 'Service'],
      text: 'Enjoy our selection of premium spirits and champagne, served at your private table.',
      features: ['Exclusive liquor selection', 'Personalised mixology service', 'Dedicated VIP host'],
    },
    {
      id: 'private-lounge',
      number: '02',
      title: ['Private', 'Lounge'],
      text: 'Exclusive lounge areas with privacy and the best views.',
      features: ['Reserved luxury seating', 'Private VIP entrance', 'Premium sound system'],
    },
    {
      id: 'private-party',
      number: '03',
      title: ['Private', 'Party'],
      text: 'Host unforgettable events with our private party packages.',
      features: ['Dedicated event coordinator', 'Customisable music and lighting', 'Exclusive VIP area access'],
    },
  ],
  closing: {
    label: 'How to enquire',
    title: ['Three experiences.', 'One place to enquire.'],
    text: 'VIP reservations and private events are handled by Zenzo directly, through its official website.',
    note: 'This concept takes no bookings and shows no prices or availability — those are set by the venue.',
  },
}

export const aboutPage = {
  label: 'About Zenzo',
  title: ['About', 'Zenzo'],
  intro: 'The newest nightlife destination in Bruges, where music, luxury and unforgettable nights come together.',
  statement: ['Opening its doors to create', 'unforgettable nights.'],
  paragraphs: [
    'Our vision is to blend cutting-edge music, sophisticated design and exceptional service.',
    'Zenzo opened in 2025 on the Eiermarkt, with the aim of becoming the heartbeat of Brugge’s nightlife scene.',
  ],
  motif: [
    { word: 'Music', line: 'A state-of-the-art sound system and carefully curated international DJ talent.' },
    { word: 'People', line: 'Room for 280+ guests, and exceptional service as the stated aim.' },
    { word: 'Energy', line: 'Immersive lighting design that shapes the night.' },
  ],
  factsNote: 'Figures as published on zenzobar.be.',
  place: {
    label: 'Bruges',
    title: ['On the', 'Eiermarkt'],
    text: 'Zenzo is at Eiermarkt 13, 8000 Brugge, Belgium.',
  },
}

export const contactPage = {
  label: 'Contact',
  title: ['Find', 'Zenzo'],
  intro: 'Eiermarkt 13, 8000 Brugge, Belgium.',
  routing: [
    {
      label: 'General enquiries',
      text: 'Questions about the club go through the contact form on the official website.',
      action: 'Official contact form',
      href: official.contact,
    },
    {
      label: 'VIP & private events',
      text: 'VIP reservations and private party enquiries are handled by Zenzo directly.',
      action: 'VIP enquiries',
      href: official.vip,
    },
    {
      label: 'Lost & Found',
      text: 'Lost property has its own page here, and its own subject on the official form.',
      page: 'lost-found',
    },
    {
      label: 'Opening hours',
      text: 'Check the official website for current opening hours before you go.',
    },
  ],
  note: 'This concept has no contact form and sends nothing anywhere — nothing you do here reaches Zenzo.',
} as const

export const lostPage = {
  label: 'Lost & Found',
  title: ['Lost', '& Found'],
  intro: 'Left something behind after a night out?',
  statement: ['Lost property is handled by Zenzo,', 'through its official website.'],
  stepsLabel: 'On zenzobar.be',
  steps: [
    'Open the official contact form.',
    'Choose “Lost & Found” as the subject.',
    'Describe what you lost in your message.',
  ],
  action: 'Open the official form',
  note: 'This concept has no form and sends nothing anywhere.',
}

export const notFoundPage = {
  label: '404',
  title: ['Page', 'not found'],
  intro: 'That page doesn’t exist in this concept.',
}
