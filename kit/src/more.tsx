import { React, useState, cx } from './r'
import { Icon, Spark } from './icons'
import { Button, Meta, Badge, Price, Toggle, Stepper, CheckPop, Chips } from './base'
import { useMarket } from './market'

/* ================= Blocks every category shares ================= */

/** A result as a row: picture, name, facts, price. The workhorse for lists in any category. */
export function ItemRow({ src, icon, title, sub, meta = [], price, points, unit, badge, rating, onClick, trailing }: { src?: string; icon?: string; title: string; sub?: string; meta?: any[]; price?: number; points?: number; unit?: string; badge?: string; rating?: number; onClick?: () => void; trailing?: any }) {
  const M = useMarket()
  return <button className="gr-itemrow" onClick={onClick}>
    <span className="gr-ir-ph">{src ? <img src={src} alt="" /> : <Icon name={icon || 'grid'} size={24} />}</span>
    <span className="gr-grow gr-col" style={{ gap: 3, minWidth: 0 }}>
      <span className="gr-row" style={{ gap: 6, justifyContent: 'space-between' }}><b className="gr-ir-t">{title}</b>{badge && <Badge tone="accent">{badge}</Badge>}</span>
      {sub && <span className="gr-meta">{sub}</span>}
      {(meta.length > 0 || rating) && <Meta items={[...(rating ? [<span key="r" className="gr-rating"><Icon name="star" size={12} filled color="var(--accent)" />{rating}</span>] : []), ...meta]} />}
    </span>
    {trailing ?? (price != null && <span className="gr-col" style={{ gap: 0, alignItems: 'flex-end', flexShrink: 0 }}><b className="gr-num">{price === 0 ? M.t('free') : M.money(price, price % 1 ? 2 : 0)}</b>{unit && <span className="gr-meta" style={{ fontSize: '0.6875rem' }}>{unit}</span>}{points != null && price > 0 && <span className="gr-pts" style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--accent-ink)' }}>{M.t('orPts', { n: M.num(points) })}</span>}</span>)}
  </button>
}

/** The detail view of any item: picture, facts, the options that matter, policy, and one button. */
export function DetailCard({ src, title, sub, facts = [], description, policy, children, price, points, unit, cta = 'Continue', onCta, disabled, note }: any) {
  const M = useMarket()
  return <div className="gr-detail">
    {src && <div className="gr-dt-ph"><img src={src} alt="" /></div>}
    <div className="gr-col" style={{ gap: 6 }}><div className="gr-title">{title}</div>{sub && <div className="gr-meta">{sub}</div>}{facts.length > 0 && <Meta items={facts} />}</div>
    {description && <div className="gr-body" style={{ color: 'var(--ink-soft)' }}>{description}</div>}
    {children}
    {policy && <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>{policy}</span></div>}
    {note && <div className="gr-banner gr-warn"><Icon name="alert" size={18} /><span>{note}</span></div>}
    <div className="gr-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      {price != null ? <Price amount={price} points={points} align="left" note={unit} /> : <span />}
      <Button onClick={onCta} disabled={disabled}>{cta}</Button>
    </div>
  </div>
}

/** Size, colour, plan or any one-of choice. */
export function VariantPicker({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange?: (v: string) => void }) {
  return <div className="gr-col" style={{ gap: 8 }}><span className="gr-label">{label}</span><Chips items={options} value={value} onChange={(v: any) => v && onChange?.(v)} wrap /></div>
}

/** A basket for anything bought in several pieces: groceries, a shop order, a gift card batch. */
export function Basket({ lines, onQty, total, points, cta = 'Checkout', onCta, note }: { lines: { id: string; title: string; sub?: string; price: number; qty: number; src?: string }[]; onQty?: (id: string, q: number) => void; total: number; points?: number; cta?: string; onCta?: () => void; note?: string }) {
  const M = useMarket()
  return <div className="gr-card" style={{ gap: 10 }}>
    {lines.map(l => <div key={l.id} className="gr-row" style={{ gap: 10 }}>
      {l.src && <img src={l.src} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', background: 'var(--card-sunk)' }} />}
      <div className="gr-grow" style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{l.title}</div><div className="gr-meta">{l.sub ? l.sub + ' · ' : ''}{M.money(l.price, l.price % 1 ? 2 : 0)}</div></div>
      <Stepper value={l.qty} min={0} max={20} label={l.title} onChange={(q: number) => onQty?.(l.id, q)} />
    </div>)}
    {note && <div className="gr-meta">{note}</div>}
    <div className="gr-hr" />
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div><div className="gr-meta">{M.t('total').charAt(0).toUpperCase() + M.t('total').slice(1)}</div><b style={{ fontSize: '1.25rem' }}>{M.money(total, total % 1 ? 2 : 0)}</b>{points != null && <div className="gr-meta" style={{ color: 'var(--accent-ink)', fontWeight: 650 }}>{M.t('orPts', { n: M.num(points) })}</div>}</div><Button onClick={onCta} disabled={!lines.some(l => l.qty > 0)}>{cta}</Button></div>
  </div>
}

/** Where something is now: an order, a ride, a delivery, a claim, a concierge request. Steps done in orange; the current one pulses. */
export function Tracker({ title, sub, steps, current, eta, tone, actions = [], onAction, icon = 'bolt' }: { title: string; sub?: string; steps: string[]; current: number; eta?: string; tone?: 'warn' | 'danger' | 'good'; actions?: string[]; onAction?: (a: string) => void; icon?: string }) {
  return <div className="gr-card gr-tracker2">
    <div className="gr-row" style={{ alignItems: 'flex-start' }}>
      <span className="gr-ibtn gr-flat gr-sm"><Icon name={icon} size={18} /></span>
      <div className="gr-grow"><div className="gr-heading">{title}</div>{sub && <div className="gr-meta">{sub}</div>}</div>
      {eta && <Badge tone={tone === 'danger' ? 'danger' : tone === 'warn' ? 'warn' : 'good'}>{eta}</Badge>}
    </div>
    <div className="gr-trk">{steps.map((s, i) => <div key={s} className={cx('gr-trk-s', i < current && 'gr-done', i === current && 'gr-cur', i === current && tone && 'gr-' + tone)}><i>{i < current ? <Icon name="check" size={11} stroke={3} /> : null}</i><span>{s}</span></div>)}</div>
    {actions.length > 0 && <div className="gr-actions">{actions.map((a, i) => <Button key={a} size="sm" variant={i ? 'secondary' : 'primary'} onClick={() => onAction?.(a)}>{a}</Button>)}</div>}
  </div>
}

/** A ticket or pass: event, when, where, seat, and the code to scan. Works offline. */
export function TicketPass({ kind = 'Ticket', title, when, where, seat, holder, code = 'GR', color = '#17171A', icon = 'ticket' }: any) {
  const cells = Array.from({ length: 49 }, (_, i) => { const r = Math.floor(i / 7), c = i % 7; const f = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2); return f || ((i * 37 + r * 13 + c * 7 + code.length) % 5) < 2 })
  return <div className="gr-tpass" style={{ ['--tp' as any]: color }}>
    <div className="gr-tp-top"><div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label" style={{ color: 'inherit', opacity: .7 }}>{kind}</span><Icon name={icon} size={20} /></div><div className="gr-title" style={{ color: 'inherit' }}>{title}</div><div style={{ fontSize: '0.8125rem', opacity: .8, fontWeight: 550 }}>{when}</div></div>
    <div className="gr-tp-bot"><div className="gr-col" style={{ gap: 4 }}>{where && <div style={{ fontWeight: 650, fontSize: '0.875rem' }}>{where}</div>}{seat && <div className="gr-meta">{seat}</div>}{holder && <div className="gr-meta">{holder}</div>}<span className="gr-code gr-meta">{code}</span></div><div className="gr-qr" role="img" aria-label="Code to scan">{cells.map((on, i) => <i key={i} className={on ? undefined : 'gr-o'} />)}</div></div>
  </div>
}

/** An airport service: where, what's included, how long, how it works on the day. */
export function ServiceCard({ title, airport, terminal, includes = [], duration, price, points, visitsLeft, onBook, cta = 'Book' }: any) {
  const M = useMarket()
  return <div className="gr-card" style={{ gap: 10 }}>
    <div className="gr-row" style={{ alignItems: 'flex-start' }}><span className="gr-ibtn gr-flat"><Icon name="gate" size={20} /></span><div className="gr-grow"><div className="gr-heading">{title}</div><Meta items={[airport, terminal, duration].filter(Boolean)} /></div>{visitsLeft != null && <Badge tone="good">{visitsLeft} free left</Badge>}</div>
    <ul className="gr-incl">{includes.map((x: string) => <li key={x}><Icon name="check" size={14} stroke={2.6} color="var(--good)" />{x}</li>)}</ul>
    <div className="gr-row" style={{ justifyContent: 'space-between' }}>{visitsLeft ? <b>{M.t('free')} <span className="gr-meta" style={{ display: 'inline' }}>with your card</span></b> : <Price amount={price} points={points} align="left" />}<Button size="sm" onClick={onBook}>{cta}</Button></div>
  </div>
}

/** A subscription: what it is, price, renewal, and manage. */
export function SubscriptionCard({ name, plan, price, period = 'month', renews, status = 'active', color = '#17171A', mono, included, onManage, actions = [], onAction }: any) {
  const M = useMarket()
  return <div className="gr-card" style={{ gap: 10 }}>
    <div className="gr-row"><span className="gr-logo2" style={{ background: color }}>{mono || name[0]}</span><div className="gr-grow"><div className="gr-heading">{name}</div><div className="gr-meta">{plan}</div></div><Badge tone={status === 'active' ? 'good' : status === 'paused' ? 'warn' : 'ink'}>{status === 'active' ? 'Active' : status === 'paused' ? 'Paused' : status === 'cancelled' ? 'Ends soon' : 'Not active'}</Badge></div>
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div>{included ? <b>Included with your card</b> : <b>{M.money(price, price % 1 ? 2 : 0)} <span className="gr-meta" style={{ display: 'inline' }}>a {period}</span></b>}{renews && <div className="gr-meta">{status === 'cancelled' ? 'Access until ' : 'Renews '}{renews}</div>}</div>{onManage && <Button size="sm" variant="secondary" onClick={onManage}>Manage</Button>}</div>
    {actions.length > 0 && <div className="gr-actions">{actions.map((a: string, i: number) => <Button key={a} size="sm" variant={i ? 'secondary' : 'primary'} onClick={() => onAction?.(a)}>{a}</Button>)}</div>}
  </div>
}

/* ================= Bank side ================= */

/** The card at a glance: balance, what you can spend, what's due. */
export function BalanceCard({ last4 = '4821', name = 'Gratifi Card', balance, available, limit, due, dueDate, frozen }: any) {
  const M = useMarket()
  const used = limit ? Math.min(1, balance / limit) : 0
  return <div className="gr-bal">
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><span style={{ fontWeight: 650 }}>{name}</span><span className="gr-code" dir="ltr" style={{ opacity: .8 }}>•••• {last4}</span></div>
    {frozen && <div className="gr-frozen"><Icon name="lock" size={14} />Frozen: new payments are blocked</div>}
    <div><div style={{ fontSize: '0.75rem', opacity: .7, fontWeight: 600 }}>Balance</div><div className="gr-time" style={{ color: 'inherit' }}>{M.money(balance, 2)}</div></div>
    <div className="gr-bal-bar"><i style={{ width: used * 100 + '%' }} /></div>
    <div className="gr-row" style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}><span>Available <b>{M.money(available, 0)}</b></span><span>Due <b>{M.money(due, 2)}</b> · {dueDate}</span></div>
  </div>
}

/** Card controls: each switch acts at once and says what it does. */
export function CardControls({ state, onChange }: { state: Record<string, boolean>; onChange?: (k: string, v: boolean) => void }) {
  const rows: [string, string, string][] = [['frozen', 'Freeze card', 'Blocks new payments. Direct debits and refunds still work.'], ['online', 'Online payments', 'Shopping on websites and apps'], ['abroad', 'Payments abroad', 'Using the card in other countries'], ['contactless', 'Contactless', 'Tap to pay in shops'], ['atm', 'Cash withdrawals', 'Taking cash from machines']]
  return <div className="gr-card" style={{ gap: 0, paddingTop: 6, paddingBottom: 6 }}>{rows.map(([k, t, s]) => <div key={k} className="gr-benefit" style={{ cursor: 'default' }}><span className="gr-bi"><Icon name={k === 'frozen' ? 'lock' : k === 'online' ? 'globe' : k === 'abroad' ? 'plane' : k === 'contactless' ? 'wifi' : 'wallet'} size={18} /></span><div className="gr-grow"><div style={{ fontWeight: 650, fontSize: '0.9375rem' }}>{t}</div><div className="gr-meta">{k !== 'frozen' && state.frozen ? 'Paused while the card is frozen' : s}</div></div><Toggle label={t} on={!!state[k]} disabled={k !== 'frozen' && !!state.frozen} onChange={(v: boolean) => onChange?.(k, v)} /></div>)}</div>
}

/** Where the money went, by category, as bars. */
export function SpendBreakdown({ items, total, period = 'This month' }: { items: { label: string; amount: number; color?: string }[]; total: number; period?: string }) {
  const M = useMarket(); const max = Math.max(...items.map(i => i.amount), 1)
  return <div className="gr-card" style={{ gap: 10 }}><div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-heading">{period}</div><b>{M.money(total, 0)}</b></div>
    {items.map(i => <div key={i.label} className="gr-col" style={{ gap: 4 }}><div className="gr-row" style={{ justifyContent: 'space-between', fontSize: '0.8125rem' }}><span>{i.label}</span><b className="gr-num">{M.money(i.amount, 0)}</b></div><div className="gr-bar"><i style={{ width: (i.amount / max) * 100 + '%', background: i.color || 'var(--ink)' }} /></div></div>)}</div>
}

/** Move points to an airline or hotel programme. It can't be undone, so the customer ticks that they understand first. */
export function TransferCard({ programme, rate, points, balance, eta = 'Usually within 2 days', onConfirm }: { programme: string; rate: string; points: number; balance: number; eta?: string; onConfirm?: (pts: number) => void }) {
  const M = useMarket(); const [pts, setPts] = useState(points); const [ok, setOk] = useState(false)
  const steps = [1000, 5000, 10000, 20000, 50000].filter(x => x <= Math.max(balance, 1000))
  return <div className="gr-card" style={{ gap: 12 }}>
    <div className="gr-row"><span className="gr-ibtn gr-flat"><Icon name="swap" size={20} /></span><div className="gr-grow"><div className="gr-heading">To {programme}</div><div className="gr-meta">{rate} · {eta}</div></div></div>
    <Chips items={steps.map(s => ({ id: String(s), label: M.num(s) }))} value={String(pts)} onChange={(v: any) => v && setPts(+v)} wrap />
    <div className="gr-meta" style={pts > balance ? { color: 'var(--danger)' } : undefined}>{pts > balance ? `You have ${M.num(balance)} points: ${M.num(pts - balance)} short for this.` : `You have ${M.num(balance)} points. After this: ${M.num(balance - pts)}.`}</div>
    <label className="gr-ack"><input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} /><span>I understand a transfer can&apos;t be undone.</span></label>
    <Button block disabled={!ok || pts > balance} onClick={() => onConfirm?.(pts)}>Transfer {M.num(pts)} points</Button>
  </div>
}

