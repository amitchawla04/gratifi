const H=require('./h.js'); const {bookFlight}=require('./s1.js');
const tgl = async (p, label) => { await p.locator('.app-demo').getByText(label).locator('xpath=..').locator('[role=switch], input, button').first().click(); await p.waitForTimeout(250) };
H('UK','s3', async (h)=>{ const {p,shot,full,nav,ask,click,st,money,log,url,lastText,last}=h;
  const buy = async (q, method) => { await ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); if(method){ await p.locator('.gr-answer').last().getByText(method,{exact:true}).click(); await p.waitForTimeout(200)} };
  // supplier down
  await nav(5); await p.screenshot({path:'shots/s3-demo.png'});
  log('demo switches', await p.locator('.app-demo [role=switch]').count());
  await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(200);
  const m0 = await money(); await nav(3);
  await buy('Noise-cancelling headphones','Card'); await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(400); log('sheet opened?', await p.locator('.app-sheet').count());
  await h.faceConfirm(); log('supplier down result:', await last(1)); await full('supplier');
  const m1 = await money(); log('unchanged?', JSON.stringify(m0)===JSON.stringify(m1), JSON.stringify(m1));
  // flight too
  await bookFlight(h,'Flights to Lisbon next weekend for two','Points and card').catch(e=>log('flight flow broke:', e.message.slice(0,80))); log('flight supplier down:', await last(3)); await full('flight-supplier'); log('unchanged?', JSON.stringify(await money())===JSON.stringify(m0));
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3);
  // decline: card only and points only
  await nav(5); await p.locator('.app-demo [role=switch]').nth(2).click(); await nav(3);
  await buy('A cabin suitcase','Card'); await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); log('declined card:', await last(1)); await full('declined');
  log('declined money unchanged', JSON.stringify(await money())===JSON.stringify(m0));
  await buy('A cabin suitcase','Points'); await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); log('declined, points only:', await last(1));
  await nav(5); await p.locator('.app-demo [role=switch]').nth(2).click();
  // price rise
  await p.locator('.app-demo [role=switch]').nth(0).click(); await nav(3);
  const m2=await money();
  await buy('Leather trainers','Points and card'); log('checkout', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g,' / ').slice(-260)); await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(500); log('sheet on price rise?', await p.locator('.app-sheet').count()); if(await p.locator('.app-sheet').count()) await h.faceConfirm();
  log('price rise:', await last(1)); await full('rise'); log('money unchanged', JSON.stringify(await money())===JSON.stringify(m2));
  await click(/^Continue at/); await full('rise-reopen'); log('reopen:', (await p.locator('.gr-answer').last().innerText()).replace(/\n/g,' / ').slice(0,500));
  await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); log('after rise pay:', await last(1)); log(JSON.stringify(await money()));
  // demo buttons
  await nav(5); const pts0=(await st()).balance; await click('Points come in (+5,000)'); log('points in', (await st()).balance-pts0, await last(1));
  const c0=(await st()).card.balance; await nav(5); await click('A card payment'); log('card payment', (await st()).card.balance-c0, await last(1));
  await nav(5); await click('Delay my order'); log('delay', await last(1));
  await nav(5); await click('Deliver my order'); log('deliver', await last(1));
  await nav(5); await click('Return window ends'); log('return window', await last(1));
  await nav(5); await click('Suspicious payment'); log('suspicious', await last(1)); log('frozen?', (await st()).card.frozen);
  await nav(5); await click('Cancel my next flight'); log('cancel flight w/ none', await last(1));
  await nav(5); await full('me-after');
  await nav(5); await click('Reset demo'); await p.waitForTimeout(500); log('after reset', JSON.stringify(await money()), 'chat len', (await st()).chat.length);
  await full('reset');
});
