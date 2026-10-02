const H=require('./h.js');
H('MY','s8', async (h)=>{ const {p,shot,full,nav,ask,click,st,money,log,last,lastText}=h;
  await nav(3); await ask('What do I owe?'); log(await lastText());
  await click('Another amount').catch(e=>log('no Another amount')); await p.waitForTimeout(300); await full('custom');
  const inp = p.locator('.gr-answer').last().locator('input'); log('inputs', await inp.count());
  if(await inp.count()){ await inp.last().fill('0'); log('zero:', await lastText()); await inp.last().fill('99999'); log('too much:', (await lastText()).slice(-200)); await inp.last().fill('123.45'); log('ok:', (await lastText()).slice(-200)); }
  const payb = p.getByRole('button',{name:/^Pay /}).last(); log('pay btn', await payb.innerText(), await payb.isDisabled());
  await payb.click(); await p.waitForTimeout(400); await shot('sheet'); log('sheet', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '));
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(900); await shot('waiting'); log('waiting', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '));
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000); log('after esc during wait', JSON.stringify(await money()), await last(2));
  await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); log('paid', await last(2)); log(JSON.stringify((await st()).card));
  // direct debit
  await ask('set up a direct debit'); log('dd', await lastText()); await full('dd');
  const ddb = p.locator('.gr-answer').last().getByRole('button',{name:/direct debit|Direct Debit|auto/i}); log('dd buttons', await p.locator('.gr-answer').last().locator('button').allInnerTexts());
  // controls on again
  await ask('turn off payments abroad'); await ask('turn on payments abroad'); log('abroad on ask', await last(1), 'sheet?', await p.locator('.app-sheet').count()); if(await p.locator('.app-sheet').count()) await h.faceConfirm(); log(await last(1));
  // subscriptions paid: start, pause, resume
  await ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await full('sub-checkout'); log('sub checkout', (await lastText()).slice(0,400));
  await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); log(await last(1));
  await ask('pause Screenly'); log(await last(1)); await ask('resume Screenly'); log('resume', await last(1), 'sheet', await p.locator('.app-sheet').count()); if(await p.locator('.app-sheet').count()){ await shot('resume-sheet'); await h.faceConfirm(); } log(await last(1));
  await ask('cancel Screenly'); log(await lastText()); await click('Yes, cancel').catch(()=>click(/Turn off|Cancel/)); log(await last(1));
  log(JSON.stringify(await money()));
});
