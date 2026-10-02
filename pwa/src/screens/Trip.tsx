import React, { useState } from 'react'
import { useStore, useNav, hotelBooking, flightHomeBooking } from '../store'
import { IMG, EXTRAS, FLIGHT_HOME_FROM, fmt, STAMP } from '../data'
import { Screen, Header, Ic, Spark, Sticky, Sec } from '../ui'

const Status = ({ ok, text }: { ok: boolean; text?: string }) => <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: ok ? 'var(--good)' : 'var(--accent-deep)', flexShrink: 0 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: ok ? 'var(--good)' : 'var(--accent)' }} />{text || (ok ? 'Booked' : 'To book')}</span>

export function Trip() {
  const { s, d } = useStore(); const nav = useNav()
  const hotel = hotelBooking(s); const home = flightHomeBooking(s)
  const extraBooked = (id: string) => s.bookings.find(b => b.status === 'booked' && b.item.id === id)
  return <Screen placeholder="Ask about your trip">
    <div className="pad" style={{ gap: 16 }}>
      <Header title="Your Lisbon trip" />
      <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 150 }}>
        <img src={IMG.lisbon} alt="Lisbon" style={{ width: '100%', height: 150, objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }} />
        <span style={{ position: 'absolute', left: 12, bottom: 12, height: 32, padding: '0 12px', borderRadius: 16, background: 'rgba(20,20,22,0.78)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center' }}>Fri 14 to Sun 16 May · 2 nights</span>
      </div>
      <div className="list">
        <div className="row"><div className="ic"><Ic n="plane" s={18} /></div><div style={{ flex: 1 }}><p className="t">London to Lisbon</p><p className="s">Fri 14 May · 07:40 · 9,800 points</p></div><Status ok /></div>
        {hotel ? <button className="row" onClick={() => nav.push('booking', { id: hotel.id })}><div className="ic"><Ic n="bed" s={18} /></div><div style={{ flex: 1 }}><p className="t">{hotel.item.title}</p><p className="s">2 nights · {fmt(hotel.points)} points{hotel.cash ? ` + £${hotel.cash}` : ''}</p></div><Status ok /></button>
          : <button className="row" onClick={() => nav.push('hotels')}><div className="ic"><Ic n="bed" s={18} /></div><div style={{ flex: 1 }}><p className="t">Hotel</p><p className="s">14 to 16 May · from 7,600 points</p></div><span className="btn xs">Find hotels</span></button>}
        {home ? <button className="row" onClick={() => nav.push('booking', { id: home.id })}><div className="ic"><Ic n="plane" s={18} /></div><div style={{ flex: 1 }}><p className="t">Lisbon to London</p><p className="s">{home.item.sub}</p></div><Status ok /></button>
          : <button className="row" onClick={() => nav.push('ask', { q: 'Book my flight home' })}><div className="ic"><Ic n="plane" s={18} /></div><div style={{ flex: 1 }}><p className="t">Lisbon to London</p><p className="s">Sun 16 May · from {fmt(FLIGHT_HOME_FROM)} points</p></div><span className="btn xs">Find flights</span></button>}
      </div>

      <Sec title="Already included" />
      <div className="list">
        {[['lounge', 'sofa', 'Heathrow lounge', 'Fri 14 May · 1 of your 2 Gold visits this year'], ['insurance', 'shield', 'Travel insurance', 'Covered by your card for this trip']].map(([id, ic, t, sub]) =>
          <div key={id} className="row"><div className="ic"><Ic n={ic} s={18} /></div><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{sub}</p></div>
            <button className={'btn xs' + (s.included[id] ? ' done' : '')} onClick={() => { if (!s.included[id]) { d({ type: 'include', id }); nav.toast(id === 'lounge' ? 'Lounge pass added to your trip.' : 'Policy saved to your trip.') } }}>{s.included[id] ? <><Ic n="tick" s={12} c="#17704A" w={2.8} />Added</> : id === 'lounge' ? 'Add pass' : 'Save policy'}</button></div>)}
      </div>

      <div className="sec"><h2 className="h2" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Spark s={18} />Ideas for your trip</h2></div>
      {EXTRAS.map(x => {
        const b = extraBooked(x.id)
        return <div key={x.id} className="card" style={{ borderRadius: 22, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--sticky-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n={x.kind === 'ride' ? 'car' : 'fork'} s={18} /></div>
            <div style={{ flex: 1 }}><p className="t" style={{ fontSize: 15, fontWeight: 600 }}>{x.title}</p><p className="small">{x.sub}</p></div>
            <div style={{ textAlign: 'right' }}><p style={{ fontSize: 14, fontWeight: 700 }}>{fmt(x.points)} points</p>{x.points > s.balance && <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-deep)' }}>or points + card</p>}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingLeft: 52 }}>
            {b ? <span className="btn sm done"><Ic n="tick" s={14} c="#17704A" w={2.8} />Booked</span> : s.dismissed[x.id] ? <span className="small">Hidden. I won’t suggest this again.</span> : <>
              <button className="btn sm" onClick={() => nav.modal('confirm', { item: x })}>Book</button>
              <button className="btn sm light" onClick={() => d({ type: 'dismiss', id: x.id })}>Not now</button></>}
          </div>
        </div>
      })}
    </div>
  </Screen>
}

export function ActivityScreen() {
  const { s } = useStore(); const nav = useNav(); const [tab, setTab] = useState(0)
  const list = s.activity.filter(a => tab === 0 || (tab === 1 ? a.points > 0 : a.points < 0))
  const groups: Record<string, typeof list> = {}
  list.forEach(a => { (groups[a.date] = groups[a.date] || []).push(a) })
  const earned = s.activity.filter(a => a.points > 0 && !a.pending).reduce((x, a) => x + a.points, 0)
  const spent = s.activity.filter(a => a.points < 0).reduce((x, a) => x - a.points, 0)
  return <Screen placeholder="Ask about your points">
    <div className="pad" style={{ gap: 12 }}>
      <Header title="Activity" />
      <div className="seg">{['All', 'Earned', 'Spent'].map((t, i) => <button key={t} className={tab === i ? 'on' : ''} onClick={() => setTab(i)}>{t}</button>)}</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="card" style={{ flex: 1, padding: '14px 16px', borderRadius: 20 }}><p className="small" style={{ fontWeight: 600 }}>Balance</p><p className="num" style={{ fontSize: 22, fontWeight: 800 }}>{fmt(s.balance)}</p></div>
        <div className="card" style={{ flex: 1, padding: '14px 16px', borderRadius: 20 }}><p className="small" style={{ fontWeight: 600 }}>May so far</p><p className="num" style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}><span className="pos">+{fmt(earned)}</span> earned</p><p className="num" style={{ fontSize: 14, fontWeight: 700 }}>{fmt(spent)} spent</p></div>
      </div>
      {Object.entries(groups).map(([date, items]) => <React.Fragment key={date}>
        <p className="small" style={{ fontWeight: 600, paddingTop: 4 }}>{date}</p>
        <div className="list">{items.map(a => <button key={a.id} className="row" onClick={() => nav.push('item', { id: a.id })}>
          <div className="ic">{a.by === 'assistant' ? <Spark s={18} /> : <Ic n={a.points > 0 ? 'plus' : 'arrow'} s={18} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}><p className="t">{a.title}</p><p className="s">{a.by === 'assistant' ? 'By your assistant' : a.sub}{a.pending ? ' · pending, lands on 1 June' : ''}</p></div>
          <p className={'r num' + (a.points > 0 ? ' pos' : '')} style={a.pending ? { opacity: 0.6 } : undefined}>{a.points > 0 ? '+' : '−'}{fmt(Math.abs(a.points))}</p>
        </button>)}</div>
      </React.Fragment>)}
    </div>
  </Screen>
}

