const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'fl3' }); const { p } = h;
 await h.nav(3); await h.ask('Flights to Paris tomorrow for 2 adults and a child aged 5, back Sunday', 1000);
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await h.click(/Continue with/); await p.waitForTimeout(400);
 const ins = h.last().locator('input'); await ins.nth(1).fill('Sam Taylor'); await ins.nth(2).fill('Mia Taylor'); await ins.nth(3).fill('2021-05-01');
 await h.last().locator('button').filter({ hasText: /Mia/ }).first().click(); await p.waitForTimeout(200);
 const exit = h.last().locator('button[aria-label*="14"]'); console.log('row14 labels', await exit.evaluateAll(b => b.map(x => x.getAttribute('aria-label') + (x.disabled ? ' [disabled]' : ''))));
 const free = h.last().locator('button[aria-label*="14"]:not([disabled])'); if (await free.count()) { await free.first().click(); await p.waitForTimeout(300); console.log('after exit click:', (await h.lastText()).match(/[^.]*exit[^.]*\./gi)); }
 console.log('chips', await h.last().locator('button').filter({ hasText: /·/ }).allInnerTexts());
 await h.last().locator('.gr-btn').last().click(); await p.waitForTimeout(500);
 console.log('checkout:', (await h.lastText()).slice(0, 700));
 await h.close() })();
