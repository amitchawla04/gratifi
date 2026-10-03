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
import { openConfirm, respond, run, FLOWS, GamblingRow } from './render'
import * as D from './design'
import * as Cat from './catalog'
import type { Nav } from './screens'

const W = window as any
/** Opens the confirm sheet when the answer needs one; otherwise says what happened in a short note. */
export function here(r: F.R) { if (r.confirm) openConfirm(r.confirm); else { respond(r); if (r.say) D.toast(r.say) } }
/** The first sentence of an answer, for a short note. Money like 20 د.إ. never counts as a sentence end. */
const first = (x?: string) => (x || '').split(/(?<=[a-z0-9)])\.\s(?=[A-Z])/)[0].replace(/([^.])$/, '$1.')
const sym = (M: any) => M.money(0).replace(/[0-9.,\s −-]/g, '')
const num = (v: string) => { const n = parseFloat(v.replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0 }
const TITLES: Record<string, string> = { benefits: 'Included with your card', dd: 'Direct Debit', pay: 'Pay your bill', statements: 'Statements', statement: 'Statement', txns: 'Transactions', txn: 'Payment', details: 'Card details', pin: 'PIN', controls: 'Card controls', limits: 'Limits by category', lost: 'Lost, stolen or damaged', activate: 'Activate your card', dispute: 'Dispute a payment', cases: 'Your cases', limit: 'Credit limit', wallet: 'Phone wallet', travel: 'Travel notice' }
const NEEDS: Record<string, string> = { controls: 'card.controls', benefits: 'benefits', dd: 'card.directdebit', pay: 'card.pay', statements: 'card.statements', statement: 'card.statements', txns: 'card.transactions', txn: 'card.transactions', details: 'card.details', pin: 'card.pin', limits: 'card.limits', lost: 'card.replace', activate: 'card.activate', dispute: 'card.disputes', cases: 'card', limit: 'card.limit', wallet: 'card.wallet', travel: 'card.travel' }

export function CardX({ nav, to = '' }: { nav: Nav; to?: string }) {
  St.useS(s => s.seen.apisOff); const [page, arg] = [to.split(':')[0], to.split(':').slice(1).join(':')]
  const ok = Mod.on(NEEDS[page] || 'card')
  const M0 = useMarket()
  const title = page === 'statement' && arg ? (Bk.statements().find(x => x.id === arg)?.label || 'Statement') : page === 'dd' ? M0.directDebit.charAt(0).toUpperCase() + M0.directDebit.slice(1) : TITLES[page] || 'My card'
  const P: Record<string, any> = { controls: Controls, benefits: Benefits, dd: DirectDebit, pay: Pay, statements: Statements, statement: Statement, txns: Txns, txn: TxnDetail, details: Details, pin: Pin, limits: Limits, lost: Lost, activate: Activate, dispute: Dispute, cases: Cases, limit: Limit, wallet: PhoneWallet, travel: Travel }
  const Page = P[page]
  return <div className="app-scroll">
    <D.Head title={title} onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('card')} />} />
    {!ok || !Page ? <D.Empty title={Mod.unavailable(NEEDS[page] || 'card')} body="Your bank's app or a person at the bank can help with it." action="Talk to a person" onAction={() => { nav.go('chat'); Br.ask('I want to talk to a person') }} /> : <Page nav={nav} arg={arg} />}
  </div>
}

/* ---------- Pay your bill ---------- */
function Pay({ nav, arg }: { nav: Nav; arg: string }) {
  const c = St.useS(s => s.card); const M = useMarket()
  const OPTS = ['In full', 'Minimum', 'Other']
  const [pick, setPick] = useState(arg === 'min' && c.min > 0 ? 'Minimum' : arg === 'other' ? 'Other' : 'In full'); const [other, setOther] = useState('')
  if (c.due <= 0) return <><D.Hero value={M.money(0, 2)} title="Nothing to pay now" sub={c.balance > 0 ? `${M.money(c.balance, 2)} of new spending goes on your next statement.` : 'Your statement is paid.'} />{Mod.on('card.statements') && <D.List><D.Row icon="doc" title="Statements" chev onClick={() => nav.go('cardx', 'statements')} /></D.List>}</>
  const amt = pick === 'In full' ? c.due : pick === 'Minimum' ? c.min : Math.round(Math.min(c.due, num(other)) * 100) / 100
  return <>
    <D.Seg items={c.min > 0 ? OPTS : ['In full', 'Other']} value={pick} onChange={setPick} />
    {pick === 'Other' ? <D.Field label="Amount" prefix={sym(M)} inputMode="decimal" value={other} onChange={setOther} placeholder="0.00" autoFocus hint={num(other) > c.due ? `That's more than you owe, so it's set to ${M.money(c.due, 2)}.` : num(other) > 0 && num(other) < c.min ? `Below the minimum of ${M.money(c.min, 2)}. Pay at least that by ${M.date(c.dueDate, 'day')} to avoid a late fee.` : `You owe ${M.money(c.due, 2)}. The minimum is ${M.money(c.min, 2)}.`} />
      : <D.Hero value={M.money(amt, 2)} title={pick === 'In full' ? 'Your statement balance' : 'The minimum'} sub={pick === 'In full' ? `Due ${M.date(c.dueDate, 'day')} · no interest` : `Due ${M.date(c.dueDate, 'day')} · interest is charged on the rest`} />}
    <D.KV rows={[{ label: 'From', value: 'Current account •••• 7781' }, { label: 'Arrives', value: 'Straight away' }]} />
    {amt > 0 && <D.Primary onClick={() => here(F.payBillAsk({ amount: amt }))}>{`Pay ${M.money(amt, 2)}`}</D.Primary>}
  </>
}

