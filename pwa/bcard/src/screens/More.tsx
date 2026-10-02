import React from 'react'
import { useStore, useNav, useAcct, ALERT0 } from '../store'
import { MEMBER, IMG, gbp } from '../data'
import { benefitsFor } from '../benefits'
import { Ic, Row, Sec, Toggle, Page, Spark, GTag } from '../ui'

const mine = (m: any, biz?: boolean) => !m.scope || m.scope === 'all' || (biz ? m.scope === 'biz' : m.scope === 'personal')

export function More() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  return <div className="scroll">
    <div className="pad">
      <div className="hdr"><h1 className="h1" tabIndex={-1}>More</h1></div>
      <button className="cardp" style={{ flexDirection: 'row', alignItems: 'center', gap: 14, textAlign: 'left' }} onClick={() => nav.push('profile')}>
        <div className="avatar" style={{ width: 52, height: 52, borderRadius: 26, fontSize: 16 }}>ST</div>
        <div style={{ flex: 1 }}><p style={{ fontSize: 17, fontWeight: 700 }}>{MEMBER.name}</p><p className="small">{c.business ? MEMBER.company : MEMBER.email}</p></div>
        <Ic n="chev" s={16} c="#8A94A3" />
      </button>
      <Sec title="Account" />
      <div className="list">
        <Row ic="refresh" t="Direct Debit" s={a.cs.dd ? 'On' : 'Not set up'} onClick={() => nav.push('dd')} />
        <Row ic="doc" t="Statements" onClick={() => nav.push('statements')} />
        <Row ic="bell" t="Alerts" s="Payments, statements, spending" onClick={() => nav.push('alerts')} />
        {!c.business && <Row ic="chart" t="Credit score" s="From Experian" onClick={() => nav.push('score')} />}
        {c.id === 'forward' && <Row ic="target" t="Price Promise" s={`${a.prog.onTime} paid on time · ${a.prog.needed - a.prog.onTime} due dates to go`} onClick={() => nav.push('promise')} />}
        {!c.business && <Row ic="cal" t="Payment date" s={a.cs.dueDay ? 'Change requested' : 'The 12th of each month'} onClick={() => nav.push('duedate')} />}
        {!c.charge && <Row ic="chart" t="Repayment calculator" s="See what paying more saves" onClick={() => nav.push('calc')} />}
      </div>
      <Sec title="Your card" />
      <div className="list">
        <Row ic="grid" t="Everything with your card" s={`${benefitsFor(c.id).length} benefits, protections and services`} onClick={() => nav.push('benefits')} />
        <Row ic="lock" t="Security" s="Approve payments, PINsentry, fraud" onClick={() => nav.push('security')} />
        <Row ic="globe" t="Going abroad" s="Fees, emergency cash and help" onClick={() => nav.push('abroad')} />
        {c.business && <Row ic="settings" t="MyControls" s="Where each card can be used" onClick={() => nav.push('controls')} />}
      </div>
      <Sec title="Gratifi" tag={<GTag text="Your assistant" />} />
      <div className="list">
        <div className="row"><div className="ic" style={{ background: 'var(--accent-soft)' }}><Spark s={18} /></div><div style={{ flex: 1 }}><p className="t">Suggestions from your spending</p><p className="s">Notes, offers and trip ideas</p></div><Toggle on={!!s.suggest} onChange={() => d({ type: 'suggest', on: !s.suggest })} label="Suggestions from your spending" /></div>
        <Row ic="brain" t="What Gratifi remembers" s={`${s.memory.filter((m: any) => mine(m, c.business)).length} things · you can change any of them`} onClick={() => nav.push('gratifi')} />
        <Row ic="cal" t="Your bookings" s={a.cs.bookings.some(b => b.status === 'booked') ? `${a.cs.bookings.filter(b => b.status === 'booked').length} booked` : 'None yet'} onClick={() => nav.push('bookings')} />
      </div>
      <Sec title="Help" />
      <div className="list">
        <Row ic="chat" t="Help and support" s={c.business ? 'Cardholder line 24/7' : 'Chat 24/7, calls, money worries, accessibility'} onClick={() => nav.push('help')} />
        <Row ic="flag" t="Lost or stolen card" onClick={() => nav.push('lost')} />
      </div>
      <Sec title="This demo" />
      <div className="list">
        <Row ic="card" t="Switch card" s={`You’re viewing ${c.name}`} onClick={() => d({ type: 'leave' })} />
        <Row ic="refresh" t="Reset this card" s="Start this card’s demo again" onClick={() => { d({ type: 'resetCard' }); nav.toast('This card is back to the start.') }} />
        <Row ic="info" t="About this concept" onClick={() => nav.push('about')} />
      </div>
    </div>
    <div className="space-tabs" />
  </div>
}

