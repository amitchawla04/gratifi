import React from 'react'
import { motion } from 'motion/react'
import { useStore, useNav, hotelBooking, flightHomeBooking } from '../store'
import { IMG, STAMP, CATEGORIES, OFFERS, REWARDS, HOTELS, FLIGHT_HOME_FROM, fmt, MEMBER } from '../data'
import { Screen, RBtn, Dial, Count, Sticky, Sec, Ic, Spark, WhyLink } from '../ui'

export function Home() {
  const { s, d } = useStore(); const nav = useNav()
  const hotel = hotelBooking(s); const home = flightHomeBooking(s)
  const cinema = s.bookings.find(b => b.status === 'booked' && b.item.id === 'r-cinema')
  const toGo = MEMBER.tierTarget - s.tierPts
  const unread = !s.readAlerts
  const alertCount = (s.expiring > 0 && !cinema && !s.dismissed.expiry ? 1 : 0) + (!home ? 1 : 0) + 1
  const showExpiry = s.expiring > 0 && !s.dismissed.expiry && !cinema
  const showHome = !showExpiry && hotel && !home && !s.dismissed.home

  return <Screen>
    <div className="pad">
      <div className="hdr">
        <img src={IMG.wordmark} alt="gratifi" style={{ width: 104, height: 46, objectFit: 'contain', objectPosition: 'left center' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="rbtn" aria-label="You and settings" onClick={() => nav.push('profile')} style={{ fontSize: 16, fontWeight: 700 }}>S</button>
          <RBtn n="bell" label={unread ? `Alerts, ${alertCount} new` : 'Alerts'} dot={unread} onClick={() => { d({ type: 'readAlerts' }); nav.push('alerts') }} />
          <RBtn n="close" label="Close Gratifi" onClick={nav.close} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1 className="h1">Good morning, {MEMBER.first}</h1>
          <button className="sub" style={{ textAlign: 'left' }} onClick={() => nav.push('tier')}>{fmt(toGo)} tier points to Platinum <Ic n="chev" s={14} c="#5C5C64" w={2.4} /></button>
        </div>
      </div>

      <div className="card" style={{ borderRadius: 28, padding: '16px 18px 16px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <button onClick={() => nav.push('tier')} aria-label="See your tier"><Dial pct={s.tierPts / MEMBER.tierTarget} /></button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--soft)' }}>Your points</p>
          <Count value={s.balance} style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }} />
          {s.expiring > 0 ? <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-deep)' }}>{fmt(s.expiring)} expire Sunday</p> : <p style={{ fontSize: 12, color: 'var(--soft)' }}>None expiring soon</p>}
          <button className="btn" style={{ alignSelf: 'flex-start', marginTop: 8, height: 36 }} onClick={() => nav.push('rewards')}>Use points</button>
        </div>
      </div>

      {showExpiry && <Sticky title="Expires Sunday">
        <p style={{ fontSize: 15, lineHeight: 1.35 }}>{fmt(s.expiring)} points run out this weekend. They cover two cinema tickets.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => nav.push('reward', { id: 'r-cinema' })}>See tickets</button>
          <button className="btn light" style={{ boxShadow: 'none' }} onClick={() => { d({ type: 'dismiss', id: 'expiry' }); nav.toast('Okay. I won’t bring it up again.') }}>Not now</button>
        </div>
        <WhyLink reason="expiry" />
      </Sticky>}

      {showHome && <Sticky title="Flight home?">
        <p style={{ fontSize: 15, lineHeight: 1.35 }}>Your hotel is booked, but your flight back on Sun 16 May isn’t. Fares from {fmt(FLIGHT_HOME_FROM)} points{s.balance < FLIGHT_HOME_FROM ? `, or ${fmt(s.balance)} points plus card` : ''}.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => nav.push('ask', { q: 'Book my flight home' })}>See flights</button>
          <button className="btn light" style={{ boxShadow: 'none' }} onClick={() => d({ type: 'dismiss', id: 'home' })}>Not now</button>
        </div>
      </Sticky>}

      <Sec title="Spend your points" link="See all" onLink={() => nav.push('rewards')} />
      <div className="stamps">
        {CATEGORIES.map((c, i) => <button key={c.id} className="stamp" onClick={() => c.id === 'Hotels' ? nav.push('hotels') : nav.push('rewards', { cat: c.id })}>
          <img src={STAMP[c.stamp]} alt="" style={{ transform: `rotate(${[-3, 2, -2, 3, -3, 2, -2][i]}deg)` }} />{c.id}
          {c.badge && <span className="badge">{c.badge}</span>}
        </button>)}
      </div>
      <p className="small" style={{ marginTop: -10 }}><b style={{ color: 'var(--accent-deep)' }}>2×</b> points on hotels you pay for by card this month.</p>

      <Sec title="Your offers" link="All 24" onLink={() => nav.push('offers')} />
      <div className="hscroll" style={{ paddingTop: 0 }}>
        {OFFERS.slice(0, 3).map(o => {
          const on = !!s.offers[o.id]
          return <div key={o.id} className="card" style={{ width: 272, flexShrink: 0, borderRadius: 22, padding: '12px 14px 12px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <img src={STAMP[o.stamp]} alt="" style={{ width: 38, height: 46, flexShrink: 0 }} />
            <button style={{ flex: 1, textAlign: 'left', minWidth: 0 }} onClick={() => nav.push('offers')}><p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>{o.title}</p><p className="small" style={{ fontSize: 12 }}>{o.sub}</p></button>
            <button className={'btn xs' + (on ? ' done' : '')} aria-pressed={on} onClick={() => { d({ type: 'offer', id: o.id }); if (!on) nav.toast('Offer added. It applies automatically when you pay with your card.') }}>{on ? <><Ic n="tick" s={12} c="#17704A" w={2.8} />Added</> : 'Add'}</button>
          </div>
        })}
      </div>

      <Sec title="Coming up" />
      <button className="card" style={{ padding: 12, display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('trip')}>
        <img src={IMG.flight} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <p style={{ fontSize: 16, fontWeight: 700 }}>Lisbon trip</p>
          <p className="small" style={{ fontSize: 14 }}>Fri 14 to Sun 16 May</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: hotel && home ? 'var(--good)' : 'var(--accent-deep)', marginTop: 2 }}>
            {hotel && home ? 'All booked' : !hotel ? 'Flight booked · hotel to sort' : 'Flight home to sort'}
          </p>
        </div>
        <Ic n="chev" s={18} c="#8A8A92" w={2.2} />
      </button>

      <Sec title="Picked for you" link="See all" onLink={() => nav.push('rewards')} />
      <div className="hscroll">
        {(!hotel ? [{ img: IMG.lisbon, pos: 'center 70%', t: 'Stay in Lisbon', s: 'Two nights, to go with your flight', p: HOTELS[2].points, from: true, go: () => nav.push('hotels') }] : !home ? [{ img: IMG.flight, t: 'Your flight home', s: 'Sun 16 May, direct', p: FLIGHT_HOME_FROM, go: () => nav.push('ask', { q: 'Book my flight home' }) }] : [])
          .concat([{ img: IMG.jacket, t: 'Fashion gift card', s: 'For the jacket you saved', p: 5000, go: () => nav.push('reward', { id: 'r-jacket' }) }, { img: IMG.pool, t: 'Spa day for two', s: 'Partner spas', p: 9500, go: () => nav.push('reward', { id: 'r-spa' }) }] as any)
          .map((c: any, i: number) => <motion.button key={c.t} className="polaroid" style={{ rotate: i % 2 ? 1.5 : -1.5 }} whileTap={{ scale: 0.97 }} onClick={c.go}>
            <img src={c.img} alt="" style={{ objectPosition: c.pos || 'center' }} />
            <p className="hand" style={{ fontSize: 22, marginTop: 4 }}>{c.t}</p>
            <p className="small" style={{ fontSize: 12 }}>{c.s}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{c.from ? 'From ' : ''}{fmt(c.p)} points</span>
              <span className="btn xs" style={c.p > s.balance ? { background: '#E8E6E2', color: '#5C5C64' } : undefined}>{c.p > s.balance ? `${fmt(c.p - s.balance)} more` : 'See it'}</span>
            </div>
          </motion.button>)}
      </div>

      <Sec title="Recent activity" link="See all" onLink={() => nav.push('activity')} />
      <div className="list">
        {s.activity.slice(0, 3).map(a => <button key={a.id} className="row" onClick={() => nav.push('item', { id: a.id })}>
          <div className="ic">{a.by === 'assistant' ? <Spark s={18} /> : <Ic n={a.points > 0 ? 'plus' : 'arrow'} s={18} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}><p className="t">{a.title}</p><p className="s">{a.date}{a.by === 'assistant' ? ' · by your assistant' : ''}{a.pending ? ' · pending' : ''}</p></div>
          <p className={'r num' + (a.points > 0 ? ' pos' : '')}>{a.points > 0 ? '+' : '−'}{fmt(Math.abs(a.points))}</p>
        </button>)}
      </div>
    </div>
  </Screen>
}
