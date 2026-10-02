// All member data here is invented for the demo. Card terms come from Barclaycard's public pages (checked 28 Sep 2026).
import lisbon from '../../src/assets/scene-lisbon.svg'
import cinema from '../../src/assets/scene-cinema.svg'
import flight from '../../src/assets/scene-flight.svg'
import jacket from '../../src/assets/scene-jacket.svg'
import pool from '../../src/assets/scene-pool.svg'
import room from '../../src/assets/scene-room.svg'
import food from '../../src/assets/scene-food.svg'
import car from '../../src/assets/scene-car.svg'
import sHotel from '../../src/assets/stamp-hotel.svg'
import sPlane from '../../src/assets/stamp-plane.svg'
import sBalloon from '../../src/assets/stamp-balloon.svg'
import sCar from '../../src/assets/stamp-car.svg'
import sTakeaway from '../../src/assets/stamp-takeaway.svg'
import sDining from '../../src/assets/stamp-dining.svg'
import sTicket from '../../src/assets/stamp-ticket.svg'
import sBag from '../../src/assets/stamp-bag.svg'
import sMusic from '../../src/assets/stamp-music.svg'
import sGift from '../../src/assets/stamp-gift.svg'
import clip from '../../src/assets/clip.svg'
import appIcon from '../../src/assets/app-icon.svg'

export const IMG = { lisbon, cinema, flight, jacket, pool, room, food, car, clip, appIcon }
export const STAMP: Record<string, string> = { hotel: sHotel, plane: sPlane, balloon: sBalloon, car: sCar, takeaway: sTakeaway, dining: sDining, ticket: sTicket, bag: sBag, music: sMusic, gift: sGift }

export const TODAY_ISO = '2026-09-28'
export const TODAY = 'Monday 28 September'
export const STATEMENT_ISO = '2026-09-18'
export const DUE = 'Mon 12 Oct'
export const NEXT_STATEMENT = 'Sun 18 Oct'

export const MEMBER = { first: 'Sam', name: 'Sam Taylor', email: 'sam.taylor@example.com', phone: '07••• ••• 482', address: 'London SW4', company: 'Taylor & Reid Studio Ltd' }

// ---------- money helpers ----------
export const gbp = (n: number, dp = 2) => (n < 0 ? '−' : '') + '£' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp })
export const gbp0 = (n: number) => gbp(n, Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2)
export const fmt = (n: number) => Math.round(n).toLocaleString('en-GB')
export const r2 = (n: number) => Math.round(n * 100) / 100
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function dayLabel(iso: string) {
  if (iso === TODAY_ISO) return 'Today'
  if (iso === '2026-09-27') return 'Yesterday'
  const d = new Date(iso + 'T12:00:00Z')
  return `${DAYS[d.getUTCDay()]}\u00a0${d.getUTCDate()}\u00a0${MONTHS[d.getUTCMonth()]}`
}

// ---------- cards ----------
export type RewardType = 'avios' | 'cashback' | 'amazon' | 'none' | 'biz-cashback' | 'biz-monthly'
export type CardId = 'avios-plus' | 'avios' | 'rewards' | 'amazon' | 'platinum' | 'forward' | 'premium-plus' | 'select-cashback' | 'select-charge'
export type Txn = { id: string; date: string; merchant: string; cat: string; amount: number; pending?: boolean; note?: string; online?: boolean; abroad?: boolean; by?: 'gratifi' }

export type Card = {
  id: CardId; name: string; short: string; group: 'Travel' | 'Cashback' | 'Low rate' | 'Business'; business?: boolean
  /** Charge card: the statement balance is paid in full every month. */
  charge?: boolean
  /** Fees charged on the September statement (count towards the minimum payment). */
  stmtFees?: number
  network: 'Visa' | 'Mastercard'
  pitch: string; face: [string, string]; ink: string; last4: string
  reward: RewardType; rate?: number; rateText: string
  fee: string; purchaseRate: string; apr: string
  limit: number; stmt: number; txns: Txn[]; opened: string
  /** Previous balance and payments on the September statement. */
  prev: [number, number]
  benefits: { ic: string; t: string; s: string }[]
  source: string
}