export function Profile() {
  const nav = useNav(); const a = useAcct()
  return <Page title="Your details">
    <div className="list">
      <div className="kv"><span>Name</span><span>{MEMBER.name}</span></div>
      {a.c.business && <div className="kv"><span>Business</span><span>{MEMBER.company}</span></div>}
      <div className="kv"><span>Email</span><span>{MEMBER.email}</span></div>
      <div className="kv"><span>Mobile</span><span>{MEMBER.phone}</span></div>
      <div className="kv"><span>Address</span><span>{MEMBER.address}</span></div>
    </div>
    <button className="btn light" onClick={() => nav.toast('In the live app, you can update these here.')}>Update your details</button>
  </Page>
}

export function Alerts() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct(); const biz = a.c.business
  const cfg = s.alertCfg || ALERT0
  const T = ({ id, t, sub, children }: { id: string; t: string; sub: string; children?: React.ReactNode }) => <div className="row" style={{ flexWrap: 'wrap' }}><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{sub}</p></div><Toggle on={!!s.alerts[id]} onChange={() => d({ type: 'alert', id })} label={t} />{s.alerts[id] && children && <div style={{ width: '100%', paddingTop: 8 }}>{children}</div>}</div>
  const Amt = ({ k, label }: { k: 'balance' | 'spend'; label: string }) => <div className="chips">{[250, 500, 1000, 2000].map(v => <button key={v} className={'chip' + (cfg[k] === v ? ' on' : '')} aria-pressed={cfg[k] === v} aria-label={`${label} ${gbp(v, 0)}`} onClick={() => { d({ type: 'alertCfg', value: { [k]: v } }); nav.toast(`We’ll tell you when it passes ${gbp(v, 0)}.`) }}>{gbp(v, 0)}</button>)}</div>
  return <Page title="Alerts">
    <h1 className="h1">Alerts</h1>
    <p className="sub">{biz ? 'Choose what you hear about.' : 'Six free alerts, by text or email, plus notes in the app.'}</p>
    {!biz && <><p className="label">Send by</p><div className="seg" role="tablist">{(['Text', 'Email', 'Both'] as const).map(x => <button key={x} role="tab" aria-selected={cfg.channel === x} className={cfg.channel === x ? 'on' : ''} onClick={() => d({ type: 'alertCfg', value: { channel: x } })}>{x}</button>)}</div></>}
    <div className="list">
      {!biz && <T id="weekly" t="Weekly balance" sub={`Every ${({ Mon: 'Monday', Wed: 'Wednesday', Fri: 'Friday', Sun: 'Sunday' } as any)[cfg.day] || 'Monday'}`}><div className="chips">{['Mon', 'Wed', 'Fri', 'Sun'].map(x => <button key={x} className={'chip' + (cfg.day === x ? ' on' : '')} aria-pressed={cfg.day === x} onClick={() => d({ type: 'alertCfg', value: { day: x } })}>{x}</button>)}</div></T>}
      {!biz && <T id="received" t="Payment received" sub="When your payment reaches us" />}
      <T id="statement" t="Statement ready" sub="When a new statement is ready" />
      <T id="due" t="Payment due" sub="Before your due date" />
      {!biz && <T id="balance" t="Balance limit" sub={cfg.balance ? `When your balance passes ${gbp(cfg.balance, 0)}` : 'Pick an amount'}><Amt k="balance" label="Balance limit" /></T>}
      {!biz && <T id="spend" t="Monthly spend limit" sub={cfg.spend ? `When this month’s spending passes ${gbp(cfg.spend, 0)}` : 'Pick an amount'}><Amt k="spend" label="Monthly spend limit" /></T>}
      <div className="row"><div className="ic" style={{ background: 'var(--accent-soft)' }}><Spark s={18} /></div><div style={{ flex: 1 }}><p className="t">Notes from Gratifi</p><p className="s">When something on your account is worth knowing</p></div><Toggle on={!!s.alerts.gratifi} onChange={() => d({ type: 'alert', id: 'gratifi' })} label="Notes from Gratifi" /></div>
    </div>
    {!biz && <><p className="label">Always on</p>
      <div className="list">{['Nearing or over your credit limit', 'Changes to your address, phone or cardholders', 'A promotional rate about to end', 'Your Direct Debit amount'].map(t => <Row key={t} ic="bell" t={t} chev={false} />)}</div>
      <p className="tiny">Alerts are free in the UK.</p></>}
  </Page>
}

