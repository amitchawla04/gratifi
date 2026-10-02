const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'fl1' }); const { p } = h;
 await h.nav(3); await h.ask('Flights to Paris tomorrow for 2 adults and a child aged 5, back Sunday', 1000);
 console.log('search:', (await h.lastText()).slice(0, 350));
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await h.click(/Continue with/); await p.waitForTimeout(400);
 await h.full('seats');
 const ins = h.last().locator('input'); const n = await ins.count(); console.log('inputs', n, await ins.evaluateAll(a => a.map(i => i.type + ':' + (i.placeholder || i.getAttribute('aria-label')))));
 // non-latin name and bad DOB
 for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); if (t === 'date') await ins.nth(i).fill('2010-01-01'); else if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(i === 1 ? 'Zoë Müller' : 'Анна Иванова'); }
 await p.waitForTimeout(300); console.log('after bad:', (await h.lastText()).replace(/.*CHECKED BAG/i, '').slice(0, 500));
 await h.full('seats-bad');
 // try exit row for child: click an exit-row seat (row 14) while child selected
 const chips = h.last().locator('button').filter({ hasText: /·/ }); console.log('chips', await chips.allInnerTexts());
 await h.close() })();
