import { React, useState, useEffect, cx } from './r'
import { Icon, Spark } from './icons'
import { Button, Meta, Badge, CheckPop, StickyNote, Chips, Stepper } from './base'
import { useMarket } from './market'

/* ================= Conversation ================= */

/** The ask bar: type, or hold the mic. Floats above the tab bar. */
export function AskBar({ placeholder, value, listening, onSend, onMic }: { placeholder?: string; value?: string; listening?: boolean; onSend?: (t: string) => void; onMic?: () => void }) {
  const M = useMarket()
  const [t, setT] = useState(value || '')
  return <form className={cx('gr-ask', listening && 'gr-listening')} onSubmit={(e: any) => { e.preventDefault(); if (t.trim()) { onSend?.(t); setT('') } }}>
    <Spark size={18} />
    {listening ? <span className="gr-wave" role="status" aria-label={M.t('listening')}><span className="gr-meta" style={{ marginInlineEnd: 8, color: 'var(--ink)' }}>{M.t('listening')}</span>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => <i key={i} style={{ animationDelay: `${(i % 5) * 0.12}s`, height: [8, 14, 20, 12, 18, 10, 22, 14, 9, 16, 12, 7][i] }} />)}</span>
      : <input aria-label={M.t('askLabel')} placeholder={placeholder ?? M.t('ask')} value={t} onChange={(e: any) => setT(e.target.value)} />}
    {!listening && <button type="button" className="gr-mic" aria-label={M.t('speak')} onClick={onMic}><Icon name="mic" size={20} stroke={2.1} /></button>}
    {listening ? <button type="button" className="gr-mic" aria-label={M.t('stopListening')} onClick={onMic}><Icon name="mic" size={20} stroke={2.1} /></button>
      : <button type="submit" className="gr-send" aria-label={M.t('send')}><Icon name="up" size={20} stroke={2.4} /></button>}
  </form>
}

/** What the customer said, on the trailing side in the black pill. */
export function YouSaid({ children }: any) { return <div className="gr-you" dir="auto">{children}</div> }

/** The quiet line that says where an answer came from, step by step. Steps appear as they finish. */
export function Steps({ steps, running }: { steps: string[]; running?: boolean }) {
  if (!running && steps.length > 1) return <div className="gr-steps" aria-live="polite"><div className="gr-step"><span className="gr-tick"><Icon name="check" size={12} stroke={3} /></span>{steps.join(' · ')}</div></div>
  return <div className="gr-steps" aria-live="polite">{steps.map((s, i) => { const now = running && i === steps.length - 1; return <div key={s} className={cx('gr-step', now && 'gr-now')} style={{ animationDelay: `${i * 0.12}s` }}><span className="gr-tick">{!now && <Icon name="check" size={12} stroke={3} />}</span>{s}</div> })}</div>
}

/** Every Gratifi reply: steps, one answer line, then the card that proves it, then up to three next steps. */
export function Answer({ steps, say, children, actions, source }: { steps?: string[]; say: any; children?: any; actions?: { label: string; primary?: boolean; icon?: string; onClick?: () => void }[]; source?: string }) {
  return <div className="gr-answer">
    {steps && <Steps steps={steps} />}
    <div className="gr-say">{say}</div>
    {children}
    {actions && actions.length > 0 && <div className="gr-actions">{actions.slice(0, 3).map((a, i) => <Button key={a.label} size="sm" variant={a.primary || (i === 0 && !actions.some(x => x.primary)) ? 'primary' : 'secondary'} icon={a.icon} onClick={a.onClick}>{a.label}</Button>)}</div>}
    {source && <div className="gr-source"><Icon name="doc" size={13} />{source}</div>}
  </div>
}

export function Typing() { const M = useMarket(); return <div className="gr-typing" role="status" aria-label={M.t('working')}><i /><i /><i /></div> }

/** Next questions, as chips the customer can tap. */
export function Suggestions({ items, onPick }: { items: string[]; onPick?: (s: string) => void }) {
  return <div className="gr-chips gr-wrap">{items.map(s => <button key={s} className="gr-chip gr-suggest" onClick={() => onPick?.(s)}>{s}</button>)}</div>
}

