import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore, useNav, hotelBooking, flightHomeBooking, State } from '../store'
import { HOTELS, FLIGHTS_HOME, EXTRAS, OFFERS, STAMP, IMG, fmt, MEMBER, Item, FLIGHT_HOME_FROM } from '../data'
import { Header, Composer, Ic, Spark, Dial } from '../ui'

type Parsed = { intent: string; text: string; steps: string[] }
export function parse(q: string, s: State): Parsed {
  const t = q.toLowerCase()
  const has = (...w: string[]) => w.some(x => t.includes(x))
  const bal = s.balance
  const needHome = !flightHomeBooking(s)
  if (has('cancel', 'refund', 'undo', 'return the', 'give back', 'wrong with my points', 'something’s wrong', "something's wrong")) {
    if (has('wrong')) return { intent: 'help', text: 'Sorry about that. Tell me what looks wrong, or I can connect you to the programme’s help team.', steps: [] }
    return { intent: 'cancel', text: s.bookings.some(b => b.status === 'booked') ? 'Here’s what you’ve booked or redeemed. Open one to cancel it and get your points back.' : 'You haven’t booked anything with me yet, so there’s nothing to cancel.', steps: ['Checked your bookings'] }
  }
  if (has('free with', 'included', 'lounge', 'insurance', 'benefit', 'come with', 'comes with', 'perk')) return { intent: 'benefits', text: 'Two things already come with your membership for this trip.', steps: ['Checked your Gold benefits', 'Checked your card cover'] }
  if (has('new york', 'nyc')) return { intent: 'ny', text: `Return flights to New York start at 30,000 points. You have ${fmt(bal)}, so you’re ${fmt(Math.max(0, 30000 - bal))} short. Here’s how to get there.`, steps: ['Checked your points', 'Checked New York fares'] }
  if (has('booked?', 'is my', 'have i booked', 'status of')) {
    const home = flightHomeBooking(s); const hotel = hotelBooking(s)
    return { intent: 'tripStatus', text: `Flight out: booked. Hotel: ${hotel ? 'booked' : 'not yet'}. Flight home: ${home ? 'booked' : `not yet, from ${fmt(FLIGHT_HOME_FROM)} points`}.`, steps: ['Checked your trip'] }
  }
  if (has('flight home', 'fly home', 'flight back', 'get home', 'home flight', 'return flight', 'back to london', 'flights home')) {
    if (!needHome) return { intent: 'flightHome', text: 'Your flight home is already booked. Here it is.', steps: ['Found your trip'] }
    const fits = FLIGHTS_HOME.filter(f => f.points <= bal).length
    return { intent: 'flightHome', text: fits === 2 ? 'Two direct flights home on Sun 16 May. Both fit your points.' : fits === 1 ? `Two direct flights home on Sun 16 May. The morning one fits your ${fmt(bal)} points; the evening one needs points + card.` : `Two direct flights home on Sun 16 May. You have ${fmt(bal)} points, so either one works with points + card.`, steps: ['Found your trip', 'Checked 2 airline partners', 'Checked your points'] }
  }
  if (has('dinner', 'restaurant', 'table', 'eat out', 'eat in')) return { intent: 'dinner', text: 'A table for two in Alfama on Saturday evening.', steps: ['Found your Lisbon dates', 'Checked restaurant partners'] }
  if (has('more points', 'earn', 'get points', 'collect')) return { intent: 'earn', text: `The quickest ways: add your programme’s offers, and pay by card where you get 2×. You’ve earned about 1,900 a month lately.`, steps: ['Checked your offers', 'Checked your earning'] }
  if (has('hotel', 'stay', 'room')) {
    if (hotelBooking(s)) return { intent: 'hotels', text: 'You’re already booked in Alfama for 14 to 16 May. Want to compare others anyway?', steps: ['Found your trip'] }
    const fits = HOTELS.filter(h => h.points <= bal).length
    const guard = needHome && HOTELS.every(h => bal - h.points < FLIGHT_HOME_FROM)
    const text = fits === 3 && !guard ? 'Three hotels for 14 to 16 May, all within your points. The first is a short walk from the river.'
      : fits === 3 ? `Three hotels for 14 to 16 May. Paying in points alone would leave too little for your flight home, so I’ll offer points + card at checkout.`
      : `Three hotels for 14 to 16 May. You have ${fmt(bal)} points, so ${fits === 0 ? 'each one works with points + card' : `${fits} fit${fits === 1 ? 's' : ''} fully and the rest work with points + card`}.`
    return { intent: 'hotels', text, steps: ['Found your Lisbon trip', 'Checked 3 hotel partners', 'Checked your points'] }
  }
  if (has('cinema', 'film', 'movie')) return { intent: 'cinema', text: bal < 2400 ? `Two cinema tickets cost 2,400 points. You have ${fmt(bal)}.` : `Two cinema tickets cost 2,400 points.${s.expiring > 0 ? ' That uses the points expiring on Sunday.' : ''}${needHome && bal - 2400 < FLIGHT_HOME_FROM ? ` It would leave ${fmt(bal - 2400)}, short of your flight home.` : ''}`, steps: ['Checked your points'] }
  if (has('expire', 'expiring', 'lose')) return { intent: 'expiry', text: s.expiring > 0 ? `${fmt(s.expiring)} points expire on Sun 9 May. Anything you book before then uses them first, so you won’t lose them.` : 'Nothing is due to expire in the next three months.', steps: ['Checked your points'] }
  if (has('platinum', 'tier', 'gold', 'status')) return { intent: 'tier', text: `You’re ${fmt(MEMBER.tierTarget - s.tierPts)} tier points from Platinum. You’ve earned about 1,900 a month lately, so you’ll get there in July.`, steps: ['Checked your tier points'] }
  if (has('offer', 'deal', 'discount')) return { intent: 'offers', text: 'Two offers from your programme. Add one and it applies when you pay with your card.', steps: ['Checked 24 offers in your programme'] }
  if (has('ride', 'taxi', 'airport', 'car')) return { intent: 'ride', text: 'A car to Heathrow for your 07:40 flight, with pick-up at 05:30.', steps: ['Found your flight time', 'Checked ride partners'] }
  if (has('balance', 'how many', 'points', 'afford')) return { intent: 'balance', text: `You have ${fmt(bal)} points.${s.expiring > 0 ? ` ${fmt(s.expiring)} of them expire on Sunday.` : ''}`, steps: ['Checked your points'] }
  return { intent: 'help', text: 'I’m not sure I’ve got that. Did you mean one of these?', steps: [] }
}

