/* The chat components the full booking flows need (2 Oct 2026 flows doc, "The components each flow needs").
   Built only from the approved 27 Sep language: white cards with big radius, one orange accent, black pills,
   grey dot-separated meta, round white icon buttons, handwriting only on sticky notes, orange-ringed avatars,
   the white dial with orange ticks, the calendar card. Each takes plain data so any service can reuse it. */
import { React, useState } from '../../kit/src/r'
import { Icon } from '../../kit/src/icons'
import * as D from './design'

const Tick = ({ on }: { on: boolean }) => <span className={'c2-tick' + (on ? ' on' : '')} aria-hidden="true">{on && <Icon name="check" size={14} stroke={3} />}</span>
const Cta = ({ children, onClick, disabled }: { children: any; onClick?: () => void; disabled?: boolean }) => <button className="ds-btn48 gr-btn" disabled={disabled} onClick={onClick}>{children}</button>
const Card = ({ children, cls = '' }: { children: any; cls?: string }) => <div className={'c2-card ' + cls}>{children}</div>
const Head = ({ title, sub }: { title: string; sub?: string }) => <div className="c2-head"><p className="c2-t">{title}</p>{sub && <p className="c2-s">{sub}</p>}</div>
const fmt = (n: number) => n.toLocaleString('en-GB')

/* ---------- Partly built, now finished ---------- */

/** Points and card, with a slider for the split. Points value is shown live in money. */
export function PaySplit({ total, balance, rate = 100, cta = 'Pay' }: { total: number; balance: number; rate?: number; cta?: string }) {
  const max = Math.min(balance, total * rate)
  const [pts, setPts] = useState(max)
  const cash = Math.max(0, total - pts / rate)
  const pct = max ? (pts / max) * 100 : 0
  return <Card>
    <Head title="How to pay" sub={`You have ${fmt(balance)} points`} />
    <div className="c2-split">
      <div><span>Points</span><b>{fmt(pts)}</b></div>
      <div><span>Card</span><b>£{cash.toFixed(2)}</b></div>
    </div>
    <input className="c2-range" type="range" min={0} max={max} step={rate * 5} value={pts} onChange={(e: any) => setPts(+e.target.value)} style={{ ['--p' as any]: pct + '%' }} aria-label="Points to use" />
    <div className="c2-range-l"><span>All card</span><span>All points</span></div>
    <Cta>{cash > 0 ? `${cta} ${fmt(pts)} points + £${cash.toFixed(2)}` : `${cta} ${fmt(pts)} points`}</Cta>
  </Card>
}

/** Time slots grouped by part of the day. Taken slots stay visible but can't be picked. */
export function Slots({ title, sub, groups, note }: { title: string; sub?: string; groups: { label: string; slots: { t: string; off?: boolean; tag?: string }[] }[]; note?: string }) {
  const [v, setV] = useState('')
  return <Card>
    <Head title={title} sub={sub} />
    {groups.map(g => <div key={g.label} className="ds-opt"><span className="ds-opt-l">{g.label}</span><div className="c2-slots" role="radiogroup" aria-label={g.label}>{g.slots.map(s => <button key={s.t} role="radio" aria-checked={v === s.t} disabled={s.off} className="c2-slot" onClick={() => setV(s.t)}>{s.t}{s.tag && <i>{s.tag}</i>}</button>)}</div></div>)}
    {note && <D.AssistantNote>{note}</D.AssistantNote>}
    <Cta disabled={!v}>{v ? `Book ${v}` : 'Pick a time'}</Cta>
  </Card>
}