/* ---------- Direct Debit ---------- */
function DirectDebit() {
  const c = St.useS(s => s.card) as any; const M = useMarket()
  const cur = !c.autopay ? 'off' : c.autopayMode === 'min' ? 'min' : 'full'
  const [pick, setPick] = useState(cur === 'off' ? 'full' : cur)
  return <>
    <D.Hero title={cur === 'off' ? 'Off' : cur === 'min' ? 'Pays the minimum' : 'Pays the full balance'} sub={cur === 'off' ? 'You pay each bill yourself.' : `Each month from your current account •••• 7781, on the due date.`} />
    <D.Choice list label="What it pays" value={pick} onChange={setPick} items={[{ key: 'full', title: 'The full balance', sub: 'No interest, ever' }, { key: 'min', title: 'The minimum', sub: 'Interest is charged on the rest' }, ...(cur !== 'off' ? [{ key: 'off', title: 'Turn it off', sub: 'You pay each bill yourself' }] : [])]} />
    {pick !== cur && <D.Primary onClick={() => openConfirm(ddAskX(pick as any) as any)}>{pick === 'off' ? 'Turn off' : cur === 'off' ? 'Set up' : 'Change'}</D.Primary>}
  </>
}
const ddAskX = (m: 'full' | 'min' | 'off') => (W.__ddAsk ? W.__ddAsk(m) : null)

/* ---------- What's included ---------- */
function Benefits({ nav }: { nav: Nav }) {
  const left = St.useS(s => s.loungeLeft); const M = useMarket()
  const SHORT: Record<string, string> = { 'BE-1': 'Free visits this year', 'BE-2': '120 days on what you buy', 'BE-3': 'An extra year on top of the maker\'s', 'BE-4': 'When the trip is on the card', 'BE-5': 'On card purchases abroad', 'BE-6': '15% off at partner restaurants', 'BE-7': '48 hours before general sale', 'BE-8': 'If an order goes wrong' }
  const go = (b: any) => { nav.go('chat'); run(b.key === 'lounge' ? { f: 'search', a: { cat: 'airport' } } : b.id === 'BE-4' ? { f: 'docs', a: { topic: 'insurance' } } : b.id === 'BE-6' ? { f: 'search', a: { cat: 'dining' } } : b.id === 'BE-7' ? { f: 'search', a: { cat: 'tickets' } } : b.id === 'BE-5' ? { f: 'docs', a: { topic: 'abroad' } } : { f: 'myStuff', a: {} }, b.name) }
  return <>
    <D.Included items={Bk_BEN().map(b => ({ key: b.id, icon: b.icon, title: b.name, sub: SHORT[b.id] || b.sub, meta: b.key === 'lounge' ? `${left} left` : undefined, onClick: () => go(b) }))} />
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />{`Full terms are in your card agreement. ${M.id === 'UK' ? 'Purchases between £100 and £30,000 are also covered by Section 75.' : ''}`.trim()}</p>
  </>
}
const Bk_BEN = () => Cat.BENEFITS

