const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'gam' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  await ask('block gambling'); await btn(/Block gambling payments/); await p.waitForTimeout(400); console.log('S1', await sheetText()); if (await sheetText()) await confirm(); console.log('T1', (await text()).slice(0, 300));
  await ask('lift the gambling block'); console.log('T2', (await text()).slice(0, 300)); console.log('S2', await sheetText()); if (await sheetText()) console.log(await confirm()); console.log('T2b', (await text()).slice(0, 300));
  await nav(5); await shot('me'); console.log('ME:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 500));
  const keep = p.getByRole('button', { name: /Keep the block/ }); console.log('keep btn', await keep.count()); if (await keep.count()) { await keep.first().click(); await p.waitForTimeout(500); console.log('S3', await sheetText()); if (await sheetText()) await confirm() }
  console.log('ME2:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 400));
  await nav(3); await ask('unblock gambling right now please'); console.log('T4', (await text()).slice(0, 300)); console.log('S4', await sheetText());
  const s = await st(); console.log(JSON.stringify(s.card).slice(0, 400));
  console.log(h.errs); await h.b.close();
})();
