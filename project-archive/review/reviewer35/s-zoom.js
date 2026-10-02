const { open } = require('./h.js');
(async () => {
  const [market = 'UK'] = process.argv.slice(2);
  const h = await open({ market, tag: 'zoom', zoom: 2 });
  const { p, full, nav, ask, click, log, errs, shot } = h;
  const ov = async (l) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width && (b.right > W + 1 || b.left < -1) && getComputedStyle(e).position !== 'fixed') { const sc = e.closest('[class*=scroll],[class*=rail],[class*=row],.gr-days,.gr-chips'); if (!sc || sc === e) bad.push((e.className || e.tagName) + ':' + Math.round(b.right)) } }); return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 8) } }); log(l, JSON.stringify(r)) };
  try {
    await nav(1); await full('home'); await ov('home');
    await nav(5); await full('me'); await ov('me');
    await nav(3); await ask('Flights to Lisbon next weekend for two', 900); await full('flights'); await ov('flights');
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await full('fares'); await ov('fares');
    await click(/Continue with/); await full('seats'); await ov('seats');
    const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
    await click('Continue', { exact: true }); await full('checkout'); await ov('checkout');
    await click(/^Pay /); await shot('sheet');
    await p.keyboard.press('Escape');
    await ask('A table tonight for two'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await full('dining'); await ov('dining');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