function Step({ date, t, last }: { date: string; t: string; last?: boolean }) {
  return <div style={{ position: 'relative', display: 'flex', gap: 14, paddingBottom: last ? 0 : 16 }}>
    {!last && <span style={{ position: 'absolute', left: 7, top: 20, bottom: -2, width: 2, background: '#E4E2DE' }} />}
    <span style={{ width: 16, height: 16, borderRadius: 8, background: last ? 'var(--accent)' : 'var(--ink)', flexShrink: 0, marginTop: 2, boxShadow: '0 0 0 4px #fff' }} />
    <div><p className="small" style={{ fontWeight: 600 }}>{date}</p><p style={{ fontSize: 15, lineHeight: 1.4 }}>{t}</p></div>
  </div>
}
export function ActivityItem() {
  const { s } = useStore(); const nav = useNav()
  const a = s.activity.find(x => x.id === s.stack[s.stack.length - 1].params?.id)
  if (!a) return <Screen><div className="pad"><Header title="Details" /><p className="sub">This item is no longer here.</p></div></Screen>
  if (a.bookingId) { const b = s.bookings.find(x => x.id === a.bookingId); if (b) return <BookingDetail id={b.id} /> }
  return <Screen placeholder="Ask about your points">
    <div className="pad">
      <Header title="Details" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 0' }}>
        <p className="num" style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1.5, color: a.points > 0 ? 'var(--good)' : 'var(--ink)' }}>{a.points > 0 ? '+' : '−'}{fmt(Math.abs(a.points))}</p>
        <p style={{ fontSize: 18, fontWeight: 700 }}>{a.title}</p>
        <p className="small" style={{ fontSize: 14 }}>{a.pending ? 'Pending · lands on 1 June' : a.date}</p>
      </div>
      {a.kind === 'claim' ? <>
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontWeight: 700 }}>What happened</p>
          <div><Step date="Wed 28 Apr" t="You bought train tickets from a partner. They should have earned double points." /><Step date="Wed 5 May" t="I spotted the missing points and raised a claim with the partner." /><Step date="Thu 6 May" t="640 points added to your balance." last /></div>
        </div>
        <p className="note"><Spark s={18} />Done by your assistant. Nothing needed from you.</p>
      </> : <div className="list"><div className="kv"><span>Source</span><span>{a.sub}</span></div><div className="kv"><span>Status</span><span>{a.pending ? 'Pending' : 'Added'}</span></div></div>}
      <button className="btn ghost" style={{ alignSelf: 'center', color: 'var(--ink-2)', textDecoration: 'underline', textUnderlineOffset: 3 }} onClick={() => nav.push('ask', { q: 'Something’s wrong with my points' })}>Something not right? Tell us</button>
    </div>
  </Screen>
}

