const L = require('./lib.js');
const m = process.argv[2] || 'UK';
(async () => {
  const h = await L(m, { tag: 'big' }); const { p, ask, last, btn, shot, nav } = h;
  await p.addStyleTag({ content: 'html{font-size:200% !important}' });
  const ov = async (tag) => { const r = await p.evaluate(() => { const W = document.documentElement.clientWidth; const bad = [...document.querySelectorAll('.app-main *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > W + 2 || r.left < -2) && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"], .gr-hscroll, .gr-scroll-x') }).slice(0, 6).map(e => e.className + ':' + (e.innerText || '').slice(0, 30)); return { sw: document.documentElement.scrollWidth, W, bad } }); console.log(tag, JSON.stringify(r)) };
  await nav(1); await shot('home'); await ov('home');
  await nav(3); await ask('Flights to Lisbon next weekend for two', 900); await shot('flights'); await ov('flights');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(600); await shot('fares'); await ov('fares');
  await nav(5); await shot('me'); await ov('me');
  await nav(4); await shot('wallet');
  await nav(3); await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await shot('detail'); await ov('detail');
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); await shot('checkout'); await ov('checkout');
  await btn(/^Pay |^ادفع /); await p.waitForTimeout(400); await shot('sheet');
  console.log('ERRS', h.errs); await h.b.close();
})();