const HANDLED = new Set<number>()
const SUGGEST = ['Find a hotel for my Lisbon trip', 'Book my flight home', 'When do my points expire?', 'What comes free with Gold?', 'Any offers for me?']

export function Ask() {
  const { s, d } = useStore(); const nav = useNav()
  const route = s.stack[s.stack.length - 1]
  const [thinking, setThinking] = useState<string[] | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const send = (q: string) => {
    const p = parse(q, s)
    d({ type: 'chat', msgs: [{ id: 'm' + Date.now(), role: 'me', text: q }] })
    setThinking(p.steps.length ? p.steps : ['Thinking'])
    setTimeout(() => { setThinking(null); d({ type: 'chat', msgs: [{ id: 'a' + Date.now(), role: 'ai', text: p.text, intent: p.intent, steps: p.steps }] }) }, 900 + p.steps.length * 350)
  }
  useEffect(() => { const q = route.params?.q; if (q && !HANDLED.has(route.key)) { HANDLED.add(route.key); send(q) } }, [])
  useEffect(() => { scroller.current?.scrollTo({ top: 1e6, behavior: 'smooth' }) }, [s.chat.length, thinking])

  return <div className="screen">
    <div className="grabber" />
    <div className="pad" style={{ paddingBottom: 8 }}><Header title="Your assistant" right={<button className="rbtn" aria-label="Start a new conversation" onClick={() => d({ type: 'clearChat' })}><Ic n="refresh" s={18} /></button>} /></div>
    <div className="scroll" ref={scroller}>
      <div className="pad" style={{ gap: 16, paddingTop: 4 }}>
        {s.chat.length === 0 && !thinking && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 }}>
          <img src={IMG.appIcon} alt="" style={{ width: 52, height: 52, borderRadius: 14 }} />
          <h1 className="h1">What can I do for you, {MEMBER.first}?</h1>
          <p className="sub">I know your points, offers and trip. I’ll always ask before spending anything.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>{SUGGEST.map(x => <button key={x} className="chip" onClick={() => send(x)}>{x}</button>)}</div>
        </motion.div>}
        {s.chat.map(m => m.role === 'me'
          ? <motion.p key={m.id} className="bubble-me" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{m.text}</motion.p>
          : <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {m.steps && m.steps.length > 0 && <p className="step"><Ic n="tick" s={14} c="#FF6A1F" w={3} />{m.steps.join(' · ')}</p>}
            <p className="bubble-ai">{m.text}</p>
            <Result intent={m.intent!} send={send} />
          </motion.div>)}
        <AnimatePresence>{thinking && <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {thinking.map((x, i) => <motion.p key={x} className="step" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.35 }}>
            <motion.span className="thinking-dot" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />{x}…</motion.p>)}
        </motion.div>}</AnimatePresence>
      </div>
      <div className="bottom-space" />
    </div>
    <Composer placeholder={s.chat.length ? 'Reply or ask anything' : 'Ask or book anything'} onSend={send} />
  </div>
}

