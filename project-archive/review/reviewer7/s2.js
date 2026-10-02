const H=require('./h.js'); const {bookFlight}=require('./s1.js');
H('UK','s2', async (h)=>{ const {p,shot,full,nav,ask,click,st,money,log,url,lastText,last}=h;
  await nav(3); await ask('Ways to earn more'); await p.getByRole('button',{name:/Join/}).last().click(); await p.waitForTimeout(300);
  await bookFlight(h,'Flights to Lisbon next weekend for two','Card');
  let s=await st(); log('after flight: challenges', JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.target,c.done])), 'lounge', s.loungeLeft);
  log('booking', JSON.stringify(s.bookings[0].extra)); log(await last(2));
  const receipt0 = await p.locator('.gr-receipt').last().innerText();
  // change outbound date from Wallet
  await nav(4); await click('Change date'); await p.waitForTimeout(300); await full('change-open');
  const a = p.locator('.gr-answer').last();
  log('change card', (await a.innerText()).replace(/\n/g,' / ').slice(0,600));
  await a.locator('.gr-slot').nth(0).click(); await p.waitForTimeout(300); await full('change-day');
  log('after day', (await a.innerText()).replace(/\n/g,' / ').slice(0,900));
  await a.locator('.gr-btn').last().click(); await p.waitForTimeout(600); await full('change-result');
  log('result', await last(2));
  const pay = p.getByRole('button',{name:/^Pay /}); if(await pay.count()){ log('checkout:', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g,' / ').slice(0,700)); await pay.last().click(); await h.faceConfirm(); log(await last(1)); await full('change-paid') }
  // return leg change
  await ask('change my return flight'); log('misroute?', await last(1)); await ask('change the date of my flight back'); log('phr2', await last(1)); await nav(4); await click('Change date'); await p.waitForTimeout(300); const a2 = p.locator('.gr-answer').last(); await a2.getByText('Flight back',{exact:true}).click(); await p.waitForTimeout(200); await full('ret-open'); log('ret card', (await a2.innerText()).replace(/\n/g,' / ').slice(0,500));
  await a2.locator('.gr-slot').nth(1).click(); await p.waitForTimeout(300); log('ret day', (await a2.innerText()).replace(/\n/g,' / ').slice(0,900)); await full('ret-day');
  // choose a different time if available
  const times = a2.locator('.gr-slot'); log('slots', await times.allInnerTexts());
  await a2.locator('.gr-btn').last().click(); await p.waitForTimeout(600); log('ret result', await last(1));
  const pay2 = p.getByRole('button',{name:/^Pay /}); if(await pay2.count()){ await pay2.last().click(); await h.faceConfirm(); log(await last(1)) }
  await full('ret-done');
  s=await st(); log('booking after changes', JSON.stringify({when:s.bookings[0].when, total:s.bookings[0].total, card:s.bookings[0].card, pts:s.bookings[0].pts, earned:s.bookings[0].earned, detail:s.bookings[0].detail}));
  log('money', JSON.stringify(await money())); log('ledger', JSON.stringify(s.ledger.slice(0,6).map(l=>l.label+' '+l.pts)));
  // receipt unchanged?
  const receipt1 = await p.locator('.gr-receipt').first().innerText(); log('receipt same?', receipt0===receipt1, receipt1.replace(/\n/g,' / ').slice(0,400));
  // seat change: outbound traveller 2 and return traveller 1, then save
  await ask('change my seats'); await p.waitForTimeout(300); const sc = p.locator('.gr-answer').last();
  log('seat card', (await sc.innerText()).replace(/\n/g,' / ').slice(0,300));
  await sc.locator('[role=radio]').nth(1).click(); await sc.locator('.gr-seat:not([disabled])').nth(5).click(); await p.waitForTimeout(200);
  log('after pick out', (await sc.locator('[role=radiogroup]').innerText()).replace(/\n/g,' '));
  await sc.getByText('Flight back',{exact:true}).click().catch(e=>log('no flight back seg')); await p.waitForTimeout(200);
  await sc.locator('[role=radio]').nth(0).click(); await sc.locator('.gr-seat:not([disabled])').nth(7).click(); await p.waitForTimeout(200);
  log('after pick back', (await sc.locator('[role=radiogroup]').innerText()).replace(/\n/g,' '));
  await full('seats-picked');
  await sc.getByRole('button',{name:/Save seats/}).click(); await p.waitForTimeout(500); log('seat save', await last(1));
  const pay3 = p.getByRole('button',{name:/^Pay /}); if(await pay3.count()){ log('seat fee checkout'); await pay3.last().click(); await h.faceConfirm(); log(await last(1)) }
  s=await st(); log('seats now', JSON.stringify({out:s.bookings[0].extra.seats, back:s.bookings[0].extra.backSeats}));
  await full('seats-saved');
  await nav(4); await click(/Boarding pass|Show pass/); await full('passes');
  await ask('cancel my flight'); await click('Yes, cancel'); log(await last(1));
  s=await st(); log('after cancel: challenges', JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.target,c.done])), 'lounge', s.loungeLeft);
  log('money', JSON.stringify(await money())); log('ledger', JSON.stringify(s.ledger.slice(0,8).map(l=>l.label+' '+l.pts)));
  log('txns', JSON.stringify(s.txns.slice(0,6).map(t=>t.merchant+' '+t.amount+(t.refund?' R':''))));
});
