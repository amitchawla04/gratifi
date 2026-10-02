import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import { Item } from './data'

export type Route = { name: string; params?: any; key: number }
export type Activity = { id: string; title: string; sub: string; points: number; date: string; by: 'you' | 'assistant' | 'card'; pending?: boolean; bookingId?: string; kind?: string }
export type Booking = { id: string; item: Item; points: number; cash: number; ref: string; status: 'booked' | 'cancelled'; date: string; expUsed: number }
export type Memory = { id: string; text: string; group: string; source: string }
export type Msg = { id: string; role: 'me' | 'ai'; text?: string; intent?: string; steps?: string[] }

export type State = {
  v: number
  open: boolean; onboarded: boolean
  consent: { card: boolean; notify: boolean }
  prefs: { suggest: boolean; remind: boolean; remember: boolean; channel: 'app' | 'whatsapp' | 'email' }
  balance: number; expiring: number; tierPts: number
  activity: Activity[]
  bookings: Booking[]
  offers: Record<string, boolean>
  memory: Memory[]
  dismissed: Record<string, boolean>
  included: Record<string, boolean>
  goals: string[]
  readAlerts: boolean
  chat: Msg[]
  stack: Route[]
  modal: { name: string; params?: any } | null
  toast: { text: string; undo?: any; id: number } | null
  dir: 1 | -1
}

let K = 1
const initial = (): State => ({
  v: 3, open: false, onboarded: false,
  consent: { card: false, notify: false },
  prefs: { suggest: true, remind: true, remember: true, channel: 'app' },
  balance: 12480, expiring: 2400, tierPts: 16480,
  activity: [
    { id: 'a1', title: 'Weekly shop', sub: 'Supermarket · card purchase', points: 120, date: 'Today', by: 'card', pending: true },
    { id: 'a2', title: 'Missing points claimed', sub: 'Partner train tickets, Wed 28 Apr', points: 640, date: 'Yesterday', by: 'assistant', kind: 'claim' },
    { id: 'a3', title: 'Flight to Lisbon', sub: 'Fri 14 May · approved by you', points: -9800, date: 'Mon 3 May', by: 'you' },
    { id: 'a4', title: 'Card spend in April', sub: '84 purchases', points: 1860, date: 'Sat 1 May', by: 'card' },
  ],
  bookings: [],
  offers: { 'o-dbl': true, 'o-park': true },
  memory: [
    { id: 'm1', text: 'Window seat', group: 'Travel', source: 'You told me' },
    { id: 'm2', text: 'Small hotels over big chains', group: 'Travel', source: 'From your bookings' },
    { id: 'm3', text: 'Flat white', group: 'Food and drink', source: 'You told me' },
    { id: 'm4', text: 'Eats out most Fridays', group: 'Food and drink', source: 'From your card' },
    { id: 'm5', text: 'Lisbon, 14 to 16 May', group: 'Plans', source: 'From your bookings' },
  ],
  dismissed: {}, included: {}, goals: [], readAlerts: false,
  chat: [],
  stack: [{ name: 'home', key: 0 }],
  modal: null, toast: null, dir: 1,
})

