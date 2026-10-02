const { open } = require('./h.js');
const sum = s => !s ? "nostate" : JSON.stringify({ pts: s.balance, card: s.card.balance, lim: s.card.limit, nb: s.bookings.length, st: s.bookings.map(b => b.status + ':' + b.total).join(',') });
(async () => { const h = await open('UK', { tag: 'in' }); const { p } = h;
 const sim = async (i) => { await h.nav(5); await p.locator('.app-demo [role=switch]').nth(i).click(); await p.waitForTimeout(200); await h.nav(3) };
 const buy = async (q, pick) => { await h.ask(q, 900); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); const d = h.last().locator('.gr-detail .gr-btn').last(); await d.click(); await p.waitForTimeout(400); if (pick) { await h.last().locator('[role=radio]').filter({ hasText: pick }).first().click().catch(e => console.log('noradio', e.message.slice(0, 80))); await p.waitForTimeout(200) } };
 await h.nav(3);
 console.log('start', sum(await h.st()));
 // supplier down
 await sim(1); await buy('Noise-cancelling headphones', 'Card'); await h.click(/^Pay /); console.log('sheet:', (await h.sheetText()).slice(0, 200)); if (await p.$('.app-sheet')) await h.confirm();
 console.log('supplierdown:', (await h.lastText()).slice(0, 300)); console.log(' state', sum(await h.st())); await h.full('supdown'); await sim(1);
 // card declined
 await sim(2); await buy('Noise-cancelling headphones', 'Card'); await h.click(/^Pay /); if (await p.$('.app-sheet')) await h.confirm();
 console.log('declined:', (await h.lastText()).slice(0, 300)); console.log(' state', sum(await h.st())); await sim(2);
 // lower limit to 1000 then buy laptop on card
 await h.ask('lower my credit limit to 1000', 900); console.log('limit:', await h.sheetText()); if (await p.$('.app-sheet')) await h.confirm(); console.log(' state', sum(await h.st()), (await h.lastText()).slice(0, 200));
 await buy('13-inch laptop', 'Card'); const payb = h.btn(/^Pay /); console.log('laptop card pay btn:', await payb.count() ? await payb.innerText() : 'none', '|', (await h.lastText()).slice(-300));
 if (await payb.count() && await payb.isEnabled()) { await payb.click(); await p.waitForTimeout(500); console.log(' sheet?', !!(await p.$('.app-sheet')), (await h.sheetText()).slice(0, 200)); if (await p.$('.app-sheet')) await h.confirm(); console.log(' after:', (await h.lastText()).slice(0, 300)); }
 console.log(' state', sum(await h.st())); await h.full('limit');
 // points+card split exceeding available
 await buy('13-inch laptop', 'Points and card'); const pb = h.btn(/^Pay /); console.log('split btn', await pb.count() ? await pb.innerText() : 'none');
 if (await pb.count() && await pb.isEnabled()) { await pb.click(); await p.waitForTimeout(400); if (await p.$('.app-sheet')) { console.log(' split sheet', (await h.sheetText()).slice(0, 200)); await h.confirm() } console.log(' after:', (await h.lastText()).slice(0, 300)); }
 console.log(' state', sum(await h.st()));
 await h.close() })();
