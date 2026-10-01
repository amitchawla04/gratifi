import { React, useState, cx } from './r'
import { useMarket } from './market'
import { Icon, Spark } from './icons'
import { Button, Meta, Badge, Price, Sticker, Status, IconButton } from './base'

/* Fictional airlines only. Real airport codes are fine. */
export const AIRLINES: Record<string, { name: string; color: string }> = {
  NW: { name: 'Northway Air', color: '#1F3A5F' },
  CL: { name: 'Coastline', color: '#0F7C80' },
  AU: { name: 'Aurora Air', color: '#5B3FA8' },
}

export function AirlineMark({ code = 'NW', size = 30 }: { code?: string; size?: number }) {
  const a = AIRLINES[code] || { name: code, color: '#444' }
  return <span className="gr-mark" role="img" style={{ background: a.color, width: size, height: size }} aria-label={a.name} title={a.name}>{code}</span>
}

type Flight = { airline?: string; number?: string; dep: string; arr: string; from: string; to: string; dur: string; stops?: number; via?: string; plusDays?: number; price: number; points?: number; tags?: string[]; bag?: string; back?: string; left?: number; best?: string; selected?: boolean }

/** One flight option. Times and airports first, then the facts that change the choice, then the price in cash and points. */
export function FlightCard({ airline = 'NW', number = 'NW 214', dep, arr, from, to, dur, stops = 0, via, plusDays, price, points, tags = [], bag, back, left, best, selected, onSelect }: Flight & { onSelect?: () => void }) {
  const M = useMarket()
  const stopTxt = stops ? (stops === 1 ? M.t('stop1') : M.t('stopsN', { n: stops })) : M.t('direct')
  return <button className={cx('gr-flight', selected && 'gr-selected')} aria-pressed={!!selected} onClick={onSelect} aria-label={`${AIRLINES[airline]?.name}, ${dep} ${from}, ${arr} ${to}, ${dur}, ${stopTxt}, ${M.money(price)}`}>
    <div className="gr-top">
      <div className="gr-row" style={{ gap: 8 }}><AirlineMark code={airline} /><div><div style={{ fontWeight: 650, fontSize: '0.875rem' }}>{AIRLINES[airline]?.name}</div><div className="gr-meta gr-code" style={{ fontSize: '0.75rem' }}>{number}</div></div></div>
      {best ? <Badge tone="accent" icon="sparkle">{best}</Badge> : left ? <Badge tone="warn">{M.t('leftAtPrice', { n: left })}</Badge> : null}
    </div>
    <div className="gr-route">
      <div className="gr-end"><span className="gr-time">{dep}</span><span className="gr-iata">{from}</span></div>
      <div className="gr-path"><span className="gr-dur">{dur}</span><div className="gr-track">{stops > 0 && <i />}<span className="gr-plane"><Icon name="plane" size={16} stroke={2} /></span></div><span className={cx('gr-stops', !stops && 'gr-direct')}>{stopTxt}{stops && via ? ' · ' + via : ''}</span></div>
      <div className="gr-end gr-r"><span className="gr-time">{arr}{plusDays ? <span className="gr-plus">+{plusDays}</span> : null}</span><span className="gr-iata">{to}</span></div>
    </div>
    <div className="gr-hr" />
    <div className="gr-bottom">
      <div className="gr-col" style={{ gap: 6 }}>
        <Meta items={[...(bag ? [bag] : []), ...tags]} />
        {back && <span className="gr-back"><Spark size={12} />{back}</span>}
      </div>
      <Price amount={price} points={points} />
    </div>
  </button>
}