type A = { type: string; [k: string]: any }
const ref = () => 'GR-' + Math.floor(10000 + Math.random() * 89999)
function reducer(s: State, a: A): State {
  switch (a.type) {
    case 'open': return { ...s, open: true, stack: [{ name: s.onboarded ? (a.to || 'home') : 'welcome', params: a.params, key: K++ }], dir: 1 }
    case 'close': return { ...s, open: false, modal: null }
    case 'push': return { ...s, stack: [...s.stack, { name: a.name, params: a.params, key: K++ }], dir: 1, modal: null, toast: s.toast?.undo ? null : s.toast }
    case 'replace': return { ...s, stack: [...s.stack.slice(0, -1), { name: a.name, params: a.params, key: K++ }], dir: 1, modal: null, toast: s.toast?.undo ? null : s.toast }
    case 'reset': return { ...s, stack: (a.name && a.name !== 'home') ? [{ name: 'home', key: K++ }, { name: a.name, params: a.params, key: K++ }] : [{ name: 'home', key: K++ }], dir: -1, modal: null, toast: s.toast?.undo ? null : s.toast }
    case 'pop': return s.stack.length > 1 ? { ...s, stack: s.stack.slice(0, -1), dir: -1, toast: s.toast?.undo ? null : s.toast } : { ...s, open: false, toast: null }
    case 'modal': return { ...s, modal: a.name ? { name: a.name, params: a.params } : null }
    case 'toast': return { ...s, toast: a.text ? { text: a.text, undo: a.undo, id: K++ } : null }
    case 'onboard': return { ...s, onboarded: true }
    case 'consent': return { ...s, consent: { ...s.consent, ...a.value } }
    case 'pref': return { ...s, prefs: { ...s.prefs, ...a.value } }
    case 'dismiss': return { ...s, dismissed: { ...s.dismissed, [a.id]: true } }
    case 'offer': return { ...s, offers: { ...s.offers, [a.id]: !s.offers[a.id] } }
    case 'include': return { ...s, included: { ...s.included, [a.id]: true } }
    case 'goal': return s.goals.includes(a.id) ? s : { ...s, goals: [...s.goals, a.id] }
    case 'readAlerts': return { ...s, readAlerts: true }
    case 'forget': return { ...s, memory: s.memory.filter(m => m.id !== a.id) }
    case 'restoreMemory': return s.memory.some(m => m.id === a.item.id) ? s : { ...s, memory: [...s.memory, a.item] }
    case 'undoBooking': { const r = reducer(s, { type: 'cancel', id: a.id, undo: true }); return { ...r, stack: r.stack.length > 1 ? r.stack.slice(0, -1) : r.stack, dir: -1 } }
    case 'forgetAll': return { ...s, memory: [] }
    case 'chat': return { ...s, chat: [...s.chat, ...a.msgs] }
    case 'clearChat': return { ...s, chat: [] }
    case 'book': {
      const it: Item = a.item; const cost = a.points ?? it.points; const cash = a.cash ?? 0
      const expUsed = Math.min(s.expiring, cost)
      const b: Booking = { id: 'b' + K++, item: it, points: cost, cash, ref: ref(), status: 'booked', date: 'Today', expUsed }
      const act: Activity = { id: 'a' + K++, title: it.kind === 'voucher' ? it.title : `${it.title}`, sub: it.kind === 'voucher' ? 'Redeemed · approved by you' : `${it.dates || ''} · approved by you`, points: -cost, date: 'Today', by: 'you', bookingId: b.id }
      const extra: Activity[] = it.kind === 'hotel' && cash > 0 ? [{ id: 'a' + K++, title: '2× points on the card part', sub: `£${cash} on card •••• 4821`, points: cash * 2, date: 'Today', by: 'card', pending: true, bookingId: b.id }] : []
      return { ...s, balance: s.balance - cost, expiring: Math.max(0, s.expiring - cost), bookings: [...s.bookings, b], activity: [...extra, act, ...s.activity] } as any
    }
    case 'cancel': {
      const b = s.bookings.find(x => x.id === a.id); if (!b || b.status === 'cancelled') return s
      return {
        ...s, balance: s.balance + b.points,
        expiring: s.expiring + (b.expUsed || 0),
        bookings: s.bookings.map(x => x.id === a.id ? { ...x, status: 'cancelled' } : x),
        activity: a.undo ? s.activity.filter(x => x.bookingId !== a.id) : [{ id: 'a' + K++, title: `${b.item.title} cancelled`, sub: b.cash ? `Points returned · £${b.cash} refunded to your card` : 'Points returned', points: b.points, date: 'Today', by: 'you' }, ...s.activity.filter(x => !(x.bookingId === a.id && x.pending))],
      }
    }
    case 'resetAll': return { ...initial(), open: a.open ?? false }
    default: return s
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<A> }>(null as any)
const KEY = 'gratifi-demo-v3'
export function Store({ children }: { children: React.ReactNode }) {
  const [s, d] = useReducer(reducer, undefined as any, () => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p.v === 3) return { ...initial(), ...p, open: false, modal: null, toast: null, stack: [{ name: 'home', key: 0 }] } } } catch {}
    return initial()
  })
  useEffect(() => { try { const { stack, modal, toast, ...rest } = s; localStorage.setItem(KEY, JSON.stringify(rest)) } catch {} }, [s])
  return <Ctx.Provider value={{ s, d }}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)

// derived helpers
export const hasBooked = (s: State, kind: string, idPrefix?: string) => s.bookings.some(b => b.status === 'booked' && b.item.kind === kind && (!idPrefix || b.item.id.startsWith(idPrefix)))
export const hotelBooking = (s: State) => s.bookings.find(b => b.status === 'booked' && b.item.kind === 'hotel')
export const flightHomeBooking = (s: State) => s.bookings.find(b => b.status === 'booked' && b.item.id.startsWith('f-home'))

export function useNav() {
  const { d } = useStore()
  return {
    push: (name: string, params?: any) => d({ type: 'push', name, params }),
    replace: (name: string, params?: any) => d({ type: 'replace', name, params }),
    pop: () => d({ type: 'pop' }),
    reset: (name = 'home', params?: any) => d({ type: 'reset', name, params }),
    modal: (name: string | null, params?: any) => d({ type: 'modal', name, params }),
    close: () => d({ type: 'close' }),
    toast: (text: string, undo?: any) => d({ type: 'toast', text, undo }),
  }
}

export function useTimeoutToast() {
  const { s, d } = useStore(); const t = useRef<any>(null)
  useEffect(() => { if (!s.toast) return; clearTimeout(t.current); t.current = setTimeout(() => d({ type: 'toast', text: null }), s.toast.undo ? 8000 : 3200); return () => clearTimeout(t.current) }, [s.toast?.id])
}
