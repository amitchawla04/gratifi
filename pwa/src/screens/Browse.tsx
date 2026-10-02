import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useStore, useNav } from '../store'
import { HOTELS, REWARDS, OFFERS, STAMP, IMG, fmt, Item, FLIGHT_HOME_FROM } from '../data'
import { Screen, Header, Ic, Spark, PointsBadge, Toggle, RBtn, Sticky, FaceGlyph } from '../ui'
import { HotelHero, ItemRow } from './Ask'

function HomeGuard({ item }: { item?: Item }) {
  const { s } = useStore()
  if (s.bookings.some(x => x.status === 'booked' && x.item.id.startsWith('f-home'))) return null
  if (item) {
    const left = s.balance - item.points
    if (left >= FLIGHT_HOME_FROM) return null
    const mix = Math.max(0, s.balance - FLIGHT_HOME_FROM); const cash = Math.round((item.points - mix) * item.cash / item.points)
    return <p className="note"><Spark s={18} />{left >= 0 ? `Leaves ${fmt(left)} points` : `You’re ${fmt(-left)} short`}. {fmt(mix)} points + £{cash} keeps your flight home covered.</p>
  }
  if (!HOTELS.every(h => s.balance - h.points < FLIGHT_HOME_FROM)) return null
  return <p className="note"><Spark s={18} />Heads up: paying all in points leaves too little for your flight home. Checkout offers points + card.</p>
}

export function Rewards() {
  const { s } = useStore(); const nav = useNav()
  const route = s.stack[s.stack.length - 1]
  const [cat, setCat] = useState<string>(route.params?.cat || 'All')
  const [afford, setAfford] = useState(false)
  const cats = ['All', 'Hotels', 'Flights', 'Experiences', 'Food', 'Tickets', 'Shopping']
  const list = REWARDS.filter(r => (cat === 'All' || r.cat === cat) && (!afford || r.points <= s.balance))
  const open = (r: Item) => r.id === 'r-hotel' ? nav.push('hotels') : r.id === 'r-ny' ? nav.push('goal') : nav.push('reward', { id: r.id })
  return <Screen placeholder="Ask for a reward">
    <div className="pad">
      <Header title="Rewards" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PointsBadge n={s.balance} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>Only what I can afford<Toggle on={afford} onChange={() => setAfford(!afford)} label="Only show rewards I can afford" /></label>
      </div>
      <div className="chips">{cats.map(c => <button key={c} className={'chip' + (cat === c ? ' on' : '')} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
      {list.length === 0 ? <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <p style={{ fontWeight: 700 }}>Nothing here yet</p><p className="small">Ask me and I’ll look across every partner.</p>
        <button className="btn sm" onClick={() => nav.push('ask', { q: `Find ${cat.toLowerCase()} rewards` })}>Ask the assistant</button>
      </div> :
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        {list.map((r, i) => {
          const ok = r.points <= s.balance
          return <motion.button key={r.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileTap={{ scale: 0.97 }} onClick={() => open(r)}
            style={{ borderRadius: 20, padding: '8px 8px 12px', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
            <img src={r.img} alt="" style={{ width: '100%', height: 104, objectFit: 'cover', objectPosition: r.pos || 'center', borderRadius: 14 }} />
            <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{r.title}</p>
              <p className="small" style={{ fontSize: 12 }}>{r.sub}</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{r.id === 'r-hotel' ? 'From ' : ''}{fmt(r.points)} points</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: ok ? 'var(--good)' : 'var(--accent-deep)' }}>{ok ? 'You can get this' : `${fmt(r.points - s.balance)} more to go`}</p>
            </div>
          </motion.button>
        })}
      </div>}
    </div>
  </Screen>
}

export function Hotels() {
  const nav = useNav(); const [sort, setSort] = useState<'best' | 'low'>('best')
  const list = sort === 'best' ? HOTELS : [...HOTELS].sort((a, b) => a.points - b.points)
  return <Screen placeholder="Ask about hotels">
    <div className="pad" style={{ gap: 16 }}>
      <Header title="Hotels" />
      <p className="step"><Spark s={16} />Set up for your Lisbon trip</p>
      <HomeGuard />
      <div className="chips"><button className="chip on" aria-label="Edit filters"><Ic n="filter" s={15} c="#F4F4F3" /></button>{['Lisbon', '14–16 May', '2 guests', 'Any points'].map(x => <button key={x} className="chip">{x}</button>)}</div>
      <div className="seg" role="tablist" aria-label="Sort hotels">
        <button className={sort === 'best' ? 'on' : ''} onClick={() => setSort('best')}>Best match</button>
        <button className={sort === 'low' ? 'on' : ''} onClick={() => setSort('low')}>Fewest points</button>
      </div>
      {sort === 'best' && <HotelHero h={HOTELS[0]} />}
      {(sort === 'best' ? list.slice(1) : list).map(h => <ItemRow key={h.id} it={h} onOpen={() => nav.push('hotel', { id: h.id })} />)}
      <p className="small">Prices include taxes except Lisbon’s city tax (€4 a night, paid at the hotel). 2× points on hotels you pay for by card this month.</p>
    </div>
  </Screen>
}

export function Hotel() {
  const { s } = useStore(); const nav = useNav()
  const h = HOTELS.find(x => x.id === s.stack[s.stack.length - 1].params?.id) || HOTELS[0]
  const booked = s.bookings.some(b => b.status === 'booked' && b.item.id === h.id)
  return <div className="screen">
    <div className="scroll">
      <div style={{ position: 'relative', height: 280 }}>
        <img src={h.img} alt={h.title} style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: h.pos || 'center' }} />
        <div style={{ position: 'absolute', left: 20, right: 20, top: 16, display: 'flex', justifyContent: 'space-between' }}><RBtn n="back" label="Back" onClick={nav.pop} /><RBtn n="close" label="Close Gratifi" onClick={nav.close} /></div>
      </div>
      <div className="pad" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 className="h1">{h.title}</h1>
          <p className="sub">★ {h.rating} from {h.reviews}</p>
          <p className="sub" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Ic n="pin" s={16} c="#5C5C64" />{h.area}</p>
        </div>
        <div className="list">
          <div className="kv"><span>Dates</span><span>{h.dates}</span></div>
          <div className="kv"><span>Room</span><span>{h.room}</span></div>
          <div className="kv"><span>Cancellation</span><span>{h.cancel}</span></div>
          <div className="kv"><span>Cash price</span><span>£{h.cash}</span></div>
        </div>
        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontWeight: 700 }}>What’s included</p>
          {h.perks!.map(x => <p key={x} style={{ display: 'flex', gap: 10, fontSize: 15 }}><Ic n="tick" s={18} c="#FF6A1F" w={2.6} />{x}</p>)}
        </div>
        <HomeGuard item={h} />
        {h.id === 'h-alfama' && <p className="note"><Spark s={18} />Matches what you’ve told me: small hotels over big chains.</p>}
      </div>
      <div className="bottom-space" />
    </div>
    <div className="composer-fade" />
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 'var(--bot2)', zIndex: 6 }}>
      {booked ? <button className="btn big done" onClick={() => nav.push('trip')}><Ic n="tick" s={18} c="#17704A" w={2.8} />Booked · see your trip</button>
        : <button className="btn big" onClick={() => nav.modal('confirm', { item: h })}>Book for {fmt(h.points)} points</button>}
    </div>
  </div>
}

