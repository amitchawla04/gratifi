const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui3' }); const { p } = h;
 await h.nav(3); await h.ask('13-inch laptop', 900);
 await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500);
 const plus = h.last().locator('button[aria-label*="ncrease"], button[aria-label*="More"], button[aria-label*="Add"]');
 console.log('plus buttons', await plus.count());
 for (let i = 0; i < 7; i++) { await plus.last().click(); await p.waitForTimeout(120) }
 await h.full('laptop-detail');
 await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600);
 console.log('checkout:', (await h.lastText()).slice(0, 600));
 await h.btn(/^Card/).click().catch(e => console.log('no card opt')); await p.waitForTimeout(300);
 await h.full('laptop-checkout');
 const pay = h.btn(/^Pay /); console.log('pay label', await pay.innerText().catch(() => '-'), 'disabled', await pay.isDisabled().catch(() => '-'));
 await pay.click().catch(() => {}); await p.waitForTimeout(600);
 console.log('after pay:', (await h.sheetText()).slice(0, 300), '| last:', (await h.lastText()).slice(-400));
 await h.full('laptop-after');
 await h.close() })();
