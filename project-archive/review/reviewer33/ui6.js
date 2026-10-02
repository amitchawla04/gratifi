const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui6' }); const { p } = h;
 const buy = async (q, opt) => { await h.ask(q, 900); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); const b = h.last().locator('.gr-detail .gr-btn').last(); await b.click(); await p.waitForTimeout(500); if (opt) { await p.getByRole('radio', { name: opt }).last().click(); await p.waitForTimeout(300) } await h.btn(/^Pay /).click(); await h.confirm(); };
 await h.nav(3);
 await buy('Start a streaming subscription', /^Card/); console.log('sub receipt:', (await h.lastText()).slice(0, 400));
 await h.nav(4); await p.locator('.app-main').getByText(/^Subscriptions/).first().click(); await p.waitForTimeout(300); console.log('wallet subs:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 600)); await h.full('wallet-subs');
 await h.click('Cancel'); await p.waitForTimeout(400); console.log('after cancel click:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 600), '| sheet:', await h.sheetText()); await h.full('sub-cancel');
 const y = p.getByRole('button', { name: /Yes, cancel/ }).last(); if (await y.count()) { await y.click(); await p.waitForTimeout(500) } await h.nav(3); console.log('chat last:', (await h.lastText()).slice(0, 400));
 await h.nav(4); await p.locator('.app-main').getByText(/^Subscriptions/).first().click(); await p.waitForTimeout(300); console.log('wallet subs after:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 500));
 // earned points write-off
 await h.nav(3); await buy('Espresso machine', /^Card/); let s = await h.st(); console.log('after espresso bal', s.balance, 'card', s.card.balance, 'pending?', JSON.stringify(s.ledger.slice(0, 3)));
 await h.ask('Donate points to charity', 800); await h.last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); await h.confirm(); s = await h.st(); console.log('after donate bal', s.balance);
 await h.ask('cancel my espresso machine', 900); console.log('cancel ask:', (await h.lastText()).slice(0, 500));
 await h.click('Yes, cancel'); console.log('cancelled:', (await h.lastText()).slice(0, 500)); s = await h.st(); console.log('bal', s.balance, 'card', s.card.balance);
 await h.full('writeoff');
 await h.close() })();
