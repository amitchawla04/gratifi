import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { CARDS, CardId, Txn, card as cardOf, PROGRAMME, STATEMENT_ISO, MEMORY0, itemById, r2, OFFERS } from './data'

export type Route = { name: string; params?: any; key: number }
export type Plan = { id: string; txnId: string; merchant: string; amount: number; months: number; fee: number; monthly: number }
export type Booking = { id: string; itemId: string; price: number; bonus: number; ref: string; status: 'booked' | 'cancelled'; txnId?: string; planId?: string }
export type Msg = { id: string; role: 'me' | 'ai'; text: string; intent?: string; steps?: string[]; params?: any; live?: boolean }
export type CardState = {
  extra: Txn[]; paid: number; frozen: boolean
  dd: null | { type: 'min' | 'full' | 'fixed'; amount?: number }
  plans: Plan[]; offers: Record<string, boolean>; bookings: Booking[]
  limit: number; limitNote?: string
  cardholders: { name: string; rel: string; last4: string; limit?: number }[]
  newCard: null | { last4: string; arrives: string; activated: boolean; reason: string }
  cashbackTaken: boolean
  disputes: Record<string, string>
  dismissed: Record<string, boolean>
  chat: Msg[]
  // Servicing preferences added for the full entitlement set. Optional, so older saved demos still load.
  cbr?: { registered: boolean; redeemed: number }
  amazonMoved?: number
  paperless?: boolean
  dueDay?: number | null
  limitPref?: 'auto' | 'ask' | 'none'
  controls?: Record<string, { atm: boolean; online: boolean; instore: boolean; blocked: string[] }>
  passes?: number
  approved?: Record<string, 'yes' | 'no'>
}
export type AlertCfg = { day: string; balance: number; spend: number; channel: 'Text' | 'Email' | 'Both' }
export const ALERT0: AlertCfg = { day: 'Mon', balance: 0, spend: 0, channel: 'Text' }
export type State = {
  v: number; cardId: CardId | null
  tab: string; stack: Route[]; dir: 1 | -1
  sheet: { name: string; params?: any } | null
  toast: { text: string; undo?: any; id: number } | null
  suggest: boolean | null
  alerts: Record<string, boolean>
  memory: { id: string; text: string; group: string; source: string }[]
  readNotifs: Record<string, boolean>
  per: Partial<Record<CardId, CardState>>
  alertCfg?: AlertCfg
}

const DD0: Record<CardId, CardState['dd']> = { 'avios-plus': { type: 'full' }, avios: null, rewards: { type: 'full' }, amazon: null, platinum: { type: 'fixed', amount: 600 }, forward: { type: 'full' }, 'premium-plus': { type: 'full' }, 'select-cashback': { type: 'full' }, 'select-charge': { type: 'full' } }
export const freshCard = (id: CardId): CardState => ({
  extra: [], paid: 0, frozen: false, dd: DD0[id], plans: [], offers: {}, bookings: [], limit: cardOf(id).limit,
  cardholders: id === 'premium-plus' ? PROGRAMME['premium-plus'].employees.map((e: any) => ({ name: e.name, rel: 'Employee', last4: e.last4, limit: e.limit })) : [],
  newCard: null, cashbackTaken: false, disputes: {}, dismissed: {}, chat: [],
  cbr: { registered: true, redeemed: 0 }, amazonMoved: 0, paperless: true, dueDay: null, limitPref: 'ask', controls: {}, passes: 0, approved: {},
})
const initial = (): State => ({
  v: 2, cardId: null, tab: 'home', stack: [], dir: 1, sheet: null, toast: null, suggest: null,
  alerts: { due: true, statement: true, limit: true, weekly: false, received: true, balance: false, spend: false, gratifi: true, presale: false },
  alertCfg: ALERT0,
  memory: MEMORY0, readNotifs: {}, per: {},
})

let K = 1
let seq = 48213
const nextRef = (p: string) => `${p}-${seq++}`
// Instalment Plan fees as published: 1% to 8% (6 months 2%, 12 months 4%, 24 months 8%). 3 months at 1% is the lowest published fee.
export const FEES: Record<number, number> = { 3: 0.01, 6: 0.02, 12: 0.04, 24: 0.08 }
export const planFor = (amount: number, months: number) => { const fee = r2(amount * FEES[months]); return { fee, monthly: r2((amount + fee) / months) } }

