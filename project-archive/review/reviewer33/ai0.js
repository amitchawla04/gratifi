const { open } = require('./h.js');
(async () => { const h = await open('UK', { ai: true, tag: 'ai0' }); const { p } = h;
 console.log('mode', await p.locator('.app-mode').innerText().catch(()=>'?'));
 await h.nav(3);
 await p.evaluate(() => { window.__plan = async (turns, o, run) => { window.__r1 = await run('search_catalogue', { category: 'dining', city: 'London', guests: 2 }); window.__r2 = await run('search_flights', { destination: 'Lisbon', depart_date: '2026-10-09', return_date: '2026-10-12', travellers: 2 }); return 'Here are some options.' } });
 await h.ask('table for two and flights', 3500);
 console.log(JSON.stringify(await p.evaluate(() => [window.__r1, window.__r2, window.__calls[0].turns.map(t=>t.role), window.__calls[0].tier])).slice(0, 3000));
 await h.full('x'); await h.close() })();
