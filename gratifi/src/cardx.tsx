/* Card servicing screens. Each one is a module: it opens only when the bank offers the APIs behind it.
   Anything that moves money or changes the card goes through the confirm sheet; everything else happens in place. */
import { React, useState, useEffect } from '../../kit/src/r'
import { Icon } from '../../kit/src/icons'
import { useMarket } from '../../kit/src/market'
import * as St from './store'
import * as F from './flows'
import * as Bk from './bank'
import * as Mod from './modules'
import * as Br from './brain'
import { openConfirm, respond, run, FLOWS } from './render'
import * as D from './design'
import type { Nav } from './screens'

const W = window as any
/** Opens the confirm sheet when the answer needs one; otherwise says what happened in a short note. */
export function here(r: F.R) { if (r.confirm) openConfirm(r.confirm); else { respond(r); if (r.say) D.toast(r.say) } }
/** The first sentence of an answer, for a short note. Money like 20 د.إ. never counts as a sentence end. */
const first = (x?: string) => (x || '').split(/(?<=[a-z0-9)])\.\s(?=[A-Z])/)[0].replace(/([^.])$/, '$1.')
const sym = (M: any) => M.money(0).replace(/[0-9.,\s −-]/g, '')
const num = (v: string) => { const n = parseFloat(v.replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0 }
const TITLES: Record<string, string> = { pay: 'Pay your bill', statements: 'Statements', statement: 'Statement', txns: 'Transactions', txn: 'Payment', details: 'Card details', pin: 'PIN', limits: 'Spending limits', lost: 'Lost, stolen or damaged', activate: 'Activate your card', dispute: 'Dispute a payment', cases: 'Your cases', limit: 'Credit limit', wallet: 'Phone wallet', travel: 'Travel notice' }
const NEEDS: Record<string, string> = { pay: 'card.pay', statements: 'card.statements', statement: 'card.statements', txns: 'card.transactions', txn: 'card.transactions', details: 'card.details', pin: 'card.pin', limits: 'card.limits', lost: 'card.replace', activate: 'card.activate', dispute: 'card.disputes', cases: 'card', limit: 'card.limit', wallet: 'card.wallet', travel: 'card.travel' }

export function CardX({ nav, to = '' }: { nav: Nav; to?: string }) {
  St.useS(s => s.seen.apisOff); const [page, arg] = [to.split(':')[0], to.split(':').slice(1).join(':')]
  const ok = Mod.on(NEEDS[page] || 'card')
  const title = page === 'statement' && arg ? (Bk.statements().find(x => x.id === arg)?.label || 'Statement') : TITLES[page] || 'My card'
  const P: Record<string, any> = { pay: Pay, statements: Statements, statement: Statement, txns: Txns, txn: TxnDetail, details: Details, pin: Pin, limits: Limits, lost: Lost, activate: Activate, dispute: Dispute, cases: Cases, limit: Limit, wallet: PhoneWallet, travel: Travel }
  const Page = P[page]
  return <div className="app-scroll">
    <D.Head title={title} onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('card')} />} />
    {!ok || !Page ? <D.Empty title={Mod.unavailable(NEEDS[page] || 'card')} body="Your bank's app or a person at the bank can help with it." action="Talk to a person" onAction={() => { nav.go('chat'); Br.ask('I want to talk to a person') }} /> : <Page nav={nav} arg={arg} />}
  </div>
}

