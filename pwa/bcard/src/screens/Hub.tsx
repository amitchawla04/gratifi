// Everything Barclaycard gives each cardholder: the benefits hub, each benefit's terms, and the working screens behind them.
import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useStore, useNav, useAcct } from '../store'
import { gbp, DUE, MEMBER, r2 } from '../data'
import { Ic, Page, Row, Sec, GTag, Spark, Toggle, Sheet, useFaceId } from '../ui'
import { GROUPS, benefitsFor } from '../benefits'
import { scMonth, hasHotel } from '../engine'
import { Opt, AmountField, money } from './Money'

const Tick = ({ children }: { children: React.ReactNode }) => <div className="row" style={{ alignItems: 'flex-start', minHeight: 0, gap: 10 }}><span style={{ marginTop: 2 }}><Ic n="tick" s={16} c="#11774A" w={2.6} /></span><p style={{ fontSize: 15, lineHeight: 1.4, flex: 1 }}>{children}</p></div>
const Terms = ({ items }: { items: React.ReactNode[] }) => <div className="list">{items.map((t, i) => <Tick key={i}>{t}</Tick>)}</div>
const Src = ({ href, label }: { href: string; label: string }) => <a className="tiny" href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--soft)', minHeight: 44, display: 'flex', alignItems: 'center', gap: 6 }}><Ic n="arrow" s={14} c="#556070" />{label}</a>
const Call = (nav: ReturnType<typeof useNav>, who: string, num: string) => () => nav.toast(`In the live app, this calls ${who} on ${num}.`)
const visaPersonal = (id: string) => ['rewards', 'platinum', 'forward'].includes(id)
const fxFee = (id: string) => id === 'rewards' ? 0 : id === 'premium-plus' ? 0.0099 : 0.0299

// ---------- the hub ----------
export function BenefitsHub({ group }: { group?: string }) {
  const nav = useNav(); const a = useAcct(); const { c } = a
  const all = benefitsFor(c.id)
  const [q, setQ] = useState(''); const [g, setG] = useState<string>(group || 'All')
  const groups = GROUPS.filter(x => all.some(b => b.group === x))
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const shown = all.filter(b => (g === 'All' || b.group === g) && words.every(w => `${b.title} ${b.line} ${b.terms.join(' ')}`.toLowerCase().includes(w)))
  const volt = a.txns.find(t => t.merchant === 'Volt Electricals')
  return <Page title="Your card, in full">
    <h1 className="h1">Everything with {c.short.replace(' ', ' ')}</h1>
    <p className="sub">{all.length} things that come with this card, each with its terms and where Barclaycard publishes them.</p>
    <div className="field"><label htmlFor="bq">Search</label><input id="bq" value={q} onChange={e => setQ(e.target.value)} placeholder="For example: abroad, PIN, refund" /></div>
    <div className="chips" role="tablist" aria-label="Groups">{['All', ...groups].map(x => <button key={x} role="tab" aria-selected={g === x} className={'chip' + (g === x ? ' on' : '')} onClick={() => setG(x)}>{x}</button>)}</div>
    {g === 'All' && !q && <div className="gsec">
      <Sec title="Worth knowing this week" tag={<GTag text="Gratifi" />} />
      <div className="list">
        {c.id === 'premium-plus' ? <Row ic="shield" t="Amsterdam, Tue 6 Oct" s={hasHotel(a) ? 'Flights and hotel are on the card, as the travel insurance needs' : 'Flights are on the card. Put the hotel on it too: insurance needs the whole trip paid with the card'} onClick={() => nav.push('insurance')} />
          : c.business ? <Row ic="globe" t="Amsterdam, Tue 6 Oct" s="Pay in euros, not pounds. This card charges 2.99% on other currencies" onClick={() => nav.push('abroad')} />
          : <Row ic="globe" t="Lisbon, Fri 16 Oct" s={c.id === 'rewards' ? 'No fees abroad on this card, so pay in euros' : 'Pay in euros, not pounds. This card charges 2.99% on other currencies'} onClick={() => nav.push('abroad')} />}
        {!c.business && volt && <Row ic="shield" t="Section 75" s={`Your ${gbp(volt.amount, 0)} Volt Electricals purchase is in the £100 to £30,000 range`} onClick={() => nav.push('benefit', { id: 's75' })} />}
        {c.id === 'select-cashback' && <Row ic="pound" t="This month’s cashback" s={`${gbp(scMonth(a).spent)} spent since your statement on Fri 18 Sep`} onClick={() => nav.push('sccash')} />}
      </div>
    </div>}
    {groups.filter(x => g === 'All' || x === g).map(x => { const list = shown.filter(b => b.group === x); if (!list.length) return null
      return <React.Fragment key={x}><p className="label">{x}</p><div className="list">{list.map(b => <Row key={b.id} ic={b.ic} t={b.title} s={b.line} onClick={() => nav.push('benefit', { id: b.id })} />)}</div></React.Fragment> })}
    {shown.length === 0 && <div className="cardp"><p style={{ fontWeight: 700 }}>Nothing matches “{q}”</p><button className="btn sm light" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push('ask', { q })}><Spark s={16} />Ask Gratifi instead</button></div>}
    <p className="tiny">Checked against Barclaycard’s pages on 28 Sep 2026. Your card agreement has the final wording.</p>
  </Page>
}

