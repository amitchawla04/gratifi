/* Illustrative content for the journeys, one set per market. Airlines are fictional; airports are real.
   Prices, point values and fares are made up for the demo. The bank supplies real point values; suppliers supply fares.
   Dates: Fri 16 to Sun 18 October 2026. Every direct route is inside one time zone, so local times and durations agree; connections only show end points. */

export type Leg = { airline: string; number: string; dep: string; arr: string; from: string; to: string; dur: string; stops?: number; via?: string; price: number; points: number; bag?: string; tags?: string[]; best?: string; back?: string; left?: number }
export type Demo = {
  market: string; home: string; homeCode: string; away: string; awayCode: string; mate: string
  rate: number; balance: number; card: string; round: number
  flights: Leg[]; fares: { light: number; std: number; flex: number }; cancelFee: number; extraSeat: number; cabinKg: number; checkedKg: number; cabinBag: number; checkedBag: number
  plane: string; mixPts: number; nextFlight: { number: string; dep: string; arr: string }; via: { code: string; name: string; dep: string; arr: string }
  owed: string; lounge: { name: string; where: string }; gate: string
  hotel: { name: string; area: string; alt: string; altArea: string; price: number; alt2: number; suite: number; firstNight: number }
  ask: string; hotelAsk: string; phoneEnd: string; claimAction: string; room: string
}

const BASE_CAL: Record<number, number> = { 3: 142, 4: 156, 5: 164, 6: 148, 7: 132, 8: 176, 9: 212, 10: 198, 11: 184, 12: 138, 13: 124, 14: 118, 15: 158, 16: 128, 17: 204, 18: 172, 19: 126, 20: 118, 21: 122, 22: 168, 23: 214, 24: 196, 25: 178, 26: 128, 27: 116, 28: 119, 29: 162, 30: 208, 31: 134 }
export const LOW_DAYS = [14, 20, 27]
export function calendar(d: Demo) {
  const k = d.flights[2].price / 128, out: Record<number, number> = {}
  for (const day in BASE_CAL) out[+day] = Math.round(BASE_CAL[day] * k / d.round) * d.round
  return out
}
/** Every day priced at or below the third-lowest price, so equal prices are marked alike. */
export function lowDays(p: Record<number, number>) {
  const v = Object.values(p).sort((a, b) => a - b), cut = v[2]
  return Object.keys(p).map(Number).filter(k => p[k] <= cut)
}

const f = (airline: string, number: string, dep: string, arr: string, from: string, to: string, dur: string, price: number, rate: number, extra: Partial<Leg> = {}): Leg =>
  ({ airline, number, dep, arr, from, to, dur, price, points: Math.round(price / rate), ...extra })