export function Reward() {
  const { s } = useStore(); const nav = useNav()
  const r = REWARDS.find(x => x.id === s.stack[s.stack.length - 1].params?.id) || REWARDS[0]
  const booked = s.bookings.find(b => b.status === 'booked' && b.item.id === r.id)
  const short = r.points > s.balance
  return <div className="screen">
    <div className="scroll">
      <div style={{ position: 'relative', height: 270 }}>
        <img src={r.img} alt={r.title} style={{ width: '100%', height: 270, objectFit: 'cover', objectPosition: r.pos || 'center' }} />
        <div style={{ position: 'absolute', left: 20, right: 20, top: 16, display: 'flex', justifyContent: 'space-between' }}><RBtn n="back" label="Back" onClick={nav.pop} /><RBtn n="close" label="Close Gratifi" onClick={nav.close} /></div>
      </div>
      <div className="pad" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 className="h1">{r.title}</h1>
          <p style={{ fontSize: 17, fontWeight: 700 }}>{fmt(r.points)} points <span style={{ fontWeight: 400, color: 'var(--soft)', fontSize: 15 }}>· cash price £{r.cash}</span></p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{r.detail?.map(x => <p key={x} style={{ display: 'flex', gap: 10, fontSize: 15 }}><Ic n="tick" s={18} c="#FF6A1F" w={2.6} />{x}</p>)}</div>
        {r.id === 'r-cinema' && s.expiring > 0 && <Sticky title="Good timing" clip={false} rot={-1}><p style={{ fontSize: 15 }}>This uses the {fmt(Math.min(s.expiring, r.points))} points that expire on Sunday.</p></Sticky>}
        {r.id === 'r-jacket' && <p className="note"><Spark s={18} />The jacket you saved is £48 today, so this covers it.</p>}
      </div>
      <div className="bottom-space" />
    </div>
    <div className="composer-fade" />
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 'var(--bot2)', zIndex: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {booked ? <button className="btn big done" onClick={() => nav.push('voucher', { id: booked.id })}><Ic n="tick" s={18} c="#17704A" w={2.8} />Redeemed · show my code</button>
        : short ? <button className="btn big light" onClick={() => nav.push('goal')}>{fmt(r.points - s.balance)} more points needed</button>
        : <><button className="btn big" onClick={() => nav.modal('confirm', { item: r })}>Redeem {fmt(r.points)} points</button><p className="small" style={{ textAlign: 'center' }}>You’ll have {fmt(s.balance - r.points)} left.</p></>}
    </div>
  </div>
}

