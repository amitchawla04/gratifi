const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const G = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
const fs = require('fs');
async function open(market = 'UK', o = {}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1, colorScheme: o.dark ? 'dark' : 'light' });
  if (o.ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const file = o.ai ? 'test-ai.html' : 'test.html';
  const url = (x = '') => `file://${G}${o.ai ? 'test.html' : 'test.html'}?m=${market}&theme=${o.theme || 'light'}${x}`;
  await p.goto(url()); if (!o.keep) { await p.evaluate(() => localStorage.clear()); await p.goto(url()); }
  await p.waitForTimeout(600);
  if (o.zoom) await p.evaluate(z => document.documentElement.style.fontSize = z, o.zoom);
  const tag = o.tag || market; let n = 0;
  const shot = async (name) => { await p.waitForTimeout(350); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); return f };
  const full = async (name) => { await p.waitForTimeout(400); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(7000, h + 200) }); await p.waitForTimeout(300); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight); await p.waitForTimeout(200); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) } await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const btn = (name, exact) => p.getByRole('button', { name, exact: !!exact }).last();
  const click = async (name, exact) => { const l = btn(name, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(450) };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const sheetText = async () => (await p.locator('.app-sheet').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return false } const ins = await p.$$('.app-sheet input:not([type=checkbox])'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const b = p.locator('.app-sheet .gr-btn').last(); await b.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(500); return true };
  const st = () => p.evaluate(m => JSON.parse(localStorage.getItem('gratifi-state-v3-' + m) || 'null'), market);
  const log = (...a) => { console.log(...a) };
  const close = async () => { const e2 = await p.evaluate(() => window.__errs || []).catch(() => []); if (errs.length || e2.length) console.log('ERRS', [...errs, ...e2].join(' | ').slice(0, 2000)); await b.close() };
  return { b, ctx, p, shot, full, nav, ask, click, btn, last, lastText, sheetText, confirm, st, log, close, errs, url };
}
module.exports = { open };
