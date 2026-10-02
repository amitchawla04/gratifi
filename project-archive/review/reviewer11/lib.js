const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
module.exports = async function run(market, name, fn, opts = {}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${__dirname}/build/test.html?m=${market}&theme=${opts.theme || 'light'}${x}`;
  await p.goto(url()); if (!opts.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  if (opts.zoom) await p.evaluate(z => document.documentElement.style.fontSize = z, opts.zoom);
  let n = 0;
  const H = { p, errs, market, url,
    shot: async (nm) => { await p.waitForTimeout(300); await p.screenshot({ path: `shots/${market}-${name}-${String(++n).padStart(2, '0')}-${nm}.png` }) },
    full: async (nm) => { await p.waitForTimeout(350); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(4000, h + 200) }); await p.waitForTimeout(300); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight); await p.waitForTimeout(200); await p.screenshot({ path: `shots/${market}-${name}-${String(++n).padStart(2, '0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }) },
    tail: async (nm) => { await p.waitForTimeout(350); await p.setViewportSize({ width: 420, height: 1400 }); const el = await p.$('.app-main .app-scroll'); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight); await p.waitForTimeout(300); await p.screenshot({ path: `shots/${market}-${name}-${String(++n).padStart(2, '0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }) },
    nav: async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) },
    ask: async (t) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(500) },
    btn: async (name, o = {}) => { const l = p.getByRole('button', { name, exact: !!o.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400) },
    last: () => p.locator('.gr-answer').last(),
    text: async () => (await p.locator('.gr-answer').last().innerText()).replace(/\s+/g, ' '),
    st: async () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m')))),
    sheet: async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\s+/g, ' ') : null },
    faceid: async () => { const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400) },
    page: async () => (await p.locator('.app-main').innerText()).replace(/\s+/g, ' '),
    buttons: async () => (await p.locator('.gr-answer').last().getByRole('button').allInnerTexts()).map(x => x.replace(/\s+/g, ' ')),
  };
  try { await fn(H) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await H.shot('fail') }
  console.log(market, name, errs.length ? 'ERRORS: ' + errs.join(' | ').slice(0, 1500) : 'clean');
  await b.close();
}
