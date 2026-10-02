const run=require('./h.js'); const book=require('./book.js'); const m=process.argv[2]||'UK';
run(`fl5-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await book(h);
  await ask('change my seats'); const rs=last().getByRole('radio'); await rs.nth(1).click(); await last().locator('.gr-seat[aria-label*="14E"]').click();
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); await click(/^Pay /); await confirm(); await full('seat-paid'); log('SEATPAID', await lastText());
  let s=await st(); log('seats', JSON.stringify(s.bookings.map(b=>[b.title,b.status,b.total,b.pts,b.card, b.extra&&b.extra.seats])), 'card', s.card.balance, 'bal', s.balance);
  await ask('change the date of my return flight'); await last().getByRole('button',{name:/Sat 17 Oct/}).first().click(); await p.waitForTimeout(400); await full('chg-pick'); log('CHG1', await lastText());
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); await full('chg-next'); log('CHG2', await lastText());
  const pay=p.getByRole('button',{name:/^Pay |^Confirm/}).last(); if(await pay.count()){ await pay.click(); await p.waitForTimeout(300); if(await p.$('.app-sheet')) await confirm(); }
  await full('chg-done'); log('CHG3', await lastText());
  s=await st(); log('after chg', JSON.stringify(s.bookings[0].extra.back), JSON.stringify(s.bookings[0].extra.backSeats), 'card', s.card.balance, 'bal', s.balance);
  await ask('can I leave later on the outbound?'); await full('time'); log('TIME', await lastText());
});
