import { React, useState } from './r'
import { Icon } from './icons'
import { ART } from './art'
import { IconButton, Label, StickyNote, Polaroid, Dial, NavBar, Chips } from './base'
import { AskBar, YouSaid, Answer, Suggestions, Rail, PayWith, ConfirmSheet, Receipt, StateCard, PriceCalendar, Travellers } from './talk'
import { FlightCard, FareFamilies, SeatMap, BagPicker, BoardingPass, FlightTracker, Disruption, Itinerary, HotelCard, RoomOption, Cancellation, FareRules, LoungePass } from './travel'
import { MarketProvider, MARKETS, useMarket } from './market'
import { DEMO, calendar, lowDays, Demo } from './data'

/** An iPhone-sized frame. Header, scrolling body, and the ask bar floating at the bottom. */
export function PhoneFrame({ title, back, right, children, foot, nav, sheet, time = '9:41', width }: { title?: any; back?: boolean; right?: any; children?: any; foot?: any; nav?: boolean; sheet?: any; time?: string; width?: number }) {
  const M = useMarket()
  return <div className="gr gr-phone" dir={M.dir} lang={M.locale} style={width ? { width } : undefined}>
    <div className="gr-island" />
    <div className="gr-status-bar" dir="ltr"><span>{time}</span><span className="gr-row" style={{ gap: 5 }}><Icon name="wifi" size={16} stroke={2.2} /><svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true"><rect x=".5" y=".5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" /><rect x="23" y="4" width="1.5" height="4" rx=".75" fill="currentColor" opacity=".4" /></svg></span></div>
    {(title || back || right) && <div className="gr-hdr">{back ? <IconButton icon="back" label={M.t('back')} small /> : <span style={{ width: 36 }} />}<div className="gr-heading" style={{ textAlign: 'center', flex: 1 }}>{title}</div>{right || <span style={{ width: 36 }} />}</div>}
    <div className="gr-scroll">{children}</div>
    <div className="gr-fade" />
    <div className="gr-foot">{foot ?? (nav ? <NavBar /> : <AskBar />)}</div>
    {sheet}
  </div>
}

function Step({ n, name, children }: any) { return <div><div className="gr-stepname"><b>{n}</b>{name}</div>{children}</div> }

const LIVE = ['UK', 'EU', 'IN', 'AE', 'SG', 'MY']
/** Market tabs above a journey, so one card shows every market. */
export function MarketSwitch({ render, markets = LIVE, start = 'UK' }: { render: (m: string) => any; markets?: string[]; start?: string }) {
  const [m, setM] = useState(start)
  return <div className="gr" style={{ background: 'var(--ground)' }}>
    <div style={{ padding: '16px 20px 0' }}><Chips items={markets.map(id => ({ id, label: MARKETS[id].name }))} value={m} onChange={(v: any) => v && setM(v)} /></div>
    {render(m)}
  </div>
}

const hm = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
const at = (n: number) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
const gap = (n: number) => n >= 60 ? `${Math.floor(n / 60)}h${n % 60 ? ' ' + (n % 60) + 'm' : ''}` : `${n} min`

