// node rv.js <market> <script> [theme] [page]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const market = process.argv[2] || 'UK', script = process.argv[3], theme = process.argv[4] || 'light', page = process.argv[5] || 'test.html';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${__dirname}/build/${page}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  let n = 0; const tag = `${market}-${theme === 'dark' ? 'D-' : ''}${script}`;
  const shot = async (name) => { await p.waitForTimeout(350); await p.screenshot({ path: `shots/r-${tag}-${String(++n).padStart(2, '0')}-${name}.png` }) };
  const full = async (name) => { await p.waitForTimeout(350); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1100 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(600); await p.screenshot({ path: `shots/r-${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }); return } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: `shots/r-${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 600) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400) };
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const last = async () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const m = s.chat[s.chat.length - 1]; return (m.text || '') + ' [' + (m.blocks || []).map(b => b.kind).join(',') + ']' });
  const code = async (c) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(c[i]); };
  const sheetBtn = async () => { await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(500) };
  const confirm = async () => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return false } await shot('sheet'); if (market === 'IN') await code('482193'); await sheetBtn(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400); return true };
  const txt = async () => p.evaluate(() => document.querySelector('.app-main').innerText);
  const log = (...a) => console.log('  ', ...a);
  const S = require('./rvs.js');
  try { await S[script]({ p, shot, full, nav, ask, click, confirm, errs, st, last, code, sheetBtn, txt, log, url, market }) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  console.log(market, script, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500) : 'clean');
  await b.close();
})();
