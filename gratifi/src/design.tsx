/* The approved Gratifi screens (27 Sep design canvas), as components.
   Every piece here is taken from those screens; sizes and colours follow them. */
import { React, useState, useEffect, useRef } from '../../kit/src/r'
import { Icon, Spark } from '../../kit/src/icons'
import ring from './art/ring.svg'
import wordmark from './art/wordmark.svg'
import clip from './art/clip.svg'
import check from './art/check.svg'
import stHotel from './art/st-hotel.svg'
import stPlane from './art/st-plane.svg'
import stBalloon from './art/st-balloon.svg'
import stTakeaway from './art/st-takeaway.svg'
import stTicket from './art/st-ticket.svg'
import stBag from './art/st-bag.svg'
import stMusic from './art/st-music.svg'
import stCar from './art/st-car.svg'
import stDining from './art/st-dining.svg'
import stGift from '../../pwa/src/assets/stamp-gift.svg'

export const ART = { ring, wordmark, clip, check }
/** One postage stamp per category, from the approved artwork. Categories without a stamp have none. */
export const STAMP: Record<string, string> = { stays: stHotel, flights: stPlane, experiences: stBalloon, dining: stDining, quick: stTakeaway, tickets: stTicket, shopping: stBag, subs: stMusic, rides: stCar, giftcards: stGift }

/** Round white header button (back, close, search, avatar, bell). */
export function HBtn({ icon, label, onClick, dot, text }: { icon?: string; label: string; onClick?: () => void; dot?: boolean; text?: string }) {
  return <button className="ds-hb" aria-label={label} onClick={onClick}>{text ? <span className="ds-hb-t">{text}</span> : <Icon name={icon!} size={icon === 'close' ? 18 : 20} stroke={2.2} />}{dot && <span className="ds-hb-dot" />}</button>
}

/** Sheet header: back on the leading side, title in the middle, close or a text action on the trailing side. */
export function Head({ title, onBack, right }: { title: string; onBack?: () => void; right?: any }) {
  return <div className="ds-head">{onBack ? <HBtn icon="back" label="Back" onClick={onBack} /> : <span className="ds-hb-gap" />}<h1 className="ds-head-t">{title}</h1>{right || <span className="ds-hb-gap" />}</div>
}

/** Section heading with an optional See all. */
export function Sec({ title, more, onMore }: { title: string; more?: string; onMore?: () => void }) {
  return <div className="ds-sec"><h2>{title}</h2>{more && <button className="ds-more" onClick={onMore}>{more}</button>}</div>
}

/** A number that counts to its new value when it changes, the way banking apps show a balance moving. */
const lastSeen: Record<string, number> = {}
export function CountUp({ value, format, id = 'balance' }: { value: number; format: (n: number) => string; id?: string }) {
  const start = lastSeen[id] ?? value
  const [shown, setShown] = useState(start); const from = useRef(start)
  useEffect(() => {
    const a = from.current, b = value; from.current = value; lastSeen[id] = value
    if (a === b || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) { setShown(b); return }
    let raf = 0; const t0 = performance.now(), dur = 700
    const step = (t: number) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); setShown(Math.round(a + (b - a) * e)); if (k < 1) raf = requestAnimationFrame(step) }
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{format(shown)}</>
}

/** Points card: tier ring with the tier in a black core, balance, Use points. */
export function PointsCard({ tier, value, onUse, useLabel = 'Use points' }: { tier: string; value: any; onUse: () => void; useLabel?: string }) {
  return <div className="ds-pts">
    <div className="ds-ring"><img src={ring} alt="" /><div className="ds-core"><span>{tier.toUpperCase()}</span></div></div>
    <div className="ds-pts-b"><p className="ds-pts-l">Your points</p><p className="ds-pts-v">{value}</p><button className="ds-pill" onClick={onUse}>{useLabel}</button></div>
  </div>
}

/** Gratifi's clipped note: handwritten title, one line of why, a yes and a not now. */
export function Note({ title, children, action, onAction, secondary, onSecondary }: { title: string; children: any; action?: string; onAction?: () => void; secondary?: string; onSecondary?: () => void }) {
  return <div className="ds-note"><div className="ds-note-in"><p className="ds-note-t">{title}</p><p className="ds-note-b">{children}</p>
    {(action || secondary) && <div className="ds-note-a">{action && <button className="ds-btn40" onClick={onAction}>{action}</button>}{secondary && <button className="ds-btn40 ds-white" onClick={onSecondary}>{secondary}</button>}</div>}</div>
    <img className="ds-clip" src={clip} alt="" /></div>
}