/** Flights, end to end: ask, dates, fare, seats and bags, pay, done, day of travel. */
export function FlightBookingJourney({ market = 'UK' }: { market?: string }) {
  return <MarketProvider market={market}><FlightBooking d={DEMO[market] || DEMO.UK} /></MarketProvider>
}
function FlightBooking({ d }: { d: Demo }) {
  const M = useMarket()
  const [nw] = d.flights
  const total = d.fares.std * 2, cardPart = total - d.mixPts * d.rate
  const fri = M.date('2026-10-16'), sun = M.date('2026-10-18'), wed = M.date('2026-10-14')
  return <div className="gr gr-journey" dir={M.dir}>
    <Step n={1} name="Ask"><PhoneFrame title="Gratifi" right={<IconButton icon="more" label={M.t('moreL')} small flat />}>
      <YouSaid>{d.ask}</YouSaid>
      <Answer steps={[`Checked 38 flights from ${d.home}`, 'Kept morning departures', 'Priced on your card with points']} say={<>Three good options. <b>The {nw.dep} Northway</b> is the one I&apos;d pick: direct, seats together, and 5% back on your card.</>}>
        <Rail>{d.flights.map((f, i) => <div key={i} style={{ width: 310 }}><FlightCard {...(f as any)} /></div>)}</Rail>
      </Answer>
      <Suggestions items={['Only direct', 'Cheaper dates?', 'Add a hotel']} />
    </PhoneFrame></Step>

    <Step n={2} name="Dates"><PhoneFrame title="When?" back>
      <div className="gr-card"><PriceCalendar year={2026} month={9} from={16} to={18} today={2} disabledBefore={3} prices={calendar(d)} low={lowDays(calendar(d))} /></div>
      <Travellers adults={2} />
    </PhoneFrame></Step>

    <Step n={3} name="Fare"><PhoneFrame title="Choose your fare" back>
      <Itinerary legs={[{ dep: nw.dep, arr: nw.arr, from: d.homeCode, fromName: d.home, to: d.awayCode, toName: d.away, airline: 'NW', number: nw.number, dur: nw.dur, plane: d.plane }]} />
      <FareFamilies fares={[
        { id: 'light', name: 'Light', price: d.fares.light, points: Math.round(d.fares.light / d.rate), items: [[true, 'Small bag'], [false, 'Cabin bag'], [false, 'Seat choice'], [false, 'Changes']] },
        { id: 'std', name: 'Standard', price: d.fares.std, points: Math.round(d.fares.std / d.rate), pop: 'Most picked', items: [[true, 'Small bag'], [true, 'Cabin bag'], [true, 'Standard seats'], [true, 'Free date change']] },
        { id: 'flex', name: 'Flex', price: d.fares.flex, points: Math.round(d.fares.flex / d.rate), items: [[true, `Cabin + ${d.checkedKg}kg bag`], [true, 'Any seat'], [true, 'Full refund'], [true, 'Fast track']] },
      ]} />
      <FareRules rules={[['ok', 'Change date', 'Free up to 24 hours before'], ['fee', 'Cancel', `${M.money(d.cancelFee)} fee, rest back as travel credit`], ['ok', 'Seat choice', 'Standard seats free'], ['nope', 'Refund to card', 'Not on this fare']]} />
    </PhoneFrame></Step>

    <Step n={4} name="Seats and bags"><PhoneFrame title="Seats" back foot={<div className="gr-row" style={{ background: 'var(--card)', borderRadius: 999, padding: '8px 8px 8px 20px', boxShadow: 'var(--shadow-float)' }}><div className="gr-grow"><div style={{ fontWeight: 650 }}>15D and 15E</div><div className="gr-meta">Together, {d.mate} on the aisle</div></div><button className="gr-btn gr-btn-primary">Next</button></div>}>
      <StickyNote title={`${d.mate} likes the aisle`} tone="blue" tilt={-1} width={260} clip={false} />
      <div className="gr-say">So I&apos;ve put {d.mate} on the aisle in 15D, and you next to {d.mate} in 15E.</div>
      <div className="gr-row" style={{ justifyContent: 'center' }}><SeatMap extraPrice={d.extraSeat} mateName={d.mate} /></div>
      <Label>Bags</Label>
      <BagPicker bags={[
        { icon: 'bag', name: M.t('smallBag'), sub: M.t('smallBagSub'), incl: true },
        { icon: 'cabinbag', name: M.t('cabinBag'), sub: M.t('cabinBagSub', { kg: d.cabinKg }), incl: true },
        { icon: 'cabinbag', name: M.t('checkedBag'), sub: M.t('checkedBagSub', { kg: d.checkedKg }), price: d.checkedBag },
      ]} />
    </PhoneFrame></Step>

    <Step n={5} name="Pay"><PhoneFrame title="Pay" back foot={<span />} sheet={<ConfirmSheet summary={`2 × ${nw.number} · ${fri} · Standard`} lines={[['2 adults, Standard', M.money(total, 2)], [`Points used (${M.pts(d.mixPts)})`, M.money(-d.mixPts * d.rate, 2)], ['Taxes and fees', 'Included']]} total={[M.t('onYourCard'), M.money(cardPart, 2)]} phone={d.phoneEnd} />}>
      <Label>{M.t('payWith')}</Label>
      <PayWith points={d.balance} cash={total} rate={d.rate} mix={d.mixPts} card={d.card} />
    </PhoneFrame></Step>

    <Step n={6} name="Done"><PhoneFrame title="" foot={<span />}>
      <Receipt title={`You’re going to ${d.away}`} reference="GR-48213" lines={[['Flights', `${fri} to ${sun}`], ['Seats', '15D, 15E'], ['Paid', `${M.pts(d.mixPts)} + ${M.money(cardPart)}`]]} next={`Check-in opens ${wed} at ${nw.dep}. I’ll do it and send the boarding passes.`} actions={['Add a hotel', 'Share trip']} />
    </PhoneFrame></Step>

    <Step n={7} name="Day of travel"><PhoneFrame title="Your trip" back>
      <BoardingPass airline="NW" number={nw.number} from={d.homeCode} fromCity={d.home} to={d.awayCode} toCity={d.away} date={fri} dep={nw.dep} boards={at(hm(nw.dep) - 40)} gate={d.gate} />
      <LoungePass name={d.lounge.name} where={d.lounge.where} valid={`${fri} · 3 hours before your flight`} />
    </PhoneFrame></Step>
  </div>
}