export function BenefitDetail({ id }: { id: string }) {
  const nav = useNav(); const a = useAcct(); const { c } = a
  const b = benefitsFor(c.id).find(x => x.id === id)
  if (!b) return <Page title="Benefit"><p className="sub">This doesn’t come with your {c.short} card.</p></Page>
  const act = b.action
  const go = () => { if (!act) return; if (act.push) nav.push(act.push, act.params); else if (act.tab) nav.home(act.tab); else if (act.toast) nav.toast(act.toast) }
  return <Page title={b.group} cta={act ? <button className="btn big" onClick={go}>{act.label}</button> : undefined}>
    <div className="ic" style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--card)', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n={b.ic} s={24} /></div>
    <h1 className="h1">{b.title}</h1>
    <p className="sub">{b.line}</p>
    <Terms items={b.terms} />
    {b.how && <div className="note blue"><Ic n="info" s={18} c="#1269AE" /><div>{b.how}</div></div>}
    {b.gratifi && <div className="note g"><Spark s={18} /><div>{b.gratifi}</div></div>}
    <p className="label">Where this is published</p>
    <div className="list">{b.sources.map(s => <a key={s.url} className="row" href={s.url} target="_blank" rel="noreferrer">
      <div style={{ flex: 1, minWidth: 0 }}><p className="t">{s.label}</p><p className="s">{s.kind === 'Third party' ? 'Independent source, not Barclaycard' : s.kind}</p></div><Ic n="arrow" s={16} c="#8A94A3" /></a>)}</div>
    <p className="tiny">Checked 28 Sep 2026. Terms can change; your card agreement has the final wording.</p>
  </Page>
}

// ---------- Barclays Cashback Rewards ----------
const CBR = [
  { brand: 'Loom & Thread', cat: 'Clothing', pct: 15 }, { brand: 'Harbour Books', cat: 'Books', pct: 10 }, { brand: 'Oakden Home', cat: 'Homeware', pct: 6 },
  { brand: 'Moorland Outdoor', cat: 'Outdoor', pct: 5 }, { brand: 'Fleetwood Sports', cat: 'Sport', pct: 4 },
]
export function CashbackRewards() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const cbr = cs.cbr || { registered: true, redeemed: 0 }
  const ready = r2(Math.max(0, 12.6 - cbr.redeemed)); const pending = 3.85
  const [sheet, setSheet] = useState(false); const [to, setTo] = useState('card')
  const [face, run] = useFaceId()
  if (!visaPersonal(c.id)) return <Page title="Cashback Rewards"><p className="sub">Barclays Cashback Rewards is for personal Barclaycard Visa cards, so it isn’t on your {c.short} card.</p></Page>
  const label = to === 'card' ? 'to your card' : to === 'gift' ? 'as an e-gift card' : 'to charity'
  return <Page title="Cashback Rewards">
    <h1 className="h1">Barclays Cashback Rewards</h1>
    <p className="sub">Retailer offers of up to 15% back for Barclaycard Visa customers. They apply on their own when you pay with a registered card.</p>
    <div className="cardp">
      <p className="small">Ready to use</p><p style={{ fontSize: 30, fontWeight: 800 }} className="num">{gbp(ready)}</p>
      <p className="small">{gbp(pending)} pending. Cashback shows as pending after about 5 working days and is ready after about 35.</p>
      <button className="btn sm" style={{ alignSelf: 'flex-start' }} disabled={ready < 5} onClick={() => setSheet(true)}>Use my cashback</button>
      {ready < 5 && <p className="tiny">You can use cashback from £5.</p>}
    </div>
    <div className="list"><div className="row"><div className="ic"><Ic n="card" s={18} /></div><div style={{ flex: 1 }}><p className="t">Registered: card ending {a.cardLast4}</p><p className="s">Register up to five Barclaycard Visa cards</p></div><Toggle on={cbr.registered} label="Card registered" onChange={() => { d({ type: 'set', key: 'cbr', value: { ...cbr, registered: !cbr.registered } }); nav.toast(cbr.registered ? 'Card removed from Cashback Rewards.' : 'Card registered. Offers apply when you pay with it.') }} /></div></div>
    <Sec title="Your offers" />
    <div className="list">{CBR.map(o => <Row key={o.brand} ic="bag" t={o.brand} s={`${o.cat} · applies when you pay with this card`} r={<span className="r num" style={{ color: 'var(--good)' }}>{o.pct}%</span>} />)}</div>
    <div className="list"><Row ic="flag" t="Cashback missing?" s="Tell us within 60 working days of buying" onClick={() => nav.toast('In the live app, this opens a missing-cashback claim.')} /></div>
    <div className="note g"><Spark s={18} /><div>This is Barclays’ own cashback. Gratifi’s partner offers on the Rewards tab are separate.</div></div>
    <p className="tiny">Retailers and amounts are demo data.</p>
    <Src href="https://www.barclaycard.co.uk/personal/customer/barclaycard-cashback-rewards" label="Barclays Cashback Rewards, as published" />
    <AnimatePresence>{sheet && <Sheet label="Use your cashback" onClose={() => setSheet(false)}>
      <h2 className="h2">Use {gbp(ready)}</h2>
      <Opt on={to === 'card'} onClick={() => setTo('card')} t="Pay it to my card" s="Comes off your balance" />
      <Opt on={to === 'gift'} onClick={() => setTo('gift')} t="As an e-gift card" s="Choose a retailer next" />
      <Opt on={to === 'charity'} onClick={() => setTo('charity')} t="Give it to charity" s="Choose a charity next" />
      <button className="btn big" onClick={() => run(`Use ${gbp(ready)}`, () => { d({ type: 'cbrRedeem', amount: ready, to }); setSheet(false); nav.toast(`${gbp(ready)} sent ${label}.`) })}>Use {gbp(ready)} {label}</button>
    </Sheet>}</AnimatePresence>
    {face}
  </Page>
}