/* ---------- Pay your bill ---------- */
function Pay({ nav, arg }: { nav: Nav; arg: string }) {
  const c = St.useS(s => s.card); const M = useMarket()
  const [pick, setPick] = useState(arg === 'min' && c.min > 0 ? 'min' : 'full'); const [other, setOther] = useState('')
  if (c.due <= 0) return <><D.Empty title="Nothing to pay now" body={c.balance > 0 ? `Your statement is paid. ${M.money(c.balance, 2)} of new spending goes on your next statement.` : 'Your statement is paid.'} />{Mod.on('card.statements') && <D.List><D.Row icon="doc" title="Statements" chev onClick={() => nav.go('cardx', 'statements')} /></D.List>}</>
  const amt = pick === 'full' ? c.due : pick === 'min' ? c.min : Math.round(num(other) * 100) / 100
  return <>
    <D.Amount label={`Due ${M.date(c.dueDate)}`} right={`•••• ${c.last4}`} value={M.money(c.due, 2)} meta={c.balance - c.due >= 0.01 ? `Spending since the statement, ${M.money(Math.round((c.balance - c.due) * 100) / 100, 2)}, goes on your next one.` : 'Statement balance'} />
    <D.Label>How much</D.Label>
    <D.Choice label="How much to pay" value={pick} onChange={setPick} items={[{ key: 'full', title: 'Pay in full', sub: 'No interest on this statement', value: M.money(c.due, 2) }, { key: 'min', title: 'Pay the minimum', sub: c.min > 0 ? 'Interest is charged on the rest' : 'Already paid this month', value: M.money(c.min, 2), disabled: c.min <= 0 }, { key: 'other', title: 'Another amount' }]} />
    {pick === 'other' && <D.Field label="Amount" prefix={sym(M)} inputMode="decimal" value={other} onChange={setOther} placeholder="0.00" autoFocus hint={num(other) > c.due ? `That's more than you owe; it will be set to ${M.money(c.due, 2)}.` : num(other) > 0 && num(other) < c.min ? `Below the minimum of ${M.money(c.min, 2)}. Pay at least that by ${M.date(c.dueDate)} to avoid a late fee.` : undefined} />}
    <D.KV rows={[{ label: 'From', value: 'Current account •••• 7781' }, { label: 'Arrives', value: 'Straight away' }]} />
    <D.Primary disabled={!(amt > 0)} onClick={() => here(F.payBillAsk({ amount: amt }))}>{amt > 0 ? `Pay ${M.money(Math.min(amt, c.due), 2)}` : 'Pay'}</D.Primary>
  </>
}

/* ---------- Statements ---------- */
function Statements({ nav }: { nav: Nav }) {
  St.useS(s => s.card); const M = useMarket(); const list = Bk.statements()
  return <>
    <D.Label>Latest</D.Label>
    <D.List><D.Row icon="doc" title={list[0].label} sub={list[0].balance > 0 && St.get().card.due > 0 ? `${M.money(list[0].balance, 2)} · due ${M.date(list[0].due)}` : `${M.money(list[0].balance, 2)} · paid`} chev onClick={() => nav.go('cardx', 'statement:' + list[0].id)} /></D.List>
    <D.Label>Earlier</D.Label>
    <D.List>{list.slice(1).map(st => <D.Row key={st.id} icon="doc" title={st.label} sub={`${M.money(st.balance, 2)} · paid`} chev onClick={() => nav.go('cardx', 'statement:' + st.id)} />)}</D.List>
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />Statements from before these are kept by the bank for six years. Ask a person if you need one.</p>
  </>
}
function Statement({ nav, arg }: { nav: Nav; arg: string }) {
  const c = St.useS(s => s.card); const M = useMarket(); const st = Bk.statements().find(x => x.id === arg)
  if (!st) return <D.Empty title="That statement isn't here" />
  const save = async () => {
    const name = `Gratifi statement ${st.id}.csv`, csv = Bk.statementCsv(st)
    /* Inside Claude the viewer's own save prompt hands over the file; elsewhere a normal download. */
    let dl: any = null; try { dl = W.claude?.use ? await W.claude.use('downloads') : null } catch (e) { dl = null }
    if (dl) { try { await dl.save({ filename: name, data: csv }); D.toast('Statement saved') } catch (e: any) { if (e?.code !== 'declined') D.toast('This browser blocked the download') } return }
    try { const blob = new Blob([csv], { type: 'text/csv' }), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); D.toast('Statement saved') } catch (e) { D.toast('This browser blocked the download') } }
  const by: Record<string, number> = {}; st.txns.filter(t => t.cat !== 'Payment').forEach(t => { by[t.cat] = (by[t.cat] || 0) + (t.refund ? -t.amount : t.amount) })
  const bars = Object.entries(by).filter(([, v]) => v > 0.5).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, amount]) => ({ label, amount }))
  const owe = st.current && c.due > 0
  return <>
    <D.Amount label={`${M.date(st.start, 'day')} to ${M.date(st.end, 'day')}`} value={M.money(st.balance, 2)} meta={owe ? `Due ${M.date(st.due)} · minimum ${M.money(c.min, 2)}` : 'Paid in full'}><div className="ds-ac-pills">{owe && Mod.on('card.pay') && <D.Pill primary onClick={() => nav.go('cardx', 'pay')}>Pay this bill</D.Pill>}<D.Pill icon="download" onClick={save}>Download</D.Pill></div></D.Amount>
    {bars.length > 0 && <D.SpendBars period="Spent this statement" items={bars} total={bars.reduce((a, x) => a + x.amount, 0)} format={(n: number) => M.money(n, 2)} />}
    <D.Label>{`${st.txns.length} line${st.txns.length === 1 ? '' : 's'}`}</D.Label>
    {st.txns.length ? <D.List>{st.txns.map(t => <D.Txn key={t.id} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={st.current ? () => nav.go('cardx', 'txn:' + t.id) : undefined} />)}</D.List> : <p className="ds-row-s">No card payments in this period.</p>}
  </>
}