type A = { type: string; [k: string]: any }
function upd(s: State, fn: (c: CardState) => CardState): State {
  if (!s.cardId) return s
  const c = s.per[s.cardId] || freshCard(s.cardId)
  return { ...s, per: { ...s.per, [s.cardId]: fn(c) } }
}
const tx = (merchant: string, cat: string, amount: number, extra: Partial<Txn> = {}): Txn => ({ id: 'x' + K++, date: '2026-09-28', merchant, cat, amount, ...extra })

function reducer(s: State, a: A): State {
  switch (a.type) {
    case 'selectCard': return { ...s, cardId: a.id, tab: 'home', stack: [], sheet: null, toast: null, per: s.per[a.id as CardId] ? s.per : { ...s.per, [a.id]: freshCard(a.id) } }
    case 'leave': return { ...s, cardId: null, stack: [], sheet: null, toast: null }
    case 'tab': return { ...s, tab: a.tab, stack: [], dir: 1, sheet: null, toast: null }
    case 'push': return { ...s, stack: [...s.stack, { name: a.name, params: a.params, key: K++ }], dir: 1, sheet: null, toast: null }
    case 'replace': return { ...s, stack: [...s.stack.slice(0, -1), { name: a.name, params: a.params, key: K++ }], dir: 1, sheet: null, toast: null }
    case 'pop': return { ...s, stack: s.stack.slice(0, -1), dir: -1, sheet: null, toast: null }
    case 'home': return { ...s, stack: [], tab: a.tab || s.tab, dir: -1, sheet: null }
    case 'sheet': return { ...s, sheet: a.name ? { name: a.name, params: a.params } : null }
    case 'toast': return { ...s, toast: a.text ? { text: a.text, undo: a.undo, id: K++ } : null }
    case 'suggest': return { ...s, suggest: a.on }
    case 'alert': return { ...s, alerts: { ...s.alerts, [a.id]: !s.alerts[a.id] } }
    case 'forget': return { ...s, memory: s.memory.filter(m => m.id !== a.id) }
    case 'restoreMemory': return s.memory.some(m => m.id === a.item.id) ? s : { ...s, memory: [...s.memory, a.item] }
    case 'forgetAll': return { ...s, memory: s.memory.filter(m => !a.ids.includes(m.id)) }
    case 'readNotifs': return { ...s, readNotifs: { ...s.readNotifs, [s.cardId!]: true } }
    case 'resetAll': return { ...initial() }
    case 'resetCard': return s.cardId ? { ...s, per: { ...s.per, [s.cardId]: freshCard(s.cardId) }, stack: [], tab: 'home' } : s

    // ----- servicing -----
    case 'pay': return upd(s, c => ({ ...c, paid: r2(c.paid + a.amount), extra: [tx('Payment received, thank you', 'Payment', -a.amount, { pending: true }), ...c.extra] }))
    case 'dd': return upd(s, c => ({ ...c, dd: a.value }))
    case 'freeze': return upd(s, c => ({ ...c, frozen: a.on }))
    case 'lost': return upd(s, c => ({ ...c, frozen: false, newCard: { last4: a.last4, arrives: 'Wed 7 Oct', activated: false, reason: a.reason } }))
    case 'activate': return upd(s, c => c.newCard ? ({ ...c, newCard: { ...c.newCard, activated: true } }) : c)
    case 'plan': return upd(s, c => {
      const { fee, monthly } = planFor(a.amount, a.months)
      const p: Plan = { id: 'p' + K++, txnId: a.txnId, merchant: a.merchant, amount: a.amount, months: a.months, fee, monthly }
      return { ...c, plans: [...c.plans, p] }
    })
    case 'cancelPlan': return upd(s, c => ({ ...c, plans: c.plans.filter(p => p.id !== a.id) }))
    case 'limit': return upd(s, c => ({ ...c, limit: a.to, limitNote: a.note }))
    case 'transfer': return upd(s, c => ({ ...c, extra: [...(a.fee ? [tx(`${a.kind === 'money' ? 'Money' : 'Balance'} transfer fee`, 'Card fees', a.fee, { pending: true })] : []), tx(a.kind === 'money' ? 'Money transfer to your bank' : `Balance transfer from ${a.from}`, 'Transfers', a.amount, { pending: true, note: a.note }), ...c.extra] }))
    case 'cardholder': return upd(s, c => ({ ...c, cardholders: [...c.cardholders, { name: a.name, rel: a.rel, last4: a.last4, limit: a.limit }] }))
    case 'dispute': return upd(s, c => ({ ...c, disputes: { ...c.disputes, [a.txnId]: a.ref } }))
    case 'takeCashback': return upd(s, c => ({ ...c, cashbackTaken: true, extra: [tx('Cashback paid to your account', 'Cashback', -a.amount, { pending: true }), ...c.extra] }))
    case 'offer': return upd(s, c => ({ ...c, offers: { ...c.offers, [a.id]: !c.offers[a.id] } }))
    case 'set': return upd(s, c => ({ ...c, [a.key]: a.value }))
    case 'alertCfg': return { ...s, alertCfg: { ...(s.alertCfg || ALERT0), ...a.value } }
    case 'charge': return upd(s, c => ({ ...c, extra: [tx(a.merchant, a.cat, a.amount, { pending: true, note: a.note, by: a.by }), ...c.extra] }))
    case 'cbrRedeem': return upd(s, c => ({ ...c, cbr: { registered: true, redeemed: r2((c.cbr?.redeemed || 0) + a.amount) }, extra: a.to === 'card' ? [tx('Barclays Cashback Rewards', 'Cashback', -a.amount, { pending: true }), ...c.extra] : c.extra }))
    case 'dismiss': return upd(s, c => ({ ...c, dismissed: { ...(c.dismissed || {}), [a.id]: true } }))

    // ----- Gratifi bookings -----
    case 'book': return upd(s, c => {
      const it = itemById(a.itemId)
      const t = it.price > 0 ? tx(it.title, it.cat === 'Hotels' ? 'Travel' : it.cat, it.price, { pending: true, by: 'gratifi', note: it.when }) : null
      const b: Booking = { id: 'b' + K++, itemId: it.id, price: it.price, bonus: a.bonus, ref: nextRef('GR'), status: 'booked', txnId: t?.id }
      let plans = c.plans
      if (t && a.months) { const { fee, monthly } = planFor(it.price, a.months); const p: Plan = { id: 'p' + K++, txnId: t.id, merchant: it.title, amount: it.price, months: a.months, fee, monthly }; plans = [...plans, p]; b.planId = p.id }
      return { ...c, bookings: [b, ...c.bookings], plans, extra: t ? [t, ...c.extra] : c.extra }
    })
    case 'undoBooking': return upd(s, c => {
      const b = c.bookings.find(x => x.id === a.id); if (!b) return c
      return { ...c, bookings: c.bookings.filter(x => x.id !== a.id), extra: c.extra.filter(x => x.id !== b.txnId), plans: c.plans.filter(p => p.id !== b.planId) }
    })
    case 'cancelBooking': return upd(s, c => {
      const b = c.bookings.find(x => x.id === a.id); if (!b || b.status === 'cancelled') return c
      const it = itemById(b.itemId)
      // The charge is still pending, so cancelling removes it rather than adding a refund.
      void it
      return { ...c, bookings: c.bookings.map(x => x.id === a.id ? { ...x, status: 'cancelled' } : x), plans: c.plans.filter(p => p.id !== b.planId), extra: c.extra.filter(x => x.id !== b.txnId) }
    })
    case 'chat': return upd(s, c => ({ ...c, chat: [...c.chat, ...a.msgs] }))
    case 'clearChat': return upd(s, c => ({ ...c, chat: [] }))
    default: return s
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<A> }>(null as any)
const KEY = 'barclaycard-concept-v2'
export function Store({ children }: { children: React.ReactNode }) {
  const [s, d] = useReducer(reducer, undefined as any, () => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p.v === 2) return { ...initial(), ...p, stack: [], sheet: null, toast: null, tab: 'home' } } } catch { /* storage unavailable */ }
    return initial()
  })
  useEffect(() => { try { const { stack, sheet, toast, ...rest } = s; localStorage.setItem(KEY, JSON.stringify(rest)) } catch { /* storage unavailable */ } }, [s])
  return <Ctx.Provider value={{ s, d }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)

