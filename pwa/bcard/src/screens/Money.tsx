import React, { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useStore, useNav, useAcct, planFor, FEES } from '../store'
import { gbp, DUE, r2, dayLabel } from '../data'
import { Ic, Page, Row, Sheet, Spark, Toggle, useFaceId, Sec, GTag } from '../ui'
import { voucher, aviosWelcome, btPlan, planTopUp } from '../engine'

const BANK = 'Current account ending 6612'
const EXCLUDE = ['Payment', 'Card fees', 'Transfers', 'Refund', 'Cashback']
export const money = (v: string) => { const n = parseFloat(v.replace(/[£,\s]/g, '')); return isFinite(n) ? r2(n) : 0 }

export function Opt({ on, onClick, t, s, r }: { on: boolean; onClick: () => void; t: string; s?: string; r?: string }) {
  return <button className={'opt' + (on ? ' on' : '')} onClick={onClick} aria-pressed={on}><span className="radio" /><div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{t}</p>{s && <p className="small">{s}</p>}</div>{r && <b className="num">{r}</b>}</button>
}
export function AmountField({ label, value, onChange, auto }: { label: string; value: string; onChange: (v: string) => void; auto?: boolean }) {
  return <div className="field"><label htmlFor="amt">{label}</label><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ fontSize: 17, fontWeight: 700 }}>£</span><input id="amt" inputMode="decimal" value={value} onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))} autoFocus={auto} placeholder="0.00" /></div></div>
}

export function Pay({ plan }: { plan?: boolean }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const bt = a.c.id === 'platinum' ? btPlan(a) : null
  const opts = [
    ...(bt && planTopUp(a) > 0 ? [{ id: 'plan', t: a.cs.dd?.type === 'fixed' ? 'Top up for your 0% plan' : 'Your 0% plan', s: a.cs.dd?.type === 'fixed' ? `With your ${gbp(a.cs.dd.amount || 0, 0)} Direct Debit, this clears new spending and ${gbp(bt.monthly, 0)} of the transfer` : `New spending plus ${gbp(bt.monthly, 0)} towards the transfer`, v: planTopUp(a) }] : []),
    ...(a.minLeft > 0 && !a.c.charge ? [{ id: 'min', t: 'Minimum payment', s: `Due ${DUE}`, v: a.minLeft }] : []),
    ...(a.stmtLeft > 0 ? [{ id: 'stmt', t: 'Statement balance', s: a.c.charge ? `Due in full ${DUE}` : 'Pay this and you won’t pay interest on purchases', v: a.stmtLeft }] : []),
    { id: 'full', t: 'Full balance', s: 'Everything on the card today', v: a.balance },
  ]
  const [sel, setSel] = useState(bt && opts[0].id === 'plan' ? 'plan' : (opts.find(o => o.id === 'stmt') || opts[0]).id); const [other, setOther] = useState('')
  const amount = sel === 'other' ? money(other) : (opts.find(o => o.id === sel)?.v ?? 0)
  const ok = amount > 0 && amount <= a.balance
  const [face, run] = useFaceId()
  return <Page title="Make a payment" ask={false} cta={<button className="btn big" disabled={!ok} onClick={() => run(`Pay ${gbp(amount)}`, () => { d({ type: 'pay', amount }); nav.pop(); nav.toast(`Payment of ${gbp(amount)} sent.`) })}>{ok ? `Pay ${gbp(amount)}` : 'Choose an amount'}</button>}>
    <h1 className="h1">How much?</h1>
    {opts.map(o => <Opt key={o.id} on={sel === o.id} onClick={() => setSel(o.id)} t={o.t} s={o.s} r={gbp(o.v)} />)}
    <Opt on={sel === 'other'} onClick={() => setSel('other')} t="Another amount" />
    {sel === 'other' && <AmountField label="Amount" value={other} onChange={setOther} auto />}
    {sel === 'other' && money(other) > a.balance && <p className="small" style={{ color: 'var(--danger)' }}>That’s more than your balance of {gbp(a.balance)}.</p>}
    <div className="list"><Row ic="bank" t="From" s={BANK} chev={false} /></div>
    {face}
  </Page>
}

