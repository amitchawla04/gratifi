import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Store, useStore, useNav, useTimeoutToast } from './store'
import { Ic, Spark, Toast, Dial } from './ui'
import { fmt, MEMBER } from './data'
import { Home } from './screens/Home'
import { Ask } from './screens/Ask'
import { Rewards, Hotels, Hotel, Reward, Goal, Offers } from './screens/Browse'
import { ConfirmSheet, Booked, Voucher } from './screens/Checkout'
import { Trip, ActivityScreen, ActivityItem, BookingDetail, Alerts } from './screens/Trip'
import { Profile, MemoryScreen, Tier, ForgetSheet, WhySheet } from './screens/Me'
import { Welcome, Consent, Notify, Setup, Voice } from './screens/Onboard'
import { Host } from './screens/Host'

const SCREENS: Record<string, React.FC<any>> = {
  home: Home, ask: Ask, rewards: Rewards, hotels: Hotels, hotel: Hotel, reward: Reward, goal: Goal, offers: Offers,
  booked: Booked, voucher: Voucher, trip: Trip, activity: ActivityScreen, item: ActivityItem, booking: BookingDetail, alerts: Alerts,
  profile: Profile, memory: MemoryScreen, tier: Tier, welcome: Welcome, consent: Consent, notify: Notify, setup: Setup, voice: Voice,
}

function useFramed() {
  const q = '(min-width: 760px) and (min-height: 700px)'
  const [f, setF] = useState(() => window.matchMedia(q).matches)
  useEffect(() => { const m = window.matchMedia(q); const h = () => setF(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h) }, [])
  return f
}

function StatusBar({ dark }: { dark: boolean }) {
  const c = dark ? '#FFFFFF' : '#141416'
  return <div className="statusbar" style={{ color: c, opacity: dark ? 0.6 : 1 }}>
    <span>9:41</span>
    <svg width="66" height="12" viewBox="0 0 66 12" fill={c}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /><path d="M30 3.2a9 9 0 0 1 12 0l-1.3 1.4a7 7 0 0 0-9.4 0zM32.6 6a5.3 5.3 0 0 1 6.8 0l-1.3 1.4a3.3 3.3 0 0 0-4.2 0zM36 8.6l1.6 1.7-1.6 1.7-1.6-1.7z" /><rect x="46.5" y="0.5" width="17" height="11" rx="3" fill="none" stroke={c} strokeOpacity="0.5" /><rect x="48.5" y="2.5" width="12" height="7" rx="1.5" /></svg>
  </div>
}

function Overlay() {
  const { s } = useStore(); const nav = useNav()
  useTimeoutToast()
  const sheetRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => { const t = setTimeout(() => { const routes = sheetRef.current?.querySelectorAll<HTMLElement>(':scope > [data-route]'); const root = routes && routes.length ? routes[routes.length - 1] : sheetRef.current; const el = root?.querySelector<HTMLElement>('[data-autofocus]') || root?.querySelector<HTMLElement>('h1') || root?.querySelector<HTMLElement>('button'); if (el && el.tagName === 'H1' && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); el?.focus({ preventScroll: true }) }, 480); return () => clearTimeout(t) }, [s.stack[s.stack.length - 1].key, s.open])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !sheetRef.current) return
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input')).filter(x => x.offsetParent !== null)
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])
  const top = s.stack[s.stack.length - 1]
  const Comp = SCREENS[top.name] || Home
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (s.modal) nav.modal(null); else nav.pop() } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [s.modal, s.stack.length])
  return <>
    <motion.div className="dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={nav.close} />
    <motion.div ref={sheetRef} className="sheet" role="dialog" aria-modal="true" aria-label="Gratifi, your points assistant"
      initial={{ y: '100%', borderRadius: 32 }} animate={{ y: 0, borderRadius: 0 }} exit={{ y: '100%', borderRadius: 32 }} transition={{ type: 'spring', stiffness: 300, damping: 34 }}
>
      <AnimatePresence initial={false} custom={s.dir}>
        <motion.div key={top.key} data-route className="route" custom={s.dir}
          variants={{ enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-30%', opacity: dir > 0 ? 1 : 0.6 }), center: { x: 0, opacity: 1 }, exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '100%', opacity: dir > 0 ? 0.6 : 1 }) }}
          initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
          <Comp />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {s.modal?.name === 'confirm' && <ConfirmSheet key="c" item={s.modal.params.item} />}
        {s.modal?.name === 'forget' && <ForgetSheet key="f" />}
        {s.modal?.name === 'why' && <WhySheet key="w" reason={s.modal.params.reason} />}
      </AnimatePresence>
      <AnimatePresence>{s.toast && <Toast key={s.toast.id} />}</AnimatePresence>
    </motion.div>
  </>
}

function Device() {
  const { s, d } = useStore(); const framed = useFramed()
  return <div className="stage">
    <aside className="side" aria-label="About this demo">
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: '#FF6A1F' }}>GRATIFI · BY REWARD360</p>
      <h1>The AI loyalty assistant for every member.</h1>
      <p>This demo shows Gratifi opening inside a bank’s own app. Tap the points card to start. Everything works: ask it anything, book, redeem, undo, and change what it remembers.</p>
      <p>On a phone, open this page and choose “Add to Home Screen” to install it.</p>
      <div className="row"><button className="primary" onClick={() => d({ type: 'open' })}>Open Gratifi</button><button onClick={() => d({ type: 'resetAll', open: false })}>Reset demo</button></div>
      <p className="fine">Illustrative data. Balances, prices and partners come from each programme’s own systems.</p>
    </aside>
    <div className={'device' + (framed ? ' framed' : '')}>
      <StatusBar dark={false} />
      <div className="island" aria-hidden="true" />
      <Host />
      <AnimatePresence>{s.open && <Overlay key="o" />}</AnimatePresence>
    </div>
  </div>
}

export default function App() { return <Store><Device /></Store> }