let n = 0
const t = (date: string, merchant: string, cat: string, amount: number, extra: Partial<Txn> = {}): Txn => ({ id: 't' + (++n), date, merchant, cat, amount, ...extra })

const personal = (): Txn[] => [
  t('2026-09-28', 'Greenleaf Grocers', 'Groceries', 46.20, { pending: true }),
  t('2026-09-28', 'City Rail', 'Transport', 3.10, { pending: true }),
  t('2026-09-27', 'Corner Café', 'Eating out', 8.40),
  t('2026-09-26', 'Marlow & Finch', 'Eating out', 72.50),
  t('2026-09-25', 'Streamly', 'Subscriptions', 10.99, { online: true }),
  t('2026-09-24', 'Hearth & Co', 'Home', 138.00),
  t('2026-09-23', 'Pantry Market', 'Groceries', 61.35),
  t('2026-09-22', 'Brightline Energy', 'Bills', 84.00, { online: true }),
  t('2026-09-21', 'Fieldhouse Coffee', 'Eating out', 4.20),
  t('2026-09-19', 'Northway Air', 'Travel', 186.40, { online: true, note: 'London to Lisbon, Fri 16 Oct' }),
  t('2026-09-17', 'Volt Electricals', 'Shopping', 649.00),
  t('2026-09-15', 'Pantry Market', 'Groceries', 54.80),
  t('2026-09-14', 'Gym & Tonic', 'Health', 45.00),
  t('2026-09-10', 'Paper & Page', 'Shopping', 18.99),
  t('2026-09-06', 'Marlow & Finch', 'Eating out', 58.00),
  t('2026-09-04', 'City Rail', 'Transport', 42.60),
  t('2026-09-02', 'Greenleaf Grocers', 'Groceries', 38.75),
]
const biz = (): Txn[] => [
  t('2026-09-28', 'Northway Rail', 'Travel', 142.80, { pending: true, online: true }),
  t('2026-09-26', 'Hive Coworking', 'Office', 320.00),
  t('2026-09-25', 'Cloudnest Hosting', 'Software', 89.00, { online: true }),
  t('2026-09-24', 'Marlow & Finch', 'Client meals', 96.40),
  t('2026-09-22', 'Designbox', 'Software', 54.00, { online: true }),
  t('2026-09-21', 'Northway Air', 'Travel', 412.60, { online: true, note: 'London to Amsterdam, Tue 6 Oct' }),
  t('2026-09-19', 'Printworks', 'Office', 68.50),
  t('2026-09-15', 'Cityline Taxis', 'Travel', 38.20),
  t('2026-09-11', 'Stationery Co', 'Office', 46.90),
  t('2026-09-05', 'Designbox', 'Software', 54.00, { online: true }),
]
const pick = (list: Txn[], names: string[]) => list.filter(x => names.includes(x.merchant + '|' + x.date) || names.includes(x.merchant))

const S75 = { ic: 'shield', t: 'Purchase protection', s: 'Section 75 cover on single purchases from £100 to £30,000' }
const ENT = { ic: 'ticket', t: 'Barclaycard Entertainment', s: 'Early access and 10% off tickets at selected festivals' }