/** Several items in one checkout. Quantity with round white buttons, total at the bottom. */
export function Basket({ items, delivery }: { items: { art?: string; title: string; sub?: string; pts: number; qty: number }[]; delivery?: string }) {
  const [q, setQ] = useState(items.map(i => i.qty))
  const total = items.reduce((a, it, i) => a + it.pts * q[i], 0)
  return <Card>
    <Head title="Your basket" sub={`${q.reduce((a, b) => a + b, 0)} items`} />
    <div className="c2-list">{items.map((it, i) => <div key={it.title} className="c2-brow">
      <span className="c2-ph">{it.art && <img src={it.art} alt="" />}</span>
      <span className="c2-b"><span className="ds-row-t">{it.title}</span>{it.sub && <span className="ds-row-s">{it.sub}</span>}<b className="c2-pts">{fmt(it.pts * q[i])} points</b></span>
      <span className="c2-qty"><button className="c2-rb" aria-label="Fewer" onClick={() => setQ(q.map((x, k) => k === i ? Math.max(0, x - 1) : x))}><Icon name={q[i] <= 1 ? 'trash' : 'minus'} size={15} stroke={2.4} /></button><b>{q[i]}</b><button className="c2-rb" aria-label="More" onClick={() => setQ(q.map((x, k) => k === i ? x + 1 : x))}><Icon name="plus" size={15} stroke={2.4} /></button></span>
    </div>)}</div>
    <div className="c2-kv">{delivery && <div className="ds-kv-r"><span>Delivery</span><b>{delivery}</b></div>}<div className="ds-kv-r"><span>Total</span><b>{fmt(total)} points</b></div></div>
    <Cta>Check out</Cta>
  </Card>
}

/** Pick the payment to question, then say what went wrong. */
export function DisputePick({ txns, reasons }: { txns: { id: string; art?: string; title: string; sub: string; amt: string }[]; reasons: string[] }) {
  const [t, setT] = useState(''); const [r, setR] = useState('')
  return <Card>
    <Head title="Which payment?" sub="Last 30 days" />
    <div className="c2-list">{txns.map(x => <button key={x.id} className="c2-prow" role="radio" aria-checked={t === x.id} onClick={() => setT(x.id)}>
      <span className="c2-ph sm">{x.art ? <img src={x.art} alt="" /> : <Icon name="card" size={18} />}</span>
      <span className="c2-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{x.sub}</span></span><b className="c2-amt">{x.amt}</b><Tick on={t === x.id} />
    </button>)}</div>
    {t && <div className="ds-opt"><span className="ds-opt-l">What went wrong?</span><div className="c2-slots">{reasons.map(x => <button key={x} className="c2-slot" role="radio" aria-checked={r === x} onClick={() => setR(x)}>{x}</button>)}</div></div>}
    <Cta disabled={!t || !r}>Raise it with the bank</Cta>
  </Card>
}

/** Documents for a visa, claim or dispute: one row each, a photo tile when added. */
export function Upload({ title, docs }: { title: string; docs: { title: string; sub: string; done?: boolean }[] }) {
  const [d, setD] = useState(docs.map(x => !!x.done))
  return <Card>
    <Head title={title} sub={`${d.filter(Boolean).length} of ${docs.length} added`} />
    <div className="c2-list">{docs.map((x, i) => <div key={x.title} className="c2-prow">
      <span className={'c2-doc' + (d[i] ? ' on' : '')}><Icon name={d[i] ? 'check' : 'doc'} size={18} stroke={2.2} /></span>
      <span className="c2-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{d[i] ? 'Added' : x.sub}</span></span>
      {d[i] ? <button className="ds-opill" onClick={() => setD(d.map((y, k) => k === i ? false : y))}>Replace</button> : <button className="ds-opill primary" onClick={() => setD(d.map((y, k) => k === i ? true : y))}>Add photo</button>}
    </div>)}</div>
    <Cta disabled={d.some(x => !x)}>Send</Cta>
  </Card>
}

/* ---------- Missing, now built ---------- */

/** Flights and trains: trip type, route with a swap button, dates, travellers and cabin. */
export function TripForm() {
  const [type, setType] = useState('Return'); const [a, setA] = useState(['London', 'LHR · Heathrow']); const [b, setB] = useState(['Lisbon', 'LIS · Humberto Delgado'])
  const legs = type === 'Multi-city' ? 2 : 1
  return <Card>
    <D.Seg items={['One way', 'Return', 'Multi-city']} value={type} onChange={setType} />
    {Array.from({ length: legs }).map((_, k) => <div key={k} className="c2-route">
      <div className="c2-field"><span>From</span><b>{k ? b[0] : a[0]}</b><i>{k ? b[1] : a[1]}</i></div>
      <div className="c2-field"><span>To</span><b>{k ? 'Porto' : b[0]}</b><i>{k ? 'OPO · Francisco Sá Carneiro' : b[1]}</i></div>
      {!k && <button className="c2-swap" aria-label="Swap" onClick={() => { setA(b); setB(a) }}><Icon name="swap" size={18} stroke={2.2} /></button>}
    </div>)}
    <div className="c2-grid2">
      <div className="c2-field"><span>Depart</span><b>Fri 16 Oct</b></div>
      <div className="c2-field"><span>{type === 'One way' ? 'Return' : type === 'Multi-city' ? 'Second flight' : 'Return'}</span><b className={type === 'One way' ? 'c2-dim' : ''}>{type === 'One way' ? 'Add' : type === 'Multi-city' ? 'Tue 20 Oct' : 'Mon 19 Oct'}</b></div>
      <div className="c2-field"><span>Travellers</span><b>2 adults</b></div>
      <div className="c2-field"><span>Cabin</span><b>Economy</b></div>
    </div>
    <Cta><Icon name="search" size={20} stroke={2.2} />Search flights</Cta>
  </Card>
}

