const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'bell' }); const { p } = h;
 console.log(await p.locator('.app-main button').evaluateAll(a => a.slice(0, 4).map(b => b.getAttribute('aria-label') + '|' + b.textContent.trim().slice(0, 20))));
 await p.locator('.app-main button').nth(1).click(); await p.waitForTimeout(600); await h.full('bell'); console.log((await p.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 700));
 await h.nav(1); await h.click('Add'); await p.waitForTimeout(400); await h.shot('add'); console.log((await p.locator('.app-main').innerText()).replace(/\s+/g, ' ').match(/Offers for you.{0,200}/)?.[0]);
 await h.close() })();
