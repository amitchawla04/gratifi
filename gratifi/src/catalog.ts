/* Mock supply for every category, per market. Everything here stands in for a supplier or the bank:
   fictional airlines, hotels, brands and charities; real airport codes and cities. Prices are illustrative. */
import { ART } from '../../kit/src/art'
import { scene, CUISINE } from './scenes'

export const MK = ['UK', 'EU', 'IN', 'AE', 'SG', 'MY', 'AR'] as const
export type Mk = typeof MK[number]
const base = (m: string) => (m === 'AR' ? 'AE' : m)

/* ---------- money ---------- */
export const FX: Record<string, number> = { UK: 1, EU: 1.17, IN: 110, AE: 4.7, SG: 1.72, MY: 5.6 }
export const RATE: Record<string, number> = { UK: 0.01, EU: 0.01, IN: 0.25, AE: 0.02, SG: 0.01, MY: 0.01 }
export const START_BALANCE: Record<string, number> = { UK: 48210, EU: 42600, IN: 196400, AE: 88500, SG: 64300, MY: 80000 }
/** Convert a price set in pounds into the market's money, rounded the way that market prices things. */
export function px(gbp: number, m: string): number {
  const v = gbp * FX[base(m)]
  if (m === 'IN') return v < 500 ? Math.round(v / 5) * 5 : Math.round(v / 10) * 10
  if (base(m) === 'AE') return v < 50 ? Math.round(v * 2) / 2 : Math.round(v / 5) * 5
  if (v < 20) return Math.round(v * 2) / 2 - (v > 2 ? 0.01 : 0)
  return Math.round(v)
}
export const ptsFor = (price: number, m: string) => Math.round(price / RATE[base(m)])

/* ---------- seeded random ---------- */
export function rnd(seed: string) { let h = 2166136261; for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619) } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000 } }

/* ---------- places ---------- */
export type City = { name: string; code: string; tz: number; dur: number; gbp: number; country: string; img: string; stops?: string }
export const HOME: Record<string, { city: string; code: string; tz: number; airport: string; terminal: string; country: string }> = {
  UK: { city: 'London', code: 'LHR', tz: 1, airport: 'Heathrow', terminal: 'T5', country: 'UK' },
  EU: { city: 'Dublin', code: 'DUB', tz: 1, airport: 'Dublin', terminal: 'T2', country: 'Ireland' },
  IN: { city: 'Mumbai', code: 'BOM', tz: 5.5, airport: 'Mumbai', terminal: 'T2', country: 'India' },
  AE: { city: 'Dubai', code: 'DXB', tz: 4, airport: 'Dubai', terminal: 'T3', country: 'UAE' },
  SG: { city: 'Singapore', code: 'SIN', tz: 8, airport: 'Changi', terminal: 'T3', country: 'Singapore' },
  MY: { city: 'Kuala Lumpur', code: 'KUL', tz: 8, airport: 'KLIA', terminal: 'T1', country: 'Malaysia' },
}
export const DEST: Record<string, City[]> = {
  UK: [
    { name: 'Lisbon', code: 'LIS', tz: 1, dur: 155, gbp: 128, country: 'Portugal', img: 'lisbon', stops: 'OPO' },
    { name: 'Barcelona', code: 'BCN', tz: 2, dur: 130, gbp: 112, country: 'Spain', img: 'pool', stops: 'MAD' },
    { name: 'Paris', code: 'CDG', tz: 2, dur: 80, gbp: 96, country: 'France', img: 'food' },
    { name: 'Edinburgh', code: 'EDI', tz: 1, dur: 85, gbp: 64, country: 'UK', img: 'car' },
    { name: 'New York', code: 'JFK', tz: -4, dur: 485, gbp: 420, country: 'USA', img: 'flight', stops: 'DUB' },
  ],
  EU: [
    { name: 'Lisbon', code: 'LIS', tz: 1, dur: 165, gbp: 110, country: 'Portugal', img: 'lisbon', stops: 'OPO' },
    { name: 'Barcelona', code: 'BCN', tz: 2, dur: 155, gbp: 104, country: 'Spain', img: 'pool', stops: 'MAD' },
    { name: 'Paris', code: 'CDG', tz: 2, dur: 105, gbp: 88, country: 'France', img: 'food' },
    { name: 'Rome', code: 'FCO', tz: 2, dur: 175, gbp: 118, country: 'Italy', img: 'food', stops: 'MXP' },
    { name: 'Amsterdam', code: 'AMS', tz: 2, dur: 95, gbp: 84, country: 'Netherlands', img: 'car' },
  ],
  IN: [
    { name: 'Goa', code: 'GOI', tz: 5.5, dur: 75, gbp: 40, country: 'India', img: 'pool', stops: 'BLR' },
    { name: 'Delhi', code: 'DEL', tz: 5.5, dur: 130, gbp: 52, country: 'India', img: 'food' },
    { name: 'Bengaluru', code: 'BLR', tz: 5.5, dur: 100, gbp: 44, country: 'India', img: 'car' },
    { name: 'Dubai', code: 'DXB', tz: 4, dur: 190, gbp: 150, country: 'UAE', img: 'flight', stops: 'MCT' },
    { name: 'Singapore', code: 'SIN', tz: 8, dur: 335, gbp: 230, country: 'Singapore', img: 'lisbon', stops: 'KUL' },
  ],
  AE: [
    { name: 'Muscat', code: 'MCT', tz: 4, dur: 70, gbp: 115, country: 'Oman', img: 'pool', stops: 'DOH' },
    { name: 'London', code: 'LHR', tz: 1, dur: 460, gbp: 390, country: 'UK', img: 'car', stops: 'IST' },
    { name: 'Istanbul', code: 'IST', tz: 3, dur: 270, gbp: 190, country: 'Türkiye', img: 'food' },
    { name: 'Malé', code: 'MLE', tz: 5, dur: 245, gbp: 260, country: 'Maldives', img: 'pool' },
    { name: 'Bangkok', code: 'BKK', tz: 7, dur: 370, gbp: 240, country: 'Thailand', img: 'food', stops: 'MCT' },
  ],
  SG: [
    { name: 'Bali', code: 'DPS', tz: 8, dur: 165, gbp: 127, country: 'Indonesia', img: 'pool', stops: 'KUL' },
    { name: 'Bangkok', code: 'BKK', tz: 7, dur: 145, gbp: 105, country: 'Thailand', img: 'food', stops: 'KUL' },
    { name: 'Tokyo', code: 'HND', tz: 9, dur: 410, gbp: 330, country: 'Japan', img: 'lisbon', stops: 'TPE' },
    { name: 'Kuala Lumpur', code: 'KUL', tz: 8, dur: 65, gbp: 58, country: 'Malaysia', img: 'car' },
    { name: 'Sydney', code: 'SYD', tz: 11, dur: 470, gbp: 390, country: 'Australia', img: 'flight', stops: 'DPS' },
  ],
  MY: [
    { name: 'Kota Kinabalu', code: 'BKI', tz: 8, dur: 155, gbp: 52, country: 'Malaysia', img: 'pool', stops: 'KCH' },
    { name: 'Penang', code: 'PEN', tz: 8, dur: 60, gbp: 34, country: 'Malaysia', img: 'food' },
    { name: 'Langkawi', code: 'LGK', tz: 8, dur: 65, gbp: 38, country: 'Malaysia', img: 'pool' },
    { name: 'Singapore', code: 'SIN', tz: 8, dur: 65, gbp: 48, country: 'Singapore', img: 'lisbon' },
    { name: 'Bangkok', code: 'BKK', tz: 7, dur: 130, gbp: 72, country: 'Thailand', img: 'food', stops: 'PEN' },
  ],
}
export const dests = (m: string) => DEST[base(m)]
export const home = (m: string) => HOME[base(m)]
export function findCity(m: string, text: string): City | undefined {
  const t = text.toLowerCase()
  const esc = (x: string) => x.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return dests(m).find(c => new RegExp('(^|[^a-zà-ÿ])' + esc(c.name) + '($|[^a-zà-ÿ])').test(t) || new RegExp('\\b' + c.code + '\\b').test(text) || (c.name === 'Malé' && /\bmale\b|maldives/.test(t)) || (c.name === 'Bengaluru' && /bangalore/.test(t)) || (c.name === 'New York' && /\bnyc\b/.test(t)) || (c.name === 'Kota Kinabalu' && /\bkk\b|sabah/.test(t)))
}

