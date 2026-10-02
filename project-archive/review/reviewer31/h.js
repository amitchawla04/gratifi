// Harness: const H = require('./h.js'); H.run({market, theme, ai, zoom, name}, async (h) => {...})
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const G = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review';
const R = __dirname;
exports.run = async (o, fn) => {
  const market = o.market || 'UK', theme = o.theme || 'light', name = o.name || 'x';
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  if (o.ai) await ctx.addInitScript({ path: R + '/fake.js' });
  if (o.init) await ctx.addInitScript(o.init);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${G}/test.html?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); if (!o.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url(o.q || '')); await p.waitForTimeout(600);
  if (o.zoom) { await p.evaluate(z => { document.documentElement.style.fontSize = z + '%' }, o.zoom); await p.waitForTimeout(200) }
  let n = 0;
  const sh = async (nm) => { await p.waitForTimeout(300); const f = `${R}/shots/${name}-${String(++n).padStart(2, '0')}-${nm}.png`; await p.screenshot({ path: f }); return f };
  const full = async (nm) => { await p.waitForTimeout(350); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight); const f = `${R}/shots/${name}-${String(++n).padStart(2, '0')}-${nm}.png`; await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 3000 }); await l.click({ timeout: 3000 }); await p.waitForTimeout(opt.w || 400) };
  const sheetText = async () => (await p.$('.app-sheet')) ? (await p.locator('.app-sheet').innerText()).replace(/\s+/g, ' ') : null;
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return null } const t = await sheetText(); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); if (market === 'MY') { await p.waitForTimeout(300); const b2 = p.locator('.app-sheet .gr-btn').last(); if (await b2.count()) await b2.click().catch(() => { }) } await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400); return t };
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m')) || 'null'));
  const log = (...a) => console.log(name, '|', ...a);
  const h = { p, ctx, b, sh, full, nav, ask, last, lastText, click, confirm, sheetText, state, log, errs, url, market };
  try { await fn(h) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await sh('fail').catch(() => { }) }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => []);
  console.log(name, 'ERRS:', [...errs, ...e2].join(' | ').slice(0, 1500) || 'none');
  await b.close();
};
