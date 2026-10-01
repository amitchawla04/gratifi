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
export function Row({ icon, title, sub, value, tone, onClick, chev, sparkSub }: { icon?: string; title: any; sub?: any; value?: any; tone?: 'good'; onClick?: () => void; chev?: boolean; sparkSub?: boolean }) {
  const inner = <>{icon && <span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span>}<span className="ds-row-b"><span className="ds-row-t">{title}</span>{sub && <span className="ds-row-s">{sparkSub && <Spark size={12} />}{sub}</span>}</span>{value != null && <span className={'ds-row-v' + (tone === 'good' ? ' ds-good' : '')}>{value}</span>}{chev && <Icon name="chev" size={16} stroke={2.2} />}</>
  return onClick ? <button className="ds-row" onClick={onClick}>{inner}</button> : <div className="ds-row">{inner}</div>
}

/** Toggle row inside a list card. */
export function ToggleRow({ title, sub, on, onChange, lock }: { title: string; sub?: string; on: boolean; onChange: (v: boolean) => void; lock?: boolean }) {
  return <div className="ds-trow"><span className="ds-row-b"><span className="ds-row-t">{title}</span>{sub && <span className="ds-row-s">{sub}</span>}</span><button role="switch" aria-checked={on} aria-label={title} className="ds-toggle" disabled={lock} onClick={() => onChange(!on)}>{lock && <Icon name="lock" size={12} stroke={2.4} />}</button></div>
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

/* ---------- Card elements, extrapolated from the approved library ---------- */

/** Ticks in a line, the points dial unrolled: orange for what is used, grey for what is left. */
export function TickMeter({ used, ticks = 36, label }: { used: number; ticks?: number; label: string }) {
  const on = Math.round(Math.max(0, Math.min(1, used)) * ticks)
  return <div className="ds-ticks" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(used * 100)} aria-label={label}>{Array.from({ length: ticks }, (_, i) => <i key={i} className={i < on ? 'on' : ''} />)}</div>
}

/** The card itself: name, last four digits, balance, how much of the limit is used, and when the bill is due. */
export function CardFace({ last4, balance, available, limit, frozen, dueLine, onPay, onFreeze, onOpen, freezeLabel, used, noDue }: { last4: string; balance: any; available: string; limit: string; frozen?: boolean; dueLine: string; onPay: () => void; onFreeze: () => void; onOpen?: () => void; freezeLabel: string; used: number; noDue?: boolean }) {
  const body = <>
    <span className="ds-cf-top"><span className="ds-cf-chip" aria-hidden="true"><i /></span><span className="ds-cf-name">Gratifi Card</span><span className="ds-cf-num">{`•••• ${last4}`}</span>{frozen && <span className="ds-cf-frozen"><Icon name="lock" size={12} stroke={2.4} />Frozen</span>}</span>
    <span className="ds-cf-l">Balance</span>
    <span className="ds-cf-v">{balance}</span>
  </>
  return <div className={'ds-cardface' + (frozen ? ' ds-is-frozen' : '')}>
    {onOpen ? <button className="ds-cf-open" onClick={onOpen} aria-label="Open My card">{body}</button> : <div className="ds-cf-open">{body}</div>}
    <TickMeter used={used} label="Credit used" />
    <div className="ds-cf-lim"><span>{`${available} available`}</span><span>{`of ${limit}`}</span></div>
    {!noDue && <div className="ds-cf-due"><span>{dueLine}</span><div className="ds-cf-btns"><button className="ds-btn40 ds-white ds-outline" onClick={onFreeze}>{freezeLabel}</button><button className="ds-btn40" onClick={onPay}>Pay</button></div></div>}
  </div>
}

/** Round actions with a word underneath, the header buttons grown into a row. */
export function Actions({ items }: { items: { icon: string; label: string; onClick: () => void; on?: boolean }[] }) {
  return <div className="ds-actions">{items.map(x => <button key={x.label} className="ds-act" onClick={x.onClick}><span className={'ds-act-ic' + (x.on ? ' on' : '')}><Icon name={x.icon} size={22} stroke={2} /></span><span className="ds-act-l">{x.label}</span></button>)}</div>
}

/** A card benefit as a tile in a rail: what it is, and what is left of it. */
export function BenefitTiles({ items }: { items: { key: string; icon: string; title: string; sub: string; value?: string; onClick: () => void }[] }) {
  return <div className="ds-btiles" role="list">{items.map(x => <button key={x.key} role="listitem" className="ds-btile" onClick={x.onClick}><span className="ds-row-ic"><Icon name={x.icon} size={18} stroke={2} /></span>{x.value && <b className="ds-btile-v">{x.value}</b>}<span className="ds-btile-t">{x.title}</span><span className="ds-btile-s">{x.sub}</span></button>)}</div>
}

