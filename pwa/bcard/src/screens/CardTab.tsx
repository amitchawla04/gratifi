import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore, useNav, useAcct } from '../store'
import { gbp, MEMBER } from '../data'
import { benefitsFor } from '../benefits'
import { CardArt, Ic, Row, Sec, Toggle, Page, Sheet, useFaceId, GTag } from '../ui'

export function CardTab() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const [face, run] = useFaceId()
  const [show, setShow] = useState<null | 'pin' | 'details'>(null)
  const [left, setLeft] = useState(10)
  useEffect(() => { if (!show) return; setLeft(10); const i = setInterval(() => setLeft(x => { if (x <= 1) { clearInterval(i); setShow(null); return 10 } return x - 1 }), 1000); return () => clearInterval(i) }, [show])
  const newCard = cs.newCard
  return <div className="scroll">
    <div className="pad">
      <div className="hdr"><h1 className="h1" tabIndex={-1}>Your card</h1></div>
      <div style={{ position: 'relative' }}>
        <CardArt c={c} last4={a.cardLast4} frozen={cs.frozen} />
        <AnimatePresence>{show && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(8,14,24,0.88)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 16 }} role="status">
          {show === 'pin' ? <><p className="small" style={{ color: '#B4BDC9' }}>Your PIN</p><p style={{ fontSize: 40, fontWeight: 800, letterSpacing: 14 }} className="num">4 0 1 7</p></> : <>
            <p className="small" style={{ color: '#B4BDC9' }}>Card number</p><p style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }} className="num">•••• •••• •••• {a.cardLast4}</p>
            <div style={{ display: 'flex', gap: 24 }}><div><p className="tiny" style={{ color: '#B4BDC9' }}>Expires</p><p style={{ fontWeight: 700 }}>09/30</p></div><div><p className="tiny" style={{ color: '#B4BDC9' }}>Security code</p><p style={{ fontWeight: 700 }}>•••</p></div></div></>}
          <p className="tiny" style={{ color: '#B4BDC9' }}>{show === 'details' ? 'The live app shows the full number here' : 'Demo PIN'} · hides in {left}s</p>
        </motion.div>}</AnimatePresence>
      </div>
      {newCard && <div className="note blue"><Ic n="card" s={18} c="#1269AE" /><div style={{ flex: 1 }}>{newCard.activated ? `Your new card ending ${newCard.last4} is active.` : `Your new card ending ${newCard.last4} arrives by ${newCard.arrives}. You can use its details online now.`}</div>{!newCard.activated && <button className="btn sm" onClick={() => run('Activate your card', () => { d({ type: 'activate' }); nav.toast('Card activated. Your PIN is the same as before.') })}>Activate</button>}</div>}

      <div className="list">
        <div className="row"><div className="ic" style={cs.frozen ? { background: 'var(--blue-soft)' } : undefined}><Ic n="snow" s={18} c={cs.frozen ? '#1269AE' : '#0E1A2B'} /></div><div style={{ flex: 1 }}><p className="t">Freeze card</p><p className="s">{cs.frozen ? 'Payments are blocked until you unfreeze it' : 'Stops payments in shops, online and on your phone'}</p></div>
          <Toggle on={cs.frozen} label="Freeze card" onChange={() => { d({ type: 'freeze', on: !cs.frozen }); nav.toast(cs.frozen ? 'Card unfrozen. You can pay again.' : 'Card frozen. Unfreeze it here whenever you’re ready.') }} /></div>
        <Row ic="eye" t="Show card details" s="For paying online" onClick={() => run('Show card details', () => setShow('details'))} />
        <Row ic="key" t="View PIN" s="Shows for ten seconds" onClick={() => run('View your PIN', () => setShow('pin'))} />
        {c.id === 'amazon' ? <Row ic="phone" t="Add to Google Pay" s="Pay with your Android phone" onClick={() => nav.toast('In the live app, this opens Google Pay with your card ready to add.')} /> : <Row ic="apple" t="Add to Apple Wallet" s={c.reward === 'avios' ? 'Or Google Pay on Android' : 'Pay with your iPhone or Apple Watch'} onClick={() => nav.toast('In the live app, this opens Apple Wallet with your card ready to add.')} />}
        <Row ic="flag" t="Report lost, stolen or damaged" s="Block this card and get a new one" onClick={() => nav.push('lost')} />
        <Row ic="lock" t="Security" s="Approve payments, PINsentry codes, fraud" onClick={() => nav.push('security')} />
        {c.business && <Row ic="settings" t="MyControls" s="Where each card on the account can be used" onClick={() => nav.push('controls')} />}
      </div>

      <Sec title="Credit" />
      <div className="list">
        <Row ic="wallet" t="Credit limit" s={`${gbp(a.limit, 0)} · ${gbp(a.available)} available`} onClick={() => nav.push('limit')} />
        {!c.business && c.id !== 'amazon' && <Row ic="swap" t="Transfers" s={c.id === 'platinum' ? `${gbp(a.prog.bt)} at 0% until ${a.prog.btUntil}` : 'Balance and money transfer offers'} onClick={() => nav.push('bt')} />}
        {!c.business && <Row ic="split" t="Instalment Plans" s={cs.plans.length ? `${cs.plans.length} active · ${gbp(a.planMonthly)} a month` : 'Spread a purchase of £100 or more'} onClick={() => nav.push(cs.plans.length ? 'plans' : 'spread')} />}
        <Row ic="users" t={c.business ? 'Employee cards' : 'Additional cardholders'} s={cs.cardholders.length ? `${cs.cardholders.length} on this account` : 'Add someone to your account'} onClick={() => nav.push('cardholders')} />
      </div>

      <Sec title="What your card gives you" link={`All ${benefitsFor(c.id).length}`} onLink={() => nav.push('benefits')} />
      <div className="list">{c.benefits.slice(0, 3).map(b => <Row key={b.t} ic={b.ic} t={b.t} s={b.s} chev={false} />)}</div>

      <Sec title="Rates and fees" />
      <div className="list">
        <div className="kv"><span>Purchases</span><span>{c.purchaseRate}</span></div>
        <div className="kv"><span>Card fee</span><span>{c.fee}</span></div>
        <div className="kv"><span>Spending abroad</span><span>{c.id === 'rewards' ? 'No fee' : c.id === 'premium-plus' ? '0.99% of the amount' : '2.99% of the amount'}</span></div>
        {!c.business && <div className="kv"><span>Cash withdrawals</span><span>{c.id === 'rewards' ? 'No fee' : '2.99%, minimum £2.99'}</span></div>}
        {!c.business && <div className="kv"><span>Late or missed payment</span><span>£12</span></div>}
        {!c.business && <div className="kv"><span>Over your limit</span><span>£12</span></div>}
        <div className="kv" style={{ flexDirection: 'column', gap: 4 }}><span>Representative example</span><span style={{ textAlign: 'left', fontWeight: 600 }}>{c.apr}</span></div>
      </div>
      <a className="tiny" href={c.source} target="_blank" rel="noreferrer" style={{ color: 'var(--soft)', minHeight: 44, display: 'flex', alignItems: 'center' }}>Terms as published by Barclaycard, 28 Sep 2026</a>
    </div>
    <div className="space-tabs" />
    {face}
  </div>
}