/** What an investment can and can't do, said before anything else. Information only until the licensed partner takes over. */
export function RiskNote({ title = 'Before you invest', points = [], partner }: { title?: string; points?: string[]; partner?: string }) {
  return <div className="gr-banner gr-warn" style={{ flexDirection: 'column', gap: 8 }}><div className="gr-row" style={{ gap: 8 }}><Icon name="alert" size={18} /><b>{title}</b></div><ul style={{ margin: 0, paddingInlineStart: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>{points.map(p => <li key={p}>{p}</li>)}</ul>{partner && <div style={{ fontSize: '0.75rem', opacity: .85 }}>Provided by {partner}. Gratifi gives information, not advice.</div>}</div>
}

export function CharityCard({ name, cause, raised, goal, src, onGive }: any) {
  const M = useMarket(); const p = goal ? Math.min(1, raised / goal) : 0
  return <div className="gr-card" style={{ gap: 10 }}>{src && <img src={src} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 16 }} />}<div><div className="gr-heading">{name}</div><div className="gr-meta">{cause}</div></div>{goal && <><div className="gr-bar"><i style={{ width: p * 100 + '%', background: 'var(--accent)' }} /></div><div className="gr-meta">{M.num(raised)} of {M.num(goal)} points given by members</div></>}<Button size="sm" onClick={onGive}>Give points</Button></div>
}