export function DirectDebit({ fixed }: { fixed?: number }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const cur = a.cs.dd
  const [sel, setSel] = useState<string>(fixed ? 'fixed' : cur?.type || 'full'); const [amt, setAmt] = useState(String(fixed || cur?.amount || ''))
  const [face, run] = useFaceId()
  const val = sel === 'fixed' ? money(amt) : 0
  const ok = sel !== 'fixed' || val >= 5
  const label = sel === 'full' ? 'your statement balance' : sel === 'min' ? 'the minimum' : gbp(val) + ' a month'
  return <Page title="Direct Debit" ask={false} cta={<>
    <button className="btn big" disabled={!ok} onClick={() => run('Set up Direct Debit', () => { d({ type: 'dd', value: sel === 'fixed' ? { type: 'fixed', amount: val } : { type: sel } }); nav.pop(); nav.toast(`Direct Debit set. It will pay ${label} on your due date each month.`) })}>{cur ? 'Update Direct Debit' : 'Set up Direct Debit'}</button>
    {cur && <button className="btn big light" onClick={() => { d({ type: 'dd', value: null }); nav.pop(); nav.toast('Direct Debit cancelled. Remember to pay by the due date.', { type: 'dd', value: cur }) }}>Cancel Direct Debit</button>}
  </>}>
    <h1 className="h1">{cur ? 'Change your Direct Debit' : 'Pay automatically each month'}</h1>
    <p className="sub">It goes out on your due date each month, from {BANK.toLowerCase()}.</p>
    <Opt on={sel === 'full'} onClick={() => setSel('full')} t="Statement balance" s="No interest on purchases" />
    {a.c.charge && <p className="note"><Ic n="info" s={18} />This is a charge card, so the Direct Debit pays the full statement balance.</p>}
    {!a.c.charge && <Opt on={sel === 'min'} onClick={() => setSel('min')} t="Minimum payment" s="Interest applies to what’s left" />}
    {!a.c.charge && <Opt on={sel === 'fixed'} onClick={() => setSel('fixed')} t="A fixed amount" s="If the minimum is higher, we take the minimum" />}
    {sel === 'fixed' && <AmountField label="Amount each month" value={amt} onChange={setAmt} auto={!fixed} />}
    {fixed && sel === 'fixed' && <p className="note g"><Spark s={18} />Gratifi suggested {gbp(fixed, 0)} a month.</p>}
    {face}
  </Page>
}

export function Limit() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  const cap = c.id === 'forward' ? 1200 : a.limit + 5000
  const step = c.id === 'forward' ? 50 : 500
  const floor = Math.max(step, Math.ceil(a.balance / step) * step)
  const [to, setTo] = useState(Math.min(cap, a.limit + step))
  const [offer, setOffer] = useState<number | null>(null)
  const [face, run] = useFaceId()
  const decide = () => {
    if (to <= a.limit) { d({ type: 'limit', to }); nav.pop(); nav.toast(`Done. Your limit is now ${gbp(to, 0)}.`); return }
    const ceiling = c.id === 'forward' ? 1200 : Math.floor(a.limit * 1.3 / 500) * 500
    if (to <= ceiling) { d({ type: 'limit', to }); nav.pop(); nav.toast(`Approved. Your new limit of ${gbp(to, 0)} is ready to use.`) }
    else setOffer(ceiling > a.limit ? ceiling : null)
  }
  return <Page title="Credit limit" ask={false} cta={<button className="btn big" disabled={to === a.limit} onClick={() => run(`Request ${gbp(to, 0)}`, decide)}>{to < a.limit ? `Lower to ${gbp(to, 0)}` : `Ask for ${gbp(to, 0)}`}</button>}>
    <h1 className="h1">Change your limit</h1>
    <p className="sub">Your limit is {gbp(a.limit, 0)}. Ask for a new one and get a decision now.</p>
    <div className="cardp" style={{ alignItems: 'center', gap: 16, padding: 22 }}>
      <p className="small">New limit</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button className="rbtn" aria-label="Lower" disabled={to <= floor} onClick={() => setTo(Math.max(floor, to - step))}><Ic n="down" /></button>
        <p style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1, minWidth: 150, textAlign: 'center' }} className="num" aria-live="polite">{gbp(to, 0)}</p>
        <button className="rbtn" aria-label="Raise" disabled={to >= cap} onClick={() => setTo(Math.min(cap, to + step))}><Ic n="up" /></button>
      </div>
      {c.id === 'forward' && <p className="tiny">Forward limits go up to £1,200.</p>}
      {to <= floor && <p className="tiny">Your limit can’t go below your balance.</p>}
    </div>
    <p className="small">Your minimum payment is worked out from your balance, not your limit, so a higher limit won’t raise it.</p>
    {!c.business && <><p className="label">When we can offer you more</p>
      {([['auto', 'Increase it automatically', 'We’ll tell you first'], ['ask', 'Ask me each time', 'You decide in the app'], ['none', 'Don’t offer increases', 'You can still ask yourself']] as const).map(([k, t, sub]) => <Opt key={k} on={(a.cs.limitPref || 'ask') === k} onClick={() => { d({ type: 'set', key: 'limitPref', value: k }); nav.toast('Saved.') }} t={t} s={sub} />)}
      <p className="tiny">After a change, wait 4 months after an increase, 6 months after a decrease, or a month after a refusal before asking again.</p></>}
    <AnimatePresence>{offer !== null && <Sheet label="Limit decision" onClose={() => setOffer(null)}>
      <h2 className="h2">{offer ? `We can offer ${gbp(offer, 0)}` : 'We can’t raise your limit today'}</h2>
      <p className="sub">{offer ? `We can’t go to ${gbp(to, 0)} right now, but ${gbp(offer, 0)} is ready if you want it.` : 'You can ask again in a month. Paying on time helps.'}</p>
      {offer ? <button className="btn big" onClick={() => { d({ type: 'limit', to: offer }); setOffer(null); nav.pop(); nav.toast(`Your new limit of ${gbp(offer, 0)} is ready to use.`) }}>Take {gbp(offer, 0)}</button> : null}
      <button className="btn big light" onClick={() => setOffer(null)}>{offer ? 'No thanks' : 'OK'}</button>
    </Sheet>}</AnimatePresence>
    {face}
  </Page>
}

