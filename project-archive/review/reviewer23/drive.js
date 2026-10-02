// Usage: node drive.js <market> <script> [theme]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const market = process.argv[2] || 'UK', script = process.argv[3] || 'tabs', theme = process.argv[4] || 'light';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${__dirname}/../gratifi/review/test.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  let n = 0; const shot = async (name) => { await p.waitForTimeout(350); await p.screenshot({ path: `shots/${market}-${script}-${String(++n).padStart(2, '0')}-${name}.png` }) };
  const full = async (name) => { await p.waitForTimeout(350); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1100 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(700); await p.screenshot({ path: `shots/${market}-${script}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }); return } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: `shots/${market}-${script}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(600) };
  const RX = { '^Pay ': '^ادفع ', 'Show pass|Boarding pass': 'اعرض التصريح|بطاقة الصعود', 'Continue with': 'تابع بالدرجة', 'from my bank account': 'من حسابي البنكي', '^Continue at': '^تابع بسعر' };
  const click = async (textIn, opt = {}) => { let text = textIn; if (market === 'AR') { if (typeof text === 'string') text = await p.evaluate(t => window.__tr(t), text); else { const src = RX[text.source]; if (src) text = new RegExp(src) } } const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400) };
  const confirm = async () => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { const st = await p.$('.gr-state'); if (!st) errs.push('NO SHEET'); return } await shot('sheet'); const otp = await p.$('.app-sheet input'); if (otp) { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('482193'[i]) } else await otp.fill('482193') } const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400) };
  const S = require('./scripts.js');
  try { await S[script]({ p, shot, full, nav, ask, click, confirm, errs }) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []);
  if (market === 'AR') { const miss = await p.evaluate(() => [...(window.__missing || [])]); require('fs').appendFileSync(__dirname + '/missing.txt', miss.join('\n') + '\n') }
  console.log(market, script, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500) : 'clean');
  await b.close();
})();
