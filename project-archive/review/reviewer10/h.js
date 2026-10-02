const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs'); fs.mkdirSync(__dirname+'/shots',{recursive:true});
const BASE='file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/';
module.exports = async function run(name, market, fn, opts={}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const theme=opts.theme||'light', file=opts.file||'test.html';
  const url = (x = '') => `${BASE}${file}?m=${market}&theme=${theme}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  let n = 0;
  const shot = async (nm) => { await p.waitForTimeout(300); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2,'0')}-${nm}.png` }) };
  const full = async (nm) => { await p.waitForTimeout(300); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(7000, h + 200) }); await p.waitForTimeout(300); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2,'0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(700) };
  const btn = (text, exact) => p.getByRole('button', { name: text, exact: !!exact }).last();
  const click = async (text, exact) => { const l = btn(text, exact); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(450) };
  const last = () => p.locator('.gr-answer').last();
  const lastText = async () => (await last().innerText()).replace(/\s+/g,' ');
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))));
  const confirm = async (code='482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { errs.push('NO SHEET'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); const bt = p.locator('.app-sheet .gr-btn').last(); await bt.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 12000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400); return true };
  const log = (...a) => console.log(`[${name}]`, ...a);
  try { await fn({ p, ctx, shot, full, nav, ask, click, btn, last, lastText, st, confirm, log, errs, url }) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  console.log(name, errs.length ? 'ERRORS: ' + errs.join(' | ').slice(0, 2000) : 'clean');
  await b.close();
}
