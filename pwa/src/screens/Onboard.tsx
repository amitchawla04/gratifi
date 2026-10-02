import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useStore, useNav } from '../store'
import { IMG, MEMBER, fmt } from '../data'
import { Ic, Spark, SetRow, RBtn, Dial } from '../ui'

const Wrap = ({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) => <div className="screen">
  <div className="grabber" />
  <div className="scroll"><div className="pad" style={{ gap: 22, padding: '10px 24px 0' }}>{children}</div><div style={{ height: 180 }} /></div>
  <div style={{ position: 'absolute', left: 24, right: 24, bottom: 'var(--bot2)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 6 }}>{footer}</div>
</div>
const Feat = ({ ic, t, s }: { ic: string; t: string; s: string }) => <div style={{ display: 'flex', gap: 14 }}>
  <div style={{ width: 44, height: 44, borderRadius: 22, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 16px rgba(20,20,22,0.06)' }}><Ic n={ic} /></div>
  <div><p style={{ fontSize: 16, fontWeight: 700 }}>{t}</p><p className="small" style={{ fontSize: 14 }}>{s}</p></div>
</div>

export function Welcome() {
  const nav = useNav()
  return <Wrap footer={<><button className="btn big" onClick={() => nav.push('consent')}>Get started</button><p className="small" style={{ textAlign: 'center' }}>I can make mistakes, so every booking waits for your OK.</p></>}>
    <div className="hdr"><div /><RBtn n="close" label="Close" onClick={nav.close} /></div>
    <motion.img src={IMG.appIcon} alt="" initial={{ scale: 0.6, rotate: -12, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} style={{ width: 72, height: 72, borderRadius: 20, boxShadow: '0 12px 24px rgba(20,20,22,0.18)' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.08 }}>Meet your points assistant.</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.45 }}>Hi {MEMBER.first}. I’m an AI assistant. I know your points, and I can find, book and redeem rewards for you.</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Feat ic="target" t="Knows your points" s="Balance, tier, expiry dates and your programme’s offers, always up to date." />
      <Feat ic="bell" t="Speaks up when it matters" s="Points about to expire, a reward in reach. You choose how often." />
      <Feat ic="lock" t="Asks before it spends" s="Nothing is booked or redeemed until you confirm." />
    </div>
  </Wrap>
}

export function Consent() {
  const { d } = useStore(); const nav = useNav()
  const next = (card: boolean) => { d({ type: 'consent', value: { card } }); nav.push('notify') }
  return <Wrap footer={<><button className="btn big" onClick={() => next(true)}>Allow</button><button className="btn big light" onClick={() => next(false)}>Not now</button></>}>
    <div className="hdr"><RBtn n="back" label="Back" onClick={nav.pop} /><p className="small" style={{ fontWeight: 600 }}>1 of 3</p><div style={{ width: 44 }} /></div>
    <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--sticky)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="card" s={30} /></div>
    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1 }}>Can I look at your card purchases?</h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {['To pick offers you’d actually use.', 'To notice habits, like where you eat out, so suggestions fit.', 'I never share them, and I never use them to train AI.'].map(t => <p key={t} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.4 }}><Ic n="tick" s={18} c="#FF6A1F" w={2.6} />{t}</p>)}
    </div>
    <p className="small">You can change this any time in Settings. Without it, I’ll still help with your points and offers.</p>
  </Wrap>
}

export function Notify() {
  const { d } = useStore(); const nav = useNav()
  const next = (on: boolean) => { d({ type: 'consent', value: { notify: on } }); nav.push('setup') }
  return <Wrap footer={<><button className="btn big" onClick={() => next(true)}>Turn on notifications</button><button className="btn big light" onClick={() => next(false)}>Not now</button></>}>
    <div className="hdr"><RBtn n="back" label="Back" onClick={nav.pop} /><p className="small" style={{ fontWeight: 600 }}>2 of 3</p><div style={{ width: 44 }} /></div>
    <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--sticky)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="bell" s={30} /></div>
    <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.1 }}>Can I tell you when it’s worth it?</h1>
    <div className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <img src={IMG.appIcon} alt="" style={{ width: 36, height: 36, borderRadius: 9 }} />
      <div><p style={{ fontSize: 14, fontWeight: 700 }}>2,400 points expire Sunday</p><p className="small" style={{ fontSize: 14 }}>They cover two cinema tickets. Tap to see them.</p></div>
    </div>
    <p className="sub" style={{ color: 'var(--ink-2)' }}>Only for things like expiring points or a reward in reach. Never adverts.</p>
  </Wrap>
}

