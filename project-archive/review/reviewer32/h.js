// Usage: node h.js <scriptfile> <market> [theme] [ai=0|1] [tag]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const [scriptFile, market = 'UK', theme = 'light', ai = '0', tagIn] = process.argv.slice(2);
const tag = tagIn || path.basename(scriptFile, '.js');
const REV = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  if (ai === '1') await p.addInitScript({ path: __dirname + '/fake.js' });
  const file = ai === '1' ? 'test.html' : 'test.html';
  const url = (x = '') => `file://${REV}/${file}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(600);
  let n = 0; const out = [];
  const log = (...a) => { const s = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '); out.push(s); console.log(s); fs.appendFileSync(`logs/${tag}-${market}.live`, s + '\n') };
  const shot = async (name) => { await p.waitForTimeout(300); const f = `shots/${tag}-${market}${theme === 'dark' ? '-d' : ''}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); return f };
  const full = async (name) => { await p.waitForTimeout(300); const f = `shots/${tag}-${market}${theme === 'dark' ? '-d' : ''}-${String(++n).padStart(2, '0')}-${name}.png`; if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1300 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(opt.w || 400) };
  const sheetText = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\s+/g, ' ') : null };
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('NO SHEET'); return null } const t = await sheetText(); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('SHEET STUCK')); await p.waitForTimeout(400); return t };
  const last = async () => (await p.locator('.gr-answer').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const state = async () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))) || { balance: 0, card: {}, bookings: [], chat: [{}] });
  const lastMsg = async () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind) } });
  const plan = async (fnSrc) => p.evaluate(src => { window.__plan = eval(src) }, fnSrc);
  const h = { p, ctx, b, shot, full, nav, ask, click, confirm, last, state, lastMsg, log, errs, market, theme, url, sheetText, plan };
  try { await require(path.resolve(scriptFile))(h) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n')[0]); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  log('ERRS:', [...errs, ...e2].slice(0, 20));
  fs.writeFileSync(`logs/${tag}-${market}${theme === 'dark' ? '-d' : ''}.log`, out.join('\n'));
  await b.close();
})();