/** Where the money went: one bar per category, longest first, the top one in orange. */
export function SpendBars({ period, items, total, format }: { period: string; items: { label: string; amount: number }[]; total: number; format: (n: number) => string }) {
  const max = Math.max(1, ...items.map(i => i.amount))
  return <div className="ds-card ds-spend"><div className="ds-spend-hd"><span>{period}</span><b>{format(total)}</b></div>
    {items.length ? items.map((x, i) => <div key={x.label} className="ds-spend-row"><span className="ds-spend-l">{x.label}</span><span className="ds-spend-a">{format(x.amount)}</span><span className="ds-spend-bar"><i className={i ? '' : 'top'} style={{ width: `${Math.max(4, Math.round(x.amount / max * 100))}%` }} /></span></div>) : <p className="ds-row-s">No card spending in this period.</p>}
  </div>
}

/** A card payment: merchant initial, where and when, amount, and the points it earned. */
export function Txn({ name, meta, amount, points, refund, format }: { name: string; meta: string; amount: number; points?: number; refund?: boolean; format: (n: number) => string }) {
  return <div className="ds-row ds-txn"><span className="ds-row-ic ds-mono">{name.charAt(0)}</span><span className="ds-row-b"><span className="ds-row-t">{name}</span><span className="ds-row-s">{meta}</span></span><span className="ds-txn-r"><span className={'ds-row-v' + (refund || amount < 0 ? ' ds-good' : '')}>{`${refund || amount < 0 ? '+' : '−'}${format(Math.abs(amount))}`}</span>{points ? <span className="ds-txn-p">{`+${points} pts`}</span> : null}</span></div>
}

/** The bill: what is due, by when, the minimum, and the two ways to pay it. */
export function DueCard({ amount, date, min, onFull, onMin, paid }: { amount: string; date: string; min: string; onFull: () => void; onMin: () => void; paid?: boolean }) {
  return <div className="ds-card ds-due"><div className="ds-due-top"><span className="ds-row-s">{paid ? 'Nothing to pay now' : `Due ${date}`}</span></div><b className="ds-due-v">{amount}</b>{!paid && <span className="ds-row-s">{`Minimum ${min}`}</span>}
    {!paid && <div className="ds-cf-btns"><button className="ds-btn40" onClick={onFull}>Pay in full</button><button className="ds-btn40 ds-white ds-outline" onClick={onMin}>Pay the minimum</button></div>}</div>
}

/** A row with a small action pill on the trailing side, for settings that open a step. */
export function ActionRow({ icon, title, sub, action, onAction, primary }: { icon: string; title: string; sub: string; action: string; onAction: () => void; primary?: boolean }) {
  return <div className="ds-row"><span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{title}</span><span className="ds-row-s">{sub}</span></span><button className={primary ? 'ds-pill30' : 'ds-pill30 ds-ghostpill'} onClick={onAction}>{action}</button></div>
}

/** Toggle row with an icon, for card controls. */
export function ControlRow({ icon, title, sub, on, onChange }: { icon: string; title: string; sub: string; on: boolean; onChange: (v: boolean) => void }) {
  return <div className="ds-trow"><span className="ds-row-ic"><Icon name={icon} size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{title}</span><span className="ds-row-s">{sub}</span></span><button role="switch" aria-checked={on} aria-label={title} className="ds-toggle" onClick={() => onChange(!on)} /></div>
}

/** A challenge as a tile: what to do, how far along, what it pays, and Join. */
export function Challenges({ items }: { items: { key: string; title: string; reward: string; progress: number; target: number; progressText: string; joined: boolean; onJoin: () => void }[] }) {
  return <div className="ds-btiles" role="list">{items.map(x => <div key={x.key} role="listitem" className="ds-btile ds-chal"><span className="ds-btile-t">{x.title}</span><TickMeter used={x.target ? x.progress / x.target : 0} ticks={20} label={x.progressText} /><span className="ds-btile-s">{x.progressText}</span><span className="ds-chal-f"><b>{x.reward}</b>{x.joined ? <span className="ds-added ds-static"><Icon name="check" size={13} stroke={2.6} />Joined</span> : <button className="ds-add" onClick={x.onJoin}>Join</button>}</span></div>)}</div>
}
