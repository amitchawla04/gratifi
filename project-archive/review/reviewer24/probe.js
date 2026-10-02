// node probe.js <market> <stepsfile.js> [ai] [theme]
// steps file exports async function(h)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const market = process.argv[2] || 'UK', file = process.argv[3], ai = process.argv[4] === 'ai', theme = process.argv[5] || 'light';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${__dirname}/build/test.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url('&tab=chat')); await p.waitForTimeout(600);
  const tag = require('path').basename(file, '.js') + (ai ? '-ai' : '') + '-' + market;
  let n = 0;
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const last = async (k = 1) => { const s = await st(); const ms = s.chat.slice(-k); return ms.map(m => `[${m.role}] ${m.text || ''} {${(m.blocks || []).map(b => b.kind).join(',')}}`).join('\n') };
  const log = (...a) => console.log(...a);
  const shot = async (name) => { await p.waitForTimeout(350); await p.screenshot({ path: `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png` }) };
  const full = async (name) => { await p.waitForTimeout(350); await p.setViewportSize({ width: 420, height: 1100 }); await p.waitForTimeout(150); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); await p.screenshot({ path: `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const long = async (name) => { await p.waitForTimeout(300); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(7000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, wait = 700) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } if (!(await p.$('.gr-ask input'))) await nav(3); await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(wait); for (let i = 0; i < 20; i++) { const busy = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const m = s.chat[s.chat.length - 1]; return m && m.thinking }); if (!busy) break; await p.waitForTimeout(250) } };
  const say = async (t, wait) => { await ask(t, wait); log('> ' + t + '\n  ' + (await last(1)).replace(/\n/g, '\n  ')) };
  const click = async (text, opt = {}) => { if (market === 'AR' && typeof text === 'string' && !opt.raw) text = await p.evaluate(t => window.__tr ? window.__tr(t) : t, text); const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(450) };
  const sheet = async () => p.evaluate(() => { const s = document.querySelector('.app-sheet'); return s ? s.innerText.replace(/\s+/g, ' ').slice(0, 900) : null });
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('  (no sheet)'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const bb = p.locator('.app-sheet .gr-btn'); if (await bb.count()) await bb.last().click({ timeout: 5000 }).catch(() => log('  (sheet button not clickable)')); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('  SHEET STUCK')); await p.waitForTimeout(450); return true };
  const text = async (sel = '.app-main') => p.evaluate(s => (document.querySelector(s) || document.body).innerText, sel);
  const lastAnswer = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText.replace(/\n+/g, ' | ').slice(0, 1500) : '' });
  const setPlan = async (fnSrc) => p.evaluate(src => { window.__plan = eval(src) }, fnSrc);
  const res = async () => p.evaluate(() => JSON.stringify(window.__res || [], (k, v) => k === 'data' ? undefined : v).slice(0, 2500));
  const h = { p, ctx, st, last, log, shot, full, long, nav, ask, say, click, confirm, sheet, text, lastAnswer, setPlan, res, market, errs, url };
  try { await require(require('path').resolve(file))(h) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n').slice(0, 3).join(' ')); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  if (errs.length || e2.length) log('ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500));
  await b.close();
})();