/* ---------- Transactions ---------- */
function Txns({ nav }: { nav: Nav }) {
  St.useS(s => s.txns); const M = useMarket(); const [q, setQ] = useState(''); const [cat, setCat] = useState('')
  const all = Bk.transactions(); const cats = Array.from(new Set(all.map(t => t.cat))).sort()
  const list = Bk.transactions(q, cat); const days: [string, St.Txn[]][] = []
  list.forEach(t => { const d = M.date(new Date(t.at), 'long'); const g = days.find(x => x[0] === d); g ? g[1].push(t) : days.push([d, [t]]) })
  return <>
    <D.Search value={q} onChange={setQ} placeholder="Search payments" />
    <D.Chips label="Filter by category" value={cat} onChange={setCat} items={[{ key: '', label: 'All' }, ...cats.map(c => ({ key: c, label: c }))]} />
    {days.length ? days.map(([d, l]) => <React.Fragment key={d}><D.Label>{d}</D.Label><D.List>{l.map(t => <D.Txn key={t.id} name={t.merchant} meta={t.pending ? `${t.cat} · pending` : t.cat} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={() => nav.go('cardx', 'txn:' + t.id)} />)}</D.List></React.Fragment>) : <D.Empty title="No payments match" body={q ? `Nothing for "${q}". Try the shop's name.` : 'Try another category.'} />}
  </>
}
function TxnDetail({ nav, arg }: { nav: Nav; arg: string }) {
  const s = St.useS(x => x); const M = useMarket(); const t = s.txns.find(x => x.id === arg)
  if (!t) return <D.Empty title="That payment isn't on your card any more" />
  const kase = s.bookings.find(b => b.extra?.case === 'dispute' && b.extra?.txn === t.id)
  const canDispute = !t.refund && t.cat !== 'Payment' && Mod.on('card.disputes') && !kase
  const d = new Date(t.at)
  return <>
    <D.Hero value={`${t.refund ? '+' : '−'}${M.money(t.amount, 2)}`} tone={t.refund ? 'good' : undefined} title={t.merchant} sub={`${M.date(d, 'long')} · ${M.clock(d.toTimeString().slice(0, 5))}`} />
    <D.KV rows={[{ label: 'Status', value: t.pending ? 'Pending' : t.refund ? 'Money back' : 'Completed' }, { label: 'Category', value: t.cat }, { label: 'Card', value: `•••• ${s.card.last4}` }, ...(t.points ? [{ label: 'Points earned', value: <span className="ds-good">{`+${M.num(t.points)}`}</span> }] : [])]} />
    {kase && kase.tracker && <D.Track title="Your dispute" steps={kase.tracker.steps} current={kase.tracker.current} eta={kase.extra?.outcome || kase.tracker.eta} />}
    <D.Label>Something wrong?</D.Label>
    <D.List>
      {canDispute && <D.Row icon="refresh" title="Dispute this payment" sub="Not received, not as described, charged twice" chev onClick={() => nav.go('cardx', 'dispute:' + t.id)} />}
      {!t.refund && t.cat !== 'Payment' && <D.Row icon="alert" title="I don't recognise this" sub="Freezes your card and brings in the fraud team" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "I don't recognise this payment") }} />}
      {Bk.LIMIT_CATS.includes(t.cat) && Mod.on('card.limits') && <D.Row icon="split" title={`Set a limit for ${t.cat.toLowerCase()}`} chev onClick={() => nav.go('cardx', 'limits')} />}
      <D.Row icon="headset" title="Ask about this payment" chev onClick={() => { nav.go('chat'); Br.ask(`Tell me about the ${t.merchant} payment`) }} />
    </D.List>
  </>
}

