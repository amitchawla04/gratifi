/* Turns blocks into kit components, and wires every button back into a flow.
   Action cards check the booking's current state, so a refund or cancel can never be triggered twice. */
import { React, useState } from '../../kit/src/r'
import * as K from '../../kit/src/base'
import * as T from '../../kit/src/talk'
import * as V from '../../kit/src/travel'
import * as X from '../../kit/src/more'
import { Icon } from '../../kit/src/icons'
import { useMarket } from '../../kit/src/market'
import * as St from './store'
import * as D from './design'
import * as Mod from './modules'
import * as F from './flows'
import * as Cat from './catalog'
import * as Bk from './bank'

const W = window as any
const dead = (b?: St.Booking) => !b || ['cancelled', 'refunded'].includes(b.status)

/* ---------- responding ---------- */
export function respond(r: F.R, into?: string) {
  r = Mod.guard(r)
  if (r.confirm?.kind === 'pay') { const pc = F.precheck(r.confirm.draft, r.confirm.choice); if (pc) r = { ...pc, say: [r.say, pc.say].filter(Boolean).join(' ') } }
  const sug = (r.suggest || []).filter(x => !(St.get().card.frozen && /^Freeze my card$/i.test(x)))
  const blocks = [...r.blocks, ...(sug.length ? [{ kind: 'suggest', items: sug }] : [])]
  let id = into
  if (r.say || blocks.length || into) {
    if (into) St.patchMsg(into, { text: r.say, steps: r.steps, blocks, thinking: false })
    else id = St.pushMsg({ role: 'gr', text: r.say, steps: r.steps, blocks })
  }
  if (r.confirm) openConfirm(r.confirm)
  return id
}
export const FLOWS: Record<string, (a: any) => F.R> = {
  flightSearch: F.flightSearch, chooseFlight: F.chooseFlight, chooseFare: F.chooseFare, seatsDone: F.seatsDone, search: F.search, showItem: F.showItem, startCheckout: F.startCheckout,
  basketStart: F.basketStart, confirmPay: F.confirmPay, confirmFreeBooking: F.confirmFreeBooking, myStuff: F.myStuff, manage: F.manage, doCancel: F.doCancel, fileClaim: F.fileClaim, returnDo: F.returnDo,
  changeDo: F.changeDo, seatSave: F.seatSave, seatSaveAll: F.seatSaveAll, rebook: F.rebook, compensation: F.compensation, offers: F.offers, feed: F.feed, unfreezeAsk: F.unfreezeAsk, payBillAsk: F.payBillAsk, pointsBalance: () => F.pointsBalance(),
  bank: F.bank, payBill: F.payBill, limitAsk: F.limitAsk, limitSet: F.limitSet, gamblingOn: () => F.gamblingOn(), gamblingLift: () => F.gamblingLift(), gamblingLiftAsk: () => F.gamblingLiftAsk(), gamblingKeep: () => F.gamblingKeep(), benefits: F.benefits, programmes: F.programmes, transferDo: F.transferDo, invest: F.invest, investDo: F.investDo, charity: F.charity, donate: F.donate,
  docs: F.docs, concierge: F.concierge, handoff: F.handoff, alertSet: F.alertSet, challenges: F.challenges, usePoints: F.usePoints, cardControl: F.cardControl, flexDates: F.flexDates, route: (a: any) => F.route('', a.text),
  reopen: (a: any) => { const d = St.get().drafts[a.draft]; if (!d) return { say: 'That checkout has already been paid.', blocks: [] }; return { say: '', blocks: [{ kind: 'checkout', draft: a.draft, method: a.method, fresh: true }] } },
  affiliateBuy: F.affiliateBuy,
  settlePending: F.settlePending,
  cardSet: (a: any) => { St.set(s => ({ card: { ...s.card, [a.k]: true } })); return { say: ({ online: 'Online payments are on.', abroad: 'Payments abroad are on.', contactless: 'Contactless is on.', atm: 'Cash withdrawals are on.' } as any)[a.k], blocks: [{ kind: 'controls' }] } },
  ddSet: (a: any) => { const M = W.__M, min = a?.mode === 'min'; St.set(s => ({ card: { ...s.card, autopay: true, autopayMode: min ? 'min' : 'full' } as any })); return { say: `${M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)} is set up to pay ${min ? 'the minimum' : 'the full balance'} each month from your current account ending 7781.`, blocks: [{ kind: 'directdebit' }] } },
  ddOff: () => { const M = W.__M; St.set(s => ({ card: { ...s.card, autopay: false } as any })); return { say: `${M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)} is cancelled. Nothing will be taken automatically; pay the bill here or in the bank's app before the due date.`, blocks: [{ kind: 'directdebit' }] } },
  unfreeze: () => { St.set(s => ({ card: { ...s.card, frozen: false } })); return { say: 'Unfrozen. Your card works again.', blocks: [{ kind: 'controls' }] } },
  replaceCard: () => { if (St.get().bookings.some(b => b.title === 'Replacement card' && !dead(b) && b.status !== 'delivered')) return { say: 'A replacement is already on its way.', blocks: [] }; return { say: 'Confirm it\'s you to order the new card.', blocks: [], confirm: { kind: 'action', title: 'Order a replacement card', summary: St.get().card.frozen ? `To your home address · card ending ${St.get().card.last4} stays frozen and is cancelled` : `To your home address · card ending ${St.get().card.last4} works until you activate the new one`, lines: [['New card', St.get().card.frozen ? 'New number, 3 to 5 working days' : 'Same number, 3 to 5 working days']], total: ['To pay', 'Free'], act: { f: 'replaceCardDo', a: {} } } } },
  replaceCardDo: () => { if (St.get().bookings.some(b => b.title === 'Replacement card' && !dead(b) && b.status !== 'delivered')) return { say: 'A replacement is already on its way.', blocks: [] }; const r = St.pay({ id: 'x', cat: 'bank', title: 'Replacement card', sub: 'To your home address', qty: 1, unit: 0, total: 0, kind: 'order', extra: { case: 'replacement', newNumber: St.get().card.frozen }, tracker: { steps: ['Ordered', 'Printed', 'Posted', 'Delivered'], current: 1, eta: '3 to 5 days' } } as any, 0, 0); return { say: St.get().card.frozen ? 'A new card with a new number is on its way to your home address. Your old card stays frozen, so nobody can use it.' : 'A new card with the same number is on its way to your home address. Your current card works until you activate the new one.', blocks: r.ok ? [{ kind: 'tracker', id: r.booking.id }] : [] } },
  /* Card servicing through the bank connection layer. A missing API answers plainly instead of failing. */
  ...Object.fromEntries((['replaceAsk', 'replaceDo', 'activate', 'disputeAsk', 'disputeDo', 'limitRequestAsk', 'limitRequestDo', 'walletAsk', 'walletDo', 'walletRemove', 'setLimit', 'noticeAdd', 'revealDetails', 'revealPin'] as const).map(k => [k, (a: any) => bankCall(() => (Bk as any)[k](a))])),
  open: (a: any) => { W.__go?.('cardx', a.to); return { say: '', blocks: [] } },
}
function bankCall(f: () => F.R): F.R { try { return f() } catch (e: any) { if (e?.code === 'unavailable') { const m = Mod.MODULES.find(x => x.apis.includes(e.api)); return { say: `${m ? Mod.unavailable(m.id) : 'That isn\'t available in this app'}. Your bank's app or a person at the bank can help with it.`, blocks: [], suggest: ['Talk to a person'] } } throw e } }
export function run(act: { f: string; a?: any }, label?: string) {
  if (act.f === 'open') { FLOWS.open(act.a || {}); return }
  if (label) St.pushMsg({ role: 'user', text: St.get().market === 'AR' ? W.__tr(label) : label })
  const fn = FLOWS[act.f]; if (!fn) return
  const r = fn(act.a || {}); respond(r)
  if (!(onScreen() && STAY.includes(act.f) && !r.confirm)) goChat()
}
/* Actions started from a settings or card screen finish there; the answer still goes into the chat as a record. */
export const STAY = ['gamblingOn', 'gamblingKeep', 'gamblingLift', 'ddSet', 'ddOff', 'cardSet', 'limitSet', 'unfreeze', 'payBill', 'replaceCardDo', 'replaceDo', 'activate', 'disputeDo', 'limitRequestDo', 'walletDo', 'walletRemove', 'setLimit', 'noticeAdd', 'revealDetails', 'revealPin']
const onScreen = () => ['me', 'card', 'cardx'].includes(W.__tab)
let goChatFn = () => { }
export const setGoChat = (f: () => void) => { goChatFn = f }
export const goChat = () => goChatFn()

