const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
const buy = async (h, q, pre) => { const { p, last, btn, confirm } = h; await h.ask(q); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(350); if (pre) await pre(); const b = last().locator('.gr-detail .gr-btn').last(); if (/size/i.test(await b.innerText())) { await last().locator('.gr-chip').nth(1).click() } await b.click(); await p.waitForTimeout(350); const pay = p.getByRole('button', { name: /^Pay / }); if (await pay.count()) { await last().locator('[role=radio]').last().click().catch(() => { }); await pay.last().click(); await confirm() } else { await last().locator('.gr-card .gr-btn').last().click(); await p.waitForTimeout(350) } };
run(`manage-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  await buy(h, 'Start a streaming subscription'); log('sub bought', (await lastText()).slice(0, 150));
  await ask('turn on Tunewave'); log('tw', await lastText()); await last().locator('.gr-btn').last().click({timeout:3000}).catch(()=>log('no tw btn')); await p.waitForTimeout(400); log('tw2', (await lastText()).slice(0,200));
  await ask('what am I paying for?'); log('paying', await lastText());
  await ask("what's included with my card?"); log('included', (await lastText()).slice(0, 300));
  await ask('pause Screenly'); log('pause', await lastText());
  const pb = p.getByRole('button', { name: /^(Pause|Yes, pause)/ }); if (await pb.count()) { await pb.last().click(); await p.waitForTimeout(400); log('paused', await lastText()) }
  await ask('resume Screenly'); log('resume', await lastText()); if (await p.$('.app-sheet')) { log('rs', await confirm()); log('resumed', await lastText()) }
  await ask('cancel Screenly'); log('cancel?', await lastText());
  const y = p.getByRole('button', { name: /Yes, cancel/ }); if (await y.count()) { await y.last().click(); await p.waitForTimeout(400); log('cancelled', await lastText()) }
  await nav(4); await p.getByRole('tab', {name:'Subscriptions'}).click(); await p.waitForTimeout(300); await h.full('wallet-subs');
  log('wallet subs', (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 700));
  await nav(3);
  await buy(h, 'Leather trainers'); log('trainers', (await lastText()).slice(0, 120));
  await ask('return my trainers'); log('ret-early', await lastText());
  await nav(5); await btn('Deliver my order'); await nav(3);
  await ask('return my trainers'); log('ret', await lastText());
  const rb = last().getByRole('button', { name: /return|Start/i }); log('ret btns', await last().locator('button').allInnerTexts());
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('ret2', await lastText());
  if (await p.$('.app-sheet')) log('ret sheet', await confirm());
  let s = await state(); log('S-before-timer', s.balance, s.card.balance, s.bookings[0].status);
  await p.waitForTimeout(34000); s = await state(); log('S-after-34s', s.balance, s.card.balance, s.bookings[0].status);
  await p.reload(); await p.waitForTimeout(800); s = await state(); log('S-after-reload', s.balance, s.card.balance, s.bookings[0].status);
  await nav(4); await p.getByRole('tab', {name:'Orders'}).click(); await p.waitForTimeout(300); await h.full('wallet-orders');
}, {});
