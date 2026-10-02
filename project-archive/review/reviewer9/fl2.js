const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-fl2' }); const { p, ask, btn, shot, st, last } = h;
  await h.nav(3); await ask('flights to Lisbon on 10 Oct back 11 Oct');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/); await btn('Continue', { exact: true }); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await h.nav(5); await btn('Cancel my next flight'); await h.nav(3); console.log('DISR:', (await last()).slice(0, 500)); await shot('disr');
  await btn('Next flight', { exact: true }).catch(e => console.log('no next btn')); console.log('R:', (await last()).slice(0, 400)); await shot('reb');
  // second disruption: return
  await h.nav(5); await btn('Cancel my next flight'); await h.nav(3); console.log('DISR2:', (await last()).slice(0, 500)); await shot('disr2');
  // light fare booking
  await ask('flights to Paris on 20 Oct'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().locator('[role=radio]').first().click(); await p.waitForTimeout(200); await btn(/Continue with/); await shot('light-seats'); console.log('LIGHT:', (await last()).slice(0, 400));
  await btn('Continue', { exact: true }).catch(() => {}); console.log((await last()).slice(0, 300)); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await ask('cancel my paris flight'); console.log('LCX:', (await last()).slice(0, 300));
  await ask('change my paris flight'); console.log('LCH:', (await last()).slice(0, 300));
  console.log('ERR', await h.done());
})();