/** Who's going: saved people as avatars with the orange ring when picked, and Add person. */
export function Travellers({ people, need = 2 }: { people: { name: string; sub: string; kind?: string }[]; need?: number }) {
  const [on, setOn] = useState<string[]>(people.slice(0, 1).map(p => p.name)); const [adding, setAdding] = useState(false); const [kind, setKind] = useState('Adult')
  const ini = (n: string) => n.split(' ').map(x => x[0]).join('').slice(0, 2)
  return <Card>
    <Head title="Who's going?" sub={`${on.length} of ${need} picked`} />
    <div className="c2-avs">{people.map(p => <button key={p.name} className="c2-av" aria-pressed={on.includes(p.name)} onClick={() => setOn(on.includes(p.name) ? on.filter(x => x !== p.name) : [...on, p.name])}>
      <span className="c2-av-c">{ini(p.name)}{on.includes(p.name) && <i><Icon name="check" size={11} stroke={3.2} /></i>}</span><b>{p.name.split(' ')[0]}</b><span>{p.kind || 'Adult'}</span>
    </button>)}
      <button className="c2-av" onClick={() => setAdding(!adding)}><span className="c2-av-c add"><Icon name="plus" size={20} stroke={2.2} /></span><b>Add</b><span>Someone new</span></button></div>
    {adding && <div className="c2-form">
      <D.Seg items={['Adult', 'Child', 'Infant']} value={kind} onChange={setKind} />
      <label className="c2-in"><span>First and middle names, as on passport</span><input placeholder="Priya" /></label>
      <label className="c2-in"><span>Last name</span><input placeholder="Shah" /></label>
      <label className="c2-in"><span>Date of birth</span><input placeholder="DD / MM / YYYY" inputMode="numeric" /></label>
      {kind !== 'Adult' && <p className="ds-row-s">{kind === 'Child' ? 'Ages 2 to 11 on the day of travel.' : 'Under 2 on the day of travel, sits on your lap.'}</p>}
    </div>}
    <Cta disabled={on.length !== need && !adding}>{adding ? 'Save and add' : on.length === need ? 'Continue' : `Pick ${need - on.length} more`}</Cta>
  </Card>
}

/** Passport details for international trips: scan or type. */
export function Passport({ name }: { name: string }) {
  return <Card>
    <Head title={`${name}'s passport`} sub="Needed by the airline before you fly" />
    <button className="c2-scan"><Icon name="qr" size={20} stroke={2} /><span><b>Scan passport</b><i>Point the camera at the photo page</i></span><Icon name="chev" size={18} stroke={2.2} /></button>
    <div className="c2-or"><span>or type it in</span></div>
    <div className="c2-form">
      <label className="c2-in"><span>Passport number</span><input placeholder="123456789" /></label>
      <div className="c2-grid2">
        <label className="c2-in"><span>Nationality</span><input placeholder="British" /></label>
        <label className="c2-in"><span>Expiry date</span><input placeholder="DD / MM / YYYY" /></label>
      </div>
    </div>
    <p className="c2-fine"><Icon name="lock" size={14} stroke={2.2} />Saved to your profile for next time. Only shared with the airline.</p>
    <Cta>Save</Cta>
  </Card>
}