// ---------- derived account figures ----------
export function useAcct() {
  const { s } = useStore()
  return acct(s)
}
export function acct(s: State) {
  const c = cardOf(s.cardId || 'avios-plus')
  const cs = s.per[c.id] || freshCard(c.id)
  const base = c.txns.filter(t => t.date > STATEMENT_ISO).reduce((a, t) => a + t.amount, 0)
  const txns = [...cs.extra, ...c.txns].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  const balance = r2(c.stmt + base + cs.extra.reduce((a, t) => a + t.amount, 0))
  const limit = cs.limit
  const available = r2(Math.max(0, limit - balance))
  const planMonthly = r2(cs.plans.reduce((a, p) => a + p.monthly, 0))
  // Barclaycard's rule: the higher of 1% of the balance plus that month's interest and fees, or £5 (the balance, if under £5).
  // A charge card's statement is paid in full.
  const minBase = c.charge ? c.stmt : r2(Math.min(c.stmt, Math.max(5, c.stmt * 0.01 + (c.stmtFees || 0))))
  // Instalment Plans join the minimum from the next statement; this statement's minimum is already set.
  const minimum = minBase
  const minLeft = r2(Math.max(0, minimum - cs.paid))
  const stmtLeft = r2(Math.max(0, c.stmt - cs.paid))
  const prog = PROGRAMME[c.id]
  const purchases = (list: Txn[]) => list.filter(t => t.amount > 0 && !['Payment', 'Card fees', 'Transfers', 'Refund', 'Cashback'].includes(t.cat))
  const earnOn = (t: Txn) => {
    if (t.amount <= 0 || ['Payment', 'Card fees', 'Transfers', 'Refund', 'Cashback'].includes(t.cat)) return null
    if (c.reward === 'avios') return `+${fmtInt(Math.floor(t.amount * (c.rate || 1)))} Avios`
    if (c.reward === 'cashback') return `+${pence(t.amount * 0.0025)} cashback`
    if (c.reward === 'amazon') return `+${pence(t.amount * (t.merchant.startsWith('Amazon') ? 0.01 : 0.005))} back`
    if (c.reward === 'biz-cashback') return `+${pence(t.amount * 0.005)} cashback`
    if (c.reward === 'biz-monthly') return `+${pence(t.amount * 0.01)} cashback`
    return null
  }
  const cashback = c.reward === 'cashback' ? (cs.cashbackTaken ? 0 : prog.cashback) : 0
  // A damaged card keeps working until the new one is activated; a lost or stolen one is replaced straight away.
  const cardLast4 = cs.newCard && (cs.newCard.activated || cs.newCard.reason !== 'damaged') ? cs.newCard.last4 : c.last4
  const offersFor = OFFERS.filter(o => c.business ? o.biz || (!o.personal && !o.biz) : !o.biz)
  return { c, cs, txns, balance, limit, available, minimum, minLeft, stmtLeft, planMonthly, prog, purchases, earnOn, cashback, cardLast4, offersFor, used: Math.min(1, balance / limit) }
}
export const fmtInt = (n: number) => Math.round(n).toLocaleString('en-GB')
export const pence = (n: number) => n < 1 ? `${Math.max(1, Math.round(n * 100))}p` : `£${n.toFixed(2)}`

export function useNav() {
  const { d } = useStore()
  return {
    push: (name: string, params?: any) => d({ type: 'push', name, params }),
    replace: (name: string, params?: any) => d({ type: 'replace', name, params }),
    pop: () => d({ type: 'pop' }),
    home: (tab?: string) => d({ type: 'home', tab }),
    tab: (tab: string) => d({ type: 'tab', tab }),
    sheet: (name: string | null, params?: any) => d({ type: 'sheet', name, params }),
    toast: (text: string, undo?: any) => d({ type: 'toast', text, undo }),
  }
}
export function useToastTimer() {
  const { s, d } = useStore(); const t = useRef<any>(null)
  useEffect(() => { if (!s.toast) return; clearTimeout(t.current); t.current = setTimeout(() => d({ type: 'toast', text: null }), s.toast.undo ? 8000 : 3400); return () => clearTimeout(t.current) }, [s.toast?.id])
}
export const allCards = CARDS
