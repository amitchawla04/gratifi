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
  ['Cancel my flight', /nothing booked|don't have anything/i], ['help me find a hotel in ' + d[0], 'items'], ['hey, book a table for 4 tomorrow at 8pm', 'items'], ['change my seat', /flight booked/i], ['send £50 to my mum', /isn't something Gratifi does/],
  ['Leather trainers', 'items'], ['book a train to Manchester', 'items'], ['lounge at Gatwick', 'items'], ['transfer 5000 points', 'programmes'], ['is my card frozen?', 'controls'], ['Screenly', 'detail'], ['Book a flight to Tokyo', /Tokyo|Where/],
  ['only direct', 'flights'], ['cheaper dates?', 'calendar'], ['cancel it', /nothing to cancel/i], ['hello', 'cats'], ['Book me a spaceship', /can't do that/], ['I want to complain', 'handoff'], ['Someone took money I don\'t recognise', 'handoff'],
  ...(d[0] === 'Muscat' && d[3] === 'Dubai' ? [['رحلات إلى مسقط نهاية الأسبوع القادم لشخصين', 'flights'], ['كم أدين؟', 'paybill'], ['أشياء للقيام بها في مسقط', 'items'], ['جمّد بطاقتي', 'controls'], ['طاولة لشخصين الليلة', 'items'], ['حليب وبيض وخبز', 'grocery'], ['كم نقطة لدي؟', 'points'], ['فندق في مسقط', 'items'], ['احجز صالة', 'items'], ['هل أحتاج إلى تأشيرة لمسقط؟', 'visa']] : []),
  ['unfreeze my card', /isn't frozen|Confirm/], ['Where is my order?', /no orders|Which one/i], ['my headphones arrived broken', /Which one|nothing booked|don't have anything/i], ['What\'s new?', /./],
]
;(async () => {
  const b = await chromium.launch(); let fails = 0, total = 0
  for (const m of markets) {
    const p = await b.newPage({ viewport: { width: 420, height: 880 } }); const errs = []; p.on('pageerror', e => errs.push(e.message))
    await p.goto(`file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400)
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