/* ---------- Card details and PIN ---------- */
function useLeft(key: 'revealUntil' | 'pinUntil') {
  const until = St.useS(s => s.seen[key] || 0) as number; const [, tick] = useState(0)
  useEffect(() => { if (until <= Date.now()) return; const t = setInterval(() => { tick(x => x + 1); if (Date.now() >= until) { clearInterval(t); St.set(s => ({ seen: { ...s.seen, [key]: 0 } })) } }, 1000); return () => clearInterval(t) }, [until])
  return Math.max(0, Math.ceil((until - Date.now()) / 1000))
}
const reveal = (f: 'revealDetails' | 'revealPin', title: string) => openConfirm({ kind: 'action', title, summary: `Card ending ${St.get().card.last4}`, act: { f }, doneTitle: 'Confirmed' } as any)
function Details({ nav }: { nav: Nav }) {
  const c = St.useS(s => s.card); const left = useLeft('revealUntil'); const d = Bk.details()
  useEffect(() => () => { St.set(s => ({ seen: { ...s.seen, revealUntil: 0 } })) }, [])
  const copy = (l: string, v: string) => { try { navigator.clipboard?.writeText(v) } catch (e) { } D.toast(`${l} copied`) }
  return <>
    <D.CardDetails name={d.name} number={d.number} expiry={d.expiry} cvv={d.cvv} shown={left > 0} left={left} frozen={c.frozen} onShow={() => reveal('revealDetails', 'Show card details')} onHide={() => St.set(s => ({ seen: { ...s.seen, revealUntil: 0 } }))} onCopy={copy} />
    <D.List>
      {Mod.on('card.pin') && <D.Row icon="lock" title="PIN" sub="See your PIN" chev onClick={() => nav.go('cardx', 'pin')} />}
      {Mod.on('card.wallet') && <D.Row icon="phone" title="Add to phone wallet" sub="Pay with your phone instead" chev onClick={() => nav.go('cardx', 'wallet')} />}
    </D.List>
    <p className="ds-foot"><Icon name="shield" size={14} stroke={2} />The bank never asks for these by phone, text or email. Only type them into a shop's own checkout.</p>
  </>
}
function Pin({ nav }: { nav: Nav }) {
  const left = useLeft('pinUntil'); const pin = Bk.pin()
  useEffect(() => () => { St.set(s => ({ seen: { ...s.seen, pinUntil: 0 } })) }, [])
  return <>
    <D.PinBox pin={pin} shown={left > 0} />
    <p className="ds-centre-s" style={{ marginTop: -10 }}>{left > 0 ? `Hides by itself in ${left} s` : 'Hidden until you confirm it\'s you'}</p>
    {left > 0 ? <D.Secondary onClick={() => St.set(s => ({ seen: { ...s.seen, pinUntil: 0 } }))}>Hide now</D.Secondary> : <D.Primary onClick={() => reveal('revealPin', 'Show your PIN')}><Icon name="faceid" size={18} stroke={2} />Show PIN</D.Primary>}
    <D.List>
      <D.Row icon="cash" title="Change your PIN" sub="At any of the bank's cash machines, under PIN services" />
      <D.Row icon="headset" title="Locked out after wrong tries?" sub="A person can unlock it" chev onClick={() => { nav.go('chat'); Br.ask('My PIN is locked') }} />
    </D.List>
    <p className="ds-foot"><Icon name="shield" size={14} stroke={2} />Nobody from the bank will ever ask for your PIN.</p>
  </>
}

