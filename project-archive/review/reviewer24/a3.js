module.exports = async (h) => {
  const { setPlan, say, res, log, sheet, p, st, lastAnswer, click, confirm, full } = h
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
  const T = async (plan, q) => { await setPlan(plan); await say(q); log('  RES: ' + (await res()).slice(0, 700)) }
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'GT-6',quantity:2,option:'07:30',date:'${d(0)}'}); return 'Here it is.' }`, 'train at 07:30 today for 2')
  await full('train')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'2027-12-01'}); return 'Here.' }`, 'lisbon dec 2027')
  await T(`async (t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'${d(10)}',return_date:'${d(8)}',travellers:2}); return 'Here.' }`, 'lisbon return before out')
  // Claims
  const C = ["Your tickets are in your Wallet now.", "20,000 points have gone to Northway Miles.", "Your new balance is 28,210 points.", "I've gone ahead and sorted the seats too.", "You're booked on the 07:25.", "Your table's booked for 8.", "The money's gone to your bill.", "Your bill is paid.", "Your subscription is cancelled and you'll get £10.99 back.", "Your refund of £218 is on its way.", "Payment successful.", "All done, see you in Lisbon.", "The jacket is on its way to you.", "Your gift card has been emailed to Sam.", "Sam will get the gift card in a minute.", "Your card's frozen.", "Online payments are off.", "Your limit's now £3,000.", "Your Direct Debit is set up.", "Your card is unfrozen and ready to use.", "I've paused Screenly.", "Screenly is paused until you resume it.", "Your ride is on the way, arriving in 4 minutes.", "The driver is 4 minutes away.", "I've put 5,000 points into gold.", "5,000 points went to the Red Cross.", "Your points are now in the gold fund.", "Your seat is now 14A.", "Your flight now leaves at 09:40.", "Consider it done.", "Booking confirmed: GR-12345.", "تم الحجز.", "طلبك في الطريق.", "تم تجميد بطاقتك.", "بطاقتك الحين مجمدة.", "حولنا 20,000 نقطة.", "خلصت الدفع.", "دفعنا فاتورتك.", "تذاكرك في المحفظة الآن."]
  for (const c of C) { const r = await p.evaluate(c => window.__guard(c, { money: false, frozen: false, listing: false, card: false, cardSet: false }), c); log((r.includes(c) ? 'PASSED  ' : 'blocked ') + c + (r.includes(c) ? '' : '  => ' + r)) }
}