/** Extras: tick as many as you like, the added total updates. */
export function Extras({ title, items }: { title: string; items: { art?: string; icon?: string; title: string; sub: string; pts: number; free?: string }[] }) {
  const [on, setOn] = useState<number[]>([])
  const add = on.reduce((a, i) => a + items[i].pts, 0)
  return <Card>
    <Head title={title} sub={add ? `${fmt(add)} points added` : 'All optional'} />
    <div className="c2-list">{items.map((x, i) => <button key={x.title} className="c2-prow" role="checkbox" aria-checked={on.includes(i)} onClick={() => setOn(on.includes(i) ? on.filter(k => k !== i) : [...on, i])}>
      <span className="c2-ph sm">{x.art ? <img src={x.art} alt="" /> : <Icon name={x.icon || 'plus'} size={18} stroke={2} />}</span>
      <span className="c2-b"><span className="ds-row-t">{x.title}</span><span className="ds-row-s">{x.sub}</span></span>
      <b className="c2-amt">{x.free || `+${fmt(x.pts)}`}</b><Tick on={on.includes(i)} />
    </button>)}</div>
    <Cta>{add ? `Add ${on.length} for ${fmt(add)} points` : 'Skip extras'}</Cta>
  </Card>
}

/** Two options side by side. The better value on each row gets the orange check. */
export function Compare({ a, b, rows }: { a: { art: string; title: string }; b: { art: string; title: string }; rows: [string, string, string, 0 | 1 | 2][] }) {
  return <Card cls="c2-cmp">
    <div className="c2-cmp-h">{[a, b].map(x => <div key={x.title}><img src={x.art} alt="" /><b>{x.title}</b></div>)}</div>
    {rows.map(([k, x, y, w]) => <div key={k} className="c2-cmp-r"><span className="c2-cmp-k">{k}</span><div className="c2-cmp-v"><span>{w === 1 && <Icon name="check" size={14} stroke={3} />}{x}</span><span>{w === 2 && <Icon name="check" size={14} stroke={3} />}{y}</span></div></div>)}
    <div className="c2-grid2"><button className="ds-btn40">Choose</button><button className="ds-btn40">Choose</button></div>
  </Card>
}

/** A drawn map with price pins. The picked pin turns orange and its place shows underneath. */
export function MapView({ pins }: { pins: { x: number; y: number; label: string; title: string; sub: string; art?: string }[] }) {
  const [p, setP] = useState(0); const sel = pins[p]
  return <Card cls="c2-map">
    <div className="c2-map-c">
      <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="360" height="240" fill="#EFECE6" />
        <path d="M0 180 C 80 160, 140 210, 220 190 S 340 150, 360 165 L360 240 L0 240Z" fill="#CFE0EA" />
        <rect x="236" y="22" width="92" height="64" rx="18" fill="#DCE8D2" />
        <path d="M-10 70 L370 40 M40 -10 L90 250 M170 -10 L150 250 M-10 130 L370 120 M260 -10 L300 250" stroke="#FFFFFF" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M-10 100 L370 86 M110 -10 L210 250" stroke="#FFFFFF" strokeWidth="4" fill="none" />
      </svg>
      {pins.map((x, i) => <button key={x.title} className={'c2-pin' + (i === p ? ' on' : '')} style={{ left: x.x + '%', top: x.y + '%' }} onClick={() => setP(i)}>{x.label}</button>)}
      <span className="c2-me" style={{ left: '46%', top: '58%' }} aria-label="You are here" />
    </div>
    <div className="c2-prow"><span className="c2-ph">{sel.art && <img src={sel.art} alt="" />}</span><span className="c2-b"><span className="ds-row-t">{sel.title}</span><span className="ds-row-s">{sel.sub}</span></span><button className="ds-opill primary">View</button></div>
  </Card>
}

/** Room choice: picture, bed, board and cancel rules as checks, price, Select. */
export function Rooms({ rooms }: { rooms: { art: string; title: string; facts: string[]; pts: number; cash: string; left?: string }[] }) {
  const [v, setV] = useState(-1)
  return <div className="c2-stack">{rooms.map((r, i) => <div key={r.title} className={'c2-room' + (v === i ? ' on' : '')}>
    <img src={r.art} alt="" />
    <div className="c2-room-b">
      <p className="ds-ip-t">{r.title}</p>
      <ul className="ds-checks c2-facts">{r.facts.map(f => <li key={f}><Icon name="check" size={14} stroke={2.8} />{f}</li>)}</ul>
      <div className="c2-room-f"><span className="ds-price"><b>{fmt(r.pts)} points</b><span>or {r.cash}</span>{r.left && <span className="c2-left">{r.left}</span>}</span><button className={'ds-opill' + (v === i ? '' : ' primary')} onClick={() => setV(i)}>{v === i ? <><Icon name="check" size={14} stroke={3} />Selected</> : 'Select'}</button></div>
    </div>
  </div>)}</div>
}