/* ---------- Spending limits ---------- */
const LIMIT_ICON: Record<string, string> = { Dining: 'fork', Groceries: 'bag', Shopping: 'gift', Travel: 'plane', Transport: 'car', Entertainment: 'ticket' }
function Limits() {
  St.useS(s => s.seen.catLimits); St.useS(s => s.txns); const M = useMarket(); const lim = Bk.limits()
  const [edit, setEdit] = useState(''); const [v, setV] = useState('')
  const save = (amount: number | null) => { const r = FLOWS.setLimit({ cat: edit, amount }); if (r.say) D.toast(first(r.say)); setEdit('') }
  return <>
    <p className="ds-row-s">Set a monthly cap for any kind of spending. Card payments over it are declined until the 1st, and you get a note when you're close.</p>
    <D.List>{Bk.LIMIT_CATS.map(cat => { const spent = Bk.spentThisMonth(cat), l = lim[cat]; return <D.LimitRow key={cat} icon={LIMIT_ICON[cat]} title={cat} spent={M.money(spent, 2)} limit={l ? M.money(l) : undefined} used={l ? spent / l : 0} action={l ? 'Change' : 'Set'} onAction={() => { setEdit(cat); setV(l ? String(l) : '') }} /> })}</D.List>
    {edit && <><D.Label>{`${edit} each month`}</D.Label>
      <D.Field label="Monthly limit" prefix={sym(M)} inputMode="numeric" value={v} onChange={setV} autoFocus hint={num(v) > 0 && num(v) < Bk.spentThisMonth(edit) ? `You've already spent ${M.money(Bk.spentThisMonth(edit), 2)} this month, so new ${edit.toLowerCase()} payments are declined until the 1st.` : undefined} />
      <div className="ds-btnrow"><D.Pill primary onClick={() => num(v) > 0 && save(num(v))}>Save</D.Pill>{lim[edit] && <D.Pill onClick={() => save(null)}>Remove limit</D.Pill>}<button className="ds-textbtn" onClick={() => setEdit('')}>Cancel</button></div></>}
  </>
}

/* ---------- Lost, stolen, damaged; the new card; activation ---------- */
function Lost({ nav }: { nav: Nav }) {
  const s = St.useS(x => x); const M = useMarket(); const c = s.card
  const [why, setWhy] = useState<'lost' | 'stolen' | 'damaged' | 'missing'>('lost'); const [to, setTo] = useState(s.addr)
  const kase = Bk.openCase('replacement')[0]
  if (kase) return <ReplacementStatus nav={nav} b={kase} />
  const newNumber = why === 'lost' || why === 'stolen'
  return <>
    {!c.frozen && Mod.on('card.controls') && <D.Note title="Freeze it first" action="Freeze my card" onAction={() => { St.set(x => ({ card: { ...x.card, frozen: true } })); D.toast('Card frozen. New payments are blocked.') }}>Nobody can use it while it's frozen. If it turns up, unfreeze it and carry on.</D.Note>}
    {c.frozen && <D.AssistantNote>{`Card ending ${c.last4} is frozen. Direct debits and refunds still work.`}</D.AssistantNote>}
    <D.Label>What happened?</D.Label>
    <D.Choice label="What happened" value={why} onChange={k => setWhy(k as any)} items={[{ key: 'lost', title: "I've lost it" }, { key: 'stolen', title: 'It was stolen' }, { key: 'damaged', title: "It's damaged or not working" }, { key: 'missing', title: 'A new card never arrived' }]} />
    <p className="ds-row-s">{newNumber ? 'Your card is cancelled for good and the new one has a new number. Direct debits and subscriptions move across by themselves.' : why === 'missing' ? 'The missing card is cancelled and a new one is sent with a new number, in case it went astray.' : 'The new card keeps the same number, so nothing needs updating. Your current card works until you activate the new one.'}</p>
    {why === 'stolen' && <D.List><D.Row icon="alert" title="Payments I don't recognise" sub="The fraud team checks them and refunds what wasn't you" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "Payments I don't recognise") }} /></D.List>}
    <D.Label>Send the new card to</D.Label>
    <D.Choice label="Delivery address" value={to} onChange={setTo} items={s.addresses.map(a => ({ key: a.id, title: a.label, sub: a.line }))} />
    <D.Primary onClick={() => here(FLOWS.replaceAsk({ why: why === 'missing' ? 'missing' : why, to }))}>Order a new card</D.Primary>
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />Free, and usually there in 3 to 5 working days.</p>
  </>
}
function ReplacementStatus({ nav, b }: { nav: Nav; b: St.Booking }) {
  const delivered = b.status === 'delivered'
  return <>
    {b.tracker && <D.Track title={delivered ? 'Your new card has arrived' : 'Your new card is on its way'} sub={`${b.sub || ''} · ${b.ref}`} steps={b.tracker.steps} current={delivered ? b.tracker.steps.length : b.tracker.current} eta={delivered ? 'Ready to activate' : b.tracker.eta} />}
    {delivered && Mod.on('card.activate') ? <D.Primary onClick={() => nav.go('cardx', 'activate')}>Activate it now</D.Primary> : <p className="ds-row-s">You can activate it here as soon as it arrives.</p>}
    <D.List><D.Row icon="headset" title="It hasn't arrived after 7 days" chev onClick={() => { nav.go('chat'); Br.ask("My new card hasn't arrived") }} /></D.List>
  </>
}
function Activate({ nav }: { nav: Nav }) {
  St.useS(s => s.bookings); const b = Bk.arrived(); const onWay = Bk.openCase('replacement')[0]
  const [l4, setL4] = useState(''); const [exp, setExp] = useState('')
  if (!b) return onWay ? <ReplacementStatus nav={nav} b={onWay} /> : <D.Empty title="There's no new card to activate" body="When a new card is sent, you activate it here." />
  const go = () => { const r = FLOWS.activate({ last4: l4.trim(), expiry: exp }); D.toast(r.say ? first(r.say) : 'Done'); respond(r); if (!Bk.arrived()) nav.go('card') }
  return <>
    <p className="ds-row-s">Check it's the right card: type the last four digits on the front and the expiry date.</p>
    <D.Field label="Last four digits" inputMode="numeric" max={4} value={l4} onChange={x => setL4(x.replace(/\D/g, ''))} placeholder="0000" autoFocus />
    <D.Field label="Expiry date" inputMode="numeric" max={5} value={exp} onChange={x => { const d = x.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d) }} placeholder="MM/YY" />
    <D.Primary disabled={l4.length !== 4 || exp.length !== 5} onClick={go}>Activate</D.Primary>
    <p className="app-hint" style={{ position: 'static' }}>{`Demo: the new card ends ${Bk.newCardLast4()} and expires ${Bk.EXPIRY}`}</p>
  </>
}

