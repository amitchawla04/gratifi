// node r.js <scenario.js> <market> [theme] [ai=1] [tag]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const REV = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review';
const [scen, market = 'UK', theme = 'light', ai = '0', tag = ''] = process.argv.slice(2);
const TAG = (tag || require('path').basename(scen, '.js')) + '-' + market + (theme === 'dark' ? '-dk' : '') + (ai === '1' ? '-ai' : '');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (ai === '1') await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${REV}/test.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(700);
  let n = 0; const log = (...a) => console.log('>>', ...a);
  const shot = async (name) => { await p.waitForTimeout(350); const f = `shots/${TAG}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: __dirname + '/' + f }); return f };
  const full = async (name) => { await p.waitForTimeout(400); const el = await p.$('.app-main .app-scroll'); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1300 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); const f = await shot(name); await p.setViewportSize({ width: 420, height: 880 }); return f } const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); const f = await shot(name); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w); for (let i = 0; i < 20 && await p.$('.gr-thinking, [aria-busy=true]'); i++) await p.waitForTimeout(200) };
  const last = async () => (await p.locator('.gr-answer').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
  const say = async (t, w) => { await ask(t, w); const x = await last(); console.log(`\n[${t}] => ${x.slice(0, 700)}`); return x };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(450) };
  const sheet = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\n+/g, ' | ') : null };
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return false } const txt = await sheet(); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(450); return txt };
  const state = async () => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('gratifi-state')) || '{}')));
  const plan = async (fnSrc) => p.evaluate(s => { window.__plan = eval(s) }, fnSrc);
  const res = async () => p.evaluate(() => JSON.parse(JSON.stringify(window.__res || [], (k, v) => k === 'r' && v && v.data ? { ...v, data: '[data]' } : v)));
  const H = { p, shot, full, nav, ask, say, last, click, confirm, sheet, state, plan, res, errs, log, market, url };
  try { await require(require('path').resolve(scen))(H) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  console.log('\n##', TAG, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500) : 'clean');
  await b.close();
})();