/** The assistant's moment: a sticky note pinned to a real number, with one action. */
export function Moment(props: any) { return <StickyNote {...props} /> }

/** When a person should take over: who, how long, and that they already have the conversation. */
export function Handoff({ name = 'Priya', role = 'travel team', wait = 'Joins in about 2 minutes', onCall, onChat, used, initial }: any) {
  const M = useMarket()
  return <div className="gr-card" style={{ maxWidth: 360 }}>
    <div className="gr-row"><span className="gr-av" style={{ width: 48, height: 48, fontSize: '0.9375rem', border: 0 }} aria-hidden="true" data-notr>{initial || name[0]}</span><div className="gr-grow"><div className="gr-heading">{M.t('handoffWho', { name, role })}</div><Meta items={[wait, M.t('handoffHas')]} /></div></div>
    <div className="gr-banner gr-info"><Icon name="info" size={18} /><span>{M.t('handoffNote', { name })}</span></div>
    <div className="gr-actions"><Button icon="chat" disabled={!!used} onClick={onChat}>{M.t('chatNow')}</Button><Button variant="secondary" icon="phone" disabled={!!used} onClick={onCall}>{M.t('callMe')}</Button></div>
  </div>
}

/** A short confirmation with an optional undo. */
export function Toast({ children, undo, onUndo }: any) {
  return <div className="gr-toast" role="status"><span className="gr-grow">{children}</span>{undo && <button className="gr-undo" onClick={onUndo}>{undo}</button>}</div>
}

/* ================= Commerce ================= */

/** A horizontal rail of cards that snaps. Three is the most shown before "See all". */
export function Rail({ title, more, onMore, children }: any) {
  return <div className="gr-col" style={{ gap: 12, width: '100%' }}>
    {(title || more) && <div className="gr-railhead">{title && <div className="gr-heading">{title}</div>}{more && <button className="gr-link" onClick={onMore}>{more}</button>}</div>}
    <div className="gr-rail">{children}</div>
  </div>
}

export function OfferCard({ brand, mono, color = 'var(--card-sunk)', rate, sub, why, added, onAdd }: any) {
  const M = useMarket()
  const [on, setOn] = useState(!!added)
  return <div className="gr-offer">
    <div className="gr-logo" style={{ background: color, color: '#fff' }}>{mono}</div>
    <div className="gr-grow"><div className="gr-rate">{rate}</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{brand}</div>{why ? <div className="gr-meta" style={{ color: 'var(--accent-ink)', flexWrap: 'nowrap', gap: 4 }}><Spark size={11} /><span>{why}</span></div> : <Meta items={[sub]} />}</div>
    <Button size="sm" variant={on ? 'quiet' : 'primary'} icon={on ? 'check' : undefined} onClick={() => { setOn(!on); onAdd?.(!on) }}>{on ? M.t('added') : M.t('add')}</Button>
  </div>
}

export function ProductCard({ src, name, meta, price, points, badge, back, unit, onClick }: any) {
  const M = useMarket()
  return <button className="gr-product" style={{ textAlign: 'start' }} onClick={onClick}>
    <div className="gr-ph"><img src={src} alt="" />{badge && <span className="gr-badge">{badge}</span>}</div>
    <div className="gr-in"><div style={{ fontWeight: 650, fontSize: '0.9375rem', lineHeight: '1.25rem' }}>{name}</div>{meta && <Meta items={meta} />}<div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-price gr-left"><b style={{ fontSize: '1.0625rem' }}>{M.money(price)}</b>{points && <span className="gr-pts">{M.t('orPts', { n: M.num(points) })}</span>}</div>{back && <span className="gr-back">{back}</span>}</div></div>
  </button>
}