// ---------- Amazon rewards ----------
export function AmazonRewards() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const moved = cs.amazonMoved || 0; const left = r2(a.prog.earned - moved)
  const steps = [5, 10, 15, 20].filter(v => v <= left)
  const [amt, setAmt] = useState(steps[steps.length - 1] || 0)
  const [face, run] = useFaceId()
  if (c.id !== 'amazon') return <Page title="Amazon rewards"><p className="sub">Amazon rewards come with the Amazon Barclaycard.</p></Page>
  return <Page title="Amazon rewards" ask={false} cta={<button className="btn big" disabled={!amt} onClick={() => run(`Move ${gbp(amt, 0)} to Amazon`, () => { d({ type: 'set', key: 'amazonMoved', value: r2(moved + amt) }); nav.pop(); nav.toast(`${gbp(amt, 0)} is on its way to your Amazon account. It usually arrives within two hours.`) })}>{amt ? `Move ${gbp(amt, 0)} to Amazon` : 'Move from £5'}</button>}>
    <div className="cardp" style={{ alignItems: 'center', padding: 22 }}>
      <p className="small">Rewards ready to move</p>
      <p style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.2 }} className="num">{gbp(left)}</p>
      <p className="small">Moved to Amazon so far: {gbp(moved)}</p>
    </div>
    <p className="label">Move to your Amazon account</p>
    {steps.length ? <div className="chips">{steps.map(v => <button key={v} className={'chip' + (amt === v ? ' on' : '')} aria-pressed={amt === v} onClick={() => setAmt(v)}>{gbp(v, 0)}</button>)}</div>
      : <p className="small">You can move rewards in £5 steps once you have £5.</p>}
    <p className="small">Rewards become an Amazon gift card balance, in £5 steps. If they haven’t arrived after 24 hours, message Help.</p>
    <Sec title="How you earn" />
    <div className="list">
      <div className="kv"><span>At Amazon</span><span>1%</span></div>
      <div className="kv"><span>Everywhere else</span><span>0.5% until {a.prog.rateDrops}, then 0.25%</span></div>
      <div className="kv"><span>Selected Amazon events</span><span>2% for Prime members</span></div>
      <div className="kv"><span>Welcome gift</span><span>£20 Amazon gift card, added after approval</span></div>
    </div>
    <p className="small">Paying Amazon through another service, such as PayPal, doesn’t earn the 1%.</p>
    <Src href="https://www.barclaycard.co.uk/personal/help/credit-cards/amazon-earn-rates" label="Amazon earn rates, as published" />
    {face}
  </Page>
}