export function Setup() {
  const { s, d } = useStore(); const nav = useNav()
  return <Wrap footer={<button className="btn big" onClick={() => { d({ type: 'onboard' }); nav.reset('home') }}>Done</button>}>
    <div className="hdr"><RBtn n="back" label="Back" onClick={nav.pop} /><p className="small" style={{ fontWeight: 600 }}>3 of 3</p><div style={{ width: 44 }} /></div>
    <div><h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>How should I help?</h1><p className="sub" style={{ marginTop: 6 }}>Change any of these later in Settings.</p></div>
    <div className="list">
      <SetRow t="Suggest ways to use points" s="Rewards that fit your balance and plans." on={s.prefs.suggest} onChange={() => d({ type: 'pref', value: { suggest: !s.prefs.suggest } })} />
      <SetRow t="Remind me before points expire" s="A week before, and again two days before." on={s.prefs.remind} onChange={() => d({ type: 'pref', value: { remind: !s.prefs.remind } })} />
      <SetRow t="Remember my preferences" s="Your usual seat or order. You can see and delete them." on={s.prefs.remember} onChange={() => d({ type: 'pref', value: { remember: !s.prefs.remember } })} />
      <SetRow t="Always ask before spending" s="Every booking and redemption needs your OK." locked last />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 15, fontWeight: 700 }}>Where can I reach you?</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{([['app', 'In the app'], ['whatsapp', 'WhatsApp'], ['email', 'Email']] as const).map(([k, l]) => <button key={k} className={'chip' + (s.prefs.channel === k ? ' on' : '')} aria-pressed={s.prefs.channel === k} onClick={() => d({ type: 'pref', value: { channel: k } })}>{s.prefs.channel === k && <Ic n="tick" s={14} c="#F4F4F3" w={2.6} />}{l}</button>)}</div>
    </div>
  </Wrap>
}

export function Voice() {
  const nav = useNav()
  const phrase = 'A hotel in Lisbon for my trip, under 9,000 points'
  const [n, setN] = useState(0)
  useEffect(() => { const t = setInterval(() => setN(x => Math.min(phrase.length, x + 1)), 55); return () => clearInterval(t) }, [])
  const done = n >= phrase.length
  return <div className="screen">
    <div className="grabber" />
    <div className="pad"><div className="hdr"><RBtn n="back" label="Back" onClick={nav.pop} /><p className="hdr-title">{done ? 'Got it' : 'Listening'}</p><RBtn n="close" label="Stop and close" onClick={nav.pop} /></div></div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, padding: '0 32px' }}>
      <div style={{ position: 'relative' }}>
        <Dial size={220} pct={1} label=" " aria="Listening" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {[14, 26, 44, 60, 38, 22, 12].map((h, i) => <motion.span key={i} animate={done ? { height: 8 } : { height: [h * 0.5, h, h * 0.4, h * 0.8] }} transition={{ repeat: done ? 0 : Infinity, duration: 0.9, delay: i * 0.08 }} style={{ width: 6, borderRadius: 3, background: i > 1 && i < 5 ? '#FF6A1F' : '#F4F4F3' }} />)}
        </div>
      </div>
      <p aria-live="polite" style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.3, textAlign: 'center', minHeight: 102 }}>{phrase.slice(0, n)}<span style={{ color: '#8A8A92' }}>{done ? '' : '…'}</span></p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingBottom: 'calc(20px + var(--bot))' }}>
      <button aria-label={done ? 'Send' : 'Stop listening'} onClick={() => nav.replace('ask', { q: phrase })} style={{ width: 76, height: 76, borderRadius: 38, background: '#17171A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(20,20,22,0.2)' }}><Ic n={done ? 'up' : 'stop'} s={28} c="#F4F4F3" w={2.4} /></button>
      <p className="small" style={{ fontSize: 14 }}>{done ? 'Tap to send' : 'Tap to stop'}</p>
      {done && <button className="btn ghost" style={{ height: 44 }} onClick={() => setN(0)}>Try again</button>}
    </div>
  </div>
}
