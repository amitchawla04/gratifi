const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');
module.exports = async function setup(market='UK', opts={}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: opts.h||880 }, deviceScaleFactor: 1, colorScheme: opts.dark?'dark':'light' });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const file = opts.file||'test.html';
  const url = (x = '') => `file://${__dirname}/build/${file}?m=${market}${opts.theme?'&theme='+opts.theme:''}${x}`;
  await p.goto(url()); await p.evaluate(() => localStorage.clear()); if(opts.load){ const d=JSON.parse(fs.readFileSync(opts.load,'utf8')); await p.evaluate(d=>{for(const k in d) localStorage.setItem(k,d[k])}, d) } await p.goto(url()); await p.waitForTimeout(500);
  const tag = opts.tag||'x'; let n=0;
  const shot = async (name) => { await p.waitForTimeout(350); const f=`shots/${tag}-${String(++n).padStart(2,'0')}-${name}.png`; await p.screenshot({ path: f }); return f };
  const full = async (name) => { await p.waitForTimeout(350); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(4000, h + 200) }); await p.waitForTimeout(300); const f=`shots/${tag}-${String(++n).padStart(2,'0')}-${name}.png`; await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: opts.h||880 }); return f };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w=700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const btn = async (name, opt={}) => { const l = p.getByRole('button', { name, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(opt.w||450) };
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('gratifi-state')))));
  const last = async () => { const s = await state(); const m = s.chat[s.chat.length-1]; return m };
  const lastText = () => p.evaluate(() => { const a=[...document.querySelectorAll('.gr-answer')]; return a.length? a[a.length-1].innerText : '' });
  const sheetText = () => p.evaluate(() => document.querySelector('.app-sheet')?.innerText || '');
  const confirm = async (code='482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) return 'NOSHEET'; const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(500); return 'ok' };
  const save = async (f) => { const d = await p.evaluate(()=>{const o={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i); o[k]=localStorage.getItem(k)} return o}); fs.writeFileSync(f, JSON.stringify(d)) };
  const log = (...a) => console.log(...a);
  return { save, b, ctx, p, errs, url, shot, full, nav, ask, btn, state, last, lastText, sheetText, confirm, log, done: async () => { const e2 = await p.evaluate(() => window.__errs || []); if (errs.length||e2.length) console.log('ERRS', [...errs,...e2].join(' | ').slice(0,1500)); await b.close() } };
}
