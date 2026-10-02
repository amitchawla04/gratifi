const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`seat-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h; p.setDefaultTimeout(6000);
  await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400);
  await last().locator('input.app-in').nth(1).fill('Priya Chawla');
  const seats = last().locator('.gr-seat'); const n = await seats.count(); log('seats', n);
  const info = await seats.evaluateAll(xs => xs.map((x, i) => i + ':' + (x.getAttribute('aria-label') || x.textContent) + (x.disabled ? '[d]' : '')).slice(0, 40)); log(info.join(' '));
  const ex = await seats.evaluateAll(xs => xs.findIndex(x => /14A|Row 14.*A|14 A/i.test(x.getAttribute('aria-label') || '')));
  await seats.nth(ex >= 0 ? ex : 12).click(); await p.waitForTimeout(300); log('after', (await lastText()).slice(-300));
  await p.getByRole('button', { name: /Checked bag|increase|\+/ }).last().click().catch(() => { }); await p.waitForTimeout(200);
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); log('CO', await lastText());
  await btn(/^Pay /); log('SHEET', await confirm()); log('RCPT', await lastText());
  const s = await state(); log('booking total', s.bookings[0].total, s.bookings[0].pts, s.bookings[0].card);
}, {});
