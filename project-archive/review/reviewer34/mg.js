const { open } = require('./h.js');
const sum = s => !s ? 'nostate' : JSON.stringify({ pts: s.balance, card: s.card.balance, b: s.bookings.map(b => b.title + '|' + b.status + '|' + b.total + '|' + (b.extra?.date || '') + ' ' + (b.extra?.dep || '')) });
(async () => { const h = await open('UK', { tag: 'mg' }); const { p } = h;
 const say = async l => console.log('--', l, '::', (await h.lastText()).slice(0, 420));
 await h.nav(3); await h.ask('Flights to Lisbon on 16 October for one, back 19 October', 1000); await say('search');
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await h.click(/Continue with/);
 await h.click('Continue', true); await p.waitForTimeout(300);
 // pay by card only
 const card = h.last().locator('button, [role=radio]').filter({ hasText: /^Card/ }).first(); if (await card.count()) await card.click(); await p.waitForTimeout(200);
 await h.click(/^Pay /); await h.confirm(); await say('paid'); console.log(sum(await h.st()));
 // spend points so earned can't be reclaimed: donate nearly all points
 await h.ask('change my return flight to the 18th', 1000); await say('change return 18th'); await h.full('chg1');
 await h.ask('can I fly back later that day', 1000); await say('later');
 await h.ask('move my outbound to a Coastline flight', 1000); await say('other airline');
 await h.ask('change my seat', 1000); await say('seat');
 await h.ask('cancel my Lisbon flight', 1000); await say('cancel ask'); await h.full('cancel');
 await h.close() })();