export function BookingDetail({ id: idProp }: { id?: string }) {
  const { s, d } = useStore(); const nav = useNav()
  const id = idProp || s.stack[s.stack.length - 1].params?.id
  const b = s.bookings.find(x => x.id === id)
  const [ask, setAsk] = useState(false)
  if (!b) return null
  const cancelled = b.status === 'cancelled'
  return <Screen placeholder="Ask about this booking">
    <div className="pad">
      <Header title={b.item.kind === 'voucher' ? 'Your reward' : 'Your booking'} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <img src={b.item.img} alt="" style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', objectPosition: b.item.pos || 'center' }} />
        <div><p style={{ fontSize: 18, fontWeight: 800 }}>{b.item.title}</p><p className="small" style={{ fontSize: 14 }}>{b.item.dates || b.item.sub}</p></div>
      </div>
      <div className="list">
        <div className="kv"><span>Status</span><span style={{ color: cancelled ? 'var(--danger)' : 'var(--good)' }}>{cancelled ? 'Cancelled, points returned' : 'Booked'}</span></div>
        <div className="kv"><span>Paid</span><span className="num">{fmt(b.points)} points{b.cash ? ` + £${b.cash}` : ''}</span></div>
        <div className="kv"><span>Reference</span><span>{b.ref}</span></div>
        {b.item.cancel && <div className="kv"><span>Cancellation</span><span>{b.item.cancel}</span></div>}
      </div>
      {b.item.kind === 'voucher' && !cancelled && <button className="btn big" onClick={() => nav.push('voucher', { id: b.id })}>Show my code</button>}
      {(b.item.cancel || b.item.kind === 'voucher') && !cancelled && (!ask ? <button className="btn big light" onClick={() => setAsk(true)}>{b.item.kind === 'voucher' ? 'Cancel and get points back' : 'Cancel booking'}</button> :
        <div className="warn"><p style={{ fontSize: 14 }}>Cancel {b.item.title}? You’ll get {fmt(b.points)} points back{b.cash ? ` and £${b.cash} refunded to your card` : ''}.</p>
          <div style={{ display: 'flex', gap: 8 }}><button className="btn sm danger" onClick={() => { d({ type: 'cancel', id: b.id }); nav.toast('Cancelled. Your points are back.'); setAsk(false) }}>Yes, cancel</button><button className="btn sm light" onClick={() => setAsk(false)}>Keep it</button></div></div>)}
    </div>
  </Screen>
}