/** The whole journey, leg by leg, with the layover in between. A tight connection turns amber. */
export function Itinerary({ legs, layovers = [] }: { legs: { dep: string; arr: string; from: string; fromName: string; to: string; toName: string; airline: string; number: string; dur: string; cabin?: string; plane?: string }[]; layovers?: { text: string; short?: boolean }[] }) {
  const M = useMarket()
  return <div className="gr-card" style={{ maxWidth: 360 }}><div className="gr-itin">{legs.map((l, i) => <React.Fragment key={i}>
    <div className="gr-leg"><div className="gr-t">{l.dep}</div><div className="gr-rail2"><i /><span /></div><div className="gr-info"><div style={{ fontWeight: 650 }}>{l.fromName} <span className="gr-meta" style={{ display: 'inline' }}>{l.from}</span></div><div className="gr-row" style={{ gap: 8 }}><AirlineMark code={l.airline} size={22} /><Meta items={[l.number, l.dur, l.cabin || M.t('economy'), ...(l.plane ? [l.plane] : [])]} /></div></div></div>
    <div className="gr-leg"><div className="gr-t">{l.arr}</div><div className="gr-rail2"><i style={{ background: 'var(--ink)' }} /></div><div className="gr-info" style={{ paddingBottom: i < legs.length - 1 ? 8 : 0 }}><div style={{ fontWeight: 650 }}>{l.toName} <span className="gr-meta" style={{ display: 'inline' }}>{l.to}</span></div></div></div>
    {layovers[i] && <div className={cx('gr-layover', layovers[i].short && 'gr-short')}><Icon name={layovers[i].short ? 'alert' : 'clock'} size={16} />{layovers[i].text}</div>}
  </React.Fragment>)}</div></div>
}

/** Fare families side by side. What's included is ticked; what isn't is greyed, never hidden. */
export function FareFamilies({ fares, value, onChange }: { fares: { id: string; name: string; price: number; points?: number; items: [boolean, string][]; pop?: string }[]; value?: string; onChange?: (id: string) => void }) {
  const [v, setV] = useState(value ?? fares[1]?.id)
  return <div className="gr-fares" role="radiogroup" aria-label={fares.map(f => f.name).join(', ')}>{fares.map(f => <button key={f.id} className="gr-fare" role="radio" aria-checked={v === f.id} onClick={() => { setV(f.id); onChange?.(f.id) }}>
    {f.pop && <span className="gr-pop2"><Badge tone="accent">{f.pop}</Badge></span>}
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-heading">{f.name}</div><span className="gr-radio" /></div>
    <ul>{f.items.map(([on, t]) => <li key={t} className={on ? undefined : 'gr-off'}><Icon name={on ? 'check' : 'minus'} size={15} stroke={on ? 2.6 : 2} color={on ? 'var(--good)' : undefined} />{t}</li>)}</ul>
    <div style={{ marginTop: 'auto' }}><Price amount={f.price} points={f.points} align="left" /></div>
  </button>)}</div>
}

