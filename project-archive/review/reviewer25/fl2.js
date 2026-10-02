const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`fl2-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, shot, full, log, nav, state } = h;
  await nav(3);
  await ask('Flights to Lisbon from 9 to 13 October for 2 adults and a child aged 7');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await btn(/Continue with/);
  const ins = last().locator('input');
  await ins.nth(1).fill('محمد علي'); await ins.nth(2).fill('Lily Chawla'); await ins.nth(3).fill('2008-05-01');
  log('C1', (await last().locator('.gr-btn').last().innerText()), await lastText().then(t => t.slice(-300)));
  await ins.nth(1).fill('Priya Chawla'); log('C2', await last().locator('.gr-btn').last().innerText());
  await ins.nth(3).fill('2019-03-02'); log('C3', await last().locator('.gr-btn').last().innerText());
  // extra legroom seat
  await p.locator('.gr-seat').nth(9).click().catch(e => log('seat err', e.message)); await p.waitForTimeout(300); log('C4', await lastText().then(t => t.slice(-400)));
  await btn('Continue', { exact: true }); log('D', await lastText()); await shot('checkout');
  await btn(/^Pay /); const st = await confirm(); log('SHEET', st); log('E', await lastText()); await shot('receipt');
  const s = await state(); log('STATE', s.balance, JSON.stringify(s.card).slice(0, 300), JSON.stringify(s.bookings[0]).slice(0, 800));
  await nav(4); await full('wallet');
  await ask('change my return flight to the 14th'); log('F', await lastText()); await shot('chg');
}, {});
