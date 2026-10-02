const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`ai8-${m}`, m, async h => {
  const { p, lastText, log, nav, last } = h;
  await nav(3);
  await p.evaluate(() => { window.__plan = async (t, o, run) => { const r = await run('search_flights', { destination: 'Barcelona', depart_date: '2026-10-16', return_date: '2026-10-19', travellers: 3, children: 1, infants: 1 }); window.__r = r; return 'Here are the flights.' } });
  await h.ask('flights to barcelona 16 to 19 oct, 2 adults, a 6 year old and a baby', 1200);
  const data = await p.evaluate(() => window.__r); log('data', JSON.stringify(data).slice(0, 800));
  const fid = data.data?.options?.[1]?.id || data.data?.best || (data.data && JSON.stringify(data.data).match(/FL-[^"]+/)[0]);
  await p.evaluate(fid => { window.__plan = async (t, o, run) => { await run('choose_flight', { flight_id: fid }); return 'Pick a fare.' } }, fid);
  await h.ask('the second one', 1200); log('fares', (await lastText()).slice(0, 500));
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('seats', (await lastText()).slice(0, 500));
  log('turns sample', await p.evaluate(() => JSON.stringify(window.__calls.slice(-1)[0].turns.map(t => t.role + ':' + t.content.slice(0, 150)))));
  log('rules', await p.evaluate(() => window.__calls.slice(-1)[0].turns[0].content.slice(-900)));
}, { ai: true });