/* ---------- Disputes ---------- */
function Dispute({ nav, arg }: { nav: Nav; arg: string }) {
  const s = St.useS(x => x); const M = useMarket()
  const t = arg ? s.txns.find(x => x.id === arg) : undefined
  const [reason, setReason] = useState(Bk.DISPUTE_REASONS[0]); const [amt, setAmt] = useState(t ? t.amount.toFixed(2) : ''); const [note, setNote] = useState(''); const [file, setFile] = useState('')
  if (!t) {
    const list = s.txns.filter(x => !x.refund && x.cat !== 'Payment' && Date.now() - x.at < 120 * 864e5)
    return <>
      <p className="ds-row-s">Pick the payment. You can dispute card payments from the last 120 days.</p>
      <D.List>{list.map(x => <D.Txn key={x.id} name={x.merchant} meta={`${x.cat} · ${M.date(new Date(x.at), 'day')}`} amount={x.amount} format={(n: number) => M.money(n, 2)} onClick={() => nav.go('cardx', 'dispute:' + x.id)} />)}</D.List>
    </>
  }
  const kase = s.bookings.find(b => b.extra?.case === 'dispute' && b.extra?.txn === t.id)
  if (kase) return <>{kase.tracker && <D.Track title={`Disputed: ${t.merchant}`} sub={`${M.money(kase.extra.amount, 2)} · ${kase.sub} · ${kase.ref}`} steps={kase.tracker.steps} current={kase.tracker.current} eta={kase.extra?.outcome || kase.tracker.eta} tone={kase.tracker.tone === 'warn' ? 'warn' : undefined} />}<D.List><D.Row icon="doc" title="All your cases" chev onClick={() => nav.go('cardx', 'cases')} /></D.List></>
  const a = Math.round(num(amt) * 100) / 100
  return <>
    <D.List><D.Txn name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} format={(n: number) => M.money(n, 2)} /></D.List>
    <p className="ds-row-s">It helps to contact the shop first. If they haven't put it right, the bank can.</p>
    <D.Label>What went wrong?</D.Label>
    <D.Choice label="What went wrong" value={reason} onChange={setReason} items={Bk.DISPUTE_REASONS.map(r => ({ key: r, title: r }))} />
    {reason === "I don't recognise it" ? <D.List><D.Row icon="alert" title="Report it as fraud instead" sub="Your card is frozen and the fraud team takes it from here" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "I don't recognise this payment") }} /></D.List> : <>
      <D.Field label="Amount you're disputing" prefix={sym(M)} inputMode="decimal" value={amt} onChange={setAmt} hint={a > t.amount ? `The most is the payment itself, ${M.money(t.amount, 2)}.` : undefined} />
      <label className="ds-field"><span className="ds-field-l">What happened (optional)</span><textarea className="app-ta" value={note} maxLength={600} onChange={e => setNote((e.target as HTMLTextAreaElement).value)} placeholder="Dates, what you were told, what you've tried" /></label>
      <D.List><label className="ds-row" style={{ cursor: 'pointer' }}><span className="ds-row-ic"><Icon name="doc" size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{file ? file : 'Add a receipt or photo'}</span><span className="ds-row-s">{file ? 'Attached' : 'Optional. Emails, receipts or a photo of the item'}</span></span><input type="file" accept="image/*,application/pdf" style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} onChange={e => setFile((e.target as HTMLInputElement).files?.[0]?.name || '')} /><span className="ds-opill">{file ? 'Change' : 'Add'}</span></label></D.List>
      <D.Primary disabled={!(a > 0)} onClick={() => here(FLOWS.disputeAsk({ txn: t.id, reason, amount: Math.min(a, t.amount), note: note.trim() || undefined, photo: !!file }))}>Review and send</D.Primary>
    </>}
  </>
}

