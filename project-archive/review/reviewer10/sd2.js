const run=require('./h.js');
run(`sd2`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('Rain shell jacket'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await click(/^Pay /); await confirm();
  let s=await st(); log('bought bal', s.balance);
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3);
  await ask('cancel my jacket'); await click('Yes, cancel'); await p.waitForTimeout(400); log('CANCEL w/ supplier down', await lastText()); s=await st(); log('bal', s.balance, s.bookings[0].status);
  await ask('Freeze my card'); await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await nav(3);
  await ask('Leather trainers'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await last().getByText('Card',{exact:true}).click(); await click(/^Pay /); await p.waitForTimeout(400); log('sheet?', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await confirm(); log('FROZEN PAY', await lastText());
});
