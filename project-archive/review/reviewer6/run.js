// node run.js <market> <stepsfile> [theme] [clear=1]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const market = process.argv[2] || 'UK', file = process.argv[3], theme = process.argv[4] || 'light';
const tag = require('path').basename(file, '.js') + '-' + market + (theme === 'dark' ? '-dark' : '');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const base = 'file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
  const url = (x = '', page = 'test.html') => `${base}${page}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url('&tab=chat')); await p.waitForTimeout(500);
  let n = 0;
  const shot = async (name, fullp) => { await p.waitForTimeout(350); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; if (fullp) { const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }) } else { await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e && document.querySelector('.app[data-tab=chat]')) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(200); await p.screenshot({ path: f }) } };
  const tall = async (name) => { await p.setViewportSize({ width: 420, height: 1400 }); await p.waitForTimeout(200); await shot(name); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('gratifi-state')))));
  const last = async () => { const s = await state(); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind), steps: m.steps } };
  const log = (...a) => console.log(...a);
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w); const l = await last(); log(`> ${t}\n  < ${l.text} [${l.kinds.join(',')}]`); return l };
  const btn = (name, exact) => p.getByRole('button', { name, exact: !!exact }).last();
  const click = async (name, exact) => { const l = btn(name, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(500) };
  const lastAns = () => p.locator('.gr-answer').last();
  const text = () => p.evaluate(() => document.querySelector('.app-main').innerText);
  const bal = async () => { const s = await state(); return { pts: s.balance, card: s.card.balance, due: s.card.due } };
  const sheet = async () => p.$('.app-sheet');
  const otp = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); };
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('  !! no sheet'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) await otp(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 12000 }).catch(() => log('  !! sheet stuck')); await p.waitForTimeout(500); return true };
  const h = { p, shot, tall, nav, ask, click, btn, lastAns, text, bal, state, last, log, confirm, sheet, otp, url, errs, market };
  try { await require(require('path').resolve(file))(h) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n').slice(0,3).join(' ')); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []);
  log(tag, (errs.length || e2.length) ? 'ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500) : 'clean');
  await b.close();
})();
