/* The app's state: one mock bank per market (points ledger, card, transactions), the customer's bookings, the chat.
   Money and points only change through pay() and refund(); nothing else touches the balance. */
import { React } from '../../kit/src/r'
import { RATE, START_BALANCE, px, rnd } from './catalog'

export type Block = { kind: string; [k: string]: any }
export type Msg = { id: string; role: 'user' | 'gr'; text?: string; steps?: string[]; blocks?: Block[]; at: number; thinking?: boolean; live?: boolean }
export type Booking = {
  id: string; ref: string; cat: string; title: string; sub?: string; when?: string; detail?: [string, string][]; icon?: string; img?: string
  chl?: Record<string, number>; expUsed?: number; refunded?: { pts: number; card: number }; total: number; pts: number; card: number; status: 'confirmed' | 'cancelled' | 'active' | 'paused' | 'delivered' | 'in progress' | 'done' | 'refunded' | 'claim'
  policy?: string; refundable?: boolean; tracker?: { steps: string[]; current: number; tone?: 'warn' | 'danger' | 'good'; eta?: string }
  itemId?: string; extra?: any; createdAt: number; earned?: number; kind?: 'booking' | 'order' | 'sub' | 'request' | 'claim' | 'ticket' | 'transfer' | 'donation' | 'investment'
}
export type Draft = { id: string; cat: string; title: string; sub?: string; when?: string; qty: number; unit: number; total: number; detail?: [string, string][]; itemId?: string; icon?: string; img?: string; policy?: string; refundable?: boolean; kind?: Booking['kind']; tracker?: Booking['tracker']; extra?: any; pointsOnly?: boolean; cardOnly?: boolean; note?: string }
export type Txn = { id: string; at: number; merchant: string; cat: string; amount: number; points: number; refund?: boolean; pending?: boolean }
export type Ledger = { id: string; at: number; label: string; pts: number }
export type State = {
  market: string; balance: number; ledger: Ledger[]; txns: Txn[]
  card: { last4: string; limit: number; balance: number; due: number; min: number; dueDate: string; frozen: boolean; online: boolean; abroad: boolean; contactless: boolean; atm: boolean; autopay: boolean }
  bookings: Booking[]; drafts: Record<string, Draft>; chat: Msg[]
  alerts: Record<string, boolean>; loungeLeft: number; challenges: { id: string; title: string; reward: string; rewardPts: number; progress: number; target: number; unit?: string; joined: boolean; done?: boolean }[]
  sim: { priceRise: boolean; supplierDown: boolean; decline: boolean }; prefs: { aisle: boolean; name: string; full?: string }
  basket: Record<string, number>; seen: Record<string, any>; pending?: { id: string; label: string; at: number; pts?: number; lands?: string }[]; expiring: number; addresses: { id: string; label: string; line: string }[]; addr: string
}

const KEY = 'gratifi-state-v3-'
const uid = () => Math.random().toString(36).slice(2, 10)
export const ref = (p = 'GR') => `${p}-${Math.floor(10000 + Math.random() * 89999)}`
const b = (m: string) => (m === 'AR' ? 'AE' : m)

