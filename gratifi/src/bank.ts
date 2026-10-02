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

export type Statement = { id: string; label: string; start: string; end: string; balance: number; min: number; due: string; spend: number; payments: number; txns: St.Txn[]; current?: boolean; purchases: number; brought: number }
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
    const net = Math.round(inRange.filter(t => t.cat !== 'Payment').reduce((a, t) => a + (t.refund ? -t.amount : t.amount), 0) * 100) / 100
    const purchases = Math.min(bal, Math.max(0, net)), brought = Math.round((bal - purchases) * 100) / 100
    return { purchases, brought, id: iso(end).slice(0, 7), label: M().monthLabel(end.getFullYear(), end.getMonth()), start: iso(start), end: iso(end), balance: bal, min: i === 0 ? c.min : Math.round(bal * 0.03 * 100) / 100, due: i === 0 ? c.dueDate : iso(due), spend: i === 0 ? spend : Math.round(bal * 0.92 * 100) / 100, payments: i === 0 ? 0 : bal, txns: inRange, current: i === 0 }
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
/** Spending in one category over the last 30 days, which is what a spending limit counts. */
export function spentThisMonth(cat: string) { const from = Date.now() - 30 * 864e5; return St.get().txns.filter(t => t.cat === cat && t.at >= from && !t.refund).reduce((a, t) => a + t.amount, 0) }
export function setLimit(a: { cat: string; amount: number | null }): R {
  need('cards.limits'); const cur = { ...limits() }; if (a.amount == null || a.amount <= 0) delete cur[a.cat]; else cur[a.cat] = Math.round(a.amount)
  St.set(s => ({ seen: { ...s.seen, catLimits: cur } }))
  return { say: a.amount ? `${a.cat}: a limit of ${M().money(Math.round(a.amount))} over 30 days is set. Card payments that would go over it are declined.` : `${a.cat}: no limit now.`, blocks: [] }
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

/* ---------- monthly payments on a purchase (instalments) ---------- */
const PLAN_FEE: Record<number, number> = { 3: 0, 6: 0.0171, 12: 0.0456 }
const r2 = (n: number) => Math.round(n * 100) / 100
const clean = (m: string) => m.replace(/^[^:]+: /, '')
export function planOptions(amount: number) { return [3, 6, 12].map(m => { const fee = r2(amount * PLAN_FEE[m]); return { months: m, fee, monthly: r2((amount + fee) / m), total: r2(amount + fee) } }) }
const busyTxn = (kind: string) => new Set(St.get().bookings.filter(b => b.extra?.case === kind && !b.extra?.closed).map(b => b.extra.txn))
const purchases = (days: number) => St.get().txns.filter(t => !t.refund && !t.pending && t.cat !== 'Payment' && t.at >= Date.now() - days * 864e5 && !/^(Temporary credit|Paid with points)/.test(t.merchant)).sort((a, b) => b.at - a.at)
export const planMin = () => Cat.px(100, St.get().market)
export function planEligible(): St.Txn[] { need('credit.plans'); const busy = busyTxn('plan'); return purchases(60).filter(t => t.amount >= planMin() && !busy.has(t.id)) }
export function planAsk(a: { txn: string; months: number }): R {
  need('credit.plans'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'Pick a purchase first.', blocks: [] }
  if (busyTxn('plan').has(t.id)) return { say: `${clean(t.merchant)} is already on monthly payments.`, blocks: [] }
  const o = planOptions(t.amount).find(x => x.months === a.months); if (!o) return { say: 'Pick a plan.', blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: `Pay ${clean(t.merchant)} monthly`, summary: `${M().money(t.amount, 2)} · ${M().date(new Date(t.at), 'day')}`, lines: [['Plan', `${o.months} months · ${M().money(o.monthly, 2)} a month`], ['Fees', o.fee ? M().money(o.fee, 2) : 'None'], ['First payment', 'On your next statement']], total: ['In all', M().money(o.total, 2)], cta: 'Set it up', act: { f: 'planDo', a } } }
}
export function planDo(a: { txn: string; months: number }): R {
  need('credit.plans'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'That purchase is no longer on your card.', blocks: [] }
  if (busyTxn('plan').has(t.id)) return { say: `${clean(t.merchant)} is already on monthly payments.`, blocks: [] }
  const o = planOptions(t.amount).find(x => x.months === a.months)!
  St.pay({ id: 'x', cat: 'bank', title: `Monthly payments: ${clean(t.merchant)}`, sub: `${o.months} × ${M().money(o.monthly, 2)}`, qty: 1, unit: 0, total: 0, kind: 'request', extra: { case: 'plan', txn: t.id, months: o.months, monthly: o.monthly, fee: o.fee }, tracker: { steps: ['Set up', 'Paying monthly', 'Paid off'], current: 1, eta: `${o.months} months` } } as any, 0, 0)
  return { say: `Done. ${clean(t.merchant)} is now ${o.months} payments of ${M().money(o.monthly, 2)}${o.fee ? `, ${M().money(o.fee, 2)} in fees` : ', with no fee'}. The first one is on your next statement, and you can pay it off early at any time.`, blocks: [] }
}

