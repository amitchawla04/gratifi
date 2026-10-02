const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'ui1' }); const { p } = h;
 const say = async (l) => console.log(l, '::', (await h.lastText()).slice(0, 400));
 await h.nav(5);
 // gambling block on
 await h.click('Turn on'); await h.shot('gb-afterclick'); console.log('sheet?', await h.sheetText());
 if (await p.$('.app-sheet')) await h.confirm();
 await h.full('gb-on');
 console.log('ME gambling:', (await p.locator('.app-main').innerText()).match(/Gambling block[^\n]*\n[^\n]*\n[^\n]*/)?.[0]);
 // try lifting
 const lift = p.getByRole('button', { name: /Lift|Turn off|Remove the block/i }).first();
 if (await lift.count()) { await lift.click(); await p.waitForTimeout(400); console.log('lift sheet:', await h.sheetText()); if (await p.$('.app-sheet')) await h.confirm(); await h.full('gb-lift'); }
 console.log('ME gambling2:', (await p.locator('.app-main').innerText()).match(/Gambling block[^\n]*\n[^\n]*\n[^\n]*\n[^\n]*/)?.[0]);
 const keep = p.getByRole('button', { name: /Keep the block/i }).first(); console.log('keep btn', await keep.count());
 // direct debit minimum
 await h.click('Minimum', true); console.log('DD sheet:', await h.sheetText()); if (await p.$('.app-sheet')) await h.confirm();
 await h.full('dd-on');
 const s = await h.st(); console.log('card', JSON.stringify(s.card));
 await h.close() })();