export function Transfer() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  const [kind, setKind] = useState<'balance' | 'money'>('balance')
  const [from, setFrom] = useState('Another bank card'); const [amt, setAmt] = useState('')
  const [face, run] = useFaceId()
  const offer = kind === 'balance' ? { months: c.id === 'platinum' ? 12 : 9, fee: 0.0345 } : { months: 12, fee: 0.029 }
  const v = money(amt); const fee = r2(v * offer.fee)
  // Up to 90% of available credit, from £100, and not from another Barclaycard.
  const max = Math.floor(a.available * 0.9)
  const fromBarclays = kind === 'balance' && /barclay/i.test(from)
  const ok = v >= 100 && v + fee <= max && !c.business && !fromBarclays
  const bt = c.id === 'platinum' ? btPlan(a) : null
  return <Page title="Transfers" ask={false} cta={c.business ? undefined : <button className="btn big" disabled={!ok} onClick={() => run(`Transfer ${gbp(v)}`, () => { d({ type: 'transfer', kind, amount: v, fee, from, note: `0% for ${offer.months} months` }); nav.pop(); nav.toast(kind === 'balance' ? 'Balance transfer requested.' : `Money transfer of ${gbp(v)} requested.`) })}>{ok ? `Transfer ${gbp(v)}` : 'Enter an amount'}</button>}>
    {bt && <div className="cardp">
      <GTag text="Gratifi plan" />
      <p style={{ fontSize: 17, fontWeight: 700 }}>{gbp(bt.left)} at 0% until {bt.until}</p>
      <p className="small">Pay your new spending plus {gbp(bt.monthly, 0)} each month, October to March. Payments clear purchases first, so the {gbp(bt.monthly, 0)} is what clears the transfer. Anything left after Sun 14 Mar moves to the standard rate.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>{['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => <div key={m} style={{ textAlign: 'center' }}><div style={{ height: 36, borderRadius: 10, background: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>£{bt.monthly}</div><p className="tiny" style={{ marginTop: 4 }}>{m}</p></div>)}</div>
      <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push('pay', { plan: true })}>Make this month’s payment</button>
    </div>}
    {c.business ? <p className="sub">Transfers aren’t part of this demo for business cards.</p> : <>
      <div className="seg" role="tablist"><button role="tab" aria-selected={kind === 'balance'} className={kind === 'balance' ? 'on' : ''} onClick={() => setKind('balance')}>Balance transfer</button><button role="tab" aria-selected={kind === 'money'} className={kind === 'money' ? 'on' : ''} onClick={() => setKind('money')}>Money transfer</button></div>
      <div className="note blue"><Ic n="info" s={18} c="#1269AE" /><div><b>Your offer:</b> 0% for {offer.months} months, {Number((offer.fee * 100).toFixed(2))}% fee. {kind === 'balance' ? 'Move a balance from another card.' : 'Send money from your card to your bank account.'} <span className="tiny">Demo offer.</span></div></div>
      {kind === 'balance' ? <div className="field"><label htmlFor="from">From which card</label><input id="from" value={from} onChange={e => setFrom(e.target.value)} /></div> : <div className="list"><Row ic="bank" t="To" s={BANK} chev={false} /></div>}
      <AmountField label="Amount" value={amt} onChange={setAmt} />
      {v > 0 && <div className="list">
        <div className="kv"><span>Fee</span><span className="num">{gbp(fee)}</span></div>
        <div className="kv"><span>Added to your balance</span><span className="num">{gbp(v + fee)}</span></div>
        <div className="kv"><span>You can transfer up to</span><span className="num">{gbp(max, 0)}</span></div>
      </div>}
      {v > 0 && v < 100 && <p className="small">The smallest transfer is £100.</p>}
      {v + fee > max && <p className="small" style={{ color: 'var(--danger)' }}>That’s more than your available credit allows.</p>}
      {fromBarclays && <p className="small" style={{ color: 'var(--danger)' }}>You can’t move a balance from another Barclaycard or Barclays card.</p>}
      <p className="tiny">Make the transfer within 60 days to get the offer rate. Promotional rates end early if you pay late or go over your limit.{c.reward === 'avios' ? ' Head for Points reports that transfers now earn Avios on this card.' : ''}</p>
    </>}
    {face}
  </Page>
}