/* ---------- Statements ---------- */
function Statements({ nav }: { nav: Nav }) {
  St.useS(s => s.card); const M = useMarket(); const list = Bk.statements(); const due = St.get().card.due > 0
  const row = (st: Bk.Statement) => <D.Row key={st.id} icon="doc" title={st.label} sub={st.current && due ? `Due ${M.date(st.due, 'day')}` : 'Paid'} value={M.money(st.balance, 2)} chev onClick={() => nav.go('cardx', 'statement:' + st.id)} />
  return <>
    <D.Sec title="Latest" />
    <D.List>{row(list[0])}</D.List>
    <D.Sec title="Earlier" />
    <D.List>{list.slice(1).map(row)}</D.List>
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />Older statements are kept by the bank for six years. Ask a person if you need one.</p>
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
  const owe = st.current && c.due > 0
  const pts = st.txns.reduce((a, t) => a + (t.points || 0), 0)
  return <>
    <D.Hero value={M.money(st.balance, 2)} title={owe ? `Due ${M.date(st.due, 'day')}` : 'Paid in full'} sub={`${M.date(st.start, 'day')} to ${M.date(st.end, 'day')}`} />
    <D.KV rows={[{ label: 'Brought forward', value: M.money(st.brought, 2) }, { label: 'Purchases', value: M.money(st.purchases, 2) }, { label: 'Statement balance', value: M.money(st.balance, 2) }, ...(owe ? [{ label: 'Minimum payment', value: M.money(c.min, 2) }] : []), ...(pts ? [{ label: 'Points earned', value: <span className="ds-good">{`+${M.num(pts)}`}</span> }] : [])]} />
    <div className="ds-btnrow">{owe && Mod.on('card.pay') && <D.Pill primary onClick={() => nav.go('cardx', 'pay')}>Pay this bill</D.Pill>}<D.Pill icon="download" onClick={save}>Download</D.Pill></div>
    <D.Sec title="Purchases" />
    {st.txns.length ? <D.List>{st.txns.map(t => <D.Txn key={t.id} cat={t.cat} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={st.current ? () => nav.go('cardx', 'txn:' + t.id) : undefined} />)}</D.List> : <p className="ds-row-s">No card payments in this period.</p>}
  </>
}

/* ---------- Transactions ---------- */
function groupDays(list: St.Txn[], M: any) { const days: [string, St.Txn[]][] = []; list.forEach(t => { const d = M.date(new Date(t.at), 'long'); const g = days.find(x => x[0] === d); g ? g[1].push(t) : days.push([d, [t]]) }); return days }
function Txns({ nav }: { nav: Nav }) {
  St.useS(s => s.txns); const M = useMarket(); const [q, setQ] = useState(''); const [cat, setCat] = useState('')
  const all = Bk.transactions(); const cats = Array.from(new Set(all.map(t => t.cat))).sort()
  const list = Bk.transactions(q, cat); const days = groupDays(list, M)
  const since = Date.now() - 30 * 864e5, by: Record<string, number> = {}
  all.filter(t => t.at >= since && t.cat !== 'Payment').forEach(t => { by[t.cat] = (by[t.cat] || 0) + (t.refund ? -t.amount : t.amount) })
  const spend = Object.entries(by).filter(([, v]) => v >= 0.5).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label, amount]) => ({ label, amount }))
  return <>
    <D.Search value={q} onChange={setQ} placeholder="Search payments" />
    <D.Chips label="Filter by category" value={cat} onChange={setCat} items={[{ key: '', label: 'All' }, ...cats.map(c => ({ key: c, label: c }))]} />
    {!q && !cat && spend.length > 0 && <D.SpendBars period="Last 30 days" items={spend} total={Object.values(by).reduce((a, x) => a + Math.max(0, x), 0)} format={(n: number) => M.money(n, 2)} />}
    {days.length ? days.map(([d, l]) => <React.Fragment key={d}><D.Label>{d}</D.Label><D.List>{l.map(t => <D.Txn key={t.id} cat={t.cat} name={t.merchant} meta={t.pending ? `${t.cat} · pending` : t.cat} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={() => nav.go('cardx', 'txn:' + t.id)} />)}</D.List></React.Fragment>) : <D.Empty title="No payments match" body={q ? `Nothing for "${q}". Try the shop's name.` : 'Try another category.'} />}
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
    <D.Sec title="Something wrong?" />
    <D.List>
      {canDispute && <D.Row icon="refresh" title="Dispute this payment" chev onClick={() => nav.go('cardx', 'dispute:' + t.id)} />}
      {!t.refund && t.cat !== 'Payment' && <D.Row icon="alert" title="I don't recognise this" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "I don't recognise this payment") }} />}
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
      {Mod.on('card.pin') && <D.Row icon="lock" title="PIN" chev onClick={() => nav.go('cardx', 'pin')} />}
      {Mod.on('card.wallet') && <D.Row icon="wallet" title="Phone wallet" chev onClick={() => nav.go('cardx', 'wallet')} />}
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
    <div className="ds-hero-sub">{left > 0 ? <D.Pill onClick={() => St.set(s => ({ seen: { ...s.seen, pinUntil: 0 } }))}>Hide now</D.Pill> : <D.Pill primary icon="faceid" onClick={() => reveal('revealPin', 'Show your PIN')}>Show PIN</D.Pill>}</div>
    <D.List><D.Row icon="headset" title="Locked out after wrong tries?" sub="A person can unlock it" chev onClick={() => { nav.go('chat'); Br.ask('My PIN is locked') }} /></D.List>
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />To change your PIN, use any of the bank's cash machines. Nobody from the bank will ever ask for it.</p>
  </>
}