/* ---------- balance transfer from another card ---------- */
export const BT = { months: 18, feePct: 3 }
export function btAsk(a: { bank: string; last4: string; amount: number }): R {
  need('credit.transfers'); const c = St.get().card, avail = r2(c.limit - c.balance)
  if (!a.bank?.trim() || !/^\d{4}$/.test(a.last4 || '') || !(a.amount > 0)) return { say: 'Add the other bank, the last four digits of that card and how much to move.', blocks: [] }
  if (St.get().bookings.some(b => b.extra?.case === 'bt' && !b.extra?.closed)) return { say: 'You already have a balance transfer with the bank.', blocks: [] }
  const fee = r2(a.amount * BT.feePct / 100)
  if (a.amount + fee > avail) return { say: `That's more than your available credit of ${M().money(avail, 2)} once the fee is added. Try ${M().money(Math.floor((avail / (1 + BT.feePct / 100)) / 10) * 10)} or less.`, blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: 'Move a balance to this card', summary: `From ${a.bank.trim()}, card ending ${a.last4}`, lines: [['Amount', M().money(a.amount, 2)], ['Fee', `${BT.feePct}% · ${M().money(fee, 2)}`], ['Interest', `0% for ${BT.months} months`]], total: ['Added to this card', M().money(a.amount + fee, 2)], cta: 'Send to the bank', act: { f: 'btDo', a } } }
}
export function btDo(a: { bank: string; last4: string; amount: number }): R {
  need('credit.transfers'); if (St.get().bookings.some(b => b.extra?.case === 'bt' && !b.extra?.closed)) return { say: 'You already have a balance transfer with the bank.', blocks: [] }
  const fee = r2(a.amount * BT.feePct / 100)
  St.pay({ id: 'x', cat: 'bank', title: 'Balance transfer', sub: `${M().money(a.amount, 2)} from ${a.bank.trim()}`, qty: 1, unit: 0, total: 0, kind: 'request', extra: { case: 'bt', ...a, fee }, tracker: { steps: ['Sent', 'Bank checks', 'Moved'], current: 1, eta: 'Within 5 working days' } } as any, 0, 0)
  return { say: `Sent to the bank: ${M().money(a.amount, 2)} from your ${a.bank.trim()} card, at 0% for ${BT.months} months with a ${BT.feePct}% fee. They'll check it and move it within 5 working days. Keep paying the other card until it shows as paid.`, blocks: [] }
}

/* ---------- a second cardholder ---------- */
export function holderAsk(a: { name: string; rel: string; dob: string; limit?: number }): R {
  need('cards.holders'); const parts = (a.name || '').trim().split(/\s+/)
  if (parts.length < 2) return { say: 'Add their first name and surname, as on their ID.', blocks: [] }
  const age = a.dob ? Math.floor((Date.now() - new Date(a.dob + 'T12:00:00').getTime()) / (365.25 * 864e5)) : 0
  if (!a.dob || age < 16) return { say: 'Additional cardholders need to be 16 or over.', blocks: [] }
  const addr = St.get().addresses[0]
  return { blocks: [], confirm: { kind: 'action', title: `Add ${a.name.trim()} to your card`, summary: `${a.rel} · their own card on your account`, lines: [['Their spending limit', a.limit ? M().money(a.limit) : 'Your full limit'], ['Card sent to', `${addr.label}, ${addr.line}`], ['You stay responsible', 'For everything spent on their card']], total: ['Arrives', 'In 5 to 7 working days, after the bank\'s checks'], cta: 'Send to the bank', act: { f: 'holderDo', a } } }
}
export function holderDo(a: { name: string; rel: string; dob: string; limit?: number }): R {
  need('cards.holders')
  St.pay({ id: 'x', cat: 'bank', title: `Card for ${a.name.trim().split(/\s+/)[0]}`, sub: `${a.rel}${a.limit ? ` · limit ${M().money(a.limit)}` : ''}`, qty: 1, unit: 0, total: 0, kind: 'request', extra: { case: 'holder', ...a }, tracker: { steps: ['Sent', 'Bank checks', 'Card posted', 'Delivered'], current: 1, eta: '5 to 7 working days' } } as any, 0, 0)
  return { say: `Sent to the bank. Once their checks are done, ${a.name.trim().split(/\s+/)[0]}'s card is posted to your home, and you'll see what they spend here too.`, blocks: [] }
}

