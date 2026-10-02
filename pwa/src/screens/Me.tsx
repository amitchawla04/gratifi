import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore, useNav } from '../store'
import { MEMBER, fmt } from '../data'
import { Screen, Header, Ic, Spark, SetRow, Dial, Sticky, Toggle } from '../ui'

export const visibleMemory = (s: any) => s.memory.filter((m: any) => m.source !== 'From your card' || s.consent.card)

export function Profile() {
  const { s, d } = useStore(); const nav = useNav()
  const nav2 = (ic: string, t: string, v: string, go?: () => void) => <button className="row" onClick={go}><Ic n={ic} s={20} /><span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{t}</span><span className="small" style={{ fontSize: 14 }}>{v}</span><Ic n="chev" s={16} c="#8A8A92" /></button>
  return <Screen>
    <div className="pad" style={{ gap: 14 }}>
      <Header title="You" />
      <button className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('tier')}>
        <span style={{ width: 56, height: 56, borderRadius: 28, background: 'var(--ink)', color: '#F4F4F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>S</span>
        <div style={{ flex: 1 }}><p style={{ fontSize: 18, fontWeight: 700 }}>{MEMBER.name}</p><p className="small">Gold since {MEMBER.memberSince} · {fmt(MEMBER.tierTarget - s.tierPts)} tier points to Platinum</p></div>
        <Ic n="chev" s={18} c="#8A8A92" />
      </button>
      <p className="small" style={{ fontWeight: 600, paddingTop: 2 }}>Your assistant</p>
      <div className="list">
        <SetRow t="Suggest ways to use points" s="Rewards that fit your balance and plans." on={s.prefs.suggest} onChange={() => d({ type: 'pref', value: { suggest: !s.prefs.suggest } })} />
        <SetRow t="Remind me before points expire" s="A week before, and again two days before." on={s.prefs.remind} onChange={() => d({ type: 'pref', value: { remind: !s.prefs.remind } })} />
        <SetRow t="Remember my preferences" s="Your usual seat or order. See and delete them below." on={s.prefs.remember} onChange={() => d({ type: 'pref', value: { remember: !s.prefs.remember } })} />
        <SetRow t="Use my card purchases" s="To find missing points and offers you’d use." on={s.consent.card} onChange={() => d({ type: 'consent', value: { card: !s.consent.card } })} />
        <SetRow t="Notifications" s="Only for expiring points or a reward in reach." on={s.consent.notify} onChange={() => d({ type: 'consent', value: { notify: !s.consent.notify } })} />
        <SetRow t="Always ask before spending" s="Every booking and redemption needs your OK." locked last />
      </div>
      <div className="list">
        {nav2('brain', 'What I remember', `${visibleMemory(s).length} things`, () => nav.push('memory'))}
        {nav2('chat', 'Where I reach you', s.prefs.channel === 'app' ? 'In the app' : s.prefs.channel === 'whatsapp' ? 'WhatsApp' : 'Email', () => d({ type: 'pref', value: { channel: s.prefs.channel === 'app' ? 'email' : 'app' } }))}
        {nav2('globe', 'Language', 'English (UK)')}
      </div>
      <p className="small" style={{ display: 'flex', gap: 10, padding: '0 4px' }}><Ic n="info" s={18} c="#5C5C64" />This is an AI assistant. It can make mistakes, so it always asks before spending your points. Powered by Gratifi.</p>
      <button className="btn light" style={{ alignSelf: 'flex-start' }} onClick={() => { d({ type: 'resetAll', open: false }) }}>Reset this demo</button>
    </div>
  </Screen>
}

export function MemoryScreen() {
  const { s, d } = useStore(); const nav = useNav()
  const groups = ['Travel', 'Food and drink', 'Plans']
  const mem = visibleMemory(s)
  return <Screen placeholder="Tell me a preference">
    <div className="pad" style={{ gap: 12 }}>
      <Header title="What I remember" />
      <p className="sub" style={{ color: 'var(--ink-2)' }}>I use these to make better suggestions. Each one says where it came from. Delete anything, any time.</p>
      <div className="list"><SetRow t="Remember new things" s="When you tell me a preference or a plan." on={s.prefs.remember} onChange={() => d({ type: 'pref', value: { remember: !s.prefs.remember } })} last /></div>
      {mem.length === 0 && <div className="card" style={{ padding: 24, textAlign: 'center' }}><p style={{ fontWeight: 700 }}>Nothing remembered</p><p className="small" style={{ marginTop: 4 }}>I’ll ask before I keep anything new.</p></div>}
      {groups.map(g => { const items = mem.filter(m => m.group === g); if (!items.length) return null
        return <React.Fragment key={g}><p className="small" style={{ fontWeight: 600, paddingTop: 2 }}>{g}</p>
          <div className="list"><AnimatePresence initial={false}>{items.map(m => <motion.div key={m.id} className="row" exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ flex: 1 }}><p style={{ fontSize: 15 }}>{m.text}</p><p className="s">{m.source}</p></div>
            <button aria-label={`Forget ${m.text}`} onClick={() => { d({ type: 'forget', id: m.id }); nav.toast(`Forgotten: ${m.text}.`, { type: 'restoreMemory', item: m }) }} style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--ground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="close" s={14} c="#5C5C64" w={2.4} /></button>
          </motion.div>)}</AnimatePresence></div></React.Fragment> })}
      {mem.length > 0 && <button className="btn ghost" style={{ alignSelf: 'center', color: 'var(--danger)', fontWeight: 700 }} onClick={() => nav.modal('forget')}>Forget everything</button>}
    </div>
  </Screen>
}

