const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
module.exports = async function (m, opts = {}) {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: opts.h || 880 }, deviceScaleFactor: 1 });
  if (opts.ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = (tab = 'chat', extra = '') => `file://${__dirname}/build/test.html?m=${m}&tab=${tab}${extra}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url(opts.tab || 'chat', opts.extra || '')); await p.waitForTimeout(500);
  const st = () => p.evaluate(mk => JSON.parse(localStorage.getItem('gratifi-state-v3-' + mk)), m);
  const esc = async () => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) } };
  const ask = async (t, w = 700) => { await esc(); await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const last = () => p.locator('.gr-answer').last();
  const btn = async (name, scope, exact) => { const l = (scope || p).getByRole('button', { name, exact: !!exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(500) };
  const confirm = async () => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) return 'nosheet'; const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill('482193'[i]) } else if (ins.length) await ins[0].fill('482193'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(2500); return (await p.$('.app-sheet')) ? 'stuck:' + (await p.locator('.app-sheet').innerText()).replace(/\s+/g, ' ').slice(0, 200) : 'ok' };
  const text = async (loc) => (await (loc || last()).innerText()).replace(/\s+/g, ' ');
  let n = 0; const shot = async (name, full) => { await p.waitForTimeout(300); if (full) { const h = await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight; return 0 }) } await p.screenshot({ path: `shots/${opts.tag || 's'}-${m}-${String(++n).padStart(2, '0')}-${name}.png` }) };
  const nav = async (i) => { await esc(); await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(400) };
  const sheetText = async () => (await p.$('.app-sheet')) ? (await p.locator('.app-sheet').innerText()).replace(/\s+/g, ' ') : '';
  return { b, p, errs, url, st, esc, ask, last, btn, confirm, text, shot, nav, sheetText };
}