/** Side by side, for two or three options. The best fit gets the accent column. */
export function Compare({ columns, rows, best }: { columns: string[]; rows: { label: string; values: any[] }[]; best?: number }) {
  const M = useMarket()
  const cell = (v: any) => v === true ? <span className="gr-yes"><Icon name="check" size={15} stroke={2.6} />{M.t('yes')}</span> : v === false ? <span className="gr-no"><Icon name="minus" size={15} />{M.t('no')}</span> : v
  return <div className="gr-card" style={{ padding: 8, overflowX: 'auto', maxWidth: 380 }}><table className="gr-compare"><thead><tr><th />{columns.map((c, i) => <th key={c} className={i === best ? 'gr-best' : undefined}>{c}{i === best && <div style={{ marginTop: 4 }}><Badge tone="accent">{M.t('bestForYou')}</Badge></div>}</th>)}</tr></thead>
    <tbody>{rows.map(r => <tr key={r.label}><th>{r.label}</th>{r.values.map((v, i) => <td key={i} className={i === best ? 'gr-best' : undefined}>{cell(v)}</td>)}</tr>)}</tbody></table></div>
}

/** Filters as chips the customer can tap or say. Sort sits first. */
export function FilterBar({ sort, filters }: { sort?: string; filters: string[] }) {
  const M = useMarket(); const s = sort ?? M.t('best')
  return <div className="gr-row" style={{ gap: 8, overflow: 'hidden' }}><button className="gr-chip" aria-label={`${M.t('sort')}: ${s}`} style={{ flex: 'none', background: 'var(--card)', boxShadow: 'var(--shadow-card)' }}><Icon name="sort" size={15} stroke={2.1} />{s}</button><div className="gr-grow" style={{ minWidth: 0 }}><Chips items={filters} multi /></div></div>
}

/** A month with the price under each day and the chosen range in orange. The week starts where the market's does. */
export function PriceCalendar({ year = 2026, month = 9, prices = {}, low = [], from, to, disabledBefore = 0, today, onPick, onPrev, onNext }: { onPrev?: () => void; onNext?: () => void; year?: number; month?: number /* 0 = January */; prices?: Record<number, number>; low?: number[]; from?: number; to?: number; disabledBefore?: number; today?: number; onPick?: (d: number) => void }) {
  const M = useMarket()
  const [a, setA] = useState(from), [b, setB] = useState(to)
  const pick = (d: number) => { if (!a || (a && b)) { setA(d); setB(undefined) } else if (d > a) setB(d); else { setA(d); setB(undefined) } onPick?.(d) }
  const days = new Date(year, month + 1, 0).getDate()
  const lead = (new Date(year, month, 1).getDay() - (M.firstDay % 7) + 7) % 7
  const mName = new Intl.DateTimeFormat(M.locale, { month: 'long' }).format(new Date(year, month, 15))
  const cells: any[] = []
  for (let i = 0; i < lead; i++) cells.push(<div key={'x' + i} />)
  for (let d = 1; d <= days; d++) {
    const dis = d < disabledBefore, s = d === a, e = d === b, inr = a && b && d > a && d < b, p = prices[d]
    cells.push(<button key={d} className={cx('gr-day', s && 'gr-start', (e || (s && !b)) && 'gr-end', inr && 'gr-in-range', d === today && !s && !e && 'gr-today')} aria-disabled={dis} aria-pressed={s || e} aria-label={`${M.num(d)} ${mName}${p != null ? ', ' + M.t('fromPrice', { p: M.money(p) }) : ''}${low.includes(d) ? ', ' + M.t('cheapestA11y') : ''}`} onClick={() => !dis && pick(d)}>
      <span>{M.num(d)}</span><small className={low.includes(d) ? 'gr-low' : undefined} aria-hidden="true">{!dis && p != null ? M.money(p) : ' '}</small>
    </button>)
  }
  return <div className="gr-cal">
    <div className="gr-cal-head"><div className="gr-heading">{M.monthLabel(year, month)}</div><div className="gr-row" style={{ gap: 6 }}><button className="gr-ibtn gr-flat gr-sm" aria-label={M.t('prevMonth')} disabled={!onPrev} onClick={onPrev}><Icon name="back" size={18} /></button><button className="gr-ibtn gr-flat gr-sm" aria-label={M.t('nextMonth')} disabled={!onNext} onClick={onNext}><Icon name="chev" size={18} /></button></div></div>
    <div className="gr-cal-grid">{M.dows().map((x, i) => <div key={i} className="gr-dow">{x}</div>)}{cells}</div>
    {a && <div className="gr-meta" style={{ marginTop: 10 }}>{b ? M.t('nights', { n: M.num(b - a) }) : M.t('pickReturn')}{low.length > 0 && <><span className="gr-dot" /><span style={{ color: 'var(--good)' }}>{M.t('cheapest')}</span></>}</div>}
  </div>
}