/* ---------- flights ---------- */
export const AIRLINES: Record<string, string> = { NW: 'Northway Air', CL: 'Coastline', AU: 'Aurora Air' }
export type FlightOpt = { id: string; airline: string; number: string; dep: string; arr: string; plus: number; from: string; to: string; dur: string; durMin: number; stops: number; via?: string; price: number; points: number; bag: string; left?: number; date: string; city: string }
const hm = (n: number) => `${String(Math.floor(((n % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String((((n % 1440) + 1440) % 1440) % 60).padStart(2, '0')}`
export const durTxt = (n: number) => `${Math.floor(n / 60)}h${n % 60 ? ' ' + String(n % 60).padStart(2, '0') + 'm' : ''}`
/** Fares that have dropped on a watched route, set from the app state (route code → multiplier). */
export const FARE_DROP: Record<string, number> = {}
export function searchFlights(m: string, city: City, date: string, back = false): FlightOpt[] {
  const r = rnd(m + city.code + date + back), h = home(m)
  const times = [370, 445, 580, 700, 855, 1070, 1230]
  const out: FlightOpt[] = []
  times.forEach((t, i) => {
    if (r() < 0.25 && i > 1) return
    const al = ['NW', 'CL', 'AU'][i % 3], stops = city.stops && (i === 0 || i === 5) ? 1 : 0
    const durMin = city.dur + (stops ? 110 + Math.round(r() * 60) : Math.round(r() * 10))
    const from = back ? city : { code: h.code, tz: h.tz } as any, to = back ? { code: h.code, tz: h.tz } as any : city
    const arrAbs = t + durMin + Math.round((to.tz - from.tz) * 60)
    const plus = Math.floor(arrAbs / 1440)
    const g = city.gbp * (stops ? 0.82 : 1) * (0.9 + r() * 0.5) * (t < 480 || t > 1200 ? 0.92 : 1.06)
    const price = px(g * (back ? 1 : FARE_DROP[city.code + date] || 1), m)
    out.push({ id: `FL-${city.code}-${date}-${i}-${back ? 'b' : 'o'}`, airline: al, number: (r(), `${al} ${200 + Math.round(rnd(m + city.code + back + i)() * 700)}`), dep: hm(t), arr: hm(arrAbs), plus, from: from.code, to: to.code, dur: durTxt(durMin), durMin, stops, via: stops ? city.stops : undefined, price, points: ptsFor(price, m), bag: 'Cabin bag', left: r() < 0.3 ? 2 + Math.floor(r() * 3) : undefined, date, city: city.name })
  })
  return out.sort((a, b) => a.price - b.price)
}

