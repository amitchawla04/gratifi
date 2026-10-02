const { run } = require('./lib.js');
const m = process.argv[2] || 'UK';
run('big-' + m, m, async (H) => {
  const { p } = H;
  const big = async () => { await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(300) };
  await big();
  const ovf = async (tag) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.width && (b.right > W + 1 || b.left < -1) && getComputedStyle(e).position !== 'fixed') { const sc = e.closest('.gr-slots, .gr-chips, .gr-hscroll, [style*="overflow"]'); if (!sc) bad.push((e.className || e.tagName) + ':' + (e.innerText || '').slice(0, 20).replace(/\n/g, ' ')) } }); return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 8) } }); H.log(tag, JSON.stringify(r)) };
  await H.full('home'); await ovf('home');
  await H.nav(3); await H.ask(m === 'AR' ? 'رحلات إلى مسقط نهاية الأسبوع القادم لشخصين' : 'Flights to Lisbon next weekend for two'); await H.full('results'); await ovf('results');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.full('fares'); await ovf('fares');
  await p.getByRole('button', { name: /Continue with|تابع بالدرجة/ }).last().click(); await p.waitForTimeout(400);
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await H.full('seats'); await ovf('seats');
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await H.full('checkout'); await ovf('checkout');
  await p.getByRole('button', { name: /^(Pay |ادفع )/ }).last().click(); await p.waitForTimeout(500); await H.shot('sheet'); await ovf('sheet');
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await H.nav(5); await H.full('me'); await ovf('me');
  await H.nav(4); await H.full('wallet'); await ovf('wallet');
  await H.nav(2); await H.full('explore'); await ovf('explore');
});
