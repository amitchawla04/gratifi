import { React, useState, useEffect, useRef } from '../../kit/src/r'
import * as K from '../../kit/src/base'
import * as T from '../../kit/src/talk'
import * as X from '../../kit/src/more'
import { Icon, Spark } from '../../kit/src/icons'
import { useMarket, MARKETS } from '../../kit/src/market'
import * as St from './store'
import * as F from './flows'
import * as Cat from './catalog'
import * as Br from './brain'
import { Blocks, run, respond, iconFor, sendText, OfferList, OFFERS, openConfirm, ddAsk } from './render'
import * as D from './design'
import * as Mod from './modules'
import * as Bk from './bank'
import { here } from './cardx'

export type Tab = 'home' | 'explore' | 'chat' | 'wallet' | 'me' | 'offers' | 'alerts' | 'tier' | 'bank' | 'card' | 'cardx'
export type Nav = { go: (t: Tab, cat?: string) => void; back: () => void }

/* ---------- Tier (demo programme tier, as on the approved screens) ---------- */
const TIER = { name: 'Gold', next: 'Platinum', have: 16480, need: 20000, adds: ['Double points on travel', 'Two airport lounge visits a year', 'A named contact when you need help'] }
const toNext = () => TIER.need - TIER.have
const STAMP_OFFER: Record<string, string> = { 'OF-1': 'dining', 'OF-2': 'flights', 'OF-3': 'quick', 'OF-4': 'shopping' }
const live = (b: St.Booking) => !['cancelled', 'refunded'].includes(b.status)
const hello = (M: any) => M.t(new Date().getHours() >= 5 && new Date().getHours() < 12 ? 'goodMorning' : new Date().getHours() >= 12 && new Date().getHours() < 18 ? 'goodAfternoon' : 'goodEvening')
const artOf = (b: { img?: string; cat: string }) => (b.img && Cat.img(b.img)) || D.STAMP[b.cat]
function addOffer(id: string, b: string, r: string, on: boolean) { St.set(s => ({ seen: { ...s.seen, ['offer:' + id]: on } })); if (on) St.pushMsg({ role: 'gr', text: `Added: ${r} at ${b} until 31 Oct, when you pay with your card.` }) }

/* ---------- Home ---------- */
export function Home({ nav }: { nav: Nav }) {
  const s = St.useS(x => x); const M = useMarket(); const { go } = nav; const on = Mod.useOn()
  const moment = pickMoment(s, M)
  const stamps = ['stays', 'flights', 'experiences', 'dining', 'tickets', 'shopping', 'subs', 'rides', 'quick', 'giftcards'].filter(on).map(k => Cat.CATS.find(c => c.key === k)!).map(c => { const earn = F.itemsFor(c.key).map(i => i.earn).find(e => e && /\d×/.test(e)); return { key: c.key, label: c.label, art: D.STAMP[c.key], badge: earn ? earn.match(/\d×/)![0] : undefined, onClick: () => go('explore', c.key) } })
  const next = s.bookings.filter(b => live(b) && (['booking', 'ticket'].includes(b.kind || '') || (b.tracker && b.tracker.current < b.tracker.steps.length - 1))).sort((a, b) => String(a.extra?.date || a.createdAt).localeCompare(String(b.extra?.date || b.createdAt)))[0]
  const seenIds = new Set<string>(); const again = s.bookings.filter(b => b.itemId && !seenIds.has(b.itemId) && seenIds.add(b.itemId)).slice(0, 4)
  const d0 = Cat.dests(M.id)[0]
  const picks = [F.itemsFor('stays', d0.name)[0], F.findItem('SH-4')].filter((x): x is Cat.Item => !!x && !!x.img && on(x.cat))
  const c = s.card
  return <div className="app-scroll">
    <div className="ds-homehd"><img src={D.ART.wordmark} alt="gratifi" /><div><D.HBtn label="You and settings" text={(s.prefs.name || 'Y').charAt(0)} onClick={() => go('me')} /><D.HBtn icon="bell" label={M.t('alerts')} dot={!!moment} onClick={() => go('alerts')} /><D.HBtn icon="close" label="Close" onClick={() => go('bank')} /></div></div>
    <div className="ds-hello"><h1>{`${hello(M)}, ${s.prefs.name}`}</h1>{on('card.pay') && <p>{c.due > 0 ? `${M.money(c.due, 2)} to pay by ${M.date(c.dueDate, 'day')}.` : 'Nothing to pay right now.'}</p>}</div>
    {on('card') && <CardSummary nav={nav} open pay freeze extra={[...(on('card.controls') ? [{ label: 'Controls', onClick: () => go('card', 'controls') }] : []), ...(!on('card.controls') && on('card.statements') ? [{ label: 'Statements', onClick: () => go('cardx', 'statements') }] : [])]} />}
    {on('benefits') && <><D.Sec title="Card benefits" more="See all" onMore={() => go('cardx', 'benefits')} />
    <D.Included items={benefitTiles(s, M, nav).slice(0, 3)} /></>}
    {on('offers') && <><D.Sec title="Earn as you spend" more={`All ${OFFERS.length}`} onMore={() => go('offers')} />
    <div className="ds-offers">{OFFERS.map(([id, b, , , r]) => <D.OfferMini key={id} art={D.STAMP[STAMP_OFFER[id]]} title={`${r} at ${b}`} sub="Until 31 Oct" added={!!s.seen['offer:' + id]} onAdd={() => addOffer(id, b, r, !s.seen['offer:' + id])} />)}</div></>}
    {on('moments') && <>
    <D.Challenges items={s.challenges.filter(x => !x.done).map(x => ({ key: x.id, title: x.id === 'CHL-3' ? `Spend ${M.money(x.target)} on travel before 31 Oct` : x.title, reward: x.reward, progress: x.progress, target: x.target, progressText: x.unit === 'money' ? `${M.money(Math.round(x.progress))} of ${M.money(x.target)}` : `${Math.round(x.progress)} of ${x.target}`, joined: x.joined, icon: ({ 'CHL-1': 'fork', 'CHL-2': 'target', 'CHL-3': 'plane' } as any)[x.id], onJoin: () => { St.set(st => ({ challenges: st.challenges.map(y => (y.id === x.id ? { ...y, joined: true } : y)) })); St.pushMsg({ role: 'gr', text: `You're in: ${x.title}.` }) } }))} /></>}
    {stamps.length > 0 && <><D.Sec title="Book with your card" more="See all" onMore={() => go('explore')} />
    <D.Stamps items={stamps} /></>}
    {next && <><D.Sec title="Coming up" /><D.Coming art={artOf(next)} title={next.title} sub={[next.when || next.sub, next.pts ? `${M.num(next.pts)} points` : ''].filter(Boolean).join(' · ')} status={next.tracker && next.tracker.current < next.tracker.steps.length - 1 ? (next.tracker.eta || next.tracker.steps[next.tracker.current]) : 'Booked'} tone={next.tracker?.tone === 'warn' ? 'warn' : 'good'} onClick={() => go('wallet')} /></>}
    {again.length > 0 && <><D.Sec title="Book again" /><D.Again items={again.map(b => ({ key: b.id, label: b.title, art: D.STAMP[b.cat], onClick: () => { go('chat'); run({ f: 'showItem', a: { id: b.itemId } }, b.title) } }))} /></>}
    {on('points') && <><D.Sec title="Your points" more={`${M.num(toNext())} to ${TIER.next}`} onMore={() => go('tier')} />
    <D.PointsCard tier={TIER.name} value={<D.CountUp id={"bal-" + s.market} value={s.balance} format={M.num} />} onUse={() => go('explore')} /></>}
    {moment && <D.Note title={moment.title} action={moment.action} onAction={moment.go} secondary="Not now" onSecondary={() => St.set(x => ({ seen: { ...x.seen, [moment.key]: true } }))}>{moment.body}</D.Note>}
    {picks.length > 0 && <D.Sec title="Picked for you" more="See all" onMore={() => go('explore')} />}
    <D.Picks items={picks.map(i => { const price = i.cat === 'stays' ? F.stayPrice(i, '', 2) : F.IP(i); return { key: i.id, art: Cat.img(i.img)!, title: i.cat === 'stays' ? `Stay in ${d0.name}` : i.title, sub: i.cat === 'stays' ? `${i.title}, two nights` : `From ${i.sub}`, price: `${M.num(F.ptsOf(price))} points`, onUse: () => { go('chat'); run({ f: 'showItem', a: { id: i.id } }, i.title) } } })} />
    {on('points') && <><D.Sec title="Recent activity" more="See all" onMore={() => go('wallet', 'Points')} />
    <D.List>{s.ledger.slice(0, 3).map(l => <D.Row key={l.id} icon={l.pts >= 0 ? 'plus' : 'arrow'} title={l.label.replace(/^Balance brought forward$/, 'Points from before')} sub={M.date(new Date(l.at))} value={`${l.pts >= 0 ? '+' : '−'}${M.num(Math.abs(l.pts))}`} tone={l.pts >= 0 ? 'good' : undefined} />)}</D.List></>}
  </div>
}
function pickMoment(s: St.State, M: any): { key: string; title: string; body: string; action: string; go: () => void } | null {
  const c: any[] = []
  const fl = s.bookings.find(b => b.cat === 'flights' && b.status === 'confirmed')
  if (fl && s.loungeLeft && !s.bookings.some(b => b.cat === 'airport' && b.status === 'confirmed')) c.push({ key: 'lounge-' + fl.id, title: 'A free lounge visit', body: `Your flight to ${fl.title.split(' to ')[1]} leaves from ${Cat.home(s.market).airport}. You have ${s.loungeLeft} free visit${s.loungeLeft > 1 ? 's' : ''} left this year.`, action: 'Book the lounge', go: () => run({ f: 'search', a: { cat: 'airport', query: 'lounge' } }, 'Book the lounge') })
  if (s.expiring && !s.seen['expiring']) c.push({ key: 'expiring', title: 'Expires 31 Oct', body: `${M.num(s.expiring)} points run out on 31 Oct. That's about ${M.money(s.expiring * St.rate())}: enough for a gift card or a lounge visit.`, action: 'Show ideas', go: () => run({ f: 'search', a: { cat: 'giftcards' } }, 'Ways to use expiring points') })
  if (!s.bookings.some(b => b.title === 'Tunewave') && !s.seen['tunewave']) c.push({ key: 'tunewave', title: 'Music is included', body: 'Tunewave comes free with this card and you haven\'t turned it on yet.', action: 'Turn it on', go: () => run({ f: 'showItem', a: { id: 'SB-2' } }, 'Turn on Tunewave') })
  const ch = s.challenges.find(x => x.joined && !x.done && x.target - x.progress === 1)
  if (ch) c.push({ key: 'ch-' + ch.id, title: `One more for ${ch.reward}`, body: `${ch.title}: you're at ${ch.progress} of ${ch.target}.`, action: 'Find a table', go: () => run({ f: 'search', a: { cat: 'dining' } }, 'Find a table') })
  return c.find(x => !s.seen[x.key]) || null
}
function moments(s: St.State, M: any) { const out: any[] = []; const seen = { ...s.seen }; for (let i = 0; i < 4; i++) { const m = pickMoment({ ...s, seen } as St.State, M); if (!m) break; out.push(m); seen[m.key] = true } return out }


