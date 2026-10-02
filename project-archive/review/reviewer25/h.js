const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
const OUT = __dirname + '/shots/';
module.exports = async function run(name, market, fn, o = {}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1, locale: o.locale || 'en-GB' });
  if (o.ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = `file://${R}test.html?m=${market}&theme=${o.theme || 'light'}${o.q || ''}`;
  await p.goto(url); if (!o.keep) { await p.evaluate(() => localStorage.clear()); await p.goto(url); }
  await p.waitForTimeout(700);
  if (o.font) await p.addStyleTag({ content: `html{font-size:${o.font}% !important}` });
  let n = 0;
  const shot = async (t) => { await p.waitForTimeout(300); await p.screenshot({ path: `${OUT}${name}-${String(++n).padStart(2, '0')}-${t}.png` }) };
  const full = async (t) => { await p.waitForTimeout(350); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(7000, h + 200) }); await p.waitForTimeout(250); if (el) await el.evaluate(e => e.scrollTop = 0); await p.screenshot({ path: `${OUT}${name}-${String(++n).padStart(2, '0')}-${t}.png` }); await p.setViewportSize({ width: 420, height: 880 }); await p.waitForTimeout(100); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(350) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
  const btn = async (name, opt = {}) => { const l = p.getByRole('button', { name, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(o.wait || 450) };
  const sheetText = async () => (await p.locator('.app-sheet').innerText().catch(() => 'NO SHEET')).replace(/\n+/g, ' | ');
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return 'NO SHEET' } const txt = await sheetText(); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const bt = p.locator('.app-sheet .gr-btn').last(); await bt.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(450); return txt };
  const state = async () => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('gratifi-state')) || '{}')));
  const log = (...a) => console.log(`[${name}]`, ...a);
  const h = { p, shot, full, nav, ask, last, lastText, btn, confirm, sheetText, state, log, errs, url };
  try { await fn(h) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail').catch(() => { }) }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  console.log(`[${name}] END`, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500) : 'clean');
  await b.close();
}
module.exports.el = async (h, t) => { const l = h.p.locator('.gr-answer').last(); await h.p.setViewportSize({ width: 420, height: 3000 }); await h.p.waitForTimeout(250); try { await l.screenshot({ path: `${OUT}${t}.png` }) } catch (e) { } await h.p.setViewportSize({ width: 420, height: 880 }); };
