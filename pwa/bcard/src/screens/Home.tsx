import React from 'react'
import { motion } from 'motion/react'
import { useStore, useNav, useAcct, fmtInt } from '../store'
import { MEMBER, TODAY, DUE, gbp, CONTENT, NEXT_STATEMENT, dayLabel } from '../data'
import { CardArt, Ic, Spark, Sticky, Sec, Row, Money, GTag, RBtn, Mono } from '../ui'
import { moment, Action, voucher, aviosWelcome, btPlan, scMonth } from '../engine'
import { benefitsFor } from '../benefits'
import { bonusText } from './Rewards'

export function useRun() {
  const nav = useNav(); const { d } = useStore()
  return (a: Action) => { if (a.dispatch) d(a.dispatch); if (a.tab) nav.tab(a.tab); if (a.push) nav.push(a.push, a.params); if (a.ask) nav.push('ask', { q: a.ask }) }
}

export function TxnRow({ t, onClick, earn }: { t: any; onClick: () => void; earn?: string | null }) {
  const credit = t.amount < 0
  return <button className="row" onClick={onClick}>
    <Mono name={t.merchant} tone={t.by === 'gratifi' ? '#FFF1E8' : credit ? '#E6F4EC' : '#E7F1FA'} ink={t.by === 'gratifi' ? '#C2410C' : credit ? '#11774A' : '#0B2A4A'} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p className="t" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</p>
      <p className="s">{t.pending ? 'Pending · ' : ''}{t.cat}{t.by === 'gratifi' ? ' · booked with Gratifi' : ''}</p>
    </div>
    <div style={{ textAlign: 'right' }}>
      <p className={'r num' + (credit ? ' pos' : '')}>{credit ? '+' + gbp(-t.amount) : gbp(t.amount)}</p>
      {earn && <p className="tiny" style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>{earn}</p>}
    </div>
  </button>
}