export const DEMO: Record<string, Demo> = {
  UK: {
    market: 'UK', home: 'London', homeCode: 'LHR', away: 'Lisbon', awayCode: 'LIS', mate: 'Sam', rate: 0.01, balance: 48210, card: '4821', round: 1,
    flights: [
      f('NW', 'NW 214', '07:25', '10:00', 'LHR', 'LIS', '2h 35m', 186, 0.01, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 902', '11:40', '14:20', 'LGW', 'LIS', '2h 40m', 142, 0.01, { bag: 'Small bag only', left: 3 }),
      f('AU', 'AU 330', '06:10', '11:55', 'LHR', 'LIS', '5h 45m', 128, 0.01, { stops: 1, via: 'OPO', bag: 'Cabin bag' }),
    ],
    fares: { light: 148, std: 186, flex: 264 }, cancelFee: 60, extraSeat: 28, cabinKg: 10, checkedKg: 23, cabinBag: 18, checkedBag: 32, plane: 'A320neo', mixPts: 30000,
    nextFlight: { number: 'NW 218', dep: '11:40', arr: '14:15' }, via: { code: 'OPO', name: 'Porto', dep: '10:55', arr: '15:10' },
    owed: 'You may be owed up to £350 each under UK rules. I’ll start the claim once you’re rebooked.', lounge: { name: 'The Orchard', where: 'Heathrow T5 · after security' }, gate: 'B32',
    hotel: { name: 'Casa do Rio', area: 'Alfama', alt: 'Hotel Miradouro', altArea: 'Chiado', price: 248, alt2: 296, suite: 342, firstNight: 124 },
    ask: 'Lisbon for two, 16 to 18 October. Morning flight out.', hotelAsk: 'Somewhere central for those nights, with a pool.', phoneEnd: '77', claimAction: 'Start claim', room: 'Double, river view',
  },
  EU: {
    market: 'EU', home: 'Dublin', homeCode: 'DUB', away: 'Lisbon', awayCode: 'LIS', mate: 'Aoife', rate: 0.01, balance: 42600, card: '7730', round: 1,
    flights: [
      f('NW', 'NW 316', '06:40', '09:25', 'DUB', 'LIS', '2h 45m', 164, 0.01, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 118', '11:15', '14:05', 'DUB', 'LIS', '2h 50m', 139, 0.01, { bag: 'Small bag only', left: 2 }),
      f('AU', 'AU 552', '06:05', '11:40', 'DUB', 'LIS', '5h 35m', 118, 0.01, { stops: 1, via: 'MAD', bag: 'Cabin bag' }),
    ],
    fares: { light: 129, std: 164, flex: 239 }, cancelFee: 55, extraSeat: 25, cabinKg: 10, checkedKg: 23, cabinBag: 16, checkedBag: 30, plane: 'A320neo', mixPts: 26000,
    nextFlight: { number: 'NW 318', dep: '12:05', arr: '14:50' }, via: { code: 'MAD', name: 'Madrid', dep: '11:20', arr: '15:45' },
    owed: 'You may be owed up to €400 each under EU rules. I’ll start the claim once you’re rebooked.', lounge: { name: 'The Orchard', where: 'Dublin T2 · after security' }, gate: '412',
    hotel: { name: 'Casa do Rio', area: 'Alfama', alt: 'Hotel Miradouro', altArea: 'Chiado', price: 276, alt2: 318, suite: 380, firstNight: 138 },
    ask: 'Lisbon for two, 16 to 18 October. Early flight out.', hotelAsk: 'Somewhere central for those nights, with a pool.', phoneEnd: '42', claimAction: 'Start claim', room: 'Double, river view',
  },
  IN: {
    market: 'IN', home: 'Mumbai', homeCode: 'BOM', away: 'Goa', awayCode: 'GOI', mate: 'Riya', rate: 0.25, balance: 96400, card: '5512', round: 10,
    flights: [
      f('NW', 'NW 571', '07:10', '08:25', 'BOM', 'GOI', '1h 15m', 5480, 0.25, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 229', '09:40', '10:55', 'BOM', 'GOI', '1h 15m', 4990, 0.25, { bag: 'Cabin bag only', left: 4 }),
      f('AU', 'AU 804', '06:00', '10:05', 'BOM', 'GOI', '4h 05m', 4120, 0.25, { stops: 1, via: 'BLR', bag: 'Cabin bag' }),
    ],
    fares: { light: 4650, std: 5480, flex: 7900 }, cancelFee: 2999, extraSeat: 650, cabinKg: 7, checkedKg: 15, cabinBag: 0, checkedBag: 1850, plane: 'A320neo', mixPts: 36000,
    nextFlight: { number: 'NW 575', dep: '11:30', arr: '12:45' }, via: { code: 'BLR', name: 'Bengaluru', dep: '10:15', arr: '14:40' },
    owed: 'Under DGCA rules the airline must offer you another flight or a full refund, and may owe you compensation. I’ll check what applies and file it.', lounge: { name: 'The Orchard', where: 'Mumbai T2 · after security' }, gate: '42A',
    hotel: { name: 'Casa Mar', area: 'Assagao', alt: 'Hotel Baga Bay', altArea: 'Calangute', price: 14600, alt2: 17200, suite: 21400, firstNight: 7300 },
    ask: 'Goa for two, 16 to 18 October. Morning flight from Mumbai.', hotelAsk: 'A quiet place with a pool for those nights.', phoneEnd: '09', claimAction: 'Start claim', room: 'Double, pool view',
  },
  AE: {
    market: 'AE', home: 'Dubai', homeCode: 'DXB', away: 'Muscat', awayCode: 'MCT', mate: 'Omar', rate: 0.02, balance: 88500, card: '3309', round: 5,
    flights: [
      f('NW', 'NW 612', '07:25', '08:35', 'DXB', 'MCT', '1h 10m', 690, 0.02, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 404', '11:40', '12:50', 'DXB', 'MCT', '1h 10m', 610, 0.02, { bag: 'Small bag only', left: 3 }),
      f('AU', 'AU 918', '06:10', '10:05', 'DXB', 'MCT', '3h 55m', 540, 0.02, { stops: 1, via: 'DOH', bag: 'Cabin bag' }),
    ],
    fares: { light: 560, std: 690, flex: 1050 }, cancelFee: 250, extraSeat: 95, cabinKg: 7, checkedKg: 23, cabinBag: 0, checkedBag: 120, plane: 'A320neo', mixPts: 55000,
    nextFlight: { number: 'NW 616', dep: '12:15', arr: '13:25' }, via: { code: 'DOH', name: 'Doha', dep: '10:40', arr: '14:30' },
    owed: 'Compensation here depends on the airline’s policy. I’ve asked Northway for meal vouchers and any compensation, and I’ll tell you what they say.', lounge: { name: 'The Orchard', where: 'Dubai T1 · after passport control' }, gate: 'C14',
    hotel: { name: 'Dar al Bahr', area: 'Qurum', alt: 'Hotel Mutrah', altArea: 'Mutrah', price: 1180, alt2: 1420, suite: 1760, firstNight: 590 },
    ask: 'Muscat for two, 16 to 18 October. Morning flight out.', hotelAsk: 'Near the beach for those nights, with a pool.', phoneEnd: '61', claimAction: 'Ask about compensation', room: 'Double, sea view',
  },
  SG: {
    market: 'SG', home: 'Singapore', homeCode: 'SIN', away: 'Bali', awayCode: 'DPS', mate: 'Wei Ling', rate: 0.01, balance: 64300, card: '0418', round: 1,
    flights: [
      f('NW', 'NW 118', '07:25', '10:10', 'SIN', 'DPS', '2h 45m', 298, 0.01, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 760', '11:40', '14:30', 'SIN', 'DPS', '2h 50m', 262, 0.01, { bag: 'Small bag only', left: 3 }),
      f('AU', 'AU 226', '06:10', '11:20', 'SIN', 'DPS', '5h 10m', 219, 0.01, { stops: 1, via: 'KUL', bag: 'Cabin bag' }),
    ],
    fares: { light: 238, std: 298, flex: 420 }, cancelFee: 90, extraSeat: 38, cabinKg: 7, checkedKg: 20, cabinBag: 0, checkedBag: 45, plane: 'A321neo', mixPts: 48000,
    nextFlight: { number: 'NW 122', dep: '12:20', arr: '15:05' }, via: { code: 'KUL', name: 'Kuala Lumpur', dep: '10:30', arr: '16:00' },
    owed: 'Singapore has no fixed compensation scheme, so the airline’s policy applies. I’ve asked Northway what they’ll offer and I’ll tell you.', lounge: { name: 'The Orchard', where: 'Changi T3 · after immigration' }, gate: 'B6',
    hotel: { name: 'Rumah Laut', area: 'Seminyak', alt: 'Hotel Canggu Sands', altArea: 'Canggu', price: 420, alt2: 486, suite: 590, firstNight: 210 },
    ask: 'Bali for two, 16 to 18 October. Morning flight out.', hotelAsk: 'Close to the beach for those nights, with a pool.', phoneEnd: '38', claimAction: 'Ask about compensation', room: 'Double, garden view',
  },
  MY: {
    market: 'MY', home: 'Kuala Lumpur', homeCode: 'KUL', away: 'Kota Kinabalu', awayCode: 'BKI', mate: 'Aina', rate: 0.01, balance: 80000, card: '6624', round: 1,
    flights: [
      f('NW', 'NW 450', '07:25', '10:00', 'KUL', 'BKI', '2h 35m', 389, 0.01, { bag: 'Cabin bag', tags: ['Seats together'], best: 'Best for you', back: '5% back on your card' }),
      f('CL', 'CL 312', '11:40', '14:20', 'KUL', 'BKI', '2h 40m', 345, 0.01, { bag: 'Small bag only', left: 2 }),
      f('AU', 'AU 670', '06:10', '11:30', 'KUL', 'BKI', '5h 20m', 289, 0.01, { stops: 1, via: 'KCH', bag: 'Cabin bag' }),
    ],
    fares: { light: 319, std: 389, flex: 560 }, cancelFee: 120, extraSeat: 45, cabinKg: 7, checkedKg: 20, cabinBag: 0, checkedBag: 65, plane: 'A320neo', mixPts: 40000,
    nextFlight: { number: 'NW 454', dep: '12:10', arr: '14:45' }, via: { code: 'KCH', name: 'Kuching', dep: '10:50', arr: '16:05' },
    owed: 'Under Malaysian aviation rules you can choose another flight or a full refund, and the airline must look after you while you wait. I’ll handle the claim.', lounge: { name: 'The Orchard', where: 'KLIA T1 · after immigration' }, gate: 'C21',
    hotel: { name: 'Rumah Pantai', area: 'Tanjung Aru', alt: 'Hotel Gaya Bay', altArea: 'City centre', price: 690, alt2: 780, suite: 960, firstNight: 345 },
    ask: 'Kota Kinabalu for two, 16 to 18 October. Morning flight out.', hotelAsk: 'By the sea for those nights, with a pool.', phoneEnd: '15', claimAction: 'Start claim', room: 'Double, sea view',
  },
}
