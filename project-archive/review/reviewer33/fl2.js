const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'fl2' }); const { p } = h;
 await h.nav(3); await h.ask('Flights to Paris tomorrow for 2 adults and a child aged 5, back Sunday', 1000);
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await h.click(/Continue with/); await p.waitForTimeout(400);
 const ins = h.last().locator('input');
 await ins.nth(1).fill('Sam Taylor'); await ins.nth(2).fill('Mia Taylor');
 for (const dob of ['2010-01-01', '2026-06-01', '2021-10-03', '2021-05-01']) { await ins.nth(3).fill(dob); await p.waitForTimeout(300); const t = (await h.lastText()); console.log(dob, '=>', t.slice(t.indexOf('0 ') , t.length).slice(-260)); }
 // exit row: pick child chip then click row 14 seat
 const chips = h.last().locator('button').filter({ hasText: /Mia/ }); await chips.first().click(); await p.waitForTimeout(200);
 const seats = h.last().locator('.gr-seat, [class*=seat] button'); console.log('seat count', await seats.count());
 await h.full('fl2');
 const btn = h.last().locator('.gr-btn').last(); console.log('cta', await btn.innerText(), await btn.isDisabled());
 await h.close() })();