/** Concerts, sports, theatre and cinema: pick a section by price, then the exact seats. */
export function VenueMap({ qty = 2 }: { qty?: number }) {
  const secs = [
    { id: 'A', band: 2, d: 'M110 70 L250 70 L262 108 L98 108Z', pts: 18400 },
    { id: 'B', band: 1, d: 'M60 76 L104 70 L92 112 L40 124Z', pts: 12600 }, { id: 'C', band: 1, d: 'M256 70 L300 76 L320 124 L268 112Z', pts: 12600 },
    { id: 'D', band: 0, d: 'M36 132 L92 120 L104 168 L46 186Z', pts: 8200 }, { id: 'E', band: 1, d: 'M100 116 L260 116 L252 164 L108 164Z', pts: 12600 }, { id: 'F', band: 0, d: 'M268 120 L324 132 L314 186 L256 168Z', pts: 8200 },
    { id: 'G', band: 0, d: 'M56 196 L112 174 L248 174 L304 196 L290 222 L70 222Z', pts: 6400 },
  ]
  const [s, setS] = useState('E'); const sec = secs.find(x => x.id === s)!
  const rows = 6, cols = 12; const taken = (r: number, c: number) => ((r * 7 + c * 3 + s.charCodeAt(0)) % 5 === 0)
  const [seats, setSeats] = useState<string[]>(['C6', 'C7'])
  const pick = (k: string) => setSeats(seats.includes(k) ? seats.filter(x => x !== k) : [...seats, k].slice(-qty))
  return <Card>
    <Head title="Pick your seats" sub={`The Lumens · Northbank Arena · Sat 24 Oct · ${qty} tickets`} />
    <div className="c2-venue">
      <svg viewBox="0 0 360 236" role="group" aria-label="Seating plan">
        <path d="M120 22 Q180 6 240 22 L232 50 Q180 38 128 50Z" fill="#17171A" /><text x="180" y="37" textAnchor="middle" fontSize="11" fontWeight="700" fill="#F4F4F3">STAGE</text>
        {secs.map(x => <path key={x.id} d={x.d} className={'c2-sec b' + x.band + (x.id === s ? ' on' : '')} onClick={() => setS(x.id)} />)}
        {secs.map(x => <text key={'t' + x.id} className={'c2-sec-t' + (x.band === 2 && x.id !== s ? ' inv' : '')} x={x.d.match(/[\d.]+/g)!.filter((_, i) => i % 2 === 0).reduce((a, b, _, arr) => a + +b / arr.length, 0)} y={x.d.match(/[\d.]+/g)!.filter((_, i) => i % 2 === 1).reduce((a, b, _, arr) => a + +b / arr.length, 0) + 4} textAnchor="middle">{x.id}</text>)}
      </svg>
    </div>
    <div className="c2-legend"><span><i className="b2" />18,400</span><span><i className="b1" />12,600</span><span><i className="b0" />6,400–8,200</span></div>
    <div className="ds-opt"><span className="ds-opt-l">Block {s} · {fmt(sec.pts)} points each</span>
      <div className="c2-seats" role="group" aria-label={`Seats in block ${s}`}>{Array.from({ length: rows }).map((_, r) => <div key={r} className="c2-srow"><span>{'ABCDEF'[r]}</span>{Array.from({ length: cols }).map((_, c) => { const k = 'ABCDEF'[r] + (c + 1); const t = taken(r, c); return <button key={k} className={'c2-seat' + (seats.includes(k) ? ' on' : '')} disabled={t} aria-label={`Seat ${k}`} aria-pressed={seats.includes(k)} onClick={() => pick(k)} /> })}</div>)}</div>
    </div>
    <Cta disabled={seats.length !== qty}>{seats.length === qty ? `${seats.join(', ')} · ${fmt(sec.pts * qty)} points` : `Pick ${qty - seats.length} more`}</Cta>
  </Card>
}

