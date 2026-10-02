import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Store, useStore, useToastTimer } from './store'
import { AskBar, Ic, Toast } from './ui'
import { CARDS } from './data'
import { Picker } from './screens/Picker'
import { Home, Notifications } from './screens/Home'
import { Spending, TxnDetail, Statements, Statement } from './screens/Spend'
import { Pay, DirectDebit, Limit, Transfer, Spread, Plans, PricePromise, Score, Cashback, Welcome, Voucher } from './screens/Money'
import { CardTab, Lost, Cardholders, AddCardholder } from './screens/CardTab'
import { BenefitsHub, BenefitDetail, CashbackRewards, AmazonRewards, Lounge, Entertainment, Abroad, Security, Calc, DueDate, Controls, BizRewards, Insurance, SCCash } from './screens/Hub'
import { Rewards, Browse, ItemScreen, Checkout, Booked, Bookings, Offers, Avios } from './screens/Rewards'
import { More, Profile, Alerts, GratifiSettings, Help, About } from './screens/More'
import { Ask } from './screens/Ask'

const PUSHED: Record<string, React.FC<any>> = {
  notifications: Notifications, txn: TxnDetail, statements: Statements, statement: Statement,
  pay: Pay, dd: DirectDebit, limit: Limit, bt: Transfer, spread: Spread, plans: Plans, promise: PricePromise, score: Score, cashback: Cashback, welcome: Welcome, voucher: Voucher,
  lost: Lost, cardholders: Cardholders, addCardholder: AddCardholder, benefits: BenefitsHub, benefit: BenefitDetail,
  cbr: CashbackRewards, amazon: AmazonRewards, lounge: Lounge, entertainment: Entertainment, abroad: Abroad, security: Security, calc: Calc, duedate: DueDate,
  controls: Controls, bizrewards: BizRewards, insurance: Insurance, sccash: SCCash,
  browse: Browse, item: ItemScreen, checkout: Checkout, booked: Booked, bookings: Bookings, offers: Offers, avios: Avios,
  profile: Profile, alerts: Alerts, gratifi: GratifiSettings, help: Help, about: About, ask: Ask,
}
const TABS = [
  { id: 'home', label: 'Home', ic: 'home', C: Home },
  { id: 'spend', label: 'Spending', ic: 'chart', C: Spending },
  { id: 'rewards', label: 'Rewards', ic: 'gift', C: Rewards },
  { id: 'card', label: 'Card', ic: 'card', C: CardTab },
  { id: 'more', label: 'More', ic: 'grid', C: More },
]

function useFramed() {
  const q = '(min-width: 760px) and (min-height: 700px)'
  const [f, setF] = useState(() => window.matchMedia(q).matches)
  useEffect(() => { const m = window.matchMedia(q); const h = () => setF(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h) }, [])
  return f
}

function StatusBar() {
  const c = '#0E1A2B'
  return <div className="statusbar" style={{ color: c }} aria-hidden="true">
    <span>9:41</span>
    <svg width="66" height="12" viewBox="0 0 66 12" fill={c}><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /><path d="M30 3.2a9 9 0 0 1 12 0l-1.3 1.4a7 7 0 0 0-9.4 0zM32.6 6a5.3 5.3 0 0 1 6.8 0l-1.3 1.4a3.3 3.3 0 0 0-4.2 0zM36 8.6l1.6 1.7-1.6 1.7-1.6-1.7z" /><rect x="46.5" y="0.5" width="17" height="11" rx="3" fill="none" stroke={c} strokeOpacity="0.5" /><rect x="48.5" y="2.5" width="12" height="7" rx="1.5" /></svg>
  </div>
}

