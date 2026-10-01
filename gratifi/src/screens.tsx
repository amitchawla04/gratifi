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
import { Blocks, run, respond, iconFor, sendText, OfferList } from './render'

export type Tab = 'home' | 'explore' | 'chat' | 'wallet' | 'me'

/* ---------- Home ---------- */
export function Home({ go }: { go: (t: Tab, cat?: string) => void }) {
  const s = St.useS(x => x); const M = useMarket()
  const active = s.bookings.filter(b => b.tracker && !['cancelled', 'refunded', 'delivered', 'done'].includes(b.status) && b.tracker.current < b.tracker.steps.length - 1)
  const moment = pickMoment(s, M)
  return <div className="app-scroll">
    <div className="gr-row" style={{ justifyContent: 'space-between', paddingTop: 6 }}><div><div className="gr-meta">{M.t(new Date().getHours() >= 5 && new Date().getHours() < 12 ? 'goodMorning' : new Date().getHours() >= 12 && new Date().getHours() < 18 ? 'goodAfternoon' : 'goodEvening')}</div><h1 className="gr-display">{s.prefs.name}</h1></div><div className="gr-row" style={{ gap: 8 }}><button className="app-mk" onClick={() => go('me')}>{s.market === 'AR' ? 'AE · ع' : s.market}</button><K.IconButton icon="bell" label={M.t('alerts')} dot={!!moment} onClick={() => run({ f: 'feed', a: {} }, 'What\'s new?')} /></div></div>
    <div className="gr-card gr-xl" style={{ alignItems: 'center', gap: 4, paddingBottom: 18 }}><K.Dial value={s.balance} progress={Math.min(1, s.balance / 100000)} size={180} goal={`Worth about ${M.money(s.balance * St.rate())}`} />
      <div className="gr-row" style={{ gap: 8, marginTop: 30 }}><K.Button size="sm" onClick={() => run({ f: 'usePoints', a: {} }, 'What can I do with my points?')}>Use points</K.Button><K.Button size="sm" variant="secondary" onClick={() => run({ f: 'programmes', a: {} }, 'Transfer points')}>Transfer</K.Button></div></div>
    {moment && <K.StickyNote title={moment.title} action={moment.action} secondary="Not now" onAction={moment.go} onSecondary={() => St.set(x => ({ seen: { ...x.seen, [moment.key]: true } }))} width={400}>{moment.body}</K.StickyNote>}
    {active.slice(0, 2).map(b => <X.Tracker key={b.id} title={b.title} sub={b.sub} steps={b.tracker!.steps} current={b.tracker!.current} eta={b.tracker!.eta} tone={b.tracker!.tone} icon={iconFor(b.cat)} />)}
    <T.Suggestions items={[`Flights to ${Cat.dests(M.id)[0].name} this weekend`, 'A table tonight', 'Groceries now', 'Gift for a friend']} onPick={(t: string) => { go('chat'); Br.ask(t) }} />
    <Promos go={go} />
    <div className="gr-railhead"><h2 className="gr-heading">Everything on your card</h2><button className="gr-link" onClick={() => go('explore')}>See all</button></div>
    <div className="app-catgrid">{Cat.CATS.slice(0, 8).map(c => <X.CategoryTile key={c.key} icon={c.icon} label={c.label} sub={c.sub} onClick={() => go('explore', c.key)} />)}</div>
    <Featured go={go} />
    <OfferList rail />
  </div>
}
/* Marketing banners and featured picks: the browse layer gives a flavour; every tap hands the task to the assistant. */
function Promos({ go }: { go: (t: Tab, cat?: string) => void }) {
  const M = useMarket(), d0 = Cat.dests(M.id)[0], h = Cat.home(M.id)
  const fri = F.iso(F.nextFriday()), from = Math.min(...Cat.searchFlights(M.id, d0, fri).map(o => o.price))
  const ev = Cat.events(M.id)[0], rest = Cat.restaurants(M.id, h.city).find(r => r.earn) || Cat.restaurants(M.id, h.city)[0]
  const ask = (label: string, act: () => void) => { go('chat'); act() }
  const P = [
    { key: 'trip', img: d0.img, sticker: '3× points on stays', title: `${d0.name} from ${M.money(from)}`, body: `One way per person on ${M.date(fri)}, and triple points on hotels there.`, cta: 'See flights', go: () => ask('', () => run({ f: 'flightSearch', a: { city: d0.name, date: fri, back: F.addDays(fri, 2), pax: 1 } }, `Flights to ${d0.name} this weekend`)) },
    { key: 'event', img: ev.img, sticker: 'Presale', title: ev.title, body: `${ev.sub?.split(' · ')[1] || ''}. Tickets for cardholders before general sale.`.replace(/^\. /, ''), cta: 'Get tickets', go: () => ask('', () => run({ f: 'showItem', a: { id: ev.id } }, ev.title)) },
    { key: 'dine', img: rest.img, sticker: '15% off', title: rest.title, body: `${rest.sub?.split(' · ')[0] || ''} in ${h.city}. 15% off the bill when you pay with your card.`, cta: 'Book a table', go: () => ask('', () => run({ f: 'showItem', a: { id: rest.id } }, rest.title)) },
  ]
  return <div className="gr-col" style={{ gap: 12 }}><h2 className="gr-heading">This week</h2><div className="gr-rail app-promos" role="list">{P.map(p => <div key={p.key} role="listitem" className="gr-card app-promo">
    <div className="app-promo-ph"><img src={Cat.img(p.img)} alt="" /><span className="app-promo-st"><K.Sticker tilt={-5}>{p.sticker}</K.Sticker></span></div>
    <div className="gr-col" style={{ gap: 4 }}><div className="gr-title" style={{ fontSize: '1.125rem' }}>{p.title}</div><div className="gr-meta">{p.body}</div></div>
    <K.Button size="sm" onClick={p.go}>{p.cta}</K.Button></div>)}</div></div>
}
function Featured({ go }: { go: (t: Tab, cat?: string) => void }) {
  const M = useMarket(), d0 = Cat.dests(M.id)[0], h = Cat.home(M.id)
  const picks = [F.itemsFor('stays', d0.name)[0], F.itemsFor('experiences', d0.name)[2], Cat.events(M.id)[1], F.findItem('SH-4'), F.itemsFor('experiences', h.city)[0], F.findItem('SH-10')].filter((x): x is Cat.Item => !!x && !!x.img)
  return <T.Rail title="Featured" more="See all" onMore={() => go('explore')}>{picks.map(i => { const price = i.cat === 'stays' ? F.stayPrice(i, '', 2) : F.IP(i); return <T.ProductCard key={i.id} src={Cat.img(i.img)} name={i.title} meta={[i.cat === 'stays' ? `${i.sub?.split(', ')[1] || ''}, 2 nights` : i.cat === 'tickets' ? i.sub?.split(' · ')[1] : i.cat === 'shopping' ? i.sub : i.sub, i.cat === 'experiences' ? i.unit : undefined].filter(Boolean)} price={price} points={F.ptsOf(price)} badge={i.earn || (i.meta || []).find(x => /card|presale/i.test(x))} onClick={() => { go('chat'); run({ f: 'showItem', a: { id: i.id } }, i.title) }} /> })}</T.Rail>
}
function pickMoment(s: St.State, M: any): { key: string; title: string; body: string; action: string; go: () => void } | null {
  const c: any[] = []
  const fl = s.bookings.find(b => b.cat === 'flights' && b.status === 'confirmed')
  if (fl && s.loungeLeft && !s.bookings.some(b => b.cat === 'airport' && b.status === 'confirmed')) c.push({ key: 'lounge-' + fl.id, title: 'Use a free lounge visit', body: `Your flight to ${fl.title.split(' to ')[1]} leaves from ${Cat.home(s.market).airport}. You have ${s.loungeLeft} free visit${s.loungeLeft > 1 ? 's' : ''} left this year.`, action: 'Book the lounge', go: () => run({ f: 'search', a: { cat: 'airport', query: 'lounge' } }, 'Book the lounge') })
  if (s.expiring && !s.seen['expiring']) c.push({ key: 'expiring', title: `${M.num(s.expiring)} points expire on 31 Oct`, body: `That's about ${M.money(s.expiring * St.rate())}. A gift card or a lounge visit would use them.`, action: 'Show ideas', go: () => run({ f: 'search', a: { cat: 'giftcards' } }, 'Ways to use expiring points') })
  if (!s.bookings.some(b => b.title === 'Tunewave') && !s.seen['tunewave']) c.push({ key: 'tunewave', title: 'Music is included with your card', body: 'Tunewave comes free with this card and you haven\'t turned it on yet.', action: 'Turn it on', go: () => run({ f: 'showItem', a: { id: 'SB-2' } }, 'Turn on Tunewave') })
  const ch = s.challenges.find(x => x.joined && !x.done && x.target - x.progress === 1)
  if (ch) c.push({ key: 'ch-' + ch.id, title: `One more for ${ch.reward}`, body: `${ch.title}: you're at ${ch.progress} of ${ch.target}.`, action: 'Find a table', go: () => run({ f: 'search', a: { cat: 'dining' } }, 'Find a table') })
  return c.find(x => !s.seen[x.key]) || null
}