/** Seat map for one cabin section. Orange is your pick, black is who you're travelling with, blue has extra legroom. */
export function SeatMap({ rows = [12, 13, 14, 15, 16], exitAfter = 13, taken = ['12A', '12B', '13F', '14C', '15A', '15B', '16E', '16F'], extra = [14], mates = ['15D'], picked = '15E', extraPrice = 28, mateName = 'Sam', youName, onPick, mateNames, noExtra }: { mateNames?: Record<string, string>; noExtra?: boolean; youName?: string; rows?: number[]; exitAfter?: number; taken?: string[]; extra?: number[]; mates?: string[]; picked?: string; extraPrice?: number; mateName?: string; onPick?: (s: string) => void }) {
  const M = useMarket()
  const [p, setP] = useState(picked)
  const L = ['A', 'B', 'C'], R = ['D', 'E', 'F']
  const seat = (r: number, c: string) => { const id = r + c, x = extra.includes(r), ad = !!noExtra && x && !taken.includes(id) && !mates.includes(id), t = taken.includes(id) || ad, m = mates.includes(id), on = p === id
    return <button key={id} className={cx('gr-seat', t && 'gr-taken', x && !t && !on && !m && 'gr-extra', on && 'gr-pick', m && 'gr-mate')} aria-disabled={t} disabled={t} aria-pressed={on} aria-label={`${M.t('seatA11y', { id })}${ad ? ', ' + M.t('adultsOnly') : t ? ', ' + M.t('taken') : x ? ', ' + M.t('extraLegroom', { p: M.money(extraPrice) }) : ''}${m ? ', ' + (mateNames?.[id] || mateName) : ''}`} onClick={() => { if (!t && !m) { setP(id); onPick?.(id) } }}>{on ? <Icon name="check" size={14} stroke={3} /> : m ? (mateNames?.[id] || mateName)[0] : ''}</button> }
  return <div className="gr-seatmap" dir="ltr">
    <div className="gr-seatrow" style={{ marginBottom: 2 }}>{L.map(c => <span key={c} className="gr-rn">{c}</span>)}<span />{R.map(c => <span key={c} className="gr-rn">{c}</span>)}</div>
    {rows.map(r => <React.Fragment key={r}>
      <div className="gr-seatrow">{L.map(c => seat(r, c))}<span className="gr-rn">{r}</span>{R.map(c => seat(r, c))}</div>
      {r === exitAfter && <div className="gr-exit" dir="ltr"><span>◂ {M.t('exit')}</span><span>{M.t('exit')} ▸</span></div>}
    </React.Fragment>)}
    <div className="gr-seatkey" style={{ marginTop: 8 }}><span><i style={{ background: 'var(--accent)' }} />{youName || M.t('you')}</span><span><i style={{ background: 'var(--card-sunk)', backgroundImage: 'linear-gradient(135deg, transparent 44%, var(--ink-faint) 44%, var(--ink-faint) 56%, transparent 56%)' }} />{M.t('takenKey')}</span><span><i style={{ background: 'var(--pill)' }} />{mateName}</span><span><i style={{ background: 'var(--sticky-blue)' }} />{M.t('extraLegroom', { p: M.money(extraPrice) })}</span><span><i style={{ background: 'var(--card-sunk)', boxShadow: 'inset 0 0 0 1.5px var(--ink-faint)' }} />{M.t('free')}</span></div>
  </div>
}

/** Bags: what's included, then what can be added, priced per person per flight. */
export function BagPicker({ bags, cabinKg = 7, checkedKg = 23, cabinPrice = 18, checkedPrice = 32 }: { bags?: { icon: string; name: string; sub: string; incl?: boolean; price?: number }[]; cabinKg?: number; checkedKg?: number; cabinPrice?: number; checkedPrice?: number }) {
  const M = useMarket()
  bags = bags || [
    { icon: 'bag', name: M.t('smallBag'), sub: M.t('smallBagSub'), incl: true },
    { icon: 'cabinbag', name: M.t('cabinBag'), sub: M.t('cabinBagSub', { kg: M.num(cabinKg) }), price: cabinPrice },
    { icon: 'cabinbag', name: M.t('checkedBag'), sub: M.t('checkedBagSub', { kg: M.num(checkedKg) }), price: checkedPrice },
  ]
  const [n, setN] = useState<Record<string, number>>({})
  return <div className="gr-bags" style={{ maxWidth: 360, width: '100%' }}>{bags.map(b => <div key={b.name} className="gr-bag">
    <span className="gr-bic"><Icon name={b.icon} size={22} /></span>
    <div className="gr-grow"><div style={{ fontWeight: 650 }}>{b.name}</div><div className="gr-meta">{b.sub}</div></div>
    {b.incl ? <Badge tone="good" icon="check">{M.t('included')}</Badge> : <div className="gr-row" style={{ gap: 10 }}><span className="gr-meta" style={{ color: 'var(--ink)', fontWeight: 650 }}>+{M.money(b.price!)}</span>
      <div className="gr-stepper" role="group" aria-label={b.name}><button aria-label={M.t('removeX', { x: b.name })} disabled={!n[b.name]} onClick={() => setN({ ...n, [b.name]: (n[b.name] || 0) - 1 })}><Icon name="minus" size={16} stroke={2.4} /></button><output>{n[b.name] || 0}</output><button aria-label={M.t('addX', { x: b.name })} disabled={(n[b.name] || 0) >= 2} onClick={() => setN({ ...n, [b.name]: (n[b.name] || 0) + 1 })}><Icon name="plus" size={16} stroke={2.4} /></button></div></div>}
  </div>)}</div>
}