/* ---------- Your cases ---------- */
function Cases({ nav }: { nav: Nav }) {
  const bs = St.useS(s => s.bookings); const M = useMarket()
  const list = bs.filter(b => b.extra?.case || b.title === 'Replacement card')
  if (!list.length) return <D.Empty title="No cases" body="New cards, disputes and limit requests show here while the bank works on them." />
  return <>{list.map(b => b.tracker ? <D.Track key={b.id} title={b.title} sub={[b.sub, b.extra?.case === 'dispute' ? M.money(b.extra.amount, 2) : '', b.ref].filter(Boolean).join(' · ')} steps={b.tracker.steps} current={b.status === 'delivered' && !b.extra?.activated ? b.tracker.steps.length : b.tracker.current} eta={b.extra?.outcome || (b.status === 'delivered' && !b.extra?.activated ? 'Ready to activate' : b.extra?.activated ? 'Activated' : b.tracker.eta)} tone={b.tracker.tone === 'warn' ? 'warn' : undefined}>{b.status === 'delivered' && !b.extra?.activated && Mod.on('card.activate') && <div><D.Pill primary onClick={() => nav.go('cardx', 'activate')}>Activate</D.Pill></div>}</D.Track> : null)}</>
}

/* ---------- Credit limit ---------- */
function Limit() {
  const c = St.useS(s => s.card); St.useS(s => s.bookings); const M = useMarket()
  const [mode, setMode] = useState('Lower it'); const [pick, setPick] = useState(''); const [other, setOther] = useState('')
  const step = c.limit >= 20000 ? 1000 : 500, floor = Math.ceil(Math.max(c.balance, step) / step) * step
  const lower = [0.75, 0.5, 0.25].map(f => Math.round(c.limit * f / step) * step).filter((v, i, xs) => v >= floor && v < c.limit && xs.indexOf(v) === i)
  const higher = [1.25, 1.5, 2].map(f => Math.round(c.limit * f / step) * step)
  const req = Bk.openCase('limit')[0]
  const to = pick === 'other' ? Math.round(num(other)) : +pick
  return <>
    <D.Amount label="Your credit limit" right={`•••• ${c.last4}`} value={M.money(c.limit)}><D.Bar used={c.limit ? c.balance / c.limit : 0} label="Credit used" tone="black" thin /><span className="ds-ac-m">{`${M.money(c.balance, 2)} used · ${M.money(Math.max(0, c.limit - c.balance), 2)} available`}</span></D.Amount>
    <D.Seg items={['Lower it', 'Ask for more']} value={mode} onChange={x => { setMode(x); setPick(''); setOther('') }} />
    {mode === 'Lower it' ? <>
      <p className="ds-row-s">Lowering it happens straight away. Raising it again later needs a check by the bank.</p>
      <D.Choice label="New limit" value={pick} onChange={setPick} items={[...lower.map(v => ({ key: String(v), title: M.money(v) })), { key: 'other', title: 'Another amount' }]} />
      {pick === 'other' && <D.Field label="New limit" prefix={sym(M)} inputMode="numeric" value={other} onChange={setOther} autoFocus hint={to && to < c.balance ? `It has to be at least your balance, ${M.money(c.balance, 2)}.` : to >= c.limit ? `Pick an amount below ${M.money(c.limit)}.` : undefined} />}
      <D.Primary disabled={!(to > 0 && to < c.limit && to >= c.balance)} onClick={() => here(F.limitAsk({ to }))}>{to > 0 ? `Lower to ${M.money(to)}` : 'Lower my limit'}</D.Primary>
    </> : req ? <>{req.tracker && <D.Track title={req.title} sub={`${req.sub} · ${req.ref}`} steps={req.tracker.steps} current={req.tracker.current} eta={req.extra?.outcome || req.tracker.eta} />}</> : <>
      <p className="ds-row-s">The bank checks what you can afford before saying yes. It won't affect your credit score unless you go ahead.</p>
      <D.Choice label="Limit you'd like" value={pick} onChange={setPick} items={[...higher.map(v => ({ key: String(v), title: M.money(v) })), { key: 'other', title: 'Another amount' }]} />
      {pick === 'other' && <D.Field label="Limit you'd like" prefix={sym(M)} inputMode="numeric" value={other} onChange={setOther} autoFocus />}
      <D.Primary disabled={!(to > c.limit)} onClick={() => here(FLOWS.limitRequestAsk({ to }))}>Send to the bank</D.Primary>
    </>}
  </>
}