export function Spread({ id }: { id?: string }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const eligible = a.txns.filter(t => t.amount >= 100 && t.amount <= 5000 && !t.pending && !EXCLUDE.includes(t.cat) && !a.cs.plans.some(p => p.txnId === t.id))
  const [pick, setPick] = useState(id || ''); const [months, setMonths] = useState(6)
  const [face, run] = useFaceId()
  const t = a.txns.find(x => x.id === pick)
  if (a.c.business) return <Page title="Spread the cost"><p className="sub">Instalment Plans are shown for personal Barclaycards in this demo.</p></Page>
  if (!t) return <Page title="Spread the cost">
    <h1 className="h1">Pick a purchase</h1>
    <p className="sub">Purchases from £100 to £5,000 can go on an Instalment Plan: 0% interest, a one-off fee, 3 to 24 months. You can have up to 10.</p>
    {eligible.length ? <div className="list">{eligible.map(e => <Row key={e.id} ic="split" t={e.merchant} s={`${gbp(e.amount)} · ${dayLabel(e.date)}`} onClick={() => setPick(e.id)} />)}</div> : <p className="note">None of your recent purchases qualify yet.</p>}
    {a.cs.plans.length > 0 && <button className="btn light" onClick={() => nav.push('plans')}>Your plans ({a.cs.plans.length})</button>}
  </Page>
  const p = planFor(t.amount, months)
  return <Page title="Spread the cost" ask={false} cta={<button className="btn big" onClick={() => run(`Spread ${gbp(t.amount)}`, () => { d({ type: 'plan', txnId: t.id, merchant: t.merchant, amount: t.amount, months }); nav.replace('plans'); nav.toast(`Done. ${t.merchant} is now ${gbp(p.monthly)} a month for ${months} months.`) })}>Spread over {months} months</button>}>
    <h1 className="h1">{t.merchant}, {gbp(t.amount)}</h1>
    <p className="sub">0% interest. A one-off fee is added to the plan.</p>
    {[3, 6, 12, 24].map(m => { const q = planFor(t.amount, m); return <Opt key={m} on={months === m} onClick={() => setMonths(m)} t={`${m} months`} s={`Fee ${gbp(q.fee)}`} r={`${gbp(q.monthly)}/mo`} /> })}
    <div className="note g"><Spark s={18} /><div>From your next statement, your minimum payment goes up by {gbp(p.monthly)} a month while the plan runs. Total cost {gbp(t.amount + p.fee)}.</div></div>
    <p className="tiny">Fees as published: {Object.entries(FEES).map(([m, r]) => `${m} months ${Math.round(r * 100)}%`).join(', ')}. Up to 10 plans at once.</p>
    {face}
  </Page>
}

