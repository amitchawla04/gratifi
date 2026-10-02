const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-demo' }); const { p, ask, btn, shot, st, sheetText, last } = h;
  const sum = async (l) => { const s = await st(); console.log(l, 'pts', s.balance, 'card', s.card.balance, 'bk', s.bookings.map(b => b.title.slice(0, 18) + ':' + b.status).join('|'), 'pend', JSON.stringify(s.pending || []), 'chl', s.challenges.map(c => c.progress + '/' + c.target + (c.done ? 'D' : '')).join(',')) };
  await h.nav(5);
  await h.nav(5); await btn('Points come in (+5,000)'); await sum('pts in'); await shot('me-after-pts', true);
  await btn('A card payment'); await sum('card pay'); 
  await h.nav(3); await shot('chat-after-demo'); console.log('LAST:', (await last()).slice(0, 300));
  // affiliate
  await ask('Earn extra points shopping'); console.log('AFF:', (await last()).slice(0, 300));
  await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await shot('aff-detail');
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await shot('aff-opened');
  await btn(/I bought something there/); await shot('aff-bought'); console.log('AFFB:', (await last()).slice(0, 300)); await sum('aff');
  await h.nav(5); await shot('me-pending', true); await btn('Return window ends'); await sum('ret window'); await h.nav(3); await shot('after-window'); console.log('RW:', (await last()).slice(0, 300));
  // supplier down: try pay, cancel, transfer
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2600); await sum('bought hp');
  await h.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(200); await h.nav(3);
  await ask('cancel my headphones'); await btn('Yes, cancel'); console.log('CANCEL w/ supplier down:', (await last()).slice(0, 300)); await sum('sd cancel');
  await ask('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.app-in').nth(0).fill('Sam'); await p.locator('.gr-answer').last().locator('.app-in').nth(1).fill('sam@example.com'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await btn(/^Pay /); console.log('SHEET?', !!(await sheetText())); if (await sheetText()) { await btn(/Face ID/, { w: 2500 }) } await p.waitForTimeout(1000); console.log('PAY w/ supplier down:', (await last()).slice(0, 300)); await sum('sd pay');
  await ask('donate 500 points to Clean Seas'); if (await sheetText()) await btn(/Face ID|Confirm/, { w: 2500 }); await p.waitForTimeout(1000); console.log('DONATE w/ supplier down:', (await last()).slice(0, 300)); await sum('sd donate');
  await ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn('Confirm'); console.log('FREE LOUNGE w/ supplier down:', (await last()).slice(0, 300)); await sum('sd lounge');
  await ask('A table tonight for two'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn('Book the table'); console.log('TABLE w/ supplier down:', (await last()).slice(0, 300)); await sum('sd table');
  await ask('transfer 5000 points to Northway Miles'); console.log('TR:', (await last()).slice(0, 200));
  await h.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(200);
  await btn('Suspicious payment'); await h.nav(3); await shot('susp'); await btn("It wasn't me"); await shot('notme'); console.log('NOTME:', (await last()).slice(0, 300)); await sum('notme');
  await h.nav(5); await btn('Reset demo'); await p.waitForTimeout(400); await sum('reset'); await h.nav(3); await shot('after-reset');
  console.log('ERR', await h.done());
})();