const NY: Item = { id: 'r-ny', kind: 'flight', title: 'Flight to New York', sub: 'Return, economy', points: 30000, cash: 420, img: IMG.flight, room: '1 adult, return', cancel: 'Free changes up to 7 days before', dateOptions: ['12–19 Jun', '1–8 Jul', '10–17 Sep'] }

export function Goal() {
  const { s, d } = useStore(); const nav = useNav()
  const target = 30000; const pct = Math.min(1, s.balance / target); const set = s.goals.includes('ny')
  const way = (ic: string, t: string, sub: string, cta: React.ReactNode) => <div className="row"><div className="ic"><Ic n={ic} s={18} /></div><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{sub}</p></div>{cta}</div>
  return <Screen placeholder="Ask about this flight">
    <div className="pad" style={{ gap: 16 }}>
      <Header title="Flight to New York" />
      <img src={IMG.flight} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 22 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="sec"><p style={{ fontSize: 22, fontWeight: 800 }}>30,000 points</p><p style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-deep)' }}>{fmt(Math.max(0, target - s.balance))} to go</p></div>
        <div className="progress"><motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.9 }} /></div>
        <p className="small">You have {fmt(s.balance)}. Cash price £420, return.</p>
      </div>
      <div className="card" style={{ padding: '16px 16px 4px' }}>
        <p style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, marginBottom: 4 }}><Spark s={18} />Ways to get there</p>
        {way('target', 'Make it a goal', 'I’ll track it and tell you when you’re there.', <button className={'btn sm' + (set ? ' done' : ' light')} onClick={() => { d({ type: 'goal', id: 'ny' }); nav.toast('Goal set. I’ll tell you when you’re there.') }}>{set ? 'Set' : 'Set goal'}</button>)}
        {way('card', 'Points and card', `${fmt(s.balance)} points plus £${Math.round((target - s.balance) * 0.014)} on your card.`, <button className="btn sm light" onClick={() => nav.modal('confirm', { item: NY })}>See</button>)}
        {way('plane', 'Try Boston instead', 'Return flights from 11,900 points.', <button className="btn sm light" onClick={() => nav.push('ask', { q: 'Flights to Boston' })}>See</button>)}
        {way('cal', 'Wait a little', `You earn about 1,900 points a month, so you’ll have enough by ${s.balance >= target ? 'now' : 'next February'}.`, <span />)}
      </div>
    </div>
  </Screen>
}

export function Offers() {
  const { s, d } = useStore(); const nav = useNav(); const [tab, setTab] = useState(0)
  const list = OFFERS.filter(o => tab === 2 ? s.offers[o.id] : true)
  return <Screen placeholder="Ask about offers">
    <div className="pad" style={{ gap: 14 }}>
      <Header title="Your offers" />
      <div className="seg">{['For you', 'All 24', 'Added'].map((t, i) => <button key={t} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>)}</div>
      <p className="step"><Spark s={16} />Picked from your programme’s 24 offers</p>
      {list.length === 0 && <p className="sub">Nothing added yet. Tap Add on any offer and it applies when you pay with your card.</p>}
      {list.map(o => {
        const on = !!s.offers[o.id]
        return <div key={o.id} className="card" style={{ borderRadius: 22, padding: '12px 14px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}><img src={STAMP[o.stamp]} alt="" style={{ width: 48, height: 58 }} />{o.isNew && <span className="badge" style={{ fontSize: 10, top: -6, right: -8 }}>NEW</span>}</div>
            <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{o.title}</p><p className="small">{o.sub}</p></div>
            <button className={'btn sm' + (on ? ' done' : '')} aria-pressed={on} onClick={() => { d({ type: 'offer', id: o.id }); if (!on) nav.toast('Added. It applies when you pay with your card.') }}>{on ? <><Ic n="tick" s={14} c="#17704A" w={2.8} />Added</> : 'Add'}</button>
          </div>
          <p className="small" style={{ display: 'flex', gap: 6, paddingLeft: 60 }}><Spark s={13} />{o.whyNeedsCard && !s.consent.card ? 'Suggested for Gold members.' : o.why}</p>
        </div>
      })}
    </div>
  </Screen>
}
