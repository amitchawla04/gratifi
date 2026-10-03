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
import * as C from './cards'

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
  ctlLimitStart: (a: any) => ({ say: `What should the ${Bk.limName(a).toLowerCase()} be?`, blocks: [{ kind: 'ctllimit', lim: { key: a.key, ch: a.ch, where: a.where } }] }),
  rideProblem: F.rideProblem, hireExtend: F.hireExtend, trainChange: F.trainChange, airportProblem: F.airportProblem, esimTopUp: F.esimTopUp, refundFull: F.refundFull, visaApply: F.visaApply, visaHelp: F.visaHelp, insClaimDo: F.insClaimDo,
  waitJoin: F.waitJoin, ticketSendDo: F.ticketSendDo, ticketSellDo: F.ticketSellDo, showChangeDo: F.showChangeDo, itemWatch: F.itemWatch, itemUnwatch: F.itemUnwatch,
  stayChangeDo: F.stayChangeDo, stayExtrasDo: F.stayExtrasDo, msgPlace: F.msgPlace, tableChangeDo: F.tableChangeDo, tourChangeDo: F.tourChangeDo, operatorCancels: F.operatorCancels,
  fraudStart: F.fraudStart, hardshipStart: F.hardshipStart, dueDayStart: () => ({ say: 'Which day of the month suits you? Many people pick a few days after payday.', blocks: [{ kind: 'dueday' }] }),
  disputeStart: F.disputeStart, planStart: F.planStart, btStart: F.btStart, holderStart: F.holderStart, ptsPayStart: F.ptsPayStart, sendPtsStart: F.sendPtsStart, missingPtsStart: F.missingPtsStart, protectStart: F.protectStart, cardSwitchStart: F.cardSwitchStart, holderRemoveStart: F.holderRemoveStart, nameFixStart: F.nameFixStart, nameFixDo: F.nameFixDo, lostBagStart: F.lostBagStart, lostBagDo: F.lostBagDo, priceWatch: F.priceWatch, priceUnwatch: F.priceUnwatch,
  extrasDone: F.extrasDone, checkIn: F.checkIn, autoCheckin: F.autoCheckin, checkInDo: F.checkInDo, flightStatus: F.flightStatus, upgradeOffer: F.upgradeOffer, upgradeDo: F.upgradeDo, addBags: F.addBags, addBagsDo: F.addBagsDo,
  settlePending: F.settlePending,
  cardSet: (a: any) => { St.set(s => ({ card: { ...s.card, [a.k]: true } })); return { say: ({ online: 'Online payments are on.', abroad: 'Payments abroad are on.', contactless: 'Contactless is on.', atm: 'Cash withdrawals are on.', domestic: 'Domestic payments are on.', instore: 'In-store payments are on.' } as any)[a.k], blocks: [{ kind: 'controls' }] } },
  ddSet: (a: any) => { const M = W.__M, min = a?.mode === 'min'; St.set(s => ({ card: { ...s.card, autopay: true, autopayMode: min ? 'min' : 'full' } as any })); return { say: `${M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)} is set up to pay ${min ? 'the minimum' : 'the full balance'} each month from your current account ending 7781.`, blocks: [{ kind: 'directdebit' }] } },
  ddOff: () => { const M = W.__M; St.set(s => ({ card: { ...s.card, autopay: false } as any })); return { say: `${M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)} is cancelled. Nothing will be taken automatically; pay the bill here or in the bank's app before the due date.`, blocks: [{ kind: 'directdebit' }] } },
  unfreeze: () => { St.set(s => ({ card: { ...s.card, frozen: false } })); return { say: 'Unfrozen. Your card works again.', blocks: [{ kind: 'controls' }] } },
  replaceCard: () => { if (St.get().bookings.some(b => b.title === 'Replacement card' && !dead(b) && b.status !== 'delivered')) return { say: 'A replacement is already on its way.', blocks: [] }; return { say: 'Confirm it\'s you to order the new card.', blocks: [], confirm: { kind: 'action', title: 'Order a replacement card', summary: St.get().card.frozen ? `To your home address · card ending ${St.get().card.last4} stays frozen and is cancelled` : `To your home address · card ending ${St.get().card.last4} works until you activate the new one`, lines: [['New card', St.get().card.frozen ? 'New number, 3 to 5 working days' : 'Same number, 3 to 5 working days']], total: ['To pay', 'Free'], act: { f: 'replaceCardDo', a: {} } } } },
  replaceCardDo: () => { if (St.get().bookings.some(b => b.title === 'Replacement card' && !dead(b) && b.status !== 'delivered')) return { say: 'A replacement is already on its way.', blocks: [] }; const r = St.pay({ id: 'x', cat: 'bank', title: 'Replacement card', sub: 'To your home address', qty: 1, unit: 0, total: 0, kind: 'order', extra: { case: 'replacement', newNumber: St.get().card.frozen }, tracker: { steps: ['Ordered', 'Printed', 'Posted', 'Delivered'], current: 1, eta: '3 to 5 days' } } as any, 0, 0); return { say: St.get().card.frozen ? 'A new card with a new number is on its way to your home address. Your old card stays frozen, so nobody can use it.' : 'A new card with the same number is on its way to your home address. Your current card works until you activate the new one.', blocks: r.ok ? [{ kind: 'tracker', id: r.booking.id }] : [] } },
  /* Card servicing through the bank connection layer. A missing API answers plainly instead of failing. */
  ...Object.fromEntries((['fraudAsk', 'fraudDo', 'hardshipAsk', 'hardshipDo', 'dueDayAsk', 'dueDayDo', 'remSet', 'limAsk', 'limDo', 'blockSet', 'blockDo', 'alertsSet', 'replaceAsk', 'replaceDo', 'activate', 'disputeAsk', 'disputeDo', 'limitRequestAsk', 'limitRequestDo', 'walletAsk', 'walletDo', 'walletRemove', 'setLimit', 'noticeAdd', 'revealDetails', 'revealPin', 'planAsk', 'planDo', 'btAsk', 'btDo', 'holderAsk', 'holderDo', 'ptsPayAsk', 'ptsPayDo', 'sendPtsAsk', 'sendPtsDo', 'missingPtsDo', 'protectAsk', 'protectDo', 'upgradeCardAsk', 'upgradeCardDo', 'holderRemoveAsk', 'holderRemoveDo'] as const).map(k => [k, (a: any) => bankCall(() => (Bk as any)[k](a))])),
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
export const STAY = ['limDo', 'blockDo', 'dueDayDo', 'gamblingOn', 'gamblingKeep', 'gamblingLift', 'ddSet', 'ddOff', 'cardSet', 'limitSet', 'unfreeze', 'payBill', 'replaceCardDo', 'replaceDo', 'activate', 'disputeDo', 'limitRequestDo', 'walletDo', 'walletRemove', 'setLimit', 'noticeAdd', 'revealDetails', 'revealPin']
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
  let art: string | undefined, icon: string | undefined, rows: [string, string][] = [], strip: string | undefined, headline = 'You\'re booked.', link = 'Not now'
  const confirmCta = M.auth === 'faceid' ? 'Confirm with Face ID' : M.auth === 'otp' ? 'Confirm with code' : M.t('payApp')
  const bal = St.get().balance, exp = St.get().expiring || 0
  if (c.kind === 'pay' && open.d?.pointsOnly) {
    const d = open.d
    title = d.title; art = Cat.img(d.img); icon = d.kind === 'donation' ? 'heart' : 'swap'
    summary = d.sub && d.sub !== d.title ? d.sub : ''
    rows = [...((d.detail || []).filter(([k]) => k !== 'Handled by' && !/^Points/.test(k)).slice(0, 1) as [string, string][]), ['Points', M.num(c.choice.pts)], ['Points left after', M.num(Math.max(0, bal - c.choice.pts))]]
    cta = confirmCta; strip = d.kind === 'transfer' ? 'A transfer can\'t be undone once it\'s sent.' : d.kind === 'donation' ? 'A gift to charity can\'t be taken back.' : 'Nothing moves until you confirm.'
    headline = d.kind === 'transfer' ? 'Transfer sent.' : d.kind === 'donation' ? 'Thank you.' : 'Sent to the partner.'; link = 'Not now'
  } else if (c.kind === 'pay') {
    const d = open.d; if (!d) return null
    title = d.title; art = Cat.img(d.img) || D.STAMP[d.cat]; icon = d.icon
    summary = [d.sub && d.sub !== d.title ? d.sub : '', d.when].filter(Boolean).join(' · ')
    const pay = c.choice.card ? (c.choice.pts ? `${M.pts(c.choice.pts)} + ${M.money(c.choice.card, 2)}` : M.money(c.choice.card, 2)) : M.pts(c.choice.pts)
    const third: [string, string] | null = d.policy ? [/refund|cancel/i.test(d.policy) ? 'Cancellation' : 'Good to know', d.policy.replace(/\.$/, '')] : c.choice.card ? ['On your card', `Ending ${St.get().card.last4}`] : d.qty > 1 ? ['For', `${d.qty} ${d.cat === 'flights' ? 'travellers' : 'people'}`] : null
    rows = [['Total', pay], ...(c.choice.pts ? [['Points left after', M.num(Math.max(0, bal - c.choice.pts))] as [string, string]] : []), ...(third ? [third] : [])]
    cta = M.auth === 'otp' ? (c.choice.card ? M.t('confirmWithCode', { amt: M.money(c.choice.card, 2) }) : M.t('confirmPts', { pts: M.pts(c.choice.pts) })) : confirmCta
    if (d.policy && /non-refundable|no refunds?|can.?t be refunded|not refundable/i.test(d.policy)) note = d.policy
    { const dup = ['shopping', 'giftcards', 'quick'].includes(d.cat) ? St.get().bookings.find(b => b.title === d.title && !['cancelled', 'refunded'].includes(b.status) && Date.now() - b.createdAt < 7 * 864e5) : undefined; if (dup) note = `You already ordered this on ${M.date(new Date(dup.createdAt).toISOString().slice(0, 10))} (${dup.ref}). Carry on only if you want another.` }
    strip = (note && note !== d.policy ? note : undefined) || (exp > 0 && c.choice.pts ? `Your ${M.num(Math.min(exp, c.choice.pts))} points expiring on 31 Oct go first.` : c.choice.card ? 'Points are earned on the card part.' : undefined)
    headline = d.kind === 'transfer' ? 'Transfer sent.' : d.kind === 'donation' ? 'Thank you.' : d.kind === 'investment' ? 'Sent to the partner.' : d.extra?.changeFor ? 'Changed.' : d.cat === 'giftcards' ? 'Paid and sent.' : d.kind === 'order' ? 'Ordered.' : d.kind === 'sub' ? 'You\'re subscribed.' : 'You\'re booked.'
    link = 'Change how I pay'
  } else {
    title = c.title; summary = c.summary || ''; lines = c.lines || []; total = c.total || ['', '']; doneTitle = (c as any).doneTitle || 'Done'
    icon = ({ limDo: 'split', blockDo: 'shield', payBill: 'card', unfreeze: 'lock', cardSet: 'card', ddSet: 'refresh', ddOff: 'refresh', limitSet: 'target', gamblingLift: 'shield', replaceDo: 'card', replaceCardDo: 'card', walletDo: 'wallet', limitRequestDo: 'cash', revealDetails: 'eye', revealPin: 'eye', disputeDo: 'doc', manage: 'refresh' } as any)[c.act.f] || 'check'
    art = c.act.f === 'replaceDo' || c.act.f === 'replaceCardDo' ? Cat.img('money:card') : undefined
    rows = [...lines, ...(total[0] ? [total] : [])].slice(0, 4) as [string, string][]
    cta = c.cta || (c.act.f === 'payBill' ? (M.auth === 'otp' ? M.t('confirmWithCode', { amt: total[1] }) : confirmCta) : confirmCta)
    strip = c.act.f === 'payBill' ? undefined : ['limDo', 'blockDo', 'unfreeze', 'cardSet', 'ddSet', 'ddOff', 'limitSet', 'gamblingLift', 'replaceDo', 'replaceCardDo', 'walletDo', 'limitRequestDo'].includes(c.act.f) ? 'This checks it\'s you before anything changes.' : ['revealDetails', 'revealPin'].includes(c.act.f) ? 'Make sure nobody can see your screen.' : c.act.f === 'manage' ? 'Nothing is charged until you confirm.' : undefined
    headline = /[.!]$/.test(doneTitle) ? doneTitle : doneTitle + '.'
  }
  const doneView = () => {
    if (c.kind !== 'pay') return { headline, rows: [] as [string, string][] }
    const d = open!.d!, b = St.get().bookings.find(x => x.title === d.title) || St.get().bookings[0], left = St.get().balance
    return { headline, rows: [...(c.choice.pts ? [['Points spent', M.num(c.choice.pts)], ['Points left', M.num(left)]] as [string, string][] : []), ...(c.choice.card ? [['On your card', M.money(c.choice.card, 2)]] as [string, string][] : []), ...(b ? [['Reference', b.ref]] as [string, string][] : [])].slice(0, 4), line: d.pointsOnly ? 'It\'s in Wallet, with the receipt.' : `I've added it to Wallet${d.cat === 'flights' || d.cat === 'stays' ? ' with the rest of your trip' : ''} and emailed your confirmation.` }
  }
  return <div className="app-sheet" onClick={e => { if (e.target === e.currentTarget) close() }}>
    <div className="app-sheet-in">
      <C.ConfirmSheet key={key} art={art} icon={icon} title={title || 'Confirm'} summary={summary} rows={rows} strip={strip} cta={cta} link={link} attempts={otpFails()} lockedUntil={St.get().seen.otp ? St.get().seen.otp.at + 15 * 6e4 : undefined} onWrong={(n: number) => St.set(s => ({ seen: { ...s.seen, otp: { n, at: Date.now() } } }))} phone={W.__phoneEnd || '21'} validCode="482193" done={doneView} onClose={close}
        onConfirm={() => { if (St.get().seen.otp) St.set(s => ({ seen: { ...s.seen, otp: undefined } }));
          const r = c.kind === 'pay' ? F.confirmPay({ draft: c.draft, choice: c.choice }) : FLOWS[c.act.f](c.act.a || {})
          const failed = c.kind === 'pay' && (r.blocks[0]?.kind === 'state' || !r.blocks.length)
          if (failed) { close(); respond(r); goChat(); return false }
          respond(r); setTimeout(() => { if (liveKey === key) { close(); if (!(onScreen() && c.kind !== 'pay' && STAY.includes(c.act?.f))) goChat() } }, 2400); return true
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
const STAMP_FOR: [RegExp, string][] = [[/\bride|taxi|cab\b|train|transfer/i, 'rides'], [/flight|fly|plane|airport|lounge/i, 'flights'], [/hotel|stay|room|night/i, 'stays'], [/table|restaurant|dinner|lunch|food|eat/i, 'dining'], [/ticket|concert|gig|show|match|cinema|film/i, 'tickets'], [/ride|taxi|cab|car|train|transfer/i, 'rides'], [/gift/i, 'giftcards'], [/subscri|stream|music/i, 'subs'], [/grocer|milk|basket|delivery/i, 'quick'], [/shop|buy|headphone|jacket|order/i, 'shopping'], [/things to do|tour|experience|trip/i, 'experiences']]
export const stampFor = (s: string) => { const k = STAMP_FOR.find(([r]) => r.test(s))?.[1]; return k ? D.STAMP[k] : undefined }
function Sug({ items }: { items: string[] }) { return <C.Next items={items} onPick={(s: string) => sendText(s)} artFor={stampFor} /> }
/** "8,200 points" first, the cash in grey after it. */
export function usePrice() { const M = useMarket(); return (cash: number, unit?: string) => <C.Price pts={M.pts(F.ptsOf(cash))} cash={M.money(cash, cash % 1 ? 2 : 0)} unit={unit} /> }
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
  handoff: ({ reason, team, bk }: any) => { const M = useMarket(); const fraud = team === 'fraud', care = team === 'care'; const name = fraud ? 'Maya' : care ? 'Leila' : 'Priya'; const [used, setUsed] = useDone(bk); const initial = St.get().market === 'AR' ? ({ Maya: 'م', Leila: 'ل', Priya: 'ب' } as any)[name] : name[0]; const role = fraud ? 'fraud team' : care ? 'specialist care team' : 'customer team'; return <div className="ds-bkcard ds-person"><div className="ds-bk-top"><span className="ds-av" aria-hidden="true" data-notr>{initial}</span><span className="ds-coming-b"><span className="ds-coming-t">{M.t('handoffWho', { name, role })}</span><span className="ds-coming-s">{used ? 'Asked for' : 'Usually joins within 2 minutes'}</span><span className="ds-status"><i />{M.t('handoffHas')}</span></span></div><D.AssistantNote>{M.t('handoffNote', { name })}</D.AssistantNote>{!used && <div className="ds-btnrow"><button className="ds-opill primary gr-btn" onClick={() => { setUsed(true); St.pushMsg({ role: 'gr', text: `I've asked ${name} to join. She can see our conversation, so you won't need to repeat anything.` }); setTimeout(() => St.pushMsg({ role: 'gr', text: `${name} has joined. (Demo: in the live app ${name} is a real person who replies here; in this demo, Gratifi carries on.)` }), 6000) }}><Icon name="chat" size={16} stroke={2} />{M.t('chatNow')}</button><button className="ds-opill gr-btn" onClick={() => { setUsed(true); St.pushMsg({ role: 'gr', text: `${name} will call you in the next few minutes on your registered number.` }) }}><Icon name="phone" size={16} stroke={2} />{M.t('callMe')}</button></div>}</div> },
  offers: () => <OfferList />,

  /* flights */
  flights: (p: any) => <FlightsBlock {...p} />,
  fares: (p: any) => <FaresBlock {...p} />,
  seats: (p: any) => <SeatsBlock {...p} />,
  extras: (p: any) => <ExtrasBlock {...p} />,
  disputepick: (p: any) => <DisputePickBlock {...p} />,
  planpick: (p: any) => <PlanPickBlock {...p} />,
  btform: (p: any) => <BTFormBlock {...p} />,
  holderform: (p: any) => <HolderFormBlock {...p} />,
  ptspay: (p: any) => <PtsPayBlock {...p} />,
  ptssend: (p: any) => <SendPtsBlock {...p} />,
  ptsclaim: (p: any) => <PtsClaimBlock {...p} />,
  protect: (p: any) => <ProtectBlock {...p} />,
  cardswitch: (p: any) => <CardSwitchBlock {...p} />,
  holderremove: (p: any) => <HolderRemoveBlock {...p} />,
  namefix: (p: any) => <NameFixBlock {...p} />,
  lostbag: (p: any) => <LostBagBlock {...p} />,
  checkin: (p: any) => <CheckInBlock {...p} />,
  triptl: (p: any) => <TripTimelineBlock {...p} />,
  upgrade: (p: any) => <UpgradeBlock {...p} />,
  addbags: (p: any) => <AddBagsBlock {...p} />,
  seatchange: (p: any) => <SeatChange {...p} />,
  calendar: ({ city, pax }) => <CalendarBlock city={city} pax={pax} />,

  /* items */
  items: (p: any) => <ItemsBlock {...p} />,
  detail: (p: any) => <DetailBlock {...p} />,
  grocery: () => <GroceryBlock />,
  checkout: (p: any) => <CheckoutBlock {...p} />,
  freeconfirm: (p: any) => <FreeConfirm {...p} />,

  /* after buying */
  receipt: (p: any) => <ReceiptBlock {...p} />,
  booking: ({ id, inline }) => <BookingCard id={id} inline={inline} />,
  confirmcancel: (p) => <ConfirmCancel {...p} />,
  tracker: ({ id }) => { const b = St.useS(s => s.bookings.find(x => x.id === id)); if (!b?.tracker) return null; if (dead(b) && b.kind !== 'claim') return <BookingCard id={id} />; const live = !dead(b) && b.tracker.current < b.tracker.steps.length - 1; const canCancel = (live && b.kind === 'order' && b.cat !== 'bank' && !b.extra?.returning && !b.extra?.at) || (live && b.cat === 'rides'); return <D.Track title={b.title} sub={`${b.sub ? b.sub + ' · ' : ''}${b.ref}`} steps={b.tracker.steps} current={b.status === 'delivered' || b.status === 'done' || b.tracker.eta === 'Done' ? b.tracker.steps.length : b.tracker.current} eta={dead(b) ? 'Refunded' : b.tracker.eta} tone={b.tracker.tone === 'warn' || b.tracker.tone === 'danger' ? 'warn' : undefined}>{canCancel && <div className="ds-btnrow"><button className="ds-opill gr-btn" onClick={() => run({ f: 'manage', a: { id, action: 'cancel' } }, `Cancel ${b.title}`)}>Cancel</button></div>}</D.Track> },
  pass: ({ id }) => <PassFor id={id} />,
  emergency: ({ num, title, body }: any) => <div className="gr-card" style={{ gap: 10 }} role="region" aria-label="Help now"><div className="gr-heading">{title}</div>{body && <div className="gr-meta">{body}</div>}<a className="gr-btn gr-btn-primary gr-btn-block" href={`tel:${num}`} role="button">{`Call ${num} now`}</a></div>,
  crisis: ({ urgent, other, emerg }: any) => { const M = useMarket(); const k = M.id === 'AR' ? 'AE' : M.id; const [name, num] = F.HELP[k]; const em = k === 'AE' ? '998' : F.EMERG[k]; const hour = +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(new Date()) % 24, closed = k === 'AE' && (hour < 8 || hour >= 20); const first = !!urgent || closed
    const help = <a className={`gr-btn ${first ? 'gr-btn-secondary' : 'gr-btn-primary'} gr-btn-block`} href={`tel:${num.replace(/[^0-9]/g, '')}`} role="button">{closed ? `${name.charAt(0).toUpperCase() + name.slice(1)}: opens 8am, ${num}` : `Call ${name}, ${num}`}</a>
    const emb = <a className={`gr-btn ${first ? 'gr-btn-primary' : 'gr-btn-secondary'} gr-btn-block`} href={`tel:${em}`} role="button">{first ? `Call ${em} now` : `In danger now? Call ${em}`}</a>
    return <div className="gr-card" style={{ gap: 10 }} role="region" aria-label="Help now"><div className="gr-heading">{urgent === 'medical' ? (other ? `Call ${em} for them now` : `Call ${em} now`) : first ? (other ? `If they're in danger, call ${em} now` : `If you're in danger, call ${em} now`) : `Talk to ${name} now`}</div><div className="gr-meta">{urgent === 'medical' ? (emerg ? (other ? 'Stay with them. The call handler will guide you until help arrives.' : 'Open the front door if you can, and stay where you are. The call handler will guide you.') : other ? 'Even if they seem all right. Take the packet or bottle with you if you can.' : 'Even if you feel all right. Take the packet or bottle with you if you can.') : closed ? `${name.charAt(0).toUpperCase() + name.slice(1)} is free and opens at 8am. Emergency help is there all night.` : ['SG', 'MY'].includes(k) ? `${name} is open all day and night.` : k === 'AE' ? (first ? 'The support line is free to call, from 8am to 8pm.' : 'Free to call, from 8am to 8pm.') : `${name} is free to call, all day and night.`}</div>{first ? <>{emb}{!other && help}</> : <>{help}{emb}</>}</div> },
  insurefacts: ({ id, bk }: any) => { const M = useMarket(); const p = Cat.insurance(M.id, (n: number) => M.money(n)).find(x => x.id === id)!; const single = /^Single/.test(p.name), regions = ['UK', 'EU'].includes(M.id) ? ['Europe', 'Worldwide'] : ['AE', 'AR'].includes(M.id) ? ['Middle East', 'Worldwide'] : ['Asia', 'Worldwide']; const [c, setC] = useState([false, false, false]); const trip = F.tripDates(); const [start, setStart0] = usePS(bk, 'start', trip?.in || F.iso(F.nextFriday())); const [end, setEnd] = usePS(bk, 'end', trip?.out || F.addDays(trip?.in || F.iso(F.nextFriday()), 7)); const [reg, setReg] = usePS(bk, 'reg', regions[0]); const setStart = (d: string) => { setStart0(d); if (end <= d || end > F.addDays(d, 30)) setEnd(F.addDays(d, 7)) }; const base = F.P(p.gbp * F.local('docs')), price = single && reg === 'Worldwide' ? Math.round(base * 1.6 * 100) / 100 : base; const [done, setDone] = useDone(bk); const tog = (i: number) => setC(c.map((x, k) => (k === i ? !x : x)))
    return <C.Detail art={Cat.img(/Annual/.test(p.name) ? 'money:insyear' : /Plus/.test(p.name) ? 'money:insmax' : 'money:insplus')} title={p.name} price={<C.Price pts={M.pts(F.ptsOf(price))} cash={M.money(price, 2)} />} sub="Travel insurance" checks={p.covered} cta={`Continue, ${M.money(price, 2)}`} done={done ? 'Cover chosen' : undefined} disabled={!c.every(Boolean) || done} onCta={() => { setDone(true); const d = St.draft({ cat: 'docs', title: p.name, sub: 'Travel insurance', qty: 1, unit: price, total: price, icon: 'shield', img: 'money:insurance', policy: '14-day cooling-off period; full refund if no trip has started', refundable: true, kind: 'booking', detail: [['Cover', p.name], ['Starts', M.date(start)], ...(single ? [['Ends', M.date(end)], ['Where', reg]] as [string, string][] : []), ['Excess', p.excess]], extra: { date: start } }); respond({ say: '', blocks: [{ kind: 'checkout', draft: d }] }) }}>
      <D.KV rows={[...p.notCovered.map((x: string) => ({ label: 'Not covered', value: x })), { label: 'Excess per claim', value: p.excess }, { label: 'Cooling-off', value: '14 days' }, { label: 'Insurer', value: 'Shoreline Insurance' }]} />
      <C.Opt label="Cover starts"><DayChips from={F.iso(new Date())} n={90} value={start} onChange={setStart} /></C.Opt>{single && <><C.Opt label="Cover ends (up to 31 days)"><DayChips from={F.addDays(start, 1)} n={30} value={end} onChange={setEnd} /></C.Opt><C.Opt label="Where you're going" id={'rg-' + id}><D.Seg items={regions} value={reg} onChange={setReg} /></C.Opt>{reg === 'Worldwide' && <span className="ds-row-s">Worldwide cover costs more because medical care can cost more.</span>}</>}
      <C.Opt label="Three quick checks"><div className="ds-list ds-inset">{[`I live in ${({ UK: 'the UK', EU: 'Ireland', IN: 'India', AE: 'the UAE', AR: 'the UAE', SG: 'Singapore', MY: 'Malaysia' } as any)[M.id]} and I'm under 70`, 'I have no medical conditions to declare, or I will call the insurer to declare them before I travel', 'I\'ve read the key facts and this cover meets my needs'].map((t, i) => <D.ToggleRow key={i} title={t} on={c[i]} onChange={() => tog(i)} />)}</div></C.Opt>
    </C.Detail> },
  member: ({ id, pts, bk }: any) => { const [v, setV] = useState(''); const [done, setDone] = useDone(bk); const M = useMarket(); const p = Cat.PROGRAMMES.find(x => x.id === id)!; const ok = /^[A-Za-z0-9]{6,12}$/.test(v.trim()); return <C.Detail art={Cat.img(/Stayvale/.test(p.name) ? 'money:hotelpts' : 'money:miles')} title={`Transfer to ${p.name}`} price={<C.Price pts={M.pts(pts)} />} sub={p.rate} checks={[p.eta, 'A transfer can\'t be undone once sent']} cta="Continue" done={done ? 'Membership number added' : undefined} disabled={!ok || done} onCta={() => { setDone(true); run({ f: 'transferDo', a: { id, pts, member: v.trim() } }, `Membership number ending ${v.trim().slice(-4)}`) }}><C.Opt label="Membership number"><input className="app-in" inputMode="text" autoComplete="off" placeholder={`${p.name} number`} aria-label={`${p.name} membership number`} value={v} disabled={done} onChange={e => setV(e.target.value)} />{v && !ok && <span className="ds-row-s">Membership numbers are 6 to 12 letters or digits.</span>}</C.Opt></C.Detail> },
  affiliate: ({ id, bk }: any) => { const [done, setDone] = useDone(bk); return done ? <p className="ds-quiet">Purchase tracked.</p> : <div className="ds-btnrow"><button className="ds-opill gr-btn" onClick={() => { setDone(true); run({ f: 'affiliateBuy', a: { id } }, 'I bought something there') }}>I bought something there (demo)</button></div> },
  return: ({ id }) => <ReturnBlock id={id} />,
  changeflight: (p: any) => <ChangeFlight {...p} />,
  claimform: (p: any) => <ClaimForm {...p} />,
  disruption: ({ id, bk }) => <Disruption id={id} bk={bk} />,

  /* bank */
  balance: () => { const c = St.useS(s => s.card); const M = useMarket(); return <D.CardFace last4={c.last4} balance={M.money(Math.abs(c.balance), 2)} balLabel={c.balance < 0 ? 'In credit' : 'Balance'} available={M.money(Math.max(0, c.limit - c.balance))} limit={M.money(c.limit)} used={c.limit ? c.balance / c.limit : 0} frozen={c.frozen} dueLine={c.due > 0 ? `Due ${M.date(c.dueDate)} · ${M.money(c.due, 2)}` : 'Nothing to pay now'} freezeLabel={c.frozen ? 'Unfreeze' : 'Freeze'} onFreeze={Mod.on('card.controls') ? () => respond(c.frozen ? F.unfreezeAsk({}) : F.cardControl({ control: 'freeze', on: true })) : undefined} onPay={Mod.on('card.pay') && c.due > 0 ? () => W.__go?.('cardx', 'pay') : undefined} /> },
  gambling: () => <GamblingRow />,
  directdebit: () => <DirectDebitRow />,
  controls: ({ open }: any) => { const c = St.useS(s => s.card) as any; St.useS(s => s.seen.ctl); const M = useMarket(); const set = (k: string, v: boolean) => { if (k === 'frozen' && !v) { respond(F.unfreezeAsk({})); return } if (k !== 'frozen' && v) { respond(F.cardControl({ control: k, on: true })); return } if (k === 'frozen') { St.set(s => ({ card: { ...s.card, frozen: true } })); St.pushMsg({ role: 'gr', text: 'Frozen. New payments are blocked; direct debits and refunds still work.' }); return } respond(F.cardControl({ control: k, on: false })) }
    const ct = Mod.apiOn('cards.controls') ? Bk.ctl() : null, lim = (k: Bk.LimKey) => run({ f: 'ctlLimitStart', a: k }, Bk.limName(k))
    return <><D.List><D.ToggleRow title="Freeze card" sub={c.frozen ? 'The switches below are paused while it\'s frozen' : undefined} on={c.frozen} onChange={(v: boolean) => set('frozen', v)} />
      {open !== 'limits' && <><D.ToggleRow title="Domestic payments" on={c.domestic !== false} dim={c.frozen} onChange={(v: boolean) => set('domestic', v)} /><D.ToggleRow title="International payments" on={c.abroad} dim={c.frozen} onChange={(v: boolean) => set('abroad', v)} /><D.ToggleRow title="Online payments" on={c.online} dim={c.frozen} onChange={(v: boolean) => set('online', v)} /><D.ToggleRow title="In store" on={c.instore !== false} dim={c.frozen} onChange={(v: boolean) => set('instore', v)} /><D.ToggleRow title="Contactless" on={c.contactless} dim={c.frozen} onChange={(v: boolean) => set('contactless', v)} /><D.ToggleRow title="Cash withdrawals" on={c.atm} dim={c.frozen} onChange={(v: boolean) => set('atm', v)} /></>}
      {open === 'limits' && ct && <><D.Row title="Monthly spending" value={ct.month ? M.money(ct.month) : 'No limit'} chev onClick={() => lim({ key: 'month' })} /><D.Row title="Each payment" value={ct.txn ? M.money(ct.txn) : 'No limit'} chev onClick={() => lim({ key: 'txn' })} />{Bk.CHS.map(ch => <D.Row key={ch} title={Bk.CH_NAME[ch]} value={`${M.money(ct.daily.home[ch])}${ch === 'contactless' ? ' a payment' : ' a day'}`} chev onClick={() => lim({ key: 'daily', ch, where: 'home' })} />)}</>}
    </D.List>{Mod.on('card.gambling') && open !== 'limits' && <GamblingRow />}{ct && <div className="ds-btnrow"><D.Pill onClick={() => W.__go?.('cardx', 'controls')}>All card controls</D.Pill></div>}</> },
  ctllimit: (p: any) => <CtlLimitBlock {...p} />,
  fraudpick: (p: any) => <FraudPickBlock {...p} />,
  pickone: (p: any) => <PickOneBlock {...p} />, visaform: (p: any) => <VisaFormBlock {...p} />, insclaim: (p: any) => <InsClaimBlock {...p} />,
  ticketsend: (p: any) => <TicketSendBlock {...p} />, showchange: (p: any) => <ShowChangeBlock {...p} />,
  staychange: (p: any) => <StayChangeBlock {...p} />, stayextras: (p: any) => <StayExtrasBlock {...p} />, msgplace: (p: any) => <MsgPlaceBlock {...p} />, tablechange: (p: any) => <TableChangeBlock {...p} />, tourchange: (p: any) => <TourChangeBlock {...p} />,
  hardship: (p: any) => <HardshipBlock {...p} />,
  dueday: (p: any) => <DueDayBlock {...p} />,
  statement: () => { const c = St.useS(s => s.card); const M = useMarket(); const st = Mod.on('card.statements') ? Bk.statements()[0] : null; return <><D.KV rows={[{ label: 'Statement balance', value: M.money(c.due, 2) }, { label: 'Minimum payment', value: M.money(c.min, 2) }, { label: 'Payment due', value: M.date(c.dueDate, 'day') }, ...(st ? [{ label: 'Purchases this statement', value: M.money(st.purchases, 2) }] : [])]} />{st && <div className="ds-btnrow"><D.Pill onClick={() => W.__go?.('cardx', 'statement:' + st.id)}>Open statement</D.Pill></div>}</> },
  spend: () => { const all = St.useS(s => s.txns); const M = useMarket(); const since = Date.now() - 30 * 864e5, by: Record<string, number> = {}; all.filter(t => t.at >= since && t.cat !== 'Payment').forEach(t => { by[t.cat] = (by[t.cat] || 0) + (t.refund ? -t.amount : t.amount) }); const items = Object.entries(by).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]); const tot = items.reduce((s, [, v]) => s + v, 0); return <><D.SpendBars period="Last 30 days" items={items.slice(0, 5).map(([label, amount]) => ({ label, amount }))} total={tot} format={(n: number) => M.money(n, n % 1 ? 2 : 0)} />{Mod.on('card.transactions') && <div className="ds-btnrow"><D.Pill onClick={() => W.__go?.('cardx', 'txns')}>See every payment</D.Pill></div>}</> },
  txns: ({ cat }: any) => { const tx = St.useS(s => s.txns.filter(t => !cat || t.cat === cat).slice(0, 5)); const M = useMarket(); return <D.List>{tx.map(t => <D.Txn key={t.id} cat={t.cat} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={Mod.on('card.transactions') ? () => W.__go?.('cardx', 'txn:' + t.id) : undefined} />)}</D.List> },
  paybill: ({ pick }: any) => <PayBill pick={pick} />,
  alertcard: ({ k }: any) => { const on = St.useS(s => !!s.seen[k]); const w = String(k).slice(6); return <D.List><div className="ds-row"><span className="ds-row-ic"><Icon name="bell" size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{w.charAt(0).toUpperCase() + w.slice(1)}</span><span className="ds-row-s">{on ? 'Alert on' : 'Alert removed'}</span></span>{on && <D.Pill onClick={() => St.set(x => ({ seen: { ...x.seen, [k]: false } }))}>Remove</D.Pill>}</div></D.List> },
  benefits: () => { const left = St.useS(s => s.loungeLeft); const top = Cat.BENEFITS.filter(b => ['BE-1', 'BE-2', 'BE-4'].includes(b.id)); const SH: Record<string, string> = { 'BE-1': 'Free visits this year', 'BE-2': '120 days on what you buy', 'BE-4': 'When the trip is on the card' }; return <><D.Included items={top.map(b => ({ key: b.id, icon: b.icon, title: b.name, sub: SH[b.id], meta: b.key === 'lounge' ? `${left} left` : undefined, onClick: () => run(b.key === 'lounge' ? { f: 'search', a: { cat: 'airport' } } : b.id === 'BE-4' ? { f: 'docs', a: { topic: 'insurance' } } : { f: 'myStuff', a: {} }, b.name) }))} /><div className="ds-btnrow"><D.Pill onClick={() => W.__go?.('cardx', 'benefits')}>{`See all ${Cat.BENEFITS.length}`}</D.Pill></div></> },
  points: ({ noPending }: any) => { const s = St.useS(x => x); const M = useMarket(); return <div className="gr-col" style={{ gap: 12 }}><D.PointsCard tier={W.__tierName || 'Gold'} value={M.num(s.balance)} useLabel="Use points" onUse={() => W.__go?.('explore')} />{s.expiring > 0 && <D.CreamRow>{`${M.num(s.expiring)} points expire on 31 Oct`}</D.CreamRow>}<D.KV rows={[{ label: 'Worth about', value: M.money(s.balance * St.rate()) }, ...(noPending ? [] : s.pending || []).map(p => ({ label: p.label, value: 'Pending' })), ...s.ledger.slice(0, 6).map(l => ({ label: l.label.replace(/^Balance brought forward$/, 'Points from before'), value: <span className={l.pts > 0 ? 'ds-good' : undefined}>{`${l.pts > 0 ? '+' : ''}${M.num(l.pts)}`}</span> }))]} /></div> },
  programmes: ({ pts }: any) => <Programmes pts={pts} />,
  invest: (p: any) => <InvestBlock {...p} />,
  charities: ({ pts }: any) => <Charities pts={pts} />,
  visa: ({ city }) => <VisaBlock city={city} />,
  insurance: () => { const M = useMarket(); return <C.Offers title="Travel cover" items={[{ key: 'inc', art: Cat.img('money:insurance'), title: 'Cover with your card', sub: 'When the trip is paid with the card: medical, cancellation, lost bags', status: 'Free' }, ...Cat.insurance(M.id, (n: number) => M.money(n)).map((p, k) => { const price = F.P(p.gbp * F.local('docs')); const go = () => respond({ say: `The ${p.name} cover: what it includes, and three quick checks.`, blocks: [{ kind: 'insurefacts', id: p.id }] }); return { key: p.id, art: Cat.img(['money:insplus', 'money:insmax', 'money:insyear'][k] || 'money:insplus'), title: p.name, sub: p.covered[0], price: <C.Price pts={M.pts(F.ptsOf(price))} cash={M.money(price, 2)} />, action: 'Choose', onAction: go, onOpen: go, primary: false } })]} /> },
  esim: () => { const M = useMarket(); return <C.Offers title="Data abroad" items={Cat.ESIM.map(e => { const price = F.P(e.gbp * F.local('docs')); const buy = () => { const d = St.draft({ cat: 'docs', title: `eSIM ${e.title}`, qty: 1, unit: price, total: price, icon: 'wifi', img: 'money:esim', policy: 'Refundable until installed', refundable: true, kind: 'order', detail: [['Plan', e.title], ['Delivery', 'A QR code by email and in Wallet']] }); respond({ say: '', blocks: [{ kind: 'checkout', draft: d }] }) }; return { key: e.id, art: Cat.img('money:esim'), title: `eSIM: ${e.title}`, sub: 'Works in 120+ countries', price: <C.Price pts={M.pts(F.ptsOf(price))} cash={M.money(price, 2)} />, action: 'Buy', onAction: buy, onOpen: buy, primary: false } })} /> },
  essentials: () => <Sug items={['Do I need a visa?', 'Travel insurance', 'eSIM for data abroad', 'Using my card abroad']} />,
  conciergeform: (p: any) => <ConciergeForm {...p} />,
  challenges: () => { const ch = St.useS(s => s.challenges); const M = useMarket(); return <D.Challenges items={ch.map(c => ({ key: c.id, icon: ({ 'CHL-1': 'fork', 'CHL-2': 'target', 'CHL-3': 'plane' } as any)[c.id], title: c.id === 'CHL-3' ? `Spend ${M.money(c.target)} on travel before 31 Oct` : c.title, reward: c.reward, progress: c.progress, target: c.target, progressText: c.done ? 'Done' : c.unit === 'money' ? `${M.money(Math.round(c.progress))} of ${M.money(c.target)}` : `${Math.round(c.progress)} of ${c.target}`, joined: c.joined, onJoin: () => { St.set(s => ({ challenges: s.challenges.map(x => (x.id === c.id ? { ...x, joined: true } : x)) })); St.pushMsg({ role: 'gr', text: `You're in: ${c.title}.` }) } }))} /> },
}