export function GratifiSettings() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct()
  const memory = s.memory.filter((m: any) => mine(m, a.c.business))
  const groups = Array.from(new Set(memory.map(m => m.group)))
  return <Page title="What Gratifi remembers">
    <p className="sub">Gratifi uses these to make suggestions. Remove anything and it’s forgotten straight away.</p>
    {memory.length === 0 && <p className="note g"><Spark s={18} />Nothing saved. Gratifi will still answer questions about your account.</p>}
    {groups.map(g => <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="label">{g}</p>
      <div className="list">{memory.filter(m => m.group === g).map(m => <div key={m.id} className="row"><div style={{ flex: 1 }}><p className="t">{m.text}</p><p className="s">{m.source}</p></div>
        <button className="btn sm light" aria-label={`Forget ${m.text}`} onClick={() => { d({ type: 'forget', id: m.id }); nav.toast(`Forgotten: ${m.text}.`, { type: 'restoreMemory', item: m }) }}>Forget</button></div>)}</div>
    </div>)}
    {memory.length > 0 && <button className="btn light" onClick={() => { d({ type: 'forgetAll', ids: memory.map(m => m.id) }); nav.toast('Everything forgotten.') }}>Forget everything</button>}
    <div className="note blue"><Ic n="info" s={18} c="#1269AE" /><div>Gratifi never spends money without asking you first. Every booking needs your Face ID.</div></div>
  </Page>
}