/** Disruption: the alert, the options already worked out, rebooked in one tap. */
export function DisruptionJourney({ market = 'UK' }: { market?: string }) {
  return <MarketProvider market={market}><DisruptionFlow d={DEMO[market] || DEMO.UK} /></MarketProvider>
}
function DisruptionFlow({ d }: { d: Demo }) {
  const M = useMarket()
  const [nw, cl] = d.flights
  const fri = M.date('2026-10-16')
  const refund = d.fares.std * 2 - d.mixPts * d.rate
  const up = Math.round(cl.price * 1.17 / d.round) * d.round
  return <div className="gr gr-journey" dir={M.dir}>
    <Step n={1} name="Heads-up"><PhoneFrame title="Your trip" back>
      <FlightTracker number={nw.number} from={d.homeCode} to={d.awayCode} status="Delayed 35 min" tone="warn" dep={at(hm(nw.dep) + 35)} depWas={nw.dep} arr={at(hm(nw.arr) + 35)} gate={d.gate} note={`Still time for the lounge. ${d.lounge.name} is open.`} />
    </PhoneFrame></Step>
    <Step n={2} name="Cancelled"><PhoneFrame title="Gratifi">
      <Disruption flight={nw.number} day={fri} title={`Your ${nw.dep} to ${d.away} is cancelled`} body={`Northway Air cancelled it at ${at(hm(nw.dep) - 20)}. You don’t need to queue. Here’s what you can do now.`} options={[
        { id: 'a', t: `Next direct, ${d.nextFlight.dep} today`, s: `Lands ${d.nextFlight.arr} · seats together held for 20 min`, tag: 'Best' },
        { id: 'b', t: `Via ${d.via.name}, ${d.via.dep} today`, s: `Lands ${d.via.arr} · ${gap(hm(d.via.arr) - hm(d.nextFlight.arr))} later than the direct` },
        { id: 'c', t: 'Full refund', s: `${M.money(refund)} to your card and ${M.pts(d.mixPts)} back, in 5 to 7 working days` },
      ]} owed={d.owed} />
    </PhoneFrame></Step>
    <Step n={3} name="Rebooked"><PhoneFrame title="" foot={<span />}>
      <Receipt title={`You’re on the ${d.nextFlight.dep}`} reference="GR-48213" lines={[['New flight', `${d.nextFlight.number} · ${d.nextFlight.dep} → ${d.nextFlight.arr}`], ['Seats', '14D, 14E together'], ['Cost', 'Nothing to pay']]} next="I’ve told your hotel you’ll arrive later, and moved your ride." actions={['See boarding pass', d.claimAction]} />
    </PhoneFrame></Step>
    <Step n={4} name="While booking"><PhoneFrame title="Gratifi">
      <StateCard kind="price" title="The fare went up since you looked" body="Coastline changed the price while you were choosing." was={M.money(cl.price)} now={M.money(up)} actions={[`Book at ${M.money(up)}`, 'See other flights']} />
      <StateCard kind="soldout" title="15E has just gone" body="Someone took it a moment ago. 16C and 16D are free, side by side across the aisle." actions={['Take 16C and 16D', 'Pick again']} />
    </PhoneFrame></Step>
  </div>
}