/** Stamp rail: categories collected like postage stamps. */
export function Stamps({ items }: { items: { key: string; label: string; art: string; badge?: string; onClick: () => void }[] }) {
  const tilt = [-3, 2, -2, 3]
  return <div className="ds-stamps" role="list">{items.map((x, i) => <button key={x.key} role="listitem" className="ds-stamp" onClick={x.onClick}><img src={x.art} alt="" style={{ transform: `rotate(${tilt[i % 4]}deg)` }} /><span>{x.label}</span>{x.badge && <b className="ds-stamp-badge">{x.badge}</b>}</button>)}</div>
}

/** Offer as a small card in a rail: stamp, what it is, until when, Add or Added. */
export function OfferMini({ art, title, sub, added, onAdd }: { art: string; title: string; sub: string; added?: boolean; onAdd: () => void }) {
  return <div className="ds-offer"><img src={art} alt="" /><div className="ds-offer-b"><p className="ds-offer-t">{title}</p><p className="ds-offer-s">{sub}</p></div>
    {added ? <button className="ds-added" aria-pressed="true" onClick={onAdd}><Icon name="check" size={13} stroke={2.6} />Added</button> : <button className="ds-add" aria-pressed="false" onClick={onAdd}>Add</button>}</div>
}

/** Coming up: the next booking or order, with its status. */
export function Coming({ art, title, sub, status, tone, onClick }: { art?: string; icon?: string; title: string; sub: string; status: string; tone?: 'good' | 'warn'; onClick: () => void }) {
  return <button className="ds-coming" onClick={onClick}>{art ? <img src={art} alt="" /> : <span className="ds-coming-ph" />}<span className="ds-coming-b"><span className="ds-coming-t">{title}</span><span className="ds-coming-s">{sub}</span><span className={'ds-status' + (tone === 'warn' ? ' ds-warn' : '')}><i />{status}</span></span><Icon name="chev" size={18} stroke={2.2} /></button>
}

/** Book again: past orders as chips with their stamp. */
export function Again({ items }: { items: { key: string; label: string; art?: string; onClick: () => void }[] }) {
  return <div className="ds-again">{items.map(x => <button key={x.key} onClick={x.onClick}>{x.art && <img src={x.art} alt="" />}{x.label}</button>)}</div>
}

/** Picked for you: two polaroids at most. */
export function Picks({ items }: { items: { key: string; art: string; title: string; sub: string; price: string; onUse: () => void }[] }) {
  return <div className="ds-picks">{items.slice(0, 2).map((x, i) => <div key={x.key} className="ds-polaroid" style={{ transform: `rotate(${i ? 1.5 : -1.5}deg)` }}><img src={x.art} alt="" /><p className="ds-pol-t">{x.title}</p><p className="ds-pol-s">{x.sub}</p><div className="ds-pol-f"><span>{x.price}</span><button className="ds-pill32" onClick={x.onUse}>Use now</button></div></div>)}</div>
}