/* ---------- generic items for every other category ---------- */
export type Item = { id: string; cat: string; title: string; sub?: string; img?: string; icon?: string; gbp: number; unit?: string; rating?: number; meta?: string[]; city?: string; tags?: string[]; opts?: { kind: 'slots' | 'variants' | 'dates' | 'qty' | 'plans'; label: string; values: string[] }; policy?: string; mode?: 'order' | 'link' | 'request' | 'info'; live?: boolean; brand?: string; earn?: string; included?: boolean; desc?: string; soldOut?: string[] }

const W1 = ['Harbour', 'Garden', 'Riverside', 'Palm', 'Courtyard', 'Lantern', 'Cedar', 'Tidewater']
const W2 = ['House', 'Hotel', 'Suites', 'Residence', 'Rooms']
const AREAS = ['City centre', 'Old town', 'By the water', 'Near the station']
const CITY_AREAS: Record<string, string[]> = { Bali: ['Seminyak', 'Ubud', 'By the beach', 'Near the airport'], 'Malé': ['On the island', 'Over the water', 'By the beach', 'Near the airport'], Goa: ['North Goa', 'South Goa', 'By the beach', 'Panjim'], Penang: ['George Town', 'Batu Ferringhi', 'By the water', 'Near the airport'] }
const hsh = (x: string) => [...x].reduce((a, c) => a + c.charCodeAt(0), 0)
export function hotels(m: string, cityName: string): Item[] {
  const r = rnd(m + 'h' + cityName), c = dests(m).find(x => x.name === cityName)
  const NIGHT: Record<string, number> = { London: 170, Paris: 165, Edinburgh: 135, Lisbon: 115, Barcelona: 135, Dublin: 155, Muscat: 115, Istanbul: 95, Dubai: 150, 'Malé': 230, Goa: 70, Delhi: 80, Bengaluru: 80, Mumbai: 105, Bali: 85, Bangkok: 80, Tokyo: 150, Singapore: 175, 'Kota Kinabalu': 70, Penang: 65, Langkawi: 85, 'Kuala Lumpur': 75 }
  const g0 = NIGHT[cityName] || (c ? Math.max(90, c.gbp) : 120)
  return [0, 1, 2, 3].map(i => {
    const gbp = Math.round(g0 * (0.8 + i * 0.25 + r() * 0.15)) * 2
    return { id: `ST-${cityName}-${i}`, cat: 'stays', title: `${W1[(i * 3 + hsh(cityName)) % W1.length]} ${W2[(i + hsh(cityName) * 7) % W2.length]}`, sub: `${(CITY_AREAS[cityName] || AREAS)[i]}, ${cityName}`, img: `hotel:${['pool', 'room', 'terrace', 'facade'][i]}|${cityName}|${cityName}${i}`, gbp, unit: '2 nights, taxes in', rating: +(4.2 + r() * 0.7).toFixed(1), meta: [['Pool', 'Breakfast'], ['Breakfast'], ['Rooftop bar'], ['Gym', 'Spa']][i], city: cityName, opts: { kind: 'variants', label: 'Room', values: ['Double', 'Twin', 'Suite (+40%)'] }, policy: i === 2 ? 'Non-refundable rate' : 'Free cancellation until 3 days before', mode: 'order', earn: i === 0 ? '3× points' : undefined } as Item
  })
}

const CITY_EXP = ['Old town walking tour', 'Sunset boat trip', 'Food market tour', 'Cooking class', 'Museum with skip-the-line entry', 'Day trip to the coast', 'Theme park day']
export function experiences(m: string, cityName: string): Item[] {
  const r = rnd(m + 'x' + cityName)
  return CITY_EXP.map((t, i) => ({ id: `EX-${cityName}-${i}`, cat: 'experiences', title: t, sub: cityName, img: ['do:walk', 'do:boat', 'do:market', 'do:cooking', 'do:museum', 'do:coast', 'do:park'][i], gbp: [24, 45, 38, 52, 22, 68, 58][i], unit: 'per person', rating: +(4.4 + r() * 0.5).toFixed(1), meta: [['2 hours', 'Small group'], ['90 min'], ['3 hours', 'Tastings'], ['3 hours'], ['Timed entry'], ['Full day', 'Pick-up'], ['Full day']][i], city: cityName, opts: { kind: 'slots', label: 'Time', values: ['09:00', '11:00', '14:00', '17:30'] }, policy: i === 6 ? 'Non-refundable' : 'Free cancellation until 24 hours before', mode: 'order' } as Item))
}

