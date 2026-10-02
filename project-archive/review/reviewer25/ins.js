const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`ins-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav } = h; p.setDefaultTimeout(6000);
  await nav(3); await ask('Travel insurance'); await last().getByRole('button', { name: 'Get this cover' }).first().click(); await p.waitForTimeout(400); log('co', (await lastText()).slice(0, 600));
  await ask('Get me a table at a sold-out restaurant'); await p.fill('.app-ta', 'Saturday, 2 people, around 8pm'); await btn('Send to the concierge'); log('conc', (await lastText()).slice(0, 300));
  await nav(4); await p.getByRole('tab', { name: /Requests/ }).click(); await p.waitForTimeout(300); log('requests', (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 400));
}, {});
