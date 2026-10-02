// node aiprobe.js MARKET casefile.js   -- casefile exports array of {say, plan: string (function source) } or steps
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs');
const [m, file] = [process.argv[2], process.argv[3]];
const cases = require('./' + file);
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 880 } });
  await ctx.addInitScript({ path: __dirname + '/fake.js' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=chat`;
  const reset = async () => { await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.goto(url); await p.waitForTimeout(500) };
  await reset();
  let shotN = 0;
  for (const c of cases) {
    if (c.reset) { await reset(); continue }
    if (c.js) { const r = await p.evaluate(c.js); console.log('JS:', JSON.stringify(r).slice(0, 600)); continue }
    if (c.click) { if (await p.$('.app-sheet') && !c.inSheet) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) } const l = (c.inSheet ? p.locator('.app-sheet') : p).getByRole('button', { name: c.click, exact: !!c.exact }).last(); try { await l.scrollIntoViewIfNeeded({ timeout: 3000 }); await l.click({ timeout: 3000 }); } catch (e) { console.log('CLICK FAIL', c.click) } await p.waitForTimeout(c.inSheet ? 2500 : 700); continue }
    if (c.shot) { await p.waitForTimeout(300); await p.screenshot({ path: `shots/ai-${m}-${c.shot}.png` }); continue }
    if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
    await p.evaluate(src => { window.__calls = []; window.__plan = src ? eval('(' + src + ')') : undefined }, c.plan ? (typeof c.plan === "string" ? c.plan : c.plan.toString()) : null);
    await p.fill('.gr-ask input', c.say); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(c.wait || 900);
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; const sheet = document.querySelector('.app-sheet'); return { called: (window.__calls || []).length, res: (window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, r: x.r && JSON.stringify(x.r).slice(0, 300) }), text: msg.text || '', steps: msg.steps, kinds: (msg.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.state ? ':' + b.state : '')), sheet: sheet ? sheet.innerText.replace(/\s+/g, ' ').slice(0, 200) : '', bal: s.balance, card: s.card.balance, frozen: s.card.frozen, nb: s.bookings.length } });
    console.log(`> ${c.say}\n  claude_called=${r.called} [${r.kinds.join(',')}] ${r.text.slice(0, 350)}\n  steps=${JSON.stringify(r.steps)} bal=${r.bal} card=${r.card} frozen=${r.frozen} bookings=${r.nb}${r.sheet ? '\n  SHEET: ' + r.sheet : ''}`);
    if (c.plan) console.log('  RES: ' + JSON.stringify(r.res).slice(0, 900));
    window__res = null;
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5));
  await b.close();
})();
