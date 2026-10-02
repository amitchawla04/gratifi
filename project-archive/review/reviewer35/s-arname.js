const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'AR', tag: 'arname' });
  const { p, full, nav, ask, click, log, errs, shot, lastText } = h;
  try {
    await nav(3); await ask('رحلات إلى مسقط يوم 16 أكتوبر لشخصين', 900); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
    await p.getByRole('button', { name: /تابع بالدرجة/ }).last().click(); await p.waitForTimeout(500);
    const ins = p.locator('.gr-answer').last().locator('input.app-in'); await ins.nth(1).fill('سارة أحمد'); await p.waitForTimeout(300);
    const btn = p.locator('.gr-answer').last().locator('.gr-btn').last(); log('btn', await btn.innerText(), await btn.isEnabled()); await full('arname');
    await ins.nth(1).fill('Sara'); await p.waitForTimeout(200); log('single name', await btn.innerText(), await btn.isEnabled());
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
