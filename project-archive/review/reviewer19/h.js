// Helper: node scen.js ; require('./h.js')(market, theme, async (h)=>{...}, {ai:false, name})
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
module.exports = async function (market, fn, o = {}) {
  const name = o.name || 'x', theme = o.theme || 'light'
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (o.ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  if (o.init) await ctx.addInitScript(o.init);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${__dirname}/build/test.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url(o.q || '')); if (!o.keep) { await p.evaluate(() => localStorage.clear()); await p.goto(url(o.q || '')) } await p.waitForTimeout(500);
  let n = 0;
  const log = (...a) => { console.log(...a) }
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + (new URLSearchParams(location.search).get('m')))))
  const last = async () => { const s = await st(); const m = s.chat[s.chat.length - 1]; return m }
  const lastText = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText : '' })
  const shot = async (nm) => { await p.waitForTimeout(350); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2, '0')}-${nm}.png` }) }
  const full = async (nm) => { await p.waitForTimeout(350); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1300 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2, '0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }); return } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2, '0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 600) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w); const tx = await lastText(); log('>> ' + t + '\n' + tx.replace(/\n+/g, ' | ').slice(0, o.len || 700)); return tx };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click({ timeout: 5000 }); await p.waitForTimeout(400) };
  const sheet = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\n+/g, ' | ') : null }
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('NO SHEET'); return false } log('SHEET: ' + (await sheet()).slice(0, 400)); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('SHEET STUCK')); await p.waitForTimeout(500); return true };
  const ans = () => p.locator('.gr-answer').last()
  const h = { p, ctx, shot, full, nav, ask, click, confirm, sheet, st, last, lastText, log, ans, errs, url }
  try { await fn(h) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n').slice(0, 3).join(' ')); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => [])
  if (errs.length || e2.length) log('ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500))
  await b.close()
}