/** Waiting in a big ticket sale: the dial fills as the queue moves. */
export function Queue({ ahead = 1240, mins = 6, pct = 0.62 }: { ahead?: number; mins?: number; pct?: number }) {
  const ticks = 48
  return <Card cls="c2-queue">
    <Head title="You're in the queue" sub="The Lumens · Northbank Arena · general sale" />
    <div className="c2-dial">
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="92" fill="#FFFFFF" />
        {Array.from({ length: ticks }).map((_, i) => { const a = (i / ticks) * Math.PI * 2 - Math.PI / 2; const on = i / ticks < pct; return <line key={i} x1={100 + Math.cos(a) * 78} y1={100 + Math.sin(a) * 78} x2={100 + Math.cos(a) * 88} y2={100 + Math.sin(a) * 88} stroke={on ? '#FF6A1F' : '#E4E2DE'} strokeWidth="3.2" strokeLinecap="round" /> })}
        <circle cx="100" cy="100" r="60" fill="#17171A" />
      </svg>
      <div className="c2-dial-in"><b>{fmt(ahead)}</b><span>ahead of you</span></div>
    </div>
    <p className="c2-center">About {mins} minutes</p>
    <D.Note title="You can leave this screen">We'll keep your place and message you the moment it's your turn. You'll have 10 minutes to pick seats.</D.Note>
  </Card>
}

/** Cinema: the film, the day, then each cinema with its times and formats. */
export function Showtimes({ art }: { art: string }) {
  const [day, setDay] = useState('Today'); const [t, setT] = useState('')
  const cin = [{ n: 'Lumière Leicester Square', d: '0.4 miles', times: [['12:40'], ['15:30', 'IMAX'], ['18:20'], ['21:10', 'IMAX']] }, { n: 'Electric Soho', d: '0.7 miles', times: [['13:15'], ['17:45'], ['20:30', 'Recliner']] }, { n: 'Northlight Central', d: '0.5 miles', times: [['14:00'], ['19:05']] }]
  return <Card>
    <div className="c2-film"><img src={art} alt="" /><div><p className="ds-ip-t">The Last Light</p><p className="ds-ip-s">12A · 2h 18m · Drama</p></div></div>
    <div className="c2-slots">{['Today', 'Sat 3', 'Sun 4', 'Mon 5', 'Tue 6'].map(d => <button key={d} className="c2-slot" role="radio" aria-checked={day === d} onClick={() => setDay(d)}>{d}</button>)}</div>
    <div className="c2-list">{cin.map(c => <div key={c.n} className="c2-cin"><p><b>{c.n}</b><span>{c.d}</span></p><div className="c2-slots">{c.times.map(([x, f]) => <button key={x} className="c2-slot" role="radio" aria-checked={t === c.n + x} onClick={() => setT(c.n + x)}>{x}{f && <i>{f}</i>}</button>)}</div></div>)}</div>
    <Cta disabled={!t}>{t ? 'Pick seats' : 'Pick a time'}</Cta>
  </Card>
}

/** A product with its options: colour swatches, size or storage chips, delivery date. */
export function ProductOptions({ art }: { art: string }) {
  const cols = [['Black', '#1D1D20'], ['Silver', '#D7D6D2'], ['Sage', '#9BAE9A'], ['Sand', '#D9C7A8']]
  const [c, setC] = useState('Black'); const [z, setZ] = useState('Standard')
  return <Card>
    <div className="c2-prod"><img src={art} alt="" /></div>
    <div className="c2-head"><p className="c2-t">Aria Noise-Cancelling Headphones</p><p className="ds-price"><b>{z === 'Standard' ? '32,000' : '36,500'} points</b><span>or {z === 'Standard' ? '£320' : '£365'}</span></p></div>
    <div className="ds-opt"><span className="ds-opt-l">Colour · {c}</span><div className="c2-sw">{cols.map(([n, h]) => <button key={n} aria-label={n} aria-pressed={c === n} onClick={() => setC(n)}><i style={{ background: h }} /></button>)}</div></div>
    <div className="ds-opt"><span className="ds-opt-l">Edition</span><div className="c2-slots">{['Standard', 'With travel case'].map(x => <button key={x} className="c2-slot" role="radio" aria-checked={z === x} onClick={() => setZ(x)}>{x}</button>)}</div></div>
    <p className="c2-fine"><Icon name="check" size={14} stroke={2.8} />In stock. Arrives Mon 5 Oct to SW1A 1AA</p>
    <Cta>Add to basket</Cta>
  </Card>
}

