import { React } from './r'
import { Icon, ICONS } from './icons'
import { ART } from './art'
import * as B from './base'
import * as T from './talk'
import * as V from './travel'
import * as J from './journeys'
import { MarketProvider, MARKETS, useMarket } from './market'
import { DEMO } from './data'

/* Every component's states, as the preview cards show them. Figures are illustrative. */
const S = ({ children, screen, col, gap }: any) => <div className={'gr gr-stage' + (screen ? ' gr-screen' : '')} style={{ flexDirection: col ? 'column' : undefined, gap }}>{children}</div>
const C = ({ t, children, w }: any) => <div className="gr-col" style={{ gap: 8, width: w }}>{children}<div className="gr-caption">{t}</div></div>

const PEOPLE = [{ name: 'Sam Rao', initials: 'SR', color: '#3D5A80' }, { name: 'Maya Chen', initials: 'MC', color: '#7A4E9E' }, { name: 'Jo Park', initials: 'JP', color: '#2E7D5B' }, { name: 'Leo Brandt', initials: 'LB', color: '#B5542B' }, { name: 'Ana Silva', initials: 'AS', color: '#5B6B7A' }]

function CS({ d, tot, part }: any) {
  const M = useMarket()
  return <T.ConfirmSheet summary={`2 × ${d.flights[0].number} · ${M.date('2026-10-16')} · Standard`} lines={[['2 adults, Standard', M.money(tot, 2)], [`Points used (${M.pts(d.mixPts)})`, M.money(-d.mixPts * d.rate, 2)]]} total={[M.t('onYourCard'), M.money(part, 2)]} phone={d.card.slice(2)} state={M.auth === 'otp' ? 'code' : 'ready'} />
}
export const demos: Record<string, () => any> = {
  /* ---------- foundations ---------- */
  Icon: () => <S><div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 52px)', gap: '12px 8px' }}>{(ICONS as string[]).map(n => <div key={n} title={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--card)', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={n} size={20} /></div><span style={{ fontSize: '0.5625rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{n}</span></div>)}</div></S>,
  Meta: () => <S col gap={12}><B.Meta items={['Direct', '2h 35m', 'Cabin bag']} /><B.Meta items={['Alfama', '4.7 ★', 'Free cancellation']} /></S>,
  Price: () => <S><C t="Cash and points"><div className="gr-card"><B.Price amount={186} points={18600} /></div></C><C t="Was and now"><div className="gr-card"><B.Price amount={142} was={166} /></div></C><C t="Large, with note"><div className="gr-card"><B.Price amount={496} size="lg" note="2 nights, taxes in" /></div></C></S>,
  Badge: () => <S gap={10}><B.Badge>Fri 16 Oct</B.Badge><B.Badge tone="good" icon="check">Confirmed</B.Badge><B.Badge tone="warn">3 left</B.Badge><B.Badge tone="danger">Cancelled</B.Badge><B.Badge tone="accent" icon="sparkle">Best for you</B.Badge><B.Badge tone="ink">Member price</B.Badge></S>,
  Status: () => <S gap={16}><B.Status live>On time</B.Status><B.Status tone="warn" live>Delayed 35 min</B.Status><B.Status tone="danger">Cancelled</B.Status></S>,
  Back: () => <S gap={12}><B.Back>£9 back on your card</B.Back><B.Back>3× points</B.Back></S>,
  Skeleton: () => <S><div className="gr-card" style={{ width: 320 }}><div className="gr-row"><B.Skeleton w={44} h={44} r={14} /><div className="gr-grow gr-col"><B.Skeleton w="70%" /><B.Skeleton w="40%" h={12} /></div></div><B.Skeleton h={80} r={16} /></div></S>,

  /* ---------- actions ---------- */
  Button: () => <S col gap={14}><div className="gr-row" style={{ flexWrap: 'wrap' }}><B.Button>Book for £35</B.Button><B.Button variant="secondary">See details</B.Button><B.Button variant="quiet">Not now</B.Button><B.Button variant="accent" icon="sparkle">Use points</B.Button><B.Button variant="ghost">Skip</B.Button></div><div className="gr-row" style={{ flexWrap: 'wrap' }}><B.Button size="sm" icon="plus">Add</B.Button><B.Button size="lg" icon="faceid">Pay with Face ID</B.Button><B.Button loading>Booking</B.Button><B.Button disabled>Sold out</B.Button></div><div style={{ width: 340 }}><B.Button block size="lg" iconRight="arrow">Continue</B.Button></div></S>,
  IconButton: () => <S gap={12}><B.IconButton icon="back" label="Back" /><B.IconButton icon="bell" label="Alerts" dot /><B.IconButton icon="heart" label="Save" small /><B.IconButton icon="share" label="Share" flat /><B.IconButton icon="mic" label="Speak" dark /></S>,
  Chips: () => <S col gap={14}><div style={{ width: 360 }}><B.Chips items={['Direct', 'Morning', 'Cabin bag', 'Under £200', 'Refundable']} value={['Direct', 'Morning']} multi /></div><B.Chips items={[{ id: 'all', label: 'All', count: 38 }, { id: 'lhr', label: 'Heathrow', count: 21 }, { id: 'lgw', label: 'Gatwick', count: 17 }]} value="lhr" /></S>,
  Segmented: () => <S col gap={14}><B.Segmented items={['Return', 'One way', 'Multi-city']} /><B.Segmented items={['Points', 'Cash']} dark /></S>,
  Toggle: () => <S gap={20}><div className="gr-row"><B.Toggle label="Price alerts" on /><span>Price alerts</span></div><div className="gr-row"><B.Toggle label="Use points first" /><span>Use points first</span></div></S>,
  Stepper: () => <S gap={20}><B.Stepper label="adults" value={2} min={1} /><B.Stepper label="bags" /></S>,
  NavBar: () => <S col gap={14}><div style={{ width: 360 }}><B.NavBar /></div><div style={{ width: 360 }}><B.NavBar current="trips" /></div></S>,

  /* ---------- objects ---------- */
  Polaroid: () => <S gap={30}><B.Polaroid src={ART.lisbon} caption="Lisbon, Oct" /><B.Polaroid src={ART.pool} caption="Casa do Rio" tilt={3} clip /></S>,
  StickyNote: () => <S gap={30}><B.StickyNote title="Book the hotel on this card too" action="Show hotels" secondary="Not now">It earns 3× points there, so your two nights come to about 1,500 points back.</B.StickyNote><B.StickyNote title="Sam likes the aisle" tone="blue" from="Your note" tilt={1.5} clip={false} width={260} /></S>,
  Stamp: () => <S gap={24}><B.Stamp name="Flights" value="13,000" /><B.Stamp art={ART.stampHotel} name="Stays" value="3×" tilt={-3} /><B.Stamp art={ART.stampDining} name="Dining" value="£20" tilt={4} /><B.Stamp art={ART.stampTicket} name="Cinema" value="2 for 1" tilt={-1} /></S>,
  Sticker: () => <S gap={24}><B.Sticker>5% back</B.Sticker><B.Sticker tone="ink" tilt={4}>Last room</B.Sticker><B.Sticker tone="paper" icon="star" tilt={-3}>Members</B.Sticker></S>,
  TripFolder: () => <S><div style={{ width: 360, paddingTop: 40 }}><B.TripFolder title="Lisbon" dates="16 to 18 Oct" photos={[ART.lisbon, ART.pool, ART.food]} people={[{ name: 'Amit Chawla' }, { name: 'Sam Rao' }]} items={[{ icon: 'plane', title: 'NW 214 · 07:25', meta: 'Seats 15D, 15E', done: true }, { icon: 'hotel', title: 'Casa do Rio', meta: '2 nights', done: true }, { icon: 'car', title: 'Airport ride', meta: 'Fri 10:15' }]} /></div></S>,
  Dial: () => <S gap={30}><B.Dial value={48210} progress={0.78} goal="62,000 for Lisbon flights and hotel" /><B.Dial value="£42" label="Back in Oct" progress={0.3} size={160} /></S>,
  CheckPop: () => <S gap={24}><B.CheckPop /><B.CheckPop size={40} /><B.CheckPop size={24} animate={false} /></S>,
  AvatarStack: () => <S gap={24}><B.AvatarStack people={PEOPLE.slice(0, 2)} /><B.AvatarStack people={PEOPLE} /></S>,

  /* ---------- conversation ---------- */
  AskBar: () => <S col gap={16}><div style={{ width: 360 }}><T.AskBar /></div><div style={{ width: 360 }}><T.AskBar value="Lisbon for two in October" /></div><div style={{ width: 360 }}><T.AskBar listening /></div></S>,
  YouSaid: () => <S screen><div className="gr-thread" style={{ width: 360 }}><T.YouSaid>Lisbon for two, 16 to 18 October. Morning flight out.</T.YouSaid><T.YouSaid>Only direct</T.YouSaid></div></S>,
  Steps: () => <S screen gap={30}><C t="Finished"><T.Steps steps={['Checked 38 flights from London', 'Kept morning departures', 'Priced on your card with points']} /></C><C t="Working"><T.Steps steps={['Checked 38 flights from London', 'Pricing on your card']} running /></C></S>,
  Answer: () => <S screen><div style={{ width: 360 }}><T.Answer steps={['Read your card’s terms', 'Checked this month’s spend']} say={<>Yes. Your card covers <b>two lounge visits a year</b>, and you have both left.</>} actions={[{ label: 'Use one on Friday' }, { label: 'Which lounges?' }]} source="Card terms, section 4.2"><B.StickyNote title="Friday: T5, The Orchard" clip={false} tilt={-1} width={330} from="">Opens 05:00. Your flight is 07:25.</B.StickyNote></T.Answer></div></S>,
  Typing: () => <S screen><T.Typing /></S>,
  Suggestions: () => <S screen><div style={{ width: 360 }}><T.Suggestions items={['Only direct', 'Cheaper dates?', 'Add a hotel', 'Use points']} /></div></S>,
  Moment: () => <S><T.Moment title="Your lounge passes renew in 12 days" action="Use one on Friday" secondary="Not now">You have 2 left before they renew. Friday&apos;s flight is from T5.</T.Moment></S>,
  Handoff: () => <S screen><T.Handoff /></S>,
  Toast: () => <S col gap={12}><div style={{ width: 360 }}><T.Toast undo="Undo">Offer added to your card</T.Toast></div><div style={{ width: 360 }}><T.Toast>Price alert set for Lisbon</T.Toast></div></S>,

  /* ---------- commerce ---------- */
  Rail: () => <S screen><div style={{ width: 380, overflow: 'hidden', padding: '0 16px' }}><T.Rail title="Offers on your card" more="See all 24">{[['Harbour & Co', 'H', '#2E5E4E', '10% back'], ['Northway Air', 'N', '#1F3A5F', '5% back'], ['Bloom', 'B', '#B5542B', '£5 off £30']].map(([b, m, c, r]) => <div key={b} style={{ width: 300 }}><T.OfferCard brand={b} mono={m} color={c} rate={r} sub="Until 31 Oct" /></div>)}</T.Rail></div></S>,
  OfferCard: () => <S screen col gap={12}><div style={{ width: 360 }}><T.OfferCard brand="Harbour & Co" mono="H" color="#2E5E4E" rate="10% back" sub="Until 31 Oct · up to £15" /></div><div style={{ width: 360 }}><T.OfferCard brand="Northway Air" mono="N" color="#1F3A5F" rate="5% back" why="You fly with them most" added /></div></S>,
  ProductCard: () => <S screen gap={14}><div style={{ width: 200 }}><T.ProductCard src={ART.jacket} name="Rain shell jacket" meta={['Outdoor', 'Free delivery']} price={120} points={15000} badge="New" /></div><div style={{ width: 200 }}><T.ProductCard src={ART.cinema} name="Cinema for two" meta={['Any Friday']} price={24} points={3000} back="2 for 1" /></div></S>,
  Compare: () => <S screen><T.Compare columns={['07:25 NW', '11:40 CL', '06:10 AU']} best={0} rows={[{ label: 'Lands', values: ['10:00', '14:20', '11:55'] }, { label: 'Direct', values: [true, true, false] }, { label: 'Cabin bag', values: [true, false, true] }, { label: 'Price', values: ['£186', '£142', '£128'] }]} /></S>,
  FilterBar: () => <S screen><div style={{ width: 380, overflow: 'hidden' }}><T.FilterBar filters={['Direct', 'Morning', 'Cabin bag', 'Under £200', 'Heathrow']} /></div></S>,
  PriceCalendar: () => <S><div className="gr-card" style={{ width: 360 }}><T.PriceCalendar from={16} to={18} today={2} disabledBefore={3} prices={{ 3: 142, 4: 156, 5: 164, 6: 148, 7: 132, 8: 176, 9: 212, 10: 198, 11: 184, 12: 138, 13: 124, 14: 118, 15: 158, 16: 128, 17: 204, 18: 172, 19: 126, 20: 118, 21: 122, 22: 168, 23: 214, 24: 196, 25: 178, 26: 128, 27: 116, 28: 119, 29: 162, 30: 208, 31: 134 }} low={[14, 20, 27]} /></div></S>,
  Travellers: () => <S><T.Travellers adults={2} infants={1} /></S>,
  PayWith: () => <S screen><div style={{ width: 360 }}><T.PayWith /></div></S>,
  PointsSlider: () => <S><T.PointsSlider /></S>,
  PriceLines: () => <S><div className="gr-card" style={{ width: 360 }}><T.PriceLines lines={[['2 adults, Standard', '£372.00'], ['Seats 15D, 15E', 'Included'], ['Points used (30,000 pts)', '−£300.00']]} total={['On your card', '£72.00']} note="Taxes and fees included." /></div></S>,
  ConfirmSheet: () => <S gap={20}>{[['UK', 'Face ID (UK)'], ['IN', 'One-time code (India)'], ['MY', 'Approve in the bank app (Malaysia)']].map(([m, cap]) => { const d = DEMO[m]; const tot = d.fares.std * 2, part = tot - d.mixPts * d.rate; return <MarketProvider key={m} market={m}><C t={cap}><div style={{ width: 380, height: 700, position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--screen)' }}><CS d={d} tot={tot} part={part} /></div></C></MarketProvider> })}<C t="Done"><div style={{ width: 380, height: 700, position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--screen)' }}><T.ConfirmSheet summary="Seats 15D, 15E · Lisbon, Fri 16 Oct" state="done" /></div></C></S>,
  Receipt: () => <S><T.Receipt lines={[['Flights', 'Fri 16 to Sun 18 Oct'], ['Seats', '15D, 15E'], ['Paid', '30,000 pts + £72']]} next="Check-in opens Wed 14 Oct. I’ll do it and send the boarding passes." actions={['Add a hotel', 'Share trip']} /></S>,
  SendTo: () => <S><T.SendTo people={PEOPLE} selected={['Sam Rao', 'Jo Park']} /></S>,
  StateCard: () => <S screen gap={16}><T.StateCard kind="price" title="The fare went up since you looked" body="Coastline changed the price while you were choosing." was="£142" now="£166" actions={['Book at £166', 'Other flights']} /><T.StateCard kind="soldout" title="15E has just gone" body="16C and 16D are free, side by side across the aisle." actions={['Take 16C and 16D']} /><T.StateCard kind="error" title="Northway isn’t answering" body="Nothing has been booked or paid. Try again in a minute." actions={['Try again']} /><T.StateCard kind="empty" title="No direct flights that morning" body="There are two after 12:00, or direct on Thursday." actions={['Show Thursday', 'After 12:00']} /></S>,

  /* ---------- flights ---------- */
  AirlineMark: () => <S gap={14}>{Object.keys(V.AIRLINES).map(k => <div key={k} className="gr-row" style={{ gap: 8 }}><V.AirlineMark code={k} /><span style={{ fontWeight: 600 }}>{V.AIRLINES[k].name}</span></div>)}</S>,
  FlightCard: () => <S screen gap={16}><V.FlightCard airline="NW" number="NW 214" dep="07:25" arr="10:00" from="LHR" to="LIS" dur="2h 35m" price={186} points={18600} bag="Cabin bag" tags={['Seats together']} best="Best for you" back="5% back on your card" selected /><V.FlightCard airline="CL" number="CL 902" dep="11:40" arr="14:20" from="LGW" to="LIS" dur="2h 40m" price={142} points={14200} left={3} bag="Small bag only" /><V.FlightCard airline="AU" number="AU 336" bag="Cabin bag" dep="21:50" arr="06:15" plusDays={1} from="LHR" to="LIS" dur="8h 25m" stops={1} via="OPO" price={128} points={12800} /></S>,
  Itinerary: () => <S screen><V.Itinerary legs={[{ dep: '06:35', arr: '08:45', from: 'LHR', fromName: 'London Heathrow', to: 'OPO', toName: 'Porto', airline: 'AU', number: 'AU 340', dur: '2h 10m' }, { dep: '09:30', arr: '10:25', from: 'OPO', fromName: 'Porto', to: 'LIS', toName: 'Lisbon', airline: 'AU', number: 'AU 1184', dur: '55m' }]} layovers={[{ text: '45 min in Porto · same terminal, tight', short: true }]} /></S>,
  FareFamilies: () => <S screen><div style={{ width: 380, overflow: 'hidden', padding: '12px 16px' }}><V.FareFamilies fares={[{ id: 'light', name: 'Light', price: 148, points: 14800, items: [[true, 'Small bag'], [false, 'Cabin bag'], [false, 'Seat choice'], [false, 'Changes']] }, { id: 'std', name: 'Standard', price: 186, points: 18600, pop: 'Most picked', items: [[true, 'Small bag'], [true, 'Cabin bag'], [true, 'Standard seats'], [true, 'Free date change']] }, { id: 'flex', name: 'Flex', price: 264, points: 26400, items: [[true, 'Cabin + 23kg bag'], [true, 'Any seat'], [true, 'Full refund'], [true, 'Fast track']] }]} /></div></S>,
  SeatMap: () => <S screen><V.SeatMap /></S>,
  BagPicker: () => <S screen><V.BagPicker /></S>,
  BoardingPass: () => <S screen><V.BoardingPass /></S>,
  FlightTracker: () => <S screen gap={16}><V.FlightTracker status="On time" tone="good" depWas="" dep="07:25" arr="10:00" progress={0} /><V.FlightTracker progress={0.55} status="In the air" tone="good" dep="08:00" depWas="" arr="10:35" note="Lands in 1h 10m. Your ride is booked for 10:50." /></S>,
  Disruption: () => <S screen><V.Disruption owed="You may be owed up to £350 each under UK rules. I’ll start the claim once you’re rebooked." /></S>,
  ChangeFlight: () => <S screen><V.ChangeFlight /></S>,
  FareRules: () => <S screen><V.FareRules /></S>,

  /* ---------- stays and more ---------- */
  HotelCard: () => <S screen gap={20}><V.HotelCard src={ART.pool} name="Casa do Rio" area="Alfama" price={248} points={24800} perks={['Pool', 'Breakfast']} back="3× points" sticker="Member price" /><V.HotelCard src={ART.room} name="Hotel Miradouro" area="Chiado" rating={4.5} reviews={1204} price={296} points={29600} perks={['Rooftop pool']} /></S>,
  RoomOption: () => <S screen col gap={12}><div className="gr-col" role="radiogroup" aria-label="Rooms" style={{ gap: 12 }}><V.RoomOption src={ART.room} name="Double, river view" facts={['22m²', 'King bed']} price={248} cancel="Free cancellation to 13 Oct" checked /><V.RoomOption src={ART.room} name="Junior suite" facts={['34m²', 'Balcony']} price={342} /></div></S>,
  Cancellation: () => <S screen><V.Cancellation /></S>,
  ExperienceCard: () => <S screen gap={16}><V.ExperienceCard src={ART.food} name="Tasca dinner in Alfama" when="Sat 19:30" meta={['3 hours', 'Small group']} price={48} points={6000} rating={4.9} /><V.ExperienceCard src={ART.lisbon} name="Fado evening" when="Fri 21:00" meta={['90 min']} price={32} points={4000} /></S>,
  TimeSlots: () => <S><div className="gr-card" style={{ width: 360 }}><div className="gr-heading">Saturday 17 Oct</div><V.TimeSlots /></div></S>,
  GiftCardTile: () => <S gap={16}><V.GiftCardTile note="6,250 pts" /><V.GiftCardTile brand="Bloom" amount={25} color="#B5542B" note="3,125 pts" /><V.GiftCardTile brand="Northway Air" amount={100} color="#1F3A5F" note="12,500 pts" /></S>,
  RideOption: () => <S screen col gap={10}><div className="gr-col" role="radiogroup" aria-label="Rides" style={{ gap: 10, width: 360 }}><V.RideOption checked /><V.RideOption name="Larger" eta="7 min away" seats={6} price={52} note="Room for 4 bags" /></div></S>,
  LoungePass: () => <S screen><V.LoungePass /></S>,

  /* ---------- bank ---------- */
  PaymentDue: () => <S screen gap={16}><C t="UK"><V.PaymentDue /></C><C t="India: auto-debit, lakh grouping"><MarketProvider market="IN"><V.PaymentDue amount={142680.5} min={7134} date={'12\u00a0Nov'} days={2} autopay /></MarketProvider></C><C t="Singapore: GIRO"><MarketProvider market="SG"><V.PaymentDue amount={1284.4} min={50} date={'4\u00a0Nov'} /></MarketProvider></C></S>,
  TransactionRow: () => <S><div className="gr-card" style={{ width: 360, gap: 0 }}><V.TransactionRow mono="N" color="#1F3A5F" ink="#fff" name="Northway Air" meta={['Travel', 'Today']} amount={72} points={216} /><div className="gr-hr" /><V.TransactionRow mono="H" color="#2E5E4E" ink="#fff" name="Harbour & Co" meta={['Offer: 10% back']} amount={4.2} refund /><div className="gr-hr" /><V.TransactionRow mono="B" name="Bloom" meta={['Shopping', 'Mon']} amount={28.5} /></div></S>,
  BenefitRow: () => <S><div className="gr-card" style={{ width: 360, gap: 0, paddingTop: 4, paddingBottom: 4 }}><V.BenefitRow icon="sofa" name="Airport lounges" sub="2 visits a year" value="2 left" /><V.BenefitRow icon="shield" name="Purchase protection" sub="Up to 120 days" /><V.BenefitRow icon="globe" name="No fees abroad" sub="On purchases in other currencies" /></div></S>,

  /* ---------- screens ---------- */
  PhoneFrame: () => <S><J.PhoneFrame title="Gratifi"><T.YouSaid>What does my card give me at airports?</T.YouSaid><T.Typing /></J.PhoneFrame></S>,
  HomeScreen: () => <J.MarketSwitch render={m => <S><J.HomeScreen market={m} /></S>} />,
  FlightBookingJourney: () => <J.MarketSwitch render={m => <J.FlightBookingJourney market={m} />} />,
  DisruptionJourney: () => <J.MarketSwitch render={m => <J.DisruptionJourney market={m} />} />,
  HotelJourney: () => <J.MarketSwitch render={m => <J.HotelJourney market={m} />} />,
  ArabicScreens: () => <J.ArabicScreens />,
  Markets: () => <S gap={18}>{['UK', 'EU', 'IN', 'AE', 'SG', 'MY', 'AR'].map(m => { const d = DEMO[m === 'AR' ? 'AE' : m]; return <MarketProvider key={m} market={m}><C t={MARKETS[m].name + ' · ' + MARKETS[m].currency + ' · ' + ({ faceid: 'Face ID', otp: 'one-time code', app: 'bank app approval' } as any)[MARKETS[m].auth]}><div className="gr-col" style={{ gap: 12, width: 340 }}><V.FlightCard {...(d.flights[0] as any)} best={undefined} back={undefined} tags={[]} bag={undefined} /><T.PayWith points={d.balance} cash={d.fares.std * 2} rate={d.rate} mix={d.mixPts} card={d.card} /></div></C></MarketProvider> })}</S>,
}