/** Who's travelling. Age bands follow the airline; these are the common ones. Infants never outnumber adults. */
export function Travellers({ adults = 1, children = 0, infants = 0 }: any) {
  const M = useMarket()
  const [n, setN] = useState({ adults, children, infants })
  const row = (k: 'adults' | 'children' | 'infants', icon: string, min: number, max: number) => <div><div className="gr-row"><span className="gr-ibtn gr-flat gr-sm"><Icon name={icon} size={18} /></span><div><div style={{ fontWeight: 650 }}>{M.t(k)}</div><div className="gr-meta">{M.t(k + 'Sub')}</div></div></div><Stepper value={n[k]} min={min} max={max} label={M.t(k)} onChange={(v: number) => setN({ ...n, [k]: v })} /></div>
  return <div className="gr-card" style={{ maxWidth: 360 }}><div className="gr-pax">{row('adults', 'user', 1, 9)}{row('children', 'child', 0, 8)}{row('infants', 'infant', 0, n.adults)}</div>
    {n.infants > 0 && <div className="gr-meta" style={{ marginTop: 10 }}>{M.t('infantNote')}</div>}</div>
}

/** How to pay: points, points and card, or card. The bank sets the rate (`rate` = cash value of one point). */
export function PayWith({ points = 48210, cash = 372, rate = 0.01, mix = 30000, card = '4821', value = 'mix', onChange }: any) {
  const M = useMarket()
  const full = Math.round(cash / rate)
  const mo = (n: number) => M.money(n, Math.abs(n - Math.round(n)) > 0.004 ? 2 : 0)
  const offOf = (id: string) => id === 'points' ? full > points : id === 'mix' ? mix > points || mix <= 0 : false
  const [v, setV] = useState(offOf(value) ? (['points', 'mix', 'card'].find(x => !offOf(x)) as string) : value)
  const opts = [
    { id: 'points', t: M.t('points'), s: full > points ? M.t('ptsShort', { pts: M.pts(full), n: M.num(full - points) }) : M.t('ptsHave', { pts: M.pts(full), bal: M.num(points) }), icon: 'sparkle', off: full > points },
    { id: 'mix', t: M.t('pointsAndCard'), s: M.t('ptsPlus', { pts: M.pts(mix), cash: mo(cash - mix * rate) }), icon: 'split', off: mix > points || mix <= 0 },
    { id: 'card', t: M.t('card'), s: M.t('onCardEnding', { cash: mo(cash), card }), icon: 'card', off: false },
  ]
  return <div className="gr-paywith" role="radiogroup" aria-label={M.t('payWith')}>{opts.map(o => <button key={o.id} role="radio" aria-checked={v === o.id} aria-disabled={o.off} onClick={() => { if (o.off) return; setV(o.id); onChange?.(o.id) }}><Icon name={o.icon} size={20} /><div className="gr-grow"><div style={{ fontWeight: 650 }}>{o.t}</div><div className="gr-meta">{o.s}</div></div>{v === o.id && <Icon name="check" size={18} stroke={2.6} />}</button>)}</div>
}

