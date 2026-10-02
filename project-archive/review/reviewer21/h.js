// node h.js <steps.js> [market] [theme] [ai=0|1]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const stepsFile = process.argv[2], market = process.argv[3] || 'UK', theme = process.argv[4] || 'light', ai = process.argv[5] === '1';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const base = `file://${__dirname}/build/test.html`;
  const url = (x = '') => `${base}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  const tag = require('path').basename(stepsFile, '.js') + '-' + market + (ai ? '-ai' : '') + (theme === 'dark' ? '-dark' : '');
  let n = 0;
  const log = (...a) => console.log(...a);
  const shot = async (name, full = false) => { await p.waitForTimeout(300); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f, fullPage: false }); return f };
  // shot of last answer, full height
  const ans = async (name, k = 1) => { await p.waitForTimeout(400); const h0 = await p.evaluate(() => document.querySelector('.app-main .app-scroll')?.scrollHeight || 880); await p.setViewportSize({ width: 420, height: Math.min(4000, h0 + 300) }); await p.waitForTimeout(300); const loc = p.locator('.gr-answer'); const c = await loc.count(); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; if (c) { try { await loc.nth(Math.max(0, c - k)).screenshot({ path: f }) } catch (e) { await p.screenshot({ path: f }) } } else await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const page = async (name) => { await p.waitForTimeout(300); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const lastText = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText.replace(/\n+/g, ' | ') : '' });
  const btn = (name, exact = false) => p.getByRole('button', { name, exact }).last();
  const click = async (name, exact = false) => { const l = btn(name, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(450) };
  const inAns = (sel) => p.locator('.gr-answer').last().locator(sel);
  const sheetText = async () => p.evaluate(() => document.querySelector('.app-sheet')?.innerText.replace(/\n+/g, ' | ') || 'NO SHEET');
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('  (no sheet)'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('  SHEET STUCK')); await p.waitForTimeout(400); return true };
  const st = async () => p.evaluate((m) => JSON.parse(localStorage.getItem('gratifi-state-v3-' + m) || 'null'), market);
  const money = async () => { const s = await st(); return s ? { pts: s.balance, card: s.card.balance, due: s.card.due, min: s.card.min, avail: s.card.available, limit: s.card.limit } : null };
  const H = { p, b, ctx, shot, ans, page, nav, ask, lastText, btn, click, inAns, sheetText, confirm, st, money, log, errs, url, market };
  try { await require(require('path').resolve(stepsFile))(H) } catch (e) { log('SCRIPT ERROR ' + e.message.split('\n').slice(0, 3).join(' ')); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  if (errs.length || e2.length) log('ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500));
  await b.close();
})();
