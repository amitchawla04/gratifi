const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`retwin-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h; p.setDefaultTimeout(5000);
  await nav(3); await ask('Rain shell jacket'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-chip').nth(1).click(); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await last().locator('[role=radio]').last().click(); await btn(/^Pay /); await confirm();
  log('receipt', (await lastText()).slice(0, 400));
  let s = await state(); log('S1', s.balance, s.card.balance, JSON.stringify(s.pending || s.pendingPts || ''));
  await nav(5); log('me pts', (await p.locator('.app-main').innerText()).match(/Points[\s\S]{0,300}/)?.[0].replace(/\n/g, ' | '));
  await btn('Deliver my order'); await nav(5); await btn('Return window ends'); log('retwin', (await lastText()).slice(0, 300));
  s = await state(); log('S2', s.balance);
  await ask('return my jacket'); log('ret', (await lastText()).slice(0, 300));
}, {});
