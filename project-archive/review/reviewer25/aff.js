const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`aff-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h; p.setDefaultTimeout(5000);
  await nav(3); await ask('Earn extra points shopping'); log('A', (await lastText()).slice(0, 400));
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); log('B', (await lastText()).slice(0, 400)); log('btns', await last().locator('button').allInnerTexts());
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('C', (await lastText()).slice(0, 400));
  await nav(5); await btn(/A card payment/); log('D', (await lastText()).slice(0, 300));
  await nav(5); await btn('Return window ends'); log('E', (await lastText()).slice(0, 300)); const s = await state(); log('bal', s.balance);
  await nav(4); log('wallet', (await p.locator('.app-main').innerText()).slice(0, 300).replace(/\n/g, ' | '));
}, {});