function QR({ seed = 7 }: { seed?: number }) {
  const M = useMarket()
  const cells = Array.from({ length: 49 }, (_, i) => { const r = Math.floor(i / 7), c = i % 7; const finder = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2); return finder || ((i * 37 + r * 17 + c * 11 + seed) % 7) < 3 })
  return <div className="gr-qr" role="img" aria-label={M.t('boardingCode')}>{cells.map((on, i) => <i key={i} className={on ? undefined : 'gr-o'} />)}</div>
}

/** The boarding pass. Big airport codes, the four numbers people look for, and the code to scan. */
export function BoardingPass({ name = 'A CHAWLA', airline = 'NW', number = 'NW 214', from = 'LHR', fromCity = 'London', to = 'LIS', toCity = 'Lisbon', date = 'Fri 16 Oct', boards = '06:45', gate = 'B32', seat = '15E', group = '2', dep = '07:25' }: any) {
  const M = useMarket()
  return <div className="gr-pass">
    <div className="gr-ptop">
      <div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-row" style={{ gap: 8 }}><AirlineMark code={airline} size={26} /><span style={{ fontWeight: 650, fontSize: '0.875rem' }}>{AIRLINES[airline]?.name}</span></div><span className="gr-code" style={{ opacity: .75 }}>{number}</span></div>
      <div className="gr-row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div><div className="gr-big">{from}</div><div style={{ fontSize: '0.8125rem', opacity: .7, fontWeight: 550 }}>{fromCity} · {dep}</div></div>
        <span><Icon name="plane" size={22} /></span>
        <div style={{ textAlign: 'end' }}><div className="gr-big">{to}</div><div style={{ fontSize: '0.8125rem', opacity: .7, fontWeight: 550 }}>{toCity}</div></div>
      </div>
      <div className="gr-pgrid">{[[M.t('boards'), boards], [M.t('gate'), gate], [M.t('seat'), seat], [M.t('group'), group]].map(([k, v]) => <div key={k}><span className="gr-label">{k}</span><b>{v}</b></div>)}</div>
    </div>
    <div className="gr-cut" />
    <div className="gr-pbot"><div className="gr-row" style={{ width: '100%', justifyContent: 'space-between' }}><div><div className="gr-label" style={{ color: '#66666E' }}>{M.t('passenger')}</div><div style={{ fontWeight: 700 }}>{name}</div><div className="gr-meta" style={{ color: '#66666E' }}>{date}</div></div><QR /></div></div>
  </div>
}