export const CARDS: Card[] = [
  {
    prev: [1112.10, 1112.10],
    id: 'avios-plus', network: 'Mastercard', stmtFees: 20, name: 'Barclaycard Avios Plus', short: 'Avios Plus', group: 'Travel', pitch: '1.5 Avios per £1 · £20 a month',
    face: ['#0E1B2C', '#2B4A6B'], ink: '#fff', last4: '4821', reward: 'avios', rate: 1.5, rateText: '1.5 Avios per £1',
    fee: '£20 a month', purchaseRate: '29.9% p.a. variable', apr: '80.1% APR representative (variable), includes the monthly fee',
    limit: 9000, stmt: 1208.40, opened: '2025-02-04',
    txns: [...personal(), t('2026-09-18', 'Card fee, September', 'Card fees', 20.00)],
    benefits: [{ ic: 'plane', t: 'Upgrade voucher', s: 'Spend £10,000 in a card year for a cabin upgrade voucher, or take 7,000 Avios' }, { ic: 'sofa', t: 'Airport lounges', s: 'Over 1,000 airport lounges at £18.50 a pass' }, S75, ENT],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards/avios-plus',
  },
  {
    prev: [0, 0],
    id: 'avios', network: 'Mastercard', name: 'Barclaycard Avios', short: 'Avios', group: 'Travel', pitch: '1 Avios per £1 · no monthly fee',
    face: ['#0D3B66', '#2A7AB8'], ink: '#fff', last4: '3307', reward: 'avios', rate: 1, rateText: '1 Avios per £1',
    fee: 'No monthly fee', purchaseRate: '29.9% p.a. variable', apr: '29.9% APR representative (variable)',
    limit: 6000, stmt: 257.85, opened: '2026-08-02',
    txns: pick(personal(), ['Greenleaf Grocers|2026-09-28', 'City Rail|2026-09-28', 'Corner Café', 'Marlow & Finch|2026-09-26', 'Pantry Market|2026-09-23', 'Fieldhouse Coffee', 'Northway Air', 'Pantry Market|2026-09-15', 'Gym & Tonic', 'Paper & Page']),
    benefits: [{ ic: 'gift', t: 'Welcome bonus', s: '5,000 Avios when you spend £1,000 in your first three months' }, { ic: 'plane', t: 'Upgrade voucher', s: 'Spend £20,000 in a card year for a cabin upgrade voucher, or take 7,000 Avios' }, S75, ENT],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards/avios',
  },
  {
    prev: [840.30, 840.30],
    id: 'rewards', network: 'Visa', name: 'Barclaycard Rewards', short: 'Rewards', group: 'Cashback', pitch: '0.25% cashback · no fees abroad',
    face: ['#0E5A61', '#22A0A8'], ink: '#fff', last4: '6190', reward: 'cashback', rate: 0.0025, rateText: '0.25% cashback',
    fee: 'No annual fee', purchaseRate: '28.9% p.a. variable', apr: '28.9% APR representative (variable)',
    limit: 4500, stmt: 912.60, opened: '2024-06-11', txns: personal(),
    benefits: [{ ic: 'globe', t: 'No fees abroad', s: 'No charge on spending or cash withdrawals outside the UK' }, { ic: 'wallet', t: 'Cashback once a year', s: 'Paid to your statement once a year, or when you ask' }, S75, ENT],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-rewards',
  },
  {
    prev: [320.15, 320.15],
    id: 'amazon', network: 'Visa', name: 'Amazon Barclaycard', short: 'Amazon', group: 'Cashback', pitch: '1% back at Amazon',
    face: ['#2B2D33', '#4D525C'], ink: '#fff', last4: '7745', reward: 'amazon', rate: 0.005, rateText: '1% at Amazon, 0.5% elsewhere',
    fee: 'No monthly fee', purchaseRate: '28.9% p.a. variable', apr: '28.9% APR representative (variable)',
    limit: 3000, stmt: 486.20, opened: '2026-05-10',
    txns: [t('2026-09-27', 'Amazon.co.uk', 'Shopping', 34.99, { online: true }), t('2026-09-24', 'Amazon.co.uk', 'Home', 129.00, { online: true }), ...pick(personal(), ['Greenleaf Grocers|2026-09-28', 'Corner Café', 'Marlow & Finch|2026-09-26', 'Pantry Market|2026-09-23', 'Streamly', 'Fieldhouse Coffee', 'Northway Air', 'Pantry Market|2026-09-15', 'Paper & Page']), t('2026-09-16', 'Amazon.co.uk', 'Shopping', 22.49, { online: true })],
    benefits: [{ ic: 'clock', t: '0% on purchases', s: 'For your first six months, until Tue 10 Nov' }, { ic: 'gift', t: 'Amazon rewards', s: '1% back at Amazon, 0.5% everywhere else (0.25% after 12 months)' }, S75, ENT],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards',
  },
  {
    prev: [3960.50, 600],
    id: 'platinum', network: 'Visa', name: 'Barclaycard Platinum', short: 'Platinum', group: 'Low rate', pitch: '0% on balance transfers for up to 29 months',
    face: ['#AEB6BF', '#E3E7EB'], ink: '#0E1A2B', last4: '9052', reward: 'none', rateText: 'No rewards',
    fee: 'No annual fee', purchaseRate: '24.9% p.a. variable', apr: '24.9% APR representative (variable)',
    limit: 5500, stmt: 3812.40, opened: '2024-10-14',
    txns: [...pick(personal(), ['Greenleaf Grocers|2026-09-28', 'City Rail|2026-09-28', 'Corner Café', 'Marlow & Finch|2026-09-26', 'Pantry Market|2026-09-23', 'Brightline Energy', 'Fieldhouse Coffee', 'Northway Air', 'Pantry Market|2026-09-15', 'Paper & Page', 'City Rail|2026-09-04']), t('2026-09-21', 'Volt Electricals', 'Shopping', 649.00)],
    benefits: [{ ic: 'refresh', t: '0% balance transfer', s: '£3,360.50 left at 0% until Sun 14 Mar 2027' }, S75, ENT],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards',
  },
  {
    prev: [164.20, 164.20],
    id: 'forward', network: 'Visa', name: 'Barclaycard Forward', short: 'Forward', group: 'Low rate', pitch: 'Rate drops as you pay on time',
    face: ['#2A9FD6', '#8AD2F2'], ink: '#0E1A2B', last4: '2468', reward: 'none', rateText: 'No rewards',
    fee: 'No annual fee', purchaseRate: '33.9% p.a. variable', apr: '33.9% APR representative (variable)',
    limit: 900, stmt: 188.45, opened: '2026-03-03',
    txns: pick(personal(), ['Greenleaf Grocers|2026-09-28', 'City Rail|2026-09-28', 'Corner Café', 'Streamly', 'Pantry Market|2026-09-23', 'Fieldhouse Coffee', 'Northway Air', 'Paper & Page', 'City Rail|2026-09-04']),
    benefits: [{ ic: 'target', t: 'Price Promise', s: 'Rate down 3% after year one and 2% more after year two when you pay on time and stay in your limit' }, { ic: 'bell', t: 'Payment alerts', s: 'Text or email alerts when a payment is due' }, S75],
    source: 'https://www.barclaycard.co.uk/personal/credit-cards/forward',
  },
  {
    prev: [2870.10, 2870.10],
    id: 'premium-plus', network: 'Mastercard', name: 'Barclaycard Premium Plus', short: 'Premium Plus', group: 'Business', business: true, pitch: '0.5% cashback · 0.99% fee abroad',
    face: ['#121214', '#35353B'], ink: '#fff', last4: '5108', reward: 'biz-cashback', rate: 0.005, rateText: '0.5% cashback, up to £400 a year',
    fee: '£150 a year per account, extra cards free', purchaseRate: '19.6% p.a. variable', apr: '56.0% APR representative (variable), includes the annual fee',
    limit: 15000, stmt: 3120.44, opened: '2023-11-20', txns: biz(),
    benefits: [{ ic: 'shield', t: 'Business travel insurance', s: 'When the whole trip is paid with the card' }, { ic: 'globe', t: '0.99% fee abroad', s: 'Instead of the usual 2.99%' }, { ic: 'wallet', t: '0.5% cashback', s: 'Up to £400 a year' }],
    source: 'https://www.barclaycard.co.uk/business/cards/credit-cards/premium-plus',
  },
  {
    prev: [2190.00, 2190.00],
    id: 'select-cashback', network: 'Mastercard', name: 'Barclaycard Select Cashback', short: 'Select Cashback', group: 'Business', business: true, pitch: '1% cashback, uncapped · no annual fee',
    face: ['#10365C', '#34689A'], ink: '#fff', last4: '8836', reward: 'biz-monthly', rate: 0.01, rateText: '1% cashback, uncapped',
    fee: 'No annual fee', purchaseRate: '27.5% p.a. variable', apr: '27.5% APR representative (variable)',
    limit: 8000, stmt: 2412.43, opened: '2025-03-10',
    txns: [...pick(biz(), ['Northway Rail', 'Hive Coworking', 'Cloudnest Hosting', 'Marlow & Finch', 'Designbox|2026-09-22', 'Northway Air', 'Printworks', 'Cityline Taxis', 'Stationery Co']), t('2026-09-18', 'Cashback for this statement month', 'Cashback', -24.37)],
    benefits: [{ ic: 'wallet', t: '1% cashback, uncapped', s: 'Paid monthly as a statement credit' }, { ic: 'users', t: 'Free employee cards', s: 'Set a limit for each cardholder' }, { ic: 'shield', t: 'Purchase protection', s: 'Up to £6,000 a claim, £2,500 an item' }],
    source: 'https://www.barclaycard.co.uk/business/cards/credit-cards/select-cashback',
  },
  {
    prev: [1890.00, 1890.00],
    id: 'select-charge', network: 'Mastercard', charge: true, name: 'Barclaycard Select Charge', short: 'Select Charge', group: 'Business', business: true, pitch: 'Pay in full each month · £42 a year',
    face: ['#3A4250', '#6A7485'], ink: '#fff', last4: '1374', reward: 'none', rateText: 'No rewards',
    fee: '£42 a year, no extra cardholder fees', purchaseRate: 'No interest: the balance is paid in full each month', apr: '3.6% APR representative (variable), reflects the annual fee',
    limit: 10000, stmt: 1640.80, opened: '2024-01-15',
    txns: [...pick(biz(), ['Cloudnest Hosting', 'Designbox|2026-09-22', 'Northway Air', 'Printworks', 'Cityline Taxis', 'Stationery Co']), t('2026-09-16', 'Hive Coworking', 'Office', 320.00)],
    benefits: [{ ic: 'clock', t: 'Up to 38 days to pay', s: 'Interest-free, paid in full each month' }, { ic: 'users', t: 'No extra cardholder fees', s: 'Cards for your team at no cost' }, { ic: 'shield', t: 'Purchase and misuse cover', s: 'Purchase protection and cardholder misuse insurance' }],
    source: 'https://www.barclaycard.co.uk/business/cards/charge-cards/select',
  },
]
export const card = (id: string) => CARDS.find(c => c.id === id) || CARDS[0]

