const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui4' }); const { p } = h;
 const buy = async (q) => { await h.ask(q, 900); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); const b = h.last().locator('.gr-detail .gr-btn').last(); await b.click(); await p.waitForTimeout(500); };
 await h.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(300); await h.nav(3);
 const s0 = await h.st();
 await buy('Air fryer'); await h.btn(/^Pay /).click(); await h.confirm();
 const s1 = await h.st(); console.log('supplier down:', (await h.lastText()).slice(0, 400)); console.log('bal', s0.balance, s1.balance, 'card', s0.card.balance, s1.card.balance, 'bookings', s0.bookings.length, s1.bookings.length, 'ledger', s0.ledger.length, s1.ledger.length);
 await h.full('supplier-down');
 await h.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await h.nav(3);
 // buy normally, then reload and try the old pay button
 await buy('Skincare set'); const payBtn = h.btn(/^Pay /); await payBtn.click(); await h.confirm();
 const s2 = await h.st(); console.log('bought skincare, bal', s2.balance);
 await p.reload(); await p.waitForTimeout(800); await h.nav(3);
 const olds = p.getByRole('button', { name: /^Pay / }); console.log('pay buttons after reload', await olds.count());
 for (let i = 0; i < await olds.count(); i++) console.log(' btn', i, await olds.nth(i).innerText(), 'disabled', await olds.nth(i).isDisabled());
 if (await olds.count()) { await olds.last().click({ force: true }).catch(e => console.log('click err')); await p.waitForTimeout(500); console.log('sheet after old click:', (await h.sheetText()).slice(0, 200)); }
 const conts = p.getByRole('button', { name: /^Continue$/ }); console.log('continue buttons', await conts.count(), 'enabled', await conts.evaluateAll(bs => bs.filter(b => !b.disabled).length));
 await h.full('after-reload');
 await h.close() })();
