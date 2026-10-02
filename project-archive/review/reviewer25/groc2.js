const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
const plan = async (h, fnSrc, q, w = 1000) => { await h.p.evaluate(src => { window.__plan = eval(src) }, fnSrc); await h.ask(q, w); return await h.p.evaluate(() => JSON.stringify((window.__res || []).map(x => typeof x === 'string' ? x : { n: x.n, a: x.a, s: x.r && x.r.shown_to_customer, note: x.r && x.r.note })).slice(0, 700)) };
run(`groc2-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  log('1', await plan(h, `async (t,o,run)=>{ await run('groceries',{items:'6 apples, a dozen eggs, 2 pints of milk'}); return 'Added.' }`, '6 apples, a dozen eggs and 2 pints of milk')); log('1t', (await lastText()).replace(/.*Crisps \| £1.50 \| /, ''));
  log('2', await plan(h, `async (t,o,run)=>{ await run('groceries',{items:'remove the eggs, make the milk 3'}); return 'Updated.' }`, 'no eggs, make the milk 3')); log('2t', (await lastText()).replace(/.*Crisps \| £1.50 \| /, ''));
  await btn('Checkout'); await btn(/^Pay /); await confirm();
  await nav(5); await btn('Deliver my order'); await nav(3);
  await ask('the milk was missing from my order', 800); log('H', await lastText()); await el(h, 'groc2-claim');
  const cb = last().locator('input[type=checkbox], [role=checkbox]'); log('checkboxes', await cb.count());
  if (await cb.count()) { await cb.first().click(); await p.waitForTimeout(200); }
  log('H2', await lastText());
  const s0 = await state(); await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('I', await lastText());
  const s1 = await state(); log('bal', s0.balance, '->', s1.balance, s0.card.balance, '->', s1.card.balance);
}, { ai: true });
