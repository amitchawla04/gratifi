import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '../store'
import { fmt, MEMBER } from '../data'
import { Ic, Spark, Dial } from '../ui'

const NAVY = '#12284A'
const note = (setMsg: (s: string) => void, t = 'In the live app, this opens in your bank.') => () => { setMsg(t); setTimeout(() => setMsg(''), 2200) }

function Logo() {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill={NAVY} /><path d="M9 21.5V10.5h3.2l7.6 7.2V10.5H23v11h-3.2l-7.6-7.2v7.2z" fill="#fff" /></svg>
    <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3, color: NAVY }}>Your Bank</span>
  </div>
}

const ACCOUNTS = [
  { id: 'cur', name: 'Current account', num: '20-45-18 · 41824821', bal: 2340.18, sub: 'Available £2,840.18 incl. £500 overdraft', bg: NAVY, fg: '#FFFFFF' },
  { id: 'sav', name: 'Easy access saver', num: 'Rainy day pot', bal: 6120.0, sub: '£120 added on the 1st of each month', bg: '#1F6F5C', fg: '#FFFFFF' },
  { id: 'cc', name: 'Gold credit card', num: '•••• 9012', bal: 412.36, sub: 'Next payment due 21 May', bg: '#2B2B30', fg: '#FFFFFF', gold: true },
]
const money = (n: number) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function Host() {
  const { s, d } = useStore()
  const [msg, setMsg] = useState('')
  const [acc, setAcc] = useState(0)
  const say = (t?: string) => note(setMsg, t)
  const pct = Math.min(1, 1284 / 1420)
  const tx = [
    { g: 'Today', items: [['CG', 'Corner Grocer', 'Groceries · Gold card', -42.10, 42, '#E8F1EC'], ['CL', 'Coffee Lab', 'Eating out · Gold card', -3.40, 3, '#F3ECE4']] },
    { g: 'Yesterday', items: [['AC', 'Acme Ltd', 'Salary', 2850.0, 0, '#E7ECF5'], ['MR', 'Metro Rail', 'Travel · Gold card', -18.60, 37, '#EFE9F5']] },
    { g: 'Wed 5 May', items: [['BS', 'Brightside Energy', 'Direct debit', -64.00, 0, '#F5EEDC'], ['NF', 'Northfield Gym', 'Direct debit', -45.00, 0, '#E4EEF2']] },
  ] as const
  return <div className="host" aria-hidden={s.open}>
    <div className="host-scroll">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="hbtn" aria-label="Search" onClick={say()}><Ic n="search" s={19} c={NAVY} /></button>
          <button className="hbtn" aria-label="Messages, 1 new" onClick={say()} style={{ position: 'relative' }}><Ic n="bell" s={19} c={NAVY} /><span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, background: '#D93A2B', boxShadow: '0 0 0 2px #fff' }} /></button>
          <button className="hbtn" aria-label="Your profile" onClick={say()} style={{ background: NAVY, color: '#fff', fontWeight: 700, fontSize: 15 }}>ST</button>
        </div>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#6A6F7A' }}>Friday 7 May</p>
        <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: '#101828' }}>Good morning, {MEMBER.first}</p>
      </div>

      <div className="acc-scroll" onScroll={e => { const el = e.currentTarget; setAcc(Math.round(el.scrollLeft / (el.clientWidth * 0.86))) }}>
        {ACCOUNTS.map(a => <button key={a.id} className="acc" style={{ background: a.bg, color: a.fg }} onClick={say()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>{a.name}</span>
            {a.gold ? <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, background: '#D8B45A', color: '#2B2B30', padding: '3px 8px', borderRadius: 6 }}>GOLD</span> : <Ic n="chev" s={16} c="rgba(255,255,255,0.7)" w={2.2} />}
          </div>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{a.num}</span>
          <span className="num" style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, marginTop: 10 }}>{money(a.bal)}</span>
          <span style={{ fontSize: 12, opacity: 0.75 }}>{a.id === 'cc' ? `Balance · ${a.sub}` : a.sub}</span>
        </button>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: -8 }} aria-hidden="true">{ACCOUNTS.map((_, i) => <span key={i} style={{ width: i === acc ? 18 : 6, height: 6, borderRadius: 3, background: i === acc ? NAVY : '#C9CCD3', transition: 'width .2s' }} />)}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {[['arrow', 'Pay'], ['refresh', 'Move'], ['card', 'Cards'], ['cal', 'Statements'], ['grid', 'More']].map(([ic, l]) =>
          <button key={l} onClick={say()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 62, fontSize: 12, fontWeight: 600, color: '#101828' }}>
            <span style={{ width: 52, height: 52, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16,24,40,0.06)' }}><Ic n={ic} s={21} c={NAVY} /></span>{l}
          </button>)}
      </div>

      <motion.button whileTap={{ scale: 0.98 }} onClick={() => d({ type: 'open' })} aria-label="Open your points assistant"
        style={{ background: '#fff', borderRadius: 22, padding: '16px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 0 0 2px #FF6A1F, 0 12px 30px rgba(255,106,31,0.16)', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Dial size={60} pct={s.tierPts / MEMBER.tierTarget} label="" aria="Gold tier" />
          <div style={{ flex: 1 }}><p style={{ fontSize: 13, fontWeight: 600, color: '#5C5C64' }}>Gold Rewards · your points</p><p className="num" style={{ fontSize: 24, fontWeight: 800 }}>{fmt(s.balance)}</p></div>
          <Ic n="chev" s={18} c="#8A8A92" w={2.2} />
        </div>
        {s.expiring > 0 && <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#FFF4D6', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontWeight: 500 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: '#FF6A1F', flexShrink: 0 }} />{fmt(s.expiring)} expire Sunday. Enough for two cinema tickets.</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, borderRadius: 22, background: '#F4F4F3', padding: '0 14px' }}><Spark s={18} /><span style={{ fontSize: 14, color: '#5C5C64' }}>Ask about your points</span></div>
      </motion.button>

      <button className="hcard" onClick={say()} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span className="hh">Spending this month</span><span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>Insights</span></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span className="num" style={{ fontSize: 24, fontWeight: 800, color: '#101828' }}>£1,284</span><span style={{ fontSize: 13, color: '#6A6F7A' }}>of your usual £1,420</span></div>
        <div style={{ height: 8, borderRadius: 4, background: '#E9EBEF', overflow: 'hidden' }}><motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.9 }} style={{ height: 8, borderRadius: 4, background: NAVY }} /></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{[['Groceries', '£312'], ['Travel', '£420'], ['Eating out', '£146'], ['Bills', '£406']].map(([k, v]) => <span key={k} style={{ fontSize: 12, fontWeight: 600, color: '#344054', background: '#F2F4F7', padding: '6px 10px', borderRadius: 10 }}>{k} {v}</span>)}</div>
      </button>

      <button className="hcard" onClick={say()} style={{ display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left', background: '#EAF0F8' }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic n="plane" s={20} c={NAVY} /></span>
        <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700, color: '#101828' }}>Off to Lisbon on 14 May?</p><p style={{ fontSize: 13, color: '#475467' }}>No fees when you pay abroad with your Gold card.</p></div>
        <Ic n="chev" s={16} c="#667085" w={2.2} />
      </button>

      <div className="hcard" style={{ padding: '14px 16px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}><span className="hh">Coming up</span><button onClick={say()} style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>See all</button></div>
        {[['Phone', 'Direct debit · Wed 12 May', '£32.00'], ['Gold card payment', 'Due Fri 21 May', '£412.36'], ['Rent', 'Standing order · Tue 1 Jun', '£1,150.00']].map(([t, s2, v]) =>
          <div key={t} className="row"><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{s2}</p></div><p className="r num">{v}</p></div>)}
      </div>

      <div className="hcard" style={{ padding: '14px 16px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span className="hh">Recent transactions</span><button onClick={say()} style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>See all</button></div>
        {tx.map(g => <React.Fragment key={g.g}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6A6F7A', marginTop: 12, letterSpacing: 0.3 }}>{g.g.toUpperCase()}</p>
          {g.items.map(([ini, name, sub, amt, pts, bg]) => <button key={name} className="row" onClick={say()}>
            <span style={{ width: 40, height: 40, borderRadius: 20, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#344054', flexShrink: 0 }}>{ini}</span>
            <div style={{ flex: 1, minWidth: 0 }}><p className="t">{name}</p><p className="s">{sub}</p></div>
            <div style={{ textAlign: 'right' }}><p className={'r num' + (amt > 0 ? ' pos' : '')}>{amt > 0 ? '+' : '−'}{money(Math.abs(amt))}</p>{pts > 0 && <p style={{ fontSize: 12, fontWeight: 600, color: '#D2480A' }}>+{pts} points</p>}</div>
          </button>)}
        </React.Fragment>)}
      </div>

      <p style={{ fontSize: 12, color: '#6A6F7A', textAlign: 'center', padding: '4px 20px 0' }}>Illustrative bank screen. Gratifi appears inside your bank’s own app.</p>
      <div style={{ height: 'calc(100px + var(--sab))', flexShrink: 0 }} />
    </div>

    <div className="host-tabs">{[['home', 'Home', true], ['arrow', 'Payments'], ['card', 'Cards'], ['gift', 'Rewards'], ['grid', 'More']].map(([ic, l, on]: any) =>
      <button key={l} className={'host-tab' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined} onClick={l === 'Rewards' ? () => d({ type: 'open' }) : on ? undefined : say()}>
        <Ic n={ic} s={22} c={on ? NAVY : l === 'Rewards' ? '#D2480A' : '#6E6E76'} />{l}
      </button>)}</div>

    <AnimatePresence>{msg && <motion.div className="toast" style={{ bottom: 'calc(92px + var(--sab))', zIndex: 8 }} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>{msg}</motion.div>}</AnimatePresence>
  </div>
}
