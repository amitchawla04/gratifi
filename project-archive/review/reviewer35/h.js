// Harness: node run.js <scenario.js> [market] [theme] [ai]
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const R = '/tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
const OUT = __dirname + '/shots/';
fs.mkdirSync(OUT, { recursive: true });
async function open({ market = 'UK', theme = 'light', ai = false, tag = 'x', tab = '', vw = 420, vh = 880, zoom = 1, clear = true }) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  if (ai) await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text().slice(0, 300)) });
  const url = (x = '') => `file://${R}${ai ? 'test-ai.html' : 'test.html'}?m=${market}&theme=${theme}${tab ? '&tab=' + tab : ''}${x}`;
  await p.goto(url()); if (clear) await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(700);
  if (zoom !== 1) await p.evaluate(z => { document.documentElement.style.fontSize = (16 * z) + 'px' }, zoom);
  let n = 0;
  const name = s => `${OUT}${tag}-${market}-${String(++n).padStart(2, '0')}-${s}.png`;
  const shot = async (s) => { await p.waitForTimeout(300); const f = name(s); await p.screenshot({ path: f }); return f };
  const full = async (s) => {
    await p.waitForTimeout(350);
    const chat = await p.$('.app[data-tab=chat]');
    if (chat) { await p.setViewportSize({ width: vw, height: 1300 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); if (e) e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); const f = name(s); await p.screenshot({ path: f }); await p.setViewportSize({ width: vw, height: vh }); return f }
    const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : vh;
    await p.setViewportSize({ width: vw, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); const f = name(s); await p.screenshot({ path: f }); await p.setViewportSize({ width: vw, height: vh }); return f
  };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(350) };
  const ask = async (t, w = 700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(opt.w || 450) };
  const sheetText = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()).replace(/\s+/g, ' ') : null };
  const confirm = async (code = '482193', s = 'sheet') => {
    await p.waitForTimeout(350); const sh = await p.$('.app-sheet'); if (!sh) { errs.push('NO SHEET'); return null }
    const txt = await sheetText(); await shot(s);
    const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code);
    const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click();
    await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(450); return txt
  };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const say = async () => { const m = await p.evaluate(() => { const c = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('gratifi-state')) || '{}')).chat || []; const g = c.filter(x => x.role === 'gr'); return g[g.length - 1] }); return m };
  const state = async () => p.evaluate(() => { const k = Object.keys(localStorage).find(k => k.startsWith('gratifi-state')); return k ? JSON.parse(localStorage.getItem(k)) : null });
  const log = (...a) => { console.log(...a); fs.appendFileSync(`${__dirname}/logs/${tag}-${market}.log`, a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ') + '\n') };
  fs.mkdirSync(__dirname + '/logs', { recursive: true }); fs.writeFileSync(`${__dirname}/logs/${tag}-${market}.log`, '');
  return { b, ctx, p, errs, url, shot, full, nav, ask, click, confirm, sheetText, last, lastText, state, log, say, market };
}
module.exports = { open, R, OUT };
