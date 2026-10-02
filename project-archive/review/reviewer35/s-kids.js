const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'kids' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('Flights to Paris on 14 Oct back 18 Oct for me, my wife, our 6 year old and a 1 year old', 900); log('RES', (await lastText()).slice(0, 400));
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/); await full('seats'); log('SEATS', await lastText());
    const ins = p.locator('.gr-answer').last().locator('input'); const n = await ins.count(); const types = []; for (let i = 0; i < n; i++) types.push(await ins.nth(i).getAttribute('type') + ':' + await ins.nth(i).getAttribute('placeholder') + ':' + await ins.nth(i).getAttribute('aria-label')); log('INPUTS', JSON.stringify(types));
    // try exit row seat for child: click a seat in row 14 (legroom)
    const seats = p.locator('.gr-answer').last().locator('.gr-seat'); log('seat count', await seats.count());
    await full('before');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