/** Live flight status: the arc shows progress, the three numbers show what changed. */
export function FlightTracker({ number = 'NW 214', from = 'LHR', to = 'LIS', status = 'Delayed 35 min', tone = 'warn', progress = 0, dep = '08:00', depWas = '07:25', arr = '10:35', gate = 'B32', note }: any) {
  const M = useMarket()
  const x = 10 + progress * 280, y = 60 - Math.sin(progress * Math.PI) * 50
  return <div className="gr-tracker">
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div className="gr-row" style={{ gap: 8 }}><AirlineMark code={number.slice(0, 2)} /><div><div className="gr-heading" dir="ltr" style={{ textAlign: 'start' }}>{from} → {to}</div><div className="gr-meta gr-code">{number}</div></div></div><Status tone={tone} live>{status}</Status></div>
    <div className="gr-arc"><svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
      <path d="M10 60 Q150 -40 290 60" fill="none" stroke="var(--ink-faint)" strokeWidth="2" strokeDasharray="4 5" />
      {progress > 0 && <path d="M10 60 Q150 -40 290 60" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray={`${progress} 1`} />}
      <circle cx="10" cy="60" r="5" fill="var(--ink)" /><circle cx="290" cy="60" r="5" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
      <g transform={`translate(${x - 9} ${y - 9})`}><circle cx="9" cy="9" r="13" fill="var(--card)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }} /></g>
    </svg><span style={{ position: 'absolute', left: `calc(${(x / 300) * 100}% - 9px)`, top: y - 9, color: 'var(--ink)' }}><Icon name="plane" size={18} stroke={2.1} /></span></div>
    <div className="gr-tgrid">
      <div><span className="gr-label">{M.t('departs')}</span><b className={depWas ? 'gr-chg' : undefined}>{dep}</b>{depWas && <s className="gr-meta">{depWas}</s>}</div>
      <div><span className="gr-label">{M.t('lands')}</span><b>{arr}</b></div>
      <div><span className="gr-label">{M.t('gate')}</span><b>{gate}</b></div>
    </div>
    {note && <div className="gr-banner gr-info"><Spark size={16} /><span>{note}</span></div>}
  </div>
}

/** When a flight is cancelled or badly delayed: what happened, what the customer is owed, and the options, already worked out. */
export function Disruption({ title = 'Your 07:25 to Lisbon is cancelled', body = 'Northway Air cancelled it at 07:05. You don’t need to queue. Here’s what you can do now.', options = [
  { id: 'a', t: 'Next direct, 11:40 today', s: 'Lands 14:15 · seats together held for 20 min', tag: 'Best' },
  { id: 'b', t: 'Via Porto, 10:55 today', s: 'Lands 15:10 · 55 min later than the direct' },
  { id: 'c', t: 'Full refund to your card', s: 'Card part and points back, in 5 to 7 working days' },
], owed, flight = 'NW 214', day = 'Fri 16 Oct' }: any) {
  const M = useMarket()
  const [v, setV] = useState('a')
  return <div className="gr-card gr-xl" style={{ maxWidth: 360 }}>
    <div className="gr-banner gr-danger"><Icon name="alert" size={18} /><span><b>{M.t('cancelled')}</b> · {flight} · {day}</span></div>
    <div className="gr-title">{title}</div>
    <div className="gr-body" style={{ color: 'var(--ink-soft)' }}>{body}</div>
    <div className="gr-opts" role="radiogroup" aria-label={M.t('rebookingOptions')}>{options.map((o: any) => <button key={o.id} className="gr-opt" role="radio" aria-checked={v === o.id} onClick={() => setV(o.id)}><span className="gr-radio" /><div className="gr-grow"><div style={{ fontWeight: 650 }}>{o.t}</div><div className="gr-meta">{o.s}</div></div>{o.tag && <Badge tone="accent">{o.tag}</Badge>}</button>)}</div>
    {owed && <div className="gr-banner gr-good"><Icon name="cash" size={18} /><span>{owed}</span></div>}
    <Button block size="lg">{v === 'c' ? M.t('requestRefund') : M.t('moveMe')}</Button>
  </div>
}