/* ---------- points: pay off a purchase, send to family, claim missing points ---------- */
export function ptsPayEligible(): St.Txn[] { need('loyalty.redeem'); const busy = new Set((St.get().seen.ptsPaid || []) as string[]); return purchases(90).filter(t => !busy.has(t.id)).slice(0, 8) }
export function ptsPayAsk(a: { txn: string; pts: number }): R {
  need('loyalty.redeem'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'Pick a purchase first.', blocks: [] }
  const rate = St.rate(), bal = St.get().balance, max = Math.min(bal, Math.ceil(t.amount / rate)), pts = Math.max(100, Math.min(Math.round(a.pts), max))
  if (bal < 100) return { say: 'You need at least 100 points to pay off a purchase.', blocks: [] }
  const val = r2(Math.min(t.amount, pts * rate))
  return { blocks: [], confirm: { kind: 'action', title: `Pay off ${clean(t.merchant)} with points`, summary: `${M().money(t.amount, 2)} · ${M().date(new Date(t.at), 'day')}`, lines: [['Points used', M().pts(pts)], ['Taken off your card balance', M().money(val, 2)], ['Points left', M().num(bal - pts)]], total: ['Shows on your statement', 'As a credit'], cta: 'Use points', act: { f: 'ptsPayDo', a: { txn: t.id, pts } } } }
}
export function ptsPayDo(a: { txn: string; pts: number }): R {
  need('loyalty.redeem'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'That purchase is no longer on your card.', blocks: [] }
  if (((St.get().seen.ptsPaid || []) as string[]).includes(t.id)) return { say: `You've already used points on ${clean(t.merchant)}.`, blocks: [] }
  if (a.pts > St.get().balance) return { say: 'You don\'t have enough points for that now.', blocks: [] }
  const val = r2(Math.min(t.amount, a.pts * St.rate()))
  St.set(s => ({ balance: s.balance - a.pts, ledger: [{ id: St.uidx(), at: Date.now(), label: `Paid off with points: ${clean(t.merchant)}`, pts: -a.pts }, ...s.ledger], card: { ...s.card, balance: r2(s.card.balance - val) }, txns: [{ id: St.uidx(), at: Date.now(), merchant: `Paid with points: ${clean(t.merchant)}`, cat: t.cat, amount: val, points: 0, refund: true }, ...s.txns], seen: { ...s.seen, ptsPaid: [...((s.seen.ptsPaid || []) as string[]), t.id] } }))
  return { say: `Done. ${M().pts(a.pts)} paid off ${M().money(val, 2)} of ${clean(t.merchant)}. It shows on your statement as a credit, and you have ${M().pts(St.get().balance)} left.`, blocks: [] }
}
export function sendPtsAsk(a: { name: string; member: string; pts: number }): R {
  need('loyalty.transfer'); const bal = St.get().balance
  if ((a.name || '').trim().split(/\s+/).length < 2) return { say: 'Add their first name and surname, as the bank has them.', blocks: [] }
  if (!/^\d{8}$/.test((a.member || '').replace(/\s/g, ''))) return { say: 'Their membership number is the 8 digits on their card or in their app.', blocks: [] }
  if (!(a.pts >= 100) || a.pts > bal) return { say: a.pts > bal ? `You have ${M().pts(bal)}.` : 'Send at least 100 points.', blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: `Send points to ${a.name.trim()}`, summary: `Member ${a.member.replace(/\s/g, '').replace(/(\d{4})(\d{4})/, '$1 $2')} · a family member with the same bank`, lines: [['Points', M().pts(a.pts)], ['Points left', M().num(bal - a.pts)]], total: ['Arrives', 'Straight away'], cta: 'Send', act: { f: 'sendPtsDo', a } } }
}
export function sendPtsDo(a: { name: string; member: string; pts: number }): R {
  need('loyalty.transfer'); if (a.pts > St.get().balance) return { say: 'You don\'t have enough points for that now.', blocks: [] }
  St.set(s => ({ balance: s.balance - a.pts, ledger: [{ id: St.uidx(), at: Date.now(), label: `Sent to ${a.name.trim()}`, pts: -a.pts }, ...s.ledger] }))
  St.pay({ id: 'x', cat: 'points', title: `Points to ${a.name.trim().split(/\s+/)[0]}`, sub: `${M().pts(a.pts)} · member ${a.member.slice(-4)}`, qty: 1, unit: 0, total: 0, kind: 'transfer', extra: { case: 'family', ...a } } as any, 0, 0)
  return { say: `Sent. ${a.name.trim().split(/\s+/)[0]} has ${M().pts(a.pts)} from you, and you have ${M().pts(St.get().balance)} left.`, blocks: [] }
}
export function claimEligible(): St.Txn[] { need('loyalty.points'); const busy = busyTxn('points'); return purchases(90).filter(t => !busy.has(t.id)).slice(0, 8) }
export function missingPtsDo(a: { txn: string }): R {
  need('loyalty.points'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'Pick the purchase first.', blocks: [] }
  if (busyTxn('points').has(t.id)) return { say: `You've already asked about the points on ${clean(t.merchant)}.`, blocks: [] }
  const due = Math.max(1, Math.round(t.amount / St.rate() * 0.01))
  St.pay({ id: 'x', cat: 'bank', title: `Missing points: ${clean(t.merchant)}`, sub: `About ${M().pts(due)} expected`, qty: 1, unit: 0, total: 0, kind: 'claim', extra: { case: 'points', txn: t.id, due }, tracker: { steps: ['Received', 'Checking', 'Added'], current: 1, eta: 'Within 5 working days' } } as any, 0, 0)
  return { say: `Sent. The bank will check the points on ${clean(t.merchant)} (about ${M().pts(due)}) and add them within 5 working days. Points can take up to 3 days after a purchase to appear on their own.`, blocks: [] }
}

