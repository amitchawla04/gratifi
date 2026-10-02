const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs=require('fs');
module.exports = async function (market, name, fn, opts={}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1, permissions:['clipboard-read','clipboard-write'] });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) });
  const file = opts.ai ? 'test-ai.html' : 'test.html';
  const url = (x = '') => `file://${__dirname}/build/${file}?m=${market}&theme=${opts.theme||'light'}${x}`;
  await p.goto(url()); if(!opts.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(500);
  let n = 0;
  const shot = async (nm) => { await p.waitForTimeout(350); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2,'0')}-${nm}.png` }) };
  const full = async (nm) => { await p.waitForTimeout(350); if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1100 }); await p.waitForTimeout(200); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(600); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2,'0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }); return } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(6000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: `shots/${name}-${String(++n).padStart(2,'0')}-${nm}.png` }); await p.setViewportSize({ width: 420, height: 880 }) };
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) };
  const ask = async (t, w=700) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) };
  const click = async (text, opt = {}) => { const l = p.getByRole('button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(400) };
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const last = async (k=1) => p.evaluate((k) => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); return s.chat.slice(-k).map(m => (m.role+': '+(m.text||'')+' ['+(m.blocks||[]).map(b=>b.kind).join(',')+']')).join('\n') }, k);
  const lastText = async () => p.evaluate(() => { const a=[...document.querySelectorAll('.gr-answer')].pop(); return a? a.innerText.replace(/\s+/g,' ').slice(0,700):'' });
  const money = async () => { const s = await st(); return { pts: s.balance, card: s.card.balance, ledgerSum: s.ledger.reduce((a,l)=>a+l.pts,0), txns: s.txns.length, bookings: s.bookings.map(b=>b.ref+':'+b.cat+':'+b.status+':'+b.pts+'/'+b.card+'/e'+b.earned) } };
  const faceConfirm = async () => { await p.waitForTimeout(400); if(!(await p.locator('.app-sheet').count())) { log('(no sheet)'); return } const btn = p.locator('.app-sheet .gr-btn').last(); await btn.click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400) };
  const log = (...a) => console.log(name, '|', ...a);
  try { await fn({ p, ctx, shot, full, nav, ask, click, st, last, lastText, money, faceConfirm, log, errs, url }) } catch (e) { errs.push('SCRIPT ' + e.message.split('\n')[0]); await shot('fail') }
  console.log(name, errs.length ? 'ERRORS: ' + errs.join(' | ').slice(0, 1500) : 'clean');
  await b.close();
}
