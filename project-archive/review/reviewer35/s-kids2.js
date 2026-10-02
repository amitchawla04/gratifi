const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'kids2' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('Flights to Paris on 14 Oct back 18 Oct for me, my wife, our 6 year old and a 1 year old', 900);
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/);
    const snap = await p.locator('.gr-answer').last().ariaSnapshot(); log('ARIA', snap.slice(0, 3000));
    const ins = p.locator('.gr-answer').last().locator('input');
    await ins.nth(0).fill('Amit Chawla'); await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla'); await ins.nth(3).fill('2024-01-10'); await ins.nth(4).fill('Mira Chawla'); await ins.nth(5).fill('2025-11-20');
    await p.waitForTimeout(300); await full('dob-wrong'); log('DOB child 2 yrs', (await lastText()).slice(-500));
    await ins.nth(3).fill('2020-05-10'); await ins.nth(5).fill('2024-09-01'); await p.waitForTimeout(300); log('infant turns 2 before return?', (await lastText()).slice(-500));
    await ins.nth(5).fill('2026-12-01'); await p.waitForTimeout(300); log('infant future dob', (await lastText()).slice(-400));
    await ins.nth(5).fill('2025-11-20'); await p.waitForTimeout(300);
    // exit row for child seat: select Child chip then click row 14 seat
    await p.locator('.gr-answer').last().getByRole('button', { name: /Child 1/ }).first().click(); await p.waitForTimeout(200);
    const s14 = p.locator('.gr-answer').last().locator('.gr-seat[aria-label*="14A"], .gr-seat[aria-label*="14 A"]'); log('14A found', await s14.count());
    const labels = await p.locator('.gr-answer').last().locator('.gr-seat').evaluateAll(es => es.slice(0, 40).map(e => e.getAttribute('aria-label') + (e.disabled ? '(dis)' : '')));
    log('seat labels', JSON.stringify(labels));
    await full('kids-seat');
    await click('Continue', { exact: true }); await full('checkout'); log('CHECKOUT', await lastText());
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
