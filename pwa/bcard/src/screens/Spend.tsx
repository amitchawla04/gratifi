import React, { useMemo, useState } from 'react'
import { useStore, useNav, useAcct } from '../store'
import { Toggle } from '../ui'
import { gbp, dayLabel, OLD_STATEMENTS, STATEMENT_ISO, DUE, statementsFor, r2 } from '../data'
import { Ic, Row, Page, Sheet, Mono, Sec } from '../ui'
import { TxnRow } from './Home'
import { AnimatePresence } from 'motion/react'

const CAT_TONE = ['#0B2A4A', '#1269AE', '#3B8FD0', '#6FB0E0', '#9CC8EA', '#B8C4D2']
const EXCLUDE = ['Payment', 'Card fees', 'Transfers', 'Refund', 'Cashback']

export function Spending() {
  const nav = useNav(); const a = useAcct()
  const [q, setQ] = useState(''); const [f, setF] = useState('All')
  const sept = a.txns.filter(t => t.date >= '2026-09-01' && t.amount > 0 && !EXCLUDE.includes(t.cat))
  const total = sept.reduce((x, t) => x + t.amount, 0)
  const cats = useMemo(() => {
    const m: Record<string, number> = {}; sept.forEach(t => { m[t.cat] = (m[t.cat] || 0) + t.amount })
    const all = Object.entries(m).sort((x, y) => y[1] - x[1])
    if (all.length <= 6) return all
    return [...all.slice(0, 5), ['Other', all.slice(5).reduce((x, y) => x + y[1], 0)] as [string, number]]
  }, [a.txns.length])
  const pct = (() => { const raw = cats.map(([, v]) => v / total * 100); const fl = raw.map(Math.floor); let left = 100 - fl.reduce((x, y) => x + y, 0); raw.map((r, i) => [r - fl[i], i] as [number, number]).sort((x, y) => y[0] - x[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left-- } }); return fl })()
  const list = a.txns.filter(t => (f === 'All' || (f === 'Pending' && t.pending) || (f === 'Payments' && t.amount < 0) || (f === 'Purchases' && t.amount > 0)) && (!q || (t.merchant + ' ' + t.cat).toLowerCase().includes(q.toLowerCase())))
  const groups: [string, typeof list][] = []
  list.forEach(t => { const g = groups.find(x => x[0] === t.date); if (g) g[1].push(t); else groups.push([t.date, [t]]) })
  return <div className="scroll">
    <div className="pad">
      <div className="hdr"><h1 className="h1" tabIndex={-1}>Spending</h1><button className="btn light sm" onClick={() => nav.push('statements')}><Ic n="doc" s={16} />Statements</button></div>
      <div className="cardp">
        <p className="small">September so far</p>
        <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }} className="num">{gbp(total)}</p>
        <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 }} aria-hidden="true">{cats.map(([k, v], i) => <div key={k} style={{ flex: v, background: CAT_TONE[Math.min(i, CAT_TONE.length - 1)] }} />)}</div>
        <div>{cats.map(([k, v], i) => <button key={k} className="kv" style={{ width: '100%', alignItems: 'center' }} onClick={() => setQ(k === 'Other' ? '' : k)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)' }}><span style={{ width: 10, height: 10, borderRadius: 5, background: CAT_TONE[Math.min(i, CAT_TONE.length - 1)] }} />{k}</span>
          <span className="num">{gbp(v)} <span style={{ fontWeight: 500, color: 'var(--soft)', fontSize: 13 }}>{pct[i]}%</span></span>
        </button>)}</div>
      </div>
      <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: '4px 14px' }}>
        <Ic n="search" s={18} c="#556070" />
        <input aria-label="Search payments" placeholder="Search payments" value={q} onChange={e => setQ(e.target.value)} style={{ height: 44 }} />
        {q && <button className="link" onClick={() => setQ('')}>Clear</button>}
      </div>
      <div className="chips">{['All', 'Purchases', 'Payments', 'Pending'].map(x => <button key={x} className={'chip' + (f === x ? ' on' : '')} aria-pressed={f === x} onClick={() => setF(x)}>{x}</button>)}</div>
      {groups.length === 0 && <p className="sub" style={{ textAlign: 'center', padding: 20 }}>{q ? `Nothing matches “${q}”.` : f === 'Payments' ? 'No payments to your card yet this month.' : 'Nothing here yet.'}</p>}
      {groups.length > 0 && <div className="list">{groups.map(([d, ts]) => <React.Fragment key={d}>
        <p className="label" style={{ padding: '14px 0 2px' }}>{dayLabel(d)}</p>
        {ts.map(t => <TxnRow key={t.id} t={t} earn={a.earnOn(t)} onClick={() => nav.push('txn', { id: t.id })} />)}
      </React.Fragment>)}</div>}
      <p className="tiny" style={{ textAlign: 'center' }}>Showing September. Earlier months are in your statements.</p>
    </div>
    <div className="space-tabs" />
  </div>
}