/* ---------- Card controls: one place for every switch, limit, block and alert on the card ---------- */
function Controls({ nav }: { nav: Nav }) {
  const c = St.useS(s => s.card) as any; St.useS(s => s.seen.ctl); St.useS(s => s.txns); const M = useMarket(); const on = Mod.useOn()
  St.useS(s => s.seen.rem); const rem = Bk.reminders(); const ct = Bk.ctl(), country = Cat.HOME[M.id === 'AR' ? 'AE' : M.id]?.country || 'your country'
  const [where, setWhere] = useState<'At home' | 'Abroad'>('At home'); const w: Bk.Where = where === 'Abroad' ? 'abroad' : 'home'
  const [edit, setEdit] = useState<(Bk.LimKey & { alert?: boolean }) | null>(null); const [v, setV] = useState('')
  const sw = (k: string, val: boolean) => { if (k === 'frozen') { if (val) { St.set(x => ({ card: { ...x.card, frozen: true } })); D.toast('Card frozen. New payments are blocked.') } else here(F.unfreezeAsk({})); return } here(F.cardControl({ control: k, on: val })) }
  const open = (k: Bk.LimKey & { alert?: boolean }, now?: number) => { setEdit(k); setV(now ? String(now) : '') }
  const save = (amount: number | null) => { const e = edit!; setEdit(null); here(e.alert ? Bk.alertsSet({ over: amount }) : Bk.limAsk({ ...e, amount })) }
  const same = (k: Bk.LimKey & { alert?: boolean }) => !!edit && edit.key === k.key && edit.ch === k.ch && edit.where === k.where && !!edit.alert === !!k.alert
  const editor = (k: Bk.LimKey & { alert?: boolean }, now?: number) => same(k) && <div className="ds-ctl-edit">
    <D.Field label={k.alert ? 'Payments over' : Bk.limName(k)} prefix={sym(M)} inputMode="numeric" value={v} onChange={setV} autoFocus hint={k.key === 'daily' && k.ch === 'contactless' ? `Up to ${M.money(Bk.chMax('contactless'))} a payment. Above that, you pay with chip and PIN.` : undefined} />
    <div className="ds-btnrow">{num(v) > 0 && <D.Pill primary onClick={() => save(num(v))}>Save</D.Pill>}{now != null && k.key !== 'daily' && <D.Pill onClick={() => save(null)}>{k.alert ? 'Turn off' : 'Remove limit'}</D.Pill>}<button className="ds-textbtn" onClick={() => setEdit(null)}>Cancel</button></div></div>
  const nLim = on('card.limits') ? Object.keys(Bk.limits()).length : 0
  return <>
    <D.List><D.ToggleRow title="Freeze card" sub={c.frozen ? 'Everything below is paused while it\'s frozen' : 'Blocks new payments. Direct debits and refunds still work.'} on={c.frozen} onChange={(x: boolean) => sw('frozen', x)} /></D.List>
    <D.Sec title="Where your card works" />
    <D.List>
      <D.ToggleRow title="Domestic payments" sub={`In ${country}`} on={c.domestic !== false} dim={c.frozen} onChange={(x: boolean) => sw('domestic', x)} />
      <D.ToggleRow title="International payments" sub={`Outside ${country}, and online in other currencies`} on={c.abroad} dim={c.frozen} onChange={(x: boolean) => sw('abroad', x)} />
      {on('card.travel') && <D.Row icon="plane" title="Travel notices" meta={Bk.notices().length ? `${Bk.notices().length} set` : 'None set'} chev onClick={() => nav.go('cardx', 'travel')} />}
    </D.List>
    <D.Sec title="How you pay" />
    <D.List>
      <D.ToggleRow title="Online" sub="Websites and apps" on={c.online} dim={c.frozen} onChange={(x: boolean) => sw('online', x)} />
      <D.ToggleRow title="In store" sub="Chip and PIN at a till" on={c.instore !== false} dim={c.frozen} onChange={(x: boolean) => sw('instore', x)} />
      <D.ToggleRow title="Contactless" on={c.contactless} dim={c.frozen} onChange={(x: boolean) => sw('contactless', x)} />
      <D.ToggleRow title="Cash withdrawals" on={c.atm} dim={c.frozen} onChange={(x: boolean) => sw('atm', x)} />
      {on('card.wallet') && <D.Row icon="phone" title="Phone wallets" chev onClick={() => nav.go('cardx', 'wallet')} />}
    </D.List>
    <D.Sec title="Limits" />
    <p className="ds-row-s">Lowering a limit works straight away. Raising one asks you to confirm it's you.</p>
    <D.List>
      <D.LimitRow icon="split" title="Monthly spending" spent={M.money(Bk.spentMonth(), 2)} limit={ct.month ? M.money(ct.month) : undefined} used={ct.month ? Bk.spentMonth() / ct.month : 0} action={ct.month ? 'Change' : 'Set'} onAction={() => open({ key: 'month' }, ct.month)} />
      {editor({ key: 'month' }, ct.month)}
      <D.Row icon="card" title="Each payment" value={ct.txn ? `Up to ${M.money(ct.txn)}` : 'No limit'} chev onClick={() => open({ key: 'txn' }, ct.txn)} />
      {editor({ key: 'txn' }, ct.txn)}
      {on('card.limits') && <D.Row icon="split" title="Limits by category" meta={nLim ? `${nLim} set` : 'None set'} chev onClick={() => nav.go('cardx', 'limits')} />}
    </D.List>
    <D.Label>Daily limits by how you pay</D.Label>
    <D.Seg items={['At home', 'Abroad']} value={where} onChange={(x: string) => { setWhere(x as any); setEdit(null) }} />
    <D.List>{Bk.CHS.map(ch => { const k = { key: 'daily' as const, ch, where: w }, now = ct.daily[w][ch]; return <React.Fragment key={ch}>
      <D.Row title={Bk.CH_NAME[ch]} value={`${M.money(now)}${ch === 'contactless' ? ' a payment' : ' a day'}`} chev onClick={() => open(k, now)} />{editor(k, now)}</React.Fragment> })}</D.List>
    <D.Sec title="Spending blocks" />
    {on('card.gambling') && <GamblingRow />}
    <D.List>{Bk.BLOCKS.map(b => <D.ToggleRow key={b.k} title={b.name} sub={b.sub} on={!!ct.blocks[b.k]} onChange={(x: boolean) => here(Bk.blockSet({ k: b.k, on: x }))} />)}</D.List>
    <D.Sec title="Payment alerts" />
    <D.List>
      <D.ToggleRow title="Every payment" sub="A message each time your card is used" on={ct.alerts.every} onChange={(x: boolean) => here(Bk.alertsSet({ every: x }))} />
      <D.Row icon="bell" title="Large payments" value={ct.alerts.over ? `Over ${M.money(ct.alerts.over)}` : 'Off'} chev onClick={() => open({ key: 'txn', alert: true }, ct.alerts.over)} />
      {editor({ key: 'txn', alert: true }, ct.alerts.over)}
      <D.ToggleRow title="Declined payments" sub="With the reason, so you can fix it" on={ct.alerts.declined} onChange={(x: boolean) => here(Bk.alertsSet({ declined: x }))} />
      <D.ToggleRow title="Statement ready" on={rem.statement} onChange={(x: boolean) => here(Bk.remSet({ statement: x }))} />
    </D.List>
    <D.Label>Bill reminder, before the due date</D.Label>
    <D.Seg items={['Off', '1 day', '3 days', '7 days']} value={rem.bill ? `${rem.bill} day${rem.bill > 1 ? 's' : ''}` : 'Off'} onChange={(x: string) => here(Bk.remSet({ bill: x === 'Off' ? 0 : parseInt(x) }))} />
  </>
}

