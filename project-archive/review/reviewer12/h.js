// Harness: node h.js <scenario.js> [market] [theme] [extra]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const scen = process.argv[2], market = process.argv[3] || 'UK', theme = process.argv[4] || 'light', extra = process.argv[5] || '';
const tag = require('path').basename(scen, '.js') + '-' + market + (theme !== 'light' ? '-' + theme : '');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const file = extra.includes('ai') ? 'test-ai.html' : 'test.html';
  const url = (x = '') => `file://${__dirname}/build/${file}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  let n = 0;
  const log = (...a) => { console.log(...a); fs.appendFileSync(`${__dirname}/logs/${tag}.log`, a.join(' ') + '\n') };
  const shot = async (name, fullp) => { await p.waitForTimeout(300); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; if (fullp) { const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }) } else await p.screenshot({ path: f }); return f };
  const bottom = async () => { await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(300) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const lastText = async () => { const s = await state(); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind), steps: m.steps } };
  const ask = async (t, wait = 600) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(wait); const r = await lastText(); log(`> ${t}\n  < [${r.kinds.join(',')}] ${r.text}`); return r };
  const btn = (name, exact) => p.getByRole('button', { name, exact: !!exact }).last();
  const click = async (name, exact) => { const l = btn(name, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400) };
  const visText = async (sel = '.gr-answer') => p.evaluate(s => { const a = [...document.querySelectorAll(s)]; return a.length ? a[a.length - 1].innerText : '' }, sel);
  const sheetText = async () => p.evaluate(() => document.querySelector('.app-sheet')?.innerText || '');
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('  !! NO SHEET'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('  !! SHEET STUCK')); await p.waitForTimeout(400); return true };
  const bal = async () => { const s = await state(); if (!s) return null; return { pts: s.balance, card: s.card.balance, due: s.card.due, frozen: s.card.frozen } };
  fs.mkdirSync(__dirname + '/logs', { recursive: true }); fs.writeFileSync(`${__dirname}/logs/${tag}.log`, '');
  const H = { p, ctx, b, shot, bottom, nav, ask, click, btn, confirm, state, bal, log, visText, sheetText, errs, market, url, lastText };
  try { await require(require('path').resolve(scen))(H) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n').slice(0, 3).join(' ')); await shot('fail') }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  log('ERRS:', JSON.stringify([...errs, ...e2]).slice(0, 2000));
  await b.close();
})();