/** Stays: choose, room and cancellation, pay, done. */
export function HotelJourney({ market = 'UK' }: { market?: string }) {
  return <MarketProvider market={market}><HotelFlow d={DEMO[market] || DEMO.UK} /></MarketProvider>
}
function HotelFlow({ d }: { d: Demo }) {
  const M = useMarket(); const h = d.hotel
  const fri = M.date('2026-10-16'), sun = M.date('2026-10-18'), tue = M.date('2026-10-13'), wed = M.date('2026-10-14')
  const pts = Math.round(h.price / d.rate)
  return <div className="gr gr-journey" dir={M.dir}>
    <Step n={1} name="Choose"><PhoneFrame title="Gratifi">
      <YouSaid>{d.hotelAsk}</YouSaid>
      <Answer steps={['Checked 212 places near your flights', 'Kept ones with a pool']} say={<>Two stand out. <b>{h.name}</b> is in {h.area} and gives 3× points on your card.</>}>
        <Rail>
          <HotelCard src={ART.pool} name={h.name} area={h.area} price={h.price} points={pts} perks={['Pool', 'Breakfast']} back="3× points" sticker="Member price" />
          <HotelCard src={ART.room} name={h.alt} area={h.altArea} rating={4.5} reviews={1204} price={h.alt2} points={Math.round(h.alt2 / d.rate)} perks={['Rooftop pool']} />
        </Rail>
      </Answer>
    </PhoneFrame></Step>
    <Step n={2} name="Room"><PhoneFrame title={h.name} back>
      <div style={{ marginTop: 18 }}><Polaroid src={ART.pool} caption="The pool at dusk" tilt={-2} width={260} clip /></div>
      <div className="gr-col" role="radiogroup" aria-label="Rooms" style={{ gap: 12 }}>
        <RoomOption src={ART.room} name={d.room} facts={['22m²', 'King bed']} price={h.price} cancel={`Free cancellation to ${M.date('2026-10-13', 'day')}`} checked />
        <RoomOption src={ART.room} name="Junior suite" facts={['34m²', 'Balcony']} price={h.suite} />
      </div>
      <Cancellation steps={[{ tone: 'good', t: 'Free cancellation', s: `Until 23:59, ${tue}` }, { tone: 'warn', t: `First night charged, ${M.money(h.firstNight)}`, s: `From ${wed}` }, { tone: 'danger', t: 'No refund', s: `From check-in, ${fri}` }]} />
    </PhoneFrame></Step>
    <Step n={3} name="Pay"><PhoneFrame title="Pay" back foot={<span />} sheet={<ConfirmSheet summary={`${h.name} · ${fri} to ${sun} · ${d.room}`} lines={[[M.t('nightsTaxes', { n: 2 }), M.money(h.price, 2)], [`Points used (${M.pts(pts)})`, M.money(-h.price, 2)]]} total={[M.t('onYourCard'), M.money(0, 2)]} cta={M.auth === 'faceid' ? 'Book with Face ID' : M.auth === 'otp' ? M.t('confirmPts', { pts: M.pts(pts) }) : undefined} phone={d.phoneEnd} />}>
      <Label>{M.t('payWith')}</Label>
      <PayWith points={d.balance} cash={h.price} rate={d.rate} mix={Math.round(pts * 0.8 / 100) * 100} card={d.card} value="points" />
    </PhoneFrame></Step>
    <Step n={4} name="Done"><PhoneFrame title="" foot={<span />}>
      <Receipt title={`${h.name} is booked`} reference="GR-48219" lines={[['Stay', `${fri} to ${sun}`], ['Room', d.room], ['Paid', M.pts(pts)]]} next={`Free cancellation until 23:59, ${tue}. I’ve added it to your ${d.away} trip.`} actions={['See the trip', 'Add a dinner']} />
    </PhoneFrame></Step>
  </div>
}

