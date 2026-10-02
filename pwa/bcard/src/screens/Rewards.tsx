import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore, useNav, useAcct, fmtInt, planFor } from '../store'
import { gbp, CONTENT, CATS, STAMP, itemById, Item, Card, IMG } from '../data'
import { benefitsFor } from '../benefits'
import { Ic, Spark, Sec, Row, Page, GTag, Sheet, useFaceId } from '../ui'
import { voucher, aviosWelcome, btPlan, scMonth, offerWhy } from '../engine'

// What the partner adds on top of the card's own earning (funded by the partner, arranged by Gratifi).
export const bonusFor = (c: Card, it: Item) => c.reward === 'avios' ? Math.round(it.price * it.partnerRate * 100) : Math.round(it.price * it.partnerRate * 100) / 100
export const bonusText = (c: Card, it: Item) => it.price === 0 ? `${Math.round(it.partnerRate * 100)}% back when you pay` : c.reward === 'avios' ? `${fmtInt(bonusFor(c, it))} extra Avios` : `${gbp(bonusFor(c, it))} back`
export const cardEarn = (c: Card, amount: number) => c.reward === 'avios' ? `${fmtInt(Math.floor(amount * (c.rate || 1)))} Avios` : c.reward === 'cashback' ? `${gbp(amount * 0.0025)} cashback` : c.reward === 'amazon' ? `${gbp(amount * 0.005)} back` : c.reward === 'biz-cashback' ? `${gbp(amount * 0.005)} cashback` : null

