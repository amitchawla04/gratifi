const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'bk' }); const { p } = h;
 const say = async l => console.log('--', l, '::', (await h.lastText()).slice(0, 380));
 await h.nav(3); await h.ask('pay the minimum', 800); await say('min'); console.log(' pay btn:', await h.btn(/^Pay /).innerText().catch(()=>'none'));
 await h.ask('pay £100', 800); console.log('sheet:', (await h.sheetText()).slice(0, 150)); await h.confirm(); await say('paid100');
 await h.ask('pay the minimum', 800); await say('min after'); console.log(' pay btn:', await h.btn(/^Pay /).innerText().catch(()=>'none'));
 await h.ask('what do I owe', 800); await say('owe');
 await h.ask('block gambling', 800); await h.click('Block gambling payments').catch(e=>console.log('noblk')); if (await p.$('.app-sheet')) await h.confirm(); await say('gamb on');
 await h.ask('lift the gambling block', 800); await say('lift'); const lb = h.last().getByRole('button').filter({ hasText: /lift|Start/i }).first(); if (await lb.count()) { await lb.click(); await p.waitForTimeout(300); if (await p.$('.app-sheet')) { console.log('liftsheet', (await h.sheetText()).slice(0,200)); await h.confirm() } await say('lift2') }
 await h.nav(5); const t = (await p.locator('.app-main').innerText()).replace(/\s+/g, ' '); console.log('ME:', t.match(/Gambling block.{0,200}/)?.[0]); console.log('ME DD:', t.match(/Direct Debit.{0,120}/)?.[0]); console.log('ME alerts:', t.match(/Alerts.{0,160}/)?.[0]);
 await h.full('me');
 await h.close() })();