function Afford({ p }: { p: number }) {
  const { s } = useStore()
  if (p <= s.balance) return null
  return <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-deep)' }}>{fmt(p - s.balance)} short · points + card</p>
}
function BookBtn({ item, label = 'Book' }: { item: Item; label?: string }) {
  const nav = useNav(); const { s } = useStore()
  const booked = s.bookings.some(b => b.status === 'booked' && b.item.id === item.id)
  if (booked) return <span className="btn done sm"><Ic n="tick" s={14} c="#17704A" w={2.8} />Booked</span>
  return <button className="btn sm" onClick={() => nav.modal('confirm', { item })}>{label}</button>
}
export function HotelHero({ h }: { h: Item }) {
  const nav = useNav()
  return <div className="card" style={{ borderRadius: 26, padding: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <button style={{ position: 'relative' }} onClick={() => nav.push('hotel', { id: h.id })} aria-label={`See ${h.title}`}>
      <img src={h.img} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', objectPosition: h.pos || 'center', borderRadius: 18, display: 'block' }} />
      <span style={{ position: 'absolute', left: 10, top: 10, background: '#FFD966', fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 12, transform: 'rotate(-2deg)' }}>Best match</span>
    </button>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 6px 4px', gap: 10 }}>
      <button style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3 }} onClick={() => nav.push('hotel', { id: h.id })}>
        <p style={{ fontSize: 16, fontWeight: 700 }}>{h.title}</p>
        <p className="small">★ {h.rating} · {h.sub}</p>
        <p style={{ fontSize: 15, fontWeight: 700 }}>{fmt(h.points)} points <span style={{ fontWeight: 400, color: 'var(--soft)', fontSize: 13 }}>· or £{h.cash}</span></p>
        <Afford p={h.points} />
      </button>
      <BookBtn item={h} />
    </div>
    {h.tag && <p className="small" style={{ padding: '0 6px 4px', display: 'flex', gap: 6 }}><Spark s={14} />{h.tag}.</p>}
  </div>
}
export function ItemRow({ it, onOpen }: { it: Item; onOpen?: () => void }) {
  return <div className="card" style={{ borderRadius: 22, padding: '10px 12px 10px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <button onClick={onOpen} style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0, textAlign: 'left' }}>
      <img src={it.img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', objectPosition: it.pos || 'center', borderRadius: 14, flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{it.title}</p><p className="small">{it.rating ? `★ ${it.rating} · ` : ''}{it.sub}</p><p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{fmt(it.points)} points</p><Afford p={it.points} /></div>
    </button>
    <BookBtn item={it} />
  </div>
}

function Result({ intent, send }: { intent: string; send: (q: string) => void }) {
  const { s, d } = useStore(); const nav = useNav()
  switch (intent) {
    case 'hotels': return <>
      <div className="chips"><button className="chip on" aria-label="Edit filters" onClick={() => nav.push('hotels')}><Ic n="filter" s={15} c="#F4F4F3" /></button>{['Lisbon', '14–16 May', '2 guests', 'Under 9,000 points'].map(x => <button key={x} className="chip" onClick={() => nav.push('hotels')}>{x}</button>)}</div>
      {!flightHomeBooking(s) && !hotelBooking(s) && HOTELS.every(h => s.balance - h.points < FLIGHT_HOME_FROM) && <p className="note"><Spark s={18} />Heads up: paying all in points leaves too little for your flight home. I’ll offer points + card at checkout.</p>}
      <HotelHero h={HOTELS[0]} />
      {HOTELS.slice(1).map(h => <ItemRow key={h.id} it={h} onOpen={() => nav.push('hotel', { id: h.id })} />)}
    </>
    case 'flightHome': return <>{FLIGHTS_HOME.map(f => <ItemRow key={f.id} it={f} />)}</>
    case 'ride': return <ItemRow it={EXTRAS[0]} />
    case 'dinner': return <ItemRow it={EXTRAS[1]} />
    case 'cinema': return <ItemRow it={{ id: 'r-cinema', kind: 'voucher', title: 'Cinema for two', sub: 'Two standard tickets', points: 2400, cash: 24, img: IMG.cinema } as Item} onOpen={() => nav.push('reward', { id: 'r-cinema' })} />
    case 'expiry': return s.expiring > 0 ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="chip" onClick={() => nav.push('reward', { id: 'r-cinema' })}>Cinema tickets, 2,400</button><button className="chip" onClick={() => send('Find a hotel for my Lisbon trip')}>Use them on my hotel</button></div> : null
    case 'balance': return <div className="list">
      <div className="kv"><span>Available</span><span className="num">{fmt(s.balance)}</span></div>
      <div className="kv"><span>Expiring Sunday</span><span className="num">{fmt(s.expiring)}</span></div>
      <div className="kv"><span>Pending from card spend</span><span className="num">120</span></div>
    </div>
    case 'tier': return <button className="card" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('tier')}><Dial size={72} pct={s.tierPts / MEMBER.tierTarget} label="" aria="Gold tier" /><div style={{ flex: 1 }}><p style={{ fontWeight: 700 }}>{fmt(s.tierPts)} of 20,000 tier points</p><p className="small">See what Platinum adds</p></div><Ic n="chev" s={16} c="#8A8A92" /></button>
    case 'offers': return <>{OFFERS.filter(o => o.id !== 'o-dbl').slice(0, 2).map(o => <div key={o.id} className="card" style={{ borderRadius: 22, padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}><img src={STAMP[o.stamp]} alt="" style={{ width: 40, height: 48 }} /><div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 600 }}>{o.title}</p><p className="small">{o.sub}</p></div><button className={'btn sm' + (s.offers[o.id] ? ' done' : '')} onClick={() => d({ type: 'offer', id: o.id })}>{s.offers[o.id] ? 'Added' : 'Add'}</button></div>)}</>
    case 'benefits': return <div className="list">
      {[['lounge', 'sofa', 'Heathrow lounge', 'Fri 14 May · 1 of your 2 Gold visits this year'], ['insurance', 'shield', 'Travel insurance', 'Covered by your card for this trip']].map(([id, ic, t, sub]) => <div key={id} className="row"><div className="ic"><Ic n={ic} s={18} /></div><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{sub}</p></div>
        <button className={'btn xs' + (s.included[id] ? ' done' : '')} onClick={() => { if (!s.included[id]) { d({ type: 'include', id }); nav.toast(id === 'lounge' ? 'Lounge pass added to your trip.' : 'Policy saved to your trip.') } }}>{s.included[id] ? 'Added' : id === 'lounge' ? 'Add pass' : 'Save policy'}</button></div>)}
    </div>
    case 'earn': return <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="chip" onClick={() => nav.push('offers')}>See your offers</button><button className="chip" onClick={() => nav.push('tier')}>Your tier</button></div>
    case 'tripStatus': return <button className="btn light" onClick={() => nav.push('trip')}>Open your trip <Ic n="chev" s={14} w={2.4} /></button>
    case 'ny': return <button className="btn light" onClick={() => nav.push('goal')}>See your options <Ic n="chev" s={14} w={2.4} /></button>
    case 'cancel': return <div className="list">{s.bookings.filter(b => b.status === 'booked').map(b => <button key={b.id} className="row" onClick={() => nav.push('booking', { id: b.id })}><div style={{ flex: 1 }}><p className="t">{b.item.title}</p><p className="s">{b.item.dates || 'Redeemed today'}</p></div><Ic n="chev" s={16} c="#8A8A92" /></button>)}</div>
    default: return <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>{SUGGEST.map(x => <button key={x} className="chip" onClick={() => send(x)}>{x}</button>)}</div>
  }
}