function OfferCard({ o }: { o: any }) {
  const { s, d } = useStore(); const a = useAcct(); const on = !!a.cs.offers[o.id]; const why = offerWhy(a, o)
  return <div className="card" style={{ borderRadius: 20, padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
    <img src={STAMP[o.stamp]} alt="" style={{ width: 40, height: 48 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 15, fontWeight: 700 }}>{o.rate} · {o.brand}</p>
      <p className="small">{o.sub}</p>
      {s.suggest && why && <p className="tiny" style={{ display: 'flex', gap: 5, alignItems: 'flex-start', marginTop: 3 }}><span style={{ marginTop: 1 }}><Spark s={12} /></span>{why}</p>}
    </div>
    <button className={'btn sm' + (on ? ' done' : '')} style={{ minWidth: 76, padding: '0 12px' }} aria-pressed={on} aria-label={`${on ? 'Remove' : 'Add'} ${o.rate} at ${o.brand}`} onClick={() => d({ type: 'offer', id: o.id })}>{on ? <><Ic n="tick" s={14} c="#11774A" w={3} />Added</> : 'Add'}</button>
  </div>
}

export function Rewards() {
  const nav = useNav(); const a = useAcct(); const { c, cs } = a
  const items = CONTENT.filter(i => !!i.biz === !!c.business)
  const booked = cs.bookings.filter(b => b.status === 'booked')
  const mine = benefitsFor(c.id); const ent = mine.some(b => b.id === 'entertainment')
  return <div className="scroll">
    <div className="pad">
      <div className="hdr"><h1 className="h1" tabIndex={-1}>Rewards</h1></div>
      <p className="label">From your card</p>
      <CardProgramme />
      <div className="list">
        {mine.some(b => b.id === 'cashback-rewards') && <Row ic="bag" t="Barclays Cashback Rewards" s="Retailer offers up to 15% back" onClick={() => nav.push('cbr')} />}
        {c.id === 'amazon' && <Row ic="gift" t="Move rewards to Amazon" s="In £5 steps, within two hours" onClick={() => nav.push('amazon')} />}
        {c.id === 'avios-plus' && <Row ic="sofa" t="Airport lounges" s="Over 1,000 lounges at £18.50 a pass" onClick={() => nav.push('lounge')} />}
        {c.id === 'select-cashback' && <Row ic="pound" t="This month’s cashback" s="1% back, added each month" onClick={() => nav.push('sccash')} />}
        {ent && <Row ic="ticket" t="Barclaycard Entertainment" s="Early access and 10% off at selected festivals" onClick={() => nav.push('entertainment')} />}
        {c.business && <Row ic="bag" t="Business Rewards" s="Savings through Mastercard, plus FreshBooks" onClick={() => nav.push('bizrewards')} />}
        <Row ic="grid" t="Everything with your card" s={`All ${mine.length} benefits and services`} onClick={() => nav.push('benefits')} />
      </div>

      <div className="gsec">
        <Sec title="Offers and bookings" tag={<GTag />} />
        <p className="small" style={{ marginTop: -6 }}>Partners pay you back when you use your {c.short} card{c.reward === 'none' ? '' : ', on top of what the card already earns'}.</p>
        {a.offersFor.slice(0, 3).map(o => <OfferCard key={o.id} o={o} />)}
        {a.offersFor.length > 3 && <button className="btn light" onClick={() => nav.push('offers')}>All {a.offersFor.length} offers</button>}
        <div className="stamps">{CATS.filter(x => !c.business || ['Hotels', 'Experiences', 'Dining'].includes(x.id)).map(x => <button key={x.id} className="stamp" onClick={() => nav.push('browse', { cat: x.id })}><img src={STAMP[x.stamp]} alt="" />{x.id}</button>)}</div>
        <Sec title={c.business ? 'For Amsterdam' : 'For Lisbon'} link="See all" onLink={() => nav.push('browse', { cat: 'Hotels' })} />
        <div className="hscroll">{items.filter(i => i.when).map(i => <button key={i.id} className="polaroid" onClick={() => nav.push('item', { id: i.id })}>
          <img src={i.img} alt="" style={{ objectPosition: i.pos || 'center' }} />
          <p style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{i.title}</p>
          <p className="tiny">{i.price ? gbp(i.price, 0) : 'Free to book'} · {bonusText(c, i)}</p>
        </button>)}</div>
        {booked.length > 0 && <div className="list"><Row ic="cal" t="Your bookings" s={`${booked.length} booked with Gratifi`} onClick={() => nav.push('bookings')} /></div>}
      </div>
    </div>
    <div className="space-tabs" />
  </div>
}

function CardProgramme() {
  const nav = useNav(); const a = useAcct(); const { c } = a
  if (c.reward === 'avios') {
    const v = voucher(a); const w = c.id === 'avios' ? aviosWelcome(a) : null
    return <div className="cardp">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic n="plane" s={24} c="#fff" /></div>
        <div style={{ flex: 1 }}><p className="small">Avios in your British Airways account</p><p style={{ fontSize: 26, fontWeight: 800 }} className="num">{fmtInt(a.prog.aviosBalance)}</p></div>
      </div>
      <p className="small">{c.rateText} on this card.</p>
      {w && w.left > 0 && <button style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }} onClick={() => nav.push('welcome')}><p style={{ fontWeight: 700, fontSize: 14 }}>Welcome bonus: {gbp(w.left, 0)} to go by {w.by}</p><div className="bar orange"><div style={{ width: `${w.spent / w.target * 100}%` }} /></div></button>}
      <button style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }} onClick={() => nav.push('voucher')}><p style={{ fontWeight: 700, fontSize: 14 }}>Upgrade voucher: {gbp(v.spent, 0)} of {gbp(v.at, 0)}</p><div className="bar"><div style={{ width: `${Math.min(1, v.spent / v.at) * 100}%` }} /></div></button>
      {c.id === 'avios-plus' && <button className="small" style={{ textAlign: 'left', minHeight: 44 }} onClick={() => nav.push('lounge')}>Airport lounges from £18.50 a pass ›</button>}
      <button className="btn sm light" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push('avios')}>What your Avios could do</button>
    </div>
  }
  if (c.reward === 'cashback') return <div className="cardp">
    <p className="small">Cashback this year</p><p style={{ fontSize: 26, fontWeight: 800 }} className="num">{gbp(a.cashback)}</p>
    <p className="small">0.25% on everyday spending. Paid once a year, or when you ask.</p>
    <div style={{ display: 'flex', gap: 8 }}><button className="btn sm" onClick={() => nav.push('cashback')} disabled={a.cashback <= 0}>Take it now</button></div>
  </div>
  if (c.reward === 'amazon') return <div className="cardp">
    <p className="small">Rewards earned</p><p style={{ fontSize: 26, fontWeight: 800 }} className="num">{gbp(a.prog.earned)}</p>
    <p className="small">1% back at Amazon, 0.5% everywhere else. The rate elsewhere drops to 0.25% on {a.prog.rateDrops}.</p>
    <p className="note" style={{ fontSize: 13 }}><Ic n="clock" s={16} />0% on purchases until {a.prog.zeroUntil}.</p>
    <button className="btn sm light" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push('amazon')}>Move to Amazon</button>
  </div>
  if (c.reward === 'biz-cashback') return <div className="cardp">
    <p className="small">Cashback this year</p><p style={{ fontSize: 26, fontWeight: 800 }} className="num">{gbp(a.prog.cashback)} <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--soft)' }}>of £400</span></p>
    <div className="bar green"><div style={{ width: `${a.prog.cashback / a.prog.cap * 100}%` }} /></div>
    <p className="small">0.5% on eligible spending, up to £400 a year.</p>
  </div>
  if (c.reward === 'biz-monthly') { const m = scMonth(a); return <div className="cardp">
    <p className="small">Cashback this statement month</p><p style={{ fontSize: 26, fontWeight: 800 }} className="num">{gbp(m.earned)} <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--soft)' }}>so far</span></p>
    <div className="bar green"><div style={{ width: `${Math.min(1, m.spent / 2000) * 100}%` }} /></div>
    <p className="small">{gbp(m.spent)} of £2,000 spent by {m.by}. 1% back, no cap, added to your statement each month. Last month: {gbp(m.last)}.</p>
    <button className="btn sm light" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push('sccash')}>How it works</button>
  </div> }
  return <div className="cardp">
    <p style={{ fontSize: 15, fontWeight: 700 }}>This card doesn’t earn rewards</p>
    <p className="small">{c.id === 'platinum' ? `Use it to clear ${gbp(btPlan(a).left)} at 0% by ${a.prog.btUntil}.` : c.id === 'forward' ? `Pay on time and stay in your limit until ${a.prog.anniversary}, and your rate comes down.` : c.charge ? 'It’s a charge card: you pay the full balance each month, with up to 38 days interest-free.' : ''} The offers below still pay you back.</p>
    <button className="btn sm light" style={{ alignSelf: 'flex-start' }} onClick={() => nav.push(c.id === 'platinum' ? 'bt' : c.id === 'forward' ? 'promise' : 'dd')}>{c.id === 'platinum' ? 'See my plan' : c.id === 'forward' ? 'See my progress' : 'Direct Debit'}</button>
  </div>
}