/** Slide between points and cash. The bank's rules set the rate; the slider never invents one. */
export function PointsSlider({ total = 186, rate = 0.01, balance = 48210, start = 0.5, step = 100, onChange }: { total?: number; rate?: number; balance?: number; start?: number; step?: number; onChange?: (pts: number) => void }) {
  const M = useMarket()
  const maxPts = Math.min(balance, Math.floor(total / rate))
  const [f, setF] = useState(start)
  const pts = Math.round(maxPts * f / step) * step, cash = Math.max(0, total - pts * rate)
  return <div className="gr-card" style={{ maxWidth: 360 }}>
    <div className="gr-split"><div><span className="gr-label">{M.t('points')}</span><b>{M.num(pts)}</b></div><div style={{ textAlign: 'end' }}><span className="gr-label">{M.t('onYourCard')}</span><b>{M.money(cash, 2)}</b></div></div>
    <div className="gr-slider"><input type="range" min="0" max="1" step="0.01" value={f} aria-label={M.t('pointsToUse')} aria-valuetext={`${M.num(pts)} ${M.t('points')}, ${M.money(cash, 2)}`} style={{ ['--fill' as any]: f * 100 + '%' }} onChange={(e: any) => { const v = +e.target.value; setF(v); onChange?.(Math.round(maxPts * v / step) * step) }} /></div>
    <div className="gr-meta">{M.t('youHave', { bal: M.num(balance) })}<span className="gr-dot" />{M.t('pointRate', { v: M.money(rate, rate < 0.01 ? 3 : 2) })}</div>
  </div>
}

/** What the total is made of. The total is what the customer pays, fees included. */
export function PriceLines({ lines, total, note }: { lines: [string, string][]; total: [string, string]; note?: string }) {
  return <div className="gr-lines">{lines.map(([a, b], i) => <div key={a + i}><span>{a}</span><span className={String(b).length <= 18 ? 'gr-nw' : undefined}>{b}</span></div>)}<div className="gr-total"><span>{total[0]}</span><span>{total[1]}</span></div>{note && <div className="gr-meta" style={{ paddingTop: 8 }}>{note}</div>}</div>
}

/** The confirm step for anything that spends money or points. How the customer confirms follows the market:
    Face ID, a one-time code, or approval in the bank's own app. */