/** Change a booked flight: old against new, and the difference to pay or get back. */
export function ChangeFlight({ was = { day: 'Fri 16 Oct', time: '07:25 to 10:00' }, now = { day: 'Sat 17 Oct', time: '09:10 to 11:45' }, fee = 0, diff = 24 }: any) {
  const M = useMarket()
  return <div className="gr-card" style={{ maxWidth: 360 }}>
    <div className="gr-heading">{M.t('changeOutbound')}</div>
    <div className="gr-row" style={{ alignItems: 'stretch' }}>
      <div className="gr-well gr-grow" style={{ fontSize: '0.875rem' }}><div className="gr-label">{M.t('bookedLabel')}</div><div style={{ fontWeight: 650, textDecoration: 'line-through' }}>{was.day}</div><div className="gr-meta">{was.time}</div></div>
      <div className="gr-row" style={{ color: 'var(--ink-soft)' }}><Icon name="arrow" size={18} className="gr-flipx" /></div>
      <div className="gr-well gr-grow" style={{ background: 'var(--accent-soft)', fontSize: '0.875rem' }}><div className="gr-label" style={{ color: 'var(--accent-ink)' }}>{M.t('newLabel')}</div><div style={{ fontWeight: 650 }}>{now.day}</div><div className="gr-meta" style={{ color: 'var(--ink)' }}>{now.time}</div></div>
    </div>
    <div className="gr-lines"><div><span>{M.t('changeFee')}</span><span>{fee ? M.money(fee) : M.t('freeOnFare')}</span></div><div><span>{M.t('fareDiff')}</span><span>{diff >= 0 ? '+' + M.money(diff) : M.money(diff)}</span></div><div className="gr-total"><span>{fee + diff >= 0 ? M.t('toPay') : M.t('youGetBack')}</span><span>{M.money(Math.abs(fee + diff))}</span></div></div>
    <Button block>{M.t('changeFor', { p: M.money(Math.max(0, fee + diff)) })}</Button>
  </div>
}

/** The rules in plain words. Green is free, amber costs, grey isn't possible. */
export function FareRules({ rules = [
  ['ok', 'Change date', 'Free up to 24 hours before'],
  ['fee', 'Cancel', 'Fee applies, rest back as travel credit'],
  ['ok', 'Seat choice', 'Standard seats free'],
  ['nope', 'Refund to card', 'Not on this fare'],
] as [string, string, string][], fare }: { rules?: [string, string, string][]; fare?: string }) {
  const M = useMarket()
  const ic: any = { ok: 'check', fee: 'cash', nope: 'minus' }
  return <div className="gr-card" style={{ maxWidth: 360, gap: 4 }}><div className="gr-heading" style={{ marginBottom: 4 }}>{M.t('yourFare', { f: fare ?? M.t('standardFare') })}</div><div className="gr-rules">{rules.map(([k, t, s]) => <div key={t}><span className={cx('gr-ric', 'gr-' + k)}><Icon name={ic[k]} size={16} stroke={2.4} /></span><div className="gr-grow"><div style={{ fontWeight: 650, fontSize: '0.875rem' }}>{t}</div><div className="gr-meta">{s}</div></div></div>)}</div></div>
}

/* ================= Stays ================= */

export function HotelCard({ src, name, area, rating, reviews, price, points, nights = 2, perks = [], sticker, back }: any) {
  const M = useMarket()
  const [fav, setFav] = useState(false)
  return <div className="gr-hotel">
    {sticker && <Sticker tilt={-8}>{sticker}</Sticker>}
    <div className="gr-ph"><img src={src} alt="" /><span className="gr-fav"><IconButton icon="heart" label={fav ? M.t('saved') : M.t('save')} small onClick={() => setFav(!fav)} /></span></div>
    <div className="gr-in">
      <div className="gr-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}><div><div className="gr-heading">{name}</div><Meta items={[area]} /></div>{rating != null && <span className="gr-rating"><Icon name="star" size={14} filled color="var(--accent)" />{rating}{reviews != null && <span className="gr-meta" style={{ fontWeight: 500 }}>({M.num(reviews)})</span>}</span>}</div>
      {perks.length > 0 && <Meta items={perks} />}
      <div className="gr-row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>{back ? <span className="gr-back"><Spark size={12} />{back}</span> : <span />}<Price amount={price} points={points} note={M.t('nightsTaxes', { n: M.num(nights) })} /></div>
    </div>
  </div>
}

