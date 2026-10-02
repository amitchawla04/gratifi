const H=require('./h.js');
H('UK','s9', async (h)=>{ const {p,shot,full,nav,ask,click,st,money,log,last,lastText,url}=h;
  await nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  const cont = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cont.dblclick(); await p.waitForTimeout(500);
  log('checkouts after dblclick continue', (await st()).chat.filter(m=>(m.blocks||[]).some(b=>b.kind==='checkout')).length);
  const pay = p.getByRole('button',{name:/^Pay /}).last(); await pay.dblclick(); await p.waitForTimeout(400); log('sheets', await p.locator('.app-sheet').count());
  await p.locator('.app-sheet .gr-btn').last().dblclick(); await p.waitForTimeout(4000); log('bookings after dblclick confirm', JSON.stringify((await money()).bookings));
  // reload during scanning
  await ask('A cabin suitcase'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(300); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(500); await p.goto(url()); await p.waitForTimeout(2500);
  log('bookings after reload mid-scan', JSON.stringify((await money()).bookings)); await nav(3);
  // cancel double tap
  await ask('cancel my headphones'); await p.getByRole('button',{name:'Yes, cancel'}).last().dblclick(); await p.waitForTimeout(500); const s=await st(); log('ledger after dbl cancel', JSON.stringify(s.ledger.slice(0,4).map(l=>l.label+' '+l.pts)), 'bal', s.balance);
  // hotel budget and capacity
  await ask('a double room in Paris for 2 nights from Friday under £150 a night'); log('budget', (await lastText()).slice(0,500));
  await ask('hotel in Lisbon for 5 people'); log('5 ppl', (await lastText()).slice(0,300)); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); log('detail 5', (await lastText()).slice(0,600)); await full('hotel5');
  // old flight card retap
  await ask('Flights to Paris next weekend'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); log('fares blocks', (await st()).chat.filter(m=>(m.blocks||[]).some(b=>b.kind==='fares')).length);
  // gift card email validation
  await ask('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.app-in').nth(0).fill('Sam'); await p.locator('.app-in').nth(1).fill('sam@'); await p.waitForTimeout(200); log('bad email', (await lastText()).slice(-250), await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().isDisabled());
  // insurance checks
  await ask('Travel insurance'); await p.locator('.gr-answer').last().getByRole('button',{name:/Buy|Choose|Get/}).first().click().catch(e=>log('no buy btn')); await p.waitForTimeout(400); log('ins facts', (await lastText()).slice(0,900)); await full('ins-facts');
  // concierge
});