/* ---------- claiming on card benefits: purchase protection and extended warranty ---------- */
export const PROTECT_REASONS = ['Stolen', 'Accidentally damaged', 'Stopped working (warranty)']
export function protectEligible(): St.Txn[] { need('benefits.read'); const busy = busyTxn('protect'); return purchases(365).filter(t => ['Shopping', 'Groceries'].includes(t.cat) && !busy.has(t.id)).slice(0, 8) }
export function protectAsk(a: { txn: string; reason: string; what: string }): R {
  need('benefits.read'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'Pick the purchase first.', blocks: [] }
  const days = Math.floor((Date.now() - t.at) / 864e5), warranty = /warranty/i.test(a.reason)
  if (!warranty && days > 120) return { say: `Purchase protection covers 120 days, and ${clean(t.merchant)} was ${days} days ago. If it has stopped working, the extended warranty may cover it instead.`, blocks: [] }
  if (!(a.what || '').trim()) return { say: 'Say what the item is.', blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: warranty ? 'Claim on the extended warranty' : 'Claim on purchase protection', summary: `${a.what.trim()} · ${clean(t.merchant)} · ${M().money(t.amount, 2)}`, lines: [['What happened', a.reason], ['Bought', `${M().date(new Date(t.at), 'day')} · ${days === 0 ? 'today' : days === 1 ? '1 day ago' : days + ' days ago'}`], ['What to keep', 'The receipt and, for damage, the item']], total: ['Decision', 'Usually within 10 working days'], cta: 'Send claim', act: { f: 'protectDo', a } } }
}
export function protectDo(a: { txn: string; reason: string; what: string }): R {
  need('benefits.read'); const t = St.get().txns.find(x => x.id === a.txn); if (!t) return { say: 'That purchase is no longer on your card.', blocks: [] }
  if (busyTxn('protect').has(t.id)) return { say: `You've already claimed on ${clean(t.merchant)}.`, blocks: [] }
  St.pay({ id: 'x', cat: 'bank', title: `Claim: ${a.what.trim()}`, sub: `${a.reason} · ${clean(t.merchant)}`, qty: 1, unit: 0, total: 0, kind: 'claim', extra: { case: 'protect', txn: t.id, ...a, amount: t.amount }, tracker: { steps: ['Received', 'Insurer reviewing', 'Decision'], current: 1, eta: 'Within 10 working days' } } as any, 0, 0)
  return { say: `Sent to the card's insurer. They may ask for the receipt${/damaged/i.test(a.reason) ? ' and a photo of the damage' : /stolen/i.test(a.reason) ? ' and a police reference' : ''}; you'll hear within 10 working days.`, blocks: [] }
}