export function Lost() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const [why, setWhy] = useState(''); const [face, run] = useFaceId()
  const reasons = [['lost', 'It’s lost', 'We’ll block it for good'], ['stolen', 'It’s been stolen', 'We’ll block it and check recent payments with you'], ['damaged', 'It’s damaged', 'Your card keeps working until the new one arrives']]
  return <Page title="Lost, stolen or damaged" ask={false} cta={<button className="btn big danger" disabled={!why} onClick={() => run(why === 'damaged' ? 'Order a new card' : 'Block card and order a new one', () => { d({ type: 'lost', reason: why, last4: '7390' }); nav.pop(); nav.toast(why === 'damaged' ? 'New card ordered. It arrives by Wed 7 Oct.' : 'Card blocked. Your new card arrives by Wed 7 Oct. Its details show in the app within 24 hours.') })}>{why === 'damaged' ? 'Order a new card' : 'Block card and send a new one'}</button>}>
    <h1 className="h1">What’s happened?</h1>
    {!a.cs.frozen && why !== 'damaged' && <div className="note blue"><Ic n="snow" s={18} c="#1269AE" /><div style={{ flex: 1 }}>Not sure yet? Freeze it instead. You can unfreeze it if it turns up.</div><button className="btn sm light" onClick={() => { d({ type: 'freeze', on: true }); nav.pop(); nav.toast('Card frozen. Unfreeze it when it turns up.') }}>Freeze</button></div>}
    {reasons.map(([id, t, s]) => <button key={id} className={'opt' + (why === id ? ' on' : '')} onClick={() => setWhy(id)} aria-pressed={why === id}><span className="radio" /><div><p style={{ fontWeight: 600 }}>{t}</p><p className="small">{s}</p></div></button>)}
    <div className="list">
      <div className="kv"><span>New card arrives</span><span>By Wed 7 Oct</span></div>
      <div className="kv"><span>Sent to</span><span>{MEMBER.address}</span></div>
      <div className="kv"><span>Your PIN</span><span>Stays the same</span></div>
    </div>
    <p className="small">Update your card details anywhere you pay regularly by card, such as subscriptions.</p>
    {face}
  </Page>
}

