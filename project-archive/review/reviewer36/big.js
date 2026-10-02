const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m = process.argv[2] || 'UK', theme = process.argv[3] || 'light', zoom = process.argv[4] || '100';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const go = async (tab) => { await p.goto(`file://${__dirname}/build/test.html?m=${m}&theme=${theme}&tab=${tab}`); await p.waitForTimeout(500); await p.evaluate(z => { document.documentElement.style.fontSize = z + '%' }, zoom); await p.waitForTimeout(300) };
  await p.goto(`file://${__dirname}/build/test.html?m=${m}`); await p.evaluate(() => localStorage.clear());
  const tag = `${m}-${theme}-${zoom}`; let n = 0
  const shot = async (nm) => { const ov = await p.evaluate(() => { const r = []; document.querySelectorAll('.app *').forEach(e => { const b = e.getBoundingClientRect(); if (b.right > innerWidth + 2 && b.width > 0 && getComputedStyle(e).position !== 'fixed' && !e.closest('[style*="overflow"], .gr-hscroll, .gr-row, .app-scroll-x')) r.push(e.className + ':' + Math.round(b.right)) }); return [document.documentElement.scrollWidth, r.slice(0, 6)] }); console.log(tag, nm, 'scrollW', ov[0], ov[1].join(' ')); await p.screenshot({ path: `shots/z-${tag}-${String(++n).padStart(2, '0')}-${nm}.png` }) }
  for (const t of ['home', 'explore', 'wallet', 'me']) { await go(t); await shot(t) }
  await go('chat')
  const ask = async (t) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(700); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(300) }
  await ask(m === 'AR' ? 'رحلات إلى مسقط لشخصين' : 'Flights to Lisbon next weekend for two'); await shot('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await shot('fares')
  await ask(m === 'AR' ? 'ادفع فاتورتي' : 'What do I owe?'); await shot('bill')
  await p.getByRole('button', { name: /^(Pay |ادفع )/ }).last().click(); await p.waitForTimeout(600); await shot('sheet')
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  await ask(m === 'AR' ? 'أريد أن أنهي حياتي' : 'I want to end my life'); await shot('crisis')
  console.log(tag, 'errs', errs.slice(0, 3)); await b.close()
})()