// ---------- per-card programme facts (demo figures) ----------
export const PROGRAMME: Record<CardId, any> = {
  'avios-plus': { aviosBalance: 48210, yearSpend: 8160, voucherAt: 10000, yearEnds: 'Wed 3 Feb 2027', lounge: 18.5, monthsIn: 7.8 },
  avios: { aviosBalance: 3915, yearSpend: 640, voucherAt: 20000, yearEnds: 'Sun 1 Aug 2027', welcome: { target: 1000, spent: 640, by: 'Sun 1 Nov', bonus: 5000 } },
  rewards: { cashback: 31.64, since: 'January' },
  amazon: { earned: 24.18, zeroUntil: 'Tue 10 Nov', rateDrops: 'Mon 10 May 2027' },
  platinum: { bt: 3360.50, btUntil: 'Sun 14 Mar 2027', btMonths: 6, purchases: 451.90 },
  forward: { onTime: 5, needed: 10, from: 33.9, to: 30.9, anniversary: 'Wed 3 Mar 2027' },
  'premium-plus': { cashback: 212.40, cap: 400, employees: [{ name: 'Priya Shah', last4: '1190', limit: 2000, spent: 640.20 }, { name: 'Tom Reid', last4: '5532', limit: 1500, spent: 212.75 }] },
  'select-cashback': { threshold: 2000, monthEnds: 'Sun 18 Oct', lastPaid: 24.37 },
  'select-charge': { days: 38 },
}