/* ---------- Card: summary, actions, benefits (used on Home and My card) ---------- */
/** Freeze straight away; unfreezing checks it's you first. Both stay on the screen. */
function freezeToggle() { const c = St.get().card; if (c.frozen) { here(F.unfreezeAsk({})); return } St.set(x => ({ card: { ...x.card, frozen: true } })); St.pushMsg({ role: 'gr', text: 'Card frozen. New payments are blocked; direct debits and refunds still work.' }); D.toast('Card frozen. New payments are blocked.') }
function CardSummary({ nav, open, pay, freeze, extra, children }: { nav: Nav; open?: boolean; pay?: boolean; freeze?: boolean; noDue?: boolean; extra?: { label: string; onClick: () => void }[]; children?: any }) {
  const c = St.useS(x => x.card); const M = useMarket(); const market = St.useS(x => x.market); const on = Mod.useOn()
  const left = M.money(Math.max(0, c.limit - c.balance))
  const line = open ? `${left} left to spend of ${M.money(c.limit)}` : c.due > 0 ? `${left} left to spend · ${M.money(c.due, 2)} due ${M.date(c.dueDate, 'day')}` : `${left} left to spend · nothing to pay`
  return <D.CardFace last4={c.last4} balance={<D.CountUp id={'card-' + market} value={Math.round(Math.abs(c.balance))} format={(n: number) => (c.balance < 0 ? '+' : '') + M.money(n === Math.round(Math.abs(c.balance)) ? Math.abs(c.balance) : n, 2)} />} frozen={c.frozen} dueLine={line}
    onPay={pay && on('card.pay') && c.due > 0 ? () => nav.go('cardx', 'pay') : undefined} onOpen={open ? () => nav.go('card') : undefined} extra={extra}
    freeze={freeze && on('card.controls') ? { on: c.frozen, onChange: () => freezeToggle() } : undefined}>{children}</D.CardFace>
}
function cardActions(nav: Nav, on: (m: string) => boolean) {
  return [on('card.statements') && { icon: 'doc', label: 'Statement', onClick: () => nav.go('cardx', 'statements') }, on('card.transactions') && { icon: 'split', label: 'Spending', onClick: () => nav.go('card', 'spending') }, on('benefits') && { icon: 'shield', label: 'Benefits', onClick: () => nav.go('card', 'benefits') }, { icon: 'card', label: 'My card', onClick: () => nav.go('card') }].filter(Boolean) as { icon: string; label: string; onClick: () => void }[]
}
function benefitRun(b: typeof Cat.BENEFITS[number]): { f: string; a: any } { return b.key === 'lounge' ? { f: 'search', a: { cat: 'airport' } } : b.id === 'BE-8' ? { f: 'myStuff', a: {} } : b.id === 'BE-4' ? { f: 'docs', a: { topic: 'insurance' } } : b.id === 'BE-6' ? { f: 'search', a: { cat: 'dining' } } : b.id === 'BE-7' ? { f: 'search', a: { cat: 'tickets' } } : b.id === 'BE-5' ? { f: 'docs', a: { topic: 'abroad' } } : { f: 'myStuff', a: {} } }
const BENEFIT_SHORT: Record<string, string> = { 'BE-1': 'Free visits this year', 'BE-2': '120 days on what you buy', 'BE-3': 'An extra year', 'BE-4': 'When the trip is on the card', 'BE-5': 'On card purchases abroad', 'BE-6': '15% off at partners', 'BE-7': '48 hours before general sale', 'BE-8': 'If an order goes wrong' }
function benefitTiles(s: St.State, M: any, nav: Nav) {
  return Cat.BENEFITS.map(b => ({ key: b.id, icon: b.icon, title: b.name, sub: BENEFIT_SHORT[b.id] || b.sub, meta: b.key === 'lounge' ? `${s.loungeLeft} left` : undefined, onClick: () => { nav.go('chat'); run(benefitRun(b), b.name) } }))
}