export function initial(market: string): State {
  const r = rnd('txn' + market), now = Date.now(), day = 86400000
  const merchants: [string, string, number][] = [['Pantry Market', 'Groceries', 64], ['Northway Air', 'Travel', 186], ['Café Lune', 'Dining', 14], ['Byte Store', 'Shopping', 89], ['Ride Now', 'Transport', 22], ['Cloudbox', 'Subscriptions', 10.99], ['Table Collective', 'Dining', 72], ['Pantry Market', 'Groceries', 38], ['Glow Beauty', 'Shopping', 46], ['Fuel Stop', 'Transport', 55]]
  const txns: Txn[] = merchants.map(([mm, c, g], i) => { const amount = px(g, market); return { id: uid(), at: now - (1.2 + i * 2.3 + r()) * day, merchant: mm, cat: c, amount, points: Math.round(amount / RATE[b(market)] * 0.01) } })
  const bal = txns.reduce((s, t) => s + t.amount, 0) + px(310, market)
  const dd = new Date(now + 9 * day)
  return {
    market, balance: START_BALANCE[b(market)], ledger: [{ id: uid(), at: now - 5 * day, label: 'Points on card spend', pts: 1840 }, { id: uid(), at: now - 30 * day, label: 'Balance brought forward', pts: START_BALANCE[b(market)] - 1840 }], txns,
    card: { last4: { UK: '4821', EU: '7730', IN: '5512', AE: '3309', SG: '0418', MY: '6624' }[b(market)] as string, limit: px(8000, market), balance: Math.round(bal * 100) / 100, due: Math.round(bal * 100) / 100, min: Math.round(bal * 0.03 * 100) / 100, dueDate: new Date(dd.getTime() - dd.getTimezoneOffset() * 60000).toISOString().slice(0, 10), frozen: false, online: true, abroad: true, contactless: true, atm: true, autopay: false },
    bookings: [], drafts: {}, chat: [], alerts: { moments: true, offers: true, trips: true, orders: true, spend: false, quiet: true }, loungeLeft: 2,
    challenges: [
      { id: 'CHL-1', title: 'Eat out 3 times this month', reward: '2,000 points', rewardPts: 2000, progress: 1, target: 3, joined: true },
      { id: 'CHL-2', title: 'Try a new category', reward: '1,000 points', rewardPts: 1000, progress: 0, target: 1, joined: false },
      { id: 'CHL-3', title: 'Spend on travel before 31 Oct', reward: 'A free lounge visit', rewardPts: 0, progress: px(186, market), target: px(500, market), unit: 'money', joined: false },
    ],
    sim: { priceRise: false, supplierDown: false, decline: false }, prefs: { aisle: true, name: 'Amit', full: 'Amit Chawla' }, basket: {}, seen: { stmtEnd: now - day }, expiring: Math.round(START_BALANCE[b(market)] * 0.08 / 10) * 10,
    addresses: ({ UK: [['12 Garden Row', '1 Harbour Square']], EU: [['14 Quay Street', '2 Canal Place']], IN: [['21 Lake View Road', '3 Tech Park']], AE: [['Villa 12, Palm Street', 'Harbour Tower, floor 12']], SG: [['18 Orchid Walk', '1 Harbour Square']], MY: [['12 Jalan Bunga', 'Menara Harbour, level 9']] } as any)[b(market)].map(([h, o]: string[]) => [{ id: 'a1', label: 'Home', line: h }, { id: 'a2', label: 'Office', line: o }])[0], addr: 'a1',
  }
}

/* ---------- a tiny store ---------- */
type L = () => void
let S: State
const subs = new Set<L>()
function load(m: string): State { try { const s = localStorage.getItem(KEY + m); if (s) return JSON.parse(s) } catch (e) { } return initial(m) }
function save() { try { localStorage.setItem(KEY + S.market, JSON.stringify({ ...S, chat: S.chat.slice(-60).map(x => ({ ...x, thinking: false })) })) } catch (e) { } }
export function boot(m: string) { S = load(m); S.market = m }
export const get = () => S
export function set(fn: (s: State) => Partial<State> | void) { const p = fn(S); if (p) S = { ...S, ...p }; save(); subs.forEach(l => l()) }
export function switchMarket(m: string) { save(); S = load(m); S.market = m; try { localStorage.setItem('gratifi-market', m) } catch (e) { } subs.forEach(l => l()) }
export function onChange(f: () => void) { subs.add(f); return () => subs.delete(f) }
export function reset() { S = initial(S.market); save(); subs.forEach(l => l()) }
export function useS<T>(sel: (s: State) => T): T {
  const [, force] = React.useReducer((x: number) => x + 1, 0)
  React.useEffect(() => { const l = () => force(); subs.add(l); return () => { subs.delete(l) } }, [])
  return sel(S)
}