/* ---------- Spending limits ---------- */
const LIMIT_ICON: Record<string, string> = { Dining: 'fork', Groceries: 'bag', Shopping: 'gift', Travel: 'plane', Transport: 'car', Entertainment: 'ticket' }
function Limits() {
  St.useS(s => s.seen.catLimits); St.useS(s => s.txns); const M = useMarket(); const lim = Bk.limits()
  const [edit, setEdit] = useState(''); const [v, setV] = useState('')
  const save = (amount: number | null) => { const r = FLOWS.setLimit({ cat: edit, amount }); if (r.say) D.toast(first(r.say)); setEdit('') }
  return <>
    <p className="ds-row-s">Cap any kind of spending over a rolling 30 days. Card payments that would go over it are declined.</p>
    <D.List>{Bk.LIMIT_CATS.map(cat => { const spent = Bk.spentThisMonth(cat), l = lim[cat]; return <D.LimitRow key={cat} icon={LIMIT_ICON[cat]} title={cat} spent={M.money(spent, 2)} limit={l ? M.money(l) : undefined} used={l ? spent / l : 0} action={l ? 'Change' : 'Set'} onAction={() => { setEdit(cat); setV(l ? String(l) : '') }} /> })}</D.List>
    {edit && <><D.Sec title={`${edit} limit`} />
      <D.Field label="Over 30 days" prefix={sym(M)} inputMode="numeric" value={v} onChange={setV} autoFocus hint={num(v) > 0 && num(v) < Bk.spentThisMonth(edit) ? `You've spent ${M.money(Bk.spentThisMonth(edit), 2)} on ${edit.toLowerCase()} in the last 30 days, so new ${edit.toLowerCase()} payments would be declined for now.` : undefined} />
      <div className="ds-btnrow">{num(v) > 0 && <D.Pill primary onClick={() => save(num(v))}>Save</D.Pill>}{lim[edit] && <D.Pill onClick={() => save(null)}>Remove limit</D.Pill>}<button className="ds-textbtn" onClick={() => setEdit('')}>Cancel</button></div></>}
  </>
}

