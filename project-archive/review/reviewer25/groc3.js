const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`groc3-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  await ask('Milk, eggs and bread'); await btn('Checkout'); await btn(/Card/).catch(()=>{}); 
  const opts = await last().locator('[role=radio], .gr-opt').allInnerTexts().catch(() => []); log('opts', opts);
  await last().locator('[role=radio], .gr-opt').last().click().catch(()=>{}); await p.waitForTimeout(200);
  await btn(/^Pay /); await confirm();
  await nav(5); await btn('Deliver my order'); await nav(3);
  await ask('the milk was missing from my order', 800); log('H', await lastText()); await el(h, 'groc3-claim');
  log('controls', await last().locator('button, input').evaluateAll(xs => xs.map(x => x.tagName + ':' + (x.textContent || x.type) + ':' + (x.getAttribute('aria-pressed') || x.getAttribute('aria-checked') || ''))));
  const s0 = await state();
  const send = last().getByRole('button', { name: /claim|Send|refund/i }).last(); log('send', await send.innerText()); await send.click(); await p.waitForTimeout(600); log('I', await lastText()); await el(h, 'groc3-claimed');
  const s1 = await state(); log('bal', s0.balance, '->', s1.balance, s0.card.balance, '->', s1.card.balance, JSON.stringify(s1.bookings[0]).slice(0, 600));
  await btn(/Send claim|Claim/).catch(() => log('no second'));
  await ask('the eggs were broken', 800); log('J', await lastText());
}, {});