const REST_BY: Record<string, string[][]> = {
  IN: [['Saffron House', 'North Indian'], ['Salt and Ember', 'Grill'], ['The Green Table', 'Vegetarian'], ['Kanji', 'Japanese'], ['Coastal Curry Co', 'South Indian'], ['Little Olive', 'Mediterranean']],
  AE: [['Al Bahar', 'Seafood'], ['Salt and Ember', 'Grill'], ['The Green Table', 'Vegetarian'], ['Kanji', 'Japanese'], ['Masala Room', 'Indian'], ['Levant House', 'Lebanese']],
  SG: [['Harbour Wok', 'Chinese'], ['Salt and Ember', 'Grill'], ['The Green Table', 'Vegetarian'], ['Kanji', 'Japanese'], ['Masala Room', 'Indian'], ['Kopi Lane', 'Peranakan']],
  MY: [['Rumah Rempah', 'Malay'], ['Salt and Ember', 'Grill'], ['The Green Table', 'Vegetarian'], ['Kanji', 'Japanese'], ['Masala Room', 'Indian'], ['Harbour Wok', 'Chinese']],
}
const REST = [['Harrow & Vine', 'Modern European'], ['Salt and Ember', 'Grill'], ['The Green Table', 'Vegetarian'], ['Kanji', 'Japanese'], ['Masala Room', 'Indian'], ['Little Olive', 'Mediterranean']]
export function restaurants(m: string, cityName: string): Item[] {
  const r = rnd(m + 'd' + cityName)
  return (REST_BY[base(m)] || REST).map(([n, cu], i) => ({ id: `DN-${cityName}-${i}`, cat: 'dining', title: n, sub: `${cu} · ${cityName}`, img: 'food:' + (CUISINE[cu] || 'european'), gbp: 0, unit: 'to book', rating: +(4.3 + r() * 0.6).toFixed(1), meta: [['Upmarket', '15% off with your card'], ['Mid-price'], ['Mid-price', 'Plant-based'], ['Upmarket', 'Chef\'s counter'], ['Mid-price'], ['Mid-price', 'Terrace']][i], city: cityName, opts: { kind: 'slots', label: 'Time', values: ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00'] }, policy: 'Free to book. Cancel up to 2 hours before, or the restaurant may charge a no-show fee.', mode: 'order', earn: i === 0 ? '15% off with your card' : undefined } as Item))
}

export const GROCERY: Item[] = [
  ['Milk, 2 litres', 1.65], ['Sourdough loaf', 3.2], ['Free-range eggs, 12', 3.9], ['Bananas, 6', 1.1], ['Coffee beans, 500g', 7.5], ['Greek yoghurt', 2.4], ['Tomatoes, 500g', 1.8], ['Chicken thighs, 1kg', 6.2], ['Basmati rice, 2kg', 4.5], ['Olive oil, 750ml', 7.9], ['Sparkling water, 6', 3.3], ['Dark chocolate', 2.2], ['Oat milk', 1.9], ['Paracetamol, 16', 1.5], ['Nappies, pack of 40', 9.5], ['Dishwasher tablets', 6.5],
  ['Baby wipes', 2.5], ['Toilet roll, 9', 5.2], ['Butter', 2.3], ['Cheddar', 3.4], ['Apples, 6', 2.1], ['Pasta, 500g', 1.2], ['Crisps', 1.5], ['Ibuprofen, 16', 1.8],
].map(([t, g], i) => ({ id: `QC-${i}`, cat: 'quick', title: t as string, icon: 'bag', gbp: g as number, mode: 'order', live: true } as Item))

export const PRODUCTS: Item[] = [
  { id: 'SH-1', cat: 'shopping', title: 'Hush 700 noise-cancelling headphones', sub: 'Byte Store', img: 'shop:headphones', gbp: 229, rating: 4.7, meta: ['Free delivery', '2-year warranty'], opts: { kind: 'variants', label: 'Colour', values: ['Black', 'Silver', 'Blue'] }, policy: 'Return within 30 days', mode: 'order', tags: ['electronics', 'audio'] },
  { id: 'SH-2', cat: 'shopping', title: 'Smartwatch, 44mm', sub: 'Byte Store', img: 'shop:watch', gbp: 279, rating: 4.6, meta: ['Delivery in 2 days'], opts: { kind: 'variants', label: 'Strap', values: ['Black', 'Sand', 'Olive'] }, policy: 'Return within 30 days', mode: 'order', tags: ['electronics'] },
  { id: 'SH-3', cat: 'shopping', title: '13-inch laptop, 16GB', sub: 'Byte Store', img: 'shop:laptop', gbp: 999, rating: 4.8, meta: ['Free delivery', '1-year warranty'], policy: 'Return within 14 days', mode: 'order', tags: ['electronics', 'laptop'] },
  { id: 'SH-4', cat: 'shopping', title: 'Rain shell jacket', sub: 'Stride Outdoor', img: 'shop:jacket', gbp: 120, rating: 4.5, meta: ['Free returns'], opts: { kind: 'variants', label: 'Size', values: ['S', 'M', 'L', 'XL'] }, policy: 'Return within 30 days', mode: 'order', tags: ['fashion', 'jacket'] },
  { id: 'SH-5', cat: 'shopping', title: 'Leather trainers', sub: 'Stride Outdoor', img: 'shop:trainers', gbp: 95, rating: 4.4, opts: { kind: 'variants', label: 'Size', values: ['6', '7', '8', '9', '10', '11'] }, policy: 'Return within 30 days', mode: 'order', tags: ['fashion', 'shoes'] },
  { id: 'SH-6', cat: 'shopping', title: 'Skincare set', sub: 'Glow Beauty', img: 'shop:skincare', gbp: 58, rating: 4.6, policy: 'Unopened returns within 14 days', mode: 'order', tags: ['beauty'] },
  { id: 'SH-7', cat: 'shopping', title: 'Espresso machine', sub: 'Home & Hearth', img: 'shop:espresso', gbp: 349, rating: 4.7, meta: ['Delivery in 3 days', '2-year warranty'], policy: 'Return within 30 days', mode: 'order', tags: ['home', 'kitchen', 'coffee'] },
  { id: 'SH-8', cat: 'shopping', title: 'Air fryer, 5.5 litres', sub: 'Home & Hearth', img: 'shop:airfryer', gbp: 89, rating: 4.5, policy: 'Return within 30 days', mode: 'order', tags: ['home', 'kitchen'] },
  { id: 'SH-9', cat: 'shopping', title: 'Cabin suitcase', sub: 'Wander Goods', img: 'shop:suitcase', gbp: 139, rating: 4.6, opts: { kind: 'variants', label: 'Colour', values: ['Graphite', 'Sand', 'Orange'] }, policy: 'Return within 30 days', mode: 'order', tags: ['travel', 'luggage'] },
  { id: 'SH-10', cat: 'shopping', title: 'Linen bedding set', sub: 'Home & Hearth', img: 'shop:bedding', gbp: 110, rating: 4.4, opts: { kind: 'variants', label: 'Size', values: ['Double', 'King', 'Super king'] }, policy: 'Return within 30 days', mode: 'order', tags: ['home'] },
  { id: 'SH-11', cat: 'shopping', title: 'Shop at Lumen Books', sub: 'On their own site · 10× points', img: 'shop:books', gbp: 0, earn: '10× points', mode: 'link', brand: 'Lumen Books', policy: 'Points land after the 30-day return window', tags: ['cache', 'books'] },
  { id: 'SH-12', cat: 'shopping', title: 'Shop at Stride Outdoor', sub: 'On their own site · 5× points', img: 'shop:outdoor', gbp: 0, earn: '5× points', mode: 'link', brand: 'Stride Outdoor', policy: 'Points land after the 30-day return window', tags: ['cache', 'fashion'] },
]

export const GIFTCARDS: Item[] = [['Harbour & Co', '#2E5E4E', 'Homeware'], ['Bloom', '#B5542B', 'Flowers'], ['Northway Air', '#1F3A5F', 'Flights'], ['Reel House', '#5B3FA8', 'Cinema'], ['Pantry Market', '#3D6B35', 'Groceries'], ['Stride Outdoor', '#8A5A2B', 'Outdoor'], ['Lumen Books', '#6B4E9E', 'Books'], ['Glow Beauty', '#B03A6A', 'Beauty'], ['Byte Store', '#17171A', 'Electronics'], ['Table Collective', '#9A3B2E', 'Dining']]
  .map(([n, c, s], i) => ({ id: `GC-${i}`, cat: 'giftcards', title: n, sub: s, icon: 'gift', img: `gift:${s}|${c}`, gbp: 0, tags: [c], opts: { kind: 'variants', label: 'Amount', values: ['25', '50', '100', '200'] }, policy: 'Delivered instantly. Valid for 12 months. Not refundable once sent.', mode: 'order' } as Item))

export const SUBS: Item[] = [
  { id: 'SB-1', cat: 'subs', title: 'Screenly', sub: 'Films and series', img: 'sub:Films and series|#C0301C', icon: 'eye', gbp: 10.99, unit: 'a month', tags: ['#C0301C'], opts: { kind: 'plans', label: 'Plan', values: ['Standard', 'Premium 4K (+£5)'] }, policy: 'Cancel any time; access until your next billing date', mode: 'order' },
  { id: 'SB-2', cat: 'subs', title: 'Tunewave', sub: 'Music', img: 'sub:Music|#16794A', icon: 'bell', gbp: 0, included: true, unit: 'included with your card', tags: ['#16794A'], policy: 'Included for as long as you hold the card', mode: 'order' },
  { id: 'SB-3', cat: 'subs', title: 'Pagebound', sub: 'Audiobooks', img: 'sub:Audiobooks|#B3470F', icon: 'doc', gbp: 7.99, unit: 'a month', tags: ['#B3470F'], policy: 'Cancel any time; access until your next billing date', mode: 'order' },
  { id: 'SB-4', cat: 'subs', title: 'Daily Ledger', sub: 'News', img: 'sub:News|#1F3A5F', icon: 'doc', gbp: 6.5, unit: 'a month', tags: ['#1F3A5F'], policy: 'Cancel any time; access until your next billing date', mode: 'order' },
  { id: 'SB-5', cat: 'subs', title: 'Fitloop', sub: 'Home workouts', img: 'sub:Home workouts|#0F7C80', icon: 'heart', gbp: 9.99, unit: 'a month', tags: ['#0F7C80'], policy: 'First month free, then monthly', mode: 'order' },
  { id: 'SB-6', cat: 'subs', title: 'Cloudkeep', sub: 'Photo storage, 200GB', img: 'sub:Photo storage, 200GB|#5B3FA8', icon: 'grid', gbp: 2.99, unit: 'a month', tags: ['#5B3FA8'], policy: 'Cancel any time; access until your next billing date', mode: 'order' },
]

export function events(m: string): Item[] {
  const c = home(m).city
  return [
    { id: 'ET-1', tags: ['concert', 'music', 'gig', 'live'], cat: 'tickets', title: 'Arlo Grey live', sub: `Arena, ${c} · Sat 24 Oct`, img: 'do:concert', gbp: 65, unit: 'per ticket', meta: ['Presale for cardholders'], opts: { kind: 'variants', label: 'Area', values: ['Standing', 'Seated, upper', 'Seated, lower (+£30)'] }, policy: 'No refunds unless the event is cancelled or moved. Resell at face value through the official resale.', mode: 'order', soldOut: ['Seated, lower'] },
    { id: 'ET-2', tags: ['football', 'sport', 'match', 'derby'], cat: 'tickets', title: 'City derby', sub: `National Stadium, ${c} · Sun 1 Nov`, img: 'stadium', gbp: 48, unit: 'per ticket', opts: { kind: 'variants', label: 'Stand', values: ['North', 'South', 'West (+£20)'] }, policy: 'Tickets are named; no resale', mode: 'order' },
    { id: 'ET-3', tags: ['theatre', 'play', 'show'], cat: 'tickets', title: 'The Glass Garden (theatre)', sub: `Royal Playhouse, ${c} · evenings`, img: 'do:theatre', gbp: 42, unit: 'per ticket', opts: { kind: 'slots', label: 'Date', values: ['Thu 22 Oct', 'Fri 23 Oct', 'Sat 24 Oct'] }, policy: 'Exchange up to 48 hours before', mode: 'order' },
    { id: 'ET-4', tags: ['cinema', 'film', 'movie'], cat: 'tickets', title: 'Cinema: 2 for 1 this week', sub: `Reel House, ${c}`, img: 'cinema', gbp: 12, unit: 'for two', meta: ['Card offer'], opts: { kind: 'slots', label: 'Showing', values: ['17:40', '19:15', '20:50'] }, policy: 'Refund up to 1 hour before', mode: 'order' },
    { id: 'ET-5', tags: ['food', 'festival'], cat: 'tickets', title: 'Riverside food festival', sub: `${c} · 7 to 8 Nov`, img: 'do:festival', gbp: 18, unit: 'day pass', opts: { kind: 'slots', label: 'Day', values: ['Sat 7 Nov', 'Sun 8 Nov'] }, policy: 'No refunds', mode: 'order' },
  ]
}

export function airportServices(m: string): Item[] {
  const h = home(m)
  return [
    { id: 'AP-1', cat: 'airport', title: 'Lounge visit', sub: `${h.airport} ${h.terminal} · The Orchard`, img: 'move:lounge', gbp: 32, unit: 'per person', meta: ['Up to 3 hours before your flight'], policy: 'Card visits come back if the lounge can\'t take you', mode: 'order', included: true },
    { id: 'AP-2', cat: 'airport', title: 'Fast track security', sub: `${h.airport} ${h.terminal}`, img: 'move:fasttrack', gbp: 9, unit: 'per person', policy: 'Full refund if not delivered', mode: 'order' },
    { id: 'AP-3', cat: 'airport', title: 'Meet and greet on arrival', sub: `${h.airport} · greeter at the gate`, img: 'move:meet', gbp: 85, unit: 'per group', meta: ['Help through arrivals and bags'], policy: 'Full refund if the greeter doesn\'t turn up', mode: 'order' },
    { id: 'AP-4', cat: 'airport', title: 'Porter and buggy', sub: h.airport, img: 'move:porter', gbp: 25, unit: 'per booking', policy: 'Full refund if not delivered', mode: 'order' },
    { id: 'AP-5', cat: 'airport', title: 'Sleep pod, 4 hours', sub: `${h.airport} airside`, img: 'move:pod', gbp: 45, unit: 'per pod', policy: 'Free change up to 2 hours before', mode: 'order' },
    { id: 'AP-6', cat: 'airport', title: 'Baggage wrap and storage', sub: h.airport, img: 'move:wrap', gbp: 12, unit: 'per bag', policy: 'Full refund if not delivered', mode: 'order' },
  ]
}

export function rides(m: string): Item[] {
  const h = home(m)
  const rail = m === 'UK' ? 'Train to Edinburgh' : m === 'EU' ? 'Train to Cork' : m === 'IN' ? 'Train to Pune' : m === 'MY' ? 'Train to Ipoh' : null
  const out: Item[] = [
    { id: 'GT-1', cat: 'rides', title: 'Ride: Standard', sub: `${h.city} · 4 min away`, img: 'move:car', gbp: 14, unit: 'across town; fixed when you book', meta: ['4 seats'], policy: 'Free to cancel until the driver arrives', mode: 'order' },
    { id: 'GT-2', cat: 'rides', title: 'Ride: Larger', sub: `${h.city} · 7 min away`, img: 'move:van', gbp: 19, unit: 'across town; fixed when you book', meta: ['6 seats', '4 bags'], policy: 'Free to cancel until the driver arrives', mode: 'order' },
    { id: 'GT-3', cat: 'rides', title: `Airport transfer to ${h.airport}${h.airport === h.city ? ' Airport' : ''}`, sub: 'Timed to your flight', img: 'move:transfer', gbp: 48, unit: 'fixed price', meta: ['Driver waits 60 min on arrivals'], policy: 'Free to cancel up to 12 hours before', mode: 'order' },
    { id: 'GT-4', cat: 'rides', title: 'Car hire: compact automatic', sub: 'Pick up at the airport', img: 'move:hire', gbp: 38, unit: 'per day', meta: ['Unlimited miles', 'Full-to-full fuel'], opts: { kind: 'dates', label: 'Days', values: ['1', '2', '3', '5', '7'] }, policy: 'Free cancellation up to 48 hours before', mode: 'order' },
    { id: 'GT-5', cat: 'rides', title: 'Chauffeur, half day', sub: h.city, img: 'move:chauffeur', gbp: 180, unit: '4 hours', policy: 'Free cancellation up to 24 hours before', mode: 'order' },
  ]
  if (rail) out.splice(3, 0, { id: 'GT-6', cat: 'rides', title: rail, sub: 'Standard class, reserved seat', img: 'move:train', gbp: 42, unit: 'per person', opts: { kind: 'slots', label: 'Departure', values: ['07:30', '09:00', '12:30', '16:00'] }, policy: 'Changes before departure for a fee', mode: 'order' })
  const more: [string, number][] = ({ UK: [['Manchester', 34], ['Birmingham', 27], ['York', 36], ['Bristol', 30]], EU: [['Galway', 24], ['Belfast', 28], ['Limerick', 22]], IN: [['Ahmedabad', 30], ['Goa', 38], ['Surat', 22]], MY: [['Penang', 36], ['Johor Bahru', 40]] } as Record<string, [string, number][]>)[m] || []
  more.forEach(([to, gbp], k) => out.push({ id: `GT-R${k + 1}`, cat: 'rides', title: `Train to ${to}`, sub: 'Standard class, reserved seat', img: 'move:train', icon: 'train', gbp, unit: 'per person', opts: { kind: 'slots', label: 'Departure', values: ['07:15', '09:30', '13:00', '17:30'] }, policy: 'Changes before departure for a fee', mode: 'order' }))
  return out
}

export const PROGRAMMES = [
  { id: 'PM-NW', name: 'Northway Miles', rate: '1,000 points = 500 miles', ratio: 0.5, eta: 'Usually within 2 days' },
  { id: 'PM-CL', name: 'Coastline Club', rate: '1,000 points = 400 miles', ratio: 0.4, eta: 'Usually instant' },
  { id: 'PM-SV', name: 'Stayvale Points', rate: '1,000 points = 1,000 hotel points', ratio: 1, eta: 'Usually within 3 days' },
]

export const CHARITIES = [
  { id: 'CH-1', name: 'Clean Seas Trust', cause: 'Clearing plastic from coastlines', raised: 1240000, goal: 2000000, img: 'money:sea' },
  { id: 'CH-2', name: 'Books for Every Child', cause: 'Reading packs for primary schools', raised: 860000, goal: 1000000, img: 'money:booksgive' },
  { id: 'CH-3', name: 'Warm Homes', cause: 'Heating help for older people', raised: 410000, goal: 1500000, img: 'money:home' },
  { id: 'CH-4', name: 'Local Food Bank Network', cause: 'Food parcels near you', raised: 2100000, goal: 2500000, img: 'money:parcel' },
]

/* Cover limits are set per market in local money (demo figures; the insurer sets the real ones). */
const LIM: Record<string, { med: number[]; can: number[]; bag: number[]; xs: number[] }> = {
  UK: { med: [5e6, 1e7], can: [2000, 5000], bag: [1000, 2000], xs: [100, 50, 75] }, EU: { med: [5e6, 1e7], can: [2500, 6000], bag: [1200, 2500], xs: [100, 50, 75] },
  IN: { med: [5e6, 1e7], can: [100000, 250000], bag: [50000, 100000], xs: [5000, 2500, 4000] }, AE: { med: [2e6, 5e6], can: [10000, 25000], bag: [5000, 10000], xs: [500, 250, 400] },
  SG: { med: [1e6, 2e6], can: [5000, 10000], bag: [3000, 5000], xs: [150, 100, 120] }, MY: { med: [5e5, 1e6], can: [10000, 20000], bag: [3000, 6000], xs: [200, 100, 150] },
}
export function insurance(m: string, money: (n: number) => string) {
  const L = LIM[base(m)]
  return [
    { id: 'TD-I1', name: 'Single trip, Essentials', gbp: 18, covered: [`Medical up to ${money(L.med[0])}`, `Cancellation up to ${money(L.can[0])}`, `Lost bags up to ${money(L.bag[0])}`], notCovered: ['Winter sports', 'Existing conditions unless declared'], excess: money(L.xs[0]) },
    { id: 'TD-I2', name: 'Single trip, Plus', gbp: 29, covered: [`Medical up to ${money(L.med[1])}`, `Cancellation up to ${money(L.can[1])}`, `Lost bags up to ${money(L.bag[1])}`, 'Missed departure'], notCovered: ['Winter sports'], excess: money(L.xs[1]) },
    { id: 'TD-I3', name: 'Annual multi-trip', gbp: 79, covered: ['Trips up to 31 days', `Medical up to ${money(L.med[1])}`, `Cancellation up to ${money(L.can[1])}`], notCovered: ['Trips over 31 days'], excess: money(L.xs[2]) },
  ]
}
export const ESIM = [{ id: 'TD-E1', title: '5GB for 15 days', gbp: 9 }, { id: 'TD-E2', title: '10GB for 30 days', gbp: 15 }, { id: 'TD-E3', title: 'Unlimited for 7 days', gbp: 22 }]

export const INVEST = [
  { id: 'IV-1', title: 'Digital gold', sub: 'Held in a vault by the partner; sell any time', unit: 'per gram', gbp: 68, risk: ['The price of gold goes down as well as up.', 'You may get back less than you put in.', 'Selling may carry a small spread.'] },
  { id: 'IV-2', title: 'Global index fund', sub: 'Thousands of companies worldwide in one fund', unit: 'minimum', gbp: 25, risk: ['Investments go down as well as up.', 'Best held for 5 years or more.', 'Past performance is not a guide to the future.'] },
  { id: 'IV-3', title: 'Savings pot top-up', sub: 'Move points into your savings as cash', unit: 'no minimum', gbp: 0, risk: ['Points turn into cash at the bank\'s rate.', 'This can\'t be undone.'] },
]

export const CONCIERGE = ['A table that\'s fully booked', 'Find and send a gift', 'Tickets to a sold-out event', 'Plan a special trip', 'Help at home (cleaning, repairs)']

export const BENEFITS = [
  { id: 'BE-1', icon: 'sofa', name: 'Airport lounges', sub: '2 free visits a year', key: 'lounge' },
  { id: 'BE-2', icon: 'shield', name: 'Purchase protection', sub: 'Things you buy with the card are covered for 120 days against theft and accidental damage' },
  { id: 'BE-3', icon: 'refresh', name: 'Extended warranty', sub: 'An extra year on top of the maker\'s warranty' },
  { id: 'BE-4', icon: 'plane', name: 'Travel insurance', sub: 'When you pay for the trip with the card: medical, cancellation, lost bags' },
  { id: 'BE-5', icon: 'globe', name: 'No fees abroad', sub: 'No foreign transaction fee on purchases' },
  { id: 'BE-6', icon: 'fork', name: 'Dining offers', sub: '15% off at partner restaurants' },
  { id: 'BE-7', icon: 'ticket', name: 'Presales', sub: 'Tickets 48 hours before general sale' },
  { id: 'BE-8', icon: 'cash', name: 'Getting money back', sub: 'If something you paid for doesn\'t arrive or isn\'t as described' },
]
export function moneyBackRule(m: string) {
  const b = base(m)
  if (b === 'UK') return 'For purchases between £100 and £30,000 on a credit card, Section 75 makes the bank jointly responsible with the seller. Below £100, or on debit, we use chargeback.'
  return 'We use the card scheme\'s chargeback process, and local consumer law where it applies (to confirm with the bank).'
}

export const CATS = [
  { key: 'flights', label: 'Flights', icon: 'plane', sub: 'Book, change, cancel' },
  { key: 'stays', label: 'Stays', icon: 'hotel', sub: 'Hotels and rooms' },
  { key: 'airport', label: 'Airport', icon: 'gate', sub: 'Lounges, fast track' },
  { key: 'rides', label: 'Rides and rail', icon: 'car', sub: 'Cabs, trains, cars' },
  { key: 'experiences', label: 'Experiences', icon: 'ticket', sub: 'Tours and tickets' },
  { key: 'dining', label: 'Dining', icon: 'fork', sub: 'Tables and offers' },
  { key: 'quick', label: 'Groceries', icon: 'bag', sub: '15-minute delivery' },
  { key: 'shopping', label: 'Shopping', icon: 'grid', sub: 'Products and brands' },
  { key: 'giftcards', label: 'Gift cards', icon: 'gift', sub: 'Buy or send' },
  { key: 'subs', label: 'Subscriptions', icon: 'bell', sub: 'Stream, read, listen' },
  { key: 'tickets', label: 'Events', icon: 'star', sub: 'Gigs, sport, theatre' },
  { key: 'points', label: 'Points and miles', icon: 'swap', sub: 'Transfer and earn' },
  { key: 'invest', label: 'Grow points', icon: 'bolt', sub: 'Gold, funds, savings' },
  { key: 'charity', label: 'Give', icon: 'heart', sub: 'Donate points' },
  { key: 'docs', label: 'Travel essentials', icon: 'doc', sub: 'Visa, cover, data' },
  { key: 'concierge', label: 'Concierge', icon: 'headset', sub: 'Anything else' },
  { key: 'benefits', label: 'Card benefits', icon: 'shield', sub: 'Cover and rights' },
  { key: 'bank', label: 'My card', icon: 'card', sub: 'Pay, freeze, statements' },
  { key: 'moments', label: 'Challenges', icon: 'flag', sub: 'Earn more' },
]
/** The home airport as people say it: 'Heathrow Airport', but just 'KLIA'. */
export const airportName = (m: string) => { const h = home(m); return /^KLIA$/.test(h.airport) ? h.airport : `${h.airport} Airport` }
export const img = (k?: string) => (k ? (ART as any)[k] || scene(k) : undefined)