// ---------- DragonPass lounges ----------
export function Lounge() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const [n, setN] = useState(2); const [face, run] = useFaceId()
  if (c.id !== 'avios-plus') return <Page title="Airport lounges"><p className="sub">Lounge passes at £18.50 come with the Barclaycard Avios Plus card.</p></Page>
  const cost = r2(n * 18.5)
  return <Page title="Airport lounges" ask={false} cta={<button className="btn big" onClick={() => run(`Buy ${n} pass${n > 1 ? 'es' : ''}`, () => { d({ type: 'charge', merchant: 'DragonPass lounge passes', cat: 'Travel', amount: cost, note: `${n} × £18.50` }); d({ type: 'set', key: 'passes', value: (cs.passes || 0) + n }); nav.toast(`${n} pass${n > 1 ? 'es' : ''} bought for ${gbp(cost)}. They’re in the DragonPass Premier+ app.`) })}>Buy {n} for {gbp(cost)}</button>}>
    <h1 className="h1">Over 1,000 airport lounges</h1>
    <p className="sub">£18.50 a pass, per person, through the DragonPass Premier+ app. Passes also work for airport dining and spa offers.</p>
    <div className="cardp" style={{ alignItems: 'center', gap: 14 }}>
      <p className="small">Passes</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button className="rbtn" aria-label="Fewer" disabled={n <= 1} onClick={() => setN(n - 1)}><Ic n="down" /></button>
        <p style={{ fontSize: 36, fontWeight: 800, minWidth: 60, textAlign: 'center' }} className="num" aria-live="polite">{n}</p>
        <button className="rbtn" aria-label="More" disabled={n >= 6} onClick={() => setN(n + 1)}><Ic n="up" /></button>
      </div>
      {(cs.passes || 0) > 0 && <p className="tiny">{cs.passes} bought so far.</p>}
    </div>
    <div className="note g"><Spark s={18} /><div>Your Lisbon flight is on Fri 16 Oct. Two passes, for you and one guest, cost £37.</div></div>
    <Terms items={['Register once in the DragonPass Premier+ app', 'Cancel at least 72 hours before for a refund', 'With Barclays Avios Rewards and Premier Banking as well, you get four free passes a year and £5 a month back']} />
    <Src href="https://www.barclaycard.co.uk/personal/credit-cards/avios-plus" label="Barclaycard Avios Plus, as published" />
    {face}
  </Page>
}

// ---------- Barclaycard Entertainment ----------
export function Entertainment() {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct(); const { c } = a
  const fest = ['Download', 'Camp Bestival', 'Reading and Leeds', 'Wireless', 'Latitude', 'Creamfields', 'Isle of Wight Festival']
  return <Page title="Entertainment">
    <h1 className="h1">Barclaycard Entertainment</h1>
    <p className="sub">Early access to tickets and money off, for Barclaycard holders.</p>
    {c.id === 'amazon' && <div className="note"><Ic n="info" s={18} />Amazon lists presale access for this card, but Barclaycard’s terms exclude partner cards. Check before you buy.</div>}
    <p className="label">Festivals: early access and 10% off</p>
    <div className="list">{fest.map(f => <Row key={f} ic="ticket" t={f} onClick={() => nav.toast('In the live app, this opens Barclaycard Entertainment for this festival.')} />)}</div>
    <p className="label">Radio events: early access</p>
    <div className="list">{['Capital’s Summertime Ball', 'Capital’s Jingle Bell Ball', 'Radio X Presents'].map(f => <Row key={f} ic="ticket" t={f} onClick={() => nav.toast('In the live app, this opens Barclaycard Entertainment for this event.')} />)}</div>
    <Terms items={['5% off the basic price of selected event tickets, or 10% off presale tickets (not both)', '10% off food and drink at O2 Academy venues', 'Festival extras such as coach travel and phone charging']} />
    <div className="gsec"><div className="list"><div className="row"><div className="ic" style={{ background: 'var(--accent-soft)' }}><Spark s={18} /></div><div style={{ flex: 1 }}><p className="t">Tell me when a presale opens</p><p className="s">Gratifi sends a note the day it starts</p></div><Toggle on={!!s.alerts.presale} label="Tell me when a presale opens" onChange={() => { d({ type: 'alert', id: 'presale' }); nav.toast(s.alerts.presale ? 'Presale notes off.' : 'Done. Gratifi will tell you when a presale opens.') }} /></div></div></div>
    <Src href="https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-entertainment" label="Barclaycard Entertainment, as published" />
  </Page>
}