/* ---------- chat ---------- */
export function pushMsg(m: Omit<Msg, 'id' | 'at'>) { const msg = { ...m, id: uid(), at: Date.now() } as Msg; set(s => ({ chat: [...s.chat, msg] })); return msg.id }
export function patchMsg(id: string, p: Partial<Msg>) { set(s => ({ chat: s.chat.map(x => (x.id === id ? { ...x, ...p } : x)) })) }
export function addBlocks(id: string, blocks: Block[]) { set(s => ({ chat: s.chat.map(x => (x.id === id ? { ...x, blocks: [...(x.blocks || []), ...blocks] } : x)) })) }

/* ---------- drafts ---------- */
export function draft(d: Omit<Draft, 'id'>): string { const id = 'D' + uid(); set(s => ({ drafts: { ...s.drafts, [id]: { ...d, id } } })); return id }

/* ---------- money ---------- */
export const rate = () => RATE[b(S.market)]
/** Spend points and/or card for a draft. Returns the booking, or an error the UI shows as a state card. */
export function pay(d: Draft, pts: number, cardPart: number): { ok: true; booking: Booking } | { ok: false; code: 'declined' | 'frozen' | 'points' | 'supplier' | 'duplicate' | 'limit' | 'invalid' } {
  if (![d.total, pts, cardPart].every(x => Number.isFinite(x)) || pts < 0 || cardPart < 0 || d.total < 0) return { ok: false, code: 'invalid' }
  if (pts > S.balance) return { ok: false, code: 'points' }
  if (cardPart > 0 && cardPart > Math.round((S.card.limit - S.card.balance) * 100) / 100) return { ok: false, code: 'limit' }
  if (cardPart > 0 && S.card.frozen) return { ok: false, code: 'frozen' }
  if (cardPart > 0 && S.sim.decline) return { ok: false, code: 'declined' }
  if (S.sim.supplierDown) return { ok: false, code: 'supplier' }
  const now = Date.now(), base = cardPart > 0 ? Math.round(cardPart / rate() * 0.01) : 0, mult = d.extra?.mult || 1
  const os = d.extra?.outShare ?? 1, nwShare = d.cat === 'flights' ? (d.extra?.airline === 'NW' ? os : 0) + (d.extra?.back?.airline === 'NW' ? 1 - os : 0) : 0
  const offer = cardPart <= 0 ? null : S.seen['offer:OF-2'] && d.cat === 'flights' && nwShare > 0 ? ['5% back on flights', 0.05 * nwShare] : S.seen['offer:OF-3'] && d.cat === 'quick' ? ['10% back on groceries', 0.1] : S.seen['offer:OF-4'] && d.cat === 'shopping' && /^Byte Store/.test(d.sub || '') ? ['8% back on tech', 0.08] : null
  const bonus = offer ? Math.round(cardPart * (offer[1] as number) / rate()) : 0
  const earn = base * mult + bonus
  if (d.kind === 'sub' && S.bookings.some(x => x.itemId && x.itemId === d.itemId && ['active', 'paused'].includes(x.status))) return { ok: false, code: 'duplicate' }
  const chl: Record<string, number> = {}
  S.challenges.forEach(c => { if (c.joined && !c.done && ((c.id === 'CHL-1' && d.cat === 'dining' && cardPart > 0) || (c.id === 'CHL-2' && ['flights', 'stays', 'airport', 'rides', 'experiences', 'dining', 'quick', 'shopping', 'giftcards', 'subs', 'tickets', 'docs'].includes(d.cat) && !['claim', 'request', 'donation', 'transfer', 'investment'].includes(d.kind || '') && !S.bookings.some(x => x.cat === d.cat && !['cancelled', 'refunded'].includes(x.status))) || (c.id === 'CHL-3' && ['flights', 'stays', 'airport', 'rides'].includes(d.cat) && cardPart > 0))) chl[c.id] = c.id === 'CHL-3' ? cardPart : 1 })
  const bk: Booking = { chl, expUsed: Math.min(pts, S.expiring), id: 'B' + uid(), ref: ref(), cat: d.cat, title: d.title, sub: d.sub, when: d.when, detail: d.detail, icon: d.icon, img: d.img, total: d.total, pts, card: cardPart, status: d.kind === 'sub' ? 'active' : d.kind === 'request' ? 'in progress' : 'confirmed', policy: d.policy, refundable: d.refundable, tracker: d.tracker, itemId: d.itemId, extra: d.extra, createdAt: now, kind: d.kind || 'booking', earned: earn }
  set(s => ({
    balance: s.balance - pts + earn, expiring: Math.max(0, s.expiring - pts),
    ledger: [...(pts ? [{ id: uid(), at: now, label: d.title, pts: -pts }] : []), ...(base ? [{ id: uid(), at: now, label: `Points on card spend${mult > 1 ? ` (${mult}×)` : ''}: ${d.title}`, pts: base * mult }] : []), ...(bonus ? [{ id: uid(), at: now, label: `Card offer, ${offer![0]}: ${d.title}`, pts: bonus }] : []), ...s.ledger],
    txns: cardPart > 0 ? [{ id: uid(), at: now, merchant: d.title, cat: catName(d.cat), amount: cardPart, points: earn }, ...s.txns] : s.txns,
    card: cardPart > 0 ? { ...s.card, balance: Math.round((s.card.balance + cardPart) * 100) / 100 } : s.card,
    bookings: [bk, ...s.bookings],
    challenges: s.challenges.map(c => (chl[c.id] ? { ...c, progress: Math.round((c.progress + chl[c.id]) * 100) / 100 } : c)),
  }))
  settleChallenges()
  return { ok: true, booking: bk }
}
export function refund(id: string, fraction = 1, label = 'Refund') {
  const bk = S.bookings.find(x => x.id === id); if (!bk || ['cancelled', 'refunded'].includes(bk.status)) return null
  const pts = Math.round(bk.pts * fraction), card = Math.round(bk.card * fraction * 100) / 100, now = Date.now()
  const owed = Math.round((bk.earned || 0) * fraction), back = Math.min(S.balance + pts, owed), short = owed - back
  const cardBack = card /* points already spent are written off, never taken out of a cash refund */
  set(s => ({
    balance: s.balance + pts - back, expiring: s.expiring + Math.round((bk.expUsed || 0) * fraction),
    loungeLeft: bk.extra?.included ? s.loungeLeft + (bk.extra.freeN || 1) : s.loungeLeft,
    ledger: [...(pts ? [{ id: uid(), at: now, label: `${label}: ${bk.title}`, pts }] : []), ...(back ? [{ id: uid(), at: now, label: `Points earned on ${bk.title}, reversed`, pts: -back }] : []), ...s.ledger],
    txns: cardBack ? [{ id: uid(), at: now, merchant: `${label}: ${bk.title}`, cat: catName(bk.cat), amount: cardBack, points: 0, refund: true }, ...s.txns] : s.txns,
    card: cardBack ? { ...s.card, balance: Math.round((s.card.balance - cardBack) * 100) / 100 } : s.card,
    bookings: s.bookings.map(x => (x.id === id ? { ...x, status: (pts || card) && fraction >= 1 ? 'refunded' : 'cancelled', refunded: { pts, card: cardBack } } : x)),
  }))
  const undone = unwindChallenges(bk, fraction)
  return { undone, pts, card: cardBack, back, short, shortValue: 0, lounge: !!bk.extra?.included }
}
/** Money back to the card for part of a booking, with any points earned on that part taken off. */
export function cardRefund(amount: number, label: string, cat: string, earnedBack = 0) {
  const now = Date.now(), take = Math.min(S.balance, earnedBack)
  set(s => ({ txns: [{ id: uid(), at: now, merchant: label, cat: catName(cat), amount, points: 0, refund: true }, ...s.txns], card: { ...s.card, balance: Math.round((s.card.balance - amount) * 100) / 100 }, balance: s.balance - take, ledger: take ? [{ id: uid(), at: now, label: `Points earned reversed: ${label.replace(/^Fare difference back: /, '')}`, pts: -take }, ...s.ledger] : s.ledger }))
}
export function updateBooking(id: string, p: Partial<Booking>) { set(s => ({ bookings: s.bookings.map(x => (x.id === id ? { ...x, ...p } : x)) })) }
export function addPoints(pts: number, label: string) { set(s => ({ balance: s.balance + pts, ledger: [{ id: uid(), at: Date.now(), label, pts }, ...s.ledger] })) }
export function spendPoints(pts: number, label: string) { if (pts > S.balance) return false; set(s => ({ balance: s.balance - pts, ledger: [{ id: uid(), at: Date.now(), label, pts: -pts }, ...s.ledger] })); return true }
/** A cancelled booking no longer counts towards a challenge; if that drops a finished challenge below its target, its reward comes back off. */
function unwindChallenges(bk: Booking, fraction = 1): string[] {
  const chl = bk.chl || {}; if (!Object.keys(chl).length) return []
  const undo: string[] = []
  const next = S.challenges.map(c => { if (!chl[c.id]) return c; const progress = Math.max(0, Math.round((c.progress - (c.id === 'CHL-3' ? chl[c.id] * fraction : chl[c.id])) * 100) / 100); if (c.done && progress < c.target) { undo.push(c.id); return { ...c, progress, done: false } } return { ...c, progress } })
  set(() => ({ challenges: next }))
  undo.forEach(id => { const c = S.challenges.find(x => x.id === id)!; if (c.rewardPts) { const take = Math.min(S.balance, c.rewardPts); if (take) set(s => ({ balance: s.balance - take, ledger: [{ id: uid(), at: Date.now(), label: `Challenge reward reversed: ${c.title}`, pts: -take }, ...s.ledger] })) } if (id === 'CHL-3') set(s => ({ loungeLeft: Math.max(0, s.loungeLeft - 1) })) })
  return undo.map(id => S.challenges.find(x => x.id === id)!.title)
}
/** A card payment made outside Gratifi still counts towards the challenges it fits. */
export function recordSpend(cat: string, amount: number) {
  set(s => ({ challenges: s.challenges.map(c => (c.joined && !c.done && ((c.id === 'CHL-1' && cat === 'Dining') || (c.id === 'CHL-3' && cat === 'Travel')) ? { ...c, progress: Math.round((c.progress + (c.id === 'CHL-3' ? amount : 1)) * 100) / 100 } : c)) }))
  settleChallenges()
}
function settleChallenges() {
  const done = S.challenges.filter(c => c.joined && !c.done && c.progress >= c.target)
  if (!done.length) return
  done.forEach(c => { if (c.rewardPts) addPoints(c.rewardPts, 'Challenge: ' + c.title); if (c.id === 'CHL-3') set(s => ({ loungeLeft: s.loungeLeft + 1 })) })
  set(s => ({ challenges: s.challenges.map(c => (done.some(d => d.id === c.id) ? { ...c, done: true } : c)) }))
}
export function catName(k: string) { return ({ flights: 'Travel', stays: 'Travel', airport: 'Travel', rides: 'Transport', experiences: 'Entertainment', dining: 'Dining', quick: 'Groceries', shopping: 'Shopping', giftcards: 'Gift cards', subs: 'Subscriptions', tickets: 'Entertainment', docs: 'Travel', concierge: 'Concierge' } as any)[k] || 'Other' }
export const uidx = uid