export function TxnDetail({ id, report }: { id: string; report?: boolean }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const t = a.txns.find(x => x.id === id)
  const [sheet, setSheet] = useState(!!report); const [reason, setReason] = useState('')
  if (!t) return <Page title="Payment"><p className="sub">This payment is no longer on your account.</p></Page>
  const plan = a.cs.plans.find(p => p.txnId === t.id)
  const claim = a.cs.disputes[t.id]
  const earn = a.earnOn(t)
  const eligible = !a.c.business && t.amount >= 100 && t.amount <= 5000 && !t.pending && !EXCLUDE.includes(t.cat) && !plan && a.cs.plans.length < 10
  return <Page title="Payment">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '6px 0 4px' }}>
      <div style={{ transform: 'scale(1.5)', margin: 10 }}><Mono name={t.merchant} tone={t.amount < 0 ? '#E6F4EC' : t.by === 'gratifi' ? '#FFF1E8' : '#E7F1FA'} ink={t.amount < 0 ? '#11774A' : t.by === 'gratifi' ? '#C2410C' : '#0B2A4A'} /></div>
      <h1 className="h2" style={{ textAlign: 'center' }}>{t.merchant}</h1>
      <p style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }} className={'num' + (t.amount < 0 ? ' pos' : '')}>{t.amount < 0 ? '+' + gbp(-t.amount) : gbp(t.amount)}</p>
      {earn && <p className="gtag" style={{ fontSize: 13 }}>{earn}</p>}
    </div>
    {claim && <div className="note blue"><Ic n="flag" s={18} c="#1269AE" /><div>Claim {claim} is open. We’ll message you here with next steps.</div></div>}
    {plan && <div className="note green"><Ic n="split" s={18} c="#11774A" /><div>On an Instalment Plan: {gbp(plan.monthly)} a month for {plan.months} months, 0% interest, {gbp(plan.fee)} fee.</div></div>}
    <div className="list">
      <div className="kv"><span>Status</span><span>{t.pending ? 'Pending' : 'Completed'}</span></div>
      <div className="kv"><span>Date</span><span>{dayLabel(t.date)}</span></div>
      <div className="kv"><span>Category</span><span>{t.cat}</span></div>
      <div className="kv"><span>Card</span><span>Ending {a.cardLast4}</span></div>
      {t.amount > 0 && !EXCLUDE.includes(t.cat) && <div className="kv"><span>Where</span><span>{t.by === 'gratifi' ? 'In the app, with Gratifi' : t.online ? 'Online' : 'In person, London'}</span></div>}
      {t.note && <div className="kv"><span>Details</span><span>{t.note}</span></div>}
    </div>
    <div className="list">
      {eligible && <Row ic="split" t="Spread the cost" s="0% interest over 3 to 24 months, one-off fee" onClick={() => nav.push('spread', { id: t.id })} />}
      {t.amount > 0 && !claim && <Row ic="flag" t="Report a problem" s="Don’t recognise it, wrong amount, not received" onClick={() => setSheet(true)} />}
      <Row ic="chat" t="Ask Gratifi about this" onClick={() => nav.push('ask', { q: `Tell me about the ${t.merchant} payment` })} />
    </div>
    <AnimatePresence>{sheet && <Sheet label="Report a problem" onClose={() => setSheet(false)}>
      <h2 className="h2">What’s wrong with this payment?</h2>
      {['I don’t recognise it', 'The amount is wrong', 'I was charged twice', 'I didn’t receive what I paid for'].map(r => <button key={r} className={'opt' + (reason === r ? ' on' : '')} onClick={() => setReason(r)} aria-pressed={reason === r}><span className="radio" />{r}</button>)}
      {reason === 'I don’t recognise it' && <p className="note red" style={{ fontSize: 13 }}>If you think someone else has your card details, freeze your card too. You can do it from Home.</p>}
      <button className="btn big" disabled={!reason} onClick={() => { const ref = 'DS-' + (48000 + Math.floor(t.amount * 7) % 1000); d({ type: 'dispute', txnId: t.id, ref }); setSheet(false); nav.toast(`Claim ${ref} opened. We’ll message you with next steps.`) }}>Report it</button>
    </Sheet>}</AnimatePresence>
  </Page>
}