// ---------- abroad ----------
export function Abroad() {
  const nav = useNav(); const a = useAcct(); const { c } = a
  const fee = fxFee(c.id); const place = c.business ? 'Amsterdam, Tue 6 Oct' : 'Lisbon, Fri 16 Oct'
  const cash = c.id === 'rewards' ? 'No fee' : c.id === 'premium-plus' ? '3%, minimum £3' : c.business ? 'See your card agreement' : '2.99%, minimum £2.99'
  return <Page title="Going abroad">
    <h1 className="h1">Using your card abroad</h1>
    <p className="sub">Your next trip: {place}.</p>
    <div className="list">
      <div className="kv"><span>Spending in other currencies</span><span>{fee ? `${(fee * 100).toFixed(2)}% of the amount` : 'No fee'}</span></div>
      <div className="kv"><span>Cash withdrawals</span><span>{cash}</span></div>
      <div className="kv"><span>Exchange rate</span><span>{c.network}’s rate</span></div>
      <div className="kv"><span>Tell us you’re travelling?</span><span>No need</span></div>
    </div>
    <div className="note g"><Spark s={18} /><div>{fee ? `Pay in euros, not pounds: the shop’s rate is usually worse. On £400 of spending, this card’s fee is about ${gbp(400 * fee, 0)}.` : 'No fees on spending or cash abroad with this card. Pay in euros, not pounds: the shop’s rate is usually worse.'}</div></div>
    <Terms items={['Keep your mobile number up to date, so fraud checks can reach you abroad', 'If the card is lost abroad, block it in the app. The new card’s details show in the app']} />
    <Sec title="If something goes wrong" />
    <div className="list">
      <Row ic="flag" t="Card lost or stolen" s="Block it and get a new one" onClick={() => nav.push('lost')} />
      {c.business ? <><Row ic="phone" t="Cardholder line, 24/7" s="0800 008 008" onClick={Call(nav, 'Barclaycard for Business', '0800 008 008')} /><Row ic="shield" t="Fraud line" s="0800 015 9059" onClick={Call(nav, 'the fraud team', '0800 015 9059')} /></>
        : <><Row ic="wallet" t="Emergency cash" s="Up to £1,000 a week, usually within 24 hours, within your cash limit" onClick={Call(nav, 'Barclaycard emergency help', '+44 1604 230 230')} />
          <Row ic="card" t="Temporary card" s="Sent within three working days" onClick={Call(nav, 'Barclaycard emergency help', '+44 1604 230 230')} />
          <Row ic="phone" t="Call from abroad, 24/7" s="+44 1604 230 230 · in the UK 0800 161 5308" onClick={Call(nav, 'Barclaycard emergency help', '+44 1604 230 230')} /></>}
    </div>
    <Src href={c.business ? 'https://www.barclaycard.co.uk/business/cards/credit-cards/premium-plus/summary' : 'https://www.barclaycard.co.uk/personal/help-and-support/spending-abroad'} label="Spending abroad, as published" />
  </Page>
}

// ---------- security ----------
export function Security() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const pend = c.business ? { id: 'ap-biz', merchant: 'Designbox', what: 'Annual plan', amount: 540 } : { id: 'ap-per', merchant: 'Northway Air', what: 'Seat selection, Lisbon flight', amount: 24 }
  const state = cs.approved?.[pend.id]
  const [code, setCode] = useState<string | null>(null)
  const [face, run] = useFaceId()
  const decide = (v: 'yes' | 'no') => { d({ type: 'set', key: 'approved', value: { ...(cs.approved || {}), [pend.id]: v } }); if (v === 'yes') { d({ type: 'charge', merchant: pend.merchant, cat: c.business ? 'Software' : 'Travel', amount: pend.amount, note: pend.what }); nav.toast(`Approved. ${pend.merchant} can take the payment.`) } else nav.toast('Declined. If you didn’t try to pay, freeze your card and call us.') }
  const fraud = c.business ? ['0800 015 9059', ''] : ['0800 318 665', '+44 1452 828 309']
  return <Page title="Security">
    <h1 className="h1">Payments and fraud</h1>
    {!state && <div className="cardp">
      <p className="label">Waiting for you</p>
      <p style={{ fontSize: 17, fontWeight: 700 }}>{gbp(pend.amount)} to {pend.merchant}</p>
      <p className="small">{pend.what} · online · just now. Is this you?</p>
      <div style={{ display: 'flex', gap: 8 }}><button className="btn sm" onClick={() => run('Approve this payment', () => decide('yes'))}>Yes, approve</button><button className="btn sm light" onClick={() => decide('no')}>No, decline</button></div>
    </div>}
    {state && <div className={'note ' + (state === 'yes' ? 'green' : 'red')}><Ic n={state === 'yes' ? 'tick' : 'flag'} s={18} c={state === 'yes' ? '#11774A' : '#B42318'} /><div>{state === 'yes' ? `You approved ${gbp(pend.amount)} to ${pend.merchant}.` : `You declined ${gbp(pend.amount)} to ${pend.merchant}.`}</div></div>}
    <div className="list">
      <Row ic="key" t="Get a Mobile PINsentry code" s="When a website asks for one" onClick={() => run('Get a PINsentry code', () => setCode(String(Math.floor(10000000 + Math.random() * 89999999))))} />
      <div className="row"><div className="ic" style={cs.frozen ? { background: 'var(--blue-soft)' } : undefined}><Ic n="snow" s={18} /></div><div style={{ flex: 1 }}><p className="t">Freeze card</p><p className="s">{cs.frozen ? 'Payments are blocked' : 'Stop payments until you unfreeze'}</p></div><Toggle on={cs.frozen} label="Freeze card" onChange={() => { d({ type: 'freeze', on: !cs.frozen }); nav.toast(cs.frozen ? 'Card unfrozen.' : 'Card frozen.') }} /></div>
      <Row ic="flag" t="Report fraud" s={fraud[1] ? `${fraud[0]} · from abroad ${fraud[1]}` : fraud[0]} onClick={Call(nav, 'the fraud team', fraud[0])} />
    </div>
    <Sec title="How to check it’s really us" />
    <Terms items={['We never ask for your PIN, your login details or your full passcode', 'Our emails never include a link to log in, and show only your name and the last four digits of your card', 'Not sure? Stop, hang up, and call the number on the back of your card']} />
    <div className="list">
      <Row ic="shield" t="Take Five to Stop Fraud" s="Free advice on spotting scams" onClick={() => window.open('https://www.takefive-stopfraud.org.uk/', '_blank')} />
    </div>
    <p className="small">{c.business ? 'Your business isn’t liable for fraud on the account.' : 'If there’s fraud on your account, you get the money back, plus any interest you paid on it.'}</p>
    <Src href={c.business ? 'https://www.barclaycard.co.uk/business/cards/insurance' : 'https://www.barclaycard.co.uk/personal/customer/how-we-protect-you'} label="How Barclaycard protects you, as published" />
    <AnimatePresence>{code && <Sheet label="PINsentry code" onClose={() => setCode(null)}>
      <h2 className="h2">Your code</h2>
      <p style={{ fontSize: 36, fontWeight: 800, letterSpacing: 4, textAlign: 'center' }} className="num">{code.slice(0, 4)} {code.slice(4)}</p>
      <p className="sub">Type it where you’re asked. Never read it out to anyone who calls you.</p>
      <button className="btn big light" onClick={() => setCode(null)}>Done</button>
    </Sheet>}</AnimatePresence>
    {face}
  </Page>
}