/* ---------- the confirm sheet: the only place money, points or card settings that need you move ---------- */
type Open = { c: F.Confirm; d?: St.Draft; key: number } | null
/** Wrong codes count per customer, survive reloads, and pause codes for 15 minutes after three. */
let liveKey = -1
const otpFails = () => { const o = St.get().seen.otp; return o && Date.now() - o.at < 15 * 6e4 ? o.n : 0 }
let open: Open = null; const cSubs = new Set<() => void>(); let seq = 0
export function openConfirm(c: F.Confirm | null) { open = c ? { c, d: c.kind === 'pay' ? St.get().drafts[c.draft] : undefined, key: ++seq } : null; cSubs.forEach(f => f()) }
export function ConfirmHost() {
  const [, force] = React.useReducer((x: number) => x + 1, 0)
  React.useEffect(() => { cSubs.add(force); return () => { cSubs.delete(force) } }, [])
  const M = useMarket()
  const back = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const sh = document.querySelector('.app-sheet') as HTMLElement | null; if (!sh) return
      if (e.key === 'Escape') { e.preventDefault(); openConfirm(null); return }
      if (e.key !== 'Tab') return
      const f = Array.from(sh.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')).filter(x => x.offsetParent !== null)
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (!sh.contains(document.activeElement)) { e.preventDefault(); first.focus() } else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  React.useEffect(() => { if (open) { if (!back.current) back.current = document.activeElement as HTMLElement } else if (back.current) { const el = back.current; back.current = null; setTimeout(() => { if (el.isConnected) el.focus() }, 30) } }, [open?.key])
  React.useEffect(() => { if (open) setTimeout(() => (document.querySelector('.app-sheet input:not([disabled]), .app-sheet [role=dialog]') as HTMLElement | null)?.focus(), 60) }, [open?.key])
  React.useEffect(() => { const t = setTimeout(() => { const root = document.querySelector('.app-dock')?.parentElement, sh = document.querySelector('.app-sheet'); if (!root) return; Array.from(root.children).forEach(ch => { const on = !!open && !!sh && !ch.contains(sh); if (on) ch.setAttribute('inert', ''); else ch.removeAttribute('inert') }) }, 0); return () => clearTimeout(t) }, [open?.key, !!open])
  liveKey = open ? open.key : -1
  if (!open) return null
  const { c, key } = open, close = () => openConfirm(null)
  let summary = '', lines: [string, string][] = [], total: [string, string] = ['', ''], cta: string | undefined, doneTitle = M.t('booked'), title: string | undefined, note: string | undefined
  const confirmCta = M.auth === 'faceid' ? 'Confirm with Face ID' : M.auth === 'otp' ? 'Confirm with code' : M.t('payApp')
  if (c.kind === 'pay' && open.d?.pointsOnly) {
    const d = open.d
    title = d.kind === 'transfer' ? 'Confirm transfer' : d.kind === 'donation' ? 'Confirm your gift' : 'Confirm with the partner'
    summary = d.title; lines = (d.detail || []).filter(([k]) => k !== 'Handled by') as [string, string][]; total = ['Points', M.pts(c.choice.pts)]; cta = confirmCta; note = d.kind === 'transfer' ? 'A transfer can\'t be undone once sent' : d.kind === 'donation' ? 'A gift to charity can\'t be taken back' : 'Nothing moves until you confirm'
    doneTitle = d.kind === 'transfer' ? 'Transfer sent' : d.kind === 'donation' ? 'Thank you' : 'Sent to the partner'
  } else if (c.kind === 'pay') {
    const d = open.d; if (!d) return null
    summary = [d.title, d.sub && d.sub !== d.title ? d.sub : '', d.when].filter(Boolean).join(' · ')
    lines = [[d.extra?.pair ? `Price (${d.qty} ${d.qty > 1 ? 'people' : 'person'}, 2 for 1)` : d.extra?.freeN && d.extra.freeN < d.qty ? `Price (${d.qty - d.extra.freeN} paid, ${d.extra.freeN} free)` : d.qty > 1 && !['flights', 'stays', 'dining'].includes(d.cat) ? `Price × ${d.qty}` : d.qty > 1 || d.extra?.inf ? `Price (${d.qty} ${d.cat === 'flights' ? (d.qty > 1 ? 'travellers' : 'traveller') : 'guests'}${d.extra?.inf ? ` + ${d.extra.inf} infant${d.extra.inf > 1 ? 's' : ''}` : ''})` : 'Price', M.money(d.total, 2)], ...(c.choice.pts ? [[`Points used (${M.pts(c.choice.pts)})`, M.money(-Math.min(c.choice.pts * St.rate(), d.total), 2)] as [string, string]] : [])]
    total = [c.choice.card ? M.t('onYourCard') : 'Points', c.choice.card ? M.money(c.choice.card, 2) : M.pts(c.choice.pts)]
    cta = M.auth === 'otp' ? (c.choice.card ? M.t('confirmWithCode', { amt: M.money(c.choice.card, 2) }) : M.t('confirmPts', { pts: M.pts(c.choice.pts) })) : undefined
    if (d.policy && /non-refundable|no refunds?|can.?t be refunded|not refundable/i.test(d.policy)) note = d.policy
    { const dup = ['shopping', 'giftcards', 'quick'].includes(d.cat) ? St.get().bookings.find(b => b.title === d.title && !['cancelled', 'refunded'].includes(b.status) && Date.now() - b.createdAt < 7 * 864e5) : undefined; if (dup) note = `You already ordered this on ${M.date(new Date(dup.createdAt).toISOString().slice(0, 10))} (${dup.ref}). Carry on only if you want another.` }
    doneTitle = d.kind === 'transfer' ? 'Transfer sent' : d.kind === 'donation' ? 'Thank you' : d.kind === 'investment' ? 'Sent to the partner' : d.extra?.changeFor ? 'Changed' : d.cat === 'giftcards' ? 'Paid and sent' : d.kind === 'order' ? 'Paid' : d.kind === 'sub' ? 'Subscribed' : M.t('booked')
  } else {
    title = c.title; summary = c.summary || ''; lines = c.lines || []; total = c.total || ['', '']; doneTitle = (c as any).doneTitle || 'Done'
    cta = c.cta || (c.act.f === 'payBill' ? (M.auth === 'otp' ? M.t('confirmWithCode', { amt: total[1] }) : undefined) : confirmCta); note = c.act.f === 'payBill' ? undefined : ['unfreeze', 'cardSet', 'ddSet', 'ddOff', 'limitSet', 'gamblingLift', 'replaceDo', 'replaceCardDo', 'walletDo', 'limitRequestDo'].includes(c.act.f) ? 'This checks it\'s you before anything changes' : ['revealDetails', 'revealPin'].includes(c.act.f) ? 'Make sure nobody can see your screen' : c.act.f === 'manage' ? 'Nothing is charged until you confirm' : undefined
  }
  return <div className="app-sheet" onClick={e => { if (e.target === e.currentTarget) close() }}>
    <div className="app-sheet-in">
      <T.ConfirmSheet key={key} title={title} note={note} attempts={otpFails()} lockedUntil={St.get().seen.otp ? St.get().seen.otp.at + 15 * 6e4 : undefined} onWrong={(n: number) => St.set(s => ({ seen: { ...s.seen, otp: { n, at: Date.now() } } }))} summary={summary} lines={lines.length ? lines : undefined} total={lines.length ? total : undefined} cta={cta} phone={W.__phoneEnd || '21'} validCode="482193" doneTitle={doneTitle} onClose={close}
        onConfirm={() => { if (St.get().seen.otp) St.set(s => ({ seen: { ...s.seen, otp: undefined } }));
          const r = c.kind === 'pay' ? F.confirmPay({ draft: c.draft, choice: c.choice }) : FLOWS[c.act.f](c.act.a || {})
          const failed = c.kind === 'pay' && (r.blocks[0]?.kind === 'state' || !r.blocks.length)
          if (failed) { close(); respond(r); goChat(); return false }
          respond(r); setTimeout(() => { if (liveKey === key) { close(); if (!(onScreen() && c.kind !== 'pay' && STAY.includes(c.act?.f))) goChat() } }, 2200); return true
        }} />
      {M.auth === 'otp' && <div className="app-hint">Demo: the one-time code is 482193</div>}
      {M.auth === 'app' && <div className="app-hint">Demo: tapping the button approves as if in the bank app</div>}
    </div>
  </div>
}

/* ---------- blocks ---------- */
export function Blocks({ blocks, msgId }: { blocks: St.Block[]; msgId?: string }) { return <>{blocks.map((b, i) => <Block key={i} b={b} bk={msgId ? msgId + ':' + i : undefined} />)}</> }
function Block({ b, bk }: { b: St.Block; bk?: string }) {
  const C = (BLOCKS as any)[b.kind]
  if (!C) return null
  return <C {...b} bk={bk} />
}
/** Remembers that a card's button was used, so going back to an old message never re-arms it. */
function useDone(bk?: string): [boolean, (v?: any) => void] { const [d, setD] = useState(false); const [u, mark] = useOnce(bk); return [d || u, (v: any) => { setD(v !== false); if (v !== false) mark() }] }
/** A choice inside a card that survives reloads, so old cards show what was actually picked. */
function usePS<T>(bk: string | undefined, key: string, init: T): [T, (v: T) => void] { const [v, setV] = useState<T>(init); const saved = St.useS(s => (bk ? s.seen['val:' + bk + ':' + key] : undefined)) as T | undefined; return [saved !== undefined ? saved : v, (x: T) => { setV(x); if (bk) St.set(s => ({ seen: { ...s.seen, ['val:' + bk + ':' + key]: x } })) }] }
function useOnce(bk?: string): [boolean, () => void] { const used = St.useS(s => (bk ? !!s.seen['used:' + bk] : false)); return [used, () => { if (bk) St.set(s => ({ seen: { ...s.seen, ['used:' + bk]: true } })) }] }
const img = (k?: string) => Cat.img(k)
export const iconFor = (c: string) => (Cat.CATS.find(x => x.key === c)?.icon) || 'bag'
function Sug({ items }: { items: string[] }) { return <T.Suggestions items={items} onPick={(s: string) => sendText(s)} /> }
export const OFFERS = [['OF-1', 'Table Collective', 'T', '#9A3B2E', '15% off dining'], ['OF-2', 'Northway Air', 'N', '#1F3A5F', '5% back on flights'], ['OF-3', 'Pantry Market', 'P', '#3D6B35', '10% back on groceries'], ['OF-4', 'Byte Store', 'B', '#5B3FA8', '8% back on tech']]
export function OfferList({ rail }: { rail?: boolean }) {
  const seen = St.useS(s => s.seen)
  const cards = OFFERS.map(([id, b, m, c, r]) => <div key={id} style={rail ? { width: 300 } : undefined}><T.OfferCard brand={b} mono={m} color={c} rate={r} sub="Until 31 Oct" added={!!seen['offer:' + id]} onAdd={(on: boolean) => { St.set(s => ({ seen: { ...s.seen, ['offer:' + id]: on } })); if (on) St.pushMsg({ role: 'gr', text: `Added: ${r} at ${b} until 31 Oct, when you pay with your card.` }) }} /></div>)
  return rail ? <T.Rail title="Offers for you" more="All offers" onMore={() => run({ f: 'offers', a: {} }, 'Show me card offers')}>{cards}</T.Rail> : <div className="gr-col" style={{ gap: 10 }}>{cards}</div>
}

const BLOCKS: Record<string, (p: any) => any> = {
  suggest: ({ items }) => <Sug items={items} />,
  cats: () => <D.Stamps items={['stays', 'flights', 'experiences', 'dining', 'tickets', 'shopping', 'subs', 'rides', 'quick', 'giftcards'].map(k => Cat.CATS.find(c => c.key === k)!).map(c => ({ key: c.key, label: c.label, art: D.STAMP[c.key], onClick: () => run({ f: 'route', a: { text: c.key } }, c.label) }))} />,
  places: ({ mode }) => { const M = useMarket(); return <T.Suggestions items={Cat.dests(M.id).map(c => c.name)} onPick={(s: string) => sendText(mode === 'visa' ? `Do I need a visa for ${s}?` : 'Flights to ' + s)} /> },
  state: (p) => <StateWrap {...p} />,
  handoff: ({ reason, team, bk }: any) => { const fraud = team === 'fraud', care = team === 'care'; const name = fraud ? 'Maya' : care ? 'Leila' : 'Priya'; const [used, setUsed] = useDone(bk); return <T.Handoff initial={St.get().market === 'AR' ? ({ Maya: 'م', Leila: 'ل', Priya: 'ب' } as any)[name] : undefined} name={name} role={fraud ? 'fraud team' : care ? 'specialist care team' : 'customer team'} wait={used ? 'Asked for' : 'Usually joins within 2 minutes'} used={used} onChat={() => { setUsed(true); St.pushMsg({ role: 'gr', text: `I've asked ${name} to join. She can see our conversation, so you won't need to repeat anything.` }); setTimeout(() => St.pushMsg({ role: 'gr', text: `${name} has joined. (Demo: in the live app ${name} is a real person who replies here; in this demo, Gratifi carries on.)` }), 6000) }} onCall={() => { setUsed(true); St.pushMsg({ role: 'gr', text: `${name} will call you in the next few minutes on your registered number.` }) }} /> },
  offers: () => <OfferList />,

  /* flights */
  flights: ({ back, pax, ids, best, kids, inf }) => { const opts = (ids.map((i: string) => F.flightById(i)).filter(Boolean) as Cat.FlightOpt[]).sort((a, b) => Number(b.id === best) - Number(a.id === best)); if (!opts.length) return <T.StateCard kind="empty" title="No flights match" body="Try all flights or another day." />; const go = (o: Cat.FlightOpt) => run({ f: 'chooseFlight', a: { id: o.id, pax, back, kids, inf } }, `The ${o.dep} ${Cat.AIRLINES[o.airline]}`); const [o0, ...rest] = opts
    return <div className="gr-col" style={{ gap: 10 }}><div><V.FlightCard airline={o0.airline} number={o0.number} dep={o0.dep} arr={o0.arr} plusDays={o0.plus || undefined} from={o0.from} to={o0.to} dur={o0.dur} stops={o0.stops} via={o0.via} price={o0.price} points={o0.points} bag={o0.bag} left={o0.left} best={o0.id === best ? 'Best for you' : undefined} onSelect={() => go(o0)} /><div className="gr-meta app-each">One way, per person</div></div>
      {rest.length > 0 && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{`${rest.length} other time${rest.length > 1 ? 's' : ''}, sorted by departure`}</span>{[...rest].sort((x, y) => x.dep.localeCompare(y.dep)).map(o => <X.ItemRow key={o.id} icon="plane" title={`${o.dep} → ${o.arr}${o.plus ? ' +1' : ''} · ${Cat.AIRLINES[o.airline]}`} sub={`${o.stops ? `1 stop, ${o.via}` : 'Direct'} · ${o.dur}${o.bag === 'Small bag only' ? ' · small bag only' : ''}`} price={o.price} points={o.points} badge={o.left ? `${o.left} left` : undefined} onClick={() => go(o)} />)}</div>}</div> },
  fares: (p: any) => <FaresBlock {...p} />,
  seats: (p: any) => <SeatsBlock {...p} />,
  seatchange: (p: any) => <SeatChange {...p} />,
  calendar: ({ city, pax }) => <CalendarBlock city={city} pax={pax} />,

  /* items */
  items: ({ ids, pax, time, date, nights, rooms, room }) => { const M = useMarket(); const stayP = (i: Cat.Item) => F.stayPrice(i, room || '', nights || 2) * (rooms || 1); const items = ids.map((i: string) => F.findItem(i)).filter(Boolean) as Cat.Item[]
    const open = (i: Cat.Item) => run({ f: 'showItem', a: { id: i.id, pax, time, date, nights, rooms } }, i.title)
    const cash = (i: Cat.Item) => i.cat === 'giftcards' || i.mode === 'link' ? undefined : i.included && i.cat === 'airport' && St.get().loungeLeft ? 0 : i.cat === 'stays' ? stayP(i) : F.IP(i)
    const unit = (i: Cat.Item) => i.cat === 'stays' ? `${nights || 2} night${(nights || 2) > 1 ? 's' : ''}${room ? `, ${rooms > 1 ? rooms + ' ' : ''}${room.replace(/ \(.*\)/, '').toLowerCase()}${rooms > 1 ? 's' : ''}` : rooms > 1 ? `, ${rooms} rooms` : ''}, taxes in` : i.unit
    const price = (i: Cat.Item) => { const c = cash(i); if (i.cat === 'giftcards') return <span className="ds-ip-m">From {M.money(+F.giftAmounts()[0])}</span>; if (i.mode === 'link') return <span className="ds-ip-m">{i.earn}</span>; if (i.included && i.cat === 'subs') return <span>Included</span>; if (c === 0) return <span>{M.t('free')}</span>; if (c == null) return null; return <><span>{`${M.num(F.ptsOf(c))} points`}</span><span className="ds-ip-m ds-ip-or">{`or ${M.money(c, c % 1 ? 2 : 0)}`}</span>{unit(i) && <span className="ds-ip-m ds-ip-u">{unit(i)}</span>}</> }
    const meta = (i: Cat.Item) => [i.rating ? `★ ${i.rating}` : '', i.sub, ...((i.meta || []).slice(0, 1)), i.cat !== 'dining' && i.mode !== 'link' ? i.earn : ''].filter(Boolean).map((x, k) => <span key={k} className={k ? 'ds-ip-u' : undefined}>{x}</span>)
    const best = items.length > 1 && items[0].img ? items[0] : undefined
    return <div className="gr-col" style={{ gap: 12 }}>
      {best && <div className="ds-best"><button className="ds-best-ph" onClick={() => open(best)} aria-label={best.title}><img src={img(best.img)} alt="" /><span className="ds-best-tag">Best match</span></button><div className="ds-best-f"><div className="ds-best-b"><p className="ds-ip-t">{best.title}</p><p className="ds-ip-s">{meta(best)}</p><p className="ds-ip-p">{price(best)}</p></div><button className="ds-btn40" onClick={() => open(best)}>{best.cat === 'shopping' ? 'View' : 'Book'}</button></div></div>}
      {items.filter(i => i !== best).map(i => <button key={i.id} className="ds-irow" onClick={() => open(i)}><span className="ds-irow-ph">{i.img ? <img src={img(i.img)} alt="" /> : D.STAMP[i.cat] ? <img src={D.STAMP[i.cat]} alt="" style={{ objectFit: 'contain' }} /> : <Icon name={i.icon || 'grid'} size={24} />}</span><span className="ds-irow-b"><span className="ds-ip-t">{i.title}</span><span className="ds-ip-s">{meta(i)}</span><span className="ds-ip-p">{price(i)}</span></span><Icon name="chev" size={18} stroke={2.2} /></button>)}
    </div> },
  detail: (p: any) => <DetailBlock {...p} />,
  grocery: () => <GroceryBlock />,
  checkout: (p: any) => <CheckoutBlock {...p} />,
  freeconfirm: (p: any) => <FreeConfirm {...p} />,

  /* after buying */
  receipt: ({ id, snap }) => { const live = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); if (!live) return null; const b = snap ? { ...live, ...snap } : live; const changed = !!snap && (live.status !== snap.status || live.when !== snap.when || JSON.stringify(live.detail) !== JSON.stringify(snap.detail)); const title = b.kind === 'donation' ? 'Thank you' : b.kind === 'transfer' ? 'Transfer sent' : b.kind === 'investment' ? 'Sent to the partner' : 'Confirmed'; return <T.Receipt title={title} reference={b.ref} lines={[...((b.detail || []).some(([, v]: [string, string]) => v === b.title || (typeof v === 'string' && b.title.endsWith(v))) ? [] : [[b.cat === 'flights' ? 'Flight' : b.cat === 'stays' ? 'Stay' : b.cat === 'dining' ? 'Table at' : b.kind === 'transfer' ? 'Transfer' : b.kind === 'donation' ? 'Gift' : b.kind === 'investment' ? 'Investment' : b.kind === 'ticket' ? 'Ticket' : b.kind === 'order' ? 'Order' : b.kind === 'sub' ? 'Subscription' : 'Booked', b.cat === 'dining' ? `${b.title}${b.sub ? `, ${b.sub.split(' · ').pop()}` : ''}` : b.cat === 'stays' ? `${b.title}${b.sub ? `, ${b.sub.split(' · ')[0]}` : ''}` : ['airport', 'experiences', 'tickets'].includes(b.cat) && b.sub ? `${b.title} · ${b.sub}` : b.title] as [string, string]]), ...(b.when && !(b.detail || []).some(([k]: [string, string]) => /^(When|Dates|Outbound)$/.test(k)) ? [['When', b.when] as [string, string]] : []), ...(b.detail || []), ...((b.pts || b.card) && !['transfer', 'donation', 'investment'].includes(b.kind || '') ? [['Paid', [b.pts ? M.pts(b.pts) : '', b.card ? M.t('onCardEnding', { cash: M.money(b.card, 2), card: St.get().card.last4 }) : ''].filter(Boolean).join(' + ')] as [string, string]] : []), ...(b.earned ? [['Points earned', '+' + M.num(b.earned)] as [string, string]] : [])]} next={changed ? (dead(live) ? `${live.status === 'refunded' ? 'Refunded' : 'Cancelled'} since. Wallet has the latest.` : 'Changed since. Wallet has the latest.') : b.policy ? `${b.policy.replace(/\.$/, '')}.` : undefined} actions={undefined} /> },
  booking: ({ id, inline }) => <BookingCard id={id} inline={inline} />,
  confirmcancel: (p) => <ConfirmCancel {...p} />,
  tracker: ({ id }) => { const b = St.useS(s => s.bookings.find(x => x.id === id)); if (!b?.tracker) return null; if (dead(b) && b.kind !== 'claim') return <BookingCard id={id} />; const live = !dead(b) && b.tracker.current < b.tracker.steps.length - 1; return <X.Tracker title={b.title} sub={`${b.sub ? b.sub + ' · ' : ''}${b.ref}`} steps={b.tracker.steps} current={b.status === 'delivered' || b.status === 'done' || b.tracker.eta === 'Done' ? b.tracker.steps.length : b.tracker.current} eta={dead(b) ? 'Refunded' : b.tracker.eta} tone={dead(b) ? 'good' : b.tracker.tone} icon={b.kind === 'claim' ? 'doc' : b.cat === 'quick' ? 'bag' : b.kind === 'request' ? 'headset' : b.cat === 'rides' ? 'car' : b.kind === 'transfer' ? 'swap' : 'bolt'} actions={live && b.kind === 'order' && b.cat !== 'bank' && !b.extra?.returning && !b.extra?.at ? ['Cancel'] : live && b.cat === 'rides' ? ['Cancel'] : []} onAction={() => run({ f: 'manage', a: { id, action: 'cancel' } }, `Cancel ${b.title}`)} /> },
  pass: ({ id }) => <PassFor id={id} />,
  emergency: ({ num, title, body }: any) => <div className="gr-card" style={{ gap: 10 }} role="region" aria-label="Help now"><div className="gr-heading">{title}</div>{body && <div className="gr-meta">{body}</div>}<a className="gr-btn gr-btn-primary gr-btn-block" href={`tel:${num}`} role="button">{`Call ${num} now`}</a></div>,
  crisis: ({ urgent, other, emerg }: any) => { const M = useMarket(); const k = M.id === 'AR' ? 'AE' : M.id; const [name, num] = F.HELP[k]; const em = k === 'AE' ? '998' : F.EMERG[k]; const hour = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(new Date()) % 24, closed = k === 'AE' && (hour < 8 || hour >= 20); const first = !!urgent || closed
    const help = <a className={`gr-btn ${first ? 'gr-btn-secondary' : 'gr-btn-primary'} gr-btn-block`} href={`tel:${num.replace(/[^0-9]/g, '')}`} role="button">{closed ? `${name.charAt(0).toUpperCase() + name.slice(1)}: opens 8am, ${num}` : `Call ${name}, ${num}`}</a>
    const emb = <a className={`gr-btn ${first ? 'gr-btn-primary' : 'gr-btn-secondary'} gr-btn-block`} href={`tel:${em}`} role="button">{first ? `Call ${em} now` : `In danger now? Call ${em}`}</a>
    return <div className="gr-card" style={{ gap: 10 }} role="region" aria-label="Help now"><div className="gr-heading">{urgent === 'medical' ? (other ? `Call ${em} for them now` : `Call ${em} now`) : first ? (other ? `If they're in danger, call ${em} now` : `If you're in danger, call ${em} now`) : `Talk to ${name} now`}</div><div className="gr-meta">{urgent === 'medical' ? (emerg ? (other ? 'Stay with them. The call handler will guide you until help arrives.' : 'Open the front door if you can, and stay where you are. The call handler will guide you.') : other ? 'Even if they seem all right. Take the packet or bottle with you if you can.' : 'Even if you feel all right. Take the packet or bottle with you if you can.') : closed ? `${name.charAt(0).toUpperCase() + name.slice(1)} is free and opens at 8am. Emergency help is there all night.` : ['SG', 'MY'].includes(k) ? `${name} is open all day and night.` : k === 'AE' ? (first ? 'The support line is free to call, from 8am to 8pm.' : 'Free to call, from 8am to 8pm.') : `${name} is free to call, all day and night.`}</div>{first ? <>{emb}{!other && help}</> : <>{help}{emb}</>}</div> },
  insurefacts: ({ id, bk }: any) => { const M = useMarket(); const p = Cat.insurance(M.id, (n: number) => M.money(n)).find(x => x.id === id)!; const single = /^Single/.test(p.name), regions = ['UK', 'EU'].includes(M.id) ? ['Europe', 'Worldwide'] : ['AE', 'AR'].includes(M.id) ? ['Middle East', 'Worldwide'] : ['Asia', 'Worldwide']; const [c, setC] = useState([false, false, false]); const trip = F.tripDates(); const [start, setStart0] = usePS(bk, 'start', trip?.in || F.iso(F.nextFriday())); const [end, setEnd] = usePS(bk, 'end', trip?.out || F.addDays(trip?.in || F.iso(F.nextFriday()), 7)); const [reg, setReg] = usePS(bk, 'reg', regions[0]); const setStart = (d: string) => { setStart0(d); if (end <= d || end > F.addDays(d, 30)) setEnd(F.addDays(d, 7)) }; const base = F.P(p.gbp * F.local('docs')), price = single && reg === 'Worldwide' ? Math.round(base * 1.6 * 100) / 100 : base; const [done, setDone] = useDone(bk); const tog = (i: number) => setC(c.map((x, k) => (k === i ? !x : x)))
    return <div className="gr-card" style={{ gap: 10 }}><div className="gr-label">Key facts</div><T.PriceLines lines={[...p.covered.map(x => ['Covers', x] as [string, string]), ...p.notCovered.map(x => ['Not covered', x] as [string, string]), ['Excess per claim', p.excess], ['Cooling-off', '14 days, full refund if no trip has started'], ['Insurer', 'A regulated partner insurer (demo)']]} total={['Price', M.money(price, 2)]} />
      <div className="gr-label">Cover starts</div><DayChips from={F.iso(new Date())} n={90} value={start} onChange={setStart} />{single && <><div className="gr-label">Cover ends (up to 31 days)</div><DayChips from={F.addDays(start, 1)} n={30} value={end} onChange={setEnd} /><div className="gr-label" id={'rg-' + id}>Where you're going</div><K.Segmented items={regions} value={reg} onChange={setReg} />{reg === 'Worldwide' && <div className="gr-meta">Worldwide cover costs more because medical care can cost more.</div>}</>}
      {[`I live in ${({ UK: 'the UK', EU: 'Ireland', IN: 'India', AE: 'the UAE', AR: 'the UAE', SG: 'Singapore', MY: 'Malaysia' } as any)[M.id]} and I'm under 70`, 'I have no medical conditions to declare, or I will call the insurer to declare them before I travel', 'I\'ve read the key facts and this cover meets my needs'].map((t, i) => <label key={i} className="gr-ack"><input type="checkbox" checked={c[i]} onChange={() => tog(i)} /><span>{t}</span></label>)}
      <K.Button block disabled={!c.every(Boolean) || done} onClick={() => { setDone(true); const d = St.draft({ cat: 'docs', title: p.name, sub: 'Travel insurance', qty: 1, unit: price, total: price, icon: 'shield', policy: '14-day cooling-off period; full refund if no trip has started', refundable: true, kind: 'booking', detail: [['Cover', p.name], ['Starts', M.date(start)], ...(single ? [['Ends', M.date(end)], ['Where', reg]] as [string, string][] : []), ['Excess', p.excess]], extra: { date: start } }); respond({ say: '', blocks: [{ kind: 'checkout', draft: d }] }) }}>{`Continue, ${M.money(price, 2)}`}</K.Button></div> },
  member: ({ id, pts, bk }: any) => { const [v, setV] = useState(''); const [done, setDone] = useDone(bk); const p = Cat.PROGRAMMES.find(x => x.id === id)!; const ok = /^[A-Za-z0-9]{6,12}$/.test(v.trim()); return <div className="gr-card" style={{ gap: 10 }}><input className="app-in" inputMode="text" autoComplete="off" placeholder={`${p.name} number`} aria-label={`${p.name} membership number`} value={v} disabled={done} onChange={e => setV(e.target.value)} />{v && !ok && <div className="gr-meta">Membership numbers are 6 to 12 letters or digits.</div>}<K.Button block disabled={!ok || done} onClick={() => { setDone(true); run({ f: 'transferDo', a: { id, pts, member: v.trim() } }, `Membership number ending ${v.trim().slice(-4)}`) }}>Continue</K.Button></div> },
  affiliate: ({ id, bk }: any) => { const [done, setDone] = useDone(bk); return <K.Button block variant="secondary" disabled={done} onClick={() => { setDone(true); run({ f: 'affiliateBuy', a: { id } }, 'I bought something there') }}>{done ? 'Purchase tracked' : 'I bought something there (demo)'}</K.Button> },
  return: ({ id }) => <ReturnBlock id={id} />,
  changeflight: (p: any) => <ChangeFlight {...p} />,
  claimform: (p: any) => <ClaimForm {...p} />,
  disruption: ({ id, bk }) => <Disruption id={id} bk={bk} />,

  /* bank */
  balance: () => { const c = St.useS(s => s.card); const M = useMarket(); return <D.CardFace last4={c.last4} balance={M.money(Math.abs(c.balance), 2)} balLabel={c.balance < 0 ? 'In credit' : 'Balance'} available={M.money(Math.max(0, c.limit - c.balance))} limit={M.money(c.limit)} used={c.limit ? c.balance / c.limit : 0} frozen={c.frozen} dueLine={c.due > 0 ? `Due ${M.date(c.dueDate)} · ${M.money(c.due, 2)}` : 'Nothing to pay now'} freezeLabel={c.frozen ? 'Unfreeze' : 'Freeze'} onFreeze={Mod.on('card.controls') ? () => respond(c.frozen ? F.unfreezeAsk({}) : F.cardControl({ control: 'freeze', on: true })) : undefined} onPay={Mod.on('card.pay') && c.due > 0 ? () => W.__go?.('cardx', 'pay') : undefined} /> },
  gambling: () => <GamblingRow />,
  directdebit: () => <DirectDebitRow />,
  controls: () => { const c = St.useS(s => s.card); const set = (k: string, v: boolean) => { if (k === 'frozen' && !v) { respond(F.unfreezeAsk({})); return } if (k !== 'frozen' && v) { respond(F.cardControl({ control: k, on: true })); return } St.set(s => ({ card: { ...s.card, [k]: v } })); if (k === 'frozen') St.pushMsg({ role: 'gr', text: 'Frozen. New payments are blocked; direct debits and refunds still work.' }) }; const pz = (on: boolean) => c.frozen ? 'Paused while the card is frozen' : on ? 'On' : 'Off'; return <><D.List><D.ToggleRow title="Freeze card" sub={c.frozen ? 'New payments are blocked' : 'Blocks new payments. Direct debits and refunds still work.'} on={c.frozen} onChange={(v: boolean) => set('frozen', v)} /><D.ToggleRow title="Online payments" sub={pz(c.online)} on={c.online && !c.frozen} onChange={(v: boolean) => set('online', v)} /><D.ToggleRow title="Payments abroad" sub={pz(c.abroad)} on={c.abroad && !c.frozen} onChange={(v: boolean) => set('abroad', v)} /><D.ToggleRow title="Contactless" sub={pz(c.contactless)} on={c.contactless && !c.frozen} onChange={(v: boolean) => set('contactless', v)} /><D.ToggleRow title="Cash withdrawals" sub={pz(c.atm)} on={c.atm && !c.frozen} onChange={(v: boolean) => set('atm', v)} /></D.List>{Mod.on('card.gambling') && <GamblingRow />}</> },
  statement: () => { const c = St.useS(s => s.card); const M = useMarket(); const end = new Date(St.get().seen.stmtEnd || Date.now() - 864e5); const start = new Date(end); start.setMonth(start.getMonth() - 1); start.setDate(start.getDate() + 1); return <><D.Amount label={`Statement ${M.date(start, 'day')} to ${M.date(end, 'day')}`} right={`•••• ${c.last4}`} value={M.money(c.due, 2)} meta="Statement balance">{Mod.on('card.statements') && <div className="ds-ac-pills"><D.Pill onClick={() => W.__go?.('cardx', 'statements')}>All statements</D.Pill></div>}</D.Amount><D.KV rows={[{ label: 'Minimum payment', value: M.money(c.min, 2) }, { label: 'Payment due', value: M.date(c.dueDate) }, { label: 'Current balance', value: M.money(c.balance, 2) }]} /></> },
  spend: () => { const all = St.useS(s => s.txns); const M = useMarket(); const since = Date.now() - 30 * 864e5, by: Record<string, number> = {}; all.filter(t => t.at >= since && t.cat !== 'Payment').forEach(t => { by[t.cat] = (by[t.cat] || 0) + (t.refund ? -t.amount : t.amount) }); const items = Object.entries(by).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, amount]) => ({ label, amount })); return <D.SpendBars period="Last 30 days, after refunds" items={items} total={items.reduce((s, i) => s + i.amount, 0)} format={(n: number) => M.money(n, 2)} /> },
  txns: ({ cat }: any) => { const tx = St.useS(s => s.txns.filter(t => !cat || t.cat === cat).slice(0, 8)); const M = useMarket(); return <D.List>{tx.map(t => <D.Txn key={t.id} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={Mod.on('card.transactions') ? () => W.__go?.('cardx', 'txn:' + t.id) : undefined} />)}</D.List> },
  paybill: ({ pick }: any) => <PayBill pick={pick} />,
  alertcard: ({ k }: any) => { const on = St.useS(s => !!s.seen[k]); const w = String(k).slice(6); return <div className="gr-card gr-row" style={{ gap: 10, alignItems: 'center' }}><span className="gr-ibtn gr-flat gr-sm"><Icon name="bell" size={18} /></span><div className="gr-grow"><div style={{ fontWeight: 650 }}>{w.charAt(0).toUpperCase() + w.slice(1)}</div><div className="gr-meta">{on ? 'Alert on' : 'Alert removed'}</div></div>{on && <K.Button size="sm" variant="secondary" onClick={() => St.set(x => ({ seen: { ...x.seen, [k]: false } }))}>Remove</K.Button>}</div> },
  benefits: () => { const left = St.useS(s => s.loungeLeft); const M = useMarket(); return <D.Included items={Cat.BENEFITS.map(b => ({ key: b.id, icon: b.icon, title: b.name, sub: b.key === 'lounge' ? `${left} free visit${left === 1 ? '' : 's'} left this year` : b.id === 'BE-8' ? Cat.moneyBackRule(M.id).split('. ')[0].replace(/\.$/, '') + '.' : b.sub, meta: b.key === 'lounge' ? `${left} left` : 'Included', onClick: () => run(b.key === 'lounge' ? { f: 'search', a: { cat: 'airport' } } : b.id === 'BE-8' ? { f: 'myStuff', a: {} } : b.id === 'BE-4' ? { f: 'docs', a: { topic: 'insurance' } } : b.id === 'BE-6' ? { f: 'search', a: { cat: 'dining' } } : b.id === 'BE-7' ? { f: 'search', a: { cat: 'tickets' } } : b.id === 'BE-5' ? { f: 'docs', a: { topic: 'abroad' } } : { f: 'myStuff', a: {} }, b.name) }))} /> },
  points: ({ noPending }: any) => { const s = St.useS(x => x); const M = useMarket(); return <div className="gr-card" style={{ alignItems: 'center', gap: 8 }}><K.Dial value={s.balance} size={170} progress={Math.min(1, s.balance / (s.balance + 20000))} goal={`Worth about ${M.money(s.balance * St.rate())}`} /><div className="gr-col" style={{ width: '100%', gap: 0, marginTop: 24 }}>{s.expiring > 0 && <div className="gr-row" style={{ justifyContent: 'space-between', padding: '8px 0', fontSize: '0.875rem', color: 'var(--warn)' }}><span>Expiring on 31 Oct</span><b>{M.num(s.expiring)}</b></div>}{(noPending ? [] : s.pending || []).map(p => <div key={p.id} className="gr-row" style={{ justifyContent: 'space-between', padding: '8px 0', fontSize: '0.875rem', color: 'var(--ink-soft)' }}><span>{p.label}</span><b>Pending</b></div>)}{s.ledger.slice(0, 6).map(l => <div key={l.id} className="gr-row" style={{ justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--line)', fontSize: '0.875rem', gap: 12 }}><span>{l.label}</span><b style={{ color: l.pts > 0 ? 'var(--good)' : 'var(--ink)', whiteSpace: 'nowrap' }}>{l.pts > 0 ? '+' : ''}{M.num(l.pts)}</b></div>)}</div></div> },
  programmes: ({ pts }) => { const bal = St.useS(s => s.balance); const M = useMarket(); const def = pts && pts <= bal ? pts : Math.min(10000, Math.floor(bal / 1000) * 1000) || 1000; return <div className="gr-col" style={{ gap: 12 }}>{Cat.PROGRAMMES.map(p => <X.TransferCard key={p.id} programme={p.name} rate={p.rate} points={def} balance={bal} eta={p.eta} onConfirm={(n: number) => run({ f: 'transferDo', a: { id: p.id, pts: n } }, `Transfer ${M.num(n)} points to ${p.name}`)} />)}</div> },
  invest: (p: any) => <InvestBlock {...p} />,
  charities: ({ pts }: any) => { const M = useMarket(); const bal = St.useS(s => s.balance); const opts = [500, 1000, 2500, 5000]; const [n, setN] = useState(pts && pts <= bal ? pts : 1000); return <div className="gr-col" style={{ gap: 12 }}><div className="gr-card" style={{ gap: 8 }}><span className="gr-label">How many points</span><K.Chips items={[...new Set([...opts, n])].sort((a, b) => a - b).map(x => ({ id: String(x), label: `${M.num(x)} pts` }))} value={String(n)} onChange={(v: any) => v && setN(+v)} /><div className="gr-meta">{`${M.pts(n)} = ${M.money(n * St.rate(), 2)} to the charity`}</div></div>{Cat.CHARITIES.map(c => <X.CharityCard key={c.id} name={c.name} cause={c.cause} raised={c.raised} goal={c.goal} onGive={() => bal >= n ? run({ f: 'donate', a: { id: c.id, pts: n } }, `Give ${M.num(n)} points to ${c.name}`) : St.pushMsg({ role: 'gr', text: `You have ${M.pts(bal)}, which isn't enough for that gift.` })} />)}</div> },
  visa: ({ city }) => <VisaBlock city={city} />,
  insurance: () => { const M = useMarket(); return <div className="gr-col" style={{ gap: 12 }}><X.PolicyCard name="Travel cover with your card" included covered={['When you pay for the trip with the card', 'Medical abroad', 'Cancellation', 'Lost bags']} notCovered={['Trips you didn\'t pay for with the card']} />{Cat.insurance(M.id, (n: number) => M.money(n)).map(p => { const price = F.P(p.gbp * F.local('docs')); return <X.PolicyCard key={p.id} name={p.name} covered={p.covered} notCovered={p.notCovered} excess={p.excess} price={price} points={F.ptsOf(price)} onBuy={() => respond({ say: `Before you buy the ${p.name} cover: the key facts, and three quick checks.`, blocks: [{ kind: 'insurefacts', id: p.id }] })} /> })}</div> },
  esim: () => <div className="gr-col" style={{ gap: 10 }}>{Cat.ESIM.map(e => { const price = F.P(e.gbp * F.local('docs')); return <X.ItemRow key={e.id} icon="wifi" title={`eSIM: ${e.title}`} sub="Works in 120+ countries" price={price} points={F.ptsOf(price)} onClick={() => { const d = St.draft({ cat: 'docs', title: `eSIM ${e.title}`, qty: 1, unit: price, total: price, icon: 'wifi', policy: 'Refundable until installed', refundable: true, kind: 'order', detail: [['Plan', e.title], ['Delivery', 'A QR code by email and in Wallet']] }); respond({ say: '', blocks: [{ kind: 'checkout', draft: d }] }) }} /> })}</div>,
  essentials: () => <Sug items={['Do I need a visa?', 'Travel insurance', 'eSIM for data abroad', 'Using my card abroad']} />,
  conciergeform: (p: any) => <ConciergeForm {...p} />,
  challenges: () => { const ch = St.useS(s => s.challenges); const M = useMarket(); return <D.Challenges items={ch.map(c => ({ key: c.id, icon: ({ 'CHL-1': 'fork', 'CHL-2': 'target', 'CHL-3': 'plane' } as any)[c.id], title: c.id === 'CHL-3' ? `Spend ${M.money(c.target)} on travel before 31 Oct` : c.title, reward: c.reward, progress: c.progress, target: c.target, progressText: c.done ? 'Done' : c.unit === 'money' ? `${M.money(Math.round(c.progress))} of ${M.money(c.target)}` : `${Math.round(c.progress)} of ${c.target}`, joined: c.joined, onJoin: () => { St.set(s => ({ challenges: s.challenges.map(x => (x.id === c.id ? { ...x, joined: true } : x)) })); St.pushMsg({ role: 'gr', text: `You're in: ${c.title}.` }) } }))} /> },
}

/* ---------- blocks with their own state ---------- */
function StateWrap({ state, title, body, was, now, actions = [], bk }: any) {
  const [used0, setUsed0] = useState(''); const u = St.useS(s => (bk ? s.seen['usedv:' + bk] : '')) as any; const used = used0 || u || ''; const setUsed = (v: string) => { setUsed0(v); if (bk) St.set(s => ({ seen: { ...s.seen, ['usedv:' + bk]: v as any } })) }
  const refId = actions.map((a: any) => a.act?.a?.id).find(Boolean); const gone = St.useS(s => { const x = refId && s.bookings.find(y => y.id === refId); return !!x && (dead(x) || x.status === 'delivered' || !!x.extra?.rebooked) })
  return <div className="gr-state-host"><T.StateCard kind={state} title={title} body={body} was={was} now={now} actions={[]} />{actions.length > 0 && <div className="gr-actions" style={{ marginTop: 10 }}>{actions.map((a: any, i: number) => <K.Button key={a.label} size="sm" variant={used ? (used === a.label ? 'primary' : 'secondary') : i ? 'secondary' : 'primary'} disabled={!!used || gone} icon={used === a.label ? 'check' : undefined} onClick={() => { if (a.act?.f !== 'open') setUsed(a.label); run(a.act, a.label) }}>{a.label}</K.Button>)}</div>}</div>
}
function VisaBlock({ city }: { city: string }) {
  const M = useMarket(); const c = Cat.dests(M.id).find(x => x.name === city)!; const dom = c.country === Cat.home(M.id).country; const [set, setSet] = useState(false)
  return <div className="gr-card" style={{ gap: 10 }}><div className="gr-heading">{dom ? `${c.name}: no visa needed` : `${c.country}: check before you book`}</div><div className="gr-body" style={{ color: 'var(--ink-soft)' }}>{dom ? 'It\'s a domestic trip. Carry the photo ID your airline accepts.' : 'Entry rules depend on your passport. Most visitors need a passport valid for at least 6 months, and some need an e-visa or travel authorisation before flying.'}</div>{!dom && <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>Demo data. The live product reads each government's official source and links to it.</span></div>}<K.Button size="sm" variant="secondary" disabled={set} icon={set ? 'check' : undefined} onClick={() => { setSet(true); run({ f: 'alertSet', a: { what: 'if your passport needs renewing, 60 days before any trip' } }) }}>{set ? 'Reminder set' : 'Remind me about my passport'}</K.Button></div>
}
function FaresBlock({ id, pax, back, bk, kids = 0, inf = 0 }: any) {
  const M = useMarket(); const [v, setV] = usePS(bk, 'fare', 'std'); const [done, setDone] = useDone(bk)
  const backs = back ? F.backOptions(id, back).slice(0, 4).sort((x, y) => x.dep.localeCompare(y.dep)) : []; const [bid, setBid] = usePS<string | undefined>(bk, 'back', back ? F.fareQuote(id, 'std', back).backF?.id : undefined)
  const q = (fare: string) => F.fareQuote(id, fare, back, bid)
  const s = q('std'), f = s.f
  const legs = [{ dep: f.dep, arr: f.arr + (f.plus ? ' +1' : ''), from: f.from, fromName: Cat.home(M.id).city, to: f.to, toName: f.city, airline: f.airline, number: f.number, dur: f.dur + (f.stops ? ` · 1 stop, ${f.via}` : '') }, ...(s.backF ? [{ dep: s.backF.dep, arr: s.backF.arr + (s.backF.plus ? ' +1' : ''), from: s.backF.from, fromName: f.city, to: s.backF.to, toName: Cat.home(M.id).city, airline: s.backF.airline, number: s.backF.number, dur: s.backF.dur + (s.backF.stops ? ` · 1 stop, ${s.backF.via}` : '') }] : [])]
  const name = (x: string) => (x === 'std' ? 'Standard' : x === 'flex' ? 'Flex' : 'Light')
  return <fieldset className="app-fs" disabled={done}><div className="gr-col" style={{ gap: 12 }}><V.Itinerary legs={legs} layovers={[]} />
    {backs.length > 1 && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label" id={'rt-' + id}>{`Return on ${M.date(back!)}`}</span><div className="gr-slots" role="radiogroup" aria-labelledby={'rt-' + id} style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{backs.map(o => <button key={o.id} className="gr-slot" role="radio" aria-checked={bid === o.id} style={{ height: 'auto', padding: '8px 12px', textAlign: 'start' }} onClick={() => setBid(o.id)}><b>{o.dep}</b> {Cat.AIRLINES[o.airline]}<br /><span className="gr-meta">{o.stops ? `1 stop, ${o.dur}` : `Direct, ${o.dur}`}</span><br /><span className="gr-meta" style={{ fontWeight: 650 }}>{(() => { const dlt = q(v).each - F.fareQuote(id, v, back, o.id).each; return bid === o.id ? 'Chosen' : dlt > 0 ? `${M.money(dlt)} less each` : dlt < 0 ? `${M.money(-dlt)} more each` : 'Same price' })()}</span></button>)}</div></div>}
    <V.FareFamilies value={v} onChange={(x: string) => { if (!done) setV(x) }} fares={[{ id: 'light', name: 'Light', price: q('light').each, points: F.ptsOf(q('light').each), items: [[true, 'Small bag'], [false, 'Cabin bag'], [false, 'Seat choice'], [false, 'Changes']] }, { id: 'std', name: 'Standard', price: s.each, points: F.ptsOf(s.each), pop: 'Most picked', items: [[true, 'Small bag'], [true, 'Cabin bag'], [true, 'Standard seats'], [true, 'Free date change']] }, { id: 'flex', name: 'Flex', price: q('flex').each, points: F.ptsOf(q('flex').each), items: [[true, 'Cabin + checked bag'], [true, 'Any seat'], new Date(f.date + 'T' + f.dep + ':00').getTime() - Date.now() < 864e5 ? [true, 'Refund less 30%'] : [true, 'Full refund'], [true, 'Fast track']] }]} />
    <div className="gr-meta">{`Per person${s.backF ? ', both flights' : ''}.${pax > 1 || inf ? ` ${pax} traveller${pax > 1 ? 's' : ''}${inf ? ` and ${inf} infant${inf > 1 ? 's' : ''} on a lap (${M.money(F.infantFare(q(v).each))} each)` : ''}: ${M.money(q(v).each * pax + F.infantFare(q(v).each) * inf)} in total.` : ''}`}</div>
    <K.Button block disabled={done} onClick={() => { setDone(true); run({ f: 'chooseFare', a: { id, fare: v, pax, back, backId: bid, kids, inf } }, `${name(v)} fare`) }}>Continue with {name(v)}</K.Button></div></fieldset>
}
const TAKEN = ['12A', '12B', '13F', '14C', '15A', '15B', '16E', '16F']
const TAKEN_BACK = ['12D', '12E', '13A', '14F', '15C', '16A', '16B']
const TK = (leg: number) => (leg ? TAKEN_BACK : TAKEN)
function seatsFor(seat: string, n: number, taken = TAKEN): string[] {
  const L = 'ABCDEF', out = [seat]
  const r0 = +seat.slice(0, -1), c0 = L.indexOf(seat.slice(-1))
  const order: [number, number][] = []
  for (const dr of [0, 1, -1, 2, -2]) { const r = r0 + dr; if (r < 12 || r > 16) continue; const side = c0 < 3 ? [0, 1, 2] : [3, 4, 5], other = c0 < 3 ? [3, 4, 5] : [0, 1, 2]; [...side.sort((a, b) => Math.abs(a - c0) - Math.abs(b - c0)), ...other.sort((a, b) => Math.abs(a - c0) - Math.abs(b - c0))].forEach(c => order.push([r, c])) }
  for (const [r, c] of order) { if (out.length >= n) break; const id = r + L[c]; if (r !== 14 && !taken.includes(id) && !out.includes(id)) out.push(id) }
  return out
}
const kindOf = (i: number, pax: number, kids: number) => (i >= pax ? 'infant' : i >= pax - kids ? 'child' : '')
const ageOn = (dob: string, day: string) => { const b = new Date(dob + 'T12:00:00'), d = new Date(day + 'T12:00:00'); let a = d.getFullYear() - b.getFullYear(); if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate())) a--; return a }
/** Why a date of birth doesn't fit the traveller type, or '' when it does. */
export const dobProblem = (k: string, dob: string | undefined, first: string, lastDay: string) => { if (!dob || !k) return ''; if (dob > F.iso(new Date())) return 'That date is in the future. Check the date of birth.'; if (k === 'infant' && (new Date(first).getTime() - new Date(dob).getTime()) / 864e5 < 14) return 'Airlines don\'t usually fly babies under 14 days old. Pick a later date, or a person can check with the airline.'; if (k === 'infant') return ageOn(dob, lastDay) >= 2 ? 'Infants must be under 2 on the day of the last flight. Search again with them as a child so they get a seat.' : ''; const a = ageOn(dob, first); return a < 2 ? 'Under 2 on the day you fly, so they travel as a lap infant. Search again with them as an infant.' : a >= 16 ? 'They\'re 16 or over on the day you fly, so they travel as an adult. Search again with them as an adult.' : ageOn(dob, lastDay) >= 16 ? 'They turn 16 before the return flight, so they fly back as an adult. Search again with them as an adult.' : '' }
function Names({ pax, names, setNames, kids = 0, inf = 0, dobs = [], setDobs, first = '', lastDay = '' }: { pax: number; names: string[]; setNames: (n: string[]) => void; kids?: number; inf?: number; dobs?: string[]; setDobs?: (d: string[]) => void; first?: string; lastDay?: string }) {
  const all = pax + inf, today = F.iso(new Date())
  const ph = (i: number) => { const k = kindOf(i, pax, kids); return k === 'infant' ? `Infant ${i - pax + 1} full name` : k === 'child' ? `Child ${i - (pax - kids) + 1} full name` : `Traveller ${i + 1} full name` }
  return <div className="gr-card" style={{ gap: 8 }}><div className="gr-label">{all > 1 ? 'Travellers, as on their passports' : 'Your name, as on your passport'}</div><input className="app-in" value={names[0]} placeholder="Full name" aria-label={all > 1 ? 'Traveller 1 full name' : 'Your full name'} autoComplete="name" onChange={e => { const n = [...names]; n[0] = e.target.value; setNames(n) }} />{Array.from({ length: all - 1 }, (_, j) => { const i = j + 1, k = kindOf(i, pax, kids); return <React.Fragment key={i}><input className="app-in" placeholder={ph(i)} aria-label={ph(i)} value={names[i] || ''} onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n) }} />{k && setDobs && <label className="gr-col" style={{ gap: 4 }}><span className="gr-meta">{`${k === 'infant' ? 'Infant' : 'Child'}'s date of birth${k === 'infant' ? ' (under 2 when you fly)' : ''}`}</span><input className="app-in" type="date" max={today} min={k === 'infant' ? F.addDays(today, -730) : F.addDays(today, -365 * 16)} value={dobs[i] || ''} aria-invalid={!!dobProblem(k, dobs[i], first, lastDay)} onChange={e => { const d = [...dobs]; d[i] = e.target.value; setDobs(d) }} />{dobProblem(k, dobs[i], first, lastDay) && <span className="gr-meta" role="alert" style={{ color: 'var(--danger)' }}>{dobProblem(k, dobs[i], first, lastDay)}</span>}</label>}</React.Fragment> })}</div>
}
function SeatsBlock({ draft, pax, bk, kids = 0, inf = 0 }: any) {
  const M = useMarket(); const aisle = St.useS(s => s.prefs.aisle); const me = St.useS(s => s.prefs.name)
  const d0 = St.get().drafts[draft], fare = d0?.extra?.fare, legs = d0?.extra?.legs || 1, light = fare === 'light', flex = fare === 'flex'
  const [legSeats, setLegSeats] = useState<string[][]>(() => Array.from({ length: legs }, (_, l) => seatsFor(l ? (aisle ? '15D' : '15E') : (aisle ? '16C' : '15E'), pax, TK(l)))); const [leg, setLeg] = useState(0); const [who, setWho] = useState(0); const [bags, setBags] = useState(flex ? pax : 0); const [done, setDone] = useDone(bk); const [names, setNames] = useState<string[]>([St.get().prefs.full || me, ...Array(pax + inf - 1).fill('')]); const [dobs, setDobs] = useState<string[]>([]); const [warn, setWarn] = useState('')
  const seats = legSeats[0], cur = legSeats[leg]
  const extra = light ? 0 : legSeats.flat().filter(s => /^14/.test(s)).length * F.legroomFee()
  const pick = (x: string) => { if (TK(leg).includes(x) || cur.includes(x)) return; if (/^14/.test(x) && noExit(who)) { setWarn(kindOf(who, pax, kids) ? 'Children can\'t sit in an exit row. Pick another seat for them.' : 'An adult travelling with an infant can\'t sit in an exit row. Pick another seat.'); return } setWarn(''); const n = legSeats.map(a => [...a]); n[leg][who] = x; setLegSeats(n); if (pax > 1) setWho((who + 1) % pax) }
  const label = (i: number) => (names[i] || '').trim().split(/\s+/)[0] || (kindOf(i, pax, kids) === 'child' ? `Child ${i - (pax - kids) + 1}` : `Traveller ${i + 1}`)
  const first = d0?.extra?.date || F.iso(new Date()), lastDay = d0?.extra?.back?.date || first
  const dobOk = Array.from({ length: pax + inf }, (_, i) => !kindOf(i, pax, kids) || (!!dobs[i] && !dobProblem(kindOf(i, pax, kids), dobs[i], first, lastDay))).every(Boolean)
  const noExit = (i: number) => !!kindOf(i, pax, kids) || i < inf
  const full = (n: string) => (n || '').trim().split(/\s+/).filter(w => w.length > 0).length > 1 && (n || '').trim().split(/\s+/).every(w => /[a-zà-ÿ]/i.test(w))
  const latin = (n: string) => /^[A-Za-zÀ-ÖØ-öø-ÿĀ-ž' .-]*$/.test((n || '').trim())
  const namesOk = names.every(n => full(n) && latin(n))
  const ready = namesOk && dobOk
  const why = !names.every(latin) ? 'Type names in Latin letters (A to Z), exactly as printed on the passport.' : names.some(n => (n || '').trim()) && !namesOk && names.every(n => (n || '').trim().length > 1) ? 'Add a first name and surname for every traveller.' : namesOk && !dobOk ? (dobs.map((x, i) => x && dobProblem(kindOf(i, pax, kids), x, first, lastDay)).find(Boolean) || '') : ''
  if (done || !d0 || d0.extra?.done) return <div className="gr-card gr-row" style={{ gap: 10 }}><Icon name="check" size={18} /><span>{light ? 'Bags chosen' : 'Seats chosen'}</span></div>
  return <div className="gr-col" style={{ gap: 12 }}>
    <Names pax={pax} names={names} setNames={setNames} kids={kids} inf={inf} dobs={dobs} setDobs={setDobs} first={first} lastDay={lastDay} />
    {inf > 0 && <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>{`${inf > 1 ? 'Infants sit' : 'Your infant sits'} on ${inf > 1 ? 'the laps of the first adults listed' : `${(names[0] || '').trim().split(/\s+/)[0] || 'the first adult'}'s lap`}, so ${inf > 1 ? 'they don\'t need seats' : 'they don\'t need a seat'}. Exit rows aren't open to ${inf > 1 ? 'them' : 'that adult'}.`}</span></div>}
    {light ? <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>Light fares don't include seat choice. The airline gives seats at check-in.</span></div>
      : <div className="gr-col" style={{ gap: 10 }}>{legs > 1 && <K.Segmented items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setWho(0) }} />}{pax > 1 && <div className="app-days" role="radiogroup" aria-label="Choosing a seat for">{Array.from({ length: pax }, (_, k) => <button key={k} className="gr-chip" role="radio" aria-checked={who === k} onClick={() => setWho(k)}>{`${label(k)} · ${cur[k]}`}</button>)}</div>}<div className="gr-row" style={{ justifyContent: 'center' }}><V.SeatMap noExtra={noExit(who)} key={leg + ':' + cur.join() + ':' + who} picked={cur[who]} taken={TK(leg)} mates={cur.filter((_, k) => k !== who)} mateName={pax > 2 ? 'Your group' : label(who ? 0 : 1)} mateNames={Object.fromEntries(cur.map((x, k) => [x, label(k)]))} youName={pax > 1 ? label(who) : undefined} extraPrice={F.legroomFee()} onPick={pick} /></div>{!warn && !light && kindOf(who, pax, kids) === 'child' && <div className="gr-meta">Exit-row seats (row 14) are for adults only.</div>}{warn && <div className="gr-banner gr-warn" role="alert"><Icon name="info" size={18} /><span>{warn}</span></div>}{legs > 1 && <div className="gr-meta">{`Outbound ${legSeats[0].join(', ')} · Return ${legSeats[1].join(', ')}`}</div>}</div>}
    <div className="gr-card" style={{ gap: 8 }}><div className="gr-row" style={{ justifyContent: 'space-between' }}><div><div style={{ fontWeight: 650 }}>{M.t('checkedBag')}</div><div className="gr-meta">{flex ? `${pax} included with Flex; more at ${M.money(F.bagUnit())} each, per flight` : `${M.money(F.bagUnit())} each, per flight${legs > 1 ? ' (2 flights)' : ''}`}</div></div><K.Stepper value={bags} min={flex ? pax : 0} max={pax * 2} label={M.t('checkedBag')} onChange={setBags} /></div></div>
    {why && !done && <div className="gr-meta" role="status" style={{ color: 'var(--warn-ink, var(--ink))' }}>{why}</div>}
    <K.Button block disabled={done || !ready} onClick={() => { setDone(true); run({ f: 'seatsDone', a: { draft, seats, backSeats: legs > 1 ? legSeats[1] : undefined, bags, seatFee: extra, names: names.map(n => n.trim()), dobs } }, light ? `${bags ? `${bags} bag${bags > 1 ? 's' : ''}` : 'No bags'}` : `Seats ${seats.join(', ')}${bags ? `, ${bags} bag${bags > 1 ? 's' : ''}` : ''}`) }}>{ready ? 'Continue' : !names.every(latin) ? 'Use passport letters (A to Z)' : !dobOk && namesOk ? (dobs.some((x, i) => x && dobProblem(kindOf(i, pax, kids), x, first, lastDay)) ? 'Check the dates of birth' : 'Add dates of birth') : pax + inf > 1 ? 'Add everyone\'s full name' : 'Add your full name'}</K.Button>
  </div>
}
function SeatChange({ id, bk, leg: leg0 }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [done, setDone] = useDone(bk); const [leg, setLeg] = useState(leg0 || 0); const [who, setWho] = useState(0); const [warn, setWarn] = useState('')
  const [ls, setLs] = useState<string[][]>(() => [b?.extra?.seats || seatsFor('16C', b?.extra?.pax || 1), b?.extra?.backSeats || b?.extra?.seats || seatsFor('15D', b?.extra?.pax || 1, TAKEN_BACK)])
  if (!b) return null
  if (dead(b) || b.extra?.disrupted) return <div className="app-badge"><K.Badge tone="ink">{dead(b) ? 'Cancelled' : 'Cancelled by airline'}</K.Badge></div>
  if (b.extra?.fare === 'light') return <T.StateCard kind="empty" title="Seats are given at check-in" body="Light fares don't include seat choice." />
  if (done) return <div className="gr-card gr-row" style={{ gap: 10 }}><Icon name="check" size={18} /><span>Seats chosen. The booking card below has the latest details.</span></div>
  const pax = b.extra?.pax || 1, legs = b.extra?.back ? 2 : 1, cur = ls[leg], names: string[] = b.extra?.names || []
  const was: string[] = (leg ? b.extra?.backSeats || b.extra?.seats : b.extra?.seats) || []
  const wasOf = (l: number): string[] => (l ? b.extra?.backSeats || b.extra?.seats : b.extra?.seats) || []
  const changed = ls.slice(0, legs).map((x, l) => ({ leg: l, seats: x })).filter(x => x.seats.join() !== wasOf(x.leg).join())
  const fee = changed.reduce((t, x) => t + Math.max(0, x.seats.filter(y => /^14/.test(y)).length - wasOf(x.leg).filter(y => /^14/.test(y)).length) * F.legroomFee(), 0)
  const label = (i: number) => (names[i] || '').split(/\s+/)[0] || (i ? `Traveller ${i + 1}` : St.get().prefs.name)
  const pick = (x: string) => { if (TK(leg).includes(x) || cur.includes(x)) return; if (/^14/.test(x) && (kindOf(who, pax, b.extra?.kids || 0) || who < (b.extra?.inf || 0))) { setWarn(kindOf(who, pax, b.extra?.kids || 0) ? 'Children can\'t sit in an exit row. Pick another seat for them.' : 'An adult travelling with an infant can\'t sit in an exit row. Pick another seat.'); return } setWarn(''); const n = ls.map(a => [...a]); n[leg][who] = x; setLs(n); if (pax > 1) setWho((who + 1) % pax) }
  return <div className="gr-col" style={{ gap: 12 }}>{legs > 1 && <K.Segmented items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setWho(0) }} />}
    {pax > 1 && <div className="app-days" role="radiogroup" aria-label="Choosing a seat for">{Array.from({ length: pax }, (_, k) => <button key={k} className="gr-chip" role="radio" aria-checked={who === k} onClick={() => setWho(k)}>{`${label(k)} · ${cur[k]}`}</button>)}</div>}
    <div className="gr-row" style={{ justifyContent: 'center' }}><V.SeatMap noExtra={!!kindOf(who, pax, b.extra?.kids || 0) || who < (b.extra?.inf || 0)} key={leg + ':' + cur.join() + ':' + who} picked={cur[who]} taken={TK(leg)} mates={cur.filter((_, k) => k !== who)} mateName={pax > 2 ? 'Your group' : label(who ? 0 : 1)} mateNames={Object.fromEntries(cur.map((x, k) => [x, label(k)]))} youName={pax > 1 ? label(who) : undefined} extraPrice={F.legroomFee()} onPick={pick} /></div>{warn && <div className="gr-banner gr-warn" role="alert"><Icon name="info" size={18} /><span>{warn}</span></div>}
    {legs > 1 && changed.length > 0 && <div className="gr-meta">{`Changing: ${changed.map(x => `${x.leg ? 'flight back' : 'flight out'} ${x.seats.join(', ')}`).join('; ')}`}</div>}<K.Button block disabled={done || !changed.length} onClick={() => { setDone(true); run({ f: 'seatSaveAll', a: { id, legs: changed } }, `Seats ${changed.map(x => x.seats.join(', ')).join('; ')}`) }}>{fee ? `Save seats, ${M.money(fee)} more` : changed.length > 1 ? 'Save seats on both flights' : 'Save seats'}</K.Button></div>
}
function CalendarBlock({ city, pax }: { city: string; pax?: number }) {
  const M = useMarket(); const [a, setA] = useState<string | undefined>(); const [b, setB] = useState<string | undefined>()
  const now = new Date(); const c = Cat.dests(M.id).find(x => x.name === city)!
  const [off, setOff] = useState(now.getDate() > 22 ? 1 : 0)
  const base = new Date(now.getFullYear(), now.getMonth() + off, 1)
  const y = base.getFullYear(), mo = base.getMonth(), days = new Date(y, mo + 1, 0).getDate(), first = off === 0 ? now.getDate() + 1 : 1
  const iso = (d: number) => `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const prices: Record<number, number> = {}
  for (let d = first; d <= days; d++) prices[d] = Math.min(...Cat.searchFlights(M.id, c, iso(d)).map(o => o.price))
  const low = Object.entries(prices).sort((x, z) => x[1] - z[1]).slice(0, 5).map(x => +x[0])
  const dayOf = (x?: string) => (x && x.slice(0, 7) === iso(1).slice(0, 7) ? +x.slice(8) : undefined)
  const pick = (d: number) => { const v = iso(d); if (!a || b) { setA(v); setB(undefined) } else if (v > a) setB(v); else { setA(v); setB(undefined) } }
  return <div className="gr-col" style={{ gap: 12 }}><div className="gr-card"><T.PriceCalendar key={iso(1) + (a || '') + (b || '')} year={y} month={mo} prices={prices} low={low} from={dayOf(a)} to={dayOf(b)} disabledBefore={first} onPick={pick} onPrev={off > 0 ? () => setOff(off - 1) : undefined} onNext={off < 10 ? () => setOff(off + 1) : undefined} /><div className="gr-meta" style={{ marginTop: 6 }}>Lowest one-way fare per person, each day.</div></div>
    <K.Button block disabled={!a} onClick={() => run({ f: 'flightSearch', a: { city, date: a!, back: b, pax } }, `${M.date(a!)}${b ? ' to ' + M.date(b) : ', one way'}`)}>{a ? `Search ${M.date(a)}${b ? ' to ' + M.date(b) : ', one way'}` : 'Pick your dates'}</K.Button></div>
}
function DayChips({ from, n, value, onChange, skip }: { from: string; n: number; value: string; onChange: (v: string) => void; skip?: string }) {
  const M = useMarket()
  const days = Array.from({ length: n }, (_, i) => F.addDays(from, i)).filter(d => d !== skip)
  return <div className="app-days" role="radiogroup" aria-label="Dates" ref={(el: any) => { if (el) { const on = el.querySelector('[aria-checked="true"]'); if (on && !el.dataset.done) { el.dataset.done = '1'; const r = getComputedStyle(el).direction === 'rtl', eb = el.getBoundingClientRect(), tgt = (on.previousElementSibling as HTMLElement | null) || on, ob = tgt.getBoundingClientRect(); el.scrollLeft = r ? -(eb.right - ob.right - 12) : ob.left - eb.left - 12 } } }}>{days.map(d => <button key={d} className="gr-slot" role="radio" aria-checked={value === d} onClick={() => onChange(d)}>{M.date(d)}</button>)}</div>
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
function DetailBlock({ id, pax, time, date: date0, nights: nights0, bk, dest: dest0, sched: sched0, amount, email: email0, rooms: rooms0, from: from0 }: any) {
  const i = F.findItem(id)!; const M = useMarket()
  const vals = i.cat === 'giftcards' ? F.giftAmounts() : i.opts?.values || []
  const initOpt = i.cat === 'giftcards' && amount && vals.includes(amount) ? amount : i.cat === 'stays' && pax > 2 && !(rooms0 > 1) ? (vals.find((v: string) => /Suite/.test(v)) || vals[0]) : time && vals.includes(time) ? time : time && i.opts?.kind === 'slots' ? (vals.find((v: string) => v >= time) || vals[vals.length - 1]) : i.cat === 'shopping' && i.opts?.label === 'Size' ? '' : i.cat === 'tickets' && i.opts?.kind === 'slots' && vals.every((v: string) => /^\d\d:\d\d$/.test(v)) ? (vals.find((v: string) => v > new Date().toTimeString().slice(0, 5)) || '') : vals[i.cat === 'giftcards' ? 1 : 0]
  const trip = F.tripDates(i.city)
  const [opt, setOpt0] = usePS(bk, 'opt', initOpt); const [qty, setQty] = usePS(bk, 'qty', pax && pax > 1 ? Math.max(1, Math.round(pax)) : i.cat === 'stays' ? 2 : 1)
  const [to, setTo] = usePS(bk, 'to', 'Someone else'); const [who, setWho] = usePS(bk, 'who', ''); const [email, setEmail] = usePS(bk, 'email', email0 || '')
  const [date, setDate] = usePS(bk, 'date', date0 ? date0 : i.cat === 'tickets' && /this week/i.test(i.title) ? ((i.opts?.values || []).some((v: string) => v > new Date().toTimeString().slice(0, 5)) ? F.iso(new Date()) : F.addDays(F.iso(new Date()), 1)) : i.cat === 'stays' ? (trip?.in || F.stayDefault()) : i.cat === 'experiences' ? (trip && i.city !== Cat.home(M.id).city ? F.addDays(trip.in, 1) : F.addDays(F.iso(new Date()), 2)) : i.cat === 'airport' ? (F.tripDates()?.in || F.iso(new Date())) : i.cat === 'rides' ? (i.opts?.kind === 'dates' ? (trip?.in || F.stayDefault()) : F.addDays(F.iso(new Date()), 1)) : i.cat === 'dining' && new Date().getHours() >= 21 ? F.addDays(F.iso(new Date()), 1) : F.iso(new Date()))
  const tripNights = trip ? Math.max(1, Math.round((new Date(trip.out).getTime() - new Date(trip.in).getTime()) / 864e5)) : 2
  const [nights, setNights] = usePS(bk, 'nights', nights0 || (i.cat === 'stays' ? tripNights : 2))
  const perRoom = /Suite/i.test(opt || '') ? 4 : 2
  const [rooms, setRooms] = usePS(bk, 'rooms', rooms0 || (i.cat === 'stays' && pax && pax > 4 ? Math.ceil(pax / 4) : 1))
  const roomsE = i.cat === 'stays' ? Math.min(4, Math.max(rooms, Math.ceil(qty / perRoom))) : rooms
  const setOpt = (v: string) => { setOpt0(v); if (i.cat === 'stays') setRooms(Math.max(1, Math.ceil(qty / (/Suite/i.test(v) ? 4 : 2)))) }
  const [addr, setAddr] = usePS(bk, 'addr', St.get().addr); const [shipDay, setShipDay] = usePS(bk, 'ship', F.addDays(F.iso(new Date()), 2))
  const [dest, setDest] = usePS(bk, 'dest', dest0 || ''); const [done, setDone] = useDone(bk)
  const [from, setFrom] = usePS(bk, 'from', from0 || 'Your location');
  const [sched, setSched] = usePS(bk, 'sched', !!sched0); const [rTime, setRTime] = usePS(bk, 'rtime', time || '')
  const [rDate, setRDate] = usePS(bk, 'rdate', date0 || F.iso(new Date()))
  const show = (v: string) => i.cat === 'giftcards' ? M.money(+v) : F.loc(v)
  if (i.mode === 'link') return <X.DetailCard src={img(i.img)} title={i.brand} sub="Shop on their own site" facts={[i.earn, 'Tracked when you use this link']} policy={i.policy} cta={done ? 'Link opened' : 'Go to their site'} disabled={done} onCta={() => { setDone(true); St.set(s => ({ pending: [{ id: St.uidx(), label: `${i.brand}`, at: Date.now() }, ...(s.pending || []).filter(p => p.label !== i.brand)] })); St.pushMsg({ role: 'gr', text: `Demo: this is where ${i.brand}${/s$/.test(i.brand || '') ? '\'' : '\'s'} own site opens. Pay there with your card and the ${i.earn} are tracked. They show as pending in Wallet, under Points, and land after the 30-day return window.`, blocks: [{ kind: 'affiliate', id: i.id }] }) }} />
  const freeVisit = !!(i.included && i.cat === 'airport' && St.get().loungeLeft)
  const freeLeft = freeVisit ? St.get().loungeLeft : 0
  let price = i.cat === 'giftcards' ? +opt : F.IP(i) * (i.opts?.kind === 'dates' ? +opt : 1)
  if (i.cat === 'stays') price = F.stayPrice(i, opt, nights) * roomsE
  if (i.cat === 'rides' && /^Ride/.test(i.title) && dest) price = F.rideUnit(i, dest)
  else if (/\+£(\d+)/.test(opt || '')) price += F.P(+RegExp.$1 * F.local(i.cat))
  const nowHM = new Date().toTimeString().slice(0, 5), dvals: string[] = (((i.cat === 'dining' || /^Train to /.test(i.title)) && date === F.iso(new Date())) || (i.cat === 'tickets' && vals.every((v: string) => /^\d\d:\d\d$/.test(v)) && (!/this week/i.test(i.title) || date === F.iso(new Date())))) && i.opts?.kind === 'slots' ? vals.filter((v: string) => v > nowHM) : vals
  const qMax = i.cat === 'dining' ? 12 : i.cat === 'stays' ? perRoom * 4 : 8
  const qLabel = /^Train to /.test(i.title) ? 'Passengers' : i.cat === 'dining' ? 'Guests' : i.cat === 'stays' ? 'Guests' : i.cat === 'tickets' || i.cat === 'experiences' || i.cat === 'airport' ? 'People' : 'Quantity'
  const isRide = i.cat === 'rides' && /^Ride/.test(i.title), isTransfer = i.cat === 'rides' && /Airport transfer/.test(i.title)
  const needsEmail = i.cat === 'giftcards' && to !== 'Me'
  const needSize = i.cat === 'shopping' && i.opts?.label === 'Size' && !vals.includes(opt)
  const far = isRide && dest.trim() ? F.rideFar(dest) : undefined
  const blocked = !!far || needSize || (needsEmail && (!who.trim() || !EMAIL.test(email.trim()))) || (isRide && !dest.trim()) || (isRide && sched && !rTime) || ((['dining', 'tickets'].includes(i.cat) || /^Train to /.test(i.title)) && i.opts?.kind === 'slots' && !dvals.includes(opt))
  const total = i.cat === 'stays' || i.cat === 'dining' ? price : price * F.billUnits(i, Math.max(0, Math.min(qty, qMax) - freeLeft))
  const label = `${i.title}${opt && i.cat !== 'stays' ? ', ' + show(opt).replace(/ \(\+.*\)/, '') : ''}${i.cat === 'stays' ? `, ${nights} night${nights > 1 ? 's' : ''} from ${M.date(date)}` : ''}${qty > 1 && i.cat !== 'stays' ? ' × ' + qty : ''}${needsEmail ? ' for ' + who.trim() : ''}${isRide ? ' to ' + dest.trim() : ''}`
  return <fieldset className="app-fs" disabled={done}><X.DetailCard src={img(i.img)} title={i.title} sub={isRide && sched ? Cat.home(M.id).city + (rTime ? ` · pick-up ${M.clock(rTime)}` : '') : i.sub} facts={[...(i.rating ? [`${i.rating} ★`] : []), ...(i.meta || [])]} policy={['stays', 'experiences'].includes(i.cat) ? F.policyFor(i, date, /^\d{1,2}:\d\d/.test(opt || '') ? opt.slice(0, 5) : undefined) : i.policy} price={i.cat === 'dining' || (i.included && !total) ? undefined : total} points={total ? F.ptsOf(total) : undefined} unit={i.cat === 'stays' ? `${nights} night${nights > 1 ? 's' : ''}${roomsE > 1 ? `, ${roomsE} rooms` : ''}, taxes in` : i.cat === 'dining' ? undefined : freeLeft && total ? `${Math.min(qty, qMax) - freeLeft} × ${M.money(price)}, ${freeLeft} free` : freeLeft ? undefined : i.unit === 'for two' ? `${M.money(price, price % 1 ? 2 : 0)} for every two people` : i.cat === 'rides' && i.opts?.kind === 'dates' && opt ? `${opt} day${+opt === 1 ? '' : 's'} at ${M.money(F.IP(i))} a day` : Math.min(qty, qMax) > 1 ? `${Math.min(qty, qMax)} × ${M.money(price)}` : isRide && dest ? 'fixed price' : i.unit}
    cta={far ? 'Too far for a ride' : needSize ? 'Pick a size' : isRide && !dest.trim() ? 'Add where to' : isRide && sched && !rTime ? 'Pick a time' : needsEmail && (!who.trim() || !EMAIL.test(email.trim())) ? 'Add their name and email' : freeVisit && !total ? (Math.min(qty, qMax) > 1 ? `Use ${Math.min(qty, qMax)} free visits` : 'Use a free visit') : i.cat === 'dining' ? 'Choose this time' : i.cat === 'subs' ? (i.included ? 'Turn on' : 'Subscribe') : i.cat === 'giftcards' ? 'Buy gift card' : 'Continue'} disabled={blocked || done}
    onCta={() => { setDone(true); run({ f: 'startCheckout', a: { id, tap: true, addr: i.cat === 'shopping' ? addr : undefined, ship: i.cat === 'shopping' ? shipDay : undefined, rooms: i.cat === 'stays' ? roomsE : undefined, option: opt, qty: Math.min(qty, qMax), to: i.cat === 'giftcards' ? (to === 'Me' ? 'Me' : who.trim()) : undefined, email: needsEmail ? email.trim() : undefined, date: isRide ? (sched ? rDate : undefined) : ['stays', 'experiences', 'rides', 'airport', 'dining'].includes(i.cat) || (i.cat === 'tickets' && /this week/i.test(i.title)) ? date : undefined, at: isRide && sched && rTime ? `${M.date(rDate)} ${M.clock(rTime)}` : undefined, nights, dest: isRide ? dest.trim() : undefined, pickup: isRide ? (sched && rTime ? `${from} at ${rTime}, ${M.date(rDate)}` : from) : isTransfer ? St.get().addresses[0].line : undefined } }, label) }}>
    {i.included && i.cat === 'subs' && <div><K.Badge tone="good" icon="check">Included with your card</K.Badge></div>}
    {freeVisit && <div><K.Badge tone="good" icon="check">{`Free with your card · ${St.get().loungeLeft} visit${St.get().loungeLeft > 1 ? 's' : ''} left this year`}</K.Badge></div>}
    {i.cat === 'giftcards' && <div className="gr-row" style={{ justifyContent: 'center', padding: '4px 0' }}><V.GiftCardTile brand={i.title} amount={+opt} color={i.tags?.[0]} note={i.sub} /></div>}
    {i.cat === 'stays' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Check in</span><DayChips from={F.iso(new Date())} n={90} value={date} onChange={setDate} /><div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label">Nights</span><K.Stepper value={nights} min={1} max={30} label="Nights" onChange={setNights} /></div>{trip && <div className="gr-meta">Matched to your flight: {M.date(trip.in)} to {M.date(trip.out)}</div>}</div>}
    {(i.cat === 'experiences' || (i.cat === 'rides' && (i.opts?.kind === 'slots' || i.opts?.kind === 'dates'))) && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{i.opts?.kind === 'dates' ? 'Pick-up day' : 'Day'}</span><DayChips from={/^Train to /.test(i.title) ? F.iso(new Date()) : F.addDays(F.iso(new Date()), 1)} n={45} value={date} onChange={setDate} /></div>}
    {i.cat === 'airport' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day of travel</span><DayChips from={F.iso(new Date())} n={45} value={date} onChange={setDate} />{F.tripDates() && <div className="gr-meta">{`Matched to your ${F.tripDates()!.flight.extra?.number} on ${M.date(F.tripDates()!.in)}, leaving ${F.tripDates()!.flight.extra?.dep}`}</div>}</div>}
    {isRide && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Pick up from</span><div className="gr-slots" role="radiogroup" aria-label="Pick up from">{['Your location', ...St.get().addresses.map(a => `${a.label}, ${a.line}`)].map(p => <button key={p} className="gr-slot" role="radio" aria-checked={from === p} onClick={() => setFrom(p)}>{p === 'Your location' ? 'Here' : p.split(',')[0]}</button>)}</div></div>}
    {isRide && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Where to?</span><input className="app-in" placeholder="Address or place" value={dest} onChange={e => setDest(e.target.value)} aria-label="Where to?" /><div className="gr-slots" role="radiogroup" aria-label="Quick picks">{[...St.get().addresses.map(a => [a.label, `${a.label}, ${a.line}`]), ['Airport', Cat.airportName(M.id)]].map(([l, p]) => <button key={p} className="gr-slot" role="radio" aria-checked={dest === p} onClick={() => setDest(p)}>{l}</button>)}</div><K.Segmented items={['Now', 'Schedule']} value={sched ? 'Schedule' : 'Now'} onChange={(v: string) => setSched(v === 'Schedule')} />{sched ? <><DayChips from={F.iso(new Date())} n={30} value={rDate} onChange={setRDate} /><input className="app-in" type="time" aria-label="Pick-up time" value={rTime} onChange={e => setRTime(e.target.value)} /><div className="gr-meta">{rTime ? (from === 'Your location' ? `Pick-up from your location at ${M.clock(rTime)}, ${M.date(rDate)}.` : `Pick-up from ${from} at ${M.clock(rTime)}, ${M.date(rDate)}.`) : 'Choose a pick-up time.'}</div></> : <div className="gr-meta">{from === 'Your location' ? 'Pick-up from where you are now.' : `Pick-up from ${from}.`}</div>}</div>}
    {isTransfer && <div className="gr-meta">{trip ? `Pick-up from ${St.get().addresses[0].line}, 3 hours before your ${trip.flight.extra?.dep} flight on ${M.date(trip.in)}.` : `Pick-up from ${St.get().addresses[0].line}. Book a flight and I'll time the pick-up to it.`}</div>}
    {i.cat === 'shopping' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Deliver to</span><div className="gr-slots" role="radiogroup" aria-label="Deliver to" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{St.get().addresses.map(ad => <button key={ad.id} className="gr-slot" role="radio" aria-checked={addr === ad.id} style={{ height: 'auto', padding: '8px 12px', textAlign: 'start' }} onClick={() => setAddr(ad.id)}><b>{ad.label}</b><br /><span className="gr-meta">{ad.line}</span></button>)}</div><span className="gr-label">Delivery day</span><DayChips from={F.addDays(F.iso(new Date()), 2)} n={10} value={shipDay} onChange={setShipDay} /></div>}
    {i.cat === 'dining' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day</span><DayChips from={F.iso(new Date())} n={30} value={date} onChange={setDate} /></div>}
    {i.cat === 'dining' && dvals.length === 0 && <div className="gr-meta">No tables left today. Pick another day.</div>}{i.cat === 'tickets' && /this week/i.test(i.title) && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day</span><DayChips from={F.iso(new Date())} n={7} value={date} onChange={(d: string) => { setDate(d); if (d !== F.iso(new Date()) && !opt) setOpt0(vals[0]) }} /></div>}{i.cat === 'tickets' && dvals.length === 0 && <div className="gr-meta">{/this week/i.test(i.title) ? 'No more showings today. Pick another day.' : 'No more showings today.'}</div>}{/^Train to /.test(i.title) && dvals.length === 0 && <div className="gr-meta">No more trains today. Pick another day.</div>}
    {dvals.length > 0 && (i.opts?.kind === 'slots' ? <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{i.opts.label}</span><div className="gr-slots" role="radiogroup" aria-label={i.opts.label}>{dvals.map((v: string) => <button key={v} className="gr-slot" role="radio" aria-checked={opt === v} onClick={() => setOpt(v)}>{M.clock(v)}</button>)}</div></div> : <X.VariantPicker label={i.cat === 'giftcards' ? 'Amount' : i.opts?.label || 'Option'} options={vals.map(show)} value={show(opt)} onChange={(v: string) => setOpt(vals[vals.map(show).indexOf(v)])} />)}
    {i.cat === 'giftcards' && <><X.VariantPicker label="Who is it for?" options={['Someone else', 'Myself']} value={to === 'Me' ? 'Myself' : to} onChange={(v: string) => setTo(v === 'Myself' ? 'Me' : v)} />{to !== 'Me' && <><input className="app-in" placeholder="Their name" value={who} onChange={e => setWho(e.target.value)} aria-label="Their name" /><input className="app-in" type="email" inputMode="email" placeholder="Their email address" value={email} onChange={e => setEmail(e.target.value)} aria-label="Their email address" />{email && !EMAIL.test(email.trim()) && <div className="gr-meta" style={{ color: 'var(--danger)' }}>Check the email address.</div>}</>}</>}
    {freeVisit && Math.min(qty, qMax) > freeLeft && <div className="gr-meta">{`${freeLeft} free visit${freeLeft > 1 ? 's' : ''} left, so ${Math.min(qty, qMax) - freeLeft} ${Math.min(qty, qMax) - freeLeft > 1 ? 'people are' : 'person is'} paid.`}</div>}{(!['subs', 'rides', 'giftcards'].includes(i.cat) || /^Train to /.test(i.title)) && <div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label">{qLabel}</span><K.Stepper value={Math.min(qty, qMax)} min={1} max={qMax} label={qLabel} onChange={(n: number) => { setQty(n); if (i.cat === 'stays') setRooms(Math.min(4, Math.max(1, Math.ceil(n / perRoom)))) }} /></div>}{i.cat === 'dining' && qty >= 12 && <div className="gr-meta">For more than 12, ask the concierge team: they arrange big tables with the restaurant.</div>}{i.cat === 'stays' && <div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label">Rooms</span><K.Stepper value={Math.max(rooms, Math.ceil(qty / perRoom))} min={Math.max(1, Math.ceil(qty / perRoom))} max={4} label="Rooms" onChange={setRooms} /></div>}{i.cat === 'stays' && pax && pax > 2 && /Suite/i.test(opt || '') && rooms === 1 && <div className="gr-meta">{`Suite picked so ${pax} of you can stay together; or choose Double and 2 rooms.`}</div>}{i.cat === 'stays' && <div className="gr-meta">{pax && pax > qMax ? `${pax} people need more space than this: add a room or choose a suite.` : `${roomsE} room${roomsE > 1 ? 's' : ''} for ${Math.min(qty, qMax)} guest${Math.min(qty, qMax) > 1 ? 's' : ''}; up to ${perRoom} per room.`}</div>}
  </X.DetailCard></fieldset>
}
function GroceryBlock() {
  const basket = St.useS(s => s.basket); const M = useMarket()
  const lines = Cat.GROCERY.filter(g => basket[g.id]).map(g => ({ id: g.id, title: g.title, price: F.IP(g), qty: basket[g.id] }))
  const fee = F.groceryFee()
  const total = Math.round((lines.reduce((s, l) => s + l.price * l.qty, 0) + (lines.length ? fee : 0)) * 100) / 100
  return <div className="gr-col" style={{ gap: 10 }}>
    {!lines.length && <div className="gr-meta">Tap items to add them. Your basket and total show here; delivery takes about 15 minutes.</div>}
    <div className="gr-rail" aria-label="Add to basket" style={{ paddingBottom: 6, marginBottom: 0 }}>{Cat.GROCERY.filter(g => !basket[g.id]).map(g => <button key={g.id} className="app-gchip" onClick={() => St.set(s => ({ basket: { ...s.basket, [g.id]: (s.basket[g.id] || 0) + 1 } }))}><Icon name="plus" size={14} />{g.title}<b>{M.money(F.IP(g), 2)}</b></button>)}</div>
    {lines.length > 0 && <X.Basket lines={lines} total={total} points={F.ptsOf(total)} note={`Includes ${M.money(fee, 2)} delivery · arrives in about 15 minutes`} cta="Checkout" onQty={(id, q) => St.set(s => { const b = { ...s.basket }, g = Cat.GROCERY.find(x => x.id === id); if (q) b[id] = g ? Math.min(F.capOf(g), q) : q; else delete b[id]; return { basket: b } })} onCta={() => { const n = lines.reduce((s, l) => s + l.qty, 0); const d = St.draft({ cat: 'quick', title: 'Groceries', sub: `${n} items · ${St.get().addresses.find(a => a.id === St.get().addr)?.label}`, qty: 1, unit: total, total, icon: 'bag', kind: 'order', policy: 'Missing or damaged items refunded straight away', refundable: true, tracker: { steps: ['Order placed', 'Packed', 'Out for delivery', 'Delivered'], current: 1, eta: '15 min' }, detail: [...lines.map(l => [`${l.title} × ${l.qty}`, M.money(l.price * l.qty, 2)] as [string, string]), ['Delivery', M.money(fee, 2)], ['Arrives', 'In about 15 minutes']] }); respond({ say: 'Here\'s your total.', blocks: [{ kind: 'checkout', draft: d }] }) }} />}
  </div>
}
function CheckoutBlock({ draft, method: m0, fresh }: { draft: string; method?: string; fresh?: boolean }) {
  const d = St.useS(s => s.drafts[draft]); const bal = St.useS(s => s.balance); const M = useMarket()
  const [method, setMethod] = usePS<string>('pay:' + draft + (m0 ? ':' + m0 : ''), 'method', m0 || ''); const [mixPts, setMixPts] = usePS<number | undefined>('pay:' + draft, 'mix', undefined)
  if (!d) return <div className="app-badge"><K.Badge tone="good" icon="check">Paid</K.Badge></div>
  if ((d as any).replaced) return <div className="gr-meta" role="status">This checkout was replaced by a newer one below.</div>
  if (d.extra?.repriced && !fresh) return <div className="gr-card gr-row" style={{ gap: 10 }}><Icon name="info" size={18} /><span>The price changed after this. The updated checkout is further down.</span></div>
  const full = F.ptsOf(d.total)
  const def = full <= bal ? 'points' : bal >= 100 ? 'mix' : 'card'
  const m = d.pointsOnly ? 'points' : method || def
  const choice = F.payChoice(d, m, m === 'mix' ? mixPts : undefined)
  const mix = F.payChoice(d, 'mix', mixPts)
  return <div className="gr-card" style={{ gap: 12 }}>
    <div className="gr-row" style={{ alignItems: 'flex-start' }}><span className="gr-ibtn gr-flat gr-sm"><Icon name={d.icon || 'bag'} size={18} /></span><div className="gr-grow"><div className="gr-heading">{d.title}</div><div className="gr-meta">{[d.sub, d.when].filter(Boolean).join(' · ')}</div></div></div>
    <T.PriceLines lines={(d.detail || []) as any} total={['Total', M.money(d.total, 2)]} note={d.policy} />
    {!d.pointsOnly && <T.PayWith key={m + (mixPts || '')} points={bal} cash={d.total} rate={St.rate()} mix={mix.pts} card={St.get().card.last4} value={m} onChange={setMethod} />}
    {m === 'mix' && !d.pointsOnly && <T.PointsSlider total={d.total} rate={St.rate()} balance={bal} start={Math.min(1, mix.pts / Math.max(1, Math.min(bal, Math.floor(d.total / St.rate()))))} step={100} onChange={setMixPts} />}
    {(() => { const c = St.get().card, avail = Math.max(0, Math.round((c.limit - c.balance) * 100) / 100); return choice.card > avail ? <div className="gr-meta" style={{ color: 'var(--danger)' }}>{`That's more than your available credit of ${M.money(avail, 2)}.${bal >= 100 && choice.pts < Math.min(bal, full) - 100 ? ' Use more points, or pay less on the card.' : ' Paying off some of your balance frees up credit, or choose something cheaper.'}`}</div> : null })()}
    <K.Button block size="lg" disabled={choice.pts > bal || choice.card > Math.max(0, Math.round((St.get().card.limit - St.get().card.balance) * 100) / 100)} icon={M.auth === 'faceid' ? 'faceid' : M.auth === 'otp' ? 'lock' : 'phone'} onClick={() => { const r = F.reprice(draft) || F.precheck(draft, choice); if (r) { respond(r); return } openConfirm({ kind: 'pay', draft, choice }) }}>{choice.card ? `Pay ${M.money(choice.card, 2)}${choice.pts ? ' + ' + M.pts(choice.pts) : ''}` : `Pay ${M.pts(choice.pts)}`}</K.Button>
  </div>
}
function FreeConfirm({ draft }: { draft: string }) {
  const d = St.useS(s => s.drafts[draft]); const M = useMarket()
  if (!d) return <div className="app-badge"><K.Badge tone="good" icon="check">Done</K.Badge></div>
  const label = d.cat === 'dining' ? 'Book the table' : d.cat === 'subs' ? 'Turn it on' : 'Confirm'
  return <div className="gr-card" style={{ gap: 12 }}><div className="gr-heading">{d.title}</div><T.PriceLines lines={(d.detail || []) as any} total={['To pay', d.extra?.included ? 'Free with your card' : M.t('free')]} note={d.policy} /><K.Button block onClick={() => run({ f: 'confirmFreeBooking', a: { draft } }, label)}>{label}</K.Button></div>
}
function actionsFor(b: St.Booking): string[] {
  if (dead(b)) return []
  if (b.kind === 'sub') return b.pts || b.card ? (b.status === 'paused' ? ['Resume', 'Cancel'] : ['Pause', 'Cancel']) : ['Turn off']
  if (b.kind === 'investment') return ['Sell']
  if (b.kind === 'donation') return []
  if (b.kind === 'request' || b.kind === 'claim' || b.kind === 'transfer') return ['Track']
  if (b.cat === 'giftcards') return ['Show code']
  if (b.cat === 'flights' && b.extra?.disrupted) return ['See options', 'Full refund']
  if (b.cat === 'flights') return ['Boarding pass', ...(b.extra?.fare === 'light' ? [] : ['Change date', 'Change seats']), ...(b.refundable ? ['Cancel'] : [])]
  if (b.kind === 'ticket' || b.cat === 'airport' || b.cat === 'experiences' || (b.cat === 'rides' && /^Train/.test(b.title))) return ['Show pass', ...(b.refundable ? ['Cancel'] : [])]
  if (b.kind === 'order') return b.extra?.returning ? ['Track'] : b.status === 'delivered' ? ['Return', 'Report a problem'] : b.cat === 'bank' ? ['Track'] : ['Track', 'Cancel']
  if (b.status === 'done') return ['Report a problem']
  return ['Cancel', 'Report a problem']
}
function BookingCard({ id, inline }: { id: string; inline?: boolean }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [pass, setPass] = useState(false); const [more, setMore] = useState(false)
  if (!b) return null
  const acts = actionsFor(b)
  const status = dead(b) ? (b.status === 'refunded' ? (b.kind === 'investment' ? 'Sold' : 'Refunded') : b.kind === 'sub' && !b.pts && !b.card ? 'Off' : 'Cancelled') : b.extra?.returning ? 'Returning' : b.extra?.disrupted ? 'Cancelled by airline' : b.status === 'confirmed' ? 'Confirmed' : b.status === 'active' ? 'Active' : b.status === 'paused' ? 'Paused' : b.status === 'delivered' ? 'Delivered' : b.status === 'done' ? 'Done' : 'In progress'
  return <div className="gr-card" style={{ gap: 10 }}>
    <div className="gr-row" style={{ alignItems: 'flex-start' }}><span className="gr-ibtn gr-flat gr-sm"><Icon name={b.icon || iconFor(b.cat)} size={18} /></span><div className="gr-grow"><div className="gr-heading">{b.title}</div><div className="gr-meta">{[b.sub, b.when].filter(Boolean).join(' · ')}</div></div><K.Badge tone={dead(b) ? 'ink' : b.extra?.disrupted ? 'danger' : b.status === 'paused' || b.extra?.returning ? 'warn' : 'good'}>{status}</K.Badge></div>
    <div className="gr-meta"><span className="gr-code">{b.ref}</span>{b.refunded && (b.refunded.pts || b.refunded.card) ? <><span className="gr-dot" />{`Refunded ${[b.refunded.pts ? M.pts(b.refunded.pts) : '', b.refunded.card ? M.money(b.refunded.card, 2) : ''].filter(Boolean).join(' + ')}`}</> : (b.pts || b.card) ? <><span className="gr-dot" />{[b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')}</> : null}</div>
    {b.kind === 'sub' && dead(b) && (b.pts || b.card) > 0 && <div className="gr-meta">{`Access until ${M.date(F.renewOn(b))}; nothing more is charged`}</div>}
    {b.kind === 'sub' && !dead(b) && <div className="gr-meta">{b.status === 'paused' ? 'Paused: nothing is charged until you resume' : b.total ? `Next payment ${M.date(F.renewOn(b))} · ${M.money(b.total, 2)} on your card` : 'Included with your card: nothing to pay'}</div>}
    {acts.length > 0 && <div className="gr-actions">{acts.map((a, i) => <K.Button key={a} size="sm" variant={i ? 'secondary' : 'primary'} onClick={() => { if (inline && /Show (pass|code)|Boarding pass/.test(a)) { setPass(!pass); return } run({ f: 'manage', a: { id, action: a } }, `${a}: ${b.title}`) }}>{inline && /Show (pass|code)|Boarding pass/.test(a) && pass ? 'Hide' : a}</K.Button>)}</div>}
    {inline && pass && <PassFor id={id} />}
    {inline && (b.detail?.length || 0) > 0 && <button className="gr-link" style={{ alignSelf: 'flex-start' }} aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Hide details' : 'Show details'}</button>}
    {inline && more && <T.PriceLines lines={(b.detail || []).slice(0, 14) as [string, string][]} total={['Paid', [b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ') || 'Nothing']} />}
  </div>
}
function ConfirmCancel({ id, fraction, sell, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [kept, setKept] = usePS(bk, 'kept', false)
  if (!b) return null
  if (dead(b)) return <div className="app-badge"><K.Badge tone="ink" icon="check">{sell ? 'Sold' : b.kind === 'sub' ? 'Cancelled' : 'Cancelled'}</K.Badge></div>
  if (kept) return <div className="app-badge"><K.Badge tone="good" icon="check">Kept as it is</K.Badge></div>
  const paid = [b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')
  const bal = St.get().balance, ptsBack = Math.round(b.pts * fraction), owed = Math.round((b.earned || 0) * fraction), rev = Math.min(bal + ptsBack, owed), off = owed - rev, net = ptsBack - rev
  const back = [net > 0 ? M.pts(net) : '', b.card ? M.money(b.card * fraction, 2) : ''].filter(Boolean).join(' + ')
  const lines: [string, string][] = b.kind === 'sub' ? [] : [['You paid', paid || M.t('free')], ...(fraction > 0 && fraction < 1 ? [['Airline cancellation fee (30%)', [b.pts ? M.pts(Math.round(b.pts * (1 - fraction))) : '', b.card ? M.money(b.card * (1 - fraction), 2) : ''].filter(Boolean).join(' + ')] as [string, string]] : []), ...(rev ? [['Points earned on it, taken off', M.pts(-rev)] as [string, string]] : []), ...(off ? [['Earned points already used, written off', M.pts(off)] as [string, string]] : [])]
  const verb = sell ? 'Sell' : b.kind === 'sub' && !b.pts && !b.card ? 'Turn off' : 'Cancel', airline = !!b.extra?.disrupted
  return <div className="gr-card" style={{ gap: 12 }}><div className="gr-heading">{airline ? `Full refund for ${b.title}?` : `${verb} ${b.title}?`}</div>{lines.length > 0 && <T.PriceLines lines={lines} total={[rev && ptsBack ? 'You get back, net' : 'You get back', b.extra?.included && !paid ? 'Your free visit' : back || 'Nothing to refund']} note={airline ? 'The airline cancelled this flight, so there\'s no fee.' : b.policy} />}<div className="gr-actions"><K.Button onClick={() => run({ f: 'doCancel', a: { id, fraction } }, airline ? 'Yes, refund me' : `Yes, ${verb.toLowerCase()}`)}>{airline ? 'Yes, refund me' : `Yes, ${verb.toLowerCase()}`}</K.Button><K.Button variant="secondary" onClick={() => { setKept(true); St.pushMsg({ role: 'gr', text: 'Kept as it is.' }) }}>Keep it</K.Button></div></div>
}
function ReturnBlock({ id }: { id: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [addr, setAddr] = useState(St.get().addr)
  if (!b) return null
  if (dead(b) || b.extra?.returning) return <div className="app-badge"><K.Badge tone="good" icon="check">Collection booked</K.Badge></div>
  return <div className="gr-card" style={{ gap: 12 }}><div className="gr-heading">{`Return ${b.title}`}</div><X.AddressPicker addresses={St.get().addresses} value={addr} onChange={setAddr} /><div className="gr-meta">A courier collects it for free. Your refund goes back the way you paid once the courier scans it.</div><K.Button block onClick={() => run({ f: 'returnDo', a: { id } }, 'Book free collection')}>Book free collection</K.Button></div>
}
function ChangeFlight({ id, bk, leg: leg0, date: date0, tod }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [date, setDate] = useState(date0 || ''); const [done, setDone] = useDone(bk); const [leg, setLeg] = useState(leg0 || 0)
  const [fid, setFid] = useState(() => { if (!b || !date0 || !tod) return ''; const cur = (leg0 ? b.extra.back?.dep : b.extra.dep) || '12:00', hm = (x: string) => +x.slice(0, 2) * 60 + +x.slice(3), R: any = { morning: [0, 720], afternoon: [720, 1020], evening: [1020, 1440] }; const o = F.changeQuote(id, date0, leg0 || 0).opts.filter(x => tod === 'later' ? hm(x.dep) > hm(cur) : tod === 'earlier' ? hm(x.dep) < hm(cur) : R[tod] && hm(x.dep) >= R[tod][0] && hm(x.dep) < R[tod][1]).sort((x, y) => tod === 'earlier' ? hm(y.dep) - hm(x.dep) : hm(x.dep) - hm(y.dep))[0]; return o ? o.id : '' })
  if (!b) return null
  if (dead(b)) return <div className="app-badge"><K.Badge tone="ink">Cancelled</K.Badge></div>
  const today = F.iso(new Date()), back = b.extra.back
  const cur = leg ? { number: back.number, date: back.date, dep: back.dep } : { number: b.extra.number, date: b.extra.date, dep: b.extra.dep }
  const start = leg ? F.addDays(b.extra.date, 1) : F.addDays(today, 1)
  const end = leg ? F.addDays(today, 330) : back ? F.addDays(back.date, -1) : F.addDays(today, 330)
  const n = Math.max(1, Math.min(60, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1))
  if (done) return <div className="gr-card gr-row" style={{ gap: 10 }}><Icon name="check" size={18} /><span>Change chosen. The booking card below has the latest details.</span></div>
  const q0 = date ? F.changeQuote(id, date, leg, fid || undefined) : null, q = q0 && q0.nf ? q0 : null
  const infOld = !!date && ((b.extra.dobs || []) as string[]).slice(b.extra.pax || 1).some(x => x && ageOn(x, leg || !back ? date : back.date) >= 2)
  return <div className="gr-card" style={{ gap: 12 }}><div className="gr-heading">{`Change ${b.title}`}</div>
    {back && <K.Segmented items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setDate(''); setFid('') }} />}
    <div className="gr-meta">{`Now: ${cur.number} · ${M.date(cur.date)} ${cur.dep}`}</div>
    <DayChips from={start} n={n} value={date} onChange={(d: string) => { setDate(d); setFid('') }} />
    {q && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Flights that day</span><div className="gr-slots" role="radiogroup" aria-label="Flights that day" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{[...q.opts].sort((x, y) => x.dep.localeCompare(y.dep)).map(o => { const oq = F.changeQuote(id, date, leg, o.id); return <button key={o.id} className="gr-slot" role="radio" style={{ height: 'auto', padding: '8px 12px', textAlign: 'start' }} aria-checked={q.nf.id === o.id} onClick={() => setFid(o.id)}><b>{o.dep}</b> {Cat.AIRLINES[o.airline]}<br /><span className="gr-meta">{o.stops ? `1 stop, ${o.dur}` : `Direct, ${o.dur}`}</span><br /><span className="gr-meta" style={{ fontWeight: 650 }}>{oq.diff ? `${M.money(oq.diff)} more in total` : oq.credit ? `${M.money(oq.credit)} back in total` : 'Same price'}</span></button> })}</div></div>}
    {q && <T.PriceLines lines={[['New flight', `${q.nf.number} · ${M.date(q.nf.date)} ${q.nf.dep}`], ['Change fee', M.t('free')]]} total={q.credit ? ['Back to you', M.money(q.credit, 2)] : ['Fare difference', q.diff ? M.money(q.diff, 2) : 'None']} />}
    {infOld && <div className="gr-banner gr-warn" role="status"><Icon name="info" size={18} /><span>Your infant would be 2 by then, so they'd need their own seat. Pick an earlier day, or ask a person to rebook.</span></div>}
    <K.Button block disabled={!date || done || infOld} onClick={() => { setDone(true); run({ f: 'changeDo', a: { id, date, leg, flightId: q?.nf.id } }, `Move ${leg ? 'return' : 'outbound'} to ${M.date(date)} ${q?.nf.dep || ''}`.trim()) }}>{!q ? 'Pick a day' : q.diff ? `Continue, ${M.money(q.diff, 2)} more` : q.credit ? `Change and get ${b.pts >= F.ptsOf(q.credit) ? M.pts(F.ptsOf(q.credit)) : M.money(q.credit, 2)} back` : 'Change at no cost'}</K.Button></div>
}
function Disruption({ id, bk }: { id: string; bk?: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket()
  const opts = b && !dead(b) && !b.extra?.rebooked ? F.rebookOptions(b) : []
  const [pick, setPick] = usePS<string>(bk || 'dis:' + id, 'pick', opts[0]?.id || '')
  if (!b) return null
  const sorted = dead(b) || b.extra?.rebooked, sameDay = (o: any) => o.date === b.extra?.date
  return <div className="gr-card" style={{ gap: 12 }}><div className="gr-row" style={{ gap: 10 }}><span className="gr-ibtn gr-flat gr-sm" style={{ color: 'var(--danger)' }}><Icon name="plane" size={18} /></span><div className="gr-grow"><div className="gr-heading">{b.extra?.rebooked ? `${b.title}: moved to another flight` : dead(b) ? `${b.title}: refunded` : `${b.title}: cancelled by the airline`}</div><div className="gr-meta">{`${b.extra?.number} · ${b.when}`}</div></div><K.Badge tone={sorted ? 'good' : 'danger'}>{sorted ? 'Sorted' : 'Cancelled'}</K.Badge></div>
    {sorted ? <div className="gr-meta">{b.extra?.rebooked ? `Now on ${b.extra.number} at ${b.extra.dep} on ${M.date(b.extra.date)}, at no cost.` : 'Refunded the way you paid.'}</div>
      : opts.length ? <div className="gr-col" style={{ gap: 8 }}><span className="gr-label" id={'rb-' + id}>Move to, at no cost</span><div className="gr-opts" role="radiogroup" aria-labelledby={'rb-' + id}>{opts.map(o => <button key={o.id} className="gr-opt" role="radio" aria-checked={pick === o.id} onClick={() => setPick(o.id)}><span className="gr-radio" /><div className="gr-grow"><div style={{ fontWeight: 650 }}>{`${o.dep} ${Cat.AIRLINES[o.airline]}, ${sameDay(o) ? 'same day' : M.date(o.date)}`}</div><div className="gr-meta">{`${o.number} · ${o.stops ? '1 stop' : 'Direct'}${!sameDay(o) && b.extra?.back ? ' · your trip becomes a day shorter' : ''}`}</div></div></button>)}</div></div>
      : <div className="gr-meta">{`No other flight lands before your return on ${M.date(b.extra.back.date)}. You can take a full refund of ${[b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')}, or a person can move both flights.`}</div>}
    <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>You may also be owed compensation under {M.flightRule.name}.</span></div>
    {!sorted ? <div className="gr-actions">{opts.length > 0 && <K.Button size="sm" onClick={() => { const o = opts.find(x => x.id === pick) || opts[0]; run({ f: 'rebook', a: { id, flightId: o.id } }, `Move me to the ${o.dep}`) }}>Move to this flight</K.Button>}{!opts.length && <K.Button size="sm" onClick={() => run({ f: 'handoff', a: { reason: `Move both flights: ${b.title}` } }, 'Ask a person to move both flights')}>Move both flights</K.Button>}<K.Button size="sm" variant="secondary" onClick={() => { St.pushMsg({ role: 'user', text: 'Full refund' }); respond({ say: 'The airline cancelled it, so you get everything back the way you paid.', blocks: [{ kind: 'confirmcancel', id, fraction: 1 }] }) }}>Full refund</K.Button><K.Button size="sm" variant="quiet" onClick={() => run({ f: 'compensation', a: {} }, 'Check compensation')}>Compensation</K.Button></div> : <K.Button size="sm" variant="secondary" onClick={() => run({ f: 'compensation', a: {} }, 'Check compensation')}>Check compensation</K.Button>}</div>
}
function PassFor({ id }: { id: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket()
  if (!b) return null
  if (dead(b)) return <T.StateCard kind="empty" title="This booking is cancelled" body="There's no pass for it any more." />
  if (b.cat === 'flights' && b.extra?.disrupted) return <T.StateCard kind="empty" title="No pass: the airline cancelled this flight" body="Pick another flight or a full refund, and your new passes appear here." />
  if (b.cat === 'flights') {
    const e = b.extra, pax = e.pax || 1, names = (e.names && e.names.length >= pax ? e.names : [St.get().prefs.name, ...Array.from({ length: pax - 1 }, (_, i) => `Guest ${i + 1}`)]).map((n: string) => n.toUpperCase())
    const legs = [{ airline: e.airline, number: e.number, from: e.from, to: e.to, fromCity: Cat.home(M.id).city, toCity: b.title.split(' to ')[1], date: e.date, dep: e.dep }, ...(e.back ? [{ airline: e.back.airline, number: e.back.number, from: e.back.from, to: e.back.to, fromCity: b.title.split(' to ')[1], toCity: Cat.home(M.id).city, date: e.back.date, dep: e.back.dep }] : [])]
    const opens = new Date(new Date(e.date + 'T' + e.dep + ':00').getTime() - 864e5)
    const board = (t: string) => { const n = +t.slice(0, 2) * 60 + +t.slice(3) - 40; return `${String(Math.floor(((n + 1440) % 1440) / 60)).padStart(2, '0')}:${String(((n + 1440) % 1440) % 60).padStart(2, '0')}` }
    if (opens > new Date()) return <div className="gr-card" style={{ gap: 10 }}><div className="gr-row" style={{ gap: 10 }}><span className="gr-ibtn gr-flat gr-sm"><Icon name="plane" size={18} /></span><div className="gr-grow"><div className="gr-heading">{`Check-in opens ${M.date(opens)} at ${e.dep}`}</div><div className="gr-meta">Your boarding passes appear here once check-in opens.</div></div></div>
      <T.PriceLines lines={legs.map((l, li) => [`${l.number} · ${M.date(l.date)} ${l.dep}`, `From ${l.from} to ${l.to}`] as [string, string]).concat(names.slice(0, pax).map((n, ni) => [n, `Seat ${(e.seats?.[ni] || (e.fare === 'light' ? 'at check-in' : '—'))}${e.back ? ` · back ${e.backSeats?.[ni] || e.seats?.[ni] || '—'}` : ''}`] as [string, string]))} total={['Booking', b.ref]} /></div>
    return <div className="gr-col" style={{ gap: 12 }}>
      {legs.map((l, li) => ({ l, li, op: new Date(new Date(l.date + 'T' + l.dep + ':00').getTime() - 864e5) })).filter(x => x.op > new Date()).map(x => <div key={'w' + x.li} className="gr-card gr-row" style={{ gap: 10 }}><span className="gr-ibtn gr-flat gr-sm"><Icon name="plane" size={18} /></span><div className="gr-grow"><div style={{ fontWeight: 650 }}>{`Return check-in opens ${M.date(x.op)} at ${x.l.dep}`}</div><div className="gr-meta">{`${x.l.number} from ${x.l.from} to ${x.l.to}. The pass appears here then.`}</div></div></div>)}
      {legs.filter(l => new Date(new Date(l.date + 'T' + l.dep + ':00').getTime() - 864e5) <= new Date()).flatMap((l, li0) => { const li = legs.indexOf(l); return names.map((n, ni) => <V.BoardingPass key={li + '-' + ni} airline={l.airline} number={l.number} from={l.from} to={l.to} fromCity={l.fromCity} toCity={l.toCity} date={M.date(l.date)} dep={l.dep} seat={ni >= pax ? 'Lap' : (li ? e.backSeats?.[ni] || e.seats?.[ni] : e.seats?.[ni]) || (e.fare === 'light' ? 'At check-in' : '—')} gate={li ? 'C14' : 'B32'} boards={board(l.dep)} name={ni === 0 && e.inf ? `${n} +INF` : n} />) })}</div>
  }
  if (b.cat === 'airport') return <V.LoungePass name={b.title} where={b.sub} valid={b.when || 'Valid on the day of your flight'} guests={0} />
  if (b.cat === 'giftcards') return <X.TicketPass kind="Gift card" icon="gift" title={b.title} when={b.detail?.find(d => d[0] === 'Amount')?.[1] || ''} where="Valid for 12 months" holder={b.extra?.to && b.extra.to !== 'Me' ? `Sent to ${b.extra.to}` : St.get().prefs.name} code={b.ref.replace('GR', 'GIFT')} color="#2E5E4E" />
  const n = +(b.detail?.find(d => /People|Guests|Quantity/.test(d[0]))?.[1] || 1)
  return <X.TicketPass kind={b.cat === 'tickets' ? 'Ticket' : /^Train/.test(b.title) ? 'Train ticket' : 'Pass'} title={b.title} when={b.when || M.date(new Date())} where={b.sub} seat={b.detail?.find(d => /Area|Stand/.test(d[0]))?.[1]} holder={`${St.get().prefs.name} · admits ${n}`} code={b.ref} color={b.cat === 'tickets' ? '#5B3FA8' : '#17171A'} />
}
export function ddAsk(mode: 'full' | 'min' | 'off') { const M = W.__M, c = St.get().card as any, name = M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1); return mode === 'off' ? { kind: 'action', title: `Cancel ${M.directDebit}`, summary: 'From your current account ending 7781', lines: [['Now', c.autopayMode === 'min' ? 'The minimum each month' : 'The full balance each month']], total: ['After this', 'You pay each bill yourself'], act: { f: 'ddOff', a: {} } } : { kind: 'action', title: c.autopay ? `Change ${M.directDebit}` : `Set up ${M.directDebit}`, summary: 'From your current account ending 7781', lines: [['Pays', mode === 'min' ? 'The minimum each month' : 'The full balance each month'], ['First payment', M.date(c.dueDate)]], total: ['Mandate', name], act: { f: 'ddSet', a: { mode } } } }
if (typeof window !== 'undefined') (window as any).__ddAsk = (m: any) => ddAsk(m)
export function DirectDebitRow() {
  const c = St.useS(s => s.card) as any; const M = useMarket(); const name = M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)
  return <D.List><D.ActionRow icon="refresh" title={name} sub={!c.autopay ? 'Off. You pay each bill yourself.' : c.autopayMode === 'min' ? 'Pays the minimum each month' : 'Pays the full balance each month'} action={!c.autopay ? 'Full balance' : c.autopayMode === 'min' ? 'Change to full balance' : 'Change to minimum'} primary={!c.autopay} onAction={() => openConfirm(ddAsk(!c.autopay ? 'full' : c.autopayMode === 'min' ? 'full' : 'min') as any)} />{!c.autopay ? <D.ActionRow icon="refresh" title="Or the minimum" sub="Interest is charged on the rest" action="Minimum" onAction={() => openConfirm(ddAsk('min') as any)} /> : <D.ActionRow icon="close" title={`Cancel ${M.directDebit}`} sub="You go back to paying each bill yourself" action="Cancel" onAction={() => openConfirm(ddAsk('off') as any)} />}</D.List>
}
export function GamblingRow() {
  const c = St.useS(s => s.card) as any; const M = useMarket()
  const at = c.gamblingLiftAt ? new Date(c.gamblingLiftAt) : null
  return <D.List><D.ActionRow icon="shield" title="Gambling block" sub={!c.gambling ? 'Off. Blocks betting sites, casinos and lotteries when on.' : at ? `On until ${M.date(F.iso(at))} at ${M.clock(at.toTimeString().slice(0, 5))}, then it lifts` : 'On. Betting sites, casinos and lotteries are blocked.'} action={!c.gambling ? 'Turn on' : at ? 'Keep the block' : 'Lift'} primary={!c.gambling || !!at} onAction={() => !c.gambling ? run({ f: 'gamblingOn', a: {} }, 'Block gambling payments') : at ? run({ f: 'gamblingKeep', a: {} }, 'Keep the block') : respond(F.gamblingLiftAsk())} /></D.List>
}
function ClaimForm({ id, bk, why: why0, pick }: any) {
  const [why, setWhy] = useState(why0 || ''); const [files, setFiles] = useState<string[]>([]); const [done, setDone] = useDone(bk)
  const inp = React.useRef<HTMLInputElement>(null)
  const bb = St.get().bookings.find(x => x.id === id), physical = bb?.kind === 'order' && bb.cat !== 'giftcards'
  const quick = bb?.cat === 'quick', [picked, setPicked] = useState<string[]>(pick || [])
  const [opts] = useState(() => quick ? ['Something was missing', 'Something arrived damaged', 'I got the wrong item', 'I was charged wrongly'] : physical ? (bb?.status === 'delivered' ? ['It arrived damaged', 'It\'s not what I ordered', 'Something is missing from it', 'I was charged wrongly'] : ['It didn\'t arrive', 'I was charged wrongly']) : ['Service wasn\'t delivered', 'It wasn\'t as described', 'I was charged wrongly'])
  const itemTicks = quick && why && !/charged/.test(why), gone: string[] = bb?.extra?.refundedItems || []
  const rows = (bb?.detail || []).filter(([k]) => / × \d+$/.test(k))
  if (quick && rows.length && rows.every(([k]) => gone.includes(k))) return <div className="gr-card"><div className="gr-meta">Every item on this order has been refunded.</div></div>
  return <div className="gr-card" style={{ gap: 12 }}><X.VariantPicker label="What happened" options={opts} value={why} onChange={setWhy} />
    {itemTicks && <div className="gr-opts" role="group" aria-label="Which items">{rows.filter(([k]) => !gone.includes(k)).map(([k, v]) => <button key={k} className="gr-opt" role="checkbox" aria-checked={picked.includes(k)} disabled={done} onClick={() => setPicked(picked.includes(k) ? picked.filter(x => x !== k) : [...picked, k])}><span className="app-tick" aria-hidden="true">{picked.includes(k) ? <Icon name="check" size={14} /> : null}</span><div className="gr-grow">{F.loc(k.replace(/ × 1$/, '').replace(/ × (\d+)$/, ' × $1'))}</div><b>{v}</b></button>)}</div>}
    {itemTicks && <div className="gr-meta">Refunded straight away. No need to send anything back.</div>}<input ref={inp} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) setFiles([...files, f.name]) }} /><X.Upload files={files} onAdd={() => inp.current?.click()} /><K.Button block disabled={!why || done || (itemTicks && !picked.length)} onClick={() => { setDone(true); run({ f: 'fileClaim', a: { id, reason: why, photo: files.length > 0, items: itemTicks ? picked : undefined } }, why) }}>{itemTicks ? (picked.length ? `Refund ${picked.length} item${picked.length > 1 ? 's' : ''}` : 'Tick the items') : 'Send claim'}</K.Button></div>
}
function PayBill({ pick }: any) {
  const c = St.useS(s => s.card); const M = useMarket(); const [v, setV] = useState(String(pick || 'full').startsWith('other:') ? 'other' : pick || 'full')
  const [other, setOther] = useState(String(pick || '').startsWith('other:') ? String(pick).slice(6) : '')
  const oth = Math.round(Math.min(c.due, Math.max(0, parseFloat(other.replace(/,/g, '')) || 0)) * 100) / 100
  const over = (parseFloat(other.replace(/,/g, '')) || 0) > c.due
  const amt = v === 'full' ? c.due : v === 'min' ? c.min : v === 'other' ? oth : c.due
  const dd = () => openConfirm(ddAsk('full') as any)
  const sym = M.money(0).replace(/[0-9.,\s\u00a0\u2212-]/g, '')
  if (c.due <= 0) return <><D.AssistantNote>{`Paid. Nothing is due now${c.autopay ? `; ${M.directDebit} is set up for the next bill` : ''}.`}</D.AssistantNote>{!c.autopay && Mod.on('card.directdebit') && <D.Secondary onClick={dd}>{M.t('setUp', { dd: M.directDebit })}</D.Secondary>}</>
  return <div className="gr-col" style={{ gap: 12 }}><D.Amount label={`Due ${M.date(c.dueDate)}`} right={`•••• ${c.last4}`} value={M.money(c.due, 2)} meta={c.min > 0 ? `Minimum ${M.money(c.min, 2)}` : 'Minimum paid'} />
    <D.Choice label="How much to pay" value={v} onChange={setV} items={[{ key: 'full', title: 'Full balance', value: M.money(c.due, 2) }, ...(c.min > 0 ? [{ key: 'min', title: 'Minimum', value: M.money(c.min, 2), sub: 'Paying only the minimum means interest on the rest. The bank shows the exact cost before you confirm.' }] : []), { key: 'other', title: 'Another amount' }]} />
    {v === 'other' && <D.Field label="Amount to pay" prefix={sym} inputMode="decimal" placeholder={`Up to ${M.money(c.due, 2)}`} value={other} onChange={setOther} hint={over ? `That's more than you owe, so I've set it to the full balance of ${M.money(c.due, 2)}.` : oth > 0 && oth < c.min ? `That's below the minimum of ${M.money(c.min, 2)}. Pay at least that to avoid a late fee.` : undefined} />}
    <D.Primary disabled={!amt} onClick={() => respond(F.payBillAsk({ amount: amt }))}>{amt ? `Pay ${M.money(amt, 2)}` : 'Enter an amount'}</D.Primary>
    {!c.autopay && Mod.on('card.directdebit') && <D.Secondary onClick={dd}>{M.t('setUp', { dd: M.directDebit })}</D.Secondary>}
  </div>
}
function InvestBlock({ id: id0, pts: pts0 }: any) {
  const [id, setId] = useState(id0 || 'IV-1'); const bal = St.useS(s => s.balance); const M = useMarket(); const [ok, setOk] = useState(false); const [p, setP] = useState(pts0 || 5000)
  const i = Cat.INVEST.find(x => x.id === id)!, min = F.investMin(id)
  const chips = [...new Set([1000, 5000, 10000, 20000, ...(pts0 ? [pts0] : [])])].sort((a, b) => a - b).filter(x => x <= bal && x >= min)
  const pp = chips.includes(p) ? p : chips[0]
  return <div className="gr-col" style={{ gap: 12 }}><K.Segmented items={['Gold', 'Index fund', 'Savings']} value={['Gold', 'Index fund', 'Savings'][Cat.INVEST.indexOf(i)]} onChange={(t: string) => { setId(Cat.INVEST[['Gold', 'Index fund', 'Savings'].indexOf(t)].id); setOk(false) }} />
    <div className="gr-card" style={{ gap: 12 }}><div className="gr-heading">{i.title}</div><div className="gr-meta">{i.sub}{i.gbp ? ` · ${M.money(F.P(i.gbp))} ${i.unit}` : ''}</div><X.RiskNote points={i.risk} partner="a licensed partner (demo)" />
      {chips.length ? <><K.Chips items={chips.map(x => ({ id: String(x), label: M.num(x) + ' pts' }))} value={String(pp)} onChange={(v: any) => v && setP(+v)} />
        <div className="gr-meta">{M.pts(pp)} = {M.money(pp * St.rate(), 2)}{min > 100 ? ` · minimum ${M.pts(min)}` : ''}</div>
        <label className="gr-ack"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} /><span>I've read the risks and this is my own decision.</span></label>
        <K.Button block disabled={!ok || !pp} onClick={() => run({ f: 'investDo', a: { id, pts: pp } }, `Put ${M.num(pp)} points into ${i.title}`)}>Continue with the partner</K.Button></> : <div className="gr-meta">{`You need at least ${M.pts(min)} for this.`}</div>}</div></div>
}
function ConciergeForm({ hint, bk }: any) {
  const h = (hint || '').toLowerCase()
  const guess = /table|restaurant|dinner/.test(h) ? 0 : /gift|present/.test(h) ? 1 : /ticket|gig|concert|match|show/.test(h) ? 2 : /trip|holiday|anniversary|honeymoon/.test(h) ? 3 : /clean|repair|plumb|home/.test(h) ? 4 : -1
  const [what, setWhat] = useState(guess >= 0 ? Cat.CONCIERGE[guess] : ''); const [txt, setTxt] = useState(hint || ''); const [done, setDone] = useDone(bk)
  return <div className="gr-card" style={{ gap: 12 }}><X.VariantPicker label="What do you need?" options={Cat.CONCIERGE} value={what} onChange={setWhat} /><textarea className="app-ta" placeholder="Details: date, budget, anything they should know" value={txt} onChange={e => setTxt(e.target.value)} aria-label="Details" /><K.Button block disabled={!what || done} onClick={() => { setDone(true); run({ f: 'concierge', a: { brief: `${what}${txt ? ': ' + txt : ''}` } }, what) }}>Send to the concierge</K.Button></div>
}

/* chat input hook-up */
let sendTextFn = (s: string) => { }
export const setSendText = (f: (s: string) => void) => { sendTextFn = f }
export const sendText = (s: string) => sendTextFn(s)