export function ConfirmSheet({ title, summary, lines, total, cta, state = 'ready', auth, phone = '21', onConfirm, onClose, validCode, doneTitle, note, attempts = 0, onWrong, onResend, lockedUntil }: any) {
  const M = useMarket(); const how = auth || M.auth
  const [s, setS] = useState(state)
  const [code, setCode] = useState(state === 'code' ? '482193' : ''); const [err, setErr] = useState(attempts); const [resent, setResent] = useState(false)
  const boxes = React.useRef<HTMLDivElement>(null); const focusBox = (i: number) => setTimeout(() => (boxes.current?.querySelectorAll('input')[i] as HTMLInputElement | undefined)?.focus(), 0)
  const [, tick] = useState(0)
  useEffect(() => { if (err < 3 || !lockedUntil) return; const t = setInterval(() => { if (Date.now() >= lockedUntil) { setErr(0); setCode('') } tick(x => x + 1) }, 5000); return () => clearInterval(t) }, [err, lockedUntil])
  const mins = lockedUntil ? Math.max(1, Math.ceil((lockedUntil - Date.now()) / 6e4)) : 15
  useEffect(() => { if (s === 'scanning') { const t = setTimeout(() => { const ok = onConfirm?.(); if (ok !== false) setS('done') }, how === 'app' ? 2600 : 1300); return () => clearTimeout(t) } }, [s])
  const amount = total ? total[1] : ''
  const label = cta || (how === 'otp' ? M.t('confirmWithCode', { amt: amount }) : how === 'app' ? M.t('payApp') : M.t('payFaceId'))
  return <div className="gr-sheetwrap"><div className="gr-sheet" role="dialog" aria-modal="true" tabIndex={-1} data-state={s} aria-label={title || M.t('confirmPay')}>
    <div className="gr-grab" />
    {s === 'done' ? <div className="gr-col" style={{ alignItems: 'center', gap: 12, padding: '10px 0 6px', textAlign: 'center' }}><CheckPop size={64} /><div className="gr-title">{doneTitle || M.t('booked')}</div><div className="gr-meta" style={{ justifyContent: 'center' }}>{summary}</div></div> : <>
      <div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-title">{title || M.t('confirmPay')}</div><button className="gr-ibtn gr-flat gr-sm" aria-label={M.t('close')} onClick={onClose}><Icon name="close" size={18} /></button></div>
      {summary && <div className="gr-well" style={{ fontSize: '0.875rem', fontWeight: 550 }}>{summary}</div>}
      {lines && <PriceLines lines={lines} total={total} />}
      {how === 'otp' ? <div className="gr-otp">
        <div className="gr-meta">{M.t('otpSent', { d: phone })}</div>
        <div className="gr-otp-boxes" dir="ltr" ref={boxes}>{[0, 1, 2, 3, 4, 5].map(i => <input key={i} inputMode="numeric" pattern="[0-9]*" autoComplete={i === 0 ? 'one-time-code' : 'off'} disabled={err >= 3} aria-label={M.t('otpDigit', { n: i + 1 })} value={code[i] || ''}
          onFocus={(e: any) => e.target.select()}
          onPaste={(e: any) => { const d = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (d) { e.preventDefault(); setCode(d); focusBox(Math.min(5, d.length)) } }}
          onKeyDown={(e: any) => { const box = (k: number) => (boxes.current?.querySelectorAll('input')[k] as HTMLInputElement | undefined); if (/^\d$/.test(e.key)) { e.preventDefault(); setCode(prev => (prev.slice(0, i).padEnd(i, ' ') + e.key + prev.slice(i + 1)).replace(/ /g, '').slice(0, 6)); if (i < 5) box(i + 1)?.focus() } else if (e.key === 'Enter') { e.preventDefault(); (boxes.current?.closest('.gr-sheet')?.querySelector('.gr-btn-lg, .gr-sheet > .gr-btn:last-child, button.gr-btn:last-of-type') as HTMLButtonElement | null)?.click() } else if (e.key === 'Backspace' && !code[i] && i > 0) { e.preventDefault(); setCode(code.slice(0, i - 1)); box(i - 1)?.focus() } else if (e.key === 'ArrowLeft' && i > 0) box(i - 1)?.focus(); else if (e.key === 'ArrowRight' && i < 5) box(i + 1)?.focus() }}
          onChange={(e: any) => { const d = e.target.value.replace(/\D/g, ''); if (!d) { setCode(code.slice(0, i) + code.slice(i + 1)); return } if (d.length > 1) { const nc = (code.slice(0, i) + d).slice(0, 6); setCode(nc); focusBox(Math.min(5, nc.length)); return } const nc = (code.slice(0, i) + d + code.slice(i + 1)).slice(0, 6); setCode(nc); if (i < 5) focusBox(i + 1) }} />)}</div>
        {err > 0 && <div className="gr-banner gr-danger" role="alert"><Icon name="alert" size={18} /><span>{err >= 3 ? M.t('codeLocked', { n: mins }) : err === 2 ? M.t('wrongCodeLast') : M.t('wrongCode')}</span></div>}
        {err < 3 && <button className="gr-link" style={{ alignSelf: 'flex-start' }} onClick={() => { setResent(true); setCode(''); onResend?.() }}>{M.t('otpResend')}</button>}
        {resent && err < 3 && <div className="gr-meta" role="status">{M.t('otpResent')}</div>}
      </div> : how === 'app' ? <div className="gr-faceid"><div className="gr-ring"><Icon name="shield" size={36} stroke={1.6} /></div><div className="gr-meta" style={{ textAlign: 'center' }}>{s === 'scanning' ? M.t('appWaiting') : M.t('appReady')}</div></div>
        : <div className={cx('gr-faceid', s === 'scanning' && 'gr-scanning')}><div className="gr-ring"><Icon name="faceid" size={40} stroke={1.6} /></div><div className="gr-meta">{s === 'scanning' ? M.t('checking') : (note || M.t('nothingPaid'))}</div></div>}
      <Button size="lg" block icon={how === 'faceid' ? 'faceid' : how === 'app' ? 'phone' : 'lock'} disabled={(how === 'otp' && code.length < 6) || err >= 3} onClick={() => { if (how === 'otp' && validCode && code !== validCode) { setErr(err + 1); onWrong?.(err + 1); setCode(''); if (err + 1 < 3) focusBox(0); return } setErr(0); setS('scanning'); setTimeout(() => (document.querySelector('.gr-sheet') as HTMLElement | null)?.focus(), 0) }} loading={s === 'scanning'}>{label}</Button>
    </>}
  </div></div>
}

