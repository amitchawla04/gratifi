const run=require('./h.js');
run(`sens`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const sheet=async()=> (await p.$('.app-sheet')) ? (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' ') : 'NO SHEET';
  await nav(3); await ask('What do I owe?'); await click('Set up Direct Debit'); await p.waitForTimeout(400); log('DD', await lastText(), '|', await sheet());
  if (await p.$('.app-sheet')) { await p.keyboard.press('Escape') } else { const b=last().locator('.gr-btn').last(); log('dd btn', await b.innerText()); await b.click(); await p.waitForTimeout(400); log('DD sheet', await sheet()); await p.keyboard.press('Escape') }
  let s=await st(); log('autopay', s.card.autopay);
  await ask('What do I owe?'); await last().getByRole('radio',{name:/Another amount/}).click().catch(e=>log('no radio')); await p.waitForTimeout(200);
  const inp=last().locator('input'); log('amount inputs', await inp.count()); if (await inp.count()) { await inp.first().fill('1000'); await p.waitForTimeout(200); log('over', (await lastText()).slice(-200)); await inp.first().fill('50.5'); await p.waitForTimeout(200); log('50.5', (await lastText()).slice(-120)); }
  await ask('Start a streaming subscription'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await last().getByText('Card',{exact:true}).click(); await click(/^Pay /); await confirm();
  await ask('pause my subscription'); log('P', await lastText()); 
  await ask('resume my subscription'); log('R', await lastText(), '|', await sheet());
  if (await p.$('.app-sheet')) await confirm(); log('R2', await lastText());
  await ask('cancel my subscription'); log('C', await lastText());
  await nav(5); await click('Freeze'); await p.waitForTimeout(400); log('ME freeze', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,300)); s=await st(); log('frozen', s.card.frozen);
  await nav(3); log('chat after freeze', await lastText());
});