export function Alerts() {
  const { s, d } = useStore(); const nav = useNav()
  const hotel = hotelBooking(s); const home = flightHomeBooking(s)
  const cinema = s.bookings.some(b => b.status === 'booked' && b.item.id === 'r-cinema')
  const done = (t: string, sub: string, go?: () => void) => <button className="row" onClick={go}><div className="ic" style={{ background: 'var(--ink)' }}><Ic n="tick" s={16} c="#F4F4F3" w={2.6} /></div><div style={{ flex: 1 }}><p className="t" style={{ lineHeight: 1.3 }}>{t}</p><p className="s">{sub}</p></div><Ic n="chev" s={16} c="#8A8A92" /></button>
  return <Screen>
    <div className="pad" style={{ gap: 16 }}>
      <Header title="Alerts" />
      <Sec title="For you" />
      {s.expiring > 0 && !cinema && !s.dismissed.expiry && <Sticky title="Expires Sunday"><p style={{ fontSize: 15 }}>{fmt(s.expiring)} points run out this weekend. They cover two cinema tickets.</p><div style={{ display: 'flex', gap: 8 }}><button className="btn" onClick={() => nav.push('reward', { id: 'r-cinema' })}>See tickets</button><button className="btn light" style={{ boxShadow: 'none' }} onClick={() => d({ type: 'dismiss', id: 'expiry' })}>Not now</button></div></Sticky>}
      {!home && <button className="card" style={{ borderRadius: 22, padding: 14, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('ask', { q: 'Book my flight home' })}><img src={IMG.flight} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 14 }} /><div style={{ flex: 1 }}><p className="t" style={{ fontSize: 15, fontWeight: 600 }}>Your flight home isn’t booked</p><p className="small">Sun 16 May · from {fmt(FLIGHT_HOME_FROM)} points</p></div><Ic n="chev" s={16} c="#8A8A92" /></button>}
      <button className="card" style={{ borderRadius: 22, padding: 14, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('reward', { id: 'r-jacket' })}><img src={IMG.jacket} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 14 }} /><div style={{ flex: 1 }}><p className="t" style={{ fontSize: 15, fontWeight: 600 }}>The jacket you saved is now £48</p><p className="small">Was £68 · {s.balance >= 5000 ? 'a 5,000-point gift card covers it' : `a gift card is ${fmt(5000 - s.balance)} points away`}</p></div><Ic n="chev" s={16} c="#8A8A92" /></button>
      <Sec title="Done for you" />
      <div className="list">
        {done('Claimed 640 missing points', 'Yesterday', () => nav.push('item', { id: 'a2' }))}
        {hotel && done('Added your hotel to the Lisbon trip', 'Today', () => nav.push('trip'))}
        <div className="row"><div className="ic" style={{ background: 'var(--ink)' }}><Ic n="tick" s={16} c="#F4F4F3" w={2.6} /></div><div style={{ flex: 1 }}><p className="t" style={{ lineHeight: 1.3 }}>Moved your reminders to the morning</p><p className="s">Mon 3 May · as you asked</p></div></div>
      </div>
      <button className="link" style={{ alignSelf: 'center' }} onClick={() => nav.push('profile')}>Notification settings</button>
    </div>
  </Screen>
}