/** After it's done: the check, the reference, what happens next, and where it now lives. */
export function Receipt({ title = 'You’re going to Lisbon', reference = 'GR-48213', lines, next, actions }: any) {
  return <div className="gr-receipt" style={{ maxWidth: 360 }}>
    <CheckPop size={60} />
    <div className="gr-col" style={{ alignItems: 'center', gap: 6 }}><div className="gr-title">{title}</div><span className="gr-ref gr-code">{reference}</span></div>
    <div className="gr-perf" />
    {lines && <div className="gr-lines">{lines.map(([a, b]: any) => <div key={a}><span>{a}</span><span>{b}</span></div>)}</div>}
    {next && <div className="gr-banner gr-info" style={{ width: '100%', textAlign: 'start' }}><Spark size={16} /><span>{next}</span></div>}
    {actions && <div className="gr-actions" style={{ justifyContent: 'center' }}>{actions.map((a: any, i: number) => <Button key={a} size="sm" variant={i ? 'secondary' : 'primary'}>{a}</Button>)}</div>}
  </div>
}

/** Share or gift to people: orange rings mark who's chosen. */
export function SendTo({ people, selected = [] }: { people: { name: string; initials?: string; color?: string }[]; selected?: string[] }) {
  const M = useMarket()
  const [sel, setSel] = useState(selected)
  return <div className="gr-card" style={{ maxWidth: 380 }}>
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-heading">{M.t('sendTo')}</div><span className="gr-meta">{M.t('chosen', { n: M.num(sel.length) })}</span></div>
    <div className="gr-sendto">{people.map(p => { const on = sel.includes(p.name); return <button key={p.name} aria-pressed={on} onClick={() => setSel(on ? sel.filter(x => x !== p.name) : [...sel, p.name])}><span className="gr-pic" style={{ background: p.color }}>{p.initials || p.name[0]}{on && <CheckPop size={22} animate />}</span>{p.name.split(' ')[0]}</button> })}</div>
  </div>
}

/** One card for every moment something isn't as expected: sold out, price changed, can't reach, nothing found. */
export function StateCard({ kind = 'price', title, body, was, now, actions = [] }: { kind?: 'price' | 'soldout' | 'error' | 'empty' | 'done'; title: string; body?: any; was?: string; now?: string; actions?: string[] }) {
  const map: any = { price: ['warn', 'refresh'], soldout: ['danger', 'close'], error: ['danger', 'alert'], empty: ['', 'search'], done: ['good', 'check'] }
  const [tone, icon] = map[kind]
  return <div className={cx('gr-state', tone && 'gr-' + tone)} style={{ maxWidth: 360 }} role={kind === 'error' ? 'alert' : undefined}>
    <div className="gr-row" style={{ alignItems: 'flex-start' }}><span className="gr-ic"><Icon name={icon} size={22} stroke={2.2} /></span><div className="gr-grow"><div className="gr-heading">{title}</div>{body && <div className="gr-body" style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{body}</div>}</div></div>
    {was && now && <div className="gr-diff"><s>{was}</s><Icon name="arrow" size={16} color="var(--ink-soft)" /><b>{now}</b></div>}
    {actions.length > 0 && <div className="gr-actions">{actions.map((a, i) => <Button key={a} size="sm" variant={i ? 'secondary' : 'primary'}>{a}</Button>)}</div>}
  </div>
}