/* ---------- blocks with their own state ---------- */
function FlightsBlock({ back, pax, ids, best, kids, inf, backCity }: any) {
  const M = useMarket(); const price = usePrice()
  const opts = (ids.map((i: string) => F.flightById(i)).filter(Boolean) as Cat.FlightOpt[]).sort((a, b) => Number(b.id === best) - Number(a.id === best))
  if (!opts.length) return <C.StateNote title="No flights match" body="Try all flights or another day." />
  const go = (o: Cat.FlightOpt) => run({ f: 'chooseFlight', a: { id: o.id, pax, back, kids, inf, backCity } }, `The ${o.dep} ${Cat.AIRLINES[o.airline]}`)
  const [o0, ...rest] = opts
  const row = (o: Cat.FlightOpt, i: number): C.ResultItem => ({ key: o.id, cls: 'ds-fl', art: Cat.img(i ? 'tail:' + o.airline : 'fly:' + o.city), tag: o.id === best ? 'Best match' : 'Earliest', title: `${o.dep}–${o.arr}${o.plus ? ' +1' : ''} · ${o.stops ? `1 stop, ${o.via}` : 'Direct'}`, meta: [Cat.AIRLINES[o.airline], o.dur, o.bag === 'Small bag only' ? 'Small bag only' : '', o.left ? `${o.left} seats left` : ''], price: price(o.price), cta: 'Book', onOpen: () => go(o) })
  return <C.Results items={[o0, ...[...rest].sort((x, y) => x.dep.localeCompare(y.dep))].map(row)} count={`${opts.length} flight${opts.length > 1 ? 's' : ''} · one way, per person`} filters={['Direct only', 'Morning', 'Evening', 'Cheaper dates', 'Watch price']} onFilter={(f: string) => f === 'Watch price' ? run({ f: 'priceWatch', a: { city: o0.city, date: o0.date, back, pax } }, 'Watch the price') : sendText(f === 'Direct only' ? 'Only direct' : f === 'Cheaper dates' ? 'Cheaper dates?' : `${f} flights`)} />
}
function ItemsBlock({ ids, pax, time, date, nights, rooms, room }: any) {
  const M = useMarket(); const price0 = usePrice(); const seen = St.useS(s => s.bookings)
  const items = ids.map((i: string) => F.findItem(i)).filter(Boolean) as Cat.Item[]
  if (!items.length) return null
  const stayP = (i: Cat.Item) => F.stayPrice(i, room || '', nights || 2) * (rooms || 1)
  const open = (i: Cat.Item) => run({ f: 'showItem', a: { id: i.id, pax, time, date, nights, rooms } }, i.title)
  const cash = (i: Cat.Item) => i.cat === 'giftcards' || i.mode === 'link' ? undefined : i.included && i.cat === 'airport' && St.get().loungeLeft ? 0 : i.cat === 'stays' ? stayP(i) : F.IP(i)
  const unit = (i: Cat.Item) => i.cat === 'stays' ? `${nights || 2} night${(nights || 2) > 1 ? 's' : ''}${rooms > 1 ? `, ${rooms} rooms` : ''}` : i.cat === 'dining' ? undefined : i.unit
  const price = (i: Cat.Item) => { const c = cash(i); if (i.cat === 'giftcards') return <C.Price pts={`From ${M.pts(F.ptsOf(+F.giftAmounts()[0]))}`} cash={M.money(+F.giftAmounts()[0])} />; if (i.mode === 'link') return <C.Price text={i.earn} />; if (i.included && i.cat === 'subs') return <C.Price free="Included" />; if (i.cat === 'dining') return <C.Price text={i.earn || 'Free to book'} />; if (c === 0) return <C.Price free={M.t('free')} unit={i.cat === 'airport' ? 'with your card' : undefined} />; if (c == null) return null; return price0(c, unit(i)) }
  const meta = (i: Cat.Item) => [i.rating ? `★ ${i.rating}` : '', i.cat === 'dining' ? i.sub?.split(' · ')[0] : i.sub, ...((i.meta || []).slice(0, 1))]
  const art = (i: Cat.Item) => Cat.img(i.img) || D.STAMP[i.cat]
  const cat = items[0].cat
  /* subscriptions and travel extras read as the Offers list; gift cards and shopping as Rewards tiles; the rest as Hotels */
  if (cat === 'subs' || cat === 'airport') return <C.Offers items={items.map(i => { const own = seen.find(b => b.itemId === i.id && ['active', 'paused', 'confirmed'].includes(b.status)); return { key: i.id, art: art(i), title: i.title, sub: i.cat === 'subs' ? i.sub : (i.meta?.[0] || i.sub), price: price(i), onOpen: () => open(i), action: own && i.cat === 'subs' ? undefined : i.included ? (i.cat === 'subs' ? 'Turn on' : 'Use') : i.cat === 'subs' ? 'Add' : 'Book', onAction: () => open(i), status: own && i.cat === 'subs' ? (own.status === 'paused' ? 'Paused' : 'Added') : undefined, primary: true } })} />
  if (cat === 'giftcards' || (cat === 'shopping' && items.length > 3)) return <C.Grid items={items.map(i => ({ key: i.id, art: art(i), title: i.title, price: price(i), cta: i.cat === 'giftcards' ? 'Buy' : i.mode === 'link' ? 'Shop' : 'View', onOpen: () => open(i) }))} />
  return <C.Results items={items.map(i => ({ key: i.id, art: art(i), title: i.title, meta: meta(i), price: price(i), cta: i.cat === 'shopping' ? 'View' : i.cat === 'rides' ? 'Choose' : 'Book', onOpen: () => open(i) }))} />
}
function StateWrap({ state, title, body, was, now, actions = [], bk }: any) {
  const [used0, setUsed0] = useState(''); const u = St.useS(s => (bk ? s.seen['usedv:' + bk] : '')) as any; const used = used0 || u || ''; const setUsed = (v: string) => { setUsed0(v); if (bk) St.set(s => ({ seen: { ...s.seen, ['usedv:' + bk]: v as any } })) }
  const refId = actions.map((a: any) => a.act?.a?.id).find(Boolean); const gone = St.useS(s => { const x = refId && s.bookings.find(y => y.id === refId); return !!x && (dead(x) || x.status === 'delivered' || !!x.extra?.rebooked) })
  return <C.StateNote title={title} body={body} was={was} now={now} actions={actions} used={used} gone={gone} onAct={(i: number) => { const a = actions[i]; if (a.act?.f !== 'open') setUsed(a.label); run(a.act, a.label) }} />
}
function VisaBlock({ city }: { city: string }) {
  const M = useMarket(); const c = Cat.dests(M.id).find(x => x.name === city)!; const dom = c.country === Cat.home(M.id).country; const [set, setSet] = useState(false)
  return <C.Detail art={Cat.img('money:visa')} title={dom ? `${c.name}: no visa needed` : `${c.country}: check before you book`} checks={dom ? ['It\'s a domestic trip', 'Carry the photo ID your airline accepts'] : ['Most visitors need a passport valid for at least 6 months', 'Some passports need an e-visa or travel authorisation before flying']} note={dom ? undefined : { title: 'Check before you fly', body: 'Rules change. Confirm on the government\'s own site for your passport before you book.' }} cta="Remind me about my passport" done={set ? 'Reminder set' : undefined} disabled={set} onCta={() => { setSet(true); run({ f: 'alertSet', a: { what: 'if your passport needs renewing, 60 days before any trip' } }) }} >{!dom && <div className="ds-btnrow"><D.Pill onClick={() => run({ f: 'visaHelp', a: { city } }, 'Get help applying')}>Get help applying</D.Pill></div>}</C.Detail>
}
function Programmes({ pts }: { pts?: number }) {
  const bal = St.useS(s => s.balance); const M = useMarket()
  const opts = [...new Set([1000, 5000, 10000, 20000, ...(pts && pts <= bal ? [pts] : [])])].filter(x => x <= bal).sort((a, b) => a - b)
  const [n, setN] = useState(pts && pts <= bal ? pts : opts.includes(10000) ? 10000 : opts[opts.length - 1] || 1000)
  return <div className="gr-col" style={{ gap: 12 }}>
    {opts.length > 1 && <C.Opt label="How many points"><div className="app-days ds-count" role="radiogroup" aria-label="How many points">{opts.map(x => <button key={x} className="gr-slot" role="radio" aria-checked={n === x} onClick={() => setN(x)}>{M.num(x)}</button>)}</div></C.Opt>}
    <C.Offers title={`Transfer ${M.pts(n)}`} items={Cat.PROGRAMMES.map(p => ({ key: p.id, art: Cat.img(/Stayvale/.test(p.name) ? 'money:hotelpts' : 'money:miles'), title: p.name, sub: `${M.num(Math.round(n * p.ratio))} ${/Stayvale/.test(p.name) ? 'hotel points' : 'miles'} · ${p.eta.toLowerCase()}`, action: 'Transfer', onAction: () => run({ f: 'transferDo', a: { id: p.id, pts: n } }, `Transfer ${M.num(n)} points to ${p.name}`), primary: false }))} />
  </div>
}
function Charities({ pts }: { pts?: number }) {
  const M = useMarket(); const bal = St.useS(s => s.balance); const opts = [500, 1000, 2500, 5000]; const [n, setN] = useState(pts && pts <= bal ? pts : 1000)
  return <div className="gr-col" style={{ gap: 12 }}>
    <C.Opt label={`How many points · ${M.num(n)} = ${M.money(n * St.rate(), (n * St.rate()) % 1 ? 2 : 0)} to the charity`}><div className="app-days ds-count" role="radiogroup" aria-label="How many points">{[...new Set([...opts, n])].sort((a, b) => a - b).map(x => <button key={x} className="gr-slot" role="radio" aria-checked={n === x} onClick={() => setN(x)}>{M.num(x)}</button>)}</div></C.Opt>
    {Cat.CHARITIES.map(c => <div key={c.id} className="ds-give"><img src={Cat.img(c.img)} alt="" /><div className="ds-give-b"><span className="ds-coming-t">{c.name}</span><span className="ds-coming-s">{c.cause}</span><D.Bar used={c.raised / c.goal} thin tone="black" label={`${Math.round(c.raised / c.goal * 100)}% of the goal`} /><span className="ds-row-s">{`${Math.round(c.raised / c.goal * 100)}% of the goal raised`}</span></div><button className="ds-opill primary gr-btn" onClick={() => bal >= n ? run({ f: 'donate', a: { id: c.id, pts: n } }, `Give ${M.num(n)} points to ${c.name}`) : St.pushMsg({ role: 'gr', text: `You have ${M.pts(bal)}, which isn't enough for that gift.` })}>Give</button></div>)}
  </div>
}
function FaresBlock({ id, pax, back, bk, kids = 0, inf = 0, backCity }: any) {
  const M = useMarket(); const price = usePrice(); const [v, setV] = usePS(bk, 'fare', 'std'); const [done, setDone] = useDone(bk)
  const backs = back ? F.backOptions(id, back, backCity).slice(0, 4).sort((x, y) => x.dep.localeCompare(y.dep)) : []; const [bid, setBid] = usePS<string | undefined>(bk, 'back', back ? F.fareQuote(id, 'std', back, undefined, backCity).backF?.id : undefined)
  const q = (fare: string) => F.fareQuote(id, fare, back, bid, backCity)
  const s = q('std'), f = s.f
  const name = (x: string) => (x === 'std' ? 'Standard' : x === 'flex' ? 'Flex' : 'Light')
  const late = new Date(f.date + 'T' + f.dep + ':00').getTime() - Date.now() < 864e5
  const fares = [{ id: 'light', sub: 'Small bag only', inc: ['A small bag under the seat', 'Seats given at check-in', 'No changes or refunds'] }, { id: 'std', sub: 'Cabin bag, seat, free date change', pop: true, inc: ['A small bag and a cabin bag', 'Choose a standard seat', 'Change the date for free'] }, { id: 'flex', sub: 'Checked bag, any seat, refundable', inc: ['A cabin bag and a checked bag', 'Any seat, extra legroom included', late ? 'Refund less 30%' : 'Full refund up to 24 hours before', 'Fast track at security'] }]
  const leg = (x: Cat.FlightOpt, out: boolean) => <div className="ds-leg" key={x.id}><span className="ds-row-ic"><Icon name={out ? 'takeoff' : 'landing'} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{`${x.dep}–${x.arr}${x.plus ? ' +1' : ''} · ${x.from} to ${x.to}`}</span><span className="ds-row-s">{`${M.date(x.date)} · ${x.stops ? `1 stop, ${x.via}` : 'Direct'} · ${x.dur} · ${Cat.AIRLINES[x.airline]}`}</span></span></div>
  const tot = q(v).each * pax + F.infantFare(q(v).each) * inf
  return <fieldset className="app-fs" disabled={done}><C.Detail art={Cat.img('fly:' + f.city)} title={`${Cat.home(M.id).city} to ${f.city}`} price={price(q(v).each, `per person${s.backF ? (backCity ? `, home from ${backCity}` : ', both ways') : ''}`)} checks={fares.find(x => x.id === v)!.inc}
    cta={`Continue with ${name(v)}`} done={done ? `${name(v)} fare chosen` : undefined} disabled={done} onCta={() => { setDone(true); run({ f: 'chooseFare', a: { id, fare: v, pax, back, backId: bid, kids, inf, backCity } }, `${name(v)} fare`) }}
    caption={pax > 1 || inf ? `${pax} traveller${pax > 1 ? 's' : ''}${inf ? ` and ${inf} infant${inf > 1 ? 's' : ''} on a lap` : ''}: ${M.pts(F.ptsOf(tot))} or ${M.money(tot)} in total` : undefined}>
    <div className="ds-legs">{leg(f, true)}{s.backF && leg(s.backF, false)}</div>
    {backs.length > 1 && <C.Opt label={backCity ? `Home from ${backCity} on ${M.date(back!)}` : `Return on ${M.date(back!)}`} id={'rt-' + id}><div className="gr-slots" role="radiogroup" aria-labelledby={'rt-' + id}>{backs.map(o => <button key={o.id} className="gr-slot" role="radio" aria-checked={bid === o.id} onClick={() => setBid(o.id)}>{`${o.dep} · ${o.stops ? '1 stop' : 'Direct'}`}</button>)}</div></C.Opt>}
    <C.Opt label="Fare" id={'fr-' + id}><div className="ds-fares" role="radiogroup" aria-labelledby={'fr-' + id}>{fares.map(x => <button key={x.id} role="radio" aria-checked={v === x.id} className="ds-fare" onClick={() => { if (!done) setV(x.id) }}><span className="ds-row-b"><span className="ds-row-t">{name(x.id)}{x.pop && <span className="ds-fare-tag">Most picked</span>}</span><span className="ds-row-s">{x.sub}</span></span><span className="ds-fare-p">{price(q(x.id).each)}</span><span className="ds-tick" aria-hidden="true">{v === x.id && <Icon name="check" size={14} stroke={2.6} />}</span></button>)}</div></C.Opt>
  </C.Detail></fieldset>
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
  const known = [...new Set([St.get().prefs.full || '', ...St.get().bookings.filter(b => b.cat === 'flights' && Array.isArray(b.extra?.names)).flatMap(b => (b.extra.names as string[]).slice(0, Math.max(1, (b.extra.pax || 1) - (b.extra.kids || 0))))])].filter(n => n && n.trim().split(/\s+/).length > 1)
  const fill = (n: string) => { const i = names.findIndex((x, k) => !(x || '').trim() && !kindOf(k, pax, kids)); if (i < 0 || names.includes(n)) return; const nn = [...names]; nn[i] = n; setNames(nn) }
  const avail = known.filter(n => !names.includes(n)), slots = names.some((x, k) => !(x || '').trim() && !kindOf(k, pax, kids))
  return <C.Opt label={all > 1 ? 'Travellers, as on their passports' : 'Your name, as on your passport'}>{avail.length > 0 && slots && <div className="c2-avs" role="group" aria-label="Saved travellers">{avail.slice(0, 6).map(n => <button key={n} type="button" className="c2-av" onClick={() => fill(n)}><span className="c2-av-c">{ini(n)}</span><b>{n.split(/\s+/)[0]}</b><span>Saved</span></button>)}</div>}<div className="ds-names"><input className="app-in" value={names[0]} placeholder="Full name" aria-label={all > 1 ? 'Traveller 1 full name' : 'Your full name'} autoComplete="name" onChange={e => { const n = [...names]; n[0] = e.target.value; setNames(n) }} />{Array.from({ length: all - 1 }, (_, j) => { const i = j + 1, k = kindOf(i, pax, kids); return <React.Fragment key={i}><input className="app-in" placeholder={ph(i)} aria-label={ph(i)} value={names[i] || ''} onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n) }} />{k && setDobs && <label className="gr-col" style={{ gap: 4 }}><span className="ds-opt-l">{`${k === 'infant' ? 'Infant' : 'Child'}'s date of birth${k === 'infant' ? ' (under 2 when you fly)' : ''}`}</span><input className="app-in" type="date" max={today} min={k === 'infant' ? F.addDays(today, -730) : F.addDays(today, -365 * 16)} value={dobs[i] || ''} aria-invalid={!!dobProblem(k, dobs[i], first, lastDay)} onChange={e => { const d = [...dobs]; d[i] = e.target.value; setDobs(d) }} />{dobProblem(k, dobs[i], first, lastDay) && <span className="ds-row-s" role="alert" style={{ color: 'var(--danger)' }}>{dobProblem(k, dobs[i], first, lastDay)}</span>}</label>}</React.Fragment> })}</div></C.Opt>
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
  if (done || !d0 || d0.extra?.done) return <D.AssistantNote>{light ? 'Names and bags added.' : 'Names, seats and bags added.'}</D.AssistantNote>
  const cta = ready ? 'Continue' : !names.every(latin) ? 'Use passport letters (A to Z)' : !dobOk && namesOk ? (dobs.some((x, i) => x && dobProblem(kindOf(i, pax, kids), x, first, lastDay)) ? 'Check the dates of birth' : 'Add dates of birth') : pax + inf > 1 ? 'Add everyone\'s full name' : 'Add your full name'
  return <C.Detail title={light ? 'Names and bags' : 'Names, seats and bags'} sub={light ? 'Light fares get seats at check-in' : undefined} cta={cta} disabled={done || !ready} onCta={() => { setDone(true); run({ f: 'seatsDone', a: { draft, seats, backSeats: legs > 1 ? legSeats[1] : undefined, bags, seatFee: extra, names: names.map(n => n.trim()), dobs } }, light ? `${bags ? `${bags} bag${bags > 1 ? 's' : ''}` : 'No bags'}` : `Seats ${seats.join(', ')}${bags ? `, ${bags} bag${bags > 1 ? 's' : ''}` : ''}`) }}>
    <Names pax={pax} names={names} setNames={setNames} kids={kids} inf={inf} dobs={dobs} setDobs={setDobs} first={first} lastDay={lastDay} />
    {inf > 0 && <D.AssistantNote>{`${inf > 1 ? 'Infants sit' : 'Your infant sits'} on ${inf > 1 ? 'the laps of the first adults listed' : `${(names[0] || '').trim().split(/\s+/)[0] || 'the first adult'}'s lap`}, so ${inf > 1 ? 'they don\'t need seats' : 'they don\'t need a seat'}. Exit rows aren't open to ${inf > 1 ? 'them' : 'that adult'}.`}</D.AssistantNote>}
    {!light && <C.Opt label={pax > 1 ? 'Seats' : 'Your seat'}>{legs > 1 && <D.Seg items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setWho(0) }} />}{pax > 1 && <div className="app-days" role="radiogroup" aria-label="Choosing a seat for">{Array.from({ length: pax }, (_, k) => <button key={k} className="gr-chip" role="radio" aria-checked={who === k} onClick={() => setWho(k)}>{`${label(k)} · ${cur[k]}`}</button>)}</div>}<div className="gr-row" style={{ justifyContent: 'center' }}><V.SeatMap noExtra={noExit(who)} key={leg + ':' + cur.join() + ':' + who} picked={cur[who]} taken={TK(leg)} mates={cur.filter((_, k) => k !== who)} mateName={pax > 2 ? 'Your group' : label(who ? 0 : 1)} mateNames={Object.fromEntries(cur.map((x, k) => [x, label(k)]))} youName={pax > 1 ? label(who) : undefined} extraPrice={F.legroomFee()} onPick={pick} /></div>{!warn && kindOf(who, pax, kids) === 'child' && <span className="ds-row-s">Exit-row seats (row 14) are for adults only.</span>}{warn && <D.AssistantNote>{warn}</D.AssistantNote>}{legs > 1 && <span className="ds-row-s">{`Outbound ${legSeats[0].join(', ')} · Return ${legSeats[1].join(', ')}`}</span>}</C.Opt>}
    <C.Count label={`Checked bags · ${flex ? `${pax} included with Flex, more at ${M.money(F.bagUnit())} each per flight` : `${M.money(F.bagUnit())} each, per flight${legs > 1 ? ' (2 flights)' : ''}`}`} value={bags} min={flex ? pax : 0} max={pax * 2} onChange={setBags} fmt={(n: number) => (n ? String(n) : 'None')} />
    {why && !done && <span className="ds-row-s" role="status">{why}</span>}
  </C.Detail>
}
/* ---------- card servicing in the chat: disputes, monthly payments, balance transfer, cardholders, points ---------- */
const nm = (m: string) => m.replace(/^[^:]+: /, '')
const icOf = (cat: string) => ({ Dining: 'fork', Groceries: 'bag', Shopping: 'bag', Travel: 'plane', Transport: 'car', Subscriptions: 'refresh', Entertainment: 'ticket' } as any)[cat] || 'card'
function TxnRows({ txns, value, onPick, right }: { txns: St.Txn[]; value: string; onPick: (id: string) => void; right?: (t: St.Txn) => any }) {
  const M = useMarket()
  return <div className="c2-list" role="radiogroup">{txns.map(t => <button key={t.id} className="c2-prow" role="radio" aria-checked={value === t.id} onClick={() => onPick(t.id)}><span className="c2-ph sm"><Icon name={icOf(t.cat)} size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">{nm(t.merchant)}</span><span className="ds-row-s">{`${M.date(F.iso(new Date(t.at)))} · ${t.cat}`}</span></span>{right ? right(t) : <b className="c2-amt">{M.money(t.amount, 2)}</b>}<C2Tick on={value === t.id} /></button>)}</div>
}
function useBk<T>(f: () => T, fb: T): T { try { return f() } catch (e) { return fb } }
function DisputePickBlock({ reason, bk }: any) {
  const M = useMarket(); St.useS(s => s.txns.length); const txns = useBk(() => Bk.transactions().filter(t => !t.refund && !t.pending && t.cat !== 'Payment' && t.at >= Date.now() - 90 * 864e5 && !/^(Temporary credit|Paid with points)/.test(t.merchant)).slice(0, 8), [] as St.Txn[])
  const [id, setId] = usePS<string>(bk, 'txn', ''); const [why, setWhy] = usePS<string>(bk, 'why', reason || ''); const [amt, setAmt] = useState(''); const [note, setNote] = useState(''); const [done, setDone] = useDone(bk)
  const t = txns.find(x => x.id === id), a = amt ? +amt : t?.amount || 0
  if (done) return <D.AssistantNote>Payment and reason chosen.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Which payment?</p><p className="c2-s">Last 90 days</p></div>
    <TxnRows txns={txns} value={id} onPick={x => { setId(x); setAmt('') }} />
    {t && <><C.Opt label="What went wrong?"><div className="c2-slots" role="radiogroup" aria-label="What went wrong?">{Bk.DISPUTE_REASONS.map(r => <button key={r} className="c2-slot" role="radio" aria-checked={why === r} onClick={() => setWhy(r)}>{r}</button>)}</div></C.Opt>
      <div className="c2-grid2"><label className="c2-in"><span>Amount to dispute</span><input inputMode="decimal" value={amt} placeholder={String(t.amount)} onChange={(e: any) => setAmt(e.target.value.replace(/[^\d.]/g, ''))} /></label><label className="c2-in"><span>Note (optional)</span><input value={note} onChange={(e: any) => setNote(e.target.value)} /></label></div>
      {a > t.amount && <span className="ds-row-s" role="status">{`That's more than the payment, ${M.money(t.amount, 2)}.`}</span>}</>}
    <button className="ds-btn48 gr-btn" disabled={!t || !why || !(a > 0) || a > (t?.amount || 0)} onClick={() => { setDone(true); run({ f: 'disputeAsk', a: { txn: id, reason: why, amount: a, note } }, `Dispute ${nm(t!.merchant)}`) }}>Continue</button>
  </div>
}
function PlanPickBlock({ bk }: any) {
  const M = useMarket(); St.useS(s => s.bookings.length); const txns = useBk(() => Bk.planEligible(), [] as St.Txn[])
  const [id, setId] = usePS<string>(bk, 'txn', txns[0]?.id || ''); const [mo, setMo] = usePS<number>(bk, 'mo', 6); const [done, setDone] = useDone(bk)
  const t = txns.find(x => x.id === id) || txns[0]
  if (done) return <D.AssistantNote>Plan chosen.</D.AssistantNote>
  if (!t) return <D.AssistantNote>{`There's no purchase of ${M.money(Bk.planMin())} or more from the last 60 days to spread.`}</D.AssistantNote>
  const opts = Bk.planOptions(t.amount)
  return <div className="c2-card">
    {txns.length > 1 ? <><div className="c2-head"><p className="c2-t">Which purchase?</p><p className="c2-s">{`${M.money(Bk.planMin())} or more, last 60 days`}</p></div><TxnRows txns={txns} value={t.id} onPick={setId} /></> : <div className="c2-prow"><span className="c2-ph sm"><Icon name={icOf(t.cat)} size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">{nm(t.merchant)}</span><span className="ds-row-s">{`${M.date(F.iso(new Date(t.at)))} · ${M.money(t.amount, 2)}`}</span></span></div>}
    <div className="c2-head"><p className="c2-t">Pay it monthly</p></div>
    <div className="c2-list" role="radiogroup" aria-label="Plan">{opts.map(o => <button key={o.months} className="c2-prow" role="radio" aria-checked={mo === o.months} onClick={() => setMo(o.months)}><span className="c2-b"><span className="ds-row-t">{`${o.months} months · ${M.money(o.monthly, 2)} a month`}</span><span className="ds-row-s">{o.fee ? `${M.money(o.fee, 2)} in fees · ${M.money(o.total, 2)} in all` : `No fee · ${M.money(o.total, 2)} in all`}</span></span><C2Tick on={mo === o.months} /></button>)}</div>
    <D.AssistantNote>The first payment is on your next statement. You can pay it off early at any time.</D.AssistantNote>
    <button className="ds-btn48 gr-btn" onClick={() => { setDone(true); run({ f: 'planAsk', a: { txn: t.id, months: mo } }, `${mo} monthly payments for ${nm(t.merchant)}`) }}>{`Set up ${mo} monthly payments`}</button>
  </div>
}
function CtlLimitBlock({ bk, lim }: any) {
  const M = useMarket(); const [amt, setAmt] = useState(''); const [done, setDone] = useDone(bk); St.useS(s => s.seen.ctl)
  const lk: Bk.LimKey = lim; const now = Bk.limNow(lk), a = +amt || 0
  if (done) return <D.AssistantNote>Limit sent.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{Bk.limName(lk)}</p><p className="c2-s">{now != null ? `Now ${M.money(now)}` : 'No limit now'}{lk.ch === 'contactless' ? ` · up to ${M.money(Bk.chMax('contactless'))}` : ''}</p></div>
    <div className="c2-form"><label className="c2-in"><span>New limit</span><input inputMode="decimal" value={amt} onChange={(e: any) => setAmt(e.target.value.replace(/[^\d.]/g, ''))} /></label></div>
    <button className="ds-btn48 gr-btn" disabled={!(a > 0)} onClick={() => { setDone(true); run({ f: 'limAsk', a: { ...lk, amount: a } }, `Set it to ${M.money(a)}`) }}>Continue</button>
  </div>
}
function FraudPickBlock({ bk }: any) {
  const M = useMarket(); St.useS(s => s.txns.length); const txns = useBk(() => Bk.fraudCandidates(), [] as St.Txn[]); const [ids, setIds] = usePS<string[]>(bk, 'ids', []); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Payments picked.</D.AssistantNote>
  if (!txns.length) return <D.AssistantNote>There are no card payments in the last 30 days.</D.AssistantNote>
  const tot = txns.filter(t => ids.includes(t.id)).reduce((a, t) => a + t.amount, 0), flip = (id: string) => setIds(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id])
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Which payments weren't you?</p><p className="c2-s">Last 30 days · tick all that apply</p></div>
    <div className="c2-list">{txns.map(t => <button key={t.id} className="c2-prow" role="checkbox" aria-checked={ids.includes(t.id)} onClick={() => flip(t.id)}><span className="c2-ph sm"><Icon name={icOf(t.cat)} size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">{nm(t.merchant)}</span><span className="ds-row-s">{`${M.date(F.iso(new Date(t.at)))} · ${t.cat}`}</span></span><b className="c2-amt">{M.money(t.amount, 2)}</b><C2Tick on={ids.includes(t.id)} /></button>)}</div>
    <button className="ds-btn48 gr-btn" disabled={!ids.length} onClick={() => { setDone(true); run({ f: 'fraudAsk', a: { ids } }, ids.length > 1 ? `${ids.length} payments, ${M.money(tot, 2)}` : `${nm(txns.find(t => t.id === ids[0])!.merchant)}, ${M.money(tot, 2)}`) }}>Continue</button>
  </div>
}
const ADVICE: Record<string, string> = { UK: 'MoneyHelper or StepChange', EU: 'MABS', SG: 'Credit Counselling Singapore', MY: 'AKPK' }
function HardshipBlock({ bk }: any) {
  const M = useMarket(); const c = St.useS(s => s.card); const [months, setMonths] = usePS<number>(bk, 'months', 6); const [pay, setPay] = useState(''); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Sent.</D.AssistantNote>
  const p = +pay, adv = ADVICE[M.id === 'AR' ? 'AE' : M.id]
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Help with your payments</p><p className="c2-s">{c.due > 0 ? `${M.money(c.due, 2)} due ${M.date(c.dueDate, 'day')} · minimum ${M.money(c.min, 2)}` : 'Nothing due right now'}</p></div>
    <div className="c2-list">
      {c.due > 0 && <button className="c2-prow" onClick={() => sendText('Pay the minimum')}><span className="c2-ph sm"><Icon name="card" size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">Pay just the minimum this month</span><span className="ds-row-s">Keeps the account up to date</span></span><Icon name="chev" size={16} stroke={2.2} /></button>}
      <button className="c2-prow" onClick={() => run({ f: 'dueDayStart', a: {} }, 'Move my due date')}><span className="c2-ph sm"><Icon name="cal" size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">Move my due date</span><span className="ds-row-s">To a few days after payday</span></span><Icon name="chev" size={16} stroke={2.2} /></button>
      <button className="c2-prow" onClick={() => run({ f: 'handoff', a: { reason: 'Financial difficulty', team: 'care' } }, 'Talk to a specialist')}><span className="c2-ph sm"><Icon name="headset" size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">Talk to a specialist</span><span className="ds-row-s">They can see this conversation</span></span><Icon name="chev" size={16} stroke={2.2} /></button>
    </div>
    <C.Opt label="Or ask for a payment plan"><div className="c2-slots" role="radiogroup" aria-label="How long">{Bk.PLAN_MONTHS.map(n => <button key={n} className="c2-slot" role="radio" aria-checked={months === n} onClick={() => setMonths(n)}>{`${n} months`}</button>)}</div></C.Opt>
    <label className="c2-in"><span>What you could pay each month</span><input inputMode="decimal" value={pay} onChange={(e: any) => setPay(e.target.value.replace(/[^\d.]/g, ''))} /></label>
    <p className="ds-row-s">{`Interest is frozen while the plan runs, if the bank agrees.${adv ? ` Free, independent advice: ${adv}.` : ''}`}</p>
    <button className="ds-btn48 gr-btn" disabled={!(p > 0)} onClick={() => { setDone(true); run({ f: 'hardshipAsk', a: { months, pay: p } }, `${M.money(p)} a month for ${months} months`) }}>Ask for this plan</button>
  </div>
}
function DueDayBlock({ bk }: any) {
  const M = useMarket(); const c = St.useS(s => s.card); const [day, setDay] = usePS<number>(bk, 'day', 0); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Day chosen.</D.AssistantNote>
  const days = [1, 5, 10, 15, 20, 25, 28]
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Move your due date</p><p className="c2-s">{`Now the ${new Date(c.dueDate).getDate()}${Bk.ord(new Date(c.dueDate).getDate())} of each month`}</p></div>
    <div className="c2-slots" role="radiogroup" aria-label="New due date">{days.map(n => <button key={n} className="c2-slot" role="radio" aria-checked={day === n} onClick={() => setDay(n)}>{`${n}${Bk.ord(n)}`}</button>)}</div>
    <button className="ds-btn48 gr-btn" disabled={!day} onClick={() => { setDone(true); run({ f: 'dueDayAsk', a: { day } }, `The ${day}${Bk.ord(day)}`) }}>Continue</button>
  </div>
}
/** One choice from a short list, then the flow named by f carries on with it. */
function PickOneBlock({ id, f, title, items, note, bk, ...rest }: any) {
  const M = useMarket(); const [v, setV] = usePS<string>(bk, 'v', ''); const [done, setDone] = useDone(bk); const k = rest.field || (f === 'hireExtend' ? 'days' : f === 'trainChange' ? 'at' : f === 'esimTopUp' ? 'plan' : 'what')
  if (done) return <D.AssistantNote>Chosen.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{title}</p>{note && <p className="c2-s">{note}</p>}</div>
    <div className="c2-slots" role="radiogroup" aria-label={title}>{items.map((x: string) => <button key={x} className="c2-slot" role="radio" aria-checked={v === x} onClick={() => setV(x)}>{/^\d\d:\d\d$/.test(x) ? M.clock(x) : x}</button>)}</div>
    <button className="ds-btn48 gr-btn" disabled={!v} onClick={() => { setDone(true); run({ f, a: { id, [k]: v } }, /^\d\d:\d\d$/.test(v) ? M.clock(v) : v) }}>Continue</button>
  </div>
}
function VisaFormBlock({ city, bk }: any) {
  const [nat, setNat] = useState(''); const [from, setFrom] = useState(''); const [exp, setExp] = useState(''); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Visa check and application</p><p className="c2-s">{city}</p></div>
    <div className="c2-form"><label className="c2-in"><span>Passport issued by</span><input value={nat} placeholder="United Kingdom" onChange={(e: any) => setNat(e.target.value)} /></label>
      <div className="c2-grid2"><label className="c2-in"><span>Travelling on</span><input type="date" value={from} onChange={(e: any) => setFrom(e.target.value)} /></label><label className="c2-in"><span>Passport expires</span><input type="date" value={exp} onChange={(e: any) => setExp(e.target.value)} /></label></div></div>
    <p className="ds-row-s">No passport number is needed here. The visa service asks for it securely if you need an application.</p>
    <button className="ds-btn48 gr-btn" disabled={!nat.trim() || !from || !exp} onClick={() => { setDone(true); run({ f: 'visaApply', a: { city, nationality: nat.trim(), from, expiry: exp } }, `${nat.trim()} passport`) }}>Continue</button>
  </div>
}
function InsClaimBlock({ id, bk }: any) {
  const [why, setWhy] = usePS<string>(bk, 'why', ''); const [amt, setAmt] = useState(''); const [done, setDone] = useDone(bk); const M = useMarket()
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Make a claim</p><p className="c2-s">Travel insurance</p></div>
    <C.Opt label="What happened?"><div className="c2-slots" role="radiogroup" aria-label="What happened?">{F.CLAIM_WHY.map(r => <button key={r} className="c2-slot" role="radio" aria-checked={why === r} onClick={() => setWhy(r)}>{r}</button>)}</div></C.Opt>
    <label className="c2-in"><span>How much it cost you</span><input inputMode="decimal" value={amt} onChange={(e: any) => setAmt(e.target.value.replace(/[^\d.]/g, ''))} /></label>
    <button className="ds-btn48 gr-btn" disabled={!why || !(+amt > 0)} onClick={() => { setDone(true); run({ f: 'insClaimDo', a: { id, why, amount: +amt } }, `${why}, ${M.money(+amt, 2)}`) }}>Send the claim</button>
  </div>
}
function TicketSendBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Send the tickets</p><p className="c2-s">{`${b.title} · ${b.when || ''}`}</p></div>
    <div className="c2-form"><label className="c2-in"><span>Their name</span><input value={name} onChange={(e: any) => setName(e.target.value)} /></label><label className="c2-in"><span>Their email</span><input type="email" inputMode="email" value={email} onChange={(e: any) => setEmail(e.target.value)} /></label></div>
    <button className="ds-btn48 gr-btn" disabled={!name.trim() || !email.trim()} onClick={() => { setDone(true); run({ f: 'ticketSendDo', a: { id, name: name.trim(), email: email.trim() } }, `Send to ${name.trim()}`) }}>Send the tickets</button>
  </div>
}
function ShowChangeBlock({ id, bk }: any) {
  const M = useMarket(); const b = St.useS(s => s.bookings.find(x => x.id === id)); const it = b ? F.findItem(b.itemId || '') : undefined; const [v, setV] = usePS<string>(bk, 'v', ''); const [done, setDone] = useDone(bk)
  if (!b || !it?.opts) return null; if (done) return <D.AssistantNote>Changed.</D.AssistantNote>
  const vals = it.opts.values.filter(x => x !== b.extra?.option)
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{b.title}</p><p className="c2-s">{`Now ${b.when}`}</p></div>
    <div className="c2-slots" role="radiogroup" aria-label={it.opts.label}>{vals.map(x => <button key={x} className="c2-slot" role="radio" aria-checked={v === x} onClick={() => setV(x)}>{/^\d\d:\d\d/.test(x) ? M.clock(x) : x}</button>)}</div>
    <button className="ds-btn48 gr-btn" disabled={!v} onClick={() => { setDone(true); run({ f: 'showChangeDo', a: { id, slot: v } }, /^\d\d:\d\d/.test(v) ? M.clock(v) : v) }}>Change</button>
  </div>
}
const nextDays = (from: string, n: number) => Array.from({ length: n }, (_, k) => F.addDays(from, k))
function StayChangeBlock({ id, bk, plus }: any) {
  const M = useMarket(); const b = St.useS(s => s.bookings.find(x => x.id === id)); const start = b?.extra?.date || F.stayDefault()
  const [date, setDate] = usePS<string>(bk, 'date', start); const [n, setN] = usePS<number>(bk, 'n', (b?.extra?.nights || 2) + (plus ? 1 : 0)); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Dates chosen.</D.AssistantNote>
  const today = F.iso(new Date()), from = F.addDays(start, -3) < today ? today : F.addDays(start, -3)
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{b.title}</p><p className="c2-s">{`Now ${b.when}`}</p></div>
    <C.Opt label="Check in"><div className="c2-slots" role="radiogroup" aria-label="Check in">{nextDays(from, 8).map(d0 => <button key={d0} className="c2-slot" role="radio" aria-checked={date === d0} onClick={() => setDate(d0)}>{M.date(d0, 'day')}</button>)}</div></C.Opt>
    <C.Opt label="Nights"><div className="c2-slots" role="radiogroup" aria-label="Nights">{[1, 2, 3, 4, 5, 7].map(k => <button key={k} className="c2-slot" role="radio" aria-checked={n === k} onClick={() => setN(k)}>{String(k)}</button>)}</div></C.Opt>
    <p className="ds-row-s">{`${M.date(date)} to ${M.date(F.addDays(date, n))}`}</p>
    <button className="ds-btn48 gr-btn" onClick={() => { setDone(true); run({ f: 'stayChangeDo', a: { id, date, nights: n } }, `${M.date(date)}, ${n} night${n > 1 ? 's' : ''}`) }}>Change the dates</button>
  </div>
}
function StayExtrasBlock({ id, bk }: any) {
  const M = useMarket(); const b = St.useS(s => s.bookings.find(x => x.id === id)); const [ks, setKs] = usePS<string[]>(bk, 'ks', []); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Extras chosen.</D.AssistantNote>
  const have = (b.extra?.extras || []) as string[], n = b.extra?.nights || 2, flip = (k: string) => setKs(ks.includes(k) ? ks.filter(x => x !== k) : [...ks, k])
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">During your stay</p><p className="c2-s">{b.title}</p></div>
    <div className="c2-list">{F.STAY_EXTRAS().map(x => { const own = have.includes(x.k), price = x.k === 'breakfast' ? x.price * n * F.guestsOf(b) : x.price; return <button key={x.k} className="c2-prow" role="checkbox" aria-checked={own || ks.includes(x.k)} disabled={own} onClick={() => flip(x.k)}><span className="c2-b"><span className="ds-row-t">{x.name}</span><span className="ds-row-s">{own ? 'Added' : x.sub}</span></span><b className="c2-amt">{M.money(price, 2)}</b><C2Tick on={own || ks.includes(x.k)} /></button> })}</div>
    <button className="ds-btn48 gr-btn" disabled={!ks.length} onClick={() => { setDone(true); run({ f: 'stayExtrasDo', a: { id, ks } }, F.STAY_EXTRAS().filter(x => ks.includes(x.k)).map(x => x.name).join(', ')) }}>Continue</button>
  </div>
}
function MsgPlaceBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [text, setText] = useState(''); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Message written.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{`Message ${b.title.replace(/^(Dinner at|Table at) /, '')}`}</p><p className="c2-s">{`Sent with your booking, ${b.ref}`}</p></div>
    <div className="c2-form"><label className="c2-in"><span>Your message</span><input value={text} placeholder={b.cat === 'dining' ? 'It\'s a birthday, and one of us is vegetarian' : 'We arrive late, around 23:00'} onChange={(e: any) => setText(e.target.value)} /></label></div>
    <button className="ds-btn48 gr-btn" disabled={!text.trim()} onClick={() => { setDone(true); run({ f: 'msgPlace', a: { id, text: text.trim() } }, text.trim()) }}>Send</button>
  </div>
}
function TableChangeBlock({ id, bk }: any) {
  const M = useMarket(); const b = St.useS(s => s.bookings.find(x => x.id === id)); const it = b ? F.findItem(b.itemId || '') : undefined
  const slots = (it?.opts?.kind === 'slots' ? it.opts.values : ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']).filter((x: string) => /^\d\d:\d\d/.test(x))
  const [at, setAt] = usePS<string>(bk, 'at', String(b?.extra?.at || b?.extra?.option || slots[2] || '19:00')); const q0 = (b && (b.qty || +((b.detail || []).find((r: any) => r[0] === 'Guests')?.[1] || 0))) || 2; const [q, setQ] = usePS<number>(bk, 'q', q0); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Change chosen.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{b.title}</p><p className="c2-s">{`Now ${b.when}, for ${q0}`}</p></div>
    <C.Opt label="Time"><div className="c2-slots" role="radiogroup" aria-label="Time">{slots.map((x: string) => <button key={x} className="c2-slot" role="radio" aria-checked={at === x} onClick={() => setAt(x)}>{M.clock(x)}</button>)}</div></C.Opt>
    <C.Opt label="Guests"><div className="c2-slots" role="radiogroup" aria-label="Guests">{[1, 2, 3, 4, 5, 6, 8].map(k => <button key={k} className="c2-slot" role="radio" aria-checked={q === k} onClick={() => setQ(k)}>{String(k)}</button>)}</div></C.Opt>
    <button className="ds-btn48 gr-btn" onClick={() => { setDone(true); run({ f: 'tableChangeDo', a: { id, at, qty: q } }, `${M.clock(at)}, ${q} ${q > 1 ? 'guests' : 'guest'}`) }}>Change the table</button>
  </div>
}
function TourChangeBlock({ id, bk }: any) {
  const M = useMarket(); const b = St.useS(s => s.bookings.find(x => x.id === id)); const [d0, setD] = usePS<string>(bk, 'd', ''); const [done, setDone] = useDone(bk)
  if (!b) return null; if (done) return <D.AssistantNote>Day chosen.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{b.title}</p><p className="c2-s">{`Now ${b.when}`}</p></div>
    <div className="c2-slots" role="radiogroup" aria-label="New day">{nextDays(F.addDays(F.iso(new Date()), 1), 8).filter(x => x !== b.extra?.date).slice(0, 7).map(x => <button key={x} className="c2-slot" role="radio" aria-checked={d0 === x} onClick={() => setD(x)}>{M.date(x, 'day')}</button>)}</div>
    <button className="ds-btn48 gr-btn" disabled={!d0} onClick={() => { setDone(true); run({ f: 'tourChangeDo', a: { id, date: d0 } }, M.date(d0, 'day')) }}>Move it</button>
  </div>
}
function BTFormBlock({ bk }: any) {
  const M = useMarket(); const [bank, setBank] = useState(''); const [l4, setL4] = useState(''); const [amt, setAmt] = useState(''); const [done, setDone] = useDone(bk)
  const a = +amt || 0, fee = Math.round(a * Bk.BT.feePct) / 100
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Move a balance here</p><p className="c2-s">{`0% for ${Bk.BT.months} months · ${Bk.BT.feePct}% fee`}</p></div>
    <div className="c2-form">
      <label className="c2-in"><span>The other card's bank</span><input value={bank} onChange={(e: any) => setBank(e.target.value)} /></label>
      <div className="c2-grid2"><label className="c2-in"><span>Last 4 digits</span><input inputMode="numeric" maxLength={4} value={l4} onChange={(e: any) => setL4(e.target.value.replace(/\D/g, '').slice(0, 4))} /></label><label className="c2-in"><span>Amount</span><input inputMode="decimal" value={amt} onChange={(e: any) => setAmt(e.target.value.replace(/[^\d.]/g, ''))} /></label></div>
    </div>
    {a > 0 && <div className="c2-kv"><div className="ds-kv-r"><span>Fee</span><b>{M.money(fee, 2)}</b></div><div className="ds-kv-r"><span>Added to this card</span><b>{M.money(a + fee, 2)}</b></div></div>}
    <button className="ds-btn48 gr-btn" disabled={!bank.trim() || l4.length !== 4 || !(a > 0)} onClick={() => { setDone(true); run({ f: 'btAsk', a: { bank, last4: l4, amount: a } }, `Move ${M.money(a)} from ${bank.trim()}`) }}>Continue</button>
  </div>
}
function HolderFormBlock({ bk }: any) {
  const M = useMarket(); const [name, setName] = useState(''); const [rel, setRel] = useState('Partner'); const [dob, setDob] = useState(''); const [lim, setLim] = useState(0); const [done, setDone] = useDone(bk)
  const lims = [0, Cat.px(250, M.id), Cat.px(500, M.id), Cat.px(1000, M.id)]
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Add someone to your card</p><p className="c2-s">Their own card on your account</p></div>
    <div className="c2-form">
      <label className="c2-in"><span>Full name, as on their ID</span><input value={name} onChange={(e: any) => setName(e.target.value)} autoComplete="off" /></label>
      <C.Opt label="They are your"><div className="c2-slots" role="radiogroup" aria-label="They are your">{['Partner', 'Child', 'Parent', 'Other'].map(x => <button key={x} className="c2-slot" role="radio" aria-checked={rel === x} onClick={() => setRel(x)}>{x}</button>)}</div></C.Opt>
      <label className="c2-in"><span>Date of birth</span><input type="date" value={dob} max={F.iso(new Date())} onChange={(e: any) => setDob(e.target.value)} /></label>
      <C.Opt label="Their spending limit"><div className="c2-slots" role="radiogroup" aria-label="Their spending limit">{lims.map(x => <button key={x} className="c2-slot" role="radio" aria-checked={lim === x} onClick={() => setLim(x)}>{x ? M.money(x) : 'Your full limit'}</button>)}</div></C.Opt>
    </div>
    <button className="ds-btn48 gr-btn" disabled={name.trim().split(/\s+/).length < 2 || !dob} onClick={() => { setDone(true); run({ f: 'holderAsk', a: { name, rel, dob, limit: lim || undefined } }, `Add ${name.trim()} to my card`) }}>Continue</button>
  </div>
}
function PtsPayBlock({ bk }: any) {
  const M = useMarket(); const bal = St.useS(s => s.balance); const txns = useBk(() => Bk.ptsPayEligible(), [] as St.Txn[])
  const [id, setId] = usePS<string>(bk, 'txn', txns[0]?.id || ''); const [pts, setPts] = useState<number | undefined>(); const [done, setDone] = useDone(bk)
  const t = txns.find(x => x.id === id) || txns[0]
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  if (!t) return <D.AssistantNote>There are no card purchases in the last 90 days to pay off.</D.AssistantNote>
  const max = Math.max(100, Math.min(Math.floor(bal / 100) * 100, Math.ceil(t.amount / St.rate() / 100) * 100)), p = Math.min(max, pts ?? max), val = Math.min(t.amount, p * St.rate())
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Pay off a purchase with points</p><p className="c2-s">{`You have ${M.pts(bal)}`}</p></div>
    <TxnRows txns={txns} value={t.id} onPick={x => { setId(x); setPts(undefined) }} />
    <div className="c2-split"><div><span>Points</span><b>{M.num(p)}</b></div><div><span>Taken off the card</span><b>{M.money(val, 2)}</b></div></div>
    {max > 100 && <><input className="c2-range" type="range" min={100} max={max} step={100} value={p} onChange={(e: any) => setPts(+e.target.value)} style={{ ['--p' as any]: `${((p - 100) / Math.max(1, max - 100)) * 100}%` }} aria-label="Points to use" /><div className="c2-range-l"><span>Fewer points</span><span>More points</span></div></>}
    <button className="ds-btn48 gr-btn" disabled={bal < 100} onClick={() => { setDone(true); run({ f: 'ptsPayAsk', a: { txn: t.id, pts: p } }, `Use ${M.num(p)} points on ${nm(t.merchant)}`) }}>{`Use ${M.num(p)} points`}</button>
  </div>
}
function SendPtsBlock({ bk }: any) {
  const M = useMarket(); const bal = St.useS(s => s.balance); const [name, setName] = useState(''); const [mem, setMem] = useState(''); const [n, setN] = useState(1000); const [done, setDone] = useDone(bk)
  const opts = [500, 1000, 2500, 5000].filter(x => x <= bal)
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Send points to family</p><p className="c2-s">{`You have ${M.pts(bal)}`}</p></div>
    <div className="c2-form"><label className="c2-in"><span>Their full name</span><input value={name} onChange={(e: any) => setName(e.target.value)} /></label><label className="c2-in"><span>Their membership number (8 digits)</span><input inputMode="numeric" value={mem} onChange={(e: any) => setMem(e.target.value.replace(/\D/g, '').slice(0, 8))} /></label></div>
    {opts.length > 0 && <C.Opt label="How many points"><div className="c2-slots" role="radiogroup" aria-label="How many points">{opts.map(x => <button key={x} className="c2-slot" role="radio" aria-checked={n === x} onClick={() => setN(x)}>{M.num(x)}</button>)}</div></C.Opt>}
    <button className="ds-btn48 gr-btn" disabled={name.trim().split(/\s+/).length < 2 || mem.length !== 8 || n > bal} onClick={() => { setDone(true); run({ f: 'sendPtsAsk', a: { name, member: mem, pts: n } }, `Send ${M.num(n)} points to ${name.trim()}`) }}>{`Send ${M.num(n)} points`}</button>
  </div>
}
function PtsClaimBlock({ bk }: any) {
  const M = useMarket(); const txns = useBk(() => Bk.claimEligible(), [] as St.Txn[]); const [id, setId] = usePS<string>(bk, 'txn', ''); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Sent to the bank.</D.AssistantNote>
  if (!txns.length) return <D.AssistantNote>There are no card purchases in the last 90 days.</D.AssistantNote>
  const t = txns.find(x => x.id === id)
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Which purchase is missing points?</p><p className="c2-s">Last 90 days</p></div>
    <TxnRows txns={txns} value={id} onPick={setId} right={x => <b className="c2-amt">{x.points ? `+${M.num(x.points)}` : M.money(x.amount, 2)}</b>} />
    <button className="ds-btn48 gr-btn" disabled={!t} onClick={() => { setDone(true); run({ f: 'missingPtsDo', a: { txn: id } }, `Missing points on ${nm(t!.merchant)}`) }}>Ask the bank to check</button>
  </div>
}
function ProtectBlock({ bk }: any) {
  const M = useMarket(); const txns = useBk(() => Bk.protectEligible(), [] as St.Txn[]); const [id, setId] = usePS<string>(bk, 'txn', ''); const [why, setWhy] = usePS<string>(bk, 'why', ''); const [what, setWhat] = useState(''); const [done, setDone] = useDone(bk)
  if (done) return <D.AssistantNote>Details added.</D.AssistantNote>
  if (!txns.length) return <D.AssistantNote>There are no shopping purchases on the card in the last year to claim on.</D.AssistantNote>
  const t = txns.find(x => x.id === id)
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Which purchase?</p><p className="c2-s">Bought with this card</p></div>
    <TxnRows txns={txns} value={id} onPick={setId} />
    {t && <><C.Opt label="What happened?"><div className="c2-slots" role="radiogroup" aria-label="What happened?">{Bk.PROTECT_REASONS.map(r => <button key={r} className="c2-slot" role="radio" aria-checked={why === r} onClick={() => setWhy(r)}>{r}</button>)}</div></C.Opt>
      <label className="c2-in"><span>What is it?</span><input value={what} placeholder="Headphones" onChange={(e: any) => setWhat(e.target.value)} /></label></>}
    <button className="ds-btn48 gr-btn" disabled={!t || !why || !what.trim()} onClick={() => { setDone(true); run({ f: 'protectAsk', a: { txn: id, reason: why, what } }, `Claim for ${what.trim()}`) }}>Continue</button>
  </div>
}
function CardSwitchBlock({ bk }: any) {
  const M = useMarket(); const cards = Bk.CARDS(); const [done, setDone] = useDone(bk); const [cur, next] = cards
  const fee = (x: any) => x.fee ? `${M.money(x.fee)} a year` : 'No annual fee'
  if (done) return <D.AssistantNote>Card chosen.</D.AssistantNote>
  return <div className="c2-card c2-cmp">
    <div className="c2-cmp-h">{cards.map(c => <div key={c.id}><img src={Cat.img('money:card')} alt="" /><b>{c.id === 'core' ? `${c.name} (yours)` : c.name}</b></div>)}</div>
    {[['Annual fee', fee(cur), fee(next)], ['Points', cur.earn.replace('£1', M.money(1)), next.earn.replace('£1', M.money(1))], ['Lounges', cur.perks[0], next.perks[0]], ['Travel insurance', 'When you pay for the trip with the card', next.perks[1]], ['Purchase protection', '120 days', '180 days'], ['Welcome bonus', 'None', M.pts(25000)]].map(([k, a, b]) => <div key={k} className="c2-cmp-r"><span className="c2-cmp-k">{k}</span><div className="c2-cmp-v"><span>{a}</span><span>{b}</span></div></div>)}
    <button className="ds-btn48 gr-btn" onClick={() => { setDone(true); run({ f: 'upgradeCardAsk', a: { to: 'plus' } }, `Move to ${next.name}`) }}>{`Move to ${next.name}`}</button>
  </div>
}
function HolderRemoveBlock({ bk }: any) {
  const hs = St.useS(s => s.bookings.filter(b => b.extra?.case === 'holder' && !b.extra?.removed && !['cancelled', 'refunded'].includes(b.status))); const [done, setDone] = useDone(bk)
  if (done || !hs.length) return <D.AssistantNote>No additional cardholders left on the card.</D.AssistantNote>
  return <C.Offers title="Cards on your account" items={hs.map(b => ({ key: b.id, art: undefined, title: b.extra.name, sub: b.sub, action: 'Remove', onAction: () => { setDone(true); run({ f: 'holderRemoveAsk', a: { id: b.id } }, `Remove ${b.extra.name.split(' ')[0]}'s card`) }, primary: false }))} />
}
function NameFixBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [i, setI] = usePS<number>(bk, 'i', 0); const [nw, setNw] = useState(''); const [done, setDone] = useDone(bk)
  if (!b) return null
  if (done) return <D.AssistantNote>Name sent to the airline.</D.AssistantNote>
  const pax = b.extra?.pax || 1, names: string[] = b.extra?.names && b.extra.names.length ? b.extra.names.slice(0, pax + (b.extra.inf || 0)) : [St.get().prefs.full || St.get().prefs.name]
  const far = nw.trim().split(/\s+/).length > 1 && F.editDist(names[i] || '', nw.trim()) > 3
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Fix a name</p><p className="c2-s">{`${b.extra?.number} · ${b.title}`}</p></div>
    <div className="c2-list" role="radiogroup" aria-label="Whose name">{names.map((n, k) => <button key={n + k} className="c2-prow" role="radio" aria-checked={i === k} onClick={() => { setI(k); setNw(n) }}><span className="c2-av-c">{ini(n)}</span><span className="c2-b"><span className="ds-row-t">{n}</span><span className="ds-row-s">As booked</span></span><C2Tick on={i === k} /></button>)}</div>
    <label className="c2-in"><span>Correct name, as on the passport</span><input value={nw} onChange={(e: any) => setNw(e.target.value)} autoComplete="off" /></label>
    {far && <span className="ds-row-s" role="status">That's more than a spelling fix. The airline treats it as a new traveller.</span>}
    <button className="ds-btn48 gr-btn" disabled={nw.trim().split(/\s+/).length < 2 || nw.trim() === names[i]} onClick={() => { setDone(true); run({ f: 'nameFixDo', a: { id, i, name: nw } }, `Change ${names[i]} to ${nw.trim()}`) }}>{far ? 'Ask a person' : 'Fix the name'}</button>
  </div>
}
function LostBagBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [type, setType] = useState('Suitcase'); const [col, setCol] = useState('Black'); const [addr, setAddr] = useState(St.get().addresses[0]?.id || ''); const [done, setDone] = useDone(bk)
  if (!b) return null
  if (done) return <D.AssistantNote>Reported to the airline.</D.AssistantNote>
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Report a missing bag</p><p className="c2-s">{`${b.extra?.number} · ${b.title}`}</p></div>
    <C.Opt label="What kind of bag?"><div className="c2-slots" role="radiogroup" aria-label="What kind of bag?">{['Suitcase', 'Backpack', 'Holdall', 'Box'].map(x => <button key={x} className="c2-slot" role="radio" aria-checked={type === x} onClick={() => setType(x)}>{x}</button>)}</div></C.Opt>
    <C.Opt label="Colour"><div className="c2-slots" role="radiogroup" aria-label="Colour">{['Black', 'Grey', 'Blue', 'Red', 'Green', 'Other'].map(x => <button key={x} className="c2-slot" role="radio" aria-checked={col === x} onClick={() => setCol(x)}>{x}</button>)}</div></C.Opt>
    <C.Opt label="Deliver it to"><div className="c2-list" role="radiogroup" aria-label="Deliver it to">{St.get().addresses.map(a => <button key={a.id} className="c2-prow" role="radio" aria-checked={addr === a.id} onClick={() => setAddr(a.id)}><span className="c2-ph sm"><Icon name="pin" size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">{a.label}</span><span className="ds-row-s">{a.line}</span></span><C2Tick on={addr === a.id} /></button>)}</div></C.Opt>
    <button className="ds-btn48 gr-btn" onClick={() => { setDone(true); run({ f: 'lostBagDo', a: { id, type, colour: col, addr } }, `Report my ${col.toLowerCase()} ${type.toLowerCase()}`) }}>Report it</button>
  </div>
}
/* ---------- flights: extras before paying, and check-in, today's flight, upgrades and bags after booking ---------- */
const C2Tick = ({ on }: { on: boolean }) => <span className={'c2-tick' + (on ? ' on' : '')} aria-hidden="true">{on && <Icon name="check" size={14} stroke={3} />}</span>
const ini = (n: string) => (n || '?').trim().split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase()
const hhmm = (ts: number) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }
function ExtrasBlock({ draft, bk }: any) {
  const d = St.useS(s => s.drafts[draft]); const M = useMarket(); const [on, setOn] = usePS<string[]>(bk, 'on', []); const [done, setDone] = useDone(bk)
  if (!d) return <p className="ds-quiet">Paid. The receipt is below.</p>
  if (done || d.extra?.extrasDone) return <D.AssistantNote>{(d.extra?.extras || []).length ? 'Extras added.' : 'No extras added.'}</D.AssistantNote>
  const items = F.flightExtras(d), add = items.filter(x => on.includes(x.id)).reduce((t, x) => t + x.price, 0)
  const go = () => { setDone(true); run({ f: 'extrasDone', a: { draft, ids: on } }, on.length ? `Add ${items.filter(x => on.includes(x.id)).map(x => x.title.toLowerCase()).join(', ')}` : 'No extras') }
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Add to your trip</p><p className="c2-s">{add ? `${M.pts(F.ptsOf(add))} added` : 'All optional'}</p></div>
    <div className="c2-list">{items.map(x => <button key={x.id} className="c2-prow" role="checkbox" aria-checked={on.includes(x.id)} onClick={() => setOn(on.includes(x.id) ? on.filter(k => k !== x.id) : [...on, x.id])}>
      <span className="c2-ph sm">{x.img ? <img src={Cat.img(x.img)} alt="" /> : <Icon name={x.icon} size={18} stroke={2} />}</span>
      <span className="c2-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{x.sub}</span></span>
      <b className="c2-amt">{x.price ? `+${M.num(F.ptsOf(x.price))}` : x.free}</b><C2Tick on={on.includes(x.id)} />
    </button>)}</div>
    <button className="ds-btn48 gr-btn" onClick={go}>{on.length ? `Add ${on.length} and continue` : 'Continue'}</button>
  </div>
}
function CheckInBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [done, setDone] = useDone(bk)
  const saved = ((St.get().prefs as any).passports || {}) as Record<string, any>
  const pax = b?.extra?.pax || 1, names: string[] = b?.extra?.names && b.extra.names.length >= pax ? b.extra.names.slice(0, pax + (b.extra.inf || 0)) : [St.get().prefs.full || St.get().prefs.name, ...Array.from({ length: pax - 1 }, (_, i) => `Traveller ${i + 2}`)]
  const [on, setOn] = useState<boolean[]>(names.map(() => true)); const [pp, setPp] = useState<Record<string, { num: string; nat: string; exp: string }>>({})
  if (!b) return null
  if (done || b.extra?.checkedIn) return <D.AssistantNote>Checked in. Boarding passes are in Wallet.</D.AssistantNote>
  const dest = Cat.dests(M.id).find(x => x.name === b.title.split(' to ')[1]), intl = !!dest && dest.country !== Cat.home(M.id).country
  const last = b.extra?.back?.date || b.extra?.date
  const need = (n: string) => intl && !saved[n]
  const bad = (n: string) => { const x = pp[n]; if (!need(n)) return ''; if (!x || !x.num || !x.nat || !x.exp) return 'Add the passport number, nationality and expiry date.'; if (!/^[A-Za-z0-9]{6,9}$/.test(x.num.trim())) return 'Passport numbers are 6 to 9 letters and numbers.'; if (x.exp <= last) return 'This passport expires before you fly home. It needs renewing first.'; return '' }
  const picked = names.filter((_, i) => on[i]), ok = picked.length > 0 && picked.every(n => !bad(n))
  const set = (n: string, k: string, v: string) => setPp({ ...pp, [n]: { ...(pp[n] || { num: '', nat: '', exp: '' }), [k]: v } })
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">Check-in is open</p><p className="c2-s">{`${b.extra?.number} · ${b.title} · ${M.date(b.extra?.date)}, ${b.extra?.dep}`}</p></div>
    <div className="c2-list">{names.map((n, i) => <div key={n + i}>
      <button className="c2-prow" role="checkbox" aria-checked={on[i]} onClick={() => setOn(on.map((x, k) => k === i ? !x : x))}><span className="c2-av-c">{ini(n)}</span><span className="c2-b"><span className="ds-row-t">{n}</span><span className="ds-row-s">{[i >= pax ? 'On a lap' : (b.extra?.seats?.[i] ? `Seat ${b.extra.seats[i]}` : 'Seat given now'), intl ? (saved[n] ? 'passport saved' : 'passport needed') : ''].filter(Boolean).join(' · ')}</span></span><C2Tick on={on[i]} /></button>
      {on[i] && need(n) && <div className="c2-form" style={{ paddingBottom: 12 }}>
        <label className="c2-in"><span>Passport number</span><input value={pp[n]?.num || ''} onChange={(e: any) => set(n, 'num', e.target.value)} autoComplete="off" /></label>
        <div className="c2-grid2"><label className="c2-in"><span>Nationality</span><input value={pp[n]?.nat || ''} onChange={(e: any) => set(n, 'nat', e.target.value)} /></label><label className="c2-in"><span>Expiry date</span><input type="date" value={pp[n]?.exp || ''} onChange={(e: any) => set(n, 'exp', e.target.value)} /></label></div>
        {pp[n] && bad(n) && <span className="ds-row-s" role="status">{bad(n)}</span>}
      </div>}
    </div>)}</div>
    {intl && <p className="c2-fine"><Icon name="lock" size={14} stroke={2.2} />Passport details are shared only with the airline and saved for next time.</p>}
    <button className="ds-btn48 gr-btn" disabled={!ok} onClick={() => { setDone(true); run({ f: 'checkInDo', a: { id, names: picked, passports: pp } }, `Check in ${picked.length > 1 ? picked.length + ' people' : picked[0]}`) }}>{`Check in ${picked.length} ${picked.length === 1 ? 'person' : 'people'}`}</button>
    <p className="c2-fine c2-center">Closes 1 hour before take-off.</p>
  </div>
}
if (typeof window !== 'undefined') setTimeout(() => { (window as any).__gateOf = (b: any) => gateOf(b) })
export const gateOf = (b: St.Booking) => b.extra?.gate || ('ABC'[(b.ref || 'X').charCodeAt(1) % 3] + (((b.ref || 'X').charCodeAt(2) % 28) + 2))
function TripTimelineBlock({ id }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket()
  if (!b) return null
  const o = F.flightById(b.extra?.flightId), delay = (b.extra?.delay || 0) * 6e4
  const dep = new Date(b.extra?.date + 'T' + b.extra?.dep + ':00').getTime()
  const arrT = o ? (() => { const [h, m] = o.arr.split(':').map(Number); const d = new Date(dep); d.setHours(h, m, 0, 0); if (d.getTime() < dep) d.setDate(d.getDate() + 1); return d.getTime() })() : dep + 3 * 36e5
  const soon = dep - Date.now() < 3 * 36e5 || !!b.extra?.ciOpen
  const steps: { t: string; title: string; sub: string; done?: boolean; change?: string }[] = [
    b.extra?.checkedIn ? { t: '', title: 'Checked in', sub: 'Boarding passes in Wallet', done: true } : { t: hhmm(dep - 864e5), title: 'Check-in opens', sub: `${M.date(F.iso(new Date(dep - 864e5)))}, 24 hours before` },
    ...((b.extra?.bags || 0) > 0 ? [{ t: hhmm(dep - 60 * 6e4), title: 'Bag drop closes', sub: `${b.extra.bags} checked bag${b.extra.bags > 1 ? 's' : ''}` }] : []),
    { t: hhmm(dep - 55 * 6e4 + delay), title: soon ? `Gate ${gateOf(b)}` : 'Gate', sub: soon ? 'Opens 55 minutes before take-off' : 'Shown about 3 hours before', change: b.extra?.gateWas ? `was ${b.extra.gateWas}` : undefined },
    { t: hhmm(dep - 40 * 6e4 + delay), title: 'Boarding', sub: b.extra?.cabin ? 'Priority boarding' : 'By group, shown on your pass' },
    { t: hhmm(dep + delay), title: 'Take-off', sub: `${b.extra?.number} from ${b.extra?.from}`, change: delay ? `${b.extra.delay} min late` : undefined },
    { t: hhmm(arrT + delay), title: 'Lands', sub: `${b.extra?.to} · ${b.title.split(' to ')[1]}` },
  ]
  return <div className="c2-card">
    <div className="c2-head"><p className="c2-t">{M.date(b.extra?.date)}</p><p className="c2-s">{`${b.extra?.number} · ${b.title}`}</p></div>
    <ol className="c2-tl">{steps.map(x => <li key={x.title} className={(x.done ? 'done' : '') + (x.change ? ' chg' : '')}><span className="c2-tl-d">{x.done && <Icon name="check" size={11} stroke={3.4} />}</span><span className="c2-tl-t">{x.t}</span><span className="c2-b"><span className="ds-row-t">{x.title}{x.change && <em>{x.change}</em>}</span><span className="ds-row-s">{x.sub}</span></span></li>)}</ol>
  </div>
}
function UpgradeBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const price = usePrice(); const [v, setV] = usePS<string>(bk, 'cab', b?.extra?.cabin === 'premium' ? 'business' : 'premium'); const [done, setDone] = useDone(bk)
  if (!b) return null
  const opts = F.cabins().filter(c => c.id !== b.extra?.cabin && !(b.extra?.cabin === 'premium' && c.id === 'premium'))
  const cur = opts.find(c => c.id === v) || opts[0]
  return <fieldset className="app-fs" disabled={done}><C.Detail art={Cat.img(b.img)} title={`Upgrade ${b.title}`} sub={`${b.extra?.number}${b.extra?.back ? ' and the return' : ''}`} price={price(F.cabinPrice(b, cur.id), (b.extra?.pax || 1) > 1 ? `for ${b.extra.pax} people` : undefined)} checks={cur.inc} cta={`Upgrade to ${cur.name}`} done={done ? `${cur.name} chosen` : undefined} disabled={done} onCta={() => { setDone(true); run({ f: 'upgradeDo', a: { id, cabin: cur.id } }, `Upgrade to ${cur.name}`) }}>
    <C.Opt label="Cabin"><div className="ds-fares" role="radiogroup" aria-label="Cabin">{opts.map(c => <button key={c.id} role="radio" aria-checked={cur.id === c.id} className="ds-fare" onClick={() => setV(c.id)}><span className="ds-row-b"><span className="ds-row-t">{c.name}</span><span className="ds-row-s">{c.inc[0]}</span></span><span className="ds-fare-p">{price(F.cabinPrice(b, c.id))}</span><span className="ds-tick" aria-hidden="true">{cur.id === c.id && <Icon name="check" size={14} stroke={2.6} />}</span></button>)}</div></C.Opt>
  </C.Detail></fieldset>
}
function AddBagsBlock({ id, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [n, setN] = usePS<number>(bk, 'n', 1); const [done, setDone] = useDone(bk)
  if (!b) return null
  const legs = b.extra?.back ? 2 : 1, tot = n * F.bagUnit() * legs
  return <C.Detail art={Cat.img('move:porter')} title="Add checked bags" sub={`${b.extra?.number} · up to 23 kg each`} price={<C.Price pts={M.pts(F.ptsOf(tot))} cash={M.money(tot, tot % 1 ? 2 : 0)} />} checks={[legs > 1 ? 'On both flights' : 'On the flight', `${b.extra?.bags || 0} checked bag${(b.extra?.bags || 0) === 1 ? '' : 's'} on the booking now`]} cta={`Add ${n} bag${n > 1 ? 's' : ''}`} done={done ? 'Bags chosen' : undefined} disabled={done} onCta={() => { setDone(true); run({ f: 'addBagsDo', a: { id, n } }, `Add ${n} bag${n > 1 ? 's' : ''}`) }}>
    <C.Count label="How many bags" value={n} min={1} max={Math.min(4, (b.extra?.pax || 1) * 2)} onChange={setN} />
  </C.Detail>
}
function SeatChange({ id, bk, leg: leg0 }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [done, setDone] = useDone(bk); const [leg, setLeg] = useState(leg0 || 0); const [who, setWho] = useState(0); const [warn, setWarn] = useState('')
  const [ls, setLs] = useState<string[][]>(() => [b?.extra?.seats || seatsFor('16C', b?.extra?.pax || 1), b?.extra?.backSeats || b?.extra?.seats || seatsFor('15D', b?.extra?.pax || 1, TAKEN_BACK)])
  if (!b) return null
  if (dead(b) || b.extra?.disrupted) return <D.AssistantNote>{dead(b) ? 'This booking is cancelled.' : 'The airline cancelled this flight.'}</D.AssistantNote>
  if (b.extra?.fare === 'light') return <C.StateNote title="At check-in" body="Light fares don't include seat choice. The airline gives seats at check-in." />
  if (done) return <D.AssistantNote>Seats chosen. The booking card below has the latest details.</D.AssistantNote>
  const pax = b.extra?.pax || 1, legs = b.extra?.back ? 2 : 1, cur = ls[leg], names: string[] = b.extra?.names || []
  const was: string[] = (leg ? b.extra?.backSeats || b.extra?.seats : b.extra?.seats) || []
  const wasOf = (l: number): string[] => (l ? b.extra?.backSeats || b.extra?.seats : b.extra?.seats) || []
  const changed = ls.slice(0, legs).map((x, l) => ({ leg: l, seats: x })).filter(x => x.seats.join() !== wasOf(x.leg).join())
  const fee = changed.reduce((t, x) => t + Math.max(0, x.seats.filter(y => /^14/.test(y)).length - wasOf(x.leg).filter(y => /^14/.test(y)).length) * F.legroomFee(), 0)
  const label = (i: number) => (names[i] || '').split(/\s+/)[0] || (i ? `Traveller ${i + 1}` : St.get().prefs.name)
  const pick = (x: string) => { if (TK(leg).includes(x) || cur.includes(x)) return; if (/^14/.test(x) && (kindOf(who, pax, b.extra?.kids || 0) || who < (b.extra?.inf || 0))) { setWarn(kindOf(who, pax, b.extra?.kids || 0) ? 'Children can\'t sit in an exit row. Pick another seat for them.' : 'An adult travelling with an infant can\'t sit in an exit row. Pick another seat.'); return } setWarn(''); const n = ls.map(a => [...a]); n[leg][who] = x; setLs(n); if (pax > 1) setWho((who + 1) % pax) }
  return <C.Detail title={`Seats on ${b.title}`} sub={b.extra?.number} cta={fee ? `Save seats, ${M.money(fee)} more` : changed.length > 1 ? 'Save seats on both flights' : 'Save seats'} disabled={done || !changed.length} onCta={() => { setDone(true); run({ f: 'seatSaveAll', a: { id, legs: changed } }, `Seats ${changed.map(x => x.seats.join(', ')).join('; ')}`) }}>
    {legs > 1 && <D.Seg items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setWho(0) }} />}
    {pax > 1 && <div className="app-days" role="radiogroup" aria-label="Choosing a seat for">{Array.from({ length: pax }, (_, k) => <button key={k} className="gr-chip" role="radio" aria-checked={who === k} onClick={() => setWho(k)}>{`${label(k)} · ${cur[k]}`}</button>)}</div>}
    <div className="gr-row" style={{ justifyContent: 'center' }}><V.SeatMap noExtra={!!kindOf(who, pax, b.extra?.kids || 0) || who < (b.extra?.inf || 0)} key={leg + ':' + cur.join() + ':' + who} picked={cur[who]} taken={TK(leg)} mates={cur.filter((_, k) => k !== who)} mateName={pax > 2 ? 'Your group' : label(who ? 0 : 1)} mateNames={Object.fromEntries(cur.map((x, k) => [x, label(k)]))} youName={pax > 1 ? label(who) : undefined} extraPrice={F.legroomFee()} onPick={pick} /></div>{warn && <D.AssistantNote>{warn}</D.AssistantNote>}
    {legs > 1 && changed.length > 0 && <span className="ds-row-s">{`Changing: ${changed.map(x => `${x.leg ? 'flight back' : 'flight out'} ${x.seats.join(', ')}`).join('; ')}`}</span>}
  </C.Detail>
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
  return <C.Detail art={Cat.img('fly:' + city)} title={`Flights to ${city}`} sub="Lowest one-way fare per person, each day" cta={a ? `Search ${M.date(a)}${b ? ' to ' + M.date(b) : ', one way'}` : 'Pick your dates'} disabled={!a} onCta={() => run({ f: 'flightSearch', a: { city, date: a!, back: b, pax } }, `${M.date(a!)}${b ? ' to ' + M.date(b) : ', one way'}`)}><T.PriceCalendar key={iso(1) + (a || '') + (b || '')} year={y} month={mo} prices={prices} low={low} from={dayOf(a)} to={dayOf(b)} disabledBefore={first} onPick={pick} onPrev={off > 0 ? () => setOff(off - 1) : undefined} onNext={off < 10 ? () => setOff(off + 1) : undefined} /></C.Detail>
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
  if (i.mode === 'link') return <C.Detail art={img(i.img)} title={i.brand || i.title} sub="Shop on their own site" price={<C.Price free={i.earn} />} checks={['Tracked when you use this link', i.policy || ''].filter(Boolean)} cta="Go to their site" done={done ? 'Link opened' : undefined} disabled={done} onCta={() => { setDone(true); St.set(s => ({ pending: [{ id: St.uidx(), label: `${i.brand}`, at: Date.now() }, ...(s.pending || []).filter(p => p.label !== i.brand)] })); St.pushMsg({ role: 'gr', text: `Demo: this is where ${i.brand}${/s$/.test(i.brand || '') ? '\'' : '\'s'} own site opens. Pay there with your card and the ${i.earn} are tracked. They show as pending in Wallet, under Points, and land after the 30-day return window.`, blocks: [{ kind: 'affiliate', id: i.id }] }) }} />
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
  const bal = St.get().balance, need = total ? F.ptsOf(total) : 0
  const policyTxt = ['stays', 'experiences'].includes(i.cat) ? F.policyFor(i, date, /^\d{1,2}:\d\d/.test(opt || '') ? opt.slice(0, 5) : undefined) : i.policy
  const unitTxt = i.cat === 'stays' ? `${nights} night${nights > 1 ? 's' : ''}${roomsE > 1 ? `, ${roomsE} rooms` : ''}, taxes in` : i.cat === 'dining' ? undefined : freeLeft && total ? `${Math.min(qty, qMax) - freeLeft} paid, ${freeLeft} free` : freeLeft ? undefined : i.unit === 'for two' ? 'for every two people' : i.cat === 'rides' && i.opts?.kind === 'dates' && opt ? `${opt} day${+opt === 1 ? '' : 's'}` : Math.min(qty, qMax) > 1 ? `${Math.min(qty, qMax)} × ${M.money(price)}` : isRide && dest ? 'fixed price' : i.unit
  return <fieldset className="app-fs" disabled={done}><C.Detail art={img(i.img) || D.STAMP[i.cat]} tall={['shopping', 'giftcards', 'subs'].includes(i.cat)} title={i.cat === 'giftcards' ? `${i.title} gift card` : i.title}
    sub={[i.rating ? `★ ${i.rating}` : '', isRide && sched ? Cat.home(M.id).city + (rTime ? ` · pick-up ${M.clock(rTime)}` : '') : i.sub].filter(Boolean).join(' · ')}
    price={i.cat === 'dining' ? <C.Price free={i.earn || 'Free to book'} /> : freeVisit && !total ? <C.Price free="Free with your card" /> : i.included && !total ? <C.Price free="Included with your card" /> : total ? <C.Price pts={M.pts(need)} cash={M.money(total, total % 1 ? 2 : 0)} unit={unitTxt} /> : undefined}
    checks={[...(i.meta || []), ...(freeVisit ? [`${St.get().loungeLeft} free visit${St.get().loungeLeft > 1 ? 's' : ''} left this year`] : []), ...(policyTxt ? [policyTxt] : [])]}
    caption={total && !i.included ? (need <= bal ? `You'll have ${M.num(bal - need)} points left.` : `You have ${M.num(bal)} points; the rest can go on your card.`) : undefined}
    done={done ? 'Chosen' : undefined}
    cta={far ? 'Too far for a ride' : needSize ? 'Pick a size' : isRide && !dest.trim() ? 'Add where to' : isRide && sched && !rTime ? 'Pick a time' : needsEmail && (!who.trim() || !EMAIL.test(email.trim())) ? 'Add their name and email' : freeVisit && !total ? (Math.min(qty, qMax) > 1 ? `Use ${Math.min(qty, qMax)} free visits` : 'Use a free visit') : i.cat === 'dining' ? 'Choose this time' : i.cat === 'subs' ? (i.included ? 'Turn on' : 'Subscribe') : i.cat === 'giftcards' ? 'Buy gift card' : 'Continue'} disabled={blocked || done}
    onCta={() => { setDone(true); run({ f: 'startCheckout', a: { id, tap: true, addr: i.cat === 'shopping' ? addr : undefined, ship: i.cat === 'shopping' ? shipDay : undefined, rooms: i.cat === 'stays' ? roomsE : undefined, option: opt, qty: Math.min(qty, qMax), to: i.cat === 'giftcards' ? (to === 'Me' ? 'Me' : who.trim()) : undefined, email: needsEmail ? email.trim() : undefined, date: isRide ? (sched ? rDate : undefined) : ['stays', 'experiences', 'rides', 'airport', 'dining'].includes(i.cat) || (i.cat === 'tickets' && /this week/i.test(i.title)) ? date : undefined, at: isRide && sched && rTime ? `${M.date(rDate)} ${M.clock(rTime)}` : undefined, nights, dest: isRide ? dest.trim() : undefined, pickup: isRide ? (sched && rTime ? `${from} at ${rTime}, ${M.date(rDate)}` : from) : isTransfer ? St.get().addresses[0].line : undefined } }, label) }}>
    {i.cat === 'stays' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Check in</span><DayChips from={F.iso(new Date())} n={90} value={date} onChange={setDate} /><C.Count label="Nights" value={nights} min={1} max={Math.max(14, nights)} onChange={setNights} />{trip && <div className="gr-meta">Matched to your flight: {M.date(trip.in)} to {M.date(trip.out)}</div>}</div>}
    {(i.cat === 'experiences' || (i.cat === 'rides' && (i.opts?.kind === 'slots' || i.opts?.kind === 'dates'))) && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{i.opts?.kind === 'dates' ? 'Pick-up day' : 'Day'}</span><DayChips from={/^Train to /.test(i.title) ? F.iso(new Date()) : F.addDays(F.iso(new Date()), 1)} n={45} value={date} onChange={setDate} /></div>}
    {i.cat === 'airport' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day of travel</span><DayChips from={F.iso(new Date())} n={45} value={date} onChange={setDate} />{F.tripDates() && <div className="gr-meta">{`Matched to your ${F.tripDates()!.flight.extra?.number} on ${M.date(F.tripDates()!.in)}, leaving ${F.tripDates()!.flight.extra?.dep}`}</div>}</div>}
    {isRide && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Pick up from</span><div className="gr-slots" role="radiogroup" aria-label="Pick up from">{['Your location', ...St.get().addresses.map(a => `${a.label}, ${a.line}`)].map(p => <button key={p} className="gr-slot" role="radio" aria-checked={from === p} onClick={() => setFrom(p)}>{p === 'Your location' ? 'Here' : p.split(',')[0]}</button>)}</div></div>}
    {isRide && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Where to?</span><input className="app-in" placeholder="Address or place" value={dest} onChange={e => setDest(e.target.value)} aria-label="Where to?" /><div className="gr-slots" role="radiogroup" aria-label="Quick picks">{[...St.get().addresses.map(a => [a.label, `${a.label}, ${a.line}`]), ['Airport', Cat.airportName(M.id)]].map(([l, p]) => <button key={p} className="gr-slot" role="radio" aria-checked={dest === p} onClick={() => setDest(p)}>{l}</button>)}</div><D.Seg items={['Now', 'Schedule']} value={sched ? 'Schedule' : 'Now'} onChange={(v: string) => setSched(v === 'Schedule')} />{sched ? <><DayChips from={F.iso(new Date())} n={30} value={rDate} onChange={setRDate} /><input className="app-in" type="time" aria-label="Pick-up time" value={rTime} onChange={e => setRTime(e.target.value)} /><div className="gr-meta">{rTime ? (from === 'Your location' ? `Pick-up from your location at ${M.clock(rTime)}, ${M.date(rDate)}.` : `Pick-up from ${from} at ${M.clock(rTime)}, ${M.date(rDate)}.`) : 'Choose a pick-up time.'}</div></> : <div className="gr-meta">{from === 'Your location' ? 'Pick-up from where you are now.' : `Pick-up from ${from}.`}</div>}</div>}
    {isTransfer && <div className="gr-meta">{trip ? `Pick-up from ${St.get().addresses[0].line}, 3 hours before your ${trip.flight.extra?.dep} flight on ${M.date(trip.in)}.` : `Pick-up from ${St.get().addresses[0].line}. Book a flight and I'll time the pick-up to it.`}</div>}
    {i.cat === 'shopping' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Deliver to</span><div className="gr-slots" role="radiogroup" aria-label="Deliver to" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>{St.get().addresses.map(ad => <button key={ad.id} className="gr-slot" role="radio" aria-checked={addr === ad.id} style={{ height: 'auto', padding: '8px 12px', textAlign: 'start' }} onClick={() => setAddr(ad.id)}><b>{ad.label}</b><br /><span className="gr-meta">{ad.line}</span></button>)}</div><span className="gr-label">Delivery day</span><DayChips from={F.addDays(F.iso(new Date()), 2)} n={10} value={shipDay} onChange={setShipDay} /></div>}
    {i.cat === 'dining' && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day</span><DayChips from={F.iso(new Date())} n={30} value={date} onChange={setDate} /></div>}
    {i.cat === 'dining' && dvals.length === 0 && <div className="gr-meta">No tables left today. Pick another day.</div>}{i.cat === 'tickets' && /this week/i.test(i.title) && <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">Day</span><DayChips from={F.iso(new Date())} n={7} value={date} onChange={(d: string) => { setDate(d); if (d !== F.iso(new Date()) && !opt) setOpt0(vals[0]) }} /></div>}{i.cat === 'tickets' && dvals.length === 0 && <div className="gr-meta">{/this week/i.test(i.title) ? 'No more showings today. Pick another day.' : 'No more showings today.'}</div>}{/^Train to /.test(i.title) && dvals.length === 0 && <div className="gr-meta">No more trains today. Pick another day.</div>}
    {dvals.length > 0 && (i.opts?.kind === 'slots' ? <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{i.opts.label}</span><div className="gr-slots" role="radiogroup" aria-label={i.opts.label}>{dvals.map((v: string) => <button key={v} className="gr-slot" role="radio" aria-checked={opt === v} onClick={() => setOpt(v)}>{M.clock(v)}</button>)}</div></div> : <X.VariantPicker label={i.cat === 'giftcards' ? 'Amount' : i.opts?.label || 'Option'} options={vals.map(show)} value={show(opt)} onChange={(v: string) => setOpt(vals[vals.map(show).indexOf(v)])} />)}
    {i.cat === 'giftcards' && <><X.VariantPicker label="Who is it for?" options={['Someone else', 'Myself']} value={to === 'Me' ? 'Myself' : to} onChange={(v: string) => setTo(v === 'Myself' ? 'Me' : v)} />{to !== 'Me' && <><input className="app-in" placeholder="Their name" value={who} onChange={e => setWho(e.target.value)} aria-label="Their name" /><input className="app-in" type="email" inputMode="email" placeholder="Their email address" value={email} onChange={e => setEmail(e.target.value)} aria-label="Their email address" />{email && !EMAIL.test(email.trim()) && <div className="gr-meta" style={{ color: 'var(--danger)' }}>Check the email address.</div>}</>}</>}
    {freeVisit && Math.min(qty, qMax) > freeLeft && <div className="gr-meta">{`${freeLeft} free visit${freeLeft > 1 ? 's' : ''} left, so ${Math.min(qty, qMax) - freeLeft} ${Math.min(qty, qMax) - freeLeft > 1 ? 'people are' : 'person is'} paid.`}</div>}{(!['subs', 'rides', 'giftcards'].includes(i.cat) || /^Train to /.test(i.title)) && <C.Count label={qLabel} value={Math.min(qty, qMax)} min={1} max={qMax} onChange={(n: number) => { setQty(n); if (i.cat === 'stays') setRooms(Math.min(4, Math.max(1, Math.ceil(n / perRoom)))) }} />}{i.cat === 'dining' && qty >= 12 && <div className="gr-meta">For more than 12, ask the concierge team: they arrange big tables with the restaurant.</div>}{i.cat === 'stays' && <C.Count label="Rooms" value={Math.max(rooms, Math.ceil(qty / perRoom))} min={Math.max(1, Math.ceil(qty / perRoom))} max={4} onChange={setRooms} />}{i.cat === 'stays' && pax && pax > 2 && /Suite/i.test(opt || '') && rooms === 1 && <div className="gr-meta">{`Suite picked so ${pax} of you can stay together; or choose Double and 2 rooms.`}</div>}{i.cat === 'stays' && <div className="gr-meta">{pax && pax > qMax ? `${pax} people need more space than this: add a room or choose a suite.` : `${roomsE} room${roomsE > 1 ? 's' : ''} for ${Math.min(qty, qMax)} guest${Math.min(qty, qMax) > 1 ? 's' : ''}; up to ${perRoom} per room.`}</div>}
  </C.Detail></fieldset>
}
function GroceryBlock() {
  const basket = St.useS(s => s.basket); const M = useMarket()
  const lines = Cat.GROCERY.filter(g => basket[g.id]).map(g => ({ id: g.id, title: g.title, price: F.IP(g), qty: basket[g.id] }))
  const fee = F.groceryFee()
  const total = Math.round((lines.reduce((s, l) => s + l.price * l.qty, 0) + (lines.length ? fee : 0)) * 100) / 100
  const setQ = (id: string, q: number) => St.set(s => { const b = { ...s.basket }, g = Cat.GROCERY.find(x => x.id === id); if (q) b[id] = g ? Math.min(F.capOf(g), q) : q; else delete b[id]; return { basket: b } })
  const checkout = () => { const n = lines.reduce((s, l) => s + l.qty, 0); const d = St.draft({ cat: 'quick', title: 'Groceries', img: 'money:basket', sub: `${n} items · ${St.get().addresses.find(a => a.id === St.get().addr)?.label}`, qty: 1, unit: total, total, icon: 'bag', kind: 'order', policy: 'Missing or damaged items refunded straight away', refundable: true, tracker: { steps: ['Order placed', 'Packed', 'Out for delivery', 'Delivered'], current: 1, eta: '15 min' }, detail: [...lines.map(l => [`${l.title} × ${l.qty}`, M.money(l.price * l.qty, 2)] as [string, string]), ['Delivery', M.money(fee, 2)], ['Arrives', 'In about 15 minutes']] }); respond({ say: 'Here\'s your total.', blocks: [{ kind: 'checkout', draft: d }] }) }
  return <div className="gr-col" style={{ gap: 12 }}>
    {!lines.length && <D.AssistantNote>Tap items to add them. Your basket and total show here; delivery takes about 15 minutes.</D.AssistantNote>}
    <div className="ds-again ds-addchips" aria-label="Add to basket">{Cat.GROCERY.filter(g => !basket[g.id]).map(g => <button key={g.id} className="app-gchip" onClick={() => St.set(s => ({ basket: { ...s.basket, [g.id]: (s.basket[g.id] || 0) + 1 } }))}><span className="ds-addchips-p"><Icon name="plus" size={14} stroke={2.6} /></span>{g.title}<b>{M.money(F.IP(g), 2)}</b></button>)}</div>
    {lines.length > 0 && <div className="ds-paycard">
      <div className="ds-pay-h"><img src={Cat.img('money:basket')} alt="" /><span className="ds-coming-b"><span className="ds-coming-t">Your basket</span><span className="ds-coming-s">{`${lines.reduce((t, l) => t + l.qty, 0)} items · arrives in about 15 minutes`}</span></span></div>
      <div className="ds-pay-rows">{lines.map(l => <div key={l.id} className="ds-kv-r ds-bline"><span>{l.title}</span><select className="ds-qty" aria-label={`${l.title}, how many`} value={l.qty} onChange={e => setQ(l.id, +e.target.value)}>{Array.from({ length: Math.min(20, F.capOf(Cat.GROCERY.find(g => g.id === l.id)!) || 20) + 1 }, (_, n) => <option key={n} value={n}>{n ? `× ${n}` : 'Remove'}</option>)}</select><b>{M.money(l.price * l.qty, 2)}</b></div>)}<div className="ds-kv-r"><span>Delivery</span><b>{M.money(fee, 2)}</b></div><div className="ds-kv-r ds-total"><span>Total</span><b><C.Price pts={M.pts(F.ptsOf(total))} cash={M.money(total, 2)} /></b></div></div>
      <button className="ds-btn48 gr-btn" onClick={checkout}>Checkout</button>
    </div>}
  </div>
}
function CheckoutBlock({ draft, method: m0, fresh }: { draft: string; method?: string; fresh?: boolean }) {
  const d = St.useS(s => s.drafts[draft]); const bal = St.useS(s => s.balance); const M = useMarket()
  const [method, setMethod] = usePS<string>('pay:' + draft + (m0 ? ':' + m0 : ''), 'method', m0 || ''); const [more, setMore] = useState(false)
  const [mixPts, setMixPts] = usePS<number | undefined>('pay:' + draft, 'mixPts', undefined)
  if (!d) return <p className="ds-quiet">Paid. The receipt is below.</p>
  if ((d as any).replaced) return <p className="ds-quiet" role="status">This checkout was replaced by a newer one below.</p>
  if (d.extra?.repriced && !fresh) return <p className="ds-quiet">The price changed after this. The updated checkout is further down.</p>
  const full = F.ptsOf(d.total)
  const def = full <= bal ? 'points' : bal >= 100 ? 'mix' : 'card'
  const m = d.pointsOnly ? 'points' : method || def
  const choice = F.payChoice(d, m, m === 'mix' ? mixPts : undefined)
  const mix = F.payChoice(d, 'mix', mixPts)
  const mixMax = Math.min(Math.floor(bal / 100) * 100, Math.floor((full - 1) / 100) * 100)
  const c = St.get().card, avail = Math.max(0, Math.round((c.limit - c.balance) * 100) / 100)
  const over = choice.card > avail
  const cash = (n: number) => M.money(n, n % 1 ? 2 : 0)
  const choices = d.pointsOnly ? undefined : [
    { key: 'points', title: 'Points', sub: full > bal ? `Needs ${M.num(full)}; you have ${M.num(bal)}` : `${M.pts(full)} of your ${M.num(bal)}`, disabled: full > bal },
    { key: 'mix', title: 'Points, and the card for the rest', sub: `${M.pts(mix.pts)} + ${cash(mix.card)} on the card`, disabled: mix.pts <= 0 || mix.pts > bal },
    { key: 'card', title: 'Card only', sub: `${cash(d.total)} on the card ending ${c.last4}` },
  ]
  const pay = choice.card ? (choice.pts ? `${M.pts(choice.pts)} + ${cash(choice.card)}` : cash(choice.card)) : M.pts(choice.pts)
  return <div className="gr-col" style={{ gap: 8 }}><C.Pay art={Cat.img(d.img) || D.STAMP[d.cat]} title={d.title} sub={[d.sub && d.sub !== d.title ? d.sub : '', d.when].filter(Boolean).join(' · ')}
    rows={[['Total', <C.Price pts={M.pts(full)} cash={cash(d.total)} />], ...(choice.method === 'mix' || choice.method === 'card' ? [['You pay', pay] as [string, any]] : []), ['Points left after', M.num(Math.max(0, bal - choice.pts))]]}
    choices={choices} value={m} onChange={setMethod} note={d.policy} slot={m === 'mix' && mixMax > 100 ? <div className="c2-slide"><div className="c2-split"><div><span>Points</span><b>{M.num(choice.pts)}</b></div><div><span>Card</span><b>{cash(choice.card)}</b></div></div><input className="c2-range" type="range" min={100} max={mixMax} step={100} value={Math.min(mixMax, Math.max(100, choice.pts))} onChange={(e: any) => setMixPts(+e.target.value)} style={{ ['--p' as any]: `${((Math.min(mixMax, Math.max(100, choice.pts)) - 100) / Math.max(1, mixMax - 100)) * 100}%` }} aria-label="Points to use" /><div className="c2-range-l"><span>More on the card</span><span>More points</span></div></div> : undefined}
    warn={over ? `That's more than your available credit of ${cash(avail)}.${bal >= 100 && choice.pts < Math.min(bal, full) - 100 ? ' Use more points, or pay less on the card.' : ' Paying off some of your balance frees up credit, or choose something cheaper.'}` : undefined}
    cta={choice.card ? `Pay ${cash(choice.card)}${choice.pts ? ' + ' + M.pts(choice.pts) : ''}` : `Pay ${M.pts(choice.pts)}`} disabled={choice.pts > bal || over}
    onPay={() => { const r = F.reprice(draft) || F.precheck(draft, choice); if (r) { respond(r); return } openConfirm({ kind: 'pay', draft, choice }) }} />
    {(d.detail || []).length > 0 && <button className="ds-disclose" aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Hide what\'s included' : 'What\'s included'}<Icon name="down" size={14} stroke={2.4} /></button>}
    {more && <D.KV rows={(d.detail || []).map(([k, v], i) => ({ label: k + (i ? '' : ''), value: v }))} />}
  </div>
}
function FreeConfirm({ draft }: { draft: string }) {
  const d = St.useS(s => s.drafts[draft]); const M = useMarket()
  if (!d) return <p className="ds-quiet">Done. The receipt is below.</p>
  const label = d.cat === 'dining' ? 'Book the table' : d.cat === 'subs' ? 'Turn it on' : 'Confirm'
  return <C.Pay art={Cat.img(d.img) || D.STAMP[d.cat]} title={d.title} sub={[d.sub && d.sub !== d.title ? d.sub : '', d.when].filter(Boolean).join(' · ')} rows={[...((d.detail || []).slice(0, 4) as [string, any][]), ['To pay', d.extra?.included ? 'Free with your card' : M.t('free')]]} note={d.policy} cta={label} onPay={() => run({ f: 'confirmFreeBooking', a: { draft } }, label)} />
}
function actionsFor(b: St.Booking): string[] {
  if (dead(b)) return []
  if (b.kind === 'sub') return b.pts || b.card ? (b.status === 'paused' ? ['Resume', 'Cancel'] : ['Pause', 'Cancel']) : ['Turn off']
  if (b.kind === 'investment') return ['Sell']
  if (b.kind === 'donation') return []
  if (b.kind === 'request' || b.kind === 'claim' || b.kind === 'transfer') return ['Track']
  if (b.cat === 'giftcards') return ['Show code', 'Code not working']
  if (b.cat === 'docs' && /^eSIM/.test(b.title)) return [...(b.extra?.installed ? [] : ['Install']), 'Top up', ...(b.extra?.installed || !b.refundable ? [] : ['Cancel'])]
  if (b.cat === 'docs' && b.sub === 'Travel insurance') return ['Make a claim', ...(b.refundable ? ['Cancel'] : [])]
  if (b.cat === 'flights' && b.extra?.disrupted) return ['See options', 'Full refund']
  if (b.cat === 'flights') return [...(b.extra?.checkedIn ? ['Boarding pass'] : ['Check in', 'Boarding pass']), 'Flight status', ...(b.extra?.fare === 'light' ? [] : ['Change date', 'Change seats']), ...(b.extra?.checkedIn ? [] : ['Add bags']), ...(b.extra?.fare === 'light' || b.extra?.cabin === 'business' ? [] : ['Upgrade']), ...(b.refundable ? ['Cancel'] : [])]
  if (b.cat === 'tickets' && b.extra?.sentTo) return []
  if (b.cat === 'tickets') { const it = F.findItem(b.itemId || ''), nm = /named|no resale/i.test(b.policy || it?.policy || ''); return ['Show pass', ...(it?.opts?.kind === 'slots' && !/no refunds/i.test(b.policy || '') ? [/^\d\d:\d\d/.test(it.opts.values[0]) ? 'Change showing' : 'Change date'] : []), 'Get there', ...(nm ? [] : ['Send to a friend', ...(!b.refundable ? ['Resell'] : [])]), ...(b.refundable ? ['Cancel'] : [])] }
  if (b.kind === 'ticket' || b.cat === 'airport' || b.cat === 'experiences' || (b.cat === 'rides' && /^Train/.test(b.title))) return ['Show pass', ...(b.cat === 'experiences' ? ['Change date'] : []), ...(b.refundable ? ['Cancel'] : [])]
  if (b.cat === 'rides' && /^Car hire/.test(b.title)) return ['Pick-up guide', 'Extend', ...(b.refundable !== false ? ['Cancel'] : [])]
  if (b.cat === 'rides' && /^Train/.test(b.title)) return ['Show pass', 'Change train', ...(b.refundable ? ['Cancel'] : [])]
  if (b.cat === 'rides') return [...(b.tracker && b.tracker.current < b.tracker.steps.length - 1 ? ['Track'] : []), 'Report a problem', ...(b.refundable !== false && b.status !== 'done' ? ['Cancel'] : [])]
  if (b.cat === 'airport') return ['Show pass', 'Report a problem', ...(b.refundable ? ['Cancel'] : [])]
  if (b.kind === 'order') return b.extra?.returning ? ['Track'] : b.status === 'delivered' ? ['Return', 'Report a problem'] : b.cat === 'bank' ? ['Track'] : ['Track', 'Cancel']
  if (b.extra?.addonFor) return []
  if (b.cat === 'stays') return ['Change dates', 'Add extras', 'Message the hotel', ...(b.refundable !== false ? ['Cancel'] : []), 'Report a problem']
  if (b.cat === 'dining') return ['Change', 'Running late', 'Message the restaurant', 'Cancel']
  if (b.status === 'done') return ['Report a problem']
  return ['Cancel', 'Report a problem']
}
function ReceiptBlock({ id, snap }: any) {
  const live = St.useS(s => s.bookings.find(x => x.id === id)); const bal = St.useS(s => s.balance); const M = useMarket()
  if (!live) return null
  const b = snap ? { ...live, ...snap } : live
  const changed = !!snap && (live.status !== snap.status || live.when !== snap.when || JSON.stringify(live.detail) !== JSON.stringify(snap.detail))
  const head = b.kind === 'donation' ? 'Thank you.' : b.kind === 'transfer' ? 'Transfer sent.' : b.kind === 'investment' ? 'Sent to the partner.' : b.kind === 'order' ? (b.cat === 'giftcards' ? 'Sent.' : 'Ordered.') : b.kind === 'sub' ? 'You\'re subscribed.' : 'You\'re booked.'
  const spent = [b.pts ? M.num(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean)
  const rows: [string, any][] = [
    ...(b.pts && b.card ? [['Paid', `${M.pts(b.pts)} + ${M.money(b.card, 2)}`] as [string, any]] : b.pts ? [['Points spent', M.num(b.pts)] as [string, any]] : b.card ? [['Paid on your card', M.money(b.card, 2)] as [string, any]] : [['To pay', 'Nothing'] as [string, any]]),
    ...(b.pts ? [['Points left', M.num(bal)] as [string, any]] : b.earned ? [['Points earned', '+' + M.num(b.earned)] as [string, any]] : []),
    ...(b.policy ? [[/refund|cancel/i.test(b.policy) ? 'Cancellation' : 'Good to know', b.policy.replace(/\.$/, '')] as [string, any]] : []),
    ['Reference', b.ref],
  ]
  const where = b.cat === 'flights' || b.cat === 'stays' ? 'your trip in Wallet' : 'Wallet'
  const line = changed ? (dead(live) ? `${live.status === 'refunded' ? 'Refunded' : 'Cancelled'} since. Wallet has the latest.` : 'Changed since. Wallet has the latest.') : `I've added it to ${where}${b.kind === 'order' && b.tracker ? ', where you can track it' : ''}, and emailed your confirmation.`
  const qr = !changed && !dead(live) && (['tickets', 'airport', 'experiences', 'giftcards'].includes(b.cat) || (b.cat === 'rides' && /^Train/.test(b.title)))
  return <><C.Booked headline={head} title={b.title} sub={[b.when, b.sub && b.sub !== b.title ? b.sub : ''].filter(Boolean).join(' · ')} rows={spent.length || rows.length ? rows : []} line={line} actions={<div className="ds-btnrow"><button className={"ds-opill" + (qr ? "" : " primary")} onClick={() => W.__go?.("wallet")}>Open Wallet</button></div>} />{qr && <PassFor id={id} />}</>
}
function BookingCard({ id, inline }: { id: string; inline?: boolean }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [pass, setPass] = useState(false); const [more, setMore] = useState(false); const [all, setAll] = useState(false)
  if (!b) return null
  const acts0 = actionsFor(b), acts = all || acts0.length <= 3 ? acts0 : acts0.slice(0, 2)
  const status = dead(b) ? (b.status === 'refunded' ? (b.kind === 'investment' ? 'Sold' : 'Refunded') : b.kind === 'sub' && !b.pts && !b.card ? 'Off' : 'Cancelled') : b.extra?.returning ? 'Returning' : b.extra?.disrupted ? 'Cancelled by airline' : b.status === 'confirmed' ? (b.kind === 'order' ? 'Ordered' : 'Booked') : b.status === 'active' ? 'Active' : b.status === 'paused' ? 'Paused' : b.status === 'delivered' ? 'Delivered' : b.status === 'done' ? 'Done' : 'In progress'
  const paid = b.refunded && (b.refunded.pts || b.refunded.card) ? `Refunded ${[b.refunded.pts ? M.pts(b.refunded.pts) : '', b.refunded.card ? M.money(b.refunded.card, 2) : ''].filter(Boolean).join(' + ')}` : [b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')
  const sub = [b.when || b.sub, paid].filter(Boolean).join(' · ')
  const tone = dead(b) || b.extra?.disrupted ? 'off' : b.status === 'paused' || b.extra?.returning ? 'warn' : 'good'
  const subLine = b.kind === 'sub' ? (dead(b) ? ((b.pts || b.card) > 0 ? `Access until ${M.date(F.renewOn(b))}; nothing more is charged` : '') : b.status === 'paused' ? 'Paused: nothing is charged until you resume' : b.total ? `Next payment ${M.date(F.renewOn(b))} · ${M.money(b.total, 2)} on your card` : 'Included with your card: nothing to pay') : ''
  return <><div className="ds-bkcard">
    <div className="ds-bk-top"><img className="ds-bk-ph" src={Cat.img(b.img) || D.STAMP[b.cat] || Cat.img('money:card')} alt="" /><span className="ds-coming-b"><span className="ds-coming-t">{b.title}</span><span className="ds-coming-s">{sub}</span><span className={'ds-status' + (tone === 'warn' ? ' ds-warn' : tone === 'off' ? ' ds-off' : '')}><i />{status}<span className="ds-bk-ref">{b.ref}</span></span></span></div>
    {subLine && <p className="ds-row-s" style={{ margin: 0 }}>{subLine}</p>}
    {acts.length > 0 && <div className="ds-btnrow">{acts.map((a, i) => <button key={a} className={'ds-opill gr-btn' + (i ? '' : ' primary')} onClick={() => { if (inline && /Show (pass|code)|Boarding pass/.test(a)) { setPass(!pass); return } run({ f: 'manage', a: { id, action: a } }, `${a}: ${b.title}`) }}>{inline && /Show (pass|code)|Boarding pass/.test(a) && pass ? 'Hide' : a}</button>)}{acts.length < acts0.length && <button className="ds-opill" aria-expanded={false} onClick={() => setAll(true)}>More</button>}</div>}
    {inline && (b.detail?.length || 0) > 0 && <button className="ds-disclose" aria-expanded={more} onClick={() => setMore(!more)}>{more ? 'Hide details' : 'Show details'}<Icon name="down" size={14} stroke={2.4} /></button>}
    {inline && more && <D.KV rows={[...(b.detail || []).slice(0, 14).map(([k, v]) => ({ label: k, value: v })), { label: 'Paid', value: [b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ') || 'Nothing' }]} />}
  </div>{inline && pass && <PassFor id={id} />}</>
}
function ConfirmCancel({ id, fraction, sell, bk }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [kept, setKept] = usePS(bk, 'kept', false)
  if (!b) return null
  if (dead(b)) return <p className="ds-quiet">{sell ? 'Sold.' : 'Cancelled.'}</p>
  if (kept) return <p className="ds-quiet">Kept as it is.</p>
  const paid = [b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')
  const bal = St.get().balance, ptsBack = Math.round(b.pts * fraction), owed = Math.round((b.earned || 0) * fraction), rev = Math.min(bal + ptsBack, owed), off = owed - rev, net = ptsBack - rev
  const back = [net > 0 ? M.pts(net) : '', b.card ? M.money(b.card * fraction, 2) : ''].filter(Boolean).join(' + ')
  const lines: [string, string][] = b.kind === 'sub' ? [] : [['You paid', paid || M.t('free')], ...(fraction > 0 && fraction < 1 ? [['Airline cancellation fee (30%)', [b.pts ? M.pts(Math.round(b.pts * (1 - fraction))) : '', b.card ? M.money(b.card * (1 - fraction), 2) : ''].filter(Boolean).join(' + ')] as [string, string]] : []), ...(rev ? [['Points earned on it, taken off', M.pts(-rev)] as [string, string]] : []), ...(off ? [['Earned points already used, written off', M.pts(off)] as [string, string]] : [])]
  const verb = sell ? 'Sell' : b.kind === 'sub' && !b.pts && !b.card ? 'Turn off' : 'Cancel', airline = !!b.extra?.disrupted
  const yes = airline ? 'Yes, refund me' : `Yes, ${verb.toLowerCase()}`
  return <div className="ds-paycard">
    <div className="ds-pay-h"><img src={Cat.img(b.img) || D.STAMP[b.cat] || Cat.img('money:card')} alt="" /><span className="ds-coming-b"><span className="ds-coming-t">{airline ? `Full refund for ${b.title}?` : `${verb} ${b.title}?`}</span><span className="ds-coming-s">{[b.when || b.sub, b.ref].filter(Boolean).join(' · ')}</span></span></div>
    {lines.length > 0 && <div className="ds-pay-rows">{lines.map(([k, v]) => <div key={k} className="ds-kv-r"><span>{k}</span><b>{v}</b></div>)}<div className="ds-kv-r ds-total"><span>{rev && ptsBack ? 'You get back, net' : 'You get back'}</span><b>{b.extra?.included && !paid ? 'Your free visit' : back || 'Nothing to refund'}</b></div></div>}
    {(airline || b.policy) && <p className="ds-row-s" style={{ margin: 0 }}>{airline ? 'The airline cancelled this flight, so there\'s no fee.' : b.policy}</p>}
    <div className="ds-btnrow"><button className="ds-opill primary gr-btn" onClick={() => run({ f: 'doCancel', a: { id, fraction } }, yes)}>{yes}</button><button className="ds-opill gr-btn" onClick={() => { setKept(true); St.pushMsg({ role: 'gr', text: 'Kept as it is.' }) }}>Keep it</button></div>
  </div>
}
function ReturnBlock({ id }: { id: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const [addr, setAddr] = useState(St.get().addr)
  if (!b) return null
  if (dead(b) || b.extra?.returning) return <p className="ds-quiet">Collection booked.</p>
  return <C.Detail art={Cat.img(b.img) || D.STAMP[b.cat]} title={`Return ${b.title}`} price={<C.Price free="Free collection" />} checks={['A courier collects it from you', 'Your refund goes back the way you paid once the courier scans it']} cta="Book free collection" onCta={() => run({ f: 'returnDo', a: { id } }, 'Book free collection')}><C.Opt label="Collect from"><D.Choice list label="Collect from" items={St.get().addresses.map(a => ({ key: a.id, title: a.label, sub: a.line }))} value={addr} onChange={setAddr} /></C.Opt></C.Detail>
}
function ChangeFlight({ id, bk, leg: leg0, date: date0, tod }: any) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket(); const [date, setDate] = useState(date0 || ''); const [done, setDone] = useDone(bk); const [leg, setLeg] = useState(leg0 || 0)
  const [fid, setFid] = useState(() => { if (!b || !date0 || !tod) return ''; const cur = (leg0 ? b.extra.back?.dep : b.extra.dep) || '12:00', hm = (x: string) => +x.slice(0, 2) * 60 + +x.slice(3), R: any = { morning: [0, 720], afternoon: [720, 1020], evening: [1020, 1440] }; const o = F.changeQuote(id, date0, leg0 || 0).opts.filter(x => tod === 'later' ? hm(x.dep) > hm(cur) : tod === 'earlier' ? hm(x.dep) < hm(cur) : R[tod] && hm(x.dep) >= R[tod][0] && hm(x.dep) < R[tod][1]).sort((x, y) => tod === 'earlier' ? hm(y.dep) - hm(x.dep) : hm(x.dep) - hm(y.dep))[0]; return o ? o.id : '' })
  if (!b) return null
  if (dead(b)) return <p className="ds-quiet">This booking is cancelled.</p>
  const today = F.iso(new Date()), back = b.extra.back
  const cur = leg ? { number: back.number, date: back.date, dep: back.dep } : { number: b.extra.number, date: b.extra.date, dep: b.extra.dep }
  const start = leg ? F.addDays(b.extra.date, 1) : F.addDays(today, 1)
  const end = leg ? F.addDays(today, 330) : back ? F.addDays(back.date, -1) : F.addDays(today, 330)
  const n = Math.max(1, Math.min(60, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1))
  if (done) return <D.AssistantNote>Change chosen. The booking card below has the latest details.</D.AssistantNote>
  const q0 = date ? F.changeQuote(id, date, leg, fid || undefined) : null, q = q0 && q0.nf ? q0 : null
  const infOld = !!date && ((b.extra.dobs || []) as string[]).slice(b.extra.pax || 1).some(x => x && ageOn(x, leg || !back ? date : back.date) >= 2)
  const sm = (n: number) => M.money(n, n % 1 ? 2 : 0)
  const cta = !q ? 'Pick a day' : q.diff ? `Continue, ${sm(q.diff)} more` : q.credit ? `Change and get ${b.pts >= F.ptsOf(q.credit) ? M.pts(F.ptsOf(q.credit)) : M.money(q.credit, 2)} back` : 'Change at no cost'
  return <C.Detail art={Cat.img(b.img)} title={`Change ${b.title}`} sub={`Now ${cur.number} · ${M.date(cur.date)} ${cur.dep}`} checks={['No change fee']} cta={cta} disabled={!date || done || infOld} onCta={() => { setDone(true); run({ f: 'changeDo', a: { id, date, leg, flightId: q?.nf.id } }, `Move ${leg ? 'return' : 'outbound'} to ${M.date(date)} ${q?.nf.dep || ''}`.trim()) }}>
    {back && <D.Seg items={['Flight out', 'Flight back']} value={leg ? 'Flight back' : 'Flight out'} onChange={(v: string) => { setLeg(v === 'Flight back' ? 1 : 0); setDate(''); setFid('') }} />}
    <C.Opt label="New day"><DayChips from={start} n={n} value={date} onChange={(d: string) => { setDate(d); setFid('') }} /></C.Opt>
    {q && <C.Opt label="Flights that day" id={'ch-' + id}><div className="ds-fares" role="radiogroup" aria-labelledby={'ch-' + id}>{[...q.opts].sort((x, y) => x.dep.localeCompare(y.dep)).map(o => { const oq = F.changeQuote(id, date, leg, o.id); return <button key={o.id} className="ds-fare gr-slot-row" role="radio" aria-checked={q.nf.id === o.id} onClick={() => setFid(o.id)}><span className="ds-row-b"><span className="ds-row-t">{`${o.dep}–${o.arr} · ${Cat.AIRLINES[o.airline]}`}</span><span className="ds-row-s">{o.stops ? `1 stop, ${o.dur}` : `Direct, ${o.dur}`}</span></span><span className="ds-fare-p"><span className="ds-row-s">{oq.diff ? `${M.money(oq.diff)} more` : oq.credit ? `${M.money(oq.credit)} back` : 'Same price'}</span></span><span className="ds-tick" aria-hidden="true">{q.nf.id === o.id && <Icon name="check" size={14} stroke={2.6} />}</span></button> })}</div></C.Opt>}
    {q && <D.KV rows={[{ label: 'New flight', value: `${q.nf.number} · ${M.date(q.nf.date)} ${q.nf.dep}` }, { label: q.credit ? 'Back to you' : 'Fare difference', value: q.credit ? M.money(q.credit, 2) : q.diff ? M.money(q.diff, 2) : 'None' }]} />}
    {infOld && <D.AssistantNote>Your infant would be 2 by then, so they'd need their own seat. Pick an earlier day, or ask a person to rebook.</D.AssistantNote>}
  </C.Detail>
}
function Disruption({ id, bk }: { id: string; bk?: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket()
  const opts = b && !dead(b) && !b.extra?.rebooked ? F.rebookOptions(b) : []
  const [pick, setPick] = usePS<string>(bk || 'dis:' + id, 'pick', opts[0]?.id || '')
  if (!b) return null
  const sorted = dead(b) || b.extra?.rebooked, sameDay = (o: any) => o.date === b.extra?.date
  const refund = () => { St.pushMsg({ role: 'user', text: 'Full refund' }); respond({ say: 'The airline cancelled it, so you get everything back the way you paid.', blocks: [{ kind: 'confirmcancel', id, fraction: 1 }] }) }
  const comp = () => run({ f: 'compensation', a: {} }, 'Check compensation')
  if (sorted) return <C.StateNote title={b.extra?.rebooked ? 'Sorted' : 'Refunded'} body={b.extra?.rebooked ? `Now on ${b.extra.number} at ${b.extra.dep} on ${M.date(b.extra.date)}, at no cost. You may also be owed compensation under ${M.flightRule.name}.` : `Refunded the way you paid. You may also be owed compensation under ${M.flightRule.name}.`} actions={[{ label: 'Check compensation' }]} onAct={comp} />
  return <div className="gr-col" style={{ gap: 12 }}>
    <div className="ds-note gr-state" role="alert"><div className="ds-note-in"><p className="ds-note-t">Flight cancelled</p><p className="ds-note-b">{`The airline cancelled ${b.extra?.number}, ${b.when}. You don't need to queue: pick another flight below, or take a full refund. You may also be owed compensation under ${M.flightRule.name}.`}</p><div className="ds-note-a"><button className="ds-btn40 ds-white gr-btn" onClick={refund}>Full refund</button><button className="ds-btn40 ds-white gr-btn" onClick={comp}>Compensation</button></div></div><img className="ds-clip" src={D.ART.clip} alt="" /></div>
    {opts.length ? <C.Detail art={Cat.img(b.img)} title="Move to another flight" price={<C.Price free="At no cost" />} cta="Move to this flight" onCta={() => { const o = opts.find(x => x.id === pick) || opts[0]; run({ f: 'rebook', a: { id, flightId: o.id } }, `Move me to the ${o.dep}`) }}><D.Choice list label="Move to, at no cost" items={opts.map(o => ({ key: o.id, title: `${o.dep} ${Cat.AIRLINES[o.airline]}, ${sameDay(o) ? 'same day' : M.date(o.date)}`, sub: `${o.number} · ${o.stops ? '1 stop' : 'Direct'}${!sameDay(o) && b.extra?.back ? ' · your trip becomes a day shorter' : ''}` }))} value={pick} onChange={setPick} /></C.Detail>
      : <C.Detail title="Move both flights" sub={`No other flight lands before your return on ${M.date(b.extra.back.date)}`} checks={[`A full refund is ${[b.pts ? M.pts(b.pts) : '', b.card ? M.money(b.card, 2) : ''].filter(Boolean).join(' + ')}`, 'Or a person can move both flights for you']} cta="Move both flights" onCta={() => run({ f: 'handoff', a: { reason: `Move both flights: ${b.title}` } }, 'Ask a person to move both flights')} />}
  </div>
}
function PassFor({ id }: { id: string }) {
  const b = St.useS(s => s.bookings.find(x => x.id === id)); const M = useMarket()
  if (!b) return null
  const wallet = () => D.toast('Added to Apple Wallet')
  if (dead(b)) return <C.StateNote title="No pass" body="This booking is cancelled, so there's no pass for it any more." />
  if (b.cat === 'flights' && b.extra?.disrupted) return <C.StateNote title="No pass yet" body="The airline cancelled this flight. Pick another flight or a full refund, and your new passes appear here." />
  if (b.cat === 'flights') {
    const e = b.extra, pax = e.pax || 1, names: string[] = e.names && e.names.length >= pax ? e.names : [St.get().prefs.full || St.get().prefs.name, ...Array.from({ length: pax - 1 }, (_, i) => `Guest ${i + 1}`)]
    const legs = [{ airline: e.airline, number: e.number, from: e.from, to: e.to, fromCity: Cat.home(M.id).city, toCity: b.title.split(' to ')[1], date: e.date, dep: e.dep }, ...(e.back ? [{ airline: e.back.airline, number: e.back.number, from: e.back.from, to: e.back.to, fromCity: e.backCity || b.title.split(' to ')[1], toCity: Cat.home(M.id).city, date: e.back.date, dep: e.back.dep }] : [])]
    const opensOf = (l: any) => new Date(new Date(l.date + 'T' + l.dep + ':00').getTime() - 864e5)
    const board = (t: string) => { const n = +t.slice(0, 2) * 60 + +t.slice(3) - 40; return `${String(Math.floor(((n + 1440) % 1440) / 60)).padStart(2, '0')}:${String(((n + 1440) % 1440) % 60).padStart(2, '0')}` }
    const seatOf = (li: number, ni: number) => ni >= pax ? 'Lap' : (li ? e.backSeats?.[ni] || e.seats?.[ni] : e.seats?.[ni]) || (e.fare === 'light' ? 'At check-in' : '—')
    return <div className="gr-col" style={{ gap: 12 }}>{legs.flatMap((l, li) => opensOf(l) > new Date() && !(e.checkedIn && li === 0)
      ? [<C.Ticket key={'c' + li} title={`${l.fromCity} to ${l.toCity}`} count={`${pax + (e.inf || 0)} traveller${pax + (e.inf || 0) > 1 ? 's' : ''}`} code={b.ref + li} lines={[['Flight', l.number], ['Date', M.date(l.date)], ['Departs', l.dep]]} closed={`Check-in opens ${M.date(opensOf(l))} at ${l.dep}. Your boarding ${pax > 1 ? 'passes appear' : 'pass appears'} here then.`} caption={`Seats ${names.slice(0, pax).map((_, ni) => seatOf(li, ni)).join(', ')} · booking ${b.ref}`} />]
      : names.map((n, ni) => <C.Ticket key={li + '-' + ni} title={`${l.fromCity} to ${l.toCity}`} count={`Seat ${seatOf(li, ni)}`} code={`${b.ref}-${li}-${ni}`} lines={[['Flight', l.number], ['Boards', li ? board(l.dep) : hhmm(new Date(l.date + 'T' + l.dep + ':00').getTime() - 40 * 6e4 + (e.delay || 0) * 6e4)], ['Gate', li ? 'C14' : gateOf(b)]]} caption={`${ni === 0 && e.inf ? `${n} with infant` : n} · ${M.date(l.date)} · departs ${!li && e.delay ? hhmm(new Date(l.date + 'T' + l.dep + ':00').getTime() + e.delay * 6e4) : l.dep}`} onWallet={wallet} />))}</div>
  }
  const n = +(b.detail?.find(d => /People|Guests|Quantity/.test(d[0]))?.[1] || 1)
  if (b.cat === 'airport') return <C.Ticket title={b.title} count={n > 1 ? `${n} people` : 'Pass'} code={b.ref} lines={[['Where', (b.sub || '').split(' · ')[0]], ['Valid', b.when || 'On the day'], ['Holder', St.get().prefs.name]]} caption="Show this at the entrance" onWallet={wallet} />
  if (b.cat === 'giftcards') return <C.Ticket title={b.title} count={b.detail?.find(d => d[0] === 'Amount')?.[1] || ''} code={b.ref.replace('GR', 'GIFT')} caption={`${b.extra?.to && b.extra.to !== 'Me' ? `Sent to ${b.extra.to}` : 'For you'} · code ${b.ref.replace('GR', 'GIFT')} · valid for 12 months`} onWallet={wallet} />
  const area = b.detail?.find(d => /Area|Stand/.test(d[0]))?.[1]
  return <C.Ticket title={b.title} count={`${n} ${b.cat === 'tickets' ? (n > 1 ? 'tickets' : 'ticket') : n > 1 ? 'people' : 'person'}`} code={b.ref} lines={[['When', b.when || M.date(new Date())], ...(area ? [['Area', area] as [string, string]] : []), ['Holder', St.get().prefs.name]]} caption={`Show this at the ${/^Train/.test(b.title) ? 'gate' : b.cat === 'tickets' ? 'box office' : 'entrance'} · ${b.ref}`} onWallet={wallet} />
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
  return <C.Detail art={Cat.img(bb?.img) || D.STAMP[bb?.cat || '']} title={bb ? `A problem with ${bb.title}` : 'Report a problem'} sub={bb?.ref} cta={itemTicks ? (picked.length ? `Refund ${picked.length} item${picked.length > 1 ? 's' : ''}` : 'Tick the items') : 'Send claim'} done={done ? 'Sent' : undefined} disabled={!why || done || (itemTicks && !picked.length)} onCta={() => { setDone(true); run({ f: 'fileClaim', a: { id, reason: why, photo: files.length > 0, items: itemTicks ? picked : undefined } }, why) }}>
    <X.VariantPicker label="What happened" options={opts} value={why} onChange={setWhy} />
    {itemTicks && <C.Opt label="Which items"><div className="ds-list ds-inset" role="group" aria-label="Which items">{rows.filter(([k]) => !gone.includes(k)).map(([k, v]) => <button key={k} className="ds-row ds-pickrow-l" role="checkbox" aria-checked={picked.includes(k)} disabled={done} onClick={() => setPicked(picked.includes(k) ? picked.filter(x => x !== k) : [...picked, k])}><span className="ds-row-b"><span className="ds-row-t">{F.loc(k.replace(/ × 1$/, '').replace(/ × (\d+)$/, ' × $1'))}</span></span><span className="ds-row-meta">{v}</span><span className="ds-tick" aria-hidden="true">{picked.includes(k) && <Icon name="check" size={14} stroke={2.6} />}</span></button>)}</div><span className="ds-row-s">Refunded straight away. No need to send anything back.</span></C.Opt>}
    <input ref={inp} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) setFiles([...files, f.name]) }} />
    <C.Opt label="A photo helps"><div className="ds-btnrow"><button className="ds-opill" onClick={() => inp.current?.click()}><Icon name="plus" size={16} stroke={2.4} />Add a photo</button>{files.map(f => <span key={f} className="ds-added-s"><Icon name="check" size={13} stroke={2.6} />{f}</span>)}</div></C.Opt>
  </C.Detail>
}
function PayBill({ pick }: any) {
  const c = St.useS(s => s.card); const M = useMarket()
  const dd = () => openConfirm(ddAsk('full') as any)
  if (c.due <= 0) return <><D.AssistantNote>{`Paid. Nothing is due now${c.autopay ? `; ${M.directDebit} is set up for the next bill` : ''}.`}</D.AssistantNote>{!c.autopay && Mod.on('card.directdebit') && <div className="ds-btnrow"><D.Pill onClick={dd}>{M.t('setUp', { dd: M.directDebit })}</D.Pill></div>}</>
  const first = pick === 'min' && c.min > 0 ? 'min' : 'full'
  const full = <D.Pill key="f" primary={first === 'full'} onClick={() => respond(F.payBillAsk({ amount: c.due }))}>{`Pay ${M.money(c.due, 2)}`}</D.Pill>
  const min = c.min > 0 ? <D.Pill key="m" primary={first === 'min'} onClick={() => respond(F.payBillAsk({ amount: c.min }))}>{`Minimum ${M.money(c.min, 2)}`}</D.Pill> : null
  return <D.Amount label={`Due ${M.date(c.dueDate, 'day')}`} right={`•••• ${c.last4}`} value={M.money(c.due, 2)} meta={c.min > 0 ? `Minimum ${M.money(c.min, 2)}` : 'Minimum paid'}>
    <div className="ds-ac-pills">{first === 'min' ? [min, full] : [full, min]}{Mod.on('card.pay') && <D.Pill onClick={() => W.__go?.('cardx', 'pay:other')}>Other amount</D.Pill>}{!c.autopay && Mod.on('card.directdebit') && <D.Pill onClick={dd}>{M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)}</D.Pill>}</div>
  </D.Amount>
}
function InvestBlock({ id: id0, pts: pts0 }: any) {
  const [id, setId] = useState(id0 || 'IV-1'); const bal = St.useS(s => s.balance); const M = useMarket(); const [ok, setOk] = useState(false); const [p, setP] = useState(pts0 || 5000)
  const i = Cat.INVEST.find(x => x.id === id)!, min = F.investMin(id)
  const chips = [...new Set([1000, 5000, 10000, 20000, ...(pts0 ? [pts0] : [])])].sort((a, b) => a - b).filter(x => x <= bal && x >= min)
  const pp = chips.includes(p) ? p : chips[0]
  const art = Cat.img(['money:gold', 'money:fund', 'money:savings'][Cat.INVEST.indexOf(i)])
  return <div className="gr-col" style={{ gap: 12 }}><D.Seg items={['Gold', 'Index fund', 'Savings']} value={['Gold', 'Index fund', 'Savings'][Cat.INVEST.indexOf(i)]} onChange={(t: string) => { setId(Cat.INVEST[['Gold', 'Index fund', 'Savings'].indexOf(t)].id); setOk(false) }} />
    <C.Detail art={art} title={i.title} sub={i.gbp ? `${M.money(F.P(i.gbp))} ${i.unit}` : i.unit} checks={[i.sub, 'Handled by Northgate Invest, a licensed partner']} note={{ title: 'Before you invest', body: i.risk.join(' ') }} cta="Continue with the partner" disabled={!ok || !pp || !chips.length} onCta={() => run({ f: 'investDo', a: { id, pts: pp } }, `Put ${M.num(pp)} points into ${i.title}`)} caption={chips.length ? `${M.pts(pp)} = ${M.money(pp * St.rate(), (pp * St.rate()) % 1 ? 2 : 0)}${min > 100 ? ` · minimum ${M.pts(min)}` : ''}` : `You need at least ${M.pts(min)} for this.`}>
      {chips.length > 0 && <C.Opt label="How many points"><div className="app-days ds-count" role="radiogroup" aria-label="How many points">{chips.map(x => <button key={x} className="gr-slot" role="radio" aria-checked={pp === x} onClick={() => setP(x)}>{M.num(x)}</button>)}</div></C.Opt>}
      {chips.length > 0 && <div className="ds-list ds-inset"><D.ToggleRow title="I've read the risks and this is my own decision" on={ok} onChange={setOk} /></div>}
    </C.Detail></div>
}
function ConciergeForm({ hint, bk }: any) {
  const h = (hint || '').toLowerCase()
  const guess = /table|restaurant|dinner/.test(h) ? 0 : /gift|present/.test(h) ? 1 : /ticket|gig|concert|match|show/.test(h) ? 2 : /trip|holiday|anniversary|honeymoon/.test(h) ? 3 : /clean|repair|plumb|home/.test(h) ? 4 : -1
  const [what, setWhat] = useState(guess >= 0 ? Cat.CONCIERGE[guess] : ''); const [txt, setTxt] = useState(hint || ''); const [done, setDone] = useDone(bk)
  return <C.Detail art={Cat.img('money:bell')} title="Concierge" sub="A person on the team takes it from here" checks={['They reply in this chat, usually within the hour', 'Nothing is booked or paid without you']} cta="Send to the concierge" done={done ? 'Sent to the concierge' : undefined} disabled={!what || done} onCta={() => { setDone(true); run({ f: 'concierge', a: { brief: `${what}${txt ? ': ' + txt : ''}` } }, what) }}>
    <C.Opt label="What do you need?"><D.Choice list label="What do you need?" items={Cat.CONCIERGE.map(c => ({ key: c, title: c }))} value={what} onChange={setWhat} /></C.Opt>
    <C.Opt label="Details"><textarea className="app-ta" placeholder="Date, budget, anything they should know" value={txt} onChange={e => setTxt(e.target.value)} aria-label="Details" /></C.Opt>
  </C.Detail>
}

/* chat input hook-up */
let sendTextFn = (s: string) => { }
export const setSendText = (f: (s: string) => void) => { sendTextFn = f }
export const sendText = (s: string) => sendTextFn(s)