/* ---------- Phone wallet ---------- */
function PhoneWallet() {
  const w = St.useS(s => s.seen.wallets || {}) as Record<string, number>; const M = useMarket()
  const ios = /iPhone|iPad|Macintosh/.test(navigator.userAgent)
  const list: [string, string][] = ios ? [['apple', 'Apple Wallet'], ['google', 'Google Wallet'], ['samsung', 'Samsung Wallet']] : [['google', 'Google Wallet'], ['samsung', 'Samsung Wallet'], ['apple', 'Apple Wallet']]
  return <>
    <p className="ds-row-s">Pay by holding your phone or watch near the reader, and online with one tap. Payments earn points the same as the card.</p>
    <D.List>{list.map(([k, name]) => <D.ActionRow key={k} icon="phone" title={name} sub={w[k] ? `Added on ${M.date(new Date(w[k]), 'day')}` : 'Not added'} action={w[k] ? 'Remove' : 'Add'} primary={!w[k]} onAction={() => { if (w[k]) { FLOWS.walletRemove({ wallet: k }); D.toast(`Removed from ${name}`) } else here(FLOWS.walletAsk({ wallet: k as any })) }} />)}</D.List>
    <p className="ds-foot"><Icon name="shield" size={14} stroke={2} />Your phone uses its own device number, so your card number is never shared with shops.</p>
  </>
}

/* ---------- Travel notice ---------- */
function Travel() {
  St.useS(s => s.seen.notices); const c = St.useS(s => s.card); const M = useMarket(); const list = Bk.notices()
  const today = F.iso(new Date()); const [where, setWhere] = useState(''); const [from, setFrom] = useState(today); const [to, setTo] = useState(F.addDays(today, 7))
  return <>
    <p className="ds-row-s">Tell the bank where you're going so payments there aren't blocked as unusual. There's no foreign transaction fee on card payments.</p>
    {!c.abroad && Mod.on('card.controls') && <D.List><D.ActionRow icon="plane" title="Payments abroad are off" sub="Turn them on before you go" action="Turn on" primary onAction={() => here(F.cardControl({ control: 'abroad', on: true }))} /></D.List>}
    {list.length > 0 && <><D.Label>Your trips</D.Label><D.List>{list.map(n => <D.Row key={n.id} icon="globe" title={n.where} sub={`${M.date(n.from, 'day')} to ${M.date(n.to, 'day')}`} value={<button className="ds-textbtn" onClick={() => { Bk.noticeRemove(n.id); D.toast('Travel notice removed') }}>Remove</button>} />)}</D.List></>}
    <D.Label>Add a trip</D.Label>
    <D.Field label="Where are you going?" value={where} onChange={setWhere} placeholder="Country or city" />
    <div className="ds-btnrow" style={{ flexWrap: 'nowrap' }}><div style={{ flex: 1, minWidth: 0 }}><D.Field label="From" type="date" value={from} onChange={setFrom} /></div><div style={{ flex: 1, minWidth: 0 }}><D.Field label="To" type="date" value={to} onChange={setTo} /></div></div>
    <D.Primary disabled={!where.trim() || !from || !to || to < from} onClick={() => { const r = FLOWS.noticeAdd({ where, from, to }); D.toast(r.say ? first(r.say) : 'Added'); if (!/^Add/.test(r.say || '')) setWhere('') }}>Add travel notice</D.Primary>
  </>
}