// ---------- repayment calculator ----------
function simulate(bal: number, apr: number, pay: (b: number, interest: number) => number) {
  const r = apr / 100 / 12; let b = bal; let months = 0; let interest = 0
  while (b > 0.005 && months < 600) { const i = r2(b * r); const p = Math.min(b + i, pay(b, i)); if (p <= i) return null; interest += i; b = r2(b + i - p); months++ }
  return months >= 600 ? null : { months, interest: r2(interest) }
}
const dur = (m: number) => { const y = Math.floor(m / 12), mo = m % 12; return [y ? `${y} year${y > 1 ? 's' : ''}` : '', mo ? `${mo} month${mo > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ') }
export function Calc() {
  const a = useAcct(); const { c } = a
  const apr = parseFloat(c.purchaseRate) || 0
  const [bal, setBal] = useState(String(r2(a.balance))); const [pay, setPay] = useState(String(Math.max(50, Math.ceil(a.balance * 0.05 / 10) * 10)))
  if (c.charge || !apr) return <Page title="Repayment calculator"><p className="sub">Your {c.short} card is paid in full each month, so there’s no interest to work out.</p></Page>
  const B = money(bal); const P = money(pay)
  const mine = B > 0 && P > 0 ? simulate(B, apr, () => P) : null
  const minOnly = B > 0 ? simulate(B, apr, (b, i) => Math.max(5, r2(b * 0.01 + i))) : null
  return <Page title="Repayment calculator">
    <h1 className="h1">See what paying more saves</h1>
    <AmountField label="Balance to clear" value={bal} onChange={setBal} />
    <AmountField label="Monthly payment" value={pay} onChange={setPay} />
    <div className="chips">{[50, 100, 200, 400].map(v => <button key={v} className={'chip' + (P === v ? ' on' : '')} aria-pressed={P === v} onClick={() => setPay(String(v))}>{gbp(v, 0)}</button>)}</div>
    {B > 0 && P > 0 && <div className="cardp">
      <p className="small">Paying {gbp(P, 0)} a month</p>
      {mine ? <><p style={{ fontSize: 24, fontWeight: 800 }}>Cleared in {dur(mine.months)}</p><p className="small">Interest along the way: <b className="num">{gbp(mine.interest)}</b></p></> : <p style={{ fontWeight: 700 }}>That doesn’t cover the interest, so the balance wouldn’t go down.</p>}
    </div>}
    {minOnly && <div className="cardp">
      <p className="small">Paying only the minimum</p>
      <p style={{ fontSize: 20, fontWeight: 800 }}>Cleared in {dur(minOnly.months)}</p>
      <p className="small">Interest along the way: <b className="num">{gbp(minOnly.interest)}</b>{mine ? `, ${gbp(minOnly.interest - mine.interest)} more than paying ${gbp(P, 0)} a month` : ''}.</p>
    </div>}
    <p className="tiny">An estimate at {apr}% a year on purchases, with no new spending. It leaves out promotional rates{c.id === 'platinum' ? ', such as your 0% balance transfer,' : ''} and fees.</p>
    <Src href="https://www.barclaycard.co.uk/personal/customer/repayment-calculator-tool" label="Barclaycard repayment calculator" />
  </Page>
}

// ---------- payment date ----------
const ord = (n: number) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th')
export function DueDate() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { cs } = a
  const [day, setDay] = useState<number | null>(null)
  const days = [1, 5, 8, 15, 20, 25, 28]
  return <Page title="Payment date" ask={false} cta={<button className="btn big" disabled={!day} onClick={() => { d({ type: 'set', key: 'dueDay', value: day }); nav.pop(); nav.toast(`Request sent for the ${ord(day!)}. You’ll get a reply within 24 hours.`) }}>Ask to change it</button>}>
    <h1 className="h1">Change your payment date</h1>
    <p className="sub">Your payment is due on the 12th of each month. Pick the day that suits you.</p>
    {cs.dueDay && <div className="note blue"><Ic n="clock" s={18} c="#1269AE" /><div>You’ve asked for the {ord(cs.dueDay)}. We’ll reply within 24 hours.</div></div>}
    <div className="chips">{days.map(v => <button key={v} className={'chip' + (day === v ? ' on' : '')} aria-pressed={day === v} onClick={() => setDay(v)}>{v}</button>)}</div>
    <Terms items={['You can change it up to twice in 12 months', 'Not if you changed it in this statement period or the last one', `This month’s payment is still due ${DUE}`]} />
    <Src href="https://www.barclaycard.co.uk/personal/help/statements/statement-date" label="Changing your statement date, as published" />
  </Page>
}

// ---------- business ----------
const BLOCKS = ['Travel', 'Eating out', 'Fuel', 'Entertainment', 'Cash-like payments']
export function Controls() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { cs } = a
  const people = [{ key: 'me', name: `${MEMBER.name} (you)`, last4: a.cardLast4, limit: undefined as number | undefined }, ...cs.cardholders.map(h => ({ key: h.last4, name: h.name, last4: h.last4, limit: h.limit }))]
  const [who, setWho] = useState(people[1]?.key || 'me')
  const all = cs.controls || {}
  const cur = all[who] || { atm: true, online: true, instore: true, blocked: [] }
  const save = (v: typeof cur, msg: string) => { d({ type: 'set', key: 'controls', value: { ...all, [who]: v } }); nav.toast(msg) }
  const p = people.find(x => x.key === who)!
  if (!a.c.business) return <Page title="MyControls"><p className="sub">MyControls is for Barclaycard business cards.</p></Page>
  return <Page title="MyControls">
    <h1 className="h1">Where each card works</h1>
    <p className="sub">Changes apply straight away.</p>
    <div className="chips">{people.map(x => <button key={x.key} className={'chip' + (who === x.key ? ' on' : '')} aria-pressed={who === x.key} onClick={() => setWho(x.key)}>{x.name.split(' ')[0]}{x.key === 'me' ? ' (you)' : ''}</button>)}</div>
    <div className="cardp"><p style={{ fontWeight: 700 }}>{p.name}</p><p className="small">Card ending {p.last4}{p.limit ? ` · limit ${gbp(p.limit, 0)} a month` : ''}</p></div>
    <div className="list">{([['online', 'Online'], ['instore', 'In shops'], ['atm', 'Cash machines']] as const).map(([k, t]) => <div key={k} className="row"><div style={{ flex: 1 }}><p className="t">{t}</p></div><Toggle on={cur[k]} label={t} onChange={() => save({ ...cur, [k]: !cur[k] }, `${t} ${cur[k] ? 'switched off' : 'switched on'} for ${p.name.split(' ')[0]}.`)} /></div>)}</div>
    <p className="label">Block these types of spending</p>
    <div className="chips" style={{ flexWrap: 'wrap', margin: 0, padding: 0, WebkitMaskImage: 'none', maskImage: 'none' }}>{BLOCKS.map(b => { const on = cur.blocked.includes(b); return <button key={b} className={'chip' + (on ? ' on' : '')} aria-pressed={on} onClick={() => save({ ...cur, blocked: on ? cur.blocked.filter(x => x !== b) : [...cur.blocked, b] }, on ? `${b} allowed again.` : `${b} blocked for ${p.name.split(' ')[0]}.`)}>{on && <Ic n="tick" s={14} c="#fff" w={2.6} />}{b}</button> })}</div>
    <div className="list">
      <Row ic="snow" t="Freeze a card" s="Stop all payments on one card" onClick={() => nav.push('cardholders')} />
      <Row ic="wallet" t="Change a cardholder’s limit" onClick={() => nav.push('cardholders')} />
    </div>
    <p className="tiny">Categories shown are examples.</p>
    <Src href="https://www.barclaycard.co.uk/business/cards/online-servicing" label="Barclaycard business online servicing, as published" />
  </Page>
}

export function BizRewards() {
  const nav = useNav()
  const offers = [
    { t: 'AA breakdown cover', s: 'Up to 66% off', how: 'Use the code in the offer', src: 'Barclaycard' },
    { t: 'BT and EE business services', s: '2% back', how: 'Paid back automatically within 5 working days', src: 'Reported by reviewers' },
    { t: 'AXA Health business plan', s: '10% back', how: 'Paid back automatically within 5 working days', src: 'Reported by reviewers' },
  ]
  return <Page title="Business Rewards">
    <h1 className="h1">Business Rewards</h1>
    <p className="sub">Savings for Barclaycard business cardholders, run through Mastercard Business Savings.</p>
    <div className="list">{offers.map(o => <Row key={o.t} ic="bag" t={o.t} s={`${o.s} · ${o.how}`} onClick={() => nav.toast('In the live app, this opens the offer.')} />)}</div>
    <p className="tiny">AA from Barclaycard’s page; BT, EE and AXA Health as reported in independent reviews. Offers change.</p>
    <Sec title="Also for your business" />
    <div className="list">
      <Row ic="doc" t="FreshBooks accounting" s="A plan worth over £260 a year for new cardholders" onClick={() => nav.toast('In the live app, this opens the FreshBooks offer.')} />
      <Row ic="users" t="Mastercard Strive" s="Free mentoring and masterclasses" onClick={() => nav.toast('In the live app, this opens Mastercard Strive.')} />
    </div>
    <Src href="https://www.barclaycard.co.uk/business/cards/rewards" label="Business Rewards, as published" />
  </Page>
}

export function Insurance() {
  const nav = useNav(); const a = useAcct()
  const hotel = hasHotel(a)
  if (a.c.id !== 'premium-plus') return <Page title="Insurance"><p className="sub">Travel insurance comes with the Premium Plus card.</p></Page>
  return <Page title="Travel insurance">
    <h1 className="h1">Business travel insurance</h1>
    <p className="sub">Cover only applies when the whole trip is paid with this card.</p>
    <div className="gsec">
      <Sec title="Amsterdam, Tue 6 to Thu 8 Oct" tag={<GTag text="Gratifi trip check" />} />
      <div className="list">
        <Row ic="plane" t="Flights" s="Northway Air, £412.60, paid with this card" r={<Ic n="tick" s={18} c="#11774A" w={2.6} />} />
        <Row ic="sofa" t="Hotel" s={hotel ? 'Booked with Gratifi, paid with this card' : 'Not booked yet'} r={hotel ? <Ic n="tick" s={18} c="#11774A" w={2.6} /> : undefined} onClick={hotel ? undefined : () => nav.push('item', { id: 'b-hotel' })} />
      </div>
      {!hotel && <p className="small">Book the hotel on this card too, so the whole trip meets the policy’s rule.</p>}
    </div>
    <div className="list">
      <div className="kv"><span>Who</span><span>You and up to 3 colleagues, under 75</span></div>
      <div className="kv"><span>Trips</span><span>First 90 days, mainly for business</span></div>
      <div className="kv"><span>Medical expenses</span><span>Up to £2m</span></div>
      <div className="kv"><span>Cancellation</span><span>Up to £6,000</span></div>
      <div className="kv"><span>Delay</span><span>£25 after 4 hours, then £25 an hour, up to £300</span></div>
      <div className="kv"><span>Belongings</span><span>Up to £3,000</span></div>
      <div className="kv"><span>Personal liability</span><span>Up to £2m</span></div>
    </div>
    <div className="list"><Row ic="doc" t="Make a claim" s="Within 45 days" onClick={() => nav.toast('In the live app, this opens the claims service.')} /></div>
    <Src href="https://www.barclaycard.co.uk/business/cards/insurance" label="Business insurance, as published" />
  </Page>
}

export function SCCash() {
  const nav = useNav(); const a = useAcct()
  if (a.c.id !== 'select-cashback') return <Page title="Cashback"><p className="sub">Monthly cashback comes with the Select Cashback card.</p></Page>
  const m = scMonth(a)
  const hist = [['September statement', 24.37, 2436.80], ['August statement', 21.90, 2190.00], ['July statement', 0, 1712.40], ['June statement', 25.06, 2506.10]] as const
  return <Page title="Cashback">
    <div className="cardp">
      <p className="small">This statement month, to {m.by}</p>
      <p style={{ fontSize: 30, fontWeight: 800 }} className="num">{gbp(m.earned)} <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--soft)' }}>so far</span></p>
      <div className="bar green"><div style={{ width: `${Math.min(1, m.spent / 2000) * 100}%` }} /></div>
      <p className="small">{gbp(m.spent)} of £2,000 spent. {m.left > 0 ? `${gbp(m.left)} to go.` : 'Over £2,000.'}</p>
    </div>
    <div className="note"><Ic n="info" s={18} />Barclaycard publishes 1%, uncapped, paid monthly. Independent reviews say it’s only paid in months you spend £2,000 or more. Check your cashback terms.</div>
    <Terms items={['1% on eligible spending by you and your cardholders', 'Credited in the same statement period', 'Pay at least the minimum on time and stay within your limit', 'Not earned on cash, balance transfers, fees or interest']} />
    <Sec title="Past months" />
    <div className="list">{hist.map(([t, v, sp]) => <div key={t} className="kv"><span>{t}<br /><span className="tiny">{gbp(sp)} spent</span></span><span className="num">{gbp(v)}</span></div>)}</div>
    <p className="tiny">Past months are demo data.</p>
    <button className="btn light" onClick={() => nav.home('spend')}>See this month’s spending</button>
    <Src href="https://www.barclaycard.co.uk/business/cards/credit-cards/select-cashback" label="Select Cashback, as published" />
  </Page>
}