export function RoomOption({ src, name, facts, price, cancel, checked, onPick }: any) {
  const M = useMarket()
  return <button className="gr-room" role="radio" aria-checked={!!checked} onClick={onPick}>
    <div className="gr-ph"><img src={src} alt="" /></div>
    <div className="gr-grow gr-col" style={{ gap: 4 }}><div style={{ fontWeight: 650 }}>{name}</div><Meta items={facts} />{cancel && <span className="gr-meta" style={{ color: 'var(--good)', fontWeight: 600 }}><Icon name="check" size={13} stroke={2.6} />{cancel}</span>}<div style={{ fontWeight: 700, marginTop: 'auto' }}>{M.money(price)} <span className="gr-meta" style={{ display: 'inline', fontWeight: 500 }}>{M.t('total')}</span></div></div>
    <span className="gr-radio" style={{ alignSelf: 'center', boxShadow: checked ? 'inset 0 0 0 7px var(--ink)' : undefined }} />
  </button>
}

/** When money comes back if plans change. Dates, not rules. */
export function Cancellation({ steps = [
  { tone: 'good', t: 'Free cancellation', s: 'Until 23:59, Tue 13 Oct' },
  { tone: 'warn', t: 'First night charged', s: 'From Wed 14 Oct' },
  { tone: 'danger', t: 'No refund', s: 'From check-in, Fri 16 Oct' },
] }: any) {
  const M = useMarket()
  return <div className="gr-card" style={{ maxWidth: 360, width: '100%' }}><div className="gr-heading">{M.t('ifPlansChange')}</div><div className="gr-timeline">{steps.map((x: any, i: number) => <div key={x.t} className="gr-tl"><div className="gr-dotc"><i style={{ background: `var(--${x.tone})` }} />{i < steps.length - 1 && <span />}</div><div className="gr-txt"><div style={{ fontWeight: 650, fontSize: '0.875rem' }}>{x.t}</div><div className="gr-meta">{x.s}</div></div></div>)}</div></div>
}

/* ================= Experiences and more ================= */

export function ExperienceCard({ src, name, when, meta, price, points, rating }: any) {
  return <div className="gr-exp"><div className="gr-ph"><img src={src} alt="" />{when && <span className="gr-when">{when}</span>}</div><div className="gr-in"><div className="gr-heading" style={{ fontSize: '1rem' }}>{name}</div><Meta items={meta} /><div className="gr-row" style={{ justifyContent: 'space-between' }}>{rating ? <span className="gr-rating"><Icon name="star" size={14} filled color="var(--accent)" />{rating}</span> : <span />}<Price amount={price} points={points} /></div></div></div>
}

export function TimeSlots({ slots = [['18:00', 42], ['18:30', 42], ['19:00', 'Full'], ['19:30', 48], ['20:00', 48], ['20:30', 48], ['21:00', 'Full'], ['21:30', 38]] as [string, number | string][], value = '19:30' }: any) {
  const M = useMarket()
  const [v, setV] = useState(value)
  return <div className="gr-slots" style={{ maxWidth: 360 }}>{slots.map(([t, s0]: [string, any]) => { const full = s0 === 'Full' || s0 === M.t('full'); const s = typeof s0 === 'number' ? M.money(s0) : s0; return <button key={t} className="gr-slot" aria-disabled={full} aria-pressed={v === t} onClick={() => !full && setV(t)} aria-label={`${t}, ${full ? M.t('full') : s}`}>{t}<small>{full ? M.t('full') : s}</small></button> })}</div>
}

export function GiftCardTile({ brand = 'Harbour & Co', amount: amt = 50, color = '#2E5E4E', note }: any) {
  const M = useMarket(); const amount = typeof amt === 'number' ? M.money(amt) : amt
  return <div className="gr-gift" style={{ background: color }}><div className="gr-row" style={{ justifyContent: 'space-between', position: 'relative', zIndex: 1 }}><span className="gr-gname">{brand}</span><Icon name="gift" size={20} /></div><div style={{ position: 'relative', zIndex: 1 }}><div className="gr-amt">{amount}</div><div style={{ fontSize: '0.75rem', opacity: .85, fontWeight: 600 }}>{note}</div></div></div>
}