/* ---------- Explore ---------- */
const ASKS: Record<string, string[]> = {
  flights: ['Flights to {d0} next weekend for two', 'Cheapest flights to {d1}', 'One way to {d2} on Friday'], stays: ['A hotel in {d0} with a pool', 'Somewhere central in {d1}'], airport: ['A lounge for two on Friday', 'Fast track security for 3 people'],
  rides: ['A taxi to the airport tomorrow at 6:30am', 'A cab home at 11pm tonight', 'Hire a car for 3 days'], experiences: ['Things to do in {d0}', 'A food tour in {home}'], dining: ['A table tonight for two', 'Vegetarian dinner in {home}'], quick: ['Milk, eggs and bread', 'Nappies now', 'Can I order food delivery?'],
  shopping: ['Noise-cancelling headphones', 'A cabin suitcase', 'Earn extra points shopping'], giftcards: ['A gift card for a friend', 'Use my expiring points on a gift card'], subs: ['Which subscriptions are included?', 'Start a streaming subscription'],
  tickets: ['Concerts this month', 'Theatre on Friday'], points: ['Transfer points to miles', 'How many points do I have?'], invest: ['Put points into gold', 'Grow my points'], charity: ['Donate points to charity'],
  docs: ['Do I need a visa for {d0}?', 'Travel insurance', 'eSIM for data abroad'], concierge: ['A sold-out restaurant', 'Find a special gift'], benefits: ['What does my card cover?', 'Money back on a purchase'],
  bank: ['What do I owe?', 'Freeze my card', 'Where did my money go?', 'I lost my card'], moments: ['Ways to earn more'],
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
export function Explore({ cat, setCat, go }: { cat?: string; setCat: (c?: string) => void; go: (t: Tab) => void }) {
  const M = useMarket()
  const fill = (q: string) => q.replace(/\{d(\d)\}/g, (_, i) => Cat.dests(M.id)[+i].name).replace('{home}', Cat.home(M.id).city)
  if (!cat) return <div className="app-scroll"><h1 className="gr-display" style={{ paddingTop: 6 }}>Explore</h1><div className="gr-meta">Everything your card can do. Tap one, or just ask.</div><div className="app-catgrid">{Cat.CATS.map(c => <X.CategoryTile key={c.key} icon={c.icon} label={c.label} sub={c.sub} onClick={() => setCat(c.key)} />)}</div></div>
  const c = Cat.CATS.find(x => x.key === cat)!
  const items = F.itemsFor(cat).slice(0, 6), sub = SUBCATS(M.id)[cat]?.filter(([l]) => l !== 'Trains' || Cat.rides(M.id).some(r => /^Train to /.test(r.title)))
  return <div className="app-scroll">
    <div className="gr-row" style={{ gap: 10, paddingTop: 4 }}><K.IconButton icon="back" label={M.t('back')} small onClick={() => setCat(undefined)} /><div className="gr-title">{c.label}</div></div>
    {sub && <div className="gr-label">Browse</div>}
    {sub && <div className="app-subcats" role="list" aria-label={`${c.label} types`}>{sub.map(([label, act]) => <button key={label} role="listitem" className="gr-chip" onClick={() => { go('chat'); run(act, label) }}>{label}</button>)}</div>}
    {(ASKS[cat] || []).length > 0 && <div className="gr-label" style={{ marginTop: 4 }}>Or ask</div>}
    <T.Suggestions items={(ASKS[cat] || []).map(fill)} onPick={(t: string) => { go('chat'); Br.ask(t) }} />
    {cat === 'flights' && <div className="gr-col" style={{ gap: 10 }}>{Cat.dests(M.id).map(d => { const from = Math.min(...Cat.searchFlights(M.id, d, F.iso(F.nextFriday())).map(o => o.price)); return <X.ItemRow key={d.code} src={Cat.img(d.img)} title={d.name} sub={`${d.country} · ${Cat.durTxt(d.dur)} from ${Cat.home(M.id).code}`} price={from} unit={`from, one way, ${M.date(F.nextFriday())}`} points={F.ptsOf(from)} onClick={() => { go('chat'); run({ f: 'flightSearch', a: { city: d.name } }, `Flights to ${d.name}`) }} /> })}</div>}
    {items.length > 0 && cat !== 'quick' && <div className="gr-col" style={{ gap: 10 }}>{items.map(i => <X.ItemRow key={i.id} src={Cat.img(i.img)} icon={i.icon} title={i.title} sub={i.sub} meta={i.meta} rating={i.rating} price={i.cat === 'giftcards' || i.mode === 'link' ? undefined : i.included && i.cat === 'airport' && St.get().loungeLeft ? 0 : F.IP(i)} unit={i.unit} points={i.gbp && i.mode !== 'link' ? Math.round(F.IP(i) / St.rate()) : undefined} badge={i.cat !== 'dining' && i.mode !== 'link' ? i.earn : (i.included && i.cat === 'subs' ? 'Included' : undefined)} trailing={i.cat === 'giftcards' ? <span className="gr-meta">From {M.money(+F.giftAmounts()[0])}</span> : undefined} onClick={() => { go('chat'); run({ f: 'showItem', a: { id: i.id } }, i.title) }} />)}</div>}
    {cat === 'quick' && <Blocks blocks={[{ kind: 'grocery' }]} />}
    {cat === 'bank' && <Blocks blocks={[{ kind: 'balance' }, { kind: 'controls' }]} />}
    {cat === 'benefits' && <Blocks blocks={[{ kind: 'benefits' }]} />}
    {cat === 'points' && <Blocks blocks={[{ kind: 'points' }, { kind: 'programmes' }]} />}
    {cat === 'invest' && <Blocks blocks={[{ kind: 'invest' }]} />}
    {cat === 'charity' && <Blocks blocks={[{ kind: 'charities' }]} />}
    {cat === 'docs' && <Blocks blocks={[{ kind: 'insurance' }, { kind: 'esim' }]} />}
    {cat === 'concierge' && <Blocks blocks={[{ kind: 'conciergeform' }]} />}
    {cat === 'moments' && <Blocks blocks={[{ kind: 'challenges' }]} />}
  </div>
}

/* ---------- Chat ---------- */
export function Chat() {
  const chat = St.useS(s => s.chat); const M = useMarket(); const [mode, setMode] = useState(Br.getMode())
  useEffect(() => Br.onMode(() => setMode(Br.getMode())) as any, [])
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = ref.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }) }, [chat.length, chat[chat.length - 1]?.blocks?.length, chat[chat.length - 1]?.text])
  const busy = chat.some(m => m.thinking)
  return <div className="app-chat">
    <div className="app-chat-hd"><h1 className="gr-heading">Gratifi</h1><span className="app-mode" title={mode === 'claude' ? 'Answers come from Claude, using the app\'s own tools' : 'Answers come from the built-in engine'}><i className={mode === 'claude' ? 'on' : ''} />{mode === 'claude' ? 'Live AI' : mode === 'checking' ? 'Starting' : 'Built-in engine'}</span>{busy && mode === 'claude' && <button className="gr-link" onClick={Br.stop}>Stop</button>}{chat.length > 0 && !busy && <ClearChat />}</div>
    <div className="app-sr" aria-live="polite" aria-atomic="true">{(() => { const l = [...chat].reverse().find(m => m.role === 'gr' && !m.thinking); return l ? (l.text || (l.blocks?.length ? 'New options below.' : '')) : '' })()}</div>
    <div className="app-scroll gr-thread" ref={ref}>
      {chat.length === 0 && <div className="gr-col" style={{ gap: 14, paddingTop: 10 }}><div className="gr-title">What can I do for you?</div><div className="gr-meta">Ask for anything on your card. I show the options; you decide with a button.</div><Blocks blocks={[{ kind: 'cats' }]} /><T.Suggestions items={['Flights to ' + Cat.dests(M.id)[0].name + ' next weekend for two', 'A table tonight for two', 'Milk, eggs and bread', 'Freeze my card', 'Transfer points to miles', 'What does my card cover?']} onPick={(t: string) => Br.ask(t)} /></div>}
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
  return <button className="gr-link" onClick={() => { if (sure) { St.set(() => ({ chat: [] })); setSure(false) } else setSure(true) }}>{sure ? 'Tap again to clear' : 'Clear'}</button>
}
/* ---------- Wallet ---------- */
export function Wallet() {
  const bs = St.useS(s => s.bookings); const [tabS, setTab] = useState('')
  const dead = (b: St.Booking) => ['cancelled', 'refunded'].includes(b.status)
  const sets: Record<string, St.Booking[]> = {
    Upcoming: bs.filter(b => !dead(b) && ['ticket', 'booking'].includes(b.kind || '')).sort((x, y) => String(x.extra?.date || '9999').localeCompare(String(y.extra?.date || '9999'))),
    Orders: bs.filter(b => !dead(b) && b.kind === 'order'),
    Subscriptions: bs.filter(b => b.kind === 'sub'),
    Requests: bs.filter(b => ['request', 'claim', 'transfer', 'investment'].includes(b.kind || '')),
    Past: bs.filter(b => dead(b) || b.kind === 'donation'),
  }
  const tab = tabS || Object.keys(sets).find(k => sets[k].length) || 'Upcoming'
  const strip = useRef<HTMLDivElement>(null)
  useEffect(() => { (strip.current?.querySelector('[aria-pressed="true"]') as HTMLElement | null)?.scrollIntoView({ inline: 'nearest', block: 'nearest' }) }, [tab])
  const list = sets[tab]
  return <div className="app-scroll"><h1 className="gr-display" style={{ paddingTop: 6 }}>Wallet</h1>
    <div className="app-days" role="tablist" ref={strip} style={{ flexWrap: 'wrap', overflowX: 'visible' }}>{Object.keys(sets).map(k => <button key={k} role="tab" className="gr-chip" aria-pressed={tab === k} aria-selected={tab === k} onClick={() => setTab(k)}>{k}{sets[k].length ? ` · ${sets[k].length}` : ''}</button>)}</div>
    {list.length === 0 ? <div className="gr-card" style={{ alignItems: 'flex-start' }}><div className="gr-heading">Nothing here yet</div><div className="gr-meta">{tab === 'Upcoming' ? 'Trips, tables, tickets and bookings show up here.' : tab === 'Orders' ? 'Shopping, groceries and gift cards show up here.' : tab === 'Subscriptions' ? 'Subscriptions you start or activate show up here.' : tab === 'Requests' ? 'Concierge requests, claims, transfers and gifts show up here.' : 'Cancelled and refunded things show up here.'}</div></div>
      : list.map(b => <Blocks key={b.id} blocks={[b.tracker && !dead(b) && b.tracker.current < b.tracker.steps.length - 1 ? { kind: 'tracker', id: b.id } : { kind: 'booking', id: b.id, inline: true }]} />)}
  </div>
}

