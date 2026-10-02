// node aih.js <scenarioFile> <market> [theme]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const file = process.argv[2], market = process.argv[3] || 'UK', theme = process.argv[4] || 'light';
const tag = require('path').basename(file, '.js') + '-' + market;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 } });
  if (!process.env.NOFAKE) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message));
  const url = `file://${__dirname}/build/test.html?m=${market}&theme=${theme}&tab=chat`;
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.goto(url); await p.waitForTimeout(700);
  let n = 0; const log = [];
  const L = (...a) => { const s = a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' '); log.push(s); console.log(s) };
  const h = {
    p, L, errs, market,
    plan: async (src) => { await p.evaluate(s => { window.__plan = eval('(' + s + ')') }, src) },
    safety: async (r, d) => { await p.evaluate(([r, d]) => { window.__safetyResp = r; window.__safetyDelay = d }, [r || null, d || 50]) },
    ask: async (t, wait = 1500) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(wait) },
    last: async () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const m = s.chat[s.chat.length - 1]; return { text: m.text, kinds: (m.blocks || []).map(b => b.kind + (b.urgent ? ':' + b.urgent : '') + (b.team ? ':' + b.team : '')), sheet: !!document.querySelector('.app-sheet'), sheetText: document.querySelector('.app-sheet')?.innerText.slice(0, 300) } }),
    state: async () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); if (!s) return {}; return { bal: s.balance, card: s.card.balance, due: s.card.due, frozen: s.card.frozen, avail: s.card.limit - s.card.balance, bookings: s.bookings.map(b => [b.id, b.cat, b.title, b.status, b.total]) } }),
    res: async () => p.evaluate(() => JSON.stringify(window.__res || []).slice(0, 1500)),
    shot: async (name, full) => { await p.waitForTimeout(300); if (full) { await p.setViewportSize({ width: 420, height: 1400 }); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(400) } await p.screenshot({ path: `shots/ai-${tag}-${String(++n).padStart(2, '0')}-${name}.png` }); if (full) await p.setViewportSize({ width: 420, height: 880 }) },
    otp: async () => { const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('482193'[i]) } else if (ins.length) await ins[0].fill('482193') },
    confirm: async () => { await h.otp(); const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(500) },
  };
  try { await require(file)(h) } catch (e) { L('SCRIPT ERR ' + e.message.split('\n')[0]); await h.shot('fail') }
  L('ERRS', errs.slice(0, 5));
  await b.close();
})();
