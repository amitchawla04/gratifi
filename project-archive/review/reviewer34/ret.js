const { open } = require('./h.js');
const sum = s => !s ? 'nostate' : JSON.stringify({ pts: s.balance, card: s.card.balance, b: s.bookings.map(b => b.title + '|' + b.status + '|' + b.total) });
(async () => { const h = await open('UK', { tag: 'ret' }); const { p } = h;
 const say = async l => console.log('--', l, '::', (await h.lastText()).slice(0, 400));
 await h.nav(3); await h.ask('Noise-cancelling headphones', 900); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
 await h.last().locator('button').filter({ hasText: /^Card/ }).first().click().catch(()=>{});
 await h.click(/^Pay /); await h.confirm();
 await h.ask('milk, eggs and bread', 900); await h.click('Checkout'); await h.click(/^Pay /); await h.confirm(); console.log(sum(await h.st()));
 await h.nav(5); await h.click('Deliver my order'); await p.waitForTimeout(300); await h.click('Deliver my order').catch(()=>{}); await h.nav(3); console.log(sum(await h.st()));
 await h.ask('return my headphones', 900); await say('return'); await h.full('ret1');
 const b = h.last().getByRole('button').filter({ hasText: /return|Send it back|Start/i }).first(); if (await b.count()) { console.log('btn', await b.innerText()); await b.click(); await p.waitForTimeout(400); if (await p.$('.app-sheet')) { console.log('sheet', await h.sheetText()); await h.confirm() } await say('ret2') }
 await h.ask('some of my groceries were missing', 900); await say('claim'); await h.full('claim1');
 const cbs = h.last().locator('input[type=checkbox], [role=checkbox]'); console.log('checkboxes', await cbs.count()); if (await cbs.count()) { await cbs.first().click(); await p.waitForTimeout(200); const sb = h.last().getByRole('button').last(); console.log('submit', await sb.innerText()); await sb.click(); await p.waitForTimeout(500); if (await p.$('.app-sheet')) await h.confirm(); await say('claim2') }
 console.log(sum(await h.st()));
 await p.waitForTimeout(25000); await p.reload(); await p.waitForTimeout(20000); console.log('after 45s', sum(await h.st()));
 await h.nav(4); await h.click('Past').catch(()=>{}); await h.full('wallet');
 await h.close() })();
