const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`ai10-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h; p.setDefaultTimeout(6000);
  await nav(3);
  await p.evaluate(() => { window.__plan = async () => '' });
  await ask('Flights to Lisbon next weekend for two', 1200); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400);
  await last().locator('input.app-in').nth(1).fill('Priya Chawla'); await last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await btn(/^Pay /); await confirm();
  const id = (await state()).bookings[0].id;
  await p.evaluate(id => { window.__plan = async (t, o, run) => { await run('manage_booking', { booking_id: id, action: 'show pass' }); return 'Here is your boarding pass.' } }, id);
  await ask('show my boarding pass', 1200); log('pass', JSON.stringify(await p.evaluate(() => window.__res)).slice(0, 400), '||', (await lastText()).slice(0, 300));
  await p.evaluate(id => { window.__plan = async (t, o, run) => { await run('manage_booking', { booking_id: id, action: 'cancel' }); return 'Your flight is cancelled and refunded.' } }, id);
  await ask('cancel it', 1200); log('cancel', JSON.stringify(await p.evaluate(() => window.__res)).slice(0, 300), '||', (await lastText()).slice(0, 300));
  const s = await state(); log('status', s.bookings[0].status);
}, { ai: true });
