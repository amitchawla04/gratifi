// helper: const H = await require('./h.js')(market, theme, tag)
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/'
module.exports = async (market = 'UK', theme = 'light', tag = 'x', file = 'test.html') => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const url = (x = '') => `file://${R}${file}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(600);
  let n = 0;
  const name = (s) => `shots/${tag}-${String(++n).padStart(2, '0')}-${s}.png`
  const shot = async (s) => { await p.waitForTimeout(300); const f = name(s); await p.screenshot({ path: f }); return f };
  const full = async (s) => { await p.waitForTimeout(350); const f = name(s); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1400 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(600); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const tr = async (t) => market === 'AR' ? p.evaluate(t => window.__tr(t), t) : t
  const click = async (text, opt = {}) => { if (typeof text === 'string') text = await tr(text); const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(opt.w || 450) };
  const last = () => p.locator('.gr-answer').last()
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))))
  const lastMsg = async () => { const s = await st(); const m = s.chat[s.chat.length - 1]; return { text: m.text, kinds: (m.blocks || []).map(x => x.kind) } }
  const sheetText = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\n+/g, ' | ') : null }
  const confirm = async (code = '482193', tag2) => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return false } if (tag2) await shot(tag2); const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForTimeout(400); return true };
  const waitSheetGone = async () => { await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400) }
  const text = async () => (await p.locator('.app-main').innerText())
  const done = async () => { const e2 = await p.evaluate(() => window.__errs || []); await b.close(); return [...errs, ...e2] }
  return { b, p, shot, full, nav, ask, click, last, st, lastMsg, sheetText, confirm, waitSheetGone, text, done, errs, tr, market }
}