/** Insurance or cover in plain words: what's covered, what isn't, the excess, how to claim. */
export function PolicyCard({ name, covered = [], notCovered = [], excess, price, points, onBuy, cta = 'Get this cover', included }: any) {
  return <div className="gr-card" style={{ gap: 10 }}><div className="gr-row"><span className="gr-ibtn gr-flat"><Icon name="shield" size={20} /></span><div className="gr-grow"><div className="gr-heading">{name}</div>{excess && <div className="gr-meta">Excess {excess}</div>}</div>{included && <Badge tone="good">With your card</Badge>}</div>
    <ul className="gr-incl">{covered.map((x: string) => <li key={x}><Icon name="check" size={14} stroke={2.6} color="var(--good)" />{x}</li>)}{notCovered.map((x: string) => <li key={x} style={{ color: 'var(--ink-soft)' }}><Icon name="minus" size={14} />{x}</li>)}</ul>
    {onBuy && <div className="gr-row" style={{ justifyContent: 'space-between' }}>{price != null ? <Price amount={price} points={points} align="left" /> : <span />}<Button size="sm" onClick={onBuy}>{cta}</Button></div>}</div>
}

/** A challenge or milestone: progress, what's left, the reward. */
export function ChallengeCard({ title, reward, progress, target, unit = '', ends, onJoin, joined, money }: any) {
  const M = useMarket(); const p = Math.min(1, progress / target)
  return <div className="gr-card" style={{ gap: 10 }}><div className="gr-row"><span className="gr-ibtn gr-flat"><Icon name="flag" size={20} /></span><div className="gr-grow"><div className="gr-heading">{title}</div><div className="gr-meta">Reward: {reward}{ends ? ' · ends ' + ends : ''}</div></div>{p >= 1 && <CheckPop size={30} animate={false} />}</div>
    <div className="gr-bar"><i style={{ width: p * 100 + '%', background: 'var(--accent)' }} /></div>
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-meta">{money ? `${M.money(progress)} of ${M.money(target)}` : `${M.num(progress)}${unit} of ${M.num(target)}${unit}`}</span>{onJoin && !joined && <Button size="sm" onClick={onJoin}>Join</Button>}{joined && p < 1 && <Badge tone="accent">Joined</Badge>}</div></div>
}