export function Tier() {
  const { s } = useStore()
  const pct = s.tierPts / MEMBER.tierTarget
  return <Screen placeholder="Ask about your tier">
    <div className="pad">
      <Header title="Your tier" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Dial size={168} pct={pct} />
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, textAlign: 'center' }}>{fmt(MEMBER.tierTarget - s.tierPts)} tier points to Platinum</h1>
        <p className="small" style={{ textAlign: 'center' }}>Tier points come from card spend. Spending your points doesn’t reduce them.</p>
      </div>
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="sec"><p className="small" style={{ fontWeight: 600, fontSize: 14 }}>Tier points this year</p><p className="num" style={{ fontSize: 14, fontWeight: 700 }}>{fmt(s.tierPts)} of 20,000</p></div>
        <div className="progress"><motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }} style={{ background: 'var(--accent)' }} /></div>
        <p className="small">Your tier year ends on 31 December.</p>
      </div>
      <Sticky title="Nearly there" clip={false} rot={-1}><p style={{ fontSize: 15 }}>You’ve earned about 1,900 tier points a month lately, so you’ll reach Platinum in July.</p></Sticky>
      <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontWeight: 700 }}>What Platinum adds</p>
        {[['Triple points on travel', 'Gold: double'], ['Unlimited lounge visits', 'Gold: two a year'], ['A named contact when you need help', 'Gold: the help line']].map(([a, b]) => <div key={a} style={{ display: 'flex', gap: 10 }}><Ic n="tick" s={18} c="#FF6A1F" w={2.6} /><div><p style={{ fontSize: 15 }}>{a}</p><p className="small">{b}</p></div></div>)}
      </div>
    </div>
  </Screen>
}

export function ForgetSheet() {
  const { d } = useStore(); const nav = useNav()
  return <>
    <motion.div className="modal-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => nav.modal(null)} />
    <motion.div className="modal" role="alertdialog" aria-modal="true" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
      <div className="grabber" style={{ background: '#D6D4CF' }} />
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Forget everything?</h2>
      <p className="sub" style={{ color: 'var(--ink-2)' }}>I’ll delete everything I remember about you. Your points, bookings and activity stay as they are. This can’t be undone.</p>
      <button className="btn big danger" onClick={() => { d({ type: 'forgetAll' }); nav.modal(null); nav.toast('Done. I’ve forgotten everything.') }}>Forget everything</button>
      <button className="btn big light" onClick={() => nav.modal(null)}>Keep it</button>
    </motion.div>
  </>
}

export function WhySheet({ reason }: { reason: string }) {
  const { s } = useStore(); const nav = useNav()
  const lines: Record<string, string[]> = {
    expiry: [`${fmt(s.expiring)} of your points expire on Sunday 9 May.`, s.consent.card ? 'You’ve paid for cinema tickets twice this year with your card.' : 'Cinema tickets are the closest reward to that amount.', s.consent.notify ? 'You asked for a reminder a week before, and again two days before.' : 'You asked for reminders in the app, a week before and two days before.'],
  }
  return <>
    <motion.div className="modal-dim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => nav.modal(null)} />
    <motion.div className="modal" role="dialog" aria-modal="true" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
      <div className="grabber" style={{ background: '#D6D4CF' }} />
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>Why you’re seeing this</h2>
      {(lines[reason] || ['It matches your points and plans.']).map(l => <p key={l} style={{ display: 'flex', gap: 10, fontSize: 15, lineHeight: 1.4 }}><Spark s={18} />{l}</p>)}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn light" style={{ flex: 1, height: 48 }} onClick={() => { nav.modal(null); nav.push('memory') }}>What I remember</button>
        <button className="btn light" style={{ flex: 1, height: 48 }} onClick={() => { nav.modal(null); nav.push('profile') }}>Settings</button>
      </div>
      <button className="btn big" onClick={() => nav.modal(null)}>Got it</button>
    </motion.div>
  </>
}