/** A white list card with rows: icon in a grey circle, title, meta, a value or status on the trailing side. */
export function List({ children }: { children: any }) { return <div className="ds-list">{children}</div> }
export function Row({ icon, title, sub, value, tone, onClick, chev, sparkSub, meta }: { icon?: string; title: any; sub?: any; value?: any; tone?: 'good'; onClick?: () => void; chev?: boolean; sparkSub?: boolean; meta?: string }) {
  const inner = <>{icon && <span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span>}<span className="ds-row-b"><span className="ds-row-t">{title}</span>{sub && <span className="ds-row-s">{sparkSub && <Spark size={12} />}{sub}</span>}</span>{value != null && <span className={'ds-row-v' + (tone === 'good' ? ' ds-good' : '')}>{value}</span>}{meta && <span className="ds-row-meta">{meta}</span>}{chev && <Icon name="chev" size={16} stroke={2.2} />}</>
  return onClick ? <button className="ds-row" onClick={onClick}>{inner}</button> : <div className="ds-row">{inner}</div>
}
/** Toggle row inside a list card. */
export function ToggleRow({ title, sub, on, onChange, lock, dim }: { title: string; sub?: string; on: boolean; onChange: (v: boolean) => void; lock?: boolean; dim?: boolean }) {
  return <div className={'ds-trow' + (dim ? ' ds-dim' : '')}><span className="ds-row-b"><span className="ds-row-t">{title}</span>{sub && <span className="ds-row-s">{sub}</span>}</span><button role="switch" aria-checked={on} aria-label={title} className="ds-toggle" disabled={lock || dim} onClick={() => onChange(!on)}>{lock && <Icon name="lock" size={12} stroke={2.4} />}</button></div>
}
/** Segmented control: two to four tabs in a grey track. */
export function Seg({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="ds-seg" role="tablist">{items.map(x => <button key={x} role="tab" aria-selected={value === x} onClick={() => onChange(x)}>{x}</button>)}</div>
}

/** Grey label above a group. */
export function Label({ children }: { children: any }) { return <p className="ds-label">{children}</p> }

/** Reward card in a two-column grid: picture, name, points, Use now. */
export function RewardCard({ art, icon, title, price, short, onUse, onOpen }: { art?: string; icon?: string; title: string; price: string; short?: string; onUse: () => void; onOpen: () => void }) {
  return <div className="ds-rcard"><button className="ds-rcard-ph" onClick={onOpen} aria-label={title}>{art ? <img src={art} alt="" /> : <span className="ds-rcard-ic"><Icon name={icon || 'gift'} size={28} stroke={1.8} /></span>}</button><div className="ds-rcard-b"><p className="ds-rcard-t">{title}</p><div className="ds-rcard-f"><span>{price}</span>{short ? <span className="ds-rcard-short">{short}</span> : <button className="ds-pill30" onClick={onUse}>Use now</button>}</div></div></div>
}

/** Orange check in a circle, for done states. */
export function DoneCheck() { return <div className="ds-done"><img src={check} alt="" /></div> }

/* ---------- Card and servicing elements. Each one is an element from the approved screens, used for card data. ---------- */

/** The orange-spark mark the assistant signs its lines with. */
export function SparkMark({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF6A1F" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M11 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /><path d="M18.5 14.5c.3 2.2 1.1 3 3.3 3.3-2.2.3-3 1.1-3.3 3.3-.3-2.2-1.1-3-3.3-3.3 2.2-.3 3-1.1 3.3-3.3z" /></svg> }

/** The progress bar from Your tier and the goal screen: a 10px grey track, filled orange (or black for a goal). */
export function Bar({ used, label, tone = 'orange', thin }: { used: number; label: string; tone?: 'orange' | 'black'; thin?: boolean }) {
  const pct = Math.round(Math.max(0, Math.min(1, used)) * 100)
  return <div className={'ds-bar' + (thin ? ' thin' : '')} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}><i className={tone} style={{ width: `${pct}%` }} /></div>
}
/** Kept for older callers: now the approved bar. */
export function TickMeter({ used, label }: { used: number; ticks?: number; label: string }) { return <Bar used={used} label={label} /> }

/** White outline pill from the bank screen (Pay, Move money). Black when it is the one thing to do. */
export function Pill({ children, onClick, primary, icon }: { children: any; onClick: () => void; primary?: boolean; icon?: string }) { return <button className={'ds-opill' + (primary ? ' primary' : '')} onClick={onClick}>{icon && <Icon name={icon} size={15} stroke={2.2} />}{children}</button> }

/** The account card from the bank screen: label and last four digits, the balance, then pills. Credit use shows on the approved bar. */
export function CardFace({ last4, balance, available, frozen, dueLine, onPay, onOpen, used, extra, freeze, title = 'Gratifi Card', children }: { balLabel?: string; last4: string; balance: any; available?: string; limit?: string; frozen?: boolean; dueLine: string; onPay?: () => void; onFreeze?: () => void; onOpen?: () => void; freezeLabel?: string; used?: number; noDue?: boolean; extra?: { label: string; onClick: () => void }[]; freeze?: { on: boolean; onChange: (v: boolean) => void }; title?: string; children?: any }) {
  const top = <>
    <span className="ds-ac-top"><span>{frozen ? <span className="ds-ac-frozen"><i />Frozen</span> : title}</span><span className="ds-ac-r">{`•••• ${last4}`}{onOpen && <Icon name="chev" size={16} stroke={2.2} />}</span></span>
    <span className="ds-ac-v">{balance}</span>
    <span className="ds-ac-m">{dueLine}</span>
  </>
  return <div className={'ds-account' + (frozen ? ' ds-is-frozen' : '')}>
    {onOpen ? <button className="ds-ac-open" onClick={onOpen} aria-label="Open My card">{top}</button> : <div className="ds-ac-open">{top}</div>}
    {(onPay || extra?.length) && <div className="ds-ac-pills">{onPay && <Pill primary onClick={onPay}>Pay</Pill>}{extra?.map(x => <Pill key={x.label} onClick={x.onClick}>{x.label}</Pill>)}</div>}
    {freeze && <div className="ds-ac-freeze"><ToggleRow title="Freeze card" sub={freeze.on ? 'New payments are blocked' : undefined} on={freeze.on} onChange={freeze.onChange} /></div>}
    {children}
  </div>
}
/** Rows with a trailing grey word, as in Already included (Heathrow lounge · Free). */
export function Included({ items }: { items: { key: string; icon: string; title: string; sub: string; meta?: string; onClick: () => void }[] }) {
  return <div className="ds-list">{items.map(x => <button key={x.key} className="ds-row" onClick={x.onClick}><span className="ds-row-ic"><Icon name={x.icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{x.sub}</span></span>{x.meta && <span className="ds-row-meta">{x.meta}</span>}</button>)}</div>
}
/** Kept for older callers. */
export function BenefitTiles({ items }: { items: { key: string; icon: string; title: string; sub: string; value?: string; onClick: () => void }[] }) { return <Included items={items.map(x => ({ ...x, meta: x.value || 'Included' }))} /> }

/** The Three ways to get there card: a sparked heading, then rows with a circle icon and an outline pill. */
export function Ways({ title, items }: { title: string; items: { key: string; icon: string; title: string; sub: string; action?: string; onAction?: () => void; done?: string }[] }) {
  return <div className="ds-ways"><div className="ds-ways-h"><SparkMark /><p>{title}</p></div>
    {items.map(x => <div key={x.key} className="ds-ways-r"><span className="ds-row-ic"><Icon name={x.icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{x.sub}</span></span>{x.done ? <span className="ds-dot-status"><i />{x.done}</span> : x.action && <Pill onClick={x.onAction!}>{x.action}</Pill>}</div>)}</div>
}
/** Challenges as the Three ways card. */
export function Challenges({ items, title = 'Earn more this month' }: { title?: string; items: { key: string; title: string; reward: string; progress: number; target: number; progressText: string; joined: boolean; onJoin: () => void; icon?: string }[] }) {
  return <Ways title={title} items={items.map(x => ({ key: x.key, icon: x.icon || 'star', title: x.title, sub: `${x.progressText} · ${x.reward}`, action: x.joined ? undefined : 'Join', onAction: x.onJoin, done: x.joined ? 'Joined' : undefined }))} />
}

/** Kept for older callers; the round action row is gone from the design. */
export function Actions(_: { items: any[] }) { return null }

/** Where the money went, in the Your tier card style: a label and amount over an orange bar, per category. */
export function SpendBars({ period, items, total, format }: { period: string; items: { label: string; amount: number }[]; total: number; format: (n: number) => string }) {
  const max = Math.max(1, ...items.map(i => i.amount))
  return <div className="ds-card ds-spend"><div className="ds-kvh"><span>{period}</span><b>{format(total)}</b></div>
    {items.length ? items.map(x => <div key={x.label} className="ds-spend-row"><div className="ds-kvh"><span>{x.label}</span><b>{format(x.amount)}</b></div><Bar used={x.amount / max} label={`${x.label}, ${format(x.amount)}`} tone="black" thin /></div>) : <p className="ds-row-s">No card spending in this period.</p>}
  </div>
}
/** A card payment, as on the bank screen: card icon in a grey circle, where and when, amount. */
/** Icon for each kind of card payment, so a list reads at a glance. */
export const CAT_ICON: Record<string, string> = { Groceries: 'bag', Travel: 'plane', Dining: 'fork', Shopping: 'gift', Transport: 'car', Subscriptions: 'refresh', Entertainment: 'ticket', 'Gift cards': 'gift', Concierge: 'bell', Payment: 'arrow', Other: 'card' }
export function Txn({ name, meta, amount, points, refund, format, onClick, cat, chev }: { name: string; meta: string; amount: number; points?: number; refund?: boolean; format: (n: number) => string; onClick?: () => void; cat?: string; chev?: boolean }) {
  const El: any = onClick ? 'button' : 'div'
  return <El className="ds-row ds-txn" onClick={onClick}><span className="ds-row-ic"><Icon name={refund ? 'arrow' : CAT_ICON[cat || ''] || 'card'} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{name}</span><span className="ds-row-s">{meta}</span></span><span className="ds-txn-r"><span className={'ds-row-v' + (refund || amount < 0 ? ' ds-good' : '')}>{`${refund || amount < 0 ? '+' : '−'}${format(Math.abs(amount))}`}</span>{points ? <span className="ds-txn-pts">{`+${points} points`}</span> : null}</span>{chev && <Icon name="chev" size={16} stroke={2.2} />}</El>
}
/** The bill, in the account card format: when it is due, the amount, the minimum, two pills. */
export function DueCard({ amount, date, min, onFull, onMin, paid }: { amount: string; date: string; min: string; onFull: () => void; onMin: () => void; paid?: boolean }) {
  return <div className="ds-account"><span className="ds-ac-top"><span>{paid ? 'Nothing to pay now' : `Due ${date}`}</span><span /></span><span className="ds-ac-v">{amount}</span>{!paid && <span className="ds-ac-m">{`Minimum ${min}`}</span>}
    {!paid && <div className="ds-ac-pills"><Pill primary onClick={onFull}>Pay in full</Pill><Pill onClick={onMin}>Pay the minimum</Pill></div>}</div>
}

/** A row with a pill on the trailing side, as in Three ways to get there and Your Lisbon trip (Find flights). */
export function ActionRow({ icon, title, sub, action, onAction, primary }: { icon: string; title: string; sub: string; action: string; onAction: () => void; primary?: boolean }) {
  return <div className="ds-row"><span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{title}</span><span className="ds-row-s">{sub}</span></span><Pill primary={primary} onClick={onAction}>{action}</Pill></div>
}

/** A switch row, exactly as in How should I help: title, one line, the switch. */
export function ControlRow({ title, sub, on, onChange }: { icon?: string; title: string; sub: string; on: boolean; onChange: (v: boolean) => void }) {
  return <ToggleRow title={title} sub={sub} on={on} onChange={onChange} />
}

/** One choice from a few, as the Where can I reach you chips: black with a tick when picked. */
export function Choice({ items, value, onChange, label, list }: { items: { key: string; title: string; sub?: string; value?: string; disabled?: boolean }[]; value: string; onChange: (k: string) => void; label: string; list?: boolean }) {
  const cur = items.find(x => x.key === value)
  if (list) return <div className="ds-list" role="radiogroup" aria-label={label}>{items.map(x => <button key={x.key} role="radio" aria-checked={value === x.key} disabled={x.disabled} className="ds-row ds-pickrow-l" onClick={() => onChange(x.key)}><span className="ds-row-b"><span className="ds-row-t">{x.title}</span>{x.sub && <span className="ds-row-s">{x.sub}</span>}</span>{x.value && <span className="ds-row-meta">{x.value}</span>}<span className="ds-tick" aria-hidden="true">{value === x.key && <Icon name="check" size={14} stroke={2.6} />}</span></button>)}</div>
  return <div className="ds-choice-w"><div className="ds-pickrow" role="radiogroup" aria-label={label}>{items.map(x => <button key={x.key} role="radio" aria-checked={value === x.key} disabled={x.disabled} className="ds-pick" onClick={() => onChange(x.key)}>{value === x.key && <Icon name="check" size={14} stroke={2.6} />}{x.value ? `${x.title} · ${x.value}` : x.title}</button>)}</div>{cur?.sub && <span className="ds-row-s">{cur.sub}</span>}</div>
}
/** A labelled field on a white card, the ask bar's input made still. */
export function Field({ label, value, onChange, prefix, type = 'text', inputMode, placeholder, max, hint, id, autoFocus }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; type?: string; inputMode?: any; placeholder?: string; max?: number; hint?: string; id?: string; autoFocus?: boolean }) {
  return <label className="ds-field"><span className="ds-field-l">{label}</span><span className="ds-field-w">{prefix && <span className="ds-field-p">{prefix}</span>}<input id={id} type={type} inputMode={inputMode} value={value} placeholder={placeholder} maxLength={max} autoFocus={autoFocus} onChange={e => onChange((e.target as HTMLInputElement).value)} /></span>{hint && <span className="ds-row-s">{hint}</span>}</label>
}

/** Search in the ask bar's white pill. */
export function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return <label className="ds-search"><Icon name="search" size={18} stroke={2.2} /><input type="search" value={value} placeholder={placeholder} aria-label={placeholder} onChange={e => onChange((e.target as HTMLInputElement).value)} />{value && <button className="ds-x" aria-label="Clear search" onClick={e => { e.preventDefault(); onChange('') }}><Icon name="close" size={12} stroke={2.4} /></button>}</label>
}

/** Filter chips, as on Rewards. */
export function Chips({ items, value, onChange, label }: { items: { key: string; label: string }[]; value: string; onChange: (k: string) => void; label: string }) {
  return <div className="ds-chiprow" role="group" aria-label={label}>{items.map(x => <button key={x.key} className="ds-chip" aria-pressed={value === x.key} onClick={() => onChange(x.key)}>{x.label}</button>)}</div>
}

/** Where something has got to, as the What happened card: black dots for done, orange for now, grey for still to come. */
export function Track({ steps, current, eta, tone, title = 'Where it is', sub, children }: { steps: string[]; current: number; eta?: string; tone?: 'warn' | 'good'; title?: string; sub?: string; children?: any }) {
  return <div className="ds-timeline"><div><p className="ds-tl-h">{title}</p>{sub && <p className="ds-row-s" style={{ margin: 0 }}>{sub}</p>}</div><ol>{steps.map((s, i) => { const state = i < current ? 'done' : i === current ? 'now' : 'next'; return <li key={s} className={state} aria-current={state === 'now' ? 'step' : undefined}><i />{state === 'now' && eta && <span className={'ds-tl-d' + (tone === 'warn' ? ' warn' : '')}>{eta}</span>}<span className="ds-tl-t">{s}</span></li> })}</ol>{children}</div>
}

/** A label and value table, as on the booking screen (Points spent · 8,200). */
export function KV({ rows }: { rows: { label: string; value: any; copy?: () => void; copyLabel?: string }[] }) {
  return <div className="ds-kv-card">{rows.map(r => <div key={r.label} className="ds-kv-r"><span>{r.label}</span><b>{r.value}{r.copy && <button className="ds-x ds-copy" aria-label={r.copyLabel || `Copy ${r.label.toLowerCase()}`} onClick={r.copy}><Icon name="copy" size={13} stroke={2.2} /></button>}</b></div>)}</div>
}

/** The card's details in the booking-table format, then the Confirm with Face ID button to show them. */
export function CardDetails({ name, number, expiry, cvv, shown, left, onShow, onHide, onCopy, frozen, showLabel = 'Show card details' }: { name: string; number: string; expiry: string; cvv: string; shown: boolean; left: number; onShow: () => void; onHide: () => void; onCopy: (what: string, v: string) => void; frozen?: boolean; showLabel?: string }) {
  const mask = (x: string) => x.replace(/\d(?=.*\d{4})/g, '•')
  return <>
    <div className="ds-kv-card">
      {[{ label: 'Card number', v: shown ? number : mask(number), c: number.replace(/\s/g, '') }, { label: 'Expires', v: shown ? expiry : '••/••', c: expiry }, { label: 'Security code', v: shown ? cvv : '•••', c: cvv }].map(r => <div key={r.label} className="ds-kv-r"><span>{r.label}</span><b><span className="ds-num">{r.v}</span>{shown && <button className="ds-x ds-copy" aria-label={`Copy ${r.label.toLowerCase()}`} onClick={() => onCopy(r.label, r.c)}><Icon name="copy" size={13} stroke={2.2} /></button>}</b></div>)}
      <div className="ds-kv-r"><span>Name on card</span><b>{name}</b></div>
      <div className="ds-kv-foot">{shown ? <><span className="ds-row-s">{`Hides by itself in ${left} s`}</span><Pill onClick={onHide}>Hide now</Pill></> : <><span className="ds-row-s">Hidden until you confirm it's you</span><Pill primary icon="faceid" onClick={onShow}>{showLabel}</Pill></>}</div>
    </div>
    {frozen && <AssistantNote>Your card is frozen. The details still show, but payments won't go through until you unfreeze it.</AssistantNote>}
  </>
}
/** The big number from the Details screen (+640), used for the PIN. */
export function Hero({ value, title, sub, tone }: { value?: string; title?: string; sub?: string; tone?: 'good' }) {
  return <div className="ds-hero">{value && <p className={'ds-hero-v' + (tone === 'good' ? ' good' : '')}>{value}</p>}{title && <p className="ds-hero-t">{title}</p>}{sub && <p className="ds-hero-s">{sub}</p>}</div>
}
export function PinBox({ pin, shown }: { pin: string; shown: boolean }) {
  return <div role="img" aria-label={shown ? `PIN ${pin.split('').join(' ')}` : 'PIN hidden'}><Hero value={shown ? pin.split('').join(' ') : '• • • •'} /></div>
}

/** A monthly limit: a row with the approved bar under the line, and an outline pill. */
export function LimitRow({ icon, title, spent, limit, used, action, onAction }: { icon: string; title: string; spent: string; limit?: string; used: number; action: string; onAction: () => void }) {
  return <div className="ds-row ds-limit"><span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{title}</span><span className="ds-row-s">{limit ? `${spent} of ${limit} in 30 days` : `${spent} in 30 days · no limit`}</span>{limit && <Bar used={used} thin label={`${title}: ${spent} of ${limit}`} />}</span><Pill onClick={onAction}>{action}</Pill></div>
}

/** The pale-yellow assistant strip from the Details screen (Done by your assistant). */
export function AssistantNote({ children }: { children: any }) { return <div className="ds-anote"><SparkMark /><p>{children}</p></div> }

/** A short confirmation, in the same pale-yellow assistant strip, above the ask bar. */
let toastSet: (t: string) => void = () => { }
export function toast(t: string) { toastSet(t) }
export function ToastHost() {
  const [t, setT] = useState(''); const timer = useRef<any>(0)
  toastSet = (x: string) => { setT(x); clearTimeout(timer.current); timer.current = setTimeout(() => setT(''), 2800) }
  return <div className="ds-toast-w" aria-live="polite">{t && <div className="ds-toast" key={t}><SparkMark size={16} />{t}</div>}</div>
}

/** The big black button (View your trip, Confirm with Face ID). */
export function Primary({ children, onClick, disabled }: { children: any; onClick: () => void; disabled?: boolean }) { return <button className="ds-btn48" disabled={disabled} onClick={onClick}>{children}</button> }
/** The big white button (Back to home). */
export function Secondary({ children, onClick }: { children: any; onClick: () => void }) { return <button className="ds-btn48 ds-btn48-w" onClick={onClick}>{children}</button> }

/** An empty or unavailable state: one plain line, and a way forward if there is one. */
export function Empty({ title, body, action, onAction }: { title: string; body?: string; action?: string; onAction?: () => void }) {
  return <div className="ds-card ds-empty"><b>{title}</b>{body && <span className="ds-row-s">{body}</span>}{action && <Pill primary onClick={onAction!}>{action}</Pill>}</div>
}

/** The account card format for a single amount: a grey label line, the number, a grey meta line, and pills. */
export function Amount({ label, right, value, meta, tone, children }: { label: string; right?: string; value: string; meta?: string; tone?: 'good'; children?: any }) {
  return <div className="ds-account"><span className="ds-ac-top"><span>{label}</span><span>{right || ''}</span></span><span className={'ds-ac-v' + (tone === 'good' ? ' ds-good' : '')}>{value}</span>{meta && <span className="ds-ac-m">{meta}</span>}{children}</div>
}

/** The cream line with an orange dot from the bank screen's points card (2,400 expire Sunday). */
export function CreamRow({ children, onClick }: { children: any; onClick?: () => void }) {
  const inner = <><i className="ds-cream-dot" /><span>{children}</span>{onClick && <Icon name="chev" size={16} stroke={2.2} />}</>
  return onClick ? <button className="ds-cream" onClick={onClick}>{inner}</button> : <div className="ds-cream">{inner}</div>
}