function Main() {
  const { s, d } = useStore()
  useToastTimer()
  // Test hook for the automated screen walk; it only dispatches the same actions the screens do.
  useEffect(() => { (window as any).__bc = d }, [d])
  const top = s.stack[s.stack.length - 1]
  const Tab = (TABS.find(t => t.id === s.tab) || TABS[0]).C
  const Pushed = top ? PUSHED[top.name] : null
  useEffect(() => {
    const t = setTimeout(() => { const layers = document.querySelectorAll<HTMLElement>('[data-layer]'); const root = layers[layers.length - 1]; const el = root?.querySelector<HTMLElement>('[data-autofocus]') || root?.querySelector<HTMLElement>('h1'); if (el) { if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }) } }, 380)
    return () => clearTimeout(t)
  }, [top?.key, s.tab])
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !s.sheet && s.stack.length) d({ type: 'pop' }) }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [s.stack.length, s.sheet])
  return <>
    <div className="layer" data-layer aria-hidden={!!top || undefined} style={top ? { visibility: 'hidden' } : undefined}>
      <div className="screen" key={s.tab}><Tab /></div>
      <div className="bottom-panel" />
      <AskBar mode="over-tabs" />
      <nav className="tabs" aria-label="Main">
        {TABS.map(t => <button key={t.id} className={'tab' + (s.tab === t.id ? ' on' : '')} aria-current={s.tab === t.id ? 'page' : undefined} onClick={() => d({ type: 'tab', tab: t.id })}><Ic n={t.ic} s={23} c={s.tab === t.id ? '#0B2A4A' : '#6B7686'} w={s.tab === t.id ? 2.3 : 1.9} />{t.label}</button>)}
      </nav>
    </div>
    <AnimatePresence initial={false} custom={s.dir}>
      {top && Pushed && <motion.div key={top.key} className="layer" data-layer custom={s.dir}
        variants={{ enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-25%', opacity: dir > 0 ? 1 : 0.7 }), center: { x: 0, opacity: 1 }, exit: (dir: number) => ({ x: dir > 0 ? '-25%' : '100%', opacity: dir > 0 ? 0.7 : 1 }) }}
        initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
        <Pushed {...(top.params || {})} />
      </motion.div>}
    </AnimatePresence>
    <Toast low={!!top} />
  </>
}

class Boundary extends React.Component<{ children: React.ReactNode; onReset: () => void }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() {
    if (!this.state.err) return this.props.children
    return <div className="screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14, textAlign: 'center' }}>
      <p className="h2">Something went wrong on this screen</p>
      <p className="sub">Your demo data is still here. Go back to Home to carry on.</p>
      <button className="btn" onClick={() => { this.setState({ err: false }); this.props.onReset() }}>Back to Home</button>
    </div>
  }
}

function Device() {
  const { s, d } = useStore(); const framed = useFramed()
  return <div className="stage">
    <aside className="side" aria-label="About this demo">
      <p className="eyebrow">GRATIFI · BY REWARD360</p>
      <h1>A Barclaycard app with an assistant for every member.</h1>
      <p>Pick a card and the app becomes that member’s app: their balance, payments, benefits and rewards, with Gratifi built in. Every screen responds. Try a question.</p>
      <p>On a phone, open this page and choose “Add to Home Screen”.</p>
      {s.cardId && <div className="row2">{CARDS.map(c => <button key={c.id} className={s.cardId === c.id ? 'primary' : ''} onClick={() => d({ type: 'selectCard', id: c.id })}>{c.short}</button>)}</div>}
      <div className="row2"><button onClick={() => d({ type: 'leave' })}>Choose a card</button><button onClick={() => { if (confirm('Reset every card in the demo?')) d({ type: 'resetAll' }) }}>Reset demo</button></div>
      <p className="fine">A concept by Reward360 for Barclays. Not a Barclays product. Card terms are from Barclaycard’s public pages on 28 Sep 2026; member data, partners and offers are invented for the demo.</p>
    </aside>
    <div className={'device' + (framed ? ' framed' : '')}>
      <StatusBar />
      <div className="island" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {s.cardId ? <motion.div key={'app-' + s.cardId} className="layer" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}><Boundary onReset={() => d({ type: 'home', tab: 'home' })}><Main /></Boundary></motion.div>
          : <motion.div key="picker" className="layer" data-layer initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Picker /></motion.div>}
      </AnimatePresence>
    </div>
  </div>
}

export default function App() { return <Store><Device /></Store> }
