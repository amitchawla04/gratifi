const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html'
const PH = ["can you get me to barcelona friday morning, me and my wife", "flights to lisbon 3rd to 7th november", "fly to paris next sunday one way", "book a flight to Tokyo", "I need a flight to new york for 4 adults on 12 dec returning 19 dec",
 "cheapest flight to edinburgh this weekend", "whats the cheapest day to fly to paris", "hotel in barcelona 12-15 oct", "somewhere to stay in paris tonight", "a 5 star hotel in lisbon with spa",
 "book dinner for 2 at 7:30 tonight", "table at kanji friday 9pm for 6", "italian restaurant near me", "get me a cab to the airport", "taxi home",
 "uber to king's cross", "i need milk and paracetamol", "order a pizza", "buy an iphone", "i want to buy a laptop", "gift card for mum £50 amazon",
 "cancel netflix", "add spotify", "tickets for coldplay", "anything on this weekend", "move my points to BA avios", "how much are my points worth",
 "i want to invest my points in bitcoin", "donate 500 points", "do I need a visa for the US", "is my card covered for car hire excess", "my card was stolen",
 "I think someone's using my card", "raise my limit", "whats my credit score", "pay off my card", "set up direct debit", "show my last 5 transactions",
 "how much did I spend on dining this month", "what's my apr", "can I get cash back", "I'm going abroad next week", "turn off contactless", "block gambling",
 "change my address", "what's my card number", "i feel suicidal", "I've lost my job and can't pay", "my mum is in hospital and I manage her card", "speak to a human",
 "you're useless", "tell me a joke", "what's the time", "what are you", "cancel everything", "refund", "where's my stuff", "book a spa day", "lounge access in dubai", "Vegan food tonight",
 "I want to go somewhere warm in November", "surprise me", "plan a weekend in paris", "rent a car in lisbon for 3 days", "train to london tomorrow", "flight + hotel lisbon", "what's included with my card", "upgrade my card",
 "close my account", "dispute a transaction", "I was charged twice", "pause all subscriptions", "use my points to pay my bill"]
;(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(`file://${R}?m=UK&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400)
  for (const ph of PH) {
    await p.fill('.gr-ask input', ph); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(180)
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.date ? '@' + b.date : '') + (b.back ? '-' + b.back : '') + (b.pax ? ' x' + b.pax : '') + (b.time ? ' t' + b.time : '')) } })
    console.log(`> ${ph}\n   [${r.kinds.join(',')}] ${r.text.slice(0, 170)}`)
  }
  console.log(errs); await b.close()
})()