/* ---------- Lost, stolen, damaged; the new card; activation ---------- */
function Lost({ nav }: { nav: Nav }) {
  const s = St.useS(x => x); const c = s.card
  const [why, setWhy] = useState<'lost' | 'stolen' | 'damaged' | 'missing'>('lost'); const [to, setTo] = useState(s.addr)
  const kase = Bk.openCase('replacement')[0]
  if (kase) return <ReplacementStatus nav={nav} b={kase} />
  const newNumber = why === 'lost' || why === 'stolen'
  return <>
    {!c.frozen && Mod.on('card.controls') && <D.Note title="Freeze it first" action="Freeze my card" onAction={() => { St.set(x => ({ card: { ...x.card, frozen: true } })); D.toast('Card frozen. New payments are blocked.') }}>Nobody can use it while it's frozen. If it turns up, unfreeze it and carry on.</D.Note>}
    {c.frozen && <D.AssistantNote>{`Card ending ${c.last4} is frozen. Direct debits and refunds still work.`}</D.AssistantNote>}
    <D.Sec title="What happened?" />
    <D.Choice list label="What happened" value={why} onChange={k => setWhy(k as any)} items={[{ key: 'lost', title: "I've lost it" }, { key: 'stolen', title: 'It was stolen' }, { key: 'damaged', title: "It's damaged or not working" }, { key: 'missing', title: 'A new card never arrived' }]} />
    <p className="ds-row-s">{newNumber ? 'Your card is cancelled for good and the new one has a new number. Direct debits and subscriptions move across by themselves.' : why === 'missing' ? 'The missing card is cancelled and a new one is sent with a new number, in case it went astray.' : 'The new card keeps the same number. Your current card works until you activate the new one.'}</p>
    {why === 'stolen' && <D.List><D.Row icon="alert" title="Payments I don't recognise" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "Payments I don't recognise") }} /></D.List>}
    <D.Sec title="Send the new card to" />
    <D.Choice list label="Delivery address" value={to} onChange={setTo} items={s.addresses.map(a => ({ key: a.id, title: a.label, sub: a.line }))} />
    <D.Primary onClick={() => here(FLOWS.replaceAsk({ why: why === 'missing' ? 'missing' : why, to }))}>Order a new card</D.Primary>
    <p className="ds-centre-s">Free, and usually there in 3 to 5 working days.</p>
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
    {l4.length === 4 && exp.length === 5 && <D.Primary onClick={go}>Activate</D.Primary>}
    <p className="app-hint" style={{ position: 'static' }}>{`Demo: the new card ends ${Bk.newCardLast4()} and expires ${Bk.EXPIRY}`}</p>
  </>
}

/* ---------- Disputes ---------- */
function Dispute({ nav, arg }: { nav: Nav; arg: string }) {
  const s = St.useS(x => x); const M = useMarket()
  const t = arg ? s.txns.find(x => x.id === arg) : undefined
  const [reason, setReason] = useState(Bk.DISPUTE_REASONS[0]); const [amt, setAmt] = useState(t ? t.amount.toFixed(2) : ''); const [note, setNote] = useState(''); const [file, setFile] = useState(''); const [q, setQ] = useState('')
  if (!t) {
    const list = s.txns.filter(x => !x.refund && x.cat !== 'Payment' && Date.now() - x.at < 120 * 864e5 && (!q.trim() || x.merchant.toLowerCase().includes(q.trim().toLowerCase())))
    return <>
      <p className="ds-row-s">Pick the payment. You can dispute card payments from the last 120 days.</p>
      <D.Search value={q} onChange={setQ} placeholder="Search payments" />
      {groupDays(list, M).map(([d, l]) => <React.Fragment key={d}><D.Label>{d}</D.Label><D.List>{l.map(x => <D.Txn key={x.id} cat={x.cat} name={x.merchant} meta={x.cat} amount={x.amount} format={(n: number) => M.money(n, 2)} chev onClick={() => nav.go('cardx', 'dispute:' + x.id)} />)}</D.List></React.Fragment>)}
    </>
  }
  const kase = s.bookings.find(b => b.extra?.case === 'dispute' && b.extra?.txn === t.id)
  if (kase) return <>{kase.tracker && <D.Track title={`Disputed: ${t.merchant}`} sub={`${M.money(kase.extra.amount, 2)} · ${kase.sub} · ${kase.ref}`} steps={kase.tracker.steps} current={kase.tracker.current} eta={kase.extra?.outcome || kase.tracker.eta} tone={kase.tracker.tone === 'warn' ? 'warn' : undefined} />}<D.List><D.Row icon="doc" title="All your cases" chev onClick={() => nav.go('cardx', 'cases')} /></D.List></>
  const a = Math.round(num(amt) * 100) / 100
  return <>
    <D.List><D.Txn cat={t.cat} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} format={(n: number) => M.money(n, 2)} /></D.List>
    <D.AssistantNote>It helps to contact the shop first. If they haven't put it right, the bank can.</D.AssistantNote>
    <D.Sec title="What went wrong?" />
    <D.Choice list label="What went wrong" value={reason} onChange={setReason} items={Bk.DISPUTE_REASONS.map(r => ({ key: r, title: r }))} />
    {reason === "I don't recognise it" ? <D.List><D.Row icon="alert" title="Report it as fraud instead" sub="Your card is frozen and the fraud team takes it from here" chev onClick={() => { nav.go('chat'); run({ f: 'bank', a: { topic: 'fraud' } }, "I don't recognise this payment") }} /></D.List> : <>
      <D.Field label="Amount you're disputing" prefix={sym(M)} inputMode="decimal" value={amt} onChange={setAmt} hint={a > t.amount ? `The most is the payment itself, ${M.money(t.amount, 2)}.` : undefined} />
      <label className="ds-field"><span className="ds-field-l">What happened (optional)</span><textarea className="app-ta" value={note} maxLength={600} onChange={e => setNote((e.target as HTMLTextAreaElement).value)} placeholder="Dates, what you were told, what you've tried" /></label>
      <D.List><label className="ds-row" style={{ cursor: 'pointer' }}><span className="ds-row-ic"><Icon name="doc" size={18} stroke={2} /></span><span className="ds-row-b"><span className="ds-row-t">{file ? file : 'Add a receipt or photo'}</span><span className="ds-row-s">{file ? 'Attached' : 'Optional'}</span></span><input type="file" accept="image/*,application/pdf" style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} onChange={e => setFile((e.target as HTMLInputElement).files?.[0]?.name || '')} /><span className="ds-opill">{file ? 'Change' : 'Add'}</span></label></D.List>
      {a > 0 && <D.Primary onClick={() => here(FLOWS.disputeAsk({ txn: t.id, reason, amount: Math.min(a, t.amount), note: note.trim() || undefined, photo: !!file }))}>Review and send</D.Primary>}
    </>}
  </>
}

