const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'pay' }); const { p } = h;
 await h.nav(3); await h.ask('pay £20', 800); await h.confirm(); console.log('paid:', (await h.lastText()).slice(0, 300));
 await h.ask('pay the minimum', 800); console.log('min:', (await h.lastText()).slice(0, 300));
 await h.ask('pay £5000', 800); console.log('5000:', (await h.lastText()).slice(0, 300), '|', await h.sheetText());
 await h.ask('pay £0', 800); console.log('0:', (await h.lastText()).slice(0, 200));
 await h.ask('pay £12.345', 800); console.log('12.345:', (await h.lastText()).slice(0, 200), '|', (await h.sheetText()).slice(0, 120));
 await h.nav(5); console.log('me:', (await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').slice(0, 200));
 await h.close() })();
