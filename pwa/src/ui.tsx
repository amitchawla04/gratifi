import React, { useEffect, useRef, useState } from 'react'
import { motion, animate } from 'motion/react'
import { IMG, fmt } from './data'
import { useNav, useStore } from './store'

// ---------- icons ----------
const P: Record<string, React.ReactNode> = {
  back: <path d="M15 6l-6 6 6 6" />, close: <path d="M6 6l12 12M18 6L6 18" />, chev: <path d="M9 6l6 6-6 6" />, down: <path d="M6 9l6 6 6-6" />,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  up: <path d="M12 19V5M6 11l6-6 6 6" />, tick: <path d="M4.5 12.5l5 5L19.5 7" />, plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M3 12h13M12 7l5 5-5 5" />, plane: <path d="M10.5 13.5L4 11l1.5-1.5 7 1 3.8-3.8a1.8 1.8 0 0 1 2.5 2.5L15 13l1 7-1.5 1.5-2.5-6.5-3 3v2.5L7.5 22 6 18l-4-1.5L3.5 15H6z" />,
  filter: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  cal: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></>,
  chat: <path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H9z" />,
  brain: <path d="M12 5.5a3 3 0 0 0-5.6 1.4A3 3 0 0 0 5 12a3 3 0 0 0 2 4.8A3 3 0 0 0 12 18.5zM12 5.5a3 3 0 0 1 5.6 1.4A3 3 0 0 1 19 12a3 3 0 0 1-2 4.8 3 3 0 0 1-5 1.7" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" /></>,
  shield: <path d="M12 3.5l7 3v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9v-5z" />, info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>,
  car: <><path d="M5 16V12l2-5h10l2 5v4M4 16h16v2.5H4z" /><circle cx="8" cy="16" r="1.2" /><circle cx="16" cy="16" r="1.2" /></>,
  fork: <path d="M7 3.5v7a2 2 0 0 0 4 0v-7M9 10.5V21M16 3.5c-1.8 1-2.5 3-2.5 5.5v3h2.5V21" />,
  wallet: <><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M3.5 10h17M15.5 14.5h2" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></>,
  trash: <path d="M5 7h14M9.5 7V5h5v2M7 7l1 12.5h8L17 7" />, stop: <rect x="7" y="7" width="10" height="10" rx="2" />,
  home: <path d="M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z" />, card: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  sofa: <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v6H3zM6 18v2M18 18v2" />,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  bed: <path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7.5 11.5a1.5 1.5 0 1 0 0-.01" />,
  refresh: <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />,
  keyboard: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M3 9h18M12 9v11M12 9c-2-3.5-5-3-4.2-.7M12 9c2-3.5 5-3 4.2-.7" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
}
export function Ic({ n, s = 20, c = '#141416', w = 2 }: { n: string; s?: number; c?: string; w?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">{P[n]}</svg>
}
export function Spark({ s = 20 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="#FF6A1F" style={{ flexShrink: 0 }} aria-hidden="true"><path d="M11 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /><path d="M18.5 14.5c.3 2.2 1.1 3 3.3 3.3-2.2.3-3 1.1-3.3 3.3-.3-2.2-1.1-3-3.3-3.3 2.2-.3 3-1.1 3.3-3.3z" /></svg>
}
export function FaceGlyph({ s = 22, c = '#F4F4F3' }: { s?: number; c?: string }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0" /></svg>
}

// ---------- building blocks ----------
export function RBtn({ n, label, onClick, dot }: { n: string; label: string; onClick: () => void; dot?: boolean }) {
  return <button className="rbtn" aria-label={label} onClick={onClick}><Ic n={n} s={n === 'close' ? 18 : 20} w={2.2} />{dot && <span className="dot" />}</button>
}
export function Header({ title, right, back = true }: { title?: string; right?: React.ReactNode; back?: boolean }) {
  const nav = useNav()
  return <div className="hdr">
    {back ? <RBtn n="back" label="Back" onClick={nav.pop} /> : <div style={{ width: 44 }} />}
    <p className="hdr-title" tabIndex={-1} data-autofocus>{title}</p>
    {right ?? <RBtn n="close" label="Close Gratifi" onClick={nav.close} />}
  </div>
}
export function Screen({ children, composer = true, placeholder, bottom = true }: { children: React.ReactNode; composer?: boolean; placeholder?: string; bottom?: boolean }) {
  return <div className="screen">
    <div className="grabber" />
    <div className="scroll">{children}{bottom && <div className={composer ? 'bottom-space' : 'bottom-space sm'} />}</div>
    {composer && <Composer placeholder={placeholder} />}
  </div>
}
export function Composer({ placeholder = 'Ask or book anything', onSend, autoFocus }: { placeholder?: string; onSend?: (t: string) => void; autoFocus?: boolean }) {
  const [t, setT] = useState(''); const nav = useNav()
  const go = () => { const q = t.trim(); if (onSend) { if (q) onSend(q); setT('') } else nav.push('ask', { q }) }
  return <>
    <div className="composer-fade" />
    <form className="composer" onSubmit={e => { e.preventDefault(); go() }}>
      <Spark />
      <input aria-label={placeholder} placeholder={placeholder} value={t} onChange={e => setT(e.target.value)} autoFocus={autoFocus} enterKeyHint="send" onFocus={() => { if (!onSend && !t) { /* keep focus on screen; tap goes to ask on send */ } }} />
      <button type="button" className="rbtn" style={{ boxShadow: 'none', width: 40, height: 40, background: 'transparent' }} aria-label="Speak instead" onClick={() => nav.push('voice')}><Ic n="mic" /></button>
      <button type="submit" className="send" aria-label={onSend ? 'Send' : 'Open assistant'} disabled={!!onSend && !t.trim()}><Ic n="up" s={18} c="#F4F4F3" w={2.4} /></button>
    </form>
  </>
}
export function Sec({ title, link, onLink }: { title: string; link?: string; onLink?: () => void }) {
  return <div className="sec"><h2 className="h2">{title}</h2>{link && <button className="link" onClick={onLink}>{link}</button>}</div>
}
export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} className={'toggle' + (on ? ' on' : '')} onClick={onChange}><span /></button>
}
export function SetRow({ t, s, on, onChange, locked, last }: { t: string; s: string; on?: boolean; onChange?: () => void; locked?: boolean; last?: boolean }) {
  return <div className="row" style={last ? { borderBottom: 0 } : undefined}>
    <div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{s}</p></div>
    {locked ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--soft)' }}><Ic n="lock" s={15} c="#5C5C64" />Always on</span> : <Toggle on={!!on} onChange={onChange!} label={t} />}
  </div>
}
export function Dial({ size = 104, pct = 0.82, label = 'GOLD', aria }: { size?: number; pct?: number; label?: string; aria?: string }) {
  const n = 28, r = size / 2, inner = size * 0.58
  const [p, setP] = useState(0)
  useEffect(() => { const c = animate(0, pct, { duration: 1.1, ease: [0.2, 0.7, 0.2, 1], onUpdate: setP }); return () => c.stop() }, [pct])
  const ticks = Array.from({ length: n }, (_, i) => {
    const a = (-225 + (270 * i) / (n - 1)) * Math.PI / 180
    const r1 = r - size * 0.03, r2 = r - size * (i % 7 === 0 ? 0.15 : 0.11)
    const on = i / (n - 1) <= p
    return <line key={i} x1={r + r1 * Math.cos(a)} y1={r + r1 * Math.sin(a)} x2={r + r2 * Math.cos(a)} y2={r + r2 * Math.sin(a)} stroke={on ? '#FF6A1F' : '#D6D4CF'} strokeWidth={size > 150 ? 3.4 : size < 80 ? 1.8 : 2.6} strokeLinecap="round" />
  })
  return <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }} role="img" aria-label={`${aria || (label.trim() ? label + ' tier' : 'Gold tier')}, ${Math.round(pct * 100)}% of the way to Platinum`}>
    <svg width={size} height={size}>{ticks}</svg>
    <div style={{ position: 'absolute', left: (size - inner) / 2, top: (size - inner) / 2, width: inner, height: inner, borderRadius: inner / 2, background: '#141416', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F4F4F3', fontSize: size > 150 ? 15 : 11, fontWeight: 700, letterSpacing: 1.5 }}>{label || <svg width={inner * 0.5} height={inner * 0.5} viewBox="0 0 24 24" fill="#FF6A1F" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" /></svg>}</div>
  </div>
}
export function Count({ value, className, style }: { value: number; className?: string; style?: React.CSSProperties }) {
  const [v, setV] = useState(value); const prev = useRef(value)
  useEffect(() => { const c = animate(prev.current, value, { duration: 0.9, ease: [0.2, 0.7, 0.2, 1], onUpdate: x => setV(Math.round(x)) }); prev.current = value; return () => c.stop() }, [value])
  return <span className={'num ' + (className || '')} style={style}>{fmt(v)}</span>
}
export function Sticky({ title, children, clip = true, rot = -1.2 }: { title: string; children: React.ReactNode; clip?: boolean; rot?: number }) {
  return <motion.div className="sticky-wrap" initial={{ opacity: 0, y: 10, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
    <div className="sticky" style={{ transform: `rotate(${rot}deg)` }}>
      <p className="hand" style={{ fontSize: 26 }}>{title}</p>
      {children}
    </div>
    {clip && <img src={IMG.clip} alt="" className="clip" style={{ position: 'absolute', right: 44, top: -10, width: 16, height: 38, transform: 'rotate(8deg)' }} />}
  </motion.div>
}
export function PointsBadge({ n }: { n: number }) {
  return <span style={{ height: 32, padding: '0 12px', borderRadius: 16, background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, boxShadow: 'inset 0 0 0 1px #E4E2DE' }}><span style={{ width: 8, height: 8, borderRadius: 4, background: '#FF6A1F' }} /><Count value={n} /> points</span>
}
export function WhyLink({ reason }: { reason: string }) {
  const nav = useNav()
  return <button className="link" style={{ fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3, color: '#3E3E45', alignSelf: 'flex-start' }} onClick={() => nav.modal('why', { reason })}>Why am I seeing this?</button>
}
export function Stamp({ big = false, date = 'FRI 7 MAY', text = 'BOOKED' }: { big?: boolean; date?: string; text?: string }) {
  const s = big ? 150 : 96
  return <motion.div initial={{ scale: 1.8, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.1 }}
    style={{ width: s, height: s, borderRadius: s / 2, border: '4px solid #D2480A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#D2480A', gap: 2, boxShadow: 'inset 0 0 0 5px #fff, inset 0 0 0 7px #D2480A', background: '#FFF6F0' }} aria-hidden="true">
    <span style={{ fontSize: big ? 13 : 10, fontWeight: 800, letterSpacing: 2 }}>GRATIFI</span>
    <span style={{ fontSize: big ? 24 : 16, fontWeight: 800, letterSpacing: 1 }}>{text}</span>
    <span style={{ fontSize: big ? 12 : 9, fontWeight: 700, letterSpacing: 1.5 }}>{date}</span>
  </motion.div>
}
export function Toast() {
  const { s, d } = useStore()
  if (!s.toast) return null
  return <motion.div key={s.toast.id} className="toast" role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
    <span style={{ flex: 1 }}>{s.toast.text}</span>
    {s.toast.undo && <button style={{ minHeight: 44, padding: '0 10px' }} onClick={() => { const act = s.toast!.undo; d(act); d({ type: 'toast', text: act.type === 'undoBooking' ? 'Undone. Your points are back.' : 'Restored.' }) }}>Undo</button>}
  </motion.div>
}