export function Home() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct(); const run = useRun()
  const { c, cs } = a
  const m = moment(a)
  const unread = !s.readNotifs[c.id]
  const forYou = CONTENT.filter(i => !!i.biz === !!c.business).slice(0, 4)
  return <div className="scroll">
    <div className="pad">
      <div className="hdr">
        <div className="brand"><b>Barclaycard</b><span className="concept">CONCEPT</span></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <RBtn n="bell" label={unread ? 'Notifications, new' : 'Notifications'} dot={unread} onClick={() => nav.push('notifications')} />
          <button className="avatar" aria-label="Your profile" onClick={() => nav.push('profile')}>ST</button>
        </div>
      </div>
      <div>
        <p className="small">{TODAY}</p>
        <h1 className="h1" style={{ marginTop: 4 }}>Good morning, {MEMBER.first}</h1>
        {c.business && <p className="small" style={{ marginTop: 4 }}>{MEMBER.company}</p>}
      </div>

      {cs.frozen && <div className="note blue" role="status"><Ic n="snow" s={18} c="#1269AE" /><div style={{ flex: 1 }}><b>Your card is frozen.</b> Payments are blocked until you unfreeze it.</div><button className="btn sm" onClick={() => { d({ type: 'freeze', on: false }); nav.toast('Card unfrozen. You can pay again.') }}>Unfreeze</button></div>}
      {cs.newCard && !cs.newCard.activated && <div className="note blue"><Ic n="card" s={18} c="#1269AE" /><div style={{ flex: 1 }}>Your new card ending {cs.newCard.last4} arrives by {cs.newCard.arrives}. Use its details online now.</div><button className="btn sm" onClick={() => nav.tab('card')}>View</button></div>}

      <button className="cardp" style={{ textAlign: 'left', gap: 14 }} onClick={() => nav.tab('card')} aria-label={`${c.name} ending ${a.cardLast4}, balance ${gbp(a.balance)}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CardArt c={c} width={58} last4={a.cardLast4} small frozen={cs.frozen} />
          <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</p><p className="small">Ending {a.cardLast4}{cs.frozen ? ' · Frozen' : ''}</p></div>
          <Ic n="chev" s={16} c="#8A94A3" />
        </div>
        <div><p className="small">Balance</p><Money v={a.balance} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="bar"><div style={{ width: `${a.used * 100}%` }} /></div>
          <p className="small"><b style={{ color: 'var(--ink)' }}>{gbp(a.available)}</b> available of {gbp(a.limit, 0)}</p>
        </div>
      </button>

      <div className="cardp" style={{ gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            {c.charge && a.stmtLeft > 0 ? <><p style={{ fontSize: 15, fontWeight: 700 }}>{gbp(a.stmtLeft)} due {DUE}</p><p className="small">Paid in full each month{cs.dd ? ' · by Direct Debit' : ''}</p></>
              : cs.dd?.type === 'full' && a.stmtLeft > 0 ? <><p style={{ fontSize: 15, fontWeight: 700 }}>{gbp(a.stmtLeft)} due {DUE}</p><p className="small">Minimum {gbp(a.minLeft)} · paid in full by Direct Debit</p></>
              : a.minLeft > 0 ? <><p style={{ fontSize: 15, fontWeight: 700 }}>{gbp(a.minLeft)} minimum due {DUE}</p><p className="small">Statement balance {gbp(a.stmtLeft)}</p></>
              : <><p style={{ fontSize: 15, fontWeight: 700 }}>{a.stmtLeft > 0 ? 'Minimum paid' : 'Statement paid'}</p><p className="small">{a.stmtLeft > 0 ? `${gbp(a.stmtLeft)} left on your statement` : 'Nothing more to pay this month'}</p></>}
          </div>
          <button className="btn sm" onClick={() => nav.push('pay')}>Pay</button>
        </div>
        <button className="small" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, minHeight: 44 }} onClick={() => nav.push('dd')}>
          <Ic n={cs.dd ? 'tick' : 'info'} s={14} c={cs.dd ? '#11774A' : '#556070'} w={2.6} />
          {cs.dd ? `Direct Debit pays ${cs.dd.type === 'full' ? 'your statement balance' : cs.dd.type === 'min' ? 'the minimum' : gbp(cs.dd.amount || 0) + ' a month'}` : 'No Direct Debit. Set one up'}
          <Ic n="chev" s={13} c="#8A94A3" />
        </button>
      </div>

      {s.suggest === null && <Sticky title="Meet Gratifi">
        <p style={{ fontSize: 15, lineHeight: 1.45 }}>Your card now has an assistant. Gratifi flags what’s worth knowing on your account, answers questions about it, and books things only when you say yes.</p>
        <p style={{ fontSize: 13, lineHeight: 1.4, color: '#5A4A1A' }}>To do that it looks at your card spending. You can turn this off in More at any time.</p>
        <div style={{ display: 'flex', gap: 8 }}><button className="btn black sm" onClick={() => d({ type: 'suggest', on: true })}>Turn on</button><button className="btn light sm" onClick={() => d({ type: 'suggest', on: false })}>Not now</button></div>
      </Sticky>}
      {s.suggest && m && !(cs.dismissed || {})[m.id] && <Sticky title={m.title}>
        <p style={{ fontSize: 15, lineHeight: 1.45 }}>{m.body}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {m.actions.map((x, i) => <button key={x.label} className={'btn sm ' + (i === 0 ? 'black' : 'light')} onClick={() => run(x)}>{x.label}</button>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: -8 }}>
          <p className="tiny" style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#5A4A1A' }}><Spark s={13} />From Gratifi</p>
          <button className="link" style={{ color: '#5A4A1A' }} onClick={() => d({ type: 'dismiss', id: m.id })}>Not now</button>
        </div>
      </Sticky>}

      <div className="qa">
        <button onClick={() => nav.push('pay')}><span className="qi"><Ic n="pound" /></span>Pay</button>
        <button className={cs.frozen ? 'on' : ''} onClick={() => { d({ type: 'freeze', on: !cs.frozen }); nav.toast(cs.frozen ? 'Card unfrozen. You can pay again.' : 'Card frozen. Payments are blocked until you unfreeze it.') }} aria-pressed={cs.frozen}><span className="qi"><Ic n="snow" c={cs.frozen ? '#1269AE' : '#0E1A2B'} /></span>{cs.frozen ? 'Unfreeze' : 'Freeze'}</button>
        <button onClick={() => nav.tab('card')}><span className="qi"><Ic n="key" /></span>PIN</button>
        <button onClick={() => nav.push('statements')}><span className="qi"><Ic n="doc" /></span>Statements</button>
        {c.business ? <button onClick={() => nav.push('cardholders')}><span className="qi"><Ic n="users" /></span>Cards</button> : <button onClick={() => nav.push('spread')}><span className="qi"><Ic n="split" /></span>Spread</button>}
      </div>

      <RewardsSummary />
      <div className="list"><Row ic="grid" t="Everything with your card" s={`${benefitsFor(c.id).length} benefits, protections and services`} onClick={() => nav.push('benefits')} /></div>

      <Sec title="Coming up" />
      <div className="list">
        {a.minLeft > 0 && <Row ic="cal" t={`Payment due ${DUE}`} s={cs.dd ? 'Your Direct Debit will pay it' : c.charge ? `Pay ${gbp(a.minLeft)} in full` : `Minimum ${gbp(a.minLeft)}`} onClick={() => nav.push('pay')} />}
        <Row ic="doc" t={`Next statement ${NEXT_STATEMENT}`} s="We’ll let you know when it’s ready" onClick={() => nav.push('statements')} />
        {c.id === 'platinum' && <Row ic="refresh" t={`0% balance transfer ends ${a.prog.btUntil}`} s={`${gbp(btPlan(a).left)} left to clear`} onClick={() => nav.push('bt')} />}
        {c.id === 'amazon' && <Row ic="clock" t={`0% on purchases ends ${a.prog.zeroUntil}`} s="After that, interest is charged on anything left" onClick={() => nav.push('pay')} />}
        {c.id === 'avios' && <Row ic="gift" t={`Welcome bonus deadline ${aviosWelcome(a).by}`} s={`${gbp(aviosWelcome(a).left, 0)} to go for 5,000 Avios`} onClick={() => nav.push('welcome')} />}
        {c.id === 'avios-plus' && <Row ic="plane" t={`Card year ends ${a.prog.yearEnds}`} s={`${gbp(voucher(a).left, 0)} to your upgrade voucher`} onClick={() => nav.push('voucher')} />}
        {c.id === 'select-cashback' && <Row ic="wallet" t={`Cashback month ends ${scMonth(a).by}`} s={scMonth(a).left > 0 ? `${gbp(scMonth(a).left)} to £2,000 · about ${gbp(scMonth(a).earned)} so far` : `About ${gbp(scMonth(a).earned)} cashback this month`} onClick={() => nav.push('sccash')} />}
        {c.id === 'forward' && <Row ic="target" t={`Rate review ${a.prog.anniversary}`} s={`${a.prog.onTime} paid on time · ${a.prog.needed - a.prog.onTime} due dates to go`} onClick={() => nav.push('promise')} />}
        {!c.business && <Row ic="plane" t="Lisbon, Fri 16 Oct" s={cs.bookings.some(b => b.status === 'booked' && b.itemId.startsWith('h-')) ? 'Flight and hotel booked' : 'Flight booked · no hotel yet'} onClick={() => nav.push('browse', { cat: 'Hotels' })} />}
        {c.business && <Row ic="plane" t="Amsterdam, Tue 6 Oct" s="Flights booked on this card" onClick={() => nav.push('browse', { cat: 'Hotels' })} />}
      </div>

      <Sec title="Recent" link="See all" onLink={() => nav.tab('spend')} />
      <div className="list">{a.txns.slice(0, 5).map(t => <TxnRow key={t.id} t={t} earn={a.earnOn(t)} onClick={() => nav.push('txn', { id: t.id })} />)}</div>

      {s.suggest && <div className="gsec">
        <Sec title={c.business ? 'For your Amsterdam trip' : 'For your Lisbon weekend'} tag={<GTag />} link="See all" onLink={() => nav.tab('rewards')} />
        <div className="hscroll">{forYou.map(i => <button key={i.id} className="polaroid" onClick={() => nav.push('item', { id: i.id })}>
          <img src={i.img} alt="" style={{ objectPosition: i.pos || 'center' }} />
          <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{i.title}</p>
          <p className="tiny">{i.price ? gbp(i.price, 0) : 'Free to book'} · {bonusText(c, i)}</p>
        </button>)}</div>
      </div>}

      <p className="tiny" style={{ textAlign: 'center' }}>Concept by Reward360 for Barclays · demo data</p>
    </div>
    <div className="space-tabs" />
  </div>
}

export function RewardsSummary() {
  const nav = useNav(); const a = useAcct(); const { c } = a
  if (c.reward === 'avios') return <button className="cardp" style={{ textAlign: 'left', flexDirection: 'row', alignItems: 'center', gap: 14 }} onClick={() => nav.tab('rewards')}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="plane" s={24} c="#fff" /></div>
    <div style={{ flex: 1 }}><p className="small">Avios</p><p style={{ fontSize: 22, fontWeight: 800 }} className="num">{fmtInt(a.prog.aviosBalance)}</p><p className="tiny">{c.rateText} · in your British Airways account</p></div>
    <Ic n="chev" s={16} c="#8A94A3" /></button>
  if (c.reward === 'cashback' || c.reward === 'amazon' || c.reward === 'biz-cashback') {
    const v = c.reward === 'cashback' ? a.cashback : c.reward === 'amazon' ? a.prog.earned : a.prog.cashback
    return <button className="cardp" style={{ textAlign: 'left', flexDirection: 'row', alignItems: 'center', gap: 14 }} onClick={() => nav.tab('rewards')}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--good)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="pound" s={24} c="#fff" /></div>
      <div style={{ flex: 1 }}><p className="small">{c.reward === 'amazon' ? 'Rewards earned' : 'Cashback this year'}</p><p style={{ fontSize: 22, fontWeight: 800 }} className="num">{gbp(v)}</p><p className="tiny">{c.rateText}</p></div>
      <Ic n="chev" s={16} c="#8A94A3" /></button>
  }
  return <button className="cardp" style={{ textAlign: 'left', flexDirection: 'row', alignItems: 'center', gap: 14 }} onClick={() => nav.push('offers')}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spark s={26} /></div>
    <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{a.offersFor.length} offers for you</p><p className="small">Money back when you pay with this card</p></div>
    <Ic n="chev" s={16} c="#8A94A3" /></button>
}

export function Notifications() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  React.useEffect(() => { d({ type: 'readNotifs' }) }, [])
  const m = moment(a)
  const items = [
    ...(m ? [{ ic: 'sparkle', t: m.title, s: m.body, when: 'Today', g: true, go: () => m.actions[0].push ? nav.push(m.actions[0].push, m.actions[0].params) : m.actions[0].tab && nav.tab(m.actions[0].tab) }] : []),
    ...(a.minLeft > 0 || a.stmtLeft > 0 ? [{ ic: 'cal', t: `Payment due ${DUE}`, s: a.cs.dd ? 'Your Direct Debit will pay it.' : a.c.charge ? `Pay ${gbp(a.stmtLeft)} in full.` : `Your minimum is ${gbp(a.minLeft)}.`, when: 'Today', go: () => nav.push('pay') }] : []),
    { ic: 'doc', t: 'Your statement is ready', s: `Balance ${gbp(c.stmt)}. See what’s on it.`, when: 'Fri 18 Sep', go: () => nav.push('statement', { which: 0 }) },
    ...(c.business ? [] : [{ ic: 'plane', t: 'Flight booked to Lisbon', s: 'Northway Air, Fri 16 Oct. Gratifi noted the dates.', when: dayLabel('2026-09-19'), g: true, go: () => nav.push('browse', { cat: 'Hotels' }) }]),
  ]
  return <div className="screen"><div className="scroll"><div className="pad">
    <div className="hdr"><RBtn n="back" label="Back" onClick={nav.pop} /><p className="hdr-title" tabIndex={-1} data-autofocus>Notifications</p><RBtn n="settings" label="Alert settings" onClick={() => nav.push('alerts')} /></div>
    <div className="list">{items.map((x, i) => <button key={i} className="row" onClick={x.go} style={{ alignItems: 'flex-start' }}>
      <div className="ic" style={x.g ? { background: 'var(--accent-soft)' } : undefined}>{x.g ? <Spark s={18} /> : <Ic n={x.ic} s={18} />}</div>
      <div style={{ flex: 1 }}><p className="t">{x.t}</p><p className="s">{x.s}</p><p className="tiny" style={{ marginTop: 4 }}>{x.when}{x.g ? ' · Gratifi' : ''}</p></div>
    </button>)}</div>
  </div><div className="space-sm" /></div></div>
}