/* ---------- Your cases ---------- */
function Cases({ nav }: { nav: Nav }) {
  const bs = St.useS(s => s.bookings); const M = useMarket()
  const list = bs.filter(b => b.extra?.case || b.title === 'Replacement card')
  if (!list.length) return <D.AssistantNote>No open cases. New cards, disputes and limit requests show here while the bank works on them.</D.AssistantNote>
  return <>{list.map(b => b.tracker ? <D.Track key={b.id} title={b.title} sub={[b.sub, b.extra?.case === 'dispute' ? M.money(b.extra.amount, 2) : '', b.ref].filter(Boolean).join(' · ')} steps={b.tracker.steps} current={b.status === 'delivered' && !b.extra?.activated ? b.tracker.steps.length : b.tracker.current} eta={b.extra?.outcome || (b.status === 'delivered' && !b.extra?.activated ? 'Ready to activate' : b.extra?.activated ? 'Activated' : b.tracker.eta)} tone={b.tracker.tone === 'warn' ? 'warn' : undefined}>{b.status === 'delivered' && !b.extra?.activated && Mod.on('card.activate') && <div><D.Pill primary onClick={() => nav.go('cardx', 'activate')}>Activate</D.Pill></div>}</D.Track> : null)}</>
}

/* ---------- Credit limit ---------- */
function Limit() {
  const c = St.useS(s => s.card); St.useS(s => s.bookings); const M = useMarket()
  const [mode, setMode] = useState('Ask for more'); const [pick, setPick] = useState(''); const [other, setOther] = useState('')
  const step = c.limit >= 20000 ? 1000 : 500, floor = Math.ceil(Math.max(c.balance, step) / step) * step
  const lower = [0.75, 0.5, 0.25].map(f => Math.round(c.limit * f / step) * step).filter((v, i, xs) => v >= floor && v < c.limit && xs.indexOf(v) === i)
  const higher = [1.25, 1.5, 2].map(f => Math.round(c.limit * f / step) * step)
  const req = Bk.openCase('limit')[0]
  const to = pick === 'other' ? Math.round(num(other)) : +pick
  return <>
    <D.Hero value={M.money(c.limit)} title="Your credit limit" sub={`${c.balance < 0 ? `${M.money(-c.balance, 2)} in credit` : `${M.money(c.balance, 2)} used`} · ${M.money(Math.max(0, c.limit - c.balance), 2)} left`} />
    <D.Seg items={['Ask for more', 'Lower it']} value={mode} onChange={x => { setMode(x); setPick(''); setOther('') }} />
    {mode === 'Lower it' ? <>
      <p className="ds-row-s">Lowering it happens straight away. Raising it again later needs a check by the bank.</p>
      <D.Choice label="New limit" value={pick} onChange={setPick} items={[...lower.map(v => ({ key: String(v), title: M.money(v) })), { key: 'other', title: 'Another amount' }]} />
      {pick === 'other' && <D.Field label="New limit" prefix={sym(M)} inputMode="numeric" value={other} onChange={setOther} autoFocus hint={to && to < c.balance ? `It has to be at least your balance, ${M.money(c.balance, 2)}.` : to >= c.limit ? `Pick an amount below ${M.money(c.limit)}.` : undefined} />}
      {to > 0 && to < c.limit && to >= c.balance && <D.Primary onClick={() => here(F.limitAsk({ to }))}>{`Lower to ${M.money(to)}`}</D.Primary>}
    </> : req ? <>{req.tracker && <D.Track title={req.title} sub={`${req.sub} · ${req.ref}`} steps={req.tracker.steps} current={req.tracker.current} eta={req.extra?.outcome || req.tracker.eta} />}</> : <>
      <p className="ds-row-s">The bank checks what you can afford before saying yes. It won't affect your credit score unless you go ahead.</p>
      <D.Choice label="Limit you'd like" value={pick} onChange={setPick} items={[...higher.map(v => ({ key: String(v), title: M.money(v) })), { key: 'other', title: 'Another amount' }]} />
      {pick === 'other' && <D.Field label="Limit you'd like" prefix={sym(M)} inputMode="numeric" value={other} onChange={setOther} autoFocus />}
      {to > c.limit && <D.Primary onClick={() => here(FLOWS.limitRequestAsk({ to }))}>Send to the bank</D.Primary>}
    </>}
  </>
}

