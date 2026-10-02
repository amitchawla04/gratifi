/* Component sheet for sign-off: every new chat component from the flows doc, live, with where it is used. */
import { React } from '../../kit/src/r'
import { MarketProvider } from '../../kit/src/market'
import { scene } from './scenes'
import * as C2 from './cards2'
import { STAMP } from './design'

const img = (k: string) => scene(k) || ''
const ReactDOM = (window as any).ReactDOM

type Item = { n: string; title: string; used: string; was: 'Partly built' | 'Missing'; el: any }
const items: Item[] = [
  { n: '01', title: 'Trip type and route', used: 'Flights, trains', was: 'Missing', el: <C2.TripForm /> },
  { n: '02', title: "Who's going", used: 'Flights, stays, trains, events', was: 'Missing', el: <C2.Travellers people={[{ name: 'Amit Chawla', sub: '' }, { name: 'Dekyi Chawla', sub: '' }, { name: 'Tenzin Chawla', sub: '', kind: 'Child' }]} /> },
  { n: '03', title: 'Passport details', used: 'International flights, visas', was: 'Missing', el: <C2.Passport name="Dekyi" /> },
  { n: '04', title: 'Extras', used: 'Flights, stays, cinema snacks, car hire', was: 'Missing', el: <C2.Extras title="Add to your trip" items={[{ art: img('move:lounge'), title: 'Lounge at Heathrow T5', sub: '2 free visits left on your card', pts: 0, free: 'Free' }, { art: img('move:fasttrack'), title: 'Fast track security', sub: 'Both of you', pts: 1800 }, { icon: 'meal', title: 'Hot breakfast on board', sub: '2 meals', pts: 2400 }, { art: img('money:insurance'), title: 'Travel insurance', sub: 'Your card already covers you, so this is extra cover', pts: 3100 }]} /> },
  { n: '05', title: 'Pay with points and card', used: 'Every payment', was: 'Partly built', el: <C2.PaySplit total={268} balance={41250} /> },
  { n: '06', title: 'Compare side by side', used: 'Flights, stays, products, insurance', was: 'Missing', el: <C2.Compare a={{ art: img('hotel:pool|Lisbon|Lisbon0'), title: 'Casa Alfama' }} b={{ art: img('hotel:terrace|Lisbon|Lisbon2'), title: 'Miradouro House' }} rows={[['Per night', '14,200 points', '11,800 points', 2], ['Rating', '9.1 Superb', '8.6 Great', 1], ['Breakfast', 'Included', 'Extra', 1], ['Free cancellation', 'Until 13 Oct', 'Until 15 Oct', 2], ['To the old town', '4 min walk', '12 min walk', 1]]} /> },
  { n: '07', title: 'Map view', used: 'Stays, dining, rides, experiences', was: 'Missing', el: <C2.MapView pins={[{ x: 26, y: 34, label: '14,200', title: 'Casa Alfama', sub: '9.1 · 4 min to the old town · pool', art: img('hotel:pool|Lisbon|Lisbon0') }, { x: 62, y: 26, label: '11,800', title: 'Miradouro House', sub: '8.6 · rooftop bar', art: img('hotel:terrace|Lisbon|Lisbon2') }, { x: 74, y: 62, label: '9,400', title: 'Rio Rooms', sub: '8.2 · by the river', art: img('hotel:room|Lisbon|Lisbon1') }, { x: 38, y: 76, label: '16,900', title: 'Palácio Verde', sub: '9.4 · spa and gym', art: img('hotel:facade|Lisbon|Lisbon3') }]} /> },
  { n: '08', title: 'Room choice', used: 'Stays', was: 'Missing', el: <C2.Rooms rooms={[{ art: img('hotel:room|Lisbon|Lisbon1'), title: 'Classic double', facts: ['Double bed · 22 m²', 'Breakfast included', 'Free cancellation until 13 Oct'], pts: 14200, cash: '£142 a night' }, { art: img('hotel:terrace|Lisbon|Lisbon2'), title: 'River view suite', facts: ['King bed · balcony · 38 m²', 'Breakfast included', 'Non-refundable'], pts: 21600, cash: '£216 a night', left: '2 left' }]} /> },
  { n: '09', title: 'Venue seat map', used: 'Concerts, sports, theatre, cinema', was: 'Missing', el: <C2.VenueMap qty={2} /> },
  { n: '10', title: 'Queue', used: 'Big ticket sales, hard-to-get tables', was: 'Missing', el: <C2.Queue /> },
  { n: '11', title: 'Showtimes', used: 'Cinema', was: 'Missing', el: <C2.Showtimes art={img('do:theatre')} /> },
  { n: '12', title: 'Time slots', used: 'Dining, experiences, delivery slots', was: 'Partly built', el: <C2.Slots title="Table for 4 at Brasa" sub="Sat 10 Oct" groups={[{ label: 'Lunch', slots: [{ t: '12:30' }, { t: '13:00', off: true }, { t: '13:30' }] }, { label: 'Dinner', slots: [{ t: '19:00', off: true }, { t: '19:30', off: true }, { t: '20:00' }, { t: '20:15', tag: 'Terrace' }, { t: '21:00' }]}]} note="19:30 is taken. 20:00 is the closest table inside, or 20:15 on the terrace." /> },
  { n: '13', title: 'Product options', used: 'Shopping', was: 'Missing', el: <C2.ProductOptions art={img('shop:headphones')} /> },
  { n: '14', title: 'Address and gift note', used: 'Shopping, gift cards', was: 'Missing', el: <C2.AddressGift /> },
  { n: '15', title: 'Basket', used: 'Shopping, groceries', was: 'Partly built', el: <C2.Basket delivery="Mon 5 Oct · free" items={[{ art: img('shop:headphones'), title: 'Aria headphones', sub: 'Black', pts: 32000, qty: 1 }, { art: img('shop:espresso'), title: 'Espresso machine', sub: 'Steel', pts: 24500, qty: 1 }, { art: img('shop:books'), title: 'Cycling book set', sub: '3 books', pts: 4200, qty: 2 }]} /> },
  { n: '16', title: 'Ride on its way', used: 'Rides, airport transfers', was: 'Missing', el: <C2.RideLive /> },
  { n: '17', title: 'Check-in', used: 'Flights', was: 'Missing', el: <C2.CheckIn people={[{ name: 'Amit Chawla', seat: '14A' }, { name: 'Dekyi Chawla', seat: '14B' }]} /> },
  { n: '18', title: 'Day-of-travel timeline', used: 'Flights, trains', was: 'Missing', el: <C2.TripTimeline /> },
  { n: '19', title: 'Pay it monthly', used: 'Card', was: 'Missing', el: <C2.Instalments /> },
  { n: '20', title: 'Which payment?', used: 'Card disputes', was: 'Partly built', el: <C2.DisputePick txns={[{ id: '1', title: 'Brightwell Electronics', sub: '28 Sep · online', amt: '£1,210.00' }, { id: '2', title: 'Table Collective', sub: '26 Sep · in person', amt: '£86.40' }, { id: '3', title: 'Northway Air', sub: '24 Sep · online', amt: '£268.00' }]} reasons={['I don\'t recognise it', 'Charged twice', 'Wrong amount', 'Refund never came', 'Item never arrived']} /> },
  { n: '21', title: 'Documents', used: 'Visas, claims, disputes', was: 'Partly built', el: <C2.Upload title="For your visa" docs={[{ title: 'Passport photo page', sub: 'Clear, all four corners', done: true }, { title: 'Recent photo', sub: 'Plain background, no glasses' }, { title: 'Hotel booking', sub: 'We can add your Lisbon booking' }]} /> },
  { n: '22', title: 'Subscriptions', used: 'Subscriptions', was: 'Missing', el: <C2.Subscriptions subs={[{ art: STAMP.subs, title: 'Music streaming', price: '£11.99 a month', when: 'renews 12 Oct' }, { title: 'Film and TV', price: '£10.99 a month', when: 'renews 18 Oct', unused: 'Not used in 3 months' }, { title: 'Cloud storage', price: '£2.99 a month', when: 'renews 2 Nov' }, { art: STAMP.giftcards, title: 'Coffee club', price: '£6.00 a month', when: 'renews 8 Oct', unused: 'Not used since June' }]} /> },
]

function Sheet() {
  return <div className="sh">
    <header className="sh-h"><p className="sh-k">Gratifi · chat components</p><h1>22 components for the full flows</h1><p>Every piece the flows doc lists as missing or partly built, drawn from the approved 27 Sept screens and working: tap, pick, slide. Nothing goes into a flow until it's signed off. Data is made up.</p></header>
    <div className="sh-grid">{items.map(i => <section key={i.n} className="sh-it"><div className="sh-l"><span className="sh-n">{i.n}</span><div><h2>{i.title}</h2><p>{i.used}<span className={'sh-was' + (i.was === 'Missing' ? ' new' : '')}>{i.was === 'Missing' ? 'New' : 'Finished'}</span></p></div></div><div className="sh-phone">{i.el}</div></section>)}</div>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<MarketProvider market="UK" className="gr"><Sheet /></MarketProvider>)