/* ---------- Me ---------- */
export function Me({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  const s = St.useS(x => x); const M = useMarket()
  const sim = (k: keyof St.State['sim'], v: boolean) => St.set(x => ({ sim: { ...x.sim, [k]: v } }))
  return <div className="app-scroll"><h1 className="gr-display" style={{ paddingTop: 6 }}>My card</h1>
    <Blocks blocks={[{ kind: 'balance' }]} />
    <div className="app-quick">{[['cash', 'Pay bill', 'What do I owe?'], ['lock', s.card.frozen ? 'Unfreeze' : 'Freeze', s.card.frozen ? 'Unfreeze my card' : 'Freeze my card'], ['doc', 'Statement', 'Show my statement'], ['shield', 'Benefits', 'What does my card cover?']].map(([ic, l, q]) => <button key={l} onClick={() => { (window as any).__go?.('chat'); Br.ask(q) }}><span className="gr-ct-ic"><Icon name={ic} size={20} /></span>{l}</button>)}</div>
    <Blocks blocks={[{ kind: 'gambling' }, { kind: 'directdebit' }]} />
    <h2 className="gr-heading">Points</h2>
    <Blocks blocks={[{ kind: 'points', noPending: true }]} />
    {(s.pending || []).length > 0 && <div className="gr-card" style={{ gap: 8 }}><div className="gr-label">Pending points</div>{(s.pending || []).map(p => <div key={p.id} className="gr-row" style={{ justifyContent: 'space-between', gap: 10 }}><span>{p.label}</span><span className="gr-meta">{p.pts ? `${M.pts(p.pts)} · land ${M.date(p.lands!)}` : 'Waiting for a purchase'}</span></div>)}</div>}
    <h2 className="gr-heading">Market and language</h2>
    <K.Chips items={Object.keys(MARKETS).map(k => ({ id: k, label: MARKETS[k].name }))} value={s.market} wrap onChange={(v: any) => v && St.switchMarket(v)} />
    <div className="gr-row" style={{ justifyContent: 'space-between' }}><div><div style={{ fontWeight: 650 }}>Dark mode</div><div className="gr-meta">Follows your phone unless you change it</div></div><K.Toggle label="Dark mode" on={theme === 'dark'} onChange={(v: boolean) => setTheme(v ? 'dark' : 'light')} /></div>
    {Object.keys(s.seen).some(k => k.startsWith('alert:') && s.seen[k]) && <><h2 className="gr-heading">Alerts</h2><div className="gr-card" style={{ gap: 0, paddingTop: 4, paddingBottom: 4 }}>{Object.keys(s.seen).filter(k => k.startsWith('alert:') && s.seen[k]).map(k => <div key={k} className="gr-benefit" style={{ cursor: 'default' }}><div className="gr-grow"><div style={{ fontWeight: 650 }}>{k.slice(6).charAt(0).toUpperCase() + k.slice(7)}</div></div><K.Button size="sm" variant="secondary" onClick={() => St.set(x => ({ seen: { ...x.seen, [k]: false } }))}>Remove</K.Button></div>)}</div></>}
    <h2 className="gr-heading">Messages</h2>
    <X.AlertSettings state={s.alerts} onChange={(k: string, v: boolean) => St.set(x => ({ alerts: { ...x.alerts, [k]: v } }))} />
    <h2 className="gr-heading">What Gratifi remembers</h2>
    <div className="gr-card" style={{ gap: 0, paddingTop: 4, paddingBottom: 4 }}>
      <div className="gr-benefit" style={{ cursor: 'default' }}><div className="gr-grow"><div style={{ fontWeight: 650 }}>Seats</div><div className="gr-meta">{s.prefs.aisle ? 'Prefers the aisle' : 'No preference'}</div></div>{s.prefs.aisle ? <K.Button size="sm" variant="quiet" onClick={() => St.set(x => ({ prefs: { ...x.prefs, aisle: false } }))}>Forget</K.Button> : <K.Button size="sm" variant="quiet" onClick={() => St.set(x => ({ prefs: { ...x.prefs, aisle: true } }))}>Prefer the aisle</K.Button>}</div>
      <div className="gr-benefit" style={{ cursor: 'default' }}><div className="gr-grow"><div style={{ fontWeight: 650 }}>Delivery address</div><div className="gr-meta">{s.addresses.find(a => a.id === s.addr)?.label}, {s.addresses.find(a => a.id === s.addr)?.line}</div></div><K.Button size="sm" variant="quiet" onClick={() => St.set(x => ({ addr: x.addr === 'a1' ? 'a2' : 'a1' }))}>Use {s.addresses.find(a => a.id !== s.addr)?.label}</K.Button></div>
      <div className="gr-meta" style={{ padding: '10px 0 6px' }}>Your name and card details come from the bank.</div></div>
    <div className="app-demo"><div className="gr-row" style={{ gap: 8 }}><Icon name="bolt" size={18} /><b>Demo controls</b></div><div className="gr-meta">This stands in for the bank. Use it to test what happens when things change.</div>
      <div className="gr-actions"><K.Button size="sm" onClick={() => { St.addPoints(5000, 'Points adjustment (demo)'); St.pushMsg({ role: 'gr', text: `Demo: ${M.pts(5000)} came in from the bank. Your balance is now ${M.pts(St.get().balance)}.` }) }}>Points come in (+{M.num(5000)})</K.Button><K.Button size="sm" variant="secondary" onClick={() => { const amt = Cat.px(42, s.market); if (St.get().card.frozen) { St.pushMsg({ role: 'gr', text: `Demo: a card payment of ${M.money(amt, 2)} at Café Lune was declined because your card is frozen. Nothing was charged.` }); return } if (St.get().sim.decline) { St.pushMsg({ role: 'gr', text: `Demo: a card payment of ${M.money(amt, 2)} at Café Lune was declined by the bank. Nothing was charged.` }); return } const ep = Math.round(amt / St.rate() * 0.01); St.set(x => ({ txns: [{ id: St.uidx(), at: Date.now(), merchant: 'Café Lune', cat: 'Dining', amount: amt, points: ep }, ...x.txns], card: { ...x.card, balance: x.card.balance + amt }, balance: x.balance + ep, ledger: [{ id: St.uidx(), at: Date.now(), label: 'Points on card spend: Café Lune', pts: ep }, ...x.ledger] })); St.recordSpend('Dining', amt); St.pushMsg({ role: 'gr', text: St.get().alerts.spend ? `Card used at Café Lune for ${M.money(amt, 2)}. You earned ${M.num(Math.round(amt / St.rate() * 0.01))} points.` : `Demo: a card payment of ${M.money(amt, 2)} at Café Lune came in and earned ${M.num(Math.round(amt / St.rate() * 0.01))} points. Turn on Every card payment under Messages to get a note each time.` }) }}>A card payment</K.Button></div>
      {([['priceRise', 'Price rises at the next checkout'], ['supplierDown', 'Supplier is down'], ['decline', 'Card is declined']] as [keyof St.State['sim'], string][]).map(([k, l]) => <div key={k} className="gr-row" style={{ justifyContent: 'space-between' }}><span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{l}</span><K.Toggle label={l} on={s.sim[k]} onChange={(v: boolean) => sim(k, v)} /></div>)}
      <div className="gr-actions"><K.Button size="sm" variant="secondary" onClick={() => simulate('cancel')}>Cancel my next flight</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('late')}>Delay my order</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('deliver')}>Deliver my order</K.Button><K.Button size="sm" variant="secondary" onClick={() => { respond(F.settlePending()); (window as any).__go?.('chat') }}>Return window ends</K.Button><K.Button size="sm" variant="secondary" onClick={() => simulate('fraud')}>Suspicious payment</K.Button></div>
      <ResetButton /></div>
  </div>
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
  if (k === 'fraud') {
    St.set(x => ({ card: { ...x.card, frozen: true } }))
    St.pushMsg({ role: 'gr', text: `Did you just try to pay ${M.money(Cat.px(649, s.market), 2)} to an online electronics shop abroad? It didn't look like you, so I've frozen your card and blocked the payment.`, blocks: [{ kind: 'state', state: 'error', title: 'Payment blocked', body: 'Nothing left your account.', actions: [{ label: 'It was me', act: { f: 'unfreezeAsk', a: {} } }, { label: 'It wasn\'t me', act: { f: 'bank', a: { topic: 'fraud' } } }] }] })
  }
  (window as any).__go?.('chat')
}