/* ---------- Phone wallet: this phone's wallet only ---------- */
function PhoneWallet() {
  const w = St.useS(s => s.seen.wallets || {}) as Record<string, number>; const M = useMarket()
  const ua = navigator.userAgent, k = /iPhone|iPad|Macintosh/.test(ua) ? 'apple' : /Samsung/i.test(ua) ? 'samsung' : 'google'
  const name = ({ apple: 'Apple Wallet', google: 'Google Wallet', samsung: 'Samsung Wallet' } as any)[k]
  return <>
    <D.Hero title={w[k] ? `In ${name}` : `Add to ${name}`} sub="Pay by holding your phone or watch near the reader, and online with one tap. Points are earned the same as with the card." />
    <D.List><D.ActionRow icon="wallet" title={name} sub={w[k] ? `Added on ${M.date(new Date(w[k]), 'day')}` : 'Not added'} action={w[k] ? 'Remove' : 'Add'} primary={!w[k]} onAction={() => { if (w[k]) { FLOWS.walletRemove({ wallet: k }); D.toast(`Removed from ${name}`) } else here(FLOWS.walletAsk({ wallet: k as any })) }} /></D.List>
    <p className="ds-foot"><Icon name="shield" size={14} stroke={2} />Your phone uses its own device number, so your card number is never shared with shops.</p>
  </>
}

/* ---------- Travel notice: where, then dates as chips ---------- */
function Travel() {
  St.useS(s => s.seen.notices); const c = St.useS(s => s.card); const M = useMarket(); const list = Bk.notices()
  const today = F.iso(new Date()); const [where, setWhere] = useState(''); const [start, setStart] = useState('0'); const [len, setLen] = useState('7')
  const from = F.addDays(today, +start), to = F.addDays(from, +len - 1)
  return <>
    <p className="ds-row-s">Tell the bank where you're going so payments there aren't blocked as unusual.</p>
    {!c.abroad && Mod.on('card.controls') && <D.List><D.ActionRow icon="plane" title="Payments abroad are off" sub="Turn them on before you go" action="Turn on" primary onAction={() => here(F.cardControl({ control: 'abroad', on: true }))} /></D.List>}
    {list.length > 0 && <><D.Sec title="Your trips" /><D.List>{list.map(n => <D.Row key={n.id} icon="globe" title={n.where} sub={`${M.date(n.from, 'day')} to ${M.date(n.to, 'day')}`} value={<button className="ds-textbtn" onClick={() => { Bk.noticeRemove(n.id); D.toast('Travel notice removed') }}>Remove</button>} />)}</D.List></>}
    <D.Sec title="Add a trip" />
    <D.Field label="Where are you going?" value={where} onChange={setWhere} placeholder="Country or city" />
    <D.Choice label="When you leave" value={start} onChange={setStart} items={[{ key: '0', title: 'Today' }, { key: '1', title: 'Tomorrow' }, { key: '7', title: 'In a week' }, { key: '14', title: 'In two weeks' }]} />
    <D.Choice label="How long" value={len} onChange={setLen} items={[{ key: '3', title: '3 days' }, { key: '7', title: 'A week' }, { key: '14', title: 'Two weeks' }, { key: '30', title: 'A month' }]} />
    <p className="ds-row-s">{`${M.date(from, 'day')} to ${M.date(to, 'day')}`}</p>
    {where.trim() && <D.Primary onClick={() => { const r = FLOWS.noticeAdd({ where, from, to }); D.toast(r.say ? first(r.say) : 'Added'); if (!/^Add/.test(r.say || '')) setWhere('') }}>Add travel notice</D.Primary>}
  </>
}