export function Statements() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  return <Page title="Statements">
    <div className="list">
      <Row ic="doc" t="September 2026" s={`Fri 18 Sep · ${gbp(c.stmt)} · due ${DUE}`} onClick={() => nav.push('statement', { which: 0 })} />
      {statementsFor(c).map(o => <Row key={o.month} ic="doc" t={o.month} s={`${o.date} · ${gbp(o.bal)} · paid`} onClick={() => nav.push('statement', { which: OLD_STATEMENTS.findIndex(x => x.iso === o.iso) + 1 })} />)}
    </div>
    {statementsFor(c).length === 0 && <p className="small">This is your first statement. Your card opened on {dayLabel(c.opened)}.</p>}
    <p className="tiny">Open any statement to download it as a PDF{c.business ? ' or CSV' : ''}. {c.business ? '' : 'Statements from the last seven years are here.'}</p>
    {!c.business && <div className="list">
      <div className="row"><div className="ic"><Ic n="doc" s={18} /></div><div style={{ flex: 1 }}><p className="t">Paperless statements</p><p className="s">{a.cs.paperless !== false ? 'In the app only' : 'Paper copies by post as well'}</p></div><Toggle on={a.cs.paperless !== false} label="Paperless statements" onChange={() => { d({ type: 'set', key: 'paperless', value: a.cs.paperless === false }); nav.toast(a.cs.paperless === false ? 'Paperless on. Statements stay in the app.' : 'Paper statements on. They’ll come by post too.') }} /></div>
      <Row ic="cal" t="Change your payment date" s="Up to twice in 12 months" onClick={() => nav.push('duedate')} />
    </div>}
    {!c.business && <p className="tiny">A yearly statement on your account anniversary shows any rate changes. Paper copies are free.</p>}
  </Page>
}

export function Statement({ which }: { which: number }) {
  const nav = useNav(); const a = useAcct(); const { c } = a
  const cur = which === 0
  const o = OLD_STATEMENTS[which - 1]
  const bal = cur ? c.stmt : (statementsFor(c).find(x => x.iso === o.iso)?.bal ?? 0)
  const [prev, paid] = cur ? c.prev : [r2(bal * 0.94), r2(bal * 0.94)]
  const spend = r2(bal - (prev - paid))
  const txns = cur ? c.txns.filter(t => t.date <= STATEMENT_ISO) : []
  return <Page title={cur ? 'September 2026' : o.month} cta={<button className="btn big light" onClick={() => nav.toast('Statement saved as a PDF to your Files.')}><Ic n="doc" s={18} />Download PDF</button>}>
    <div className="cardp">
      <p className="small">{cur ? `Issued Fri 18 Sep · covers ${c.prev[0] === 0 ? dayLabel(c.opened).replace(/^\w+\s/, '') : '19 Aug'} to 18 Sep` : `Issued ${o.date}`}</p>
      <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }} className="num">{gbp(bal)}</p>
      <div>
        <div className="kv"><span>Previous balance</span><span className="num">{gbp(prev)}</span></div>
        <div className="kv"><span>Payments</span><span className="num pos">−{gbp(paid)}</span></div>
        <div className="kv"><span>New spending and fees</span><span className="num">{gbp(spend)}</span></div>
        <div className="kv"><span>Interest</span><span className="num">£0.00</span></div>
        <div className="kv"><span>New balance</span><span className="num">{gbp(bal)}</span></div>
        {cur && <div className="kv"><span>Minimum payment</span><span className="num">{gbp(a.minimum)}</span></div>}
        <div className="kv"><span>{cur ? 'Due' : 'Status'}</span><span>{cur ? DUE : 'Paid'}</span></div>
      </div>
    </div>
    <p className="tiny">Member figures are demo data. The minimum payment follows Barclaycard’s rule: the higher of 1% of the balance plus interest and fees, or £5.</p>
    {cur && <><Sec title="September on this statement" />
      <div className="list">{txns.map(t => <TxnRow key={t.id} t={t} earn={a.earnOn(t)} onClick={() => nav.push('txn', { id: t.id })} />)}</div>
      {c.opened < '2026-09-01' && <p className="tiny">August payments on this statement are in the PDF.</p>}</>}
  </Page>
}
