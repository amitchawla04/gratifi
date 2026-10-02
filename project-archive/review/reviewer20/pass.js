const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'pass', h: 1100 }); const { p, st, ask, last, btn, confirm, text, shot, nav } = h;
  await ask('one way to Paris tomorrow morning'); console.log((await text()).slice(0, 200));
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/^Continue with/);
  await btn('Continue', null, true); await btn(/^Pay /); await confirm(); console.log('R:', (await text()).slice(0, 300));
  await nav(4); await btn(/Boarding pass/); await p.waitForTimeout(500); await shot('wallet');
  console.log('W:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 600));
  // change time of flight to another airline
  await nav(3); await ask('move my flight to the evening'); console.log('CH:', (await text()).slice(0, 500)); await shot('change');
  await h.b.close();
})();
