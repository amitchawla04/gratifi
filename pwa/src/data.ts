import lisbon from './assets/scene-lisbon.svg'
import cinema from './assets/scene-cinema.svg'
import flight from './assets/scene-flight.svg'
import jacket from './assets/scene-jacket.svg'
import pool from './assets/scene-pool.svg'
import room from './assets/scene-room.svg'
import food from './assets/scene-food.svg'
import car from './assets/scene-car.svg'
import sHotel from './assets/stamp-hotel.svg'
import sPlane from './assets/stamp-plane.svg'
import sBalloon from './assets/stamp-balloon.svg'
import sCar from './assets/stamp-car.svg'
import sTakeaway from './assets/stamp-takeaway.svg'
import sDining from './assets/stamp-dining.svg'
import sTicket from './assets/stamp-ticket.svg'
import sBag from './assets/stamp-bag.svg'
import sMusic from './assets/stamp-music.svg'
import sGift from './assets/stamp-gift.svg'
import check from './assets/check.svg'
import clip from './assets/clip.svg'
import wordmark from './assets/wordmark-dark.svg'
import appIcon from './assets/app-icon.svg'

export const IMG = { lisbon, cinema, flight, jacket, pool, room, check, clip, wordmark, appIcon }
export const STAMP = { hotel: sHotel, plane: sPlane, balloon: sBalloon, car: sCar, takeaway: sTakeaway, dining: sDining, ticket: sTicket, bag: sBag, music: sMusic, gift: sGift }

export const MEMBER = { first: 'Sam', name: 'Sam Taylor', email: 'sam.taylor@example.com', tier: 'Gold', next: 'Platinum', tierTarget: 20000, memberSince: 2021 }
export const TODAY = 'Friday 7 May'
export const EXPIRY_DATE = 'Sunday 9 May'

export type Kind = 'hotel' | 'flight' | 'voucher' | 'ride' | 'dinner'
export type Item = {
  id: string; kind: Kind; title: string; sub: string; points: number; cash: number; img: string; pos?: string
  rating?: string; reviews?: string; area?: string; perks?: string[]; cancel?: string; dates?: string; nights?: number; room?: string
  cat?: string; tag?: string; detail?: string[]; code?: boolean; dateOptions?: string[]
}

export const HOTELS: Item[] = [
  { id: 'h-alfama', kind: 'hotel', title: 'Boutique hotel, Alfama', sub: 'Breakfast included', points: 8200, cash: 286, img: lisbon, pos: 'center 72%', rating: '4.7', reviews: '1,240 guest reviews', area: 'Alfama · 6 minutes’ walk to the river', perks: ['Breakfast included', 'Double room with river view', 'Free wifi'], cancel: 'Free until Tue 11 May', dates: 'Fri 14 to Sun 16 May', nights: 2, room: 'Double room, 2 guests', tag: 'Closest to the old town, and in your price range' },
  { id: 'h-chiado', kind: 'hotel', title: 'Rooftop pool, Chiado', sub: 'Near shops and cafés', points: 8900, cash: 312, img: pool, rating: '4.6', reviews: '860 guest reviews', area: 'Chiado · near shops and cafés', perks: ['Rooftop pool', 'Double room', 'Breakfast for £12 a day'], cancel: 'Free until Wed 12 May', dates: 'Fri 14 to Sun 16 May', nights: 2, room: 'Double room, 2 guests' },
  { id: 'h-graca', kind: 'hotel', title: 'Design hotel, Graça', sub: 'Late check-out', points: 7600, cash: 258, img: room, rating: '4.5', reviews: '510 guest reviews', area: 'Graça · quiet, with viewpoints', perks: ['Late check-out', 'Double room', 'Free wifi'], cancel: 'Free until Tue 11 May', dates: 'Fri 14 to Sun 16 May', nights: 2, room: 'Double room, 2 guests' },
]

export const FLIGHTS_HOME: Item[] = [
  { id: 'f-home-am', kind: 'flight', title: 'Lisbon to London', sub: 'Sun 16 May · 11:05 → 13:50 · direct', points: 7400, cash: 96, img: flight, cancel: 'Changes free up to 24 hours before', dates: 'Sun 16 May', room: '1 adult, cabin bag' },
  { id: 'f-home-pm', kind: 'flight', title: 'Lisbon to London', sub: 'Sun 16 May · 19:40 → 22:25 · direct', points: 8600, cash: 118, img: flight, cancel: 'Changes free up to 24 hours before', dates: 'Sun 16 May', room: '1 adult, cabin bag' },
]
export const FLIGHT_HOME_FROM = 7400

