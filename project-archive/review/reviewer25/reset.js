const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`reset-${m}`, m, async h => {
  const { p, btn, log, nav, state, shot } = h; p.setDefaultTimeout(5000);
  await nav(5); await btn(/Points come in/); await nav(5); await btn(/A card payment/); await nav(5);
  let s = await state(); log('before', s.balance, s.card.balance);
  const r = p.getByRole('button', { name: 'Reset demo' }); log('count', await r.count());
  await r.last().scrollIntoViewIfNeeded(); await r.last().click(); await p.waitForTimeout(800); await shot('after-reset-click');
  log('tab', await p.evaluate(() => document.querySelector('.app')?.dataset.tab), (await p.locator('.app-main').innerText()).slice(-300).replace(/\n/g, ' | '));
  s = await state(); log('after', s?.balance, s?.card?.balance, Object.keys(await p.evaluate(() => ({ ...localStorage }))));
  await p.reload(); await p.waitForTimeout(800); s = await state(); log('after reload', s?.balance, s?.card?.balance);
}, {});