// ---------- statements (older months are demo summaries) ----------
export const OLD_STATEMENTS: { month: string; date: string; f: number; iso: string }[] = [
  { month: 'August 2026', date: 'Tue 18 Aug', f: 0.92, iso: '2026-08-18' }, { month: 'July 2026', date: 'Sat 18 Jul', f: 1.08, iso: '2026-07-18' }, { month: 'June 2026', date: 'Thu 18 Jun', f: 0.85, iso: '2026-06-18' },
  { month: 'May 2026', date: 'Mon 18 May', f: 1.14, iso: '2026-05-18' }, { month: 'April 2026', date: 'Sat 18 Apr', f: 0.97, iso: '2026-04-18' },
]
// A card's first statement comes on the first 18th at least three weeks after opening. August matches September's previous balance.
export const statementsFor = (c: Card) => OLD_STATEMENTS.filter(o => o.iso > c.opened && (Date.parse(o.iso) - Date.parse(c.opened)) > 20 * 864e5).map(o => ({ ...o, bal: Math.round(c.prev[0] * (o.f / 0.92) * 100) / 100 }))

// ---------- Gratifi content: the layer Reward360 adds ----------
export type Item = { id: string; cat: string; title: string; sub: string; price: number; img: string; pos?: string; rating?: string; perks?: string[]; cancel: string; when?: string; partnerRate: number; biz?: boolean }
export const CONTENT: Item[] = [
  { id: 'h-rio', cat: 'Hotels', title: 'Casa do Rio, Alfama', sub: '2 nights · Fri 16 to Sun 18 Oct', price: 286, img: lisbon, pos: 'center 72%', rating: '4.7', perks: ['Breakfast included', 'Double room with river view', 'Six minutes’ walk to the river'], cancel: 'Free cancellation until Tue 13 Oct', when: 'Fri 16 to Sun 18 Oct', partnerRate: 0.05 },
  { id: 'h-chiado', cat: 'Hotels', title: 'Rooftop pool hotel, Chiado', sub: '2 nights · Fri 16 to Sun 18 Oct', price: 312, img: pool, rating: '4.6', perks: ['Rooftop pool', 'Double room', 'Near shops and cafés'], cancel: 'Free cancellation until Wed 14 Oct', when: 'Fri 16 to Sun 18 Oct', partnerRate: 0.05 },
  { id: 'h-graca', cat: 'Hotels', title: 'Design hotel, Graça', sub: '2 nights · Fri 16 to Sun 18 Oct', price: 258, img: room, rating: '4.5', perks: ['Late check-out', 'Double room', 'Quiet, with viewpoints'], cancel: 'Free cancellation until Tue 13 Oct', when: 'Fri 16 to Sun 18 Oct', partnerRate: 0.05 },
  { id: 'x-food', cat: 'Experiences', title: 'Lisbon food tour for two', sub: 'Sat 17 Oct · 3 hours in Alfama', price: 96, img: food, perks: ['Eight tastings', 'Small group, local guide', 'Starts 11:00'], cancel: 'Free cancellation until 24 hours before', when: 'Sat 17 Oct, 11:00', partnerRate: 0.08 },
  { id: 'x-ride', cat: 'Experiences', title: 'Ride to Heathrow', sub: 'Fri 16 Oct · pick-up 05:30', price: 42, img: car, perks: ['Standard car, up to 3 people', 'Driver tracks your flight'], cancel: 'Free cancellation until 2 hours before', when: 'Fri 16 Oct, 05:30', partnerRate: 0.05 },
  { id: 'x-spa', cat: 'Experiences', title: 'Spa day for two', sub: 'Partner spas · pick your date', price: 95, img: pool, pos: 'center 30%', perks: ['Pool, sauna and a 50-minute treatment each', 'Book any date in the next 12 months'], cancel: 'Free until you book a date', partnerRate: 0.08 },
  { id: 'd-alfama', cat: 'Dining', title: 'Table for two in Alfama', sub: 'Sat 17 Oct · 19:30', price: 0, img: lisbon, pos: 'center 25%', perks: ['Free to book', '10% back when you pay with your card'], cancel: 'Free cancellation until 24 hours before', when: 'Sat 17 Oct, 19:30', partnerRate: 0.10 },
  { id: 't-cinema', cat: 'Tickets', title: 'Cinema for two', sub: 'Any 2D film, any day', price: 24, img: cinema, perks: ['Two standard tickets', 'Tickets arrive in the app straight away', 'Valid for six months'], cancel: 'Free until you use the tickets', partnerRate: 0.10 },
  { id: 'g-fashion', cat: 'Gift cards', title: 'Fashion gift card, £50', sub: 'Spend online or in store', price: 50, img: jacket, perks: ['Arrives by email in minutes', 'Use within 12 months'], cancel: 'Free until you use the code', partnerRate: 0.06 },
  { id: 'b-hotel', cat: 'Hotels', title: 'Canal hotel, Amsterdam', sub: '2 nights · Tue 6 to Thu 8 Oct', price: 348, img: room, rating: '4.6', perks: ['Workspace in every room', 'Breakfast included', '10 minutes from Centraal'], cancel: 'Free cancellation until Sun 4 Oct', when: 'Tue 6 to Thu 8 Oct', partnerRate: 0.06, biz: true },
  { id: 'b-ride', cat: 'Experiences', title: 'Airport transfer, Schiphol', sub: 'Tue 6 Oct · on arrival', price: 58, img: car, perks: ['Driver meets you at arrivals', 'Invoice sent to your business'], cancel: 'Free cancellation until 2 hours before', when: 'Tue 6 Oct', partnerRate: 0.05, biz: true },
  { id: 'b-dine', cat: 'Dining', title: 'Client dinner, Jordaan', sub: 'Wed 7 Oct · table for four at 19:00', price: 0, img: food, perks: ['Free to book', '10% back when you pay with your card'], cancel: 'Free cancellation until 24 hours before', when: 'Wed 7 Oct, 19:00', partnerRate: 0.10, biz: true },
]
export const CATS = [
  { id: 'Hotels', stamp: 'hotel' }, { id: 'Experiences', stamp: 'balloon' }, { id: 'Dining', stamp: 'dining' }, { id: 'Tickets', stamp: 'ticket' }, { id: 'Gift cards', stamp: 'gift' },
]
export const itemById = (id: string) => CONTENT.find(i => i.id === id)!