export function Plans() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  return <Page title="Instalment Plans" cta={<button className="btn big light" onClick={() => nav.push('spread')}><Ic n="plus" s={18} />Spread another purchase</button>}>
    {a.cs.plans.length === 0 ? <p className="sub">No plans yet. Spread a purchase of £100 or more and it shows here.</p> :
      <div className="list">{a.cs.plans.map(p => <div key={p.id} className="row">
        <div className="ic"><Ic n="split" s={18} /></div>
        <div style={{ flex: 1 }}><p className="t">{p.merchant}</p><p className="s">{gbp(p.monthly)} a month for {p.months} months · fee {gbp(p.fee)}</p></div>
        <button className="btn sm light" onClick={() => { d({ type: 'cancelPlan', id: p.id }); nav.toast('Plan cancelled. The amount is back on your balance.') }}>Cancel</button>
      </div>)}</div>}
    <p className="small">Plans are part of your credit limit. Each instalment is added to your minimum payment, starting with your next statement.</p>
  </Page>
}

export function PricePromise() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct(); const p = a.prog
  return <Page title="Price Promise">
    <h1 className="h1">{p.needed - p.onTime} due dates to a lower rate</h1>
    <div className="cardp">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.needed}, 1fr)`, gap: 5 }} role="img" aria-label={`${p.onTime} of ${p.needed} due dates paid on time`}>
        {Array.from({ length: p.needed }, (_, i) => <div key={i} style={{ height: 28, borderRadius: 8, background: i < p.onTime ? 'var(--good)' : 'var(--ground-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i < p.onTime && <Ic n="tick" s={13} c="#fff" w={3} />}</div>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="tiny" aria-hidden="true"><span>May</span><span>Feb</span></div>
      <p className="small">{p.onTime} payments on time since your first due date in May. Pay at least the minimum by each due date until {p.anniversary} and stay within your limit.</p>
      <div className="kv"><span>Rate today</span><span>{p.from}%</span></div>
      <div className="kv"><span>From your March 2027 statement</span><span className="pos">{p.to}%</span></div>
      <div className="kv"><span>After year two</span><span className="pos">{(p.to - 2).toFixed(1)}%</span></div>
    </div>
    <Sec title="Stay on track" tag={<GTag text="Gratifi" />} />
    <div className="list">
      <div className="row"><div className="ic"><Ic n="bell" s={18} /></div><div style={{ flex: 1 }}><p className="t">Remind me 3 days before</p><p className="s">By text and in the app</p></div><Toggle on={s.alerts.due} onChange={() => d({ type: 'alert', id: 'due' })} label="Payment reminders" /></div>
      <Row ic="refresh" t={a.cs.dd ? 'Direct Debit is on' : 'Set up a Direct Debit'} s={a.cs.dd ? 'Your payments go out automatically' : 'So you never miss a payment'} onClick={() => nav.push('dd')} />
      <Row ic="chart" t="Your credit score" s="Paying on time helps it too" onClick={() => nav.push('score')} />
    </div>
  </Page>
}

export function Score() {
  const a = useAcct(); const fw = a.c.id === 'forward'
  const pts = fw ? [649, 662, 681, 698, 716, 735] : [861, 866, 872, 870, 879, 884]
  const lo = Math.min(...pts) - 10, hi = Math.max(...pts) + 10
  return <Page title="Credit score">
    <div className="cardp" style={{ alignItems: 'center', padding: 22 }}>
      <p className="small">Experian score</p>
      <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }} className="num">{pts[5]}</p>
      <p style={{ fontWeight: 700, color: 'var(--good)' }}>{fw ? 'Fair · up 86 since April' : 'Good · out of 999'}</p>
      <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none" role="img" aria-label="Score over the last six months, rising">
        <polyline fill="none" stroke="#0B2A4A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={pts.map((v, i) => `${10 + i * 56},${70 - (v - lo) / (hi - lo) * 60}`).join(' ')} />
        {pts.map((v, i) => <circle key={i} cx={10 + i * 56} cy={70 - (v - lo) / (hi - lo) * 60} r="4" fill="#0B2A4A" />)}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} className="tiny">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map(m => <span key={m}>{m}</span>)}</div>
    </div>
    <div className="list">
      <div className="kv"><span>Payments on time</span><span className="pos">All</span></div>
      <div className="kv"><span>Credit used</span><span>{Math.round(a.used * 100)}%</span></div>
      <div className="kv"><span>Recent applications</span><span>{fw ? '1' : 'None'}</span></div>
    </div>
    <p className="tiny">Demo figures. In the live app this comes from Experian.</p>
  </Page>
}

export function Cashback() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const v = a.cashback
  return <Page title="Cashback" ask={false} cta={v > 0 ? <button className="btn big" onClick={() => { d({ type: 'takeCashback', amount: v }); nav.pop(); nav.toast(`${gbp(v)} cashback will come off your balance.`) }}>Take {gbp(v)} now</button> : undefined}>
    <div className="cardp" style={{ alignItems: 'center', padding: 24 }}>
      <p className="small">Cashback this year</p>
      <p style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1.5 }} className="num">{gbp(v)}</p>
      <p className="small" style={{ textAlign: 'center' }}>0.25% on your everyday spending. Paid to your statement once a year, or now if you ask.</p>
    </div>
    {v === 0 && <p className="note green"><Ic n="tick" s={18} c="#11774A" />You’ve taken this year’s cashback. New cashback builds up from today.</p>}
    <p className="small">Cashback isn’t earned on balance transfers, money transfers, cash withdrawals or buying currency.</p>
  </Page>
}

export function Welcome() {
  const nav = useNav(); const a = useAcct(); const w = aviosWelcome(a)
  return <Page title="Welcome bonus">
    <h1 className="h1">{w.left > 0 ? `${gbp(w.left, 0)} to 5,000 Avios` : '5,000 Avios on the way'}</h1>
    <div className="cardp">
      <div className="bar orange"><div style={{ width: `${Math.min(1, w.spent / w.target) * 100}%` }} /></div>
      <p className="small">{gbp(w.spent, 0)} of £1,000 spent · deadline {w.by}</p>
    </div>
    {w.left > 0 && <><Sec title="Ways to get there" tag={<GTag text="Gratifi" />} />
      <div className="list">
        <Row ic="plane" t="Book your Lisbon hotel on this card" s="From £258 for two nights, with extra Avios from the partner" onClick={() => nav.push('browse', { cat: 'Hotels' })} />
        <Row ic="gift" t="Add offers before you shop" s="Money back on top of your Avios" onClick={() => nav.push('offers')} />
      </div></>}
  </Page>
}

export function Voucher() {
  const nav = useNav(); const a = useAcct(); const v = voucher(a); const plus = a.c.id === 'avios-plus'
  return <Page title="Upgrade voucher">
    <h1 className="h1">{v.left > 0 ? `${gbp(v.left, 0)} to your voucher` : 'You’ve earned your voucher'}</h1>
    <div className="cardp">
      <div className="bar orange"><div style={{ width: `${Math.min(1, v.spent / v.at) * 100}%` }} /></div>
      <p className="small">{gbp(v.spent, 0)} of {gbp(v.at, 0)} this card year · ends {v.by}</p>
      {v.pace && v.left > 0 && <p className="small">At your usual pace of about {gbp(Math.round(a.prog.yearSpend / a.prog.monthsIn), 0)} a month, you’ll get there in {v.pace}.</p>}
    </div>
    <div className="list">
      <Row ic="plane" t="Cabin upgrade voucher" s="Book an Avios reward flight and fly one cabin up: one person return or one way, or two people one way" chev={false} />
      <Row ic="gift" t="Or 7,000 Avios" s="If you’d rather have the Avios" chev={false} />
    </div>
    {v.left > 0 && <><Sec title="Ways to get there" tag={<GTag text="Gratifi" />} />
      <div className="list">
        <Row ic="plane" t="Put your Lisbon hotel on this card" s="From £258, with extra Avios from the partner" onClick={() => nav.push('browse', { cat: 'Hotels' })} />
        <Row ic="gift" t="Add offers before you shop" s="Money back, and the spend still counts" onClick={() => nav.push('offers')} />
      </div></>}
  </Page>
}
