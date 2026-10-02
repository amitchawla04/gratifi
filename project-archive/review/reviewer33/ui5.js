const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui5' }); const { p } = h;
 await h.nav(3);
 // lounge for 5 via UI
 await h.ask('Book a lounge', 800); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
 const plus = h.last().locator('button[aria-label^="More"]'); for (let i = 0; i < 4; i++) { await plus.last().click(); await p.waitForTimeout(150) }
 console.log('lounge detail:', (await h.lastText()).slice(0, 500)); await h.full('lounge5');
 await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
 console.log('lounge checkout:', (await h.lastText()).slice(0, 500));
 await h.btn(/^Pay /).click(); await p.waitForTimeout(400); console.log('lounge sheet:', await h.sheetText()); await h.confirm();
 console.log('lounge receipt:', (await h.lastText()).slice(0, 500)); const s = await h.st(); console.log('loungeLeft', s.loungeLeft);
 // ride typed Soho
 await h.ask('A ride now', 800); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
 console.log('ride detail before:', (await h.lastText()).match(/£[\d.]+[^£]{0,40}/g));
 const inp = h.last().locator('input'); console.log('inputs', await inp.count()); await inp.first().fill('Soho'); await p.waitForTimeout(400);
 console.log('ride detail after Soho:', (await h.lastText()).match(/£[\d.]+[^£]{0,40}/g)); await h.full('ride-soho');
 await h.close() })();