// ---------- offers (merchant-funded, added by Gratifi) ----------
export type Offer = { id: string; brand: string; stamp: string; rate: string; pct: number; sub: string; why: string; usesSpend?: boolean; biz?: boolean; personal?: boolean; merchant?: string; verb?: string }
export const OFFERS: Offer[] = [
  { id: 'o-coffee', brand: 'Fieldhouse Coffee', stamp: 'takeaway', rate: '15% back', pct: 0.15, sub: 'Coffee shops · until Sat 31 Oct', why: '', usesSpend: true, personal: true, merchant: 'Fieldhouse Coffee', verb: 'bought coffee here' },
  { id: 'o-home', brand: 'Hearth & Co', stamp: 'bag', rate: '8% back', pct: 0.08, sub: 'Homeware · until Sun 15 Nov', why: '', usesSpend: true, personal: true, merchant: 'Hearth & Co', verb: 'shopped here' },
  { id: 'o-dine', brand: 'Marlow & Finch', stamp: 'dining', rate: '10% back', pct: 0.10, sub: 'Restaurants · Friday to Sunday', why: '', usesSpend: true, merchant: 'Marlow & Finch', verb: 'ate here' },
  { id: 'o-hotel', brand: 'Lisbon partner hotels', stamp: 'hotel', rate: '5% back', pct: 0.05, sub: 'Stays booked in the app', why: 'Your flight to Lisbon is booked for Fri 16 Oct.', usesSpend: true, personal: true, merchant: 'Northway Air' },
  { id: 'o-cinema', brand: 'Loop Cinemas', stamp: 'ticket', rate: '2 for 1', pct: 0, sub: 'Tuesdays · until Thu 31 Dec', why: 'Open to every cardholder.', personal: true },
  { id: 'o-rail', brand: 'Northway Rail', stamp: 'car', rate: '5% back', pct: 0.05, sub: 'Business travel · until Sat 31 Oct', why: '', usesSpend: true, biz: true, merchant: 'Northway Rail', verb: 'travelled with them' },
  { id: 'o-cowork', brand: 'Hive Coworking', stamp: 'bag', rate: '£40 back', pct: 0, sub: 'On a month’s desk over £300', why: '', usesSpend: true, biz: true, merchant: 'Hive Coworking', verb: 'paid for desks here' },
]

export const MEMORY0 = [
  { id: 'm1', text: 'Window seat', group: 'Travel', source: 'You told Gratifi', scope: 'all' },
  { id: 'm2', text: 'Small hotels over big chains', group: 'Travel', source: 'You told Gratifi', scope: 'all' },
  { id: 'm3', text: 'Lisbon, Fri 16 to Sun 18 Oct', group: 'Plans', source: 'From your card', scope: 'personal' },
  { id: 'm4', text: 'Eats out most weekends', group: 'Food and drink', source: 'From your card', scope: 'personal' },
  { id: 'm5', text: 'Amsterdam, Tue 6 to Thu 8 Oct', group: 'Plans', source: 'From your card', scope: 'biz' },
  { id: 'm6', text: 'Client dinners near the office', group: 'Food and drink', source: 'From your card', scope: 'biz' },
]