/** Where it goes, and whether it's a gift. The gift message is the only handwriting, on a sticky note. */
export function AddressGift() {
  const addr = [['Home', '12 Albion Street, London W2 2AS'], ['Work', '1 Canada Square, London E14 5AB']]
  const [a, setA] = useState(0); const [gift, setGift] = useState(true); const [msg, setMsg] = useState('Happy birthday, Dad. Ride safe!'); const [hide, setHide] = useState(true)
  return <Card>
    <Head title="Where should it go?" />
    <div className="c2-list">{addr.map(([k, v], i) => <button key={k} className="c2-prow" role="radio" aria-checked={a === i} onClick={() => setA(i)}><span className="c2-ph sm"><Icon name={i ? 'grid' : 'home'} size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">{k}</span><span className="ds-row-s">{v}</span></span><Tick on={a === i} /></button>)}
      <button className="c2-prow"><span className="c2-ph sm"><Icon name="plus" size={18} stroke={2.2} /></span><span className="c2-b"><span className="ds-row-t">Somewhere else</span><span className="ds-row-s">Send to a friend's address</span></span></button></div>
    <D.ToggleRow title="It's a gift" sub="Wrapped, with your note" on={gift} onChange={setGift} />
    {gift && <><div className="c2-sticky"><textarea value={msg} onChange={(e: any) => setMsg(e.target.value)} aria-label="Gift message" rows={2} /><img className="ds-clip" src={D.ART.clip} alt="" /></div>
      <D.ToggleRow title="Hide the price" sub="No prices on the packing slip" on={hide} onChange={setHide} /></>}
    <Cta>Continue</Cta>
  </Card>
}

/** A ride on its way: route on a small map, the driver, car and plate, arrival time, and ways to reach them. */
export function RideLive() {
  return <Card cls="c2-ride">
    <div className="c2-map-c sm">
      <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="360" height="150" fill="#EFECE6" /><path d="M-10 40 L370 30 M60 -10 L80 160 M200 -10 L180 160 M-10 110 L370 100" stroke="#FFFFFF" strokeWidth="8" fill="none" />
        <path d="M70 120 L78 70 L186 64 L196 34 L300 30" stroke="#17171A" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="1 9" />
        <circle cx="300" cy="30" r="7" fill="#FF6A1F" stroke="#fff" strokeWidth="3" /><rect x="62" y="110" width="18" height="18" rx="6" fill="#17171A" />
      </svg>
    </div>
    <div className="c2-eta"><b>4 min</b><span>away · arriving 18:42</span></div>
    <div className="c2-prow"><span className="c2-av-c">MA</span><span className="c2-b"><span className="ds-row-t">Marek</span><span className="ds-row-s"><Icon name="star" size={12} stroke={2.4} />4.9 · Toyota Prius · Grey</span></span><span className="c2-plate">LB71 KXP</span></div>
    <div className="c2-acts"><button className="ds-opill"><Icon name="chat" size={16} stroke={2} />Message</button><button className="ds-opill"><Icon name="phone" size={16} stroke={2} />Call</button><button className="ds-opill"><Icon name="share" size={16} stroke={2} />Share trip</button></div>
  </Card>
}

/** Check-in for everyone on the booking in one go. */
export function CheckIn({ people }: { people: { name: string; seat: string }[] }) {
  const [on, setOn] = useState(people.map(() => true))
  const n = on.filter(Boolean).length
  return <Card>
    <Head title="Check-in is open" sub="NW 471 · London to Lisbon · Fri 16 Oct, 09:55" />
    <div className="c2-list">{people.map((p, i) => <button key={p.name} className="c2-prow" role="checkbox" aria-checked={on[i]} onClick={() => setOn(on.map((x, k) => k === i ? !x : x))}><span className="c2-av-c">{p.name.split(' ').map(x => x[0]).join('')}</span><span className="c2-b"><span className="ds-row-t">{p.name}</span><span className="ds-row-s">Seat {p.seat} · passport added</span></span><Tick on={on[i]} /></button>)}</div>
    <Cta disabled={!n}>{`Check in ${n} ${n === 1 ? 'person' : 'people'}`}</Cta>
    <p className="c2-fine c2-center">Closes 1 hour before take-off. Boarding passes go to your Wallet.</p>
  </Card>
}

/** The day of travel as a timeline. Anything that changed is in orange, with what it was. */
export function TripTimeline() {
  const steps: { t: string; title: string; sub: string; done?: boolean; change?: string }[] = [
    { t: '07:58', title: 'Checked in', sub: '2 boarding passes in Wallet', done: true },
    { t: '08:40', title: 'Bag drop closes', sub: 'Terminal 5 · zone E' },
    { t: '09:10', title: 'Gate A12', sub: 'About 12 minutes from security', change: 'was A10' },
    { t: '09:45', title: 'Boarding', sub: 'Group 3' },
    { t: '10:15', title: 'Departs', sub: 'Lands 12:55 in Lisbon', change: '20 min late' },
  ]
  return <Card>
    <Head title="Today's flight" sub="NW 471 · London to Lisbon" />
    <ol className="c2-tl">{steps.map(s => <li key={s.title} className={(s.done ? 'done' : '') + (s.change ? ' chg' : '')}><span className="c2-tl-d">{s.done && <Icon name="check" size={11} stroke={3.4} />}</span><span className="c2-tl-t">{s.t}</span><span className="c2-b"><span className="ds-row-t">{s.title}{s.change && <em>{s.change}</em>}</span><span className="ds-row-s">{s.sub}</span></span></li>)}</ol>
  </Card>
}

/** Spread a big purchase: plan options with the monthly amount and the full cost, shown before agreeing. */
export function Instalments() {
  const plans = [[3, 403.33, 0], [6, 205.12, 20.72], [12, 105.43, 55.16]] as const
  const [p, setP] = useState(1)
  return <Card>
    <div className="c2-prow"><span className="c2-ph sm"><Icon name="bag" size={18} stroke={2} /></span><span className="c2-b"><span className="ds-row-t">Brightwell Electronics · laptop</span><span className="ds-row-s">28 Sep · £1,210.00</span></span></div>
    <Head title="Pay it monthly" />
    <div className="c2-list">{plans.map(([m, mo, fee], i) => <button key={m} className="c2-prow" role="radio" aria-checked={p === i} onClick={() => setP(i)}><span className="c2-b"><span className="ds-row-t">{m} months · £{mo.toFixed(2)} a month</span><span className="ds-row-s">{fee ? `£${fee.toFixed(2)} in fees · £${(1210 + fee).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in all` : 'No fee · £1,210.00 in all'}</span></span><Tick on={p === i} /></button>)}</div>
    <D.AssistantNote>The first payment is on your next statement, 11 Nov. You can pay it off early at any time.</D.AssistantNote>
    <Cta>Set up {plans[p][0]} monthly payments</Cta>
  </Card>
}

/** Every subscription on the card: what it costs, when it renews, and the ones not used lately. */
export function Subscriptions({ subs }: { subs: { art?: string; title: string; price: string; when: string; unused?: string }[] }) {
  const [gone, setGone] = useState<string[]>([])
  return <Card>
    <Head title="Your subscriptions" sub={`${subs.length - gone.length} on this card`} />
    <div className="c2-list">{subs.map(s => <div key={s.title} className={'c2-prow' + (gone.includes(s.title) ? ' c2-gone' : '')}>
      <span className="c2-ph sm">{s.art ? <img src={s.art} alt="" /> : <Icon name="refresh" size={18} stroke={2} />}</span>
      <span className="c2-b"><span className="ds-row-t">{s.title}</span><span className="ds-row-s">{gone.includes(s.title) ? 'Cancelled · no more charges' : <>{s.price} · {s.when}{s.unused && <em className="c2-warn">{s.unused}</em>}</>}</span></span>
      {gone.includes(s.title) ? <span className="ds-added-s"><Icon name="check" size={13} stroke={2.6} />Done</span> : <button className="ds-opill" onClick={() => setGone([...gone, s.title])}>Cancel</button>}
    </div>)}</div>
  </Card>
}
