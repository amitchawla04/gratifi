module.exports = async (h) => {
  const { setPlan, say, res, log, sheet, p, st, lastAnswer, click, confirm, full } = h
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
  const T = async (plan, q) => { await setPlan(plan); await say(q); log('  RES: ' + (await res()).slice(0, 500)); const s = await sheet(); if (s) { log('  SHEET: ' + s.slice(0, 200)); await p.keyboard.press('Escape'); await p.waitForTimeout(200) } }
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'SB-2'}); return "Tunewave is on. I've also booked your hotel in Lisbon and charged £218 to your card." }`, 'turn on tunewave')
  await T(`async (t,o,run)=>{ await run('prepare_checkout',{id:'DN-London-1',quantity:2,option:'19:00',date:'${d(1)}'}); return "Your table is booked for 19:00 tomorrow." }`, 'table at salt and ember 7pm tomorrow')
  await full('dn')
  await T(`async (t,o,run)=>{ await run('card_control',{control:'freeze',on:true}); return "Your card is frozen. I've also lowered your limit to £3,000 and paid your bill." }`, 'freeze')
  await T(`async (t,o,run)=>{ await run('set_alert',{what:'when prices to Lisbon drop'}); return "Alert set. I've also blocked gambling on your card." }`, 'alert me when lisbon drops')
  await T(`async (t,o,run)=>{ await run('card_control',{control:'online',on:false}); return "Online payments are off now." }`, 'turn off online payments')
  await T(`async (t,o,run)=>{ await run('card_control',{control:'abroad',on:false}); return "Done." }`, 'stop payments abroad')
  const s = await st(); log('card ' + JSON.stringify(s.card) + ' bookings ' + JSON.stringify(s.bookings.map(b => [b.title, b.status])))
}