export function RideOption({ name = 'Standard', eta = '4 min away', seats = 4, price = 38, checked, onPick, note }: any) {
  const M = useMarket()
  return <button className="gr-ride" role="radio" aria-checked={!!checked} onClick={onPick}><span className="gr-car"><Icon name="car" size={24} /></span><div className="gr-grow"><div style={{ fontWeight: 650 }}>{name}</div><Meta items={[eta, M.t('seatsN', { n: M.num(seats) }), ...(note ? [note] : [])]} /></div><div style={{ fontWeight: 700 }}>{M.money(price)}</div></button>
}

export function LoungePass({ name = 'The Orchard', where = 'Heathrow T5 · after security', valid = 'Fri 16 Oct · 3 hours before your flight', guests = 1 }: any) {
  const M = useMarket()
  return <div className="gr-lounge"><div className="gr-lt"><div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label">{M.t('loungePass')}</span><Icon name="sofa" size={20} /></div><div className="gr-title" style={{ color: 'inherit' }}>{name}</div><div style={{ fontSize: '0.8125rem', opacity: .8, fontWeight: 550 }}>{where}</div></div>
    <div className="gr-lb"><div><div style={{ fontWeight: 650, fontSize: '0.875rem' }}>{M.t('youPlus', { n: M.num(guests) })}</div><div className="gr-meta">{valid}</div></div><QR seed={3} /></div></div>
}

/* ================= Bank ================= */

export function PaymentDue({ amount = 642.18, min = 25, date = '4\u00a0Nov', days = 9, autopay = false, onPay, onSetup, actions = true }: any) {
  const M = useMarket()
  return <div className="gr-due">
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><span className="gr-label">{M.t('paymentDue')}</span>{days <= 3 ? <Badge tone="warn">{M.t('inDays', { n: M.num(days) })}</Badge> : <Badge>{date}</Badge>}</div>
    <div className="gr-row" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}><div><div className="gr-time">{M.money(amount, 2)}</div><div className="gr-meta">{min > 0 ? M.t('minBy', { amt: M.money(min, 2), date }) : M.t('minPaid', { date })}</div></div></div>
    {autopay ? <div className="gr-banner gr-good"><Icon name="check" size={18} /><span>{M.t('ddPays', { dd: M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1), date })}</span></div> : actions ? <div className="gr-actions"><Button size="sm" onClick={onPay}>{M.t('payNow')}</Button><Button size="sm" variant="secondary" onClick={onSetup}>{M.t('setUp', { dd: M.directDebit })}</Button></div> : null}
  </div>
}

export function TransactionRow({ mono, color = 'var(--card-sunk)', ink = 'var(--ink)', name, meta, amount, points, refund }: any) {
  const M = useMarket()
  return <div className="gr-txn"><span className="gr-mono" style={{ background: color, color: ink }}>{mono}</span><div className="gr-grow"><div style={{ fontWeight: 650 }}>{name}</div><Meta items={meta} /></div><div className="gr-col" style={{ gap: 0, alignItems: 'flex-end' }}><span className={cx('gr-amt', refund && 'gr-in')}>{refund ? '+' : ''}{M.money(amount, 2)}</span>{points && <span className="gr-back" style={{ fontSize: '0.75rem' }}>+{M.pts(points)}</span>}</div></div>
}

export function BenefitRow({ icon = 'shield', name, sub, value, onClick }: any) {
  return <button className="gr-benefit" style={{ width: '100%', textAlign: 'start' }} onClick={onClick}><span className="gr-bi"><Icon name={icon} size={19} /></span><div className="gr-grow"><div style={{ fontWeight: 650, fontSize: '0.9375rem' }}>{name}</div><div className="gr-meta">{sub}</div></div>{value && <span style={{ fontWeight: 650, fontSize: '0.875rem' }}>{value}</span>}<Icon name="chev" size={18} color="var(--ink-faint)" className="gr-flipx" /></button>
}