export function Help() {
  const nav = useNav(); const a = useAcct(); const biz = a.c.business
  const call = (who: string, n: string) => () => nav.toast(`In the live app, this calls ${who} on ${n}.`)
  const [open, setOpen] = React.useState<string | null>(null)
  const Sub = ({ id, t, s, items }: { id: string; t: string; s: string; items: React.ReactNode[] }) => <>
    <button className="row" onClick={() => setOpen(open === id ? null : id)} aria-expanded={open === id}><div style={{ flex: 1 }}><p className="t">{t}</p><p className="s">{s}</p></div><Ic n={open === id ? 'up' : 'down'} s={16} c="#8A94A3" /></button>
    {open === id && <div style={{ padding: '4px 0 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>{items.map((x, i) => <p key={i} className="small" style={{ color: 'var(--ink)' }}>{x}</p>)}</div>}</>
  return <Page title="Help">
    <h1 className="h1">How can we help?</h1>
    <p className="sub">Gratifi answers most questions straight away. For anything else, the Barclaycard team is here.</p>
    <div className="list">
      <Row ic="chat" t="Ask Gratifi" s="Answers about your account" onClick={() => nav.push('ask')} />
      {biz ? <>
        <Row ic="phone" t="Cardholder line" s="0800 008 008 · 24/7" onClick={call('Barclaycard for Business', '0800 008 008')} />
        <Row ic="shield" t="Fraud line" s="0800 015 9059" onClick={call('the fraud team', '0800 015 9059')} />
      </> : <>
        <Row ic="users" t="Chat with the team" s="24/7 in the app, or in Apple Messages" onClick={() => nav.toast('In the live app, this opens a chat with the Barclaycard team.')} />
        <Row ic="phone" t="Call us" s="0800 151 0900 · Mon to Fri 7am to 8pm, Sat 9am to 5pm" onClick={call('Barclaycard', '0800 151 0900')} />
        <Row ic="globe" t="Calling from abroad" s="+44 1604 230 230 · 24/7" onClick={call('Barclaycard', '+44 1604 230 230')} />
      </>}
      <Row ic="flag" t="Lost or stolen card" s="Block it now" onClick={() => nav.push('lost')} />
    </div>
    {!biz && <>
      <Sec title="Support" />
      <div className="list">
        <Sub id="money" t="Money worries" s="If paying is getting hard" items={['Worried about paying: 0800 056 1411. Missed a payment: 0800 161 5205. Weekdays 8am to 9pm, weekends 9am to 9pm.', 'Or send a message from here. Talking early gives you more options.', 'Free, independent advice: StepChange, National Debtline, MoneyHelper and Citizens Advice.', <button key="c" className="btn sm light" onClick={() => nav.push('calc')}>Repayment calculator</button>]} />
        <Sub id="access" t="Accessibility" s="BSL, braille, large print, audio" items={['British Sign Language with SignVideo: weekdays 8am to 8pm, Saturday 8am to 1pm.', 'Statements and PIN reminders in braille, large print or audio: 0800 161 5326.', 'Text Relay: 18001 0800 161 5276.']} />
        <Sub id="someone" t="Someone else managing your account" s="Power of Attorney, or after a death" items={['Register a Power of Attorney with us.', 'To tell us about a death, use the Death Notification Service or call 0800 161 5199.']} />
        <Sub id="complain" t="Make a complaint" s="And what happens next" items={['Send us a message and we’ll reply within 24 hours.', 'We update you at 4 weeks and give a final response by 8 weeks.', 'If you’re not happy with it, you can go to the Financial Ombudsman Service.']} />
      </div>
      <div className="list"><Row ic="trash" t="Close your account" s="Pay off the balance first" onClick={() => nav.toast('In the live app, this starts closing your account, after a check with you.')} /></div>
    </>}
    <a className="tiny" href={biz ? 'https://www.barclaycard.co.uk/business/cards/business-card-customer-home' : 'https://www.barclaycard.co.uk/personal/contact-us'} target="_blank" rel="noreferrer" style={{ color: 'var(--soft)', minHeight: 44, display: 'flex', alignItems: 'center' }}>Contact details as published by Barclaycard, 28 Sep 2026</a>
  </Page>
}

export function About() {
  return <Page title="About this concept">
    <img src={IMG.appIcon} alt="" style={{ width: 56, height: 56, borderRadius: 16 }} />
    <h1 className="h1">Gratifi, inside a Barclaycard app</h1>
    <p className="sub">A concept by Reward360 for Barclays. It shows how an assistant can sit inside a bank’s own app and help every member get more from their card.</p>
    <div className="list">
      <Row ic="card" t="Everything the app already does" s="Balance, payments, statements, card controls, credit and benefits" chev={false} />
      <div className="row"><div className="ic" style={{ background: 'var(--accent-soft)' }}><Spark s={18} /></div><div style={{ flex: 1 }}><p className="t">What Gratifi adds</p><p className="s">Timely notes for each card, answers about the account, and partner bookings that pay money back</p></div></div>
      <Row ic="target" t="How it decides" s="Numbers and rules come from the bank’s systems. The assistant only chooses the words." chev={false} />
    </div>
    <p className="small">Card terms are from Barclaycard’s public pages on 28 Sep 2026. Member data, partners, offers and prices are invented for the demo. Not a Barclays product.</p>
    <p className="small">Contact: gratifi@reward360.co</p>
  </Page>
}