/** Which messages to get, and when to be left alone. */
export function AlertSettings({ state, onChange }: { state: Record<string, boolean>; onChange?: (k: string, v: boolean) => void }) {
  const rows: [string, string, string][] = [['moments', 'Moments from Gratifi', 'Useful things worth doing now, at most 3 a week'], ['offers', 'Offers', 'Card offers that match what you buy'], ['trips', 'Trip updates', 'Delays, gates, check-in'], ['orders', 'Order updates', 'Dispatch and delivery'], ['spend', 'Every card payment', 'A note each time the card is used'], ['quiet', 'Quiet hours 22:00 to 08:00', 'No messages except fraud and security']]
  return <div className="gr-card" style={{ gap: 0, paddingTop: 6, paddingBottom: 6 }}>{rows.map(([k, t, s]) => <div key={k} className="gr-benefit" style={{ cursor: 'default' }}><div className="gr-grow"><div style={{ fontWeight: 650, fontSize: '0.9375rem' }}>{t}</div><div className="gr-meta">{s}</div></div><Toggle label={t} on={!!state[k]} onChange={(v: boolean) => onChange?.(k, v)} /></div>)}</div>
}

/** Pick a saved address, or add one. */
export function AddressPicker({ addresses, value, onChange }: { addresses: { id: string; label: string; line: string }[]; value?: string; onChange?: (id: string) => void }) {
  return <div className="gr-opts" role="radiogroup" aria-label="Delivery address">{addresses.map(a => <button key={a.id} className="gr-opt" role="radio" aria-checked={value === a.id} onClick={() => onChange?.(a.id)}><span className="gr-radio" /><div className="gr-grow"><div style={{ fontWeight: 650 }}>{a.label}</div><div className="gr-meta">{a.line}</div></div></button>)}</div>
}