export const EXTRAS: Item[] = [
  { id: 'x-ride', kind: 'ride', title: 'Ride to the airport', sub: 'Fri 14 May, pick-up 05:30', points: 1800, cash: 42, img: car, dates: 'Fri 14 May, 05:30', room: 'Standard car, up to 3 people', cancel: 'Free until 2 hours before' },
  { id: 'x-dinner', kind: 'dinner', title: 'Dinner in Alfama', sub: 'Sat 15 May, table for two at 19:30', points: 1500, cash: 45, img: lisbon, pos: 'center 30%', dates: 'Sat 15 May, 19:30', room: 'Table for two', cancel: 'Free until 24 hours before' },
]

export const REWARDS: Item[] = [
  { id: 'r-cinema', kind: 'voucher', cat: 'Tickets', title: 'Cinema for two', sub: 'Two standard tickets', points: 2400, cash: 24, img: cinema, detail: ['Any 2D film, any day', 'Tickets arrive in the app straight away', 'Valid for six months'], code: true, cancel: 'Free until you use the code' },
  { id: 'r-hotel', kind: 'hotel', cat: 'Hotels', title: 'Stay in Lisbon', sub: 'Three hotels for your trip', points: 7600, cash: 258, img: lisbon, pos: 'center 70%' },
  { id: 'r-jacket', kind: 'voucher', cat: 'Shopping', title: 'Fashion gift card, £50', sub: 'For the jacket you saved', points: 5000, cash: 50, img: jacket, detail: ['Spend online or in store', 'Arrives by email in minutes', 'Use within 12 months'], code: true, cancel: 'Free until you use the code' },
  { id: 'r-takeaway', kind: 'voucher', cat: 'Food', title: 'Takeaway voucher, £15', sub: 'For your Friday night', points: 1500, cash: 15, img: food, detail: ['Works with partner takeaways', 'Arrives in the app straight away', 'Use within 6 months'], code: true, cancel: 'Free until you use the code' },
  { id: 'r-ny', kind: 'flight', cat: 'Flights', title: 'Flight to New York', sub: 'Return, economy', points: 30000, cash: 420, img: flight },
  { id: 'r-spa', kind: 'voucher', cat: 'Experiences', title: 'Spa day for two', sub: 'At partner spas', points: 9500, cash: 95, img: pool, detail: ['Choose from partner spas', 'Book the date you want', 'Use within 12 months'], code: true, cancel: 'Free until you use the code' },
]

export const OFFERS = [
  { id: 'o-rest', stamp: 'dining', title: '10% back at partner restaurants', sub: 'Until 31 May', why: 'You eat out most Fridays.', whyNeedsCard: true, isNew: true },
  { id: 'o-dbl', stamp: 'bag', title: 'Double points with partner brands', sub: 'Until 31 May', why: 'Open to every Gold member.' },
  { id: 'o-fest', stamp: 'ticket', title: 'Early access to summer festival tickets', sub: 'Opens Thu 13 May, 10:00 · Gold only', why: 'A Gold benefit. You bought gig tickets twice this year.', whyNeedsCard: true },
  { id: 'o-take', stamp: 'takeaway', title: '£5 off your next takeaway', sub: 'Orders over £20 · ends Sunday', why: 'Open to every member this week.' },
  { id: 'o-park', stamp: 'car', title: 'Airport parking upgrade', sub: 'Gold benefit · for your Lisbon trip', why: 'Your Lisbon flight leaves from Heathrow on Friday.' },
]

export const CATEGORIES = [
  { id: 'Hotels', stamp: 'hotel', badge: '2×' },
  { id: 'Flights', stamp: 'plane' },
  { id: 'Experiences', stamp: 'balloon' },
  { id: 'Food', stamp: 'takeaway' },
  { id: 'Tickets', stamp: 'ticket' },
  { id: 'Shopping', stamp: 'bag' },
  { id: 'Gift cards', stamp: 'gift' },
]

export const fmt = (n: number) => n.toLocaleString('en-GB')
export const pts = (n: number) => `${fmt(n)} points`