/* ---------- My card: a hub. The card, its switches, the last few payments, what's included, then plain lists. Each part shows only if the bank offers it. ---------- */
export function Card({ nav, focus }: { nav: Nav; focus?: string }) {
  const s = St.useS(x => x); const M = useMarket(); const c = s.card as any; const on = Mod.useOn()
  const ask = (q: string) => { nav.go('chat'); Br.ask(q) }
  const x = (to: string) => () => nav.go('cardx', to)
  const at = c.gamblingLiftAt ? new Date(c.gamblingLiftAt) : null
  const control = (k: string, v: boolean) => { if (k === 'frozen') { if (v !== c.frozen) freezeToggle(); return } if (v) { here(F.cardControl({ control: k, on: true })); return } const r = F.cardControl({ control: k, on: false }); respond(r); D.toast(r.say || '') }
  const gamble = (v: boolean) => here(v ? (at ? F.gamblingKeep() : F.gamblingOn()) : F.gamblingLiftAsk())
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { if (focus === 'spending') { nav.go('cardx', 'txns'); return } if (focus) setTimeout(() => ref.current?.querySelector(`[data-sec="${focus}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 120) }, [focus])
  const alerts = Object.keys(s.seen).filter(k => k.startsWith('alert:') && s.seen[k])
  const arrived = on('card.activate') ? Bk.arrived() : undefined
  const open = s.bookings.filter(b => (b.extra?.case || b.title === 'Replacement card') && !['done', 'cancelled', 'refunded'].includes(b.status) && !b.extra?.closed)
  const lim = on('card.limits') ? Bk.limits() : {}, nLim = Object.keys(lim).length
  const notices = on('card.travel') ? Bk.notices() : []
  const wallets = Object.keys(s.seen.wallets || {})
  const ddName = M.directDebit.charAt(0).toUpperCase() + M.directDebit.slice(1)
  if (!on('card')) return <div className="app-scroll"><D.Head title="My card" onBack={nav.back} /><D.Empty title="Card services aren't available in this app" body="Your bank's app has everything about your card." /></div>
  const anyControl = on('card.controls') || on('card.gambling')
  const top3 = Cat.BENEFITS.filter(b => ['BE-1', 'BE-2', 'BE-4'].includes(b.id))
  return <div className="app-scroll" ref={ref}>
    <D.Head title="My card" onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />
    <CardSummary nav={nav} pay extra={on('card.details') ? [{ label: 'Card details', onClick: x('details') }] : []}>
      {on('card.directdebit') && !c.autopay && c.due > 0 && <D.CreamRow onClick={x('dd')}>{`Set up ${M.directDebit} so a bill is never missed`}</D.CreamRow>}
    </CardSummary>
    {arrived && <D.Note title="Your new card is here" action="Activate it" onAction={x('activate')}>Activate it to start using it. Anything set up on your old card moves across by itself.</D.Note>}
    {anyControl && <div data-sec="controls" className="ds-anchor"><D.Sec title="Controls" /></div>}
    {anyControl && <D.List>
      {on('card.controls') && <>
        <D.ToggleRow title="Freeze card" sub={c.frozen ? 'The switches below are paused while it\'s frozen' : undefined} on={c.frozen} onChange={(v: boolean) => control('frozen', v)} />
        <D.ToggleRow title="Online payments" on={c.online} dim={c.frozen} onChange={(v: boolean) => control('online', v)} />
        <D.ToggleRow title="Payments abroad" on={c.abroad} dim={c.frozen} onChange={(v: boolean) => control('abroad', v)} />
        <D.ToggleRow title="Contactless" on={c.contactless} dim={c.frozen} onChange={(v: boolean) => control('contactless', v)} />
        <D.ToggleRow title="Cash withdrawals" on={c.atm} dim={c.frozen} onChange={(v: boolean) => control('atm', v)} />
      </>}
      {on('card.gambling') && <D.ToggleRow title="Gambling block" sub={at ? `Lifts ${M.date(F.iso(at), 'day')} at ${M.clock(at.toTimeString().slice(0, 5))}. Switch on to keep it.` : undefined} on={!!c.gambling && !at} onChange={gamble} />}
    </D.List>}
    {on('card.transactions') && <><D.Sec title="Recent" more="See all" onMore={x('txns')} />
      <D.List>{s.txns.slice(0, 3).map(t => <D.Txn key={t.id} cat={t.cat} name={t.merchant} meta={`${t.cat} · ${M.date(new Date(t.at), 'day')}`} amount={t.amount} points={t.points || undefined} refund={t.refund} format={(n: number) => M.money(n, 2)} onClick={x('txn:' + t.id)} />)}</D.List></>}
    {on('benefits') && <><div data-sec="benefits" className="ds-anchor"><D.Sec title="Included with your card" more={`See all ${Cat.BENEFITS.length}`} onMore={x('benefits')} /></div>
      <D.Included items={top3.map(b => ({ key: b.id, icon: b.icon, title: b.name, sub: BENEFIT_SHORT[b.id] || b.sub, meta: b.key === 'lounge' ? `${s.loungeLeft} left` : undefined, onClick: () => { nav.go('chat'); run(benefitRun(b), b.name) } }))} /></>}
    <D.Sec title="Manage" />
    <D.List>
      {on('card.statements') && <D.Row icon="doc" title="Statements" meta={c.due > 0 ? `Due ${M.date(c.dueDate, 'day')}` : 'Paid'} chev onClick={x('statements')} />}
      {on('card.directdebit') && <D.Row icon="refresh" title={ddName} meta={!c.autopay ? 'Off' : c.autopayMode === 'min' ? 'Minimum' : 'Full balance'} chev onClick={x('dd')} />}
      {on('card.limits') && <D.Row icon="split" title="Spending limits" meta={nLim ? `${nLim} set` : 'None set'} chev onClick={x('limits')} />}
      {on('card.travel') && <D.Row icon="globe" title="Travel notice" meta={notices.length ? notices[0].where : 'None'} chev onClick={x('travel')} />}
      {on('card.pin') && <D.Row icon="lock" title="PIN" chev onClick={x('pin')} />}
      {on('card.wallet') && <D.Row icon="wallet" title="Phone wallet" meta={wallets.length ? 'Added' : 'Not added'} chev onClick={x('wallet')} />}
      {on('card.limit') && <D.Row icon="swap" title="Credit limit" meta={M.money(c.limit)} chev onClick={x('limit')} />}
    </D.List>
    {alerts.length > 0 && <><D.Sec title="Alerts" /><D.List>{alerts.map(k => <D.Row key={k} icon="bell" title={k.slice(6).charAt(0).toUpperCase() + k.slice(7)} value={<button className="ds-textbtn" onClick={() => St.set(x => ({ seen: { ...x.seen, [k]: false } }))}>Remove</button>} />)}</D.List></>}
    <D.Sec title="Help" />
    <D.List>
      {on('card.replace') && <D.Row icon="alert" title="Lost, stolen or damaged card" chev onClick={x('lost')} />}
      <D.Row icon="eye" title="A payment I don't recognise" chev onClick={() => ask("Someone took money I don't recognise")} />
      {on('card.disputes') && <D.Row icon="refresh" title="Dispute a payment" chev onClick={x('dispute')} />}
      <D.Row icon="doc" title="Your cases" meta={open.length ? `${open.length} open` : 'None open'} chev onClick={x('cases')} />
      <D.Row icon="headset" title="Talk to a person" chev onClick={() => ask('I want to talk to a person')} />
    </D.List>
  </div>
}

/* ---------- Rewards (Explore): every category, by chip ---------- */
export function Explore({ cat, setCat, nav }: { cat?: string; setCat: (c?: string) => void; nav: Nav }) {
  const s = St.useS(x => x); const M = useMarket(); const { go } = nav
  const [afford, setAfford] = useState(false)
  const showItem = (i: Cat.Item) => { go('chat'); run({ f: 'showItem', a: { id: i.id } }, i.title) }
  const priceOf = (i: Cat.Item) => i.cat === 'stays' ? F.stayPrice(i, '', 2) : F.IP(i)
  const card = (i: Cat.Item) => { const p = priceOf(i), pts = F.ptsOf(p), link = i.mode === 'link' || i.cat === 'giftcards'; return <D.RewardCard key={i.id} art={Cat.img(i.img) || D.STAMP[i.cat]} icon={i.icon} title={i.title} price={link ? (i.cat === 'giftcards' ? `From ${M.money(+F.giftAmounts()[0])}` : i.sub || '') : i.included && i.cat === 'subs' ? 'Included' : M.pts(pts)} short={!link && !(i.included && i.cat === 'subs') && pts > s.balance ? `${M.num(pts - s.balance)} more` : undefined} onUse={() => showItem(i)} onOpen={() => showItem(i)} /> }
  const keep = (i: Cat.Item) => !afford || F.ptsOf(priceOf(i)) <= s.balance
  const picked = [...F.itemsFor('stays').slice(0, 2), ...F.itemsFor('experiences').slice(0, 2), ...F.itemsFor('tickets').slice(0, 2), ...F.itemsFor('shopping').slice(0, 2)].filter(i => i && i.img && Mod.on(i.cat)).filter(keep)
  const c = cat ? Cat.CATS.find(x => x.key === cat) : undefined
  const items = cat ? F.itemsFor(cat).filter(keep).slice(0, 8) : []
  const sub = cat ? SUBCATS(M.id)[cat]?.filter(([l]) => l !== 'Trains' || Cat.rides(M.id).some(r => /^Train to /.test(r.title))) : undefined
  return <div className="app-scroll">
    <D.Head title="Rewards" onBack={nav.back} right={<D.HBtn icon="search" label="Search rewards" onClick={() => { go('chat'); setTimeout(() => (document.querySelector('.gr-ask input') as HTMLInputElement | null)?.focus(), 50) }} />} />
    <div className="ds-balrow"><span className="ds-balpill"><i /><span>{M.pts(s.balance)}</span></span><label className="ds-afford">Only what I can afford<button role="switch" aria-checked={afford} aria-label="Only what I can afford" className="ds-toggle" onClick={() => setAfford(!afford)} /></label></div>
    <div className="ds-chiprow" role="group" aria-label="Categories"><button className="ds-chip" aria-pressed={!cat} onClick={() => setCat(undefined)}>All</button>{Cat.CATS.filter(x => Mod.on(x.key)).map(x => <button key={x.key} className="ds-chip" aria-pressed={cat === x.key} onClick={() => setCat(x.key)}>{x.label}</button>)}</div>
    {!cat && <><D.Sec title="Picked for you" /><div className="ds-grid">{picked.map(card)}</div></>}
    {c && !Mod.on(c.key) && <D.Empty title={Mod.unavailable(c.key)} body="Your bank doesn't offer it yet." />}
    {c && Mod.on(c.key) && <>
      {sub && sub.length > 0 && <div className="ds-chiprow" role="list" aria-label={`${c.label} types`}>{sub.map(([label, act]) => <button key={label} role="listitem" className="ds-chip" onClick={() => { go('chat'); run(act, label) }}>{label}</button>)}</div>}
      {cat === 'flights' && <D.List>{Cat.dests(M.id).map(d => { const from = Math.min(...Cat.searchFlights(M.id, d, F.iso(F.nextFriday())).map(o => o.price)); return <D.Row key={d.code} icon="plane" title={d.name} sub={`${d.country} · ${Cat.durTxt(d.dur)} from ${Cat.home(M.id).code}`} value={M.pts(F.ptsOf(from))} chev onClick={() => { go('chat'); run({ f: 'flightSearch', a: { city: d.name } }, `Flights to ${d.name}`) }} /> })}</D.List>}
      {items.length > 0 && !['quick', 'bank', 'benefits', 'points', 'invest', 'charity', 'docs', 'concierge', 'moments'].includes(cat!) && <div className="ds-grid">{items.map(card)}</div>}
      {cat === 'quick' && <Blocks blocks={[{ kind: 'grocery' }]} />}
      {cat === 'bank' && <Blocks blocks={[{ kind: 'balance' }, { kind: 'controls' }]} />}
      {cat === 'benefits' && <Blocks blocks={[{ kind: 'benefits' }]} />}
      {cat === 'points' && <Blocks blocks={[{ kind: 'points' }, { kind: 'programmes' }]} />}
      {cat === 'invest' && <Blocks blocks={[{ kind: 'invest' }]} />}
      {cat === 'charity' && <Blocks blocks={[{ kind: 'charities' }]} />}
      {cat === 'docs' && <Blocks blocks={[{ kind: 'insurance' }, { kind: 'esim' }]} />}
      {cat === 'concierge' && <Blocks blocks={[{ kind: 'conciergeform' }]} />}
      {cat === 'moments' && <Blocks blocks={[{ kind: 'challenges' }]} />}
    </>}
  </div>
}

/* ---------- Your offers ---------- */
export function Offers({ nav }: { nav: Nav }) {
  const seen = St.useS(s => s.seen); const [tab, setTab] = useState('For you')
  const list = OFFERS.filter(([id]) => tab === 'Added' ? seen['offer:' + id] : true)
  return <div className="app-scroll">
    <D.Head title="Your offers" onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />
    <D.Seg items={['For you', `All ${OFFERS.length}`, 'Added']} value={tab} onChange={setTab} />
    <div className="ds-offers-col">{list.length ? list.map(([id, b, , , r]) => <D.OfferMini key={id} art={D.STAMP[STAMP_OFFER[id]]} title={`${r} at ${b}`} sub="Until 31 Oct · when you pay with your card" added={!!seen['offer:' + id]} onAdd={() => addOffer(id, b, r, !seen['offer:' + id])} />) : <p className="ds-row-s">Offers you add show up here.</p>}</div>
  </div>
}

/* ---------- Activity (Wallet): bookings, orders and points ---------- */
export function Wallet({ nav, start }: { nav: Nav; start?: string }) {
  const s = St.useS(x => x); const M = useMarket(); const bs = s.bookings
  const [tabS, setTab] = useState(start === 'Points' ? 'Points' : '')
  const dead = (b: St.Booking) => ['cancelled', 'refunded'].includes(b.status)
  const groups: [string, St.Booking[]][] = [
    ['Coming up', bs.filter(b => !dead(b) && ['ticket', 'booking'].includes(b.kind || '')).sort((x, y) => String(x.extra?.date || '9999').localeCompare(String(y.extra?.date || '9999')))],
    ['Subscriptions', bs.filter(b => b.kind === 'sub')],
    ['Requests', bs.filter(b => ['request', 'claim', 'transfer', 'investment'].includes(b.kind || ''))],
    ['Past', bs.filter(b => (dead(b) && b.kind !== 'order') || b.kind === 'donation')],
  ]
  const orders = bs.filter(b => b.kind === 'order')
  const tab = tabS || (groups.some(([, l]) => l.length) ? 'Bookings' : orders.length ? 'Orders' : 'Bookings')
  const block = (b: St.Booking) => <Blocks key={b.id} blocks={[b.tracker && !dead(b) && b.tracker.current < b.tracker.steps.length - 1 ? { kind: 'tracker', id: b.id } : { kind: 'booking', id: b.id, inline: true }]} />
  const month = new Date().getMonth(), mName = M.date(new Date(), 'long').split(' ').pop() || ''
  const inMonth = s.ledger.filter(l => new Date(l.at).getMonth() === month)
  const earned = inMonth.filter(l => l.pts > 0).reduce((a, l) => a + l.pts, 0), spent = inMonth.filter(l => l.pts < 0).reduce((a, l) => a + l.pts, 0)
  const days: [string, St.Ledger[]][] = []; s.ledger.forEach(l => { const d = M.date(new Date(l.at), 'long'); const g = days.find(x => x[0] === d); g ? g[1].push(l) : days.push([d, [l]]) })
  return <div className="app-scroll">
    <D.Head title="Wallet" onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />
    <D.Seg items={['Bookings', 'Orders', 'Points']} value={tab} onChange={setTab} />
    {tab === 'Bookings' && (groups.every(([, l]) => !l.length) ? <p className="ds-row-s">Trips, tables, tickets and subscriptions show up here.</p> : groups.filter(([, l]) => l.length).map(([g, l]) => <React.Fragment key={g}><D.Label>{g}</D.Label>{l.map(block)}</React.Fragment>))}
    {tab === 'Orders' && (orders.length ? orders.map(block) : <p className="ds-row-s">Shopping, groceries and gift cards show up here.</p>)}
    {tab === 'Points' && <>
      <div className="ds-stats"><div className="ds-stat"><p>{`Earned in ${mName}`}</p><b className="ds-good">{`+${M.num(earned)}`}</b></div><div className="ds-stat"><p>{`Spent in ${mName}`}</p><b>{`${spent ? '−' : ''}${M.num(Math.abs(spent))}`}</b></div></div>
      {days.map(([d, l]) => <React.Fragment key={d}><D.Label>{d}</D.Label><D.List>{l.map(x => <D.Row key={x.id} icon={x.pts >= 0 ? 'plus' : 'arrow'} title={x.label.replace(/^Balance brought forward$/, 'Points from before')} value={`${x.pts >= 0 ? '+' : '−'}${M.num(Math.abs(x.pts))}`} tone={x.pts >= 0 ? 'good' : undefined} />)}</D.List></React.Fragment>)}
      {(s.pending || []).length > 0 && <><D.Label>Pending points</D.Label><D.List>{(s.pending || []).map(p => <D.Row key={p.id} icon="clock" title={p.label} sub={p.pts ? `Land ${M.date(p.lands!)}` : 'Waiting for a purchase'} value={p.pts ? `+${M.num(p.pts)}` : undefined} />)}</D.List></>}
    </>}
  </div>
}

/* ---------- Alerts (the bell) ---------- */
export function Alerts({ nav }: { nav: Nav }) {
  const s = St.useS(x => x); const M = useMarket(); const ms = moments(s, M)
  const done = s.bookings.filter(b => ['claim', 'request', 'transfer', 'donation'].includes(b.kind || '') || ['done', 'delivered'].includes(b.status)).slice(0, 5)
  const act = (f: () => void) => { nav.go('chat'); f() }
  return <div className="app-scroll">
    <D.Head title="Alerts" onBack={nav.back} right={ms.length ? <button className="ds-textbtn" onClick={() => St.set(x => ({ seen: { ...x.seen, ...Object.fromEntries(ms.map(m => [m.key, true])) } }))}>Clear</button> : undefined} />
    <D.Sec title="For you" />
    {ms.length ? <>{ms[0] && <D.Note title={ms[0].title} action={ms[0].action} onAction={() => act(ms[0].go)} secondary="Not now" onSecondary={() => St.set(x => ({ seen: { ...x.seen, [ms[0].key]: true } }))}>{ms[0].body}</D.Note>}{ms.length > 1 && <D.List>{ms.slice(1).map(m => <D.Row key={m.key} title={m.title} sub={m.body} chev onClick={() => act(m.go)} />)}</D.List>}</> : <p className="ds-row-s">Nothing new right now.</p>}
    {done.length > 0 && <><D.Sec title="Done for you" /><D.List>{done.map(b => <D.Row key={b.id} icon="check" title={b.title} sub={M.date(new Date(b.createdAt))} chev onClick={() => nav.go('wallet')} />)}</D.List></>}
  </div>
}

/* ---------- Your tier ---------- */
export function Tier({ nav }: { nav: Nav }) {
  const M = useMarket()
  return <div className="app-scroll">
    <D.Head title="Your tier" onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 4 }}><div className="ds-ring" style={{ width: 168, height: 168 }}><img src={D.ART.ring} alt="" style={{ width: 168, height: 168 }} /><div className="ds-core" style={{ left: 35, top: 35, width: 97, height: 97, borderRadius: 48 }}><span>{TIER.name.toUpperCase()}</span></div></div><h1 style={{ margin: 0, fontSize: '1.625rem', fontWeight: 800, letterSpacing: '-0.5px', textAlign: 'center' }}>{`${M.num(toNext())} points to ${TIER.next}`}</h1></div>
    <div className="ds-card"><div className="gr-row" style={{ justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}><span className="ds-row-s" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Tier points this year</span><b style={{ fontSize: '0.875rem' }}>{`${M.num(TIER.have)} of ${M.num(TIER.need)}`}</b></div><div className="ds-progress"><i style={{ width: `${Math.round(TIER.have / TIER.need * 100)}%` }} /></div></div>
    <D.Note title="Nearly there">{`${M.num(toNext())} more tier points and you move up to ${TIER.next}.`}</D.Note>
    <div className="ds-card"><b style={{ fontSize: '0.9375rem' }}>{`What ${TIER.next} adds`}</b>{TIER.adds.map(a => <div key={a} className="ds-benefit"><Icon name="check" size={18} stroke={2.6} />{a}</div>)}</div>
  </div>
}

/* ---------- Your bank's app, with the way into Gratifi: exactly as the approved Bank screen ---------- */
export function Bank({ nav }: { nav: Nav }) {
  const s = St.useS(x => x); const M = useMarket()
  const acct = Math.round(Cat.px(2340, s.market)) + 0.18
  const rows: [string, string, string, number][] = [['card', 'Supermarket', 'Today', -Cat.px(42.1, s.market)], ['card', 'Coffee', 'Today', -Cat.px(3.4, s.market)], ['arrow', 'Salary', M.date(new Date(Date.now() - 26 * 864e5), 'day'), Math.round(Cat.px(2850, s.market))]]
  const notHere = () => D.toast('This part of your bank\'s app isn\'t in the demo.')
  return <div className="ds-bankapp">
    <div className="app-scroll ds-bank">
      <div className="ds-homehd"><span className="ds-bankmark">YOUR BANK</span><span className="ds-av" style={{ width: 40, height: 40, fontSize: '0.9375rem', background: '#E3E3E7', color: '#141416' }}>{(s.prefs.name || 'Y').charAt(0)}</span></div>
      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.4px' }}>{`${hello(M)}, ${s.prefs.name}`}</p>
      <D.Amount label="Current account" right="•••• 7781" value={M.money(acct, 2)}><div className="ds-ac-pills"><D.Pill onClick={notHere}>Pay</D.Pill><D.Pill onClick={notHere}>Move money</D.Pill></div></D.Amount>
      <button className="ds-entry" onClick={() => nav.go('home')}>
        <span className="ds-entry-top"><span className="ds-ring" style={{ width: 60, height: 60 }}><img src={D.ART.ring} alt="" style={{ width: 60, height: 60 }} /><span className="ds-core" style={{ left: 13, top: 13, width: 34, height: 34, borderRadius: 17 }} /></span><span className="ds-pts-b"><span className="ds-pts-l">Your points</span><span style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>{M.num(s.balance)}</span></span><Icon name="chev" size={18} stroke={2.2} /></span>
        {s.expiring > 0 && <span className="ds-entry-note"><i /><span>{`${M.num(s.expiring)} expire on 31 Oct. Enough for a gift card or a lounge visit.`}</span></span>}
        <span className="ds-entry-ask"><Spark size={18} />Ask about your points</span>
      </button>
      <D.List>{rows.map(([ic, t, d, v]) => <D.Row key={t} icon={ic} title={t} sub={d} value={`${v < 0 ? '−' : '+'}${M.money(Math.abs(v), 2)}`} tone={v > 0 ? 'good' : undefined} />)}</D.List>
    </div>
    <nav className="ds-tabbar" aria-label="Your bank">{([['home', 'Home', () => { }], ['arrow', 'Payments', notHere], ['card', 'Cards', () => nav.go('card')], ['grid', 'More', notHere]] as [string, string, () => void][]).map(([ic, l, f], i) => <button key={l} className={i ? '' : 'on'} aria-current={i ? undefined : 'page'} onClick={f}><Icon name={ic} size={22} stroke={2} /><span>{l}</span></button>)}</nav>
  </div>
}

/* ---------- You (settings and demo controls) ---------- */
export function Me({ nav, theme, setTheme }: { nav: Nav; theme: string; setTheme: (t: string) => void }) {
  const s = St.useS(x => x); const M = useMarket()
  const sim = (k: keyof St.State['sim'], v: boolean) => St.set(x => ({ sim: { ...x.sim, [k]: v } }))
  const ask = (q: string) => { nav.go('chat'); Br.ask(q) }
  const alerts: [string, string, string][] = [['moments', 'Moments from Gratifi', 'Useful things worth doing now, at most 3 a week'], ['offers', 'Offers', 'Card offers that match what you buy'], ['trips', 'Trip updates', 'Delays, gates, check-in'], ['orders', 'Order updates', 'Dispatch and delivery'], ['spend', 'Every card payment', 'A note each time the card is used']]
  const addr = s.addresses.find(a => a.id === s.addr), other = s.addresses.find(a => a.id !== s.addr)
  return <div className="app-scroll">
    <D.Head title="You" onBack={nav.back} right={<D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />
    <button className="ds-profile" onClick={() => nav.go('tier')}><span className="ds-av">{(s.prefs.name || 'Y').charAt(0)}</span><span className="ds-row-b"><span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{s.prefs.full || s.prefs.name}</span><span className="ds-row-s">{`${TIER.name} member · ${M.num(toNext())} points to ${TIER.next}`}</span></span><Icon name="chev" size={18} stroke={2.2} /></button>
    <D.List>{Mod.on('card') && <D.Row icon="card" title="My card" sub={`Gratifi Card •••• ${s.card.last4}`} chev onClick={() => nav.go('card')} />}<D.Row icon="wallet" title="Wallet" sub="Bookings, orders and points" chev onClick={() => nav.go('wallet')} /></D.List>
    <D.Label>Your assistant</D.Label>
    <D.List>{alerts.map(([k, t, d]) => <D.ToggleRow key={k} title={t} sub={d} on={!!s.alerts[k]} onChange={(v: boolean) => St.set(x => ({ alerts: { ...x.alerts, [k]: v } }))} />)}<D.ToggleRow title="Always ask before spending" sub="Every booking and payment needs your OK." on lock onChange={() => { }} /></D.List>
    <D.Label>What I remember</D.Label>
    <D.List>
      <D.Row title={s.prefs.aisle ? 'Aisle seat' : 'Seats: no preference'} value={s.prefs.aisle ? <button className="ds-x" aria-label="Forget aisle seat" onClick={() => St.set(x => ({ prefs: { ...x.prefs, aisle: false } }))}><Icon name="close" size={12} stroke={2.4} /></button> : <button className="ds-textbtn" onClick={() => St.set(x => ({ prefs: { ...x.prefs, aisle: true } }))}>Prefer the aisle</button>} />
      <D.Row title="Delivery address" sub={`${addr?.label}, ${addr?.line}`} value={<button className="ds-textbtn" onClick={() => St.set(x => ({ addr: x.addr === 'a1' ? 'a2' : 'a1' }))}>{`Use ${other?.label}`}</button>} />
    </D.List>
    <D.Label>Market and language</D.Label>
    <div className="ds-chiprow" style={{ flexWrap: 'wrap', marginRight: 0 }} role="group">{Object.keys(MARKETS).map(k => <button key={k} className="ds-chip" aria-pressed={s.market === k} onClick={() => s.market !== k && St.switchMarket(k)}>{MARKETS[k].name}</button>)}</div>
    <D.List><D.ToggleRow title="Dark mode" sub="Follows your phone unless you change it" on={theme === 'dark'} onChange={(v: boolean) => setTheme(v ? 'dark' : 'light')} /></D.List>
    <p className="ds-foot"><Icon name="info" size={14} stroke={2} />Gratifi is an AI assistant. It can make mistakes, so it always asks before spending your points or money. Your name and card details come from the bank.</p>
    <div className="app-demo"><div className="gr-row" style={{ gap: 8 }}><Icon name="bolt" size={18} /><b>Demo controls</b></div><div className="gr-meta">This stands in for the bank. Use it to test what happens when things change.</div>
      <div className="gr-actions"><K.Button size="sm" onClick={() => { St.addPoints(5000, 'Points adjustment (demo)'); St.pushMsg({ role: 'gr', text: `Demo: ${M.pts(5000)} came in from the bank. Your balance is now ${M.pts(St.get().balance)}.` }) }}>Points come in (+{M.num(5000)})</K.Button><K.Button size="sm" variant="secondary" onClick={() => cardPayment(M)}>A card payment</K.Button></div>
      {([['priceRise', 'Price rises at the next checkout'], ['supplierDown', 'Supplier is down'], ['decline', 'Card is declined']] as [keyof St.State['sim'], string][]).map(([k, l]) => <div key={k} className="gr-row" style={{ justifyContent: 'space-between' }}><span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{l}</span><K.Toggle label={l} on={s.sim[k]} onChange={(v: boolean) => sim(k, v)} /></div>)}
      <div className="gr-actions"><K.Button size="sm" variant="secondary" onClick={() => simulate('cancel')}>Cancel my next flight</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('late')}>Delay my order</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('deliver')}>Deliver my order</K.Button><K.Button size="sm" variant="secondary" onClick={() => { respond(F.settlePending()); (window as any).__go?.('chat') }}>Return window ends</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('fraud')}>Suspicious payment</K.Button></div>
      <div className="gr-actions"><K.Button size="sm" variant="secondary" onClick={() => simulate('card')}>New card arrives</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('cases')}>Bank decides cases</K.Button></div>
      <Connections />
      <ResetButton /></div>
  </div>
}
/* The bank's APIs, switchable here to show how the app looks for a bank that offers fewer of them. */
function Connections() {
  const off = (St.useS(s => s.seen.apisOff) || {}) as Record<string, boolean>; const [open, setOpen] = useState(false)
  const set = (o: Record<string, boolean>) => St.set(s => ({ seen: { ...s.seen, apisOff: o } }))
  const nOn = Mod.APIS.filter(a => !off[a.id]).length, mods = Mod.MODULES.filter(m => Mod.on(m.id)).length
  const only = (groups: string[]) => set(Object.fromEntries(Mod.APIS.filter(a => !groups.includes(a.group)).map(a => [a.id, true])))
  const groups = Array.from(new Set(Mod.APIS.map(a => a.group)))
  return <div className="gr-col" style={{ gap: 10 }}>
    <div className="gr-row" style={{ justifyContent: 'space-between', gap: 8 }}><span><b style={{ fontSize: '0.875rem' }}>Bank connections</b><span className="gr-meta" style={{ display: 'block' }}>{`${nOn} of ${Mod.APIS.length} bank connections on`}</span></span><K.Button size="sm" variant="secondary" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</K.Button></div>
    {open && <>
      <div className="gr-meta">Each service needs the bank APIs listed. Switch one off and every screen, button and answer that needs it disappears.</div>
      <div className="gr-actions"><K.Button size="sm" variant="secondary" onClick={() => set({})}>Everything</K.Button><K.Button size="sm" variant="secondary" onClick={() => only(['Card', 'Payments', 'Credit'])}>Card only</K.Button><K.Button size="sm" variant="secondary" onClick={() => only(['Card', 'Payments', 'Credit', 'Rewards'])}>Card and points</K.Button><K.Button size="sm" variant="secondary" onClick={() => only(['Rewards', 'Partners', 'Service'])}>Rewards only</K.Button></div>
      {groups.map(g => <div key={g}><div className="gr-meta" style={{ fontWeight: 700, marginTop: 6 }}>{g}</div>{Mod.APIS.filter(a => a.group === g).map(a => <div key={a.id} className="ds-api"><span>{a.name}<br /><code data-notr>{a.id}</code></span><K.Toggle label={a.name} on={!off[a.id]} onChange={(v: boolean) => { const o = { ...off }; if (v) delete o[a.id]; else o[a.id] = true; set(o) }} /></div>)}</div>)}
      <div className="gr-meta" style={{ fontWeight: 700, marginTop: 6 }}>Services</div>
      <div className="ds-mods">{Mod.MODULES.map(m => <span key={m.id} className={Mod.on(m.id) ? '' : 'off'}>{m.name}</span>)}</div>
    </>}
  </div>
}
function cardPayment(M: any) {
  const s = St.get(), amt = Cat.px(42, s.market)
  if (s.card.frozen) { St.pushMsg({ role: 'gr', text: `Demo: a card payment of ${M.money(amt, 2)} at Café Lune was declined because your card is frozen. Nothing was charged.` }); return }
  if (s.sim.decline) { St.pushMsg({ role: 'gr', text: `Demo: a card payment of ${M.money(amt, 2)} at Café Lune was declined by the bank. Nothing was charged.` }); return }
  { const cap = Mod.on('card.limits') ? (s.seen.catLimits || {}).Dining : 0; if (cap && Bk.spentThisMonth('Dining') + amt > cap) { St.pushMsg({ role: 'gr', text: `Demo: a card payment of ${M.money(amt, 2)} at Café Lune was declined because it would take dining over your monthly limit of ${M.money(cap)}. Nothing was charged. You can change the limit on My card.` }); return } }
  const ep = Math.round(amt / St.rate() * 0.01)
  St.set(x => ({ txns: [{ id: St.uidx(), at: Date.now(), merchant: 'Café Lune', cat: 'Dining', amount: amt, points: ep }, ...x.txns], card: { ...x.card, balance: x.card.balance + amt }, balance: x.balance + ep, ledger: [{ id: St.uidx(), at: Date.now(), label: 'Points on card spend: Café Lune', pts: ep }, ...x.ledger] })); St.recordSpend('Dining', amt)
  St.pushMsg({ role: 'gr', text: St.get().alerts.spend ? `Card used at Café Lune for ${M.money(amt, 2)}. You earned ${M.num(ep)} points.` : `Demo: a card payment of ${M.money(amt, 2)} at Café Lune came in and earned ${M.num(ep)} points. Turn on Every card payment under Your assistant in your settings to get a note each time.` })
}

/* Subcategories: a way into each category. Each runs a fixed action, so it works the same in every market and mode. */
type Act = { f: string; a: any }
const SUBCATS = (m: string): Record<string, [string, Act][]> => {
  const D = Cat.dests(m), h = Cat.home(m).city, fri = F.iso(F.nextFriday())
  return {
    flights: [['This weekend', { f: 'flightSearch', a: { city: D[0].name, date: fri, back: F.addDays(fri, 2), pax: 2 } }], ['Cheapest days', { f: 'flexDates', a: { city: D[1].name, pax: 1 } }], ['City breaks', { f: 'flightSearch', a: { city: D[1].name, date: fri, back: F.addDays(fri, 3), pax: 2 } }], ['Direct only', { f: 'flightSearch', a: { city: D[2].name, date: fri, back: F.addDays(fri, 3), pax: 1, direct: true } }]],
    stays: [['With a pool', { f: 'search', a: { cat: 'stays', city: D[0].name, query: 'with a pool' } }], ['City centre', { f: 'search', a: { cat: 'stays', city: D[1].name, query: 'central' } }], ['Breakfast included', { f: 'search', a: { cat: 'stays', city: D[0].name, query: 'with breakfast' } }], ['Family rooms', { f: 'search', a: { cat: 'stays', city: D[0].name, pax: 4 } }]],
    dining: [['Tonight', { f: 'search', a: { cat: 'dining', city: h, pax: 2 } }], ['Special occasion', { f: 'search', a: { cat: 'dining', city: h, pax: 2, query: 'upmarket' } }], ['Plant-based', { f: 'search', a: { cat: 'dining', city: h, query: 'plant-based' } }], ['Big groups', { f: 'concierge', a: { hint: 'A table for a big group' } }]],
    experiences: [['Near you', { f: 'search', a: { cat: 'experiences', city: h } }], [`In ${D[0].name}`, { f: 'search', a: { cat: 'experiences', city: D[0].name } }], [`In ${D[1].name}`, { f: 'search', a: { cat: 'experiences', city: D[1].name } }]],
    tickets: [['Concerts', { f: 'search', a: { cat: 'tickets', query: 'concert' } }], ['Sport', { f: 'search', a: { cat: 'tickets', query: 'football' } }], ['Theatre', { f: 'search', a: { cat: 'tickets', query: 'theatre' } }], ['Cinema', { f: 'search', a: { cat: 'tickets', query: 'cinema' } }]],
    shopping: [['Electronics', { f: 'search', a: { cat: 'shopping', query: 'electronics' } }], ['Fashion', { f: 'search', a: { cat: 'shopping', query: 'fashion' } }], ['Home', { f: 'search', a: { cat: 'shopping', query: 'home' } }], ['Travel gear', { f: 'search', a: { cat: 'shopping', query: 'travel' } }]],
    giftcards: [['Dining', { f: 'search', a: { cat: 'giftcards', query: 'dining' } }], ['Flowers', { f: 'search', a: { cat: 'giftcards', query: 'flowers' } }], ['Books', { f: 'search', a: { cat: 'giftcards', query: 'books' } }], ['Electronics', { f: 'search', a: { cat: 'giftcards', query: 'electronics' } }]],
    rides: [['Ride now', { f: 'search', a: { cat: 'rides', query: 'ride' } }], ['Airport transfer', { f: 'search', a: { cat: 'rides', query: 'airport transfer' } }], ['Car hire', { f: 'route', a: { text: 'hire a car' } }], ['Trains', { f: 'route', a: { text: 'book a train' } }]],
    airport: [['Lounges', { f: 'search', a: { cat: 'airport', query: 'lounge' } }], ['Fast track', { f: 'search', a: { cat: 'airport', query: 'fast track' } }], ['Meet and greet', { f: 'search', a: { cat: 'airport', query: 'meet and greet' } }]],
    quick: [['Breakfast', { f: 'basketStart', a: { query: 'milk eggs bread' } }], ['Baby', { f: 'basketStart', a: { query: 'nappies wipes' } }], ['Household', { f: 'basketStart', a: { query: 'toilet roll dishwasher tablets' } }], ['Snacks', { f: 'basketStart', a: { query: 'crisps chocolate' } }]],
    subs: [['Films and series', { f: 'search', a: { cat: 'subs', query: 'films' } }], ['Music', { f: 'search', a: { cat: 'subs', query: 'music' } }], ['All subscriptions', { f: 'search', a: { cat: 'subs' } }]],
  }
}
/* ---------- Chat ---------- */
export function Chat({ nav }: { nav: Nav }) {
  const chat = St.useS(s => s.chat); const M = useMarket(); const [mode, setMode] = useState(Br.getMode())
  useEffect(() => { Br.recheck(); return Br.onMode(() => setMode(Br.getMode())) as any }, [])
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = ref.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }) }, [chat.length, chat[chat.length - 1]?.blocks?.length, chat[chat.length - 1]?.text])
  const busy = chat.some(m => m.thinking)
  return <div className="app-chat">
    <div className="app-chat-hd"><D.Head title={chatTitle(chat)} onBack={nav.back} right={busy && mode === 'claude' ? <button className="ds-textbtn" onClick={Br.stop}>Stop</button> : chat.length > 0 && !busy ? <ClearChat /> : <D.HBtn icon="close" label="Close" onClick={() => nav.go('home')} />} />{mode === 'claude' && <span className="app-mode" title="Answers come from Claude, using the app's own tools"><i className="on" />Live AI</span>}</div>
    <div className="app-sr" aria-live="polite" aria-atomic="true">{(() => { const l = [...chat].reverse().find(m => m.role === 'gr' && !m.thinking); return l ? (l.text || (l.blocks?.length ? 'New options below.' : '')) : '' })()}</div>
    <div className="app-scroll gr-thread" ref={ref}>
      {chat.length === 0 && <div className="gr-col" style={{ gap: 14, paddingTop: 10 }}><div className="gr-title">What can I do for you?</div><div className="gr-meta">Ask for anything on your card. I show the options; you decide with a button.</div><Blocks blocks={[{ kind: 'cats' }]} /><div className="ds-again" style={{ flexWrap: 'wrap', marginRight: 0 }}>{['Flights to ' + Cat.dests(M.id)[0].name + ' next weekend for two', 'A table tonight for two', 'Milk, eggs and bread', 'Freeze my card', 'Transfer points to miles', 'What does my card cover?'].map(t => <button key={t} style={{ paddingInlineStart: 14 }} onClick={() => Br.ask(t)}>{t}</button>)}</div></div>}
      {chat.map(m => m.role === 'user' ? <T.YouSaid key={m.id}>{m.text}</T.YouSaid> : <div key={m.id} className="gr-answer">
        {m.steps && m.steps.length > 0 && <T.Steps steps={m.steps} running={m.thinking} />}
        {m.thinking && !m.text && !(m.blocks || []).length && <T.Typing />}
        {m.text && <div className="gr-say">{m.text}</div>}
        {m.blocks && <Blocks blocks={m.blocks} msgId={String(m.id)} />}
      </div>)}
      <div style={{ height: 8 }} />
    </div>
  </div>
}

function ClearChat() {
  const [sure, setSure] = useState(false)
  React.useEffect(() => { if (sure) { const t = setTimeout(() => setSure(false), 4000); return () => clearTimeout(t) } }, [sure])
  return sure ? <button className="ds-textbtn" onClick={() => { St.set(() => ({ chat: [] })); setSure(false) }}>Tap again to clear</button> : <D.HBtn icon="trash" label="Clear" onClick={() => setSure(true)} />
}
/** The chat header names what the conversation is about, as on the approved screens (Your Lisbon trip, Hotels). */
const CAT_TITLE: Record<string, string> = { dining: 'Restaurants', experiences: 'Things to do', tickets: 'Events', shopping: 'Shopping', giftcards: 'Gift cards', subs: 'Subscriptions', airport: 'At the airport', rides: 'Rides and rail', quick: 'Groceries' }
function chatTitle(chat: St.Msg[]): string {
  for (let i = chat.length - 1; i >= 0 && i >= chat.length - 8; i--) {
    for (const b of [...(chat[i].blocks || [])].reverse() as any[]) {
      if (b.kind === 'flights' || b.kind === 'fares') { const f = F.flightById(b.kind === 'flights' ? b.ids?.[0] : b.id); if (f) return `Flights to ${f.city}` }
      if (b.kind === 'calendar' && b.city) return `Flights to ${b.city}`
      if (b.kind === 'items' || b.kind === 'detail') { const it = F.findItem(b.kind === 'items' ? b.ids?.[0] : b.id); if (it) return it.cat === 'stays' ? `Hotels in ${it.city || (it.sub || '').split(', ').pop()}` : CAT_TITLE[it.cat] || 'Gratifi' }
      if (['receipt', 'booking', 'pass', 'tracker', 'disruption', 'changeflight', 'seatchange', 'confirmcancel'].includes(b.kind)) { const bk = St.get().bookings.find(x => x.id === b.id); if (bk) return ['transfer', 'donation', 'investment'].includes(bk.kind || '') ? 'Your points' : bk.cat === 'stays' ? 'Your stay' : bk.cat === 'flights' ? `Your ${bk.title.split(' to ')[1]} trip` : bk.kind === 'order' ? 'Your order' : 'Your bookings' }
      if (['balance', 'controls', 'statement', 'spend', 'txns', 'paybill', 'directdebit', 'gambling'].includes(b.kind)) return 'Your card'
      if (['points', 'programmes', 'charities', 'invest', 'member', 'challenges'].includes(b.kind)) return 'Your points'
      if (b.kind === 'grocery') return 'Groceries'
      if (['visa', 'insurance', 'esim', 'insurefacts', 'essentials'].includes(b.kind)) return 'Travel essentials'
      if (b.kind === 'conciergeform') return 'Concierge'
      if (b.kind === 'handoff' || b.kind === 'claimform') return 'Help'
      if (b.kind === 'benefits') return 'Card benefits'
    }
  }
  return 'Gratifi'
}
function ResetButton() {
  const [sure, setSure] = useState(false)
  return sure ? <div className="gr-row" style={{ gap: 8, flexWrap: 'wrap' }}><span className="gr-meta">Reset everything in this market?</span><K.Button size="sm" onClick={() => { St.reset(); setSure(false) }}>Yes, reset</K.Button><K.Button size="sm" variant="secondary" onClick={() => setSure(false)}>Keep</K.Button></div> : <K.Button size="sm" variant="ghost" onClick={() => setSure(true)}>Reset demo</K.Button>
}
function simulate(k: string) {
  const s = St.get(), M = (window as any).__M
  if (k === 'cancel') {
    const f = s.bookings.find(b => b.cat === 'flights' && b.status === 'confirmed' && !b.extra?.rebooked && !b.extra?.disrupted)
    if (!f) { const moved = s.bookings.some(b => b.cat === 'flights' && b.status === 'confirmed' && b.extra?.rebooked); St.pushMsg({ role: 'gr', text: moved ? 'Your flight was already moved to the next day after the last cancellation. Book another flight to see this again.' : 'Book a flight first, then I can show you what happens when it\'s cancelled.' }); (window as any).__go?.('chat'); return }
    St.updateBooking(f.id, { extra: { ...f.extra, disrupted: true } })
    St.pushMsg({ role: 'gr', text: `Your ${f.extra?.dep} flight to ${f.title.split(' to ')[1]} has been cancelled by the airline. Your options are below; there's no need to queue or call anyone.`, blocks: [{ kind: 'disruption', id: f.id }] })
  }
  if (k === 'deliver') {
    const o = s.bookings.find(b => b.kind === 'order' && b.tracker && b.status !== 'delivered' && !b.extra?.returning && !['cancelled', 'refunded'].includes(b.status) && b.cat !== 'bank')
    if (!o) { St.pushMsg({ role: 'gr', text: 'There\'s no order on the way. Order something first.' }); (window as any).__go?.('chat'); return }
    St.updateBooking(o.id, { status: 'delivered', tracker: { ...o.tracker!, current: o.tracker!.steps.length - 1, tone: undefined, eta: 'Delivered' } })
    St.pushMsg({ role: 'gr', text: `Your ${o.title} order was delivered.`, blocks: [{ kind: 'booking', id: o.id }] }); (window as any).__go?.('chat')
  }
  if (k === 'late') {
    const o = s.bookings.find(b => b.kind === 'order' && b.tracker && b.status !== 'delivered' && !['cancelled', 'refunded'].includes(b.status))
    if (!o) { St.pushMsg({ role: 'gr', text: 'Order something first, then I can show you a delay.' }); (window as any).__go?.('chat'); return }
    const quick = o.cat === 'quick', newDay = F.addDays(F.iso(new Date()), 3)
    St.updateBooking(o.id, { tracker: { ...o.tracker!, current: Math.max(o.tracker!.current, quick ? 2 : 1), tone: 'warn', eta: quick ? 'Running late' : M.date(newDay) } })
    St.pushMsg({ role: 'gr', text: quick ? `Your grocery order is running late: the courier is stuck in traffic. New estimate in 20 minutes. You can wait, or cancel now for a full refund.` : `Your ${o.title} order is running a day late: the courier has a backlog. It should now arrive on ${M.date(newDay)}. You can wait, or cancel now for a full refund.`, blocks: [{ kind: 'tracker', id: o.id }, { kind: 'state', state: 'price', title: 'Delivery is late', body: 'Nothing more is charged if you cancel.', actions: [{ label: 'Cancel for a full refund', act: { f: 'manage', a: { id: o.id, action: 'cancel' } } }, { label: 'Keep waiting', act: { f: 'alertSet', a: { what: 'when it\'s moving again' } } }] }] })
  }
  if (k === 'card') {
    const o = s.bookings.find(b => (b.extra?.case === 'replacement' || b.title === 'Replacement card') && b.status !== 'delivered' && !['cancelled', 'refunded', 'done'].includes(b.status))
    if (!o) { St.pushMsg({ role: 'gr', text: 'No new card is on its way. Order one from My card, under Lost, stolen or damaged card.' }); (window as any).__go?.('chat'); return }
    St.updateBooking(o.id, { status: 'delivered', extra: { ...o.extra, case: 'replacement' }, tracker: { ...o.tracker!, current: o.tracker!.steps.length - 1, tone: undefined, eta: 'Delivered' } })
    St.pushMsg({ role: 'gr', text: 'Your new card has been delivered. Activate it on My card to start using it.' }); (window as any).__go?.('cardx', 'activate'); return
  }
  if (k === 'cases') {
    const open = s.bookings.filter(b => ['dispute', 'limit'].includes(b.extra?.case) && !b.extra?.closed)
    if (!open.length) { St.pushMsg({ role: 'gr', text: 'There are no disputes or limit requests waiting. Start one from My card.' }); (window as any).__go?.('chat'); return }
    open.forEach(b => {
      if (b.extra.case === 'dispute') { St.updateBooking(b.id, { status: 'done', extra: { ...b.extra, closed: true, outcome: 'Decided in your favour' }, tracker: { ...b.tracker!, current: b.tracker!.steps.length - 1, eta: 'Decided in your favour' } }); St.pushMsg({ role: 'gr', text: `Good news: the bank decided the ${b.title.replace(/^Dispute: /, '')} dispute in your favour. The ${M.money(b.extra.amount, 2)} credited back to your card is yours to keep.` }) }
      else { St.set(x => ({ card: { ...x.card, limit: b.extra.to } })); St.updateBooking(b.id, { status: 'done', extra: { ...b.extra, closed: true, outcome: 'Approved' }, tracker: { ...b.tracker!, current: b.tracker!.steps.length - 1, eta: 'Approved' } }); St.pushMsg({ role: 'gr', text: `The bank approved your new credit limit of ${M.money(b.extra.to)}. It applies straight away.` }) }
    })
    ;(window as any).__go?.('cardx', 'cases'); return
  }
  if (k === 'fraud') {
    St.set(x => ({ card: { ...x.card, frozen: true } }))
    St.pushMsg({ role: 'gr', text: `Did you just try to pay ${M.money(Cat.px(649, s.market), 2)} to an online electronics shop abroad? It didn't look like you, so I've frozen your card and blocked the payment.`, blocks: [{ kind: 'state', state: 'error', title: 'Payment blocked', body: 'Nothing left your account.', actions: [{ label: 'It was me', act: { f: 'unfreezeAsk', a: {} } }, { label: 'It wasn\'t me', act: { f: 'bank', a: { topic: 'fraud' } } }] }] })
  }
  (window as any).__go?.('chat')
}
