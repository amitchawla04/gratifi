// Types every chip and common phrase into the built-in engine and checks what comes back.
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const D = { UK: ['Lisbon', 'Barcelona', 'Paris', 'London'], EU: ['Lisbon', 'Barcelona', 'Paris', 'Dublin'], IN: ['Goa', 'Delhi', 'Bengaluru', 'Mumbai'], AE: ['Muscat', 'London', 'Istanbul', 'Dubai'], SG: ['Bali', 'Bangkok', 'Tokyo', 'Singapore'], MY: ['Kota Kinabalu', 'Penang', 'Langkawi', 'Kuala Lumpur'], AR: ['Muscat', 'London', 'Istanbul', 'Dubai'] }
const markets = (process.argv[2] || 'UK,EU,IN,AE,SG,MY,AR').split(',')
const CASES = (d) => [
  // [phrase, expected block kind or regex on reply]
  [`Flights to ${d[0]} next weekend for two`, 'flights'], [`Cheapest flights to ${d[1]}`, 'flights'], [`One way to ${d[2]} on Friday`, 'flights'], [`A hotel in ${d[0]} with a pool`, 'items'], [`Somewhere central in ${d[1]}`, 'items'],
  ['Book a lounge', 'items'], ['Fast track security', 'items'], ['Meet and greet on arrival', 'items'], ['A ride now', 'items'], ['Airport transfer', 'items'], ['Hire a car', 'items'],
  [`Things to do in ${d[0]}`, 'items'], [`A food tour in ${d[3]}`, 'items'], ['A table tonight for two', 'items'], [`Vegetarian dinner in ${d[3]}`, 'items'], ['Milk, eggs and bread', 'grocery'], ['Nappies now', 'grocery'], ['Can I order food delivery?', 'state'],
  ['Noise-cancelling headphones', 'items'], ['A cabin suitcase', 'items'], ['Earn extra points shopping', 'items'], ['A gift card for a friend', 'items'], ['Use my expiring points on a gift card', 'items'], ['Which subscriptions are included?', 'items'], ['Start a streaming subscription', 'items'],
  ['Concerts this month', 'items'], ['Theatre on Friday', 'items'], ['Transfer points to miles', 'programmes'], ['How many points do I have?', 'points'], ['Put points into gold', 'invest'], ['Grow my points', 'invest'], ['Donate points to charity', 'charities'],
  [`Do I need a visa for ${d[0]}?`, 'visa'], ['Travel insurance', 'insurance'], ['eSIM for data abroad', 'esim'], ['A sold-out restaurant', 'conciergeform'], ['Find a special gift', 'conciergeform'], ['What does my card cover?', 'benefits'], ['Money back on a purchase', 'benefits'],
  ['What do I owe?', 'paybill'], ['Freeze my card', 'controls'], ['Where did my money go?', 'spend'], ['I lost my card', 'controls'], ['Ways to earn more', 'challenges'], ['Gift for a friend', 'items'], ['Show me card offers', 'offers'],
  ["What's included with my card?", 'benefits'], ['What can I do with my points?', 'items'], ['Groceries now', 'grocery'], ['Flights for the weekend', 'places'], ['Book a flight', 'places'],
  ['Cancel my flight', /active bookings|Which one/i], ['help me find a hotel in ' + d[0], 'items'], ['hey, book a table for 4 tomorrow at 8pm', 'items'], ['change my seat', /flight booked/i], ['send £50 to my mum', /isn't something Gratifi does/],
  ['Leather trainers', 'items'], ['book a train to Manchester', 'items'], ['lounge at Gatwick', 'items'], ['transfer 5000 points', 'programmes'], ['is my card frozen?', 'controls'], ['Screenly', 'detail'], ['Book a flight to Tokyo', /Tokyo|Where/],
  ['only direct', 'flights'], ['cheaper dates?', 'calendar'], ['cancel it', /nothing to cancel/i], ['hello', 'cats'], ['Book me a spaceship', /can't do that/], ['I want to complain', 'handoff'], ['Someone took money I don\'t recognise', 'handoff'],
  ...(d[0] === 'Muscat' && d[3] === 'Dubai' ? [['أوقف المقامرة', 'handoff'], ['ألغِ تجميد بطاقتي', /isn't frozen|Confirm/], ['ما رصيد بطاقتي', 'balance'], ['كم أنفقت على المطاعم', /spent/], ['سيارة إلى المطار غدًا الساعة 7 صباحًا', 'detail'], ['رحلات إلى مسقط نهاية الأسبوع القادم', 'flights'], ['رحلات مسائية فقط', 'flights'], ['أفكر في إيذاء نفسي', 'handoff'], ['تلقيت رسالة تطلب رمز التحقق', 'handoff'], ['بطاقة هدية لصديقي', 'items'], ['ألغ اشتراكي', /subscriptions/], ['ما الطقس في دبي', /weather/], ['اشتر لي سماعات', 'items'], ['ما هو حد بطاقتي', 'balance'], ['أوقف القمار', 'handoff'], ['كيف أحصل على المزيد من النقاط', 'challenges'], ['فقدت وظيفتي ولا أستطيع الدفع', 'handoff'], ['رحلات إلى مسقط من 20 إلى 25 أكتوبر', 'flights'], ['أريد أن أنهي حياتي', /mental health|helpline|800/i], ['زوجي توفي', 'handoff'], ['لا أستطيع السداد', 'handoff'], ['اتصل بي شخص من البنك وطلب مني تحويل أموالي', 'handoff'], ['حوّل 100 درهم لصديقي', /isn't something Gratifi does/], ['رحلات إلى مسقط أمس', /already passed/], ['رحلات إلى مسقط نهاية الأسبوع القادم', 'flights'], ['وماذا عن اليوم التالي؟', 'flights'], ['اجعلها ثلاثة أشخاص', 'flights'], ['أوقف الدفع عبر الإنترنت', 'controls'], ['تقسيط', 'handoff'], ['شكرا', /welcome/], ['رقم بطاقتي', /ends/], ['ارفع الحد', 'handoff'], ['أريد استرداد', /bookings|Which one|cancel/i], ['بطاقتي سرقت', 'controls'], ['أريد التحدث مع شخص', 'handoff'], ['ادفع فاتورتي', 'paybill'], ['ادفع الحد الأدنى', 'paybill'], ['رحلات إلى مسقط يوم 16 أكتوبر', 'flights'], ['طاولة في مطعم محجوز بالكامل', 'conciergeform'], ['رحلات إلى مسقط نهاية الأسبوع القادم لشخصين', 'flights'], ['كم أدين؟', 'paybill'], ['أشياء للقيام بها في مسقط', 'items'], ['جمّد بطاقتي', 'controls'], ['طاولة لشخصين الليلة', 'items'], ['حليب وبيض وخبز', 'grocery'], ['كم نقطة لدي؟', 'points'], ['فندق في مسقط', 'items'], ['احجز صالة', 'items'], ['هل أحتاج إلى تأشيرة لمسقط؟', 'visa']] : []),
  ["I'm struggling to pay my bills", 'handoff'], ['my husband died, what do I do with his card', 'handoff'], ['I want to close my account', 'handoff'], ['change my PIN', /PIN/], [`a hotel near ${d[3] === 'Dubai' ? 'Dubai Airport' : d[3]} tonight`, 'items'],
  ['move 10000 points to my airline miles', 'programmes'], [`what's the weather in ${d[0]}`, /weather/], ['football tickets', 'items'], ["what's my balance", 'balance'], ['pay the minimum', 'paybill'], ['block online payments', 'controls'], ['what offers do I have', 'offers'],
  ['what subs do I have', /Nothing booked|active/], ['Glastonbury tickets', 'conciergeform'], ['cancel my Screenly subscription', /don't have Screenly/], ['where is my parcel', /no orders/], ['thanks', /welcome/], ['show my passes', /passes/],
  [`flights to ${d[1]} on 20 October for 3 people, back on the 25th`, 'flights'], [`hotel in ${d[0]} for 3 nights from 16 Oct`, 'items'], ['table for 4 at 8pm tomorrow', 'items'], ['Kanji on Saturday at 8pm', 'detail'], ['I found my card', /isn't frozen|Confirm/],
  ['someone stole my card', 'controls'], ['I lost my wallet', 'controls'], ['turn on online payments', /Confirm it's you|already on/], ['block gambling transactions', 'handoff'], ['can I use my card in Japan?', 'controls'],
  [`flights to ${d[0]} on 20 Oct back 18 Oct`, /before you leave/], [`flights to ${d[0]} for me, my wife and our 2 kids on 20/10`, 'flights'], [`flights to ${d[0]} on 31 Feb`, /no 31 February/], [`flights to ${d[0]} yesterday`, /already passed/], [`flights to ${d[0]} for 12 people`, 'conciergeform'],
  [`Flights to ${d[1]} next weekend for two`, 'flights'], ['what about the day after?', 'flights'], ['what time does it land?', /lands at/],
  ['good morning', 'cats'], ['thanks, that is all', /welcome/], ['How do I get more points?', 'challenges'], ['book a spa day', 'conciergeform'], ['do I need a visa for Peru?', /official travel advice/], ['cheapest way to get to Reykjavik', /can't book flights to Reykjavik/],
  [`A hotel in ${d[0]} with a pool`, 'items'], ['make it 3 nights', 'items'], ['cheaper ones?', 'items'],
  ['someone called from the bank and asked me to move my money', 'handoff'], ['transfer 100 pounds to my friend', /isn't something Gratifi does/], ['convert points to cash', /can't be paid out as cash/], ['cancel my subscription', /don't have any subscriptions|Which one|cancel/i],
  ['turn off payments abroad', /Payments abroad are off/], ['unfreeze my card', /isn't frozen|Confirm/], [`Cheaper dates to ${d[0]}`, 'calendar'], ['statement for August', /Older statements/],
  [`fly to ${d[1]} friday to monday`, 'flights'], [`flights to ${d[0]} 2026-10-20`, 'flights'], [`flights from Manchester to ${d[0]}`, /only book flights from|flights to/], [`flights to ${d[0]} for 3 adults and 1 infant`, 'flights'],
  [`Flights to ${d[0]} next weekend for two`, 'flights'], ['back on monday instead', 'flights'], ['evening flights only', 'flights'], ['make it three people', 'flights'],
  ['I feel like ending it all', 'handoff'], ["I can't go on", 'handoff'], ['someone phoned me pretending to be the bank', 'handoff'], ['I got a text asking me to confirm a payment', 'handoff'], ['someone from the bank asking for my PIN', 'handoff'],
  ['available credit', 'balance'], ['what is my credit limit', 'balance'], ['I need assistance', /./], ['business class', 'conciergeform'], ['chargeback', 'handoff'], ['add my partner as a cardholder', 'handoff'], ['Can I take my dog on the flight?', 'conciergeform'], ['invest my points in bitcoin', 'invest'],
  ['what did I spend at Tesco', /no card payments at Tesco|spent/], ['fly me to reykjavik', /can't book flights to Reykjavik/], ['A ride tomorrow at 7am to the airport', 'detail'], ['send a gift card to sam@example.com', 'detail'], ['donate 500 points', 'charities'],
  ['I can no longer afford my repayments', 'handoff'], ['I am being threatened to send money', 'handoff'], ['send a £50 gift card to my sister at sis@example.com', 'detail'], ['give 2,000 points to Clean Seas', /Check the details/], ["I'm travelling to Japan next week", /Have a good trip/],
  ['can I get a refund on my Lisbon hotel?', /bookings|Which one|cancel/i], [`flights to ${d[1]} the 3rd to the 6th of november`, 'flights'], ['insurance for skiing', 'conciergeform'], ['how many points do I get per pound?', /You earn/], ['do my points expire?', /Points last/], ['book me a helicopter to Paris', 'conciergeform'],
  [`Flights to ${d[0]} next weekend for two`, 'flights'], ['and back on the Friday?', 'flights'], ['can we leave in the evening instead', 'flights'],
  ['tickets for coldplay', 'conciergeform'], ['tickets for the football', 'items'], ['Kanji at 8pm for two', /Kanji has tables/], ['I lost my job and can\'t pay my card', 'handoff'],
  ['unfreeze my card', /isn't frozen|Confirm/], ['Where is my order?', /no orders|Which one/i], ['my headphones arrived broken', /Which one|can't find an order/i], ['What\'s new?', /./],
]
;(async () => {
  const b = await chromium.launch(); let fails = 0, total = 0
  for (const m of markets) {
    const p = await b.newPage({ viewport: { width: 420, height: 880 } }); const errs = []; p.on('pageerror', e => errs.push(e.message))
    await p.goto(`file://${__dirname}/build/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400)
    for (const [ph, exp] of CASES(D[m])) {
      total++
      await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('gratifi-state')); }); 
      await p.fill('.gr-ask input', ph); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(160)
      const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; return { text: msg.text || '', kinds: (msg.blocks || []).map(b => b.kind) } })
      const ok = typeof exp === 'string' ? r.kinds[0] === exp : exp.test(r.text)
      if (!ok) { fails++; console.log(`FAIL ${m} | ${ph} | expected ${exp} | got [${r.kinds.join(',')}] ${r.text.slice(0, 110)}`) }
    }
    if (errs.length) console.log('ERRORS', m, errs.slice(0, 3).join(' | '))
    await p.close()
  }
  console.log(`${total - fails}/${total} passed`); await b.close()
})()