/* ---------- moving to a different card ---------- */
export const CARDS = () => { const m = St.get().market; return [{ id: 'core', name: 'Gratifi Card', fee: 0, earn: '1 point per £1', perks: ['2 lounge visits a year', 'Purchase protection, 120 days', 'No fees abroad'] }, { id: 'plus', name: 'Gratifi Card Plus', fee: Cat.px(195, m), earn: '2 points per £1', perks: ['Unlimited lounge visits', 'Travel insurance for the family', 'Purchase protection, 180 days', '25,000 bonus points after 3 months'] }] }
export function upgradeCardAsk(a: { to: string }): R {
  need('cards.products'); const c = CARDS().find(x => x.id === a.to); if (!c) return { say: 'Pick a card.', blocks: [] }
  if (St.get().bookings.some(b => b.extra?.case === 'cardswitch' && !b.extra?.closed)) return { say: 'You already have a card change with the bank.', blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: `Move to ${c.name}`, summary: `Same account, same number, same points`, lines: [['Annual fee', c.fee ? `${M().money(c.fee)} a year` : 'None'], ['Points', c.earn.replace('£1', M().money(1))], ['New card', 'Posted once the bank approves']], total: ['Decision', 'Within 2 working days'], cta: 'Send to the bank', act: { f: 'upgradeCardDo', a } } }
}
export function upgradeCardDo(a: { to: string }): R {
  need('cards.products'); const c = CARDS().find(x => x.id === a.to)!
  St.pay({ id: 'x', cat: 'bank', title: `Move to ${c.name}`, sub: c.fee ? `${M().money(c.fee)} a year` : 'No annual fee', qty: 1, unit: 0, total: 0, kind: 'request', extra: { case: 'cardswitch', to: c.id }, tracker: { steps: ['Sent', 'Bank checks', 'New card posted'], current: 1, eta: 'Within 2 working days' } } as any, 0, 0)
  return { say: `Sent to the bank. If they approve ${c.name}, the new card is posted with the same number, and your points and settings move across.`, blocks: [] }
}

/* ---------- removing an additional cardholder ---------- */
export function holders() { need('cards.holders'); return St.get().bookings.filter(b => b.extra?.case === 'holder' && !b.extra?.removed && !['cancelled', 'refunded'].includes(b.status)) }
export function holderRemoveAsk(a: { id: string }): R {
  need('cards.holders'); const b = St.get().bookings.find(x => x.id === a.id); if (!b) return { say: 'Pick the cardholder.', blocks: [] }
  return { blocks: [], confirm: { kind: 'action', title: `Remove ${b.extra.name.split(' ')[0]}'s card`, summary: 'Their card stops working straight away', lines: [['Their spending so far', 'Stays on your statement'], ['Their card', 'Cancelled now']], total: ['Your card', 'Not affected'], cta: 'Remove', act: { f: 'holderRemoveDo', a } } }
}
export function holderRemoveDo(a: { id: string }): R {
  need('cards.holders'); const b = St.get().bookings.find(x => x.id === a.id); if (!b) return { say: 'That cardholder is no longer on your card.', blocks: [] }
  St.updateBooking(b.id, { status: 'done', extra: { ...b.extra, removed: true, closed: true, outcome: 'Card cancelled' }, tracker: { steps: ['Added', 'Removed'], current: 1, eta: 'Card cancelled' } })
  return { say: `${b.extra.name.split(' ')[0]}'s card is cancelled. Anything they spent before now stays on your statement.`, blocks: [] }
}