/** Home: the dial, one moment, and the trip in progress. */
export function HomeScreen({ market = 'UK' }: { market?: string }) {
  return <MarketProvider market={market}><HomeInner d={DEMO[market] || DEMO.UK} /></MarketProvider>
}
function HomeInner({ d }: { d: Demo }) {
  const M = useMarket()
  const goal = Math.round((d.fares.std * 2 + d.hotel.price) / d.rate / 100) * 100
  return <PhoneFrame nav>
    <div className="gr-row" style={{ justifyContent: 'space-between', paddingTop: 4 }}><div><div className="gr-meta">{M.t('goodMorning')}</div><div className="gr-display">Amit</div></div><IconButton icon="bell" label={M.t('alerts')} dot /></div>
    <div className="gr-card gr-xl" style={{ alignItems: 'center' }}><Dial value={d.balance} progress={Math.min(1, d.balance / goal)} goal={`${M.num(goal)} for ${d.away} flights and hotel`} /></div>
    <StickyNote title="Your lounge passes renew in 12 days" tilt={-1.5} action="Use one on Friday" secondary="Not now" width={330}>You have 2 left before they renew. Friday&apos;s flight leaves from {d.lounge.where.split(' · ')[0]}, where {d.lounge.name} is.</StickyNote>
  </PhoneFrame>
}

/** Right-to-left check: the same blocks in Arabic for the UAE. The Arabic copy is a layout draft and needs a native writer before launch. */
export function ArabicScreens() {
  return <MarketProvider market="AR"><ArabicInner /></MarketProvider>
}
function ArabicInner() {
  const M = useMarket(); const d = DEMO.AE; const [nw, cl, au] = d.flights
  const total = d.fares.std * 2, cardPart = total - d.mixPts * d.rate
  return <div className="gr gr-journey" dir="rtl">
    <Step n={1} name="السؤال"><PhoneFrame title="Gratifi">
      <YouSaid>مسقط لشخصين، من 16 إلى 18 أكتوبر. رحلة صباحية.</YouSaid>
      <Answer steps={['راجعتُ 38 رحلة من دبي', 'أبقيتُ الرحلات الصباحية', 'احتسبتُ السعر بالنقاط على بطاقتك']} say={<>ثلاثة خيارات جيدة. أنصحك <b>برحلة نورث واي الساعة {nw.dep}</b>: مباشرة، ومقاعد متجاورة، واسترداد 5٪ على بطاقتك.</>}>
        <Rail>
          <div style={{ width: 310 }}><FlightCard {...(nw as any)} bag="حقيبة المقصورة" tags={['مقاعد متجاورة']} best="الأنسب لك" back="استرداد 5٪ على بطاقتك" /></div>
          <div style={{ width: 310 }}><FlightCard {...(cl as any)} bag="حقيبة صغيرة فقط" /></div>
          <div style={{ width: 310 }}><FlightCard {...(au as any)} bag="حقيبة المقصورة" /></div>
        </Rail>
      </Answer>
      <Suggestions items={['رحلات مباشرة فقط', 'تواريخ أرخص؟', 'أضف فندقًا']} />
    </PhoneFrame></Step>
    <Step n={2} name="التاريخ والمقعد"><PhoneFrame title="متى؟" back>
      <div className="gr-card"><PriceCalendar year={2026} month={9} from={16} to={18} today={2} disabledBefore={3} prices={calendar(d)} low={lowDays(calendar(d))} /></div>
      <div className="gr-row" style={{ justifyContent: 'center' }}><SeatMap extraPrice={d.extraSeat} mateName="عمر" /></div>
    </PhoneFrame></Step>
    <Step n={3} name="الدفع"><PhoneFrame title="الدفع" back foot={<span />} sheet={<ConfirmSheet summary={`2 × ${nw.number} · ${M.date('2026-10-16')}`} lines={[['بالغان، التذكرة العادية', M.money(total, 2)], ['النقاط المستخدمة', M.money(-d.mixPts * d.rate, 2)]]} total={[M.t('onYourCard'), M.money(cardPart, 2)]} />}>
      <Label>{M.t('payWith')}</Label>
      <PayWith points={d.balance} cash={total} rate={d.rate} mix={d.mixPts} card={d.card} />
    </PhoneFrame></Step>
  </div>
}
