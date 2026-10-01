/* The bank connection layer. Screens and flows ask this layer, never the store directly, for card data and card actions.
   Today it answers from a mock bank kept in the browser; a real bank plugs in by implementing the same calls against its APIs.
   Every call names the API it needs, so a missing API fails cleanly instead of half-working. */
import * as St from './store'
import * as Cat from './catalog'
import * as Mod from './modules'
import { fmt } from '../../kit/src/market'

const M = () => fmt(St.get().market)
export const EXPIRY = '09/29'
const need = (api: string) => { if (!Mod.apiOn(api)) throw Object.assign(new Error(`The bank doesn't offer ${api}`), { code: 'unavailable', api }) }
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return Math.abs(h) }
const valid = (num: string) => { let sum = 0; num.split('').reverse().forEach((d, i) => { let x = +d; if (i % 2) { x *= 2; if (x > 9) x -= 9 } sum += x }); return sum % 10 === 0 }
type R = { say?: string; blocks: any[]; confirm?: any; suggest?: string[] }

/* ---------- reading ---------- */
export function card() { need('accounts.read'); return St.get().card }
/** Card number, expiry and security code. Only shown after the customer passes the bank's check. */
export function details() {
  need('cards.details'); const c = St.get().card, mid = String(hash(St.get().market + c.last4)).padEnd(10, '3').slice(0, 10)
  let n = ''; for (let d = 0; d < 10; d++) { n = '4' + mid + d + c.last4; if (valid(n)) break }
  return { number: n.replace(/(\d{4})(?=\d)/g, '$1 '), expiry: EXPIRY, cvv: String(100 + (hash(c.last4 + 'cvv') % 900)), name: (St.get().prefs.full || St.get().prefs.name || '').toUpperCase() }
}
export function pin() { need('cards.pin'); return String(1000 + (hash(St.get().market + St.get().card.last4 + 'pin') % 9000)) }