export function Offers() {
  const a = useAcct()
  return <Page title="Offers">
    <h1 className="h1">Money back, on your card</h1>
    <p className="sub">Add an offer, pay with your {a.c.short} card, and the money comes back to your account within 30 days.</p>
    {a.offersFor.map(o => <OfferCard key={o.id} o={o} />)}
    <p className="tiny">Offers are funded by the brands and arranged by Gratifi. Demo offers.</p>
  </Page>
}

export function Browse({ cat }: { cat: string }) {
  const nav = useNav(); const a = useAcct(); const { c } = a
  const [k, setK] = useState(cat || 'Hotels')
  const cats = CATS.filter(x => !c.business || ['Hotels', 'Experiences', 'Dining'].includes(x.id))
  const list = CONTENT.filter(i => i.cat === k && !!i.biz === !!c.business)
  const ent = benefitsFor(c.id).some(b => b.id === 'entertainment')
  return <Page title={k}>
    <div className="chips">{cats.map(x => <button key={x.id} className={'chip' + (k === x.id ? ' on' : '')} aria-pressed={k === x.id} onClick={() => setK(x.id)}>{x.id}</button>)}</div>
    {k === 'Tickets' && ent && <div className="cardp" style={{ background: 'var(--navy)', color: '#fff' }}>
      <p className="tiny" style={{ color: '#B4C6DA', fontWeight: 700, letterSpacing: 1 }}>BARCLAYCARD ENTERTAINMENT</p>
      <p style={{ fontSize: 18, fontWeight: 700 }}>Early access to summer festival tickets</p>
      <p style={{ fontSize: 14, color: '#D5E0EC', lineHeight: 1.4 }}>10% off at Download, Reading and Leeds, Wireless, Latitude, Creamfields and the Isle of Wight Festival when you pay with your Barclaycard.</p>
      <button className="btn sm" style={{ background: '#fff', color: 'var(--navy)', alignSelf: 'flex-start' }} onClick={() => nav.toast('Gratifi will remind you when early access opens.')}>Remind me when it opens</button>
    </div>}
    {list.length === 0 && <p className="sub">Nothing here for this trip yet.</p>}
    {list.map(i => <button key={i.id} className="card" style={{ borderRadius: 22, padding: 10, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('item', { id: i.id })}>
      <img src={i.img} alt="" style={{ width: 76, height: 76, objectFit: 'cover', objectPosition: i.pos || 'center', borderRadius: 14, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 700 }}>{i.title}</p>
        <p className="small">{i.rating ? `★ ${i.rating} · ` : ''}{i.sub}</p>
        <p style={{ fontSize: 14, fontWeight: 700, marginTop: 3 }}>{i.price ? gbp(i.price, 0) : 'Free to book'} <span className="gtag" style={{ marginLeft: 4 }}>{bonusText(c, i)}</span></p>
      </div>
      <Ic n="chev" s={16} c="#8A94A3" />
    </button>)}
    <p className="tiny">Partner prices and offers are for the demo.</p>
  </Page>
}

export function ItemScreen({ id }: { id: string }) {
  const nav = useNav(); const a = useAcct(); const { c } = a; const it = itemById(id)
  const done = a.cs.bookings.find(b => b.itemId === id && b.status === 'booked')
  const earn = it.price ? cardEarn(c, it.price) : null
  return <Page title={it.cat} cta={done ? <button className="btn big done" onClick={() => nav.push('bookings')}><Ic n="tick" s={18} c="#11774A" w={3} />Booked · see booking</button> : <button className="btn big" onClick={() => nav.push('checkout', { id })}>{it.price ? `Book for ${gbp(it.price, 0)}` : 'Book a table'}</button>}>
    <img src={it.img} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', objectPosition: it.pos || 'center', borderRadius: 22 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <h1 className="h1" style={{ fontSize: 24 }}>{it.title}</h1>
      <p className="sub">{it.rating ? `★ ${it.rating} · ` : ''}{it.sub}</p>
    </div>
    <div className="cardp" style={{ gap: 8 }}>
      <GTag text="What you get back" />
      <p style={{ fontSize: 16, fontWeight: 700 }}>{bonusText(c, it)}{it.price ? ' from the partner' : ''}</p>
      {earn && <p className="small">Plus {earn} from your {c.short} card.</p>}
    </div>
    <div className="list">{(it.perks || []).map(p => <Row key={p} ic="tick" t={p} chev={false} />)}<Row ic="refresh" t={it.cancel} chev={false} /></div>
  </Page>
}

export function Checkout({ id }: { id: string }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const { c, cs } = a; const it = itemById(id)
  const [months, setMonths] = useState(0)
  const [face, run] = useFaceId()
  const canSpread = !c.business && it.price >= 100 && it.price <= 5000 && cs.plans.length < 10
  const short = it.price > a.available
  const blocked = cs.frozen || short
  const p = months ? planFor(it.price, months) : null
  const earn = it.price ? cardEarn(c, it.price) : null
  const bonus = bonusFor(c, it)
  return <Page title="Check out" ask={false} cta={<button className="btn big" disabled={blocked} onClick={() => run(it.price ? `Pay ${gbp(it.price)}` : 'Confirm booking', () => { d({ type: 'book', itemId: id, months, bonus }); nav.replace('booked', { id }) })}>{it.price ? `Confirm and pay ${gbp(it.price)}` : 'Confirm booking'}</button>}>
    <div className="card" style={{ borderRadius: 22, padding: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
      <img src={it.img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', objectPosition: it.pos || 'center', borderRadius: 14 }} />
      <div><p style={{ fontSize: 15, fontWeight: 700 }}>{it.title}</p><p className="small">{it.sub}</p></div>
    </div>
    {cs.frozen && <div className="note blue"><Ic n="snow" s={18} c="#1269AE" /><div style={{ flex: 1 }}>Your card is frozen. Unfreeze it to pay.</div><button className="btn sm" onClick={() => { d({ type: 'freeze', on: false }); nav.toast('Card unfrozen.') }}>Unfreeze</button></div>}
    {short && !cs.frozen && <div className="note red"><Ic n="info" s={18} c="#B42318" /><div>This is more than your available credit of {gbp(a.available)}.</div></div>}
    <div className="list">
      <div className="kv"><span>{it.price ? 'Pay with' : 'Card on file'}</span><span>{c.short} ending {a.cardLast4}</span></div>
      <div className="kv"><span>{it.price ? 'Total' : 'To pay now'}</span><span className="num">{it.price ? gbp(it.price) : 'Nothing'}</span></div>
      <div className="kv"><span>Cancellation</span><span style={{ maxWidth: 190 }}>{it.cancel}</span></div>
    </div>
    {canSpread && <><Sec title="Spread the cost?" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="radiogroup" aria-label="Spread the cost">{[0, 3, 6, 12, 24].map(m => <button key={m} role="radio" aria-checked={months === m} className={'chip' + (months === m ? ' on' : '')} onClick={() => setMonths(m)}>{m ? `${m} months` : 'Pay in full'}</button>)}</div>
      {p && <p className="small">{gbp(p.monthly)} a month for {months} months at 0%, with a one-off {gbp(p.fee)} fee. It joins your minimum payment from your next statement.</p>}</>}
    <div className="note g"><Spark s={18} /><div>{it.price ? `You’ll get ${bonusText(c, it)} from the partner${earn ? `, plus ${earn} from your card` : ''}.` : `Free to book. Pay the bill with your card and you get ${Math.round(it.partnerRate * 100)}% back from the restaurant${c.reward !== 'none' ? ', plus your card’s usual rewards' : ''}.`}</div></div>
    {face}
  </Page>
}

export function Booked({ id }: { id: string }) {
  const { d } = useStore(); const nav = useNav(); const a = useAcct(); const it = itemById(id)
  const b = a.cs.bookings.find(x => x.itemId === id && x.status === 'booked')
  const [undo, setUndo] = useState(8)
  useEffect(() => { const i = setInterval(() => setUndo(x => Math.max(0, x - 1)), 1000); return () => clearInterval(i) }, [])
  if (!b) return <Page title="Booking"><p className="sub">This booking was undone. Nothing was charged.</p></Page>
  return <Page title="" cta={<>
    <button className="btn big" onClick={() => nav.home()}>Done</button>
    {undo > 0 && <button className="btn big light" onClick={() => { d({ type: 'undoBooking', id: b.id }); nav.pop(); nav.toast('Undone. Nothing was charged.') }}>Undo ({undo}s)</button>}
  </>}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 8, textAlign: 'center' }}>
      <motion.div initial={{ scale: 1.8, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }}
        style={{ width: 132, height: 132, borderRadius: 66, border: '4px solid #C2410C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#C2410C', boxShadow: 'inset 0 0 0 5px #fff, inset 0 0 0 7px #C2410C', background: '#FFF6F0' }} aria-hidden="true">
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>GRATIFI</span><span style={{ fontSize: 22, fontWeight: 800 }}>BOOKED</span><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>MON 28 SEP</span>
      </motion.div>
      <h1 className="h1">You’re booked</h1>
      <p className="sub">{it.title}{it.when ? `, ${it.when}` : ''}. Confirmation {b.ref} is in your email.</p>
    </div>
    <div className="list">
      {b.price > 0 && <div className="kv"><span>Paid</span><span className="num">{gbp(b.price)} on card ending {a.cardLast4}</span></div>}
      {b.planId && <div className="kv"><span>Instalments</span><span>{(() => { const p = a.cs.plans.find(x => x.id === b.planId); return p ? `${gbp(p.monthly)} a month for ${p.months} months` : '' })()}</span></div>}
      <div className="kv"><span>Coming back to you</span><span className="pos">{bonusText(a.c, it)}</span></div>
      <div className="kv"><span>Cancellation</span><span style={{ maxWidth: 190 }}>{it.cancel}</span></div>
    </div>
    <button className="btn light" onClick={() => nav.toast('Added to your calendar.')}><Ic n="cal" s={18} />Add to calendar</button>
  </Page>
}

export function Bookings() {
  const { d } = useStore(); const nav = useNav(); const a = useAcct()
  const [open, setOpen] = useState<string | null>(null)
  const b = a.cs.bookings.find(x => x.id === open)
  return <Page title="Your bookings">
    {a.cs.bookings.length === 0 && <p className="sub">Nothing booked yet. Everything you book with Gratifi shows here.</p>}
    {a.cs.bookings.length > 0 && <div className="list">{a.cs.bookings.map(x => { const it = itemById(x.itemId); return <Row key={x.id} ic={x.status === 'booked' ? 'cal' : 'close'} t={it.title} s={x.status === 'booked' ? `${it.when || 'Booked today'} · ${x.ref}` : `Cancelled · ${x.price ? 'charge removed' : 'no charge'}`} onClick={() => setOpen(x.id)} /> })}</div>}
    <AnimatePresence>{b && <Sheet label="Booking" onClose={() => setOpen(null)}>
      <h2 className="h2">{itemById(b.itemId).title}</h2>
      <div className="list" style={{ boxShadow: 'none', padding: 0 }}>
        <div className="kv"><span>Reference</span><span>{b.ref}</span></div>
        <div className="kv"><span>Status</span><span>{b.status === 'booked' ? 'Booked' : 'Cancelled'}</span></div>
        {b.price > 0 && <div className="kv"><span>Paid</span><span>{gbp(b.price)}</span></div>}
        <div className="kv"><span>Cancellation</span><span style={{ maxWidth: 190 }}>{itemById(b.itemId).cancel}</span></div>
      </div>
      {b.planId && b.status === 'booked' && <p className="small">Its Instalment Plan ends too if you cancel.</p>}
      {b.status === 'booked' && b.price > 0 && <p className="small">You won’t get the {bonusText(a.c, itemById(b.itemId))} from the partner.</p>}
      {b.status === 'booked' ? <button className="btn big danger" onClick={() => { d({ type: 'cancelBooking', id: b.id }); setOpen(null); nav.toast(b.price ? `Cancelled. The ${gbp(b.price)} charge is removed from your card.` : 'Cancelled.') }}>Cancel booking</button> : null}
      <button className="btn big light" onClick={() => setOpen(null)}>Close</button>
    </Sheet>}</AnimatePresence>
  </Page>
}

export function Avios() {
  const nav = useNav(); const a = useAcct(); const { c } = a; const bal = a.prog.aviosBalance || 0
  const month = Math.floor(a.purchases(a.txns).filter(t => t.date >= '2026-09-01').reduce((x, t) => x + t.amount, 0) * (c.rate || 1))
  const ideas = c.id === 'avios-plus'
    ? [{ t: 'London to Milan, economy', s: 'Peak dates · plus £1', v: 19500, img: IMG.flight }, { t: 'London to Barcelona, economy', s: 'Plus £9', v: 24000, img: IMG.flight }, { t: 'London to Venice, Club Europe', s: 'Plus £33', v: 43000, img: IMG.flight }]
    : [{ t: 'London to Milan, economy', s: 'Off-peak dates · plus £1', v: 18500, img: IMG.flight }, { t: 'London to Barcelona, economy', s: 'Plus £1', v: 23500, img: IMG.flight }]
  return <Page title="Your Avios">
    <div className="cardp" style={{ alignItems: 'center', padding: 22 }}>
      <p className="small">Avios in your British Airways account</p>
      <p style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5 }} className="num">{fmtInt(bal)}</p>
    </div>
    <div className="list">
      <div className="kv"><span>Collected in September</span><span className="num">{fmtInt(month)} Avios</span></div>
      <div className="kv"><span>Expected in your British Airways account</span><span>Fri 2 Oct</span></div>
    </div>
    <p className="small">Everything you collect in a month moves to your British Airways Club account early the next month; cardholders report the 2nd working day. Cash withdrawals don’t earn Avios; Head for Points reports that transfers now do.</p>
    <Sec title="What they could cover" tag={<GTag text="Gratifi" />} />
    {ideas.map(i => { const ok = bal >= i.v; return <div key={i.t} className="card" style={{ borderRadius: 20, padding: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
      <img src={i.img} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 12 }} />
      <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{i.t}</p><p className="small">{fmtInt(i.v)} Avios · {i.s}</p><p className="tiny" style={{ color: ok ? 'var(--good)' : 'var(--accent-deep)', fontWeight: 700 }}>{ok ? 'You have enough' : `${fmtInt(i.v - bal)} to go`}</p></div>
    </div> })}
    <div className="list">
      <Row ic="plane" t="Your upgrade voucher" s={`Spend ${c.id === 'avios-plus' ? '£10,000' : '£20,000'} in a card year`} onClick={() => nav.push('voucher')} />
      <Row ic="info" t="Other ways to use Avios" s="Part-pay a flight from 1,000 Avios, hotels, car hire, Nectar" onClick={() => nav.push('benefit', { id: 'spend-avios' })} />
    </div>
    <button className="btn light" onClick={() => nav.toast('In the live app, this opens British Airways to book with your Avios.')}>Book with British Airways</button>
    <p className="tiny">Example prices as shown by Barclaycard for this card. British Airways sets the real prices, taxes and availability.</p>
  </Page>
}