/** Add a photo or document to a claim, return or dispute. */
export function Upload({ label = 'Add a photo', hint = 'A clear photo of the item and the problem', files = [], onAdd }: { label?: string; hint?: string; files?: string[]; onAdd?: () => void }) {
  return <div className="gr-col" style={{ gap: 8 }}><button className="gr-upload" onClick={onAdd}><Icon name="plus" size={20} /><div><div style={{ fontWeight: 650 }}>{label}</div><div className="gr-meta">{hint}</div></div></button>{files.map(f => <div key={f} className="gr-row gr-meta" style={{ gap: 6 }}><Icon name="doc" size={14} />{f}<Icon name="check" size={14} color="var(--good)" /></div>)}</div>
}

/** A category tile for the Explore grid. */
export function CategoryTile({ icon, label, sub, onClick, soon }: any) {
  return <button className="gr-cattile" onClick={onClick}><span className="gr-ct-ic"><Icon name={icon} size={22} /></span><span style={{ fontWeight: 650, fontSize: '0.875rem' }}>{label}</span>{sub && <span className="gr-meta" style={{ fontSize: '0.75rem' }}>{sub}</span>}{soon && <span className="gr-badge" style={{ position: 'absolute', top: 10, insetInlineEnd: 10 }}>Soon</span>}</button>
}