export type Statement = { id: string; label: string; start: string; end: string; balance: number; min: number; due: string; spend: number; payments: number; txns: St.Txn[]; current?: boolean }
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10)
/** Six months of statements. The latest uses the live account; earlier ones come from the bank's history (mocked). */
export function statements(): Statement[] {
  need('statements.read'); const s = St.get(), c = s.card, end0 = new Date(s.seen.stmtEnd || Date.now() - 864e5)
  return Array.from({ length: 6 }, (_, i) => {
    const end = new Date(end0); end.setMonth(end.getMonth() - i); const start = new Date(end); start.setMonth(start.getMonth() - 1); start.setDate(start.getDate() + 1)
    const due = new Date(end); due.setDate(due.getDate() + 25)
    const bal0 = i === 0 ? c.due : Math.round(Cat.px(620 + (hash(s.market + i) % 900), s.market) * 100) / 100
    const inRange = i === 0 ? s.txns.filter(t => t.at >= start.getTime() && t.at <= end.getTime() + 864e5 - 1) : history(s.market, i, start, end, Math.round(bal0 * 0.92 * 100) / 100)
    const spend = inRange.filter(t => t.cat !== 'Payment' && !t.refund).reduce((a, t) => a + t.amount, 0)
    const bal = bal0
    return { id: iso(end).slice(0, 7), label: M().monthLabel(end.getFullYear(), end.getMonth()), start: iso(start), end: iso(end), balance: bal, min: i === 0 ? c.min : Math.round(bal * 0.03 * 100) / 100, due: i === 0 ? c.dueDate : iso(due), spend: i === 0 ? spend : Math.round(bal * 0.92 * 100) / 100, payments: i === 0 ? 0 : bal, txns: inRange, current: i === 0 }
  })
}
/* Earlier months come from the bank's history; the mock makes a believable, fixed set of lines for each one. */
const PLACES: [string, string][] = [['Pantry Market', 'Groceries'], ['Café Lune', 'Dining'], ['Ride Now', 'Transport'], ['Byte Store', 'Shopping'], ['Table Collective', 'Dining'], ['Cloudbox', 'Subscriptions'], ['Fuel Stop', 'Transport'], ['Glow Beauty', 'Shopping'], ['Northway Air', 'Travel']]
function history(m: string, i: number, start: Date, end: Date, spend: number): St.Txn[] {
  const n = 6 + (hash(m + 'n' + i) % 4), w = Array.from({ length: n }, (_, j) => 1 + (hash(m + i + 'w' + j) % 9)), sw = w.reduce((a, x) => a + x, 0), span = end.getTime() - start.getTime()
  let left = spend
  return w.map((x, j) => { const [merchant, cat] = PLACES[hash(m + i + 'p' + j) % PLACES.length], amount = j === n - 1 ? Math.round(left * 100) / 100 : Math.round(spend * x / sw * 100) / 100; left -= amount; return { id: `S${i}-${j}`, at: start.getTime() + span * (j + 0.5) / n, merchant, cat, amount, points: Math.round(amount / St.rate() * 0.01) } }).sort((a, b) => b.at - a.at)
}
/** A statement as a spreadsheet file the customer can keep. */
export function statementCsv(st: Statement) {
  const rows = [['Date', 'Merchant', 'Category', 'Amount', 'Points'], ...st.txns.map(t => [iso(new Date(t.at)), t.merchant, t.cat, (t.refund ? -t.amount : t.amount).toFixed(2), String(t.points || 0)])]
  rows.push([], ['Statement balance', '', '', st.balance.toFixed(2), ''], ['Minimum payment', '', '', st.min.toFixed(2), ''], ['Payment due', st.due, '', '', ''])
  return rows.map(r => r.map(x => /[",]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x).join(',')).join('\n')
}
export function transactions(q = '', cat = '') { need('transactions.read'); const t = q.trim().toLowerCase(); return St.get().txns.filter(x => (!cat || x.cat === cat) && (!t || x.merchant.toLowerCase().includes(t) || x.cat.toLowerCase().includes(t))) }

/* ---------- spending limits by category ---------- */
export const LIMIT_CATS = ['Dining', 'Groceries', 'Shopping', 'Travel', 'Transport', 'Entertainment']
export function limits(): Record<string, number> { need('cards.limits'); return (St.get().seen.catLimits || {}) as Record<string, number> }
export function spentThisMonth(cat: string) { const now = new Date(), from = new Date(now.getFullYear(), now.getMonth(), 1).getTime(); return St.get().txns.filter(t => t.cat === cat && t.at >= from && !t.refund).reduce((a, t) => a + t.amount, 0) }
export function setLimit(a: { cat: string; amount: number | null }): R {
  need('cards.limits'); const cur = { ...limits() }; if (a.amount == null || a.amount <= 0) delete cur[a.cat]; else cur[a.cat] = Math.round(a.amount)
  St.set(s => ({ seen: { ...s.seen, catLimits: cur } }))
  return { say: a.amount ? `${a.cat}: a limit of ${M().money(Math.round(a.amount))} a month is set. Card payments over it are declined until the 1st.` : `${a.cat}: no monthly limit now.`, blocks: [] }
}

/* ---------- lost, stolen, damaged, and the new card ---------- */
export type CaseKind = 'replacement' | 'dispute' | 'limit'
export function openCase(kind: CaseKind) { return St.get().bookings.filter(b => (b.extra?.case === kind || (kind === 'replacement' && b.title === 'Replacement card' && b.status !== 'delivered')) && !['cancelled', 'refunded', 'done'].includes(b.status) && !(b.extra?.closed)) }
export function replaceAsk(a: { why: 'lost' | 'stolen' | 'damaged' | 'missing'; to: string }): R {
  need('cards.replace'); const c = St.get().card
  if (openCase('replacement').length) return { say: 'A new card is already on its way.', blocks: [] }
  const addr = St.get().addresses.find(x => x.id === a.to) || St.get().addresses[0]
  const newNumber = a.why === 'lost' || a.why === 'stolen'
  return { blocks: [], confirm: { kind: 'action', title: 'Order a new card', summary: `To ${addr.label}, ${addr.line}`, lines: [['Reason', ({ lost: 'Lost', stolen: 'Stolen', damaged: 'Damaged', missing: "Didn't arrive" } as any)[a.why]], ['Card ending ' + c.last4, newNumber ? 'Cancelled now' : 'Works until you activate the new one'], ['New card', newNumber ? 'New number' : 'Same number']], total: ['Arrives', 'In 3 to 5 working days'], act: { f: 'replaceDo', a } } }
}
export function replaceDo(a: { why: string; to: string }): R {
  need('cards.replace'); if (openCase('replacement').length) return { say: 'A new card is already on its way.', blocks: [] }
  const addr = St.get().addresses.find(x => x.id === a.to) || St.get().addresses[0], newNumber = a.why === 'lost' || a.why === 'stolen'
  if (newNumber) St.set(s => ({ card: { ...s.card, frozen: true } }))
  St.pay({ id: 'x', cat: 'bank', title: 'Replacement card', sub: `To ${addr.label}`, qty: 1, unit: 0, total: 0, kind: 'order', extra: { case: 'replacement', why: a.why, newNumber }, tracker: { steps: ['Ordered', 'Printed', 'Posted', 'Delivered'], current: 1, eta: '3 to 5 days' } } as any, 0, 0)
  return { say: newNumber ? `Your card ending ${St.get().card.last4} is frozen and a new card with a new number is on its way to ${addr.label}. Activate it here when it arrives.` : `A new card with the same number is on its way to ${addr.label}. Your current card works until you activate the new one.`, blocks: [] }
}
export function arrived() { return St.get().bookings.find(b => b.extra?.case === 'replacement' && b.status === 'delivered' && !b.extra?.activated) }
export function activate(a: { last4: string; expiry: string }): R {
  need('cards.activate'); const b = arrived(); if (!b) return { say: 'There is no new card waiting to be activated.', blocks: [] }
  const newLast4 = b.extra?.newNumber ? String(1000 + (hash(b.ref) % 9000)) : St.get().card.last4
  if (a.last4 !== newLast4 || a.expiry.replace(/\s/g, '') !== EXPIRY) return { say: 'Those details don\'t match the new card. Check the last four digits and the expiry date on the front.', blocks: [] }
  St.updateBooking(b.id, { extra: { ...b.extra, activated: true, closed: true }, status: 'done' })
  St.set(s => ({ card: { ...s.card, last4: newLast4, frozen: false } }))
  return { say: `Your new card ending ${newLast4} is active. It works everywhere now, and anything set up on the old card moves over by itself.`, blocks: [] }
}
export function newCardLast4() { const b = arrived(); return b ? (b.extra?.newNumber ? String(1000 + (hash(b.ref) % 9000)) : St.get().card.last4) : '' }

/* ---------- disputes ---------- */
export const DISPUTE_REASONS = ["I didn't receive it", "It's not as described", 'I was charged twice', 'I cancelled but was still charged', "I don't recognise it"]
export function disputeAsk(a: { txn: string; reason: string; amount: number; note?: string; photo?: boolean }): R {
  need('disputes'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'Pick a payment first.', blocks: [] }
  if (St.get().bookings.some(b => b.extra?.case === 'dispute' && b.extra?.txn === a.txn && !b.extra?.closed)) return { say: `You've already disputed the ${t.merchant} payment. Its case is on My card.`, blocks: [] }
  const amt = Math.min(Math.max(0.01, a.amount), t.amount)
  return { blocks: [], confirm: { kind: 'action', title: 'Send this dispute', summary: `${t.merchant} · ${M().date(new Date(t.at), 'day')}`, lines: [['Reason', a.reason], ['Disputed amount', M().money(amt, 2)], ['While we look', 'The amount is credited back for now']], total: ['Decision', 'Usually within 10 working days'], cta: 'Send', act: { f: 'disputeDo', a: { ...a, amount: amt } } } }
}
export function disputeDo(a: { txn: string; reason: string; amount: number; note?: string; photo?: boolean }): R {
  need('disputes'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'That payment is no longer on your card.', blocks: [] }
  if (St.get().bookings.some(b => b.extra?.case === 'dispute' && b.extra?.txn === a.txn && !b.extra?.closed)) return { say: `You've already disputed the ${t.merchant} payment.`, blocks: [] }
  St.pay({ id: 'x', cat: 'bank', title: `Dispute: ${t.merchant}`, sub: a.reason, qty: 1, unit: 0, total: 0, kind: 'claim', extra: { case: 'dispute', txn: a.txn, amount: a.amount, note: a.note }, tracker: { steps: ['Received', 'Credited for now', 'Reviewing', 'Decision'], current: 1, eta: 'Within 10 working days' } } as any, 0, 0)
  St.set(s => ({ card: { ...s.card, balance: Math.round((s.card.balance - a.amount) * 100) / 100 }, txns: [{ id: St.uidx(), at: Date.now(), merchant: `Temporary credit: ${t.merchant}`, cat: t.cat, amount: a.amount, points: 0, refund: true }, ...s.txns] }))
  return { say: `Sent. ${M().money(a.amount, 2)} is credited back while the bank looks into it. The case is on My card, and you'll get a decision within 10 working days.`, blocks: [] }
}

/* ---------- credit limit ---------- */
export function limitRequestDo(a: { to: number }): R {
  need('credit.limit'); const c = St.get().card
  if (openCase('limit').length) return { say: 'You already have a limit request with the bank.', blocks: [] }
  St.pay({ id: 'x', cat: 'bank', title: 'Higher credit limit', sub: `${M().money(c.limit)} to ${M().money(a.to)}`, qty: 1, unit: 0, total: 0, kind: 'request', extra: { case: 'limit', to: a.to }, tracker: { steps: ['Sent', 'Reviewing', 'Decision'], current: 1, eta: 'Within 2 working days' } } as any, 0, 0)
  return { say: `Sent to the bank: a limit of ${M().money(a.to)} instead of ${M().money(c.limit)}. They'll check affordability and decide within 2 working days. Nothing changes until then.`, blocks: [] }
}
export function limitRequestAsk(a: { to: number }): R {
  need('credit.limit'); const c = St.get().card
  return { blocks: [], confirm: { kind: 'action', title: 'Ask for a higher limit', summary: `Card ending ${c.last4} · the bank checks affordability first`, lines: [['Limit now', M().money(c.limit)]], total: ['Asking for', M().money(a.to)], cta: 'Send to the bank', act: { f: 'limitRequestDo', a } } }
}

/* ---------- phone wallet ---------- */
export function walletAsk(a: { wallet: 'apple' | 'google' | 'samsung' }): R {
  need('cards.tokenise'); const c = St.get().card, name = ({ apple: 'Apple Wallet', google: 'Google Wallet', samsung: 'Samsung Wallet' } as any)[a.wallet]
  if ((St.get().seen.wallets || {})[a.wallet]) return { say: `Your card is already in ${name}.`, blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: `Add to ${name}`, summary: `Card ending ${c.last4}`, lines: [['On this phone', 'Pay by tapping or online'], ['Card number', 'A separate device number is used, not your card number']], total: ['Ready', 'Straight away'], act: { f: 'walletDo', a } } }
}
export function walletDo(a: { wallet: string }): R {
  need('cards.tokenise'); const name = ({ apple: 'Apple Wallet', google: 'Google Wallet', samsung: 'Samsung Wallet' } as any)[a.wallet]
  St.set(s => ({ seen: { ...s.seen, wallets: { ...(s.seen.wallets || {}), [a.wallet]: Date.now() } } }))
  return { say: `Your card is in ${name}. You can pay with this phone now.`, blocks: [] }
}
export function walletRemove(a: { wallet: string }): R { need('cards.tokenise'); St.set(s => { const w = { ...(s.seen.wallets || {}) }; delete w[a.wallet]; return { seen: { ...s.seen, wallets: w } } }); return { say: 'Removed from that wallet.', blocks: [] } }

/* ---------- travel notices ---------- */
export type Notice = { id: string; where: string; from: string; to: string }
export function notices(): Notice[] { need('cards.travel'); const today = iso(new Date()); return ((St.get().seen.notices || []) as Notice[]).filter(n => n.to >= today) }
export function noticeAdd(a: { where: string; from: string; to: string }): R {
  need('cards.travel'); if (!a.where.trim() || !a.from || !a.to || a.to < a.from) return { say: 'Add where you\'re going and both dates.', blocks: [] }
  St.set(s => ({ seen: { ...s.seen, notices: [...(s.seen.notices || []), { id: St.uidx(), ...a, where: a.where.trim() }] } }))
  return { say: `Noted: ${a.where.trim()}, ${M().date(a.from)} to ${M().date(a.to)}. Your card works there, and the bank won't block payments as unusual.`, blocks: [] }
}
export function noticeRemove(id: string) { St.set(s => ({ seen: { ...s.seen, notices: (s.seen.notices || []).filter((n: Notice) => n.id !== id) } })) }

/* ---------- revealing details and PIN ---------- */
export function revealDetails(): R { need('cards.details'); St.set(s => ({ seen: { ...s.seen, revealUntil: Date.now() + 30000 } })); return { say: '', blocks: [] } }
export function revealPin(): R { need('cards.pin'); St.set(s => ({ seen: { ...s.seen, pinUntil: Date.now() + 10000 } })); return { say: '', blocks: [] } }
