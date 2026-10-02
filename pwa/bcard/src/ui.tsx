import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Card, IMG, gbp } from './data'
import { useNav, useStore } from './store'

// ---------- icons ----------
const P: Record<string, React.ReactNode> = {
  back: <path d="M15 6l-6 6 6 6" />, close: <path d="M6 6l12 12M18 6L6 18" />, chev: <path d="M9 6l6 6-6 6" />, down: <path d="M6 9l6 6 6-6" />,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  up: <path d="M12 19V5M6 11l6-6 6 6" />, tick: <path d="M4.5 12.5l5 5L19.5 7" />, plus: <path d="M12 5v14M5 12h14" />,
  plane: <path d="M10.5 13.5L4 11l1.5-1.5 7 1 3.8-3.8a1.8 1.8 0 0 1 2.5 2.5L15 13l1 7-1.5 1.5-2.5-6.5-3 3v2.5L7.5 22 6 18l-4-1.5L3.5 15H6z" />,
  cal: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></>,
  users: <><circle cx="9" cy="9" r="3.3" /><path d="M3 19.5c.9-3 3.2-4.6 6-4.6s5.1 1.6 6 4.6M15.5 5.9a3.2 3.2 0 0 1 0 6.2M17.5 14.9c1.8.6 3 2.1 3.5 4.6" /></>,
  chat: <path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H9z" />,
  brain: <path d="M12 5.5a3 3 0 0 0-5.6 1.4A3 3 0 0 0 5 12a3 3 0 0 0 2 4.8A3 3 0 0 0 12 18.5zM12 5.5a3 3 0 0 1 5.6 1.4A3 3 0 0 1 19 12a3 3 0 0 1-2 4.8 3 3 0 0 1-5 1.7" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z" /></>,
  shield: <path d="M12 3.5l7 3v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9v-5z" />, info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>,
  wallet: <><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M3.5 10h17M15.5 14.5h2" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></>,
  home: <path d="M4 10.5L12 4l8 6.5V20h-5.5v-6h-5v6H4z" />, card: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M3 10h18" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  sofa: <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v6H3zM6 18v2M18 18v2" />,
  refresh: <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />,
  gift: <><rect x="4" y="9" width="16" height="11" rx="2" /><path d="M3 9h18M12 9v11M12 9c-2-3.5-5-3-4.2-.7M12 9c2-3.5 5-3 4.2-.7" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" />,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></>,
  doc: <><path d="M6.5 3.5h7l4 4v13h-11z" /><path d="M13.5 3.5v4h4M9 12h6M9 16h6" /></>,
  bank: <path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  swap: <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />,
  split: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M9 5v14M15 5v14" /></>,
  help: <><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6M12 17h.01" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  flag: <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  pound: <path d="M16.5 6.5A3.5 3.5 0 0 0 10 8v4.5c0 3-1 5-3 6.5h11M7 12.5h7" />,
  sparkle: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />,
  apple: <path d="M15.5 3.5c-1 .1-2.2.8-2.8 1.6-.6.7-1 1.8-.9 2.8 1.1.1 2.2-.6 2.8-1.4.6-.8 1-1.8.9-3zM12.4 8.4c-.9 0-1.8-.6-2.8-.6-1.9 0-3.8 1.6-3.8 4.6 0 3.3 2.3 7.6 4.1 7.6.9 0 1.3-.6 2.5-.6s1.5.6 2.5.6c1.4 0 2.8-2.6 3.4-4.2-1.7-.7-2.4-2.2-2.4-3.6 0-1.3.7-2.5 1.8-3.1-.8-1-2-1.5-3-1.5-1 0-1.7.8-2.3.8z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>,
  trash: <path d="M5 7h14M9.5 7V5h5v2M7 7l1 12.5h8L17 7" />,
  arrow: <path d="M3 12h13M12 7l5 5-5 5" />,
  bag: <><path d="M5 8h14l-1.2 12.5H6.2z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  ticket: <path d="M3.5 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4V18h17v-2a2 2 0 0 1 0-4 2 2 0 0 1 0-4V6h-17zM14 6v12" />,
}
export function Ic({ n, s = 20, c = '#0E1A2B', w = 2 }: { n: string; s?: number; c?: string; w?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">{P[n]}</svg>
}
export function Spark({ s = 20 }: { s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="#FF6A1F" style={{ flexShrink: 0 }} aria-hidden="true"><path d="M11 2.5c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /><path d="M18.5 14.5c.3 2.2 1.1 3 3.3 3.3-2.2.3-3 1.1-3.3 3.3-.3-2.2-1.1-3-3.3-3.3 2.2-.3 3-1.1 3.3-3.3z" /></svg>
}
function FaceGlyph({ s = 54, c = '#0E1A2B' }: { s?: number; c?: string }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0" /></svg>
}

// ---------- structure ----------
export function RBtn({ n, label, onClick, dot }: { n: string; label: string; onClick: () => void; dot?: boolean }) {
  return <button className="rbtn" aria-label={label} onClick={onClick}><Ic n={n} s={n === 'close' ? 18 : 20} w={2.2} />{dot && <span className="dot" />}</button>
}
export function Header({ title, right, onBack }: { title?: string; right?: React.ReactNode; onBack?: () => void }) {
  const nav = useNav()
  return <div className="hdr">
    <RBtn n="back" label="Back" onClick={onBack || nav.pop} />
    <p className="hdr-title" tabIndex={-1} data-autofocus>{title}</p>
    {right ?? <div style={{ width: 44 }} />}
  </div>
}
/** A pushed screen: header, scrolling body, and either the Gratifi ask bar or a fixed call to action. */
export function Page({ title, children, right, cta, ask = true, onBack }: { title?: string; children: React.ReactNode; right?: React.ReactNode; cta?: React.ReactNode; ask?: boolean; onBack?: () => void }) {
  return <div className="screen">
    <div className="scroll">
      <div className="pad"><Header title={title} right={right} onBack={onBack} />{children}</div>
      <div className={cta ? 'space-cta' : ask ? 'space-ask' : 'space-sm'} />
    </div>
    {cta ? <><div className="cta-fade" /><div className="cta">{cta}</div></> : ask ? <AskBar mode="alone" /> : null}
  </div>
}
export function AskBar({ mode, placeholder }: { mode: 'over-tabs' | 'alone'; placeholder?: string }) {
  const nav = useNav()
  return <div className={'askbar ' + mode}>
    <Spark />
    <button className="go" onClick={() => nav.push('ask')} aria-label="Ask Gratifi">{placeholder || 'Ask Gratifi anything'}</button>
    <button className="mic" aria-label="Speak to Gratifi" onClick={() => nav.push('ask', { voice: true })}><Ic n="mic" /></button>
  </div>
}
export function Sec({ title, link, onLink, tag }: { title: string; link?: string; onLink?: () => void; tag?: React.ReactNode }) {
  return <div className="sec"><div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{tag}<h2 className="h2">{title}</h2></div>{link && <button className="link" onClick={onLink}>{link}</button>}</div>
}
export function GTag({ text = 'Added by Gratifi' }: { text?: string }) {
  return <span className="gtag"><Spark s={13} />{text}</span>
}
export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} className={'toggle' + (on ? ' on' : '')} onClick={onChange}><span /></button>
}
export function Row({ ic, t, s, r, onClick, chev = true, tone }: { ic?: string; t: React.ReactNode; s?: React.ReactNode; r?: React.ReactNode; onClick?: () => void; chev?: boolean; tone?: string }) {
  const inner = <>
    {ic && <div className="ic" style={tone ? { background: tone } : undefined}><Ic n={ic} s={18} /></div>}
    <div style={{ flex: 1, minWidth: 0 }}><p className="t">{t}</p>{s && <p className="s">{s}</p>}</div>
    {r}
    {onClick && chev && <Ic n="chev" s={16} c="#8A94A3" />}
  </>
  return onClick ? <button className="row" onClick={onClick}>{inner}</button> : <div className="row">{inner}</div>
}
export function Money({ v, cls = 'big-money' }: { v: number; cls?: string }) {
  const [p, d] = gbp(v).split('.')
  return <p className={cls + ' num'}>{p}<small>.{d}</small></p>
}
export function Sticky({ title, children, rot = -1 }: { title: string; children: React.ReactNode; rot?: number }) {
  return <motion.div className="sticky-wrap" initial={{ opacity: 0, y: 10, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
    <div className="sticky" style={{ transform: `rotate(${rot}deg)` }}>
      <p className="hand" style={{ fontSize: 26 }}>{title}</p>
      {children}
    </div>
    <img src={IMG.clip} alt="" style={{ position: 'absolute', right: 44, top: -10, width: 16, height: 38, transform: 'rotate(8deg)' }} />
  </motion.div>
}

// ---------- card art ----------
export function CardArt({ c, width = '100%', last4, frozen, small }: { c: Card; width?: number | string; last4: string; frozen?: boolean; small?: boolean }) {
  const ink = c.ink
  return <div className={'cardart' + (frozen ? ' frozen' : '')} style={{ width, background: `linear-gradient(135deg, ${c.face[0]}, ${c.face[1]})`, color: ink, padding: small ? '6px 7px' : undefined, borderRadius: small ? 7 : undefined, boxShadow: small ? '0 4px 10px rgba(14,26,43,0.2)' : undefined }} role="img" aria-label={`${c.name}, card ending ${last4}${frozen ? ', frozen' : ''}`}>
    {small ? <>
      <div style={{ width: 11, height: 8, borderRadius: 2, background: 'linear-gradient(135deg,#E9D8A6,#C8A95A)' }} />
      <p style={{ fontSize: 7, fontWeight: 700, opacity: 0.9 }}>{last4}</p>
    </> : <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div><p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.6, opacity: 0.85 }}>BARCLAYCARD</p><p style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>{c.short}{c.business ? ' · Business' : ''}</p></div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" style={{ opacity: 0.8 }} aria-hidden="true"><path d="M8.5 7.5a6.5 6.5 0 0 1 0 9M12 5a10 10 0 0 1 0 14M15.5 3a13 13 0 0 1 0 18" /></svg>
      </div>
      <div className="chipi" style={{ position: 'relative', zIndex: 1 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div><p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, opacity: 0.85 }}>{c.business ? 'S TAYLOR · T&R STUDIO' : 'S TAYLOR'}</p><p style={{ fontSize: 15, fontWeight: 600, letterSpacing: 2, marginTop: 2 }} className="num">•••• {last4}</p></div>

      </div>
    </>}
    {frozen && !small && <div className="frost"><span style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(14,26,43,0.78)', color: '#fff', fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 14 }}><Ic n="snow" s={15} c="#fff" />Frozen</span></div>}
  </div>
}

// ---------- overlays ----------
function DeviceLayer({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<Element | null>(null)
  useEffect(() => setEl(document.querySelector('.device')), [])
  return el ? createPortal(children, el) : null
}
/** Simulated Face ID. `run(label, done)` shows the prompt and calls `done` after it succeeds; the person can cancel. */
export function useFaceId() {
  const [st, setSt] = useState<null | { label: string; phase: 'scan' | 'ok' }>(null)
  const cb = useRef<() => void>(() => {}); const timers = useRef<any[]>([])
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clear, [])
  const run = (label: string, done: () => void) => {
    cb.current = done; setSt({ label, phase: 'scan' })
    timers.current.push(setTimeout(() => setSt(x => x && { ...x, phase: 'ok' }), 950))
    timers.current.push(setTimeout(() => { setSt(null); cb.current() }, 1450))
  }
  const el = <DeviceLayer><AnimatePresence>{st && <motion.div className="faceid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alertdialog" aria-label="Face ID">
    <div className="faceid-box">
      <motion.div animate={st.phase === 'scan' ? { scale: [1, 1.08, 1] } : { scale: 1 }} transition={{ repeat: st.phase === 'scan' ? Infinity : 0, duration: 0.8 }}>
        {st.phase === 'ok' ? <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#11774A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M7.5 12.5l3 3 6-6.5" /></svg> : <FaceGlyph />}
      </motion.div>
      <span>{st.phase === 'ok' ? 'Confirmed' : 'Face ID'}</span>
      <span className="tiny" style={{ textAlign: 'center' }}>{st.label}</span>
      {st.phase === 'scan' && <button className="link" style={{ minHeight: 44 }} onClick={() => { clear(); setSt(null) }}>Cancel</button>}
    </div>
  </motion.div>}</AnimatePresence></DeviceLayer>
  return [el, run] as const
}
export function Sheet({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [])
  return <DeviceLayer>
    <motion.div className="dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
    <motion.div className="sheet" role="dialog" aria-modal="true" aria-label={label} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
      <div className="grabber" />
      {children}
    </motion.div>
  </DeviceLayer>
}
export function Toast({ low }: { low?: boolean }) {
  const { s, d } = useStore()
  return <AnimatePresence>{s.toast && <motion.div key={s.toast.id} className={'toast' + (low ? ' low' : '')} role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
    <span style={{ flex: 1 }}>{s.toast.text}</span>
    {s.toast.undo && <button onClick={() => { const act = s.toast!.undo; d(act); d({ type: 'toast', text: 'Undone.' }) }}>Undo</button>}
  </motion.div>}</AnimatePresence>
}
export const Mono = ({ name, tone = '#E7F1FA', ink = '#0B2A4A' }: { name: string; tone?: string; ink?: string }) =>
  <div className="mono" style={{ background: tone, color: ink }} aria-hidden="true">{name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}</div>
