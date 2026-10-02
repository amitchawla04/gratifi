import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore, useNav, flightHomeBooking } from '../store'
import { fmt, FLIGHT_HOME_FROM, MEMBER, Item, IMG } from '../data'
import { Ic, Spark, FaceGlyph, Stamp, RBtn } from '../ui'

export function ConfirmSheet({ item }: { item: Item }) {
  const { s, d } = useStore(); const nav = useNav()
  const needsHome = !flightHomeBooking(s) && !item.id.startsWith('f-home') && item.id !== 'r-ny-none'
  const keep = needsHome ? FLIGHT_HOME_FROM : 0
  const rate = item.cash / item.points
  const allShort = item.points > s.balance
  const guard = needsHome && s.balance - item.points < FLIGHT_HOME_FROM
  const canMixBase = item.kind !== 'voucher'
  const mixPoints = Math.max(0, Math.min(item.points - 1, s.balance - keep))
  const mixCash = Math.round((item.points - mixPoints) * rate)
  const canMix = canMixBase && mixCash > 0 && (guard || allShort)
  const [mode, setMode] = useState<'points' | 'mix'>((guard || allShort) && canMix ? 'mix' : 'points')
  const [date, setDate] = useState<string | null>(null)
  const [face, setFace] = useState<'idle' | 'scan' | 'ok'>('idle')
  const timers = React.useRef<any[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const cost = mode === 'mix' ? mixPoints : item.points
  const cash = mode === 'mix' ? mixCash : 0
  const after = s.balance - cost
  const expUse = Math.min(s.expiring, cost)
  const blocked = cost > s.balance || (!!item.dateOptions && !date)
  const payLabel = cash ? (cost ? `${fmt(cost)} points + £${cash}` : `£${cash} on card`) : `${fmt(cost)} points`

  const confirm = () => {
    setFace('scan')
    timers.current.push(setTimeout(() => setFace('ok'), 1100))
    timers.current.push(setTimeout(() => {
      d({ type: 'book', item: date ? { ...item, dates: date } : item, points: cost, cash })
      try { navigator.vibrate?.(30) } catch {}
      d({ type: 'modal', name: null })
      d({ type: 'push', name: item.kind === 'voucher' ? 'voucher' : 'booked', params: { last: true } })
    }, 1700))
  }
  const cancelScan = () => { timers.current.forEach(clearTimeout); timers.current = []; setFace('idle') }
  return <>
    <motion.div className="modal-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => face === 'idle' && nav.modal(null)} />
    <motion.div className="modal" role="dialog" aria-modal="true" aria-label={`Confirm ${item.title}`} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
      <div className="grabber" style={{ background: '#D6D4CF' }} />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <img src={item.img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', objectPosition: item.pos || 'center', borderRadius: 16 }} />
        <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>{item.title}</p><p className="small" style={{ fontSize: 14 }}>{item.dates || item.sub}{item.nights ? ` · ${item.nights} nights` : ''}</p></div>
      </div>
      {guard && !allShort && <div className="warn"><p style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: 1.4 }}><Spark s={18} /><span>Paying all in points leaves {fmt(s.balance - item.points)}, not enough for your flight home on Sun 16 May (from {fmt(FLIGHT_HOME_FROM)}).{canMix ? (mixPoints === 0 ? ' Paying by card keeps them.' : ' Points + card keeps enough.') : ' Book the flight first, or go ahead anyway.'}</span></p></div>}
      {allShort && <div className="warn"><p style={{ display: 'flex', gap: 8, fontSize: 14, lineHeight: 1.4 }}><Spark s={18} /><span>{!canMix ? `You’re ${fmt(item.points - s.balance)} points short. Try something smaller, or set it as a goal.` : mixPoints === 0 ? `This costs ${fmt(item.points)} points. ` + '' : `You’re ${fmt(item.points - s.balance)} points short. `}{!canMix ? '' : mixPoints === 0 ? `I’ll put it all on your card and keep your ${fmt(s.balance)} points for your flight home.` : needsHome ? `Use ${fmt(mixPoints)} points and pay the rest by card, keeping ${fmt(FLIGHT_HOME_FROM)} for your flight home.` : 'Pay the rest by card instead.'}</span></p></div>}
      {canMix && <div className="seg" role="radiogroup" aria-label="How to pay">
        <button role="radio" aria-checked={mode === 'points'} className={mode === 'points' ? 'on' : ''} disabled={allShort} style={allShort ? { opacity: 0.45 } : undefined} onClick={() => setMode('points')}>All points</button>
        <button role="radio" aria-checked={mode === 'mix'} className={mode === 'mix' ? 'on' : ''} onClick={() => setMode('mix')}>{mixPoints === 0 ? `Card, £${mixCash}` : `Points + £${mixCash}`}{needsHome ? ' · safe' : ''}</button>
      </div>}
      {item.dateOptions && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><p style={{ fontSize: 15, fontWeight: 700 }}>Pick your dates</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{item.dateOptions.map(o => <button key={o} className={'chip' + (date === o ? ' on' : '')} aria-pressed={date === o} onClick={() => setDate(o)}>{o}</button>)}</div></div>}
      <div>
        {item.room && <div className="kv"><span>{item.kind === 'hotel' ? 'Room' : 'Details'}</span><span>{item.room}</span></div>}
        <div className="kv"><span>Points</span><span className="num">{fmt(cost)}</span></div>
        {cash > 0 && <div className="kv"><span>On your card</span><span className="num">£{cash} · •••• 4821</span></div>}
        <div className="kv"><span>Points left after</span><span className="num">{cost > s.balance ? '—' : fmt(after)}</span></div>
        {item.cancel && <div className="kv"><span>Cancellation</span><span>{item.cancel}</span></div>}
        {item.kind === 'hotel' && <div className="kv"><span>Paid at the hotel</span><span>City tax, €4 a night</span></div>}
      </div>
      {expUse > 0 && <p className="note"><Spark s={18} />Your {fmt(expUse)} points expiring Sunday go first.</p>}
      <div style={{ position: 'sticky', bottom: 'calc(-28px - var(--sab))', background: '#fff', margin: '0 -20px', padding: '10px 20px calc(4px + var(--sab))', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 -10px 20px rgba(255,255,255,0.9)' }}>
      <button className="btn big" disabled={blocked || face !== 'idle'} onClick={confirm} style={blocked ? { opacity: 0.4 } : undefined}><FaceGlyph />{item.dateOptions && !date ? 'Pick your dates first' : `Confirm ${payLabel}`}</button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <button className="btn ghost" onClick={() => nav.modal(null)}>Not now</button>
        <button className="btn ghost" onClick={() => nav.toast('Full terms open in your programme’s app.')}>Terms</button>
      </div>
      </div>
    </motion.div>
    <AnimatePresence>{face !== 'idle' && <motion.div className="faceid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="faceid-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} role="status" aria-live="assertive">
        {face === 'scan' ? <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}><FaceGlyph s={64} c="#141416" /></motion.div>
          : <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} style={{ width: 64, height: 64, borderRadius: 32, background: '#17704A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="tick" s={36} c="#fff" w={3} /></motion.div>}
        <span>{face === 'scan' ? 'Face ID' : 'Confirmed'}</span>
        {face === 'scan' && <button className="btn ghost" style={{ height: 44, color: '#3E3E45' }} onClick={cancelScan}>Cancel</button>}
      </motion.div>
    </motion.div>}</AnimatePresence>
  </>
}

export function Booked() {
  const { s, d } = useStore(); const nav = useNav()
  const b = [...s.bookings].reverse().find(x => x.item.kind !== 'voucher' && x.status === 'booked')!
  const last = s.stack[s.stack.length - 1].params?.last
  const [undo, setUndo] = useState(!!last)
  useEffect(() => { if (!last) return; const t = setTimeout(() => setUndo(false), 10000); return () => clearTimeout(t) }, [])
  if (!b) return null
  const it = b.item
  return <div className="screen">
    <div className="grabber" />
    <div className="scroll"><div className="pad" style={{ gap: 20 }}>
      <div className="hdr"><div style={{ width: 44 }} /><div /><RBtn n="close" label="Close" onClick={() => nav.reset('home')} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <Stamp big text={it.kind === 'hotel' ? 'BOOKED' : it.kind === 'flight' ? 'BOOKED' : 'BOOKED'} />
        <h1 className="h1">You’re booked.</h1>
        {undo && <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#17171A', color: '#F4F4F3', borderRadius: 16, padding: '6px 6px 6px 14px', fontSize: 14 }}><span style={{ flex: 1 }}>Changed your mind?</span><button style={{ minHeight: 40, padding: '0 14px', color: '#FF8A4C', fontWeight: 700 }} onClick={() => { d({ type: 'undoBooking', id: b.id }); nav.toast('Undone. Your points are back.') }}>Undo</button></div>}
        <div style={{ textAlign: 'center' }}><p style={{ fontSize: 16, fontWeight: 700 }}>{it.title}</p><p className="small" style={{ fontSize: 14 }}>{it.dates || it.sub}{it.nights ? ` · ${it.nights} nights` : ''}</p></div>
      </div>
      <div className="list">
        <div className="kv"><span>Paid</span><span className="num">{fmt(b.points)} points{b.cash ? ` + £${b.cash}` : ''}</span></div>
        <div className="kv"><span>Points left</span><span className="num">{fmt(s.balance)}</span></div>
        {it.cancel && <div className="kv"><span>Free cancellation</span><span>{it.cancel.replace('Free ', '')}</span></div>}
        <div className="kv"><span>Reference</span><span>{b.ref}</span></div>
      </div>
      <p className="note"><Spark s={18} />{it.id === 'r-ny' ? `Booked for ${it.dates}. Confirmation sent to ${MEMBER.email}.` : `Added to your Lisbon trip. Confirmation sent to ${MEMBER.email}.`}</p>
    </div><div className="bottom-space" /><div style={{ height: 50 }} /></div>
    <div className="composer-fade" style={{ height: 'calc(190px + var(--sab))' }} />
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 'var(--bot2)', zIndex: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn light" style={{ flex: 1, height: 44 }} onClick={() => nav.toast('Added to Apple Wallet.')}><Ic n="wallet" s={18} />Wallet</button>
        <button className="btn light" style={{ flex: 1, height: 44 }} onClick={() => nav.toast('Added to your calendar.')}><Ic n="cal" s={18} />Calendar</button>
      </div>
      <button className="btn big" onClick={() => nav.reset(it.id === 'r-ny' ? 'home' : 'trip')}>{it.id === 'r-ny' ? 'Back to home' : 'View your trip'}</button>
    </div>
  </div>
}

export function Voucher() {
  const { s, d } = useStore(); const nav = useNav()
  const id = s.stack[s.stack.length - 1].params?.id
  const b = id ? s.bookings.find(x => x.id === id)! : [...s.bookings].reverse().find(x => x.item.kind === 'voucher' && x.status === 'booked')!
  const last = s.stack[s.stack.length - 1].params?.last
  const [undo, setUndo] = useState(!!last)
  useEffect(() => { if (!last) return; const t = setTimeout(() => setUndo(false), 10000); return () => clearTimeout(t) }, [])
  if (!b) return null
  const code = b.ref.replace('GR-', 'GR ') + ' 4403'
  const cells: React.ReactNode[] = []
  let seed = b.ref.split('').reduce((a, c) => a + c.charCodeAt(0), 7)
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const f = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
    let on
    if (f) { const fx = x > 13 ? x - 14 : x, fy = y > 13 ? y - 14 : y; on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4) } else on = rnd() < 0.45
    if (on) cells.push(<rect key={x + '-' + y} x={x} y={y} width={1} height={1} />)
  }
  return <div className="screen">
    <div className="grabber" />
    <div className="scroll"><div className="pad" style={{ gap: 18 }}>
      <div className="hdr"><div style={{ width: 44 }} /><div /><RBtn n="close" label="Close" onClick={() => nav.reset('home')} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Stamp big text="REDEEMED" />
        <h1 className="h1" style={{ textAlign: 'center' }}>{b.item.id === 'r-cinema' ? 'Your tickets are ready.' : 'Your gift is ready.'}</h1>
        {undo && <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#17171A', color: '#F4F4F3', borderRadius: 16, padding: '6px 6px 6px 14px', fontSize: 14 }}><span style={{ flex: 1 }}>Changed your mind?</span><button style={{ minHeight: 40, padding: '0 14px', color: '#FF8A4C', fontWeight: 700 }} onClick={() => { d({ type: 'undoBooking', id: b.id }); nav.toast('Undone. Your points are back.') }}>Undo</button></div>}
        <p className="sub" style={{ textAlign: 'center' }}>{b.expUsed ? `${fmt(b.expUsed)} points saved from expiring. ` : ''}You have {fmt(s.balance)} left.</p>
      </div>
      <div className="card" style={{ borderRadius: 26, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between' }}><p style={{ fontWeight: 700 }}>{b.item.title}</p><p className="small" style={{ fontWeight: 600 }}>{b.item.id === 'r-cinema' ? '2 tickets' : `£${b.item.cash}`}</p></div>
        <div style={{ alignSelf: 'stretch', borderTop: '2px dashed #E4E2DE' }} />
        <svg width="168" height="168" viewBox="0 0 21 21" fill="#141416" shapeRendering="crispEdges" role="img" aria-label="Your code as a QR code">{cells}</svg>
        <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2 }} className="num">{code}</p>
        <p className="small">{b.item.detail?.[2] || 'Use within 12 months'} · show at the till or enter online</p>
      </div>
    </div><div className="bottom-space" /></div>
    <div className="composer-fade" />
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 'var(--bot2)', zIndex: 6, display: 'flex', gap: 10 }}>
      <button className="btn big" style={{ flex: 1 }} onClick={() => nav.toast('Added to Apple Wallet.')}><Ic n="wallet" s={18} c="#F4F4F3" />Add to Wallet</button>
      <button className="btn big light" style={{ flex: 0.6 }} onClick={() => nav.reset('home')}>Done</button>
    </div>
  </div>
}