export function Cardholders() {
  const nav = useNav(); const a = useAcct(); const biz = a.c.business
  return <Page title={biz ? 'Employee cards' : 'Additional cardholders'} cta={<button className="btn big" disabled={!biz && a.cs.cardholders.length >= 4} onClick={() => nav.push('addCardholder')}><Ic n="plus" s={18} c="#fff" />{biz ? 'Add an employee card' : 'Add a cardholder'}</button>}>
    {a.cs.cardholders.length === 0 ? <p className="sub">No one else is on this account. Anyone you add gets their own card, and their spending shows on your statement.</p> :
      <div className="list">{a.cs.cardholders.map(h => { const e = biz ? a.prog.employees?.find((x: any) => x.last4 === h.last4) : null; return <div key={h.last4} className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div className="ic"><Ic n="user" s={18} /></div><div style={{ flex: 1 }}><p className="t">{h.name}</p><p className="s">{h.rel} · card ending {h.last4}{h.limit ? ` · limit ${gbp(h.limit, 0)}` : ''}</p></div></div>
        {e && <><div className="bar"><div style={{ width: `${(e.spent / e.limit) * 100}%` }} /></div><p className="tiny">{gbp(e.spent)} spent this month</p></>}
      </div> })}</div>}
    {a.c.business ? <p className="small">Employee cards are free. You set each limit, and can freeze a card or block types of spending in MyControls.</p> : <p className="small">Up to four cardholders, free. They must be over 18, close family and live at your address.</p>}
  </Page>
}

export function AddCardholder() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const biz = a.c.business
  const [name, setName] = useState(''); const [rel, setRel] = useState(biz ? 'Employee' : 'Partner'); const [lim, setLim] = useState('1000')
  const [face, run] = useFaceId()
  const ok = name.trim().split(' ').length >= 2
  return <Page title={biz ? 'Add an employee card' : 'Add a cardholder'} ask={false} cta={<button className="btn big" disabled={!ok} onClick={() => run('Add cardholder', () => { d({ type: 'cardholder', name: name.trim(), rel, last4: String(3000 + (name.length * 97) % 7000), limit: biz ? parseInt(lim) || 1000 : undefined }); nav.pop(); nav.toast(`${name.trim().split(' ')[0]}’s card is on its way.`) })}>Add {name.trim().split(' ')[0] || 'cardholder'}</button>}>
    <div className="field"><label htmlFor="nm">Full name</label><input id="nm" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" autoComplete="off" /></div>
    {!biz && <div className="chips">{['Partner', 'Family'].map(r => <button key={r} className={'chip' + (rel === r ? ' on' : '')} aria-pressed={rel === r} onClick={() => setRel(r)}>{r}</button>)}</div>}
    {biz && <div className="field"><label htmlFor="lm">Monthly spending limit</label><div style={{ display: 'flex', gap: 4, alignItems: 'center' }}><b>£</b><input id="lm" inputMode="numeric" value={lim} onChange={e => setLim(e.target.value.replace(/\D/g, ''))} /></div></div>}
    <p className="small">{biz ? 'You set their limit and can freeze their card at any time.' : 'Their spending shows on your statement, and you’re responsible for paying it.'}</p>
    {face}
  </Page>
}

