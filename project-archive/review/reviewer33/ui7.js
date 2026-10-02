const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui7' }); const { p } = h;
 await h.nav(3); await h.ask('Milk, eggs and bread', 900); await h.click('Checkout'); await h.btn(/^Pay /).click(); await h.confirm();
 await h.nav(5); await h.click('Deliver my order'); await h.nav(3);
 await h.ask('the eggs were broken', 900); console.log('grocery claim:', (await h.lastText()).slice(0, 500)); await h.full('gclaim');
 const boxes = h.last().locator('input[type=checkbox], [role=checkbox]'); console.log('checkboxes', await boxes.count());
 
 const s0 = await h.st();
 const send = h.last().locator('.gr-btn').last(); console.log('send label', await send.innerText()); await send.click(); await p.waitForTimeout(600);
 const s1 = await h.st(); console.log('after claim:', (await h.lastText()).slice(0, 400), 'bal', s0.balance, s1.balance);
 // shopping return timer
 await h.ask('Skincare set', 800); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await h.btn(/^Pay /).click(); await h.confirm();
 await h.nav(5); await h.click('Deliver my order'); await h.nav(3);
 await h.ask('return my skincare set', 900); console.log('return:', (await h.lastText()).slice(0, 500));
 const rb = h.last().locator('.gr-btn').last(); if (await rb.count()) { console.log('rb', await rb.innerText()); await rb.click(); await p.waitForTimeout(600); console.log('return started:', (await h.lastText()).slice(0, 400)); }
 const t0 = Date.now(); const b0 = (await h.st()).balance;
 await p.reload(); await p.waitForTimeout(40000);
 const s2 = await h.st(); console.log('after 40s+reload bal', b0, s2.balance, 'statuses', s2.bookings.map(b => b.title + ':' + b.status).join(', '));
 await h.nav(4); await h.full('wallet-after');
 await h.close() })();
