const run=require('./h.js'); const book=require('./book.js'); const m=process.argv[2]||'UK';
run(`fl4-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await book(h);
  await ask('change my seats'); await full('seatchange'); log('SC', await lastText());
  // pick traveller 2, exit row seat on outbound
  const rs=last().getByRole('radio'); log('radios', await rs.count());
  await rs.nth(1).click().catch(()=>{}); await last().locator('.gr-seat[aria-label*="14E"]').click().catch(e=>log('no14E'));
  await full('sc-picked'); log('SC2', await lastText());
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600);
  if (await p.$('.app-sheet')) { await confirm() }
  await full('sc-saved'); log('SC3', await lastText());
  let s=await st(); log('seats', JSON.stringify(s.bookings[0].extra.seats), JSON.stringify(s.bookings[0].extra.backSeats), 'card', s.card.balance, 'bal', s.balance);
  await ask('change the date of my return flight'); await full('chg'); log('CHG', await lastText());
});
