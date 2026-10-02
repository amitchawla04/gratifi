const { open } = require('./h.js');
const sum = s => !s ? 'nostate' : JSON.stringify({ pts: s.balance, card: s.card.balance, b: s.bookings.map(b => b.title + '|' + b.status + '|' + b.total) });
(async () => { const h = await open('UK', { tag: 'old' }); const { p } = h;
 const say = async l => console.log('--', l, '::', (await h.lastText()).slice(0, 300));
 await h.nav(3); await h.ask('Noise-cancelling headphones', 900); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
 await h.click(/^Pay /); await h.confirm(); console.log(sum(await h.st()));
 // old pay button
 const pays = p.getByRole('button', { name: /^Pay / }); console.log('pay buttons now', await pays.count(), 'enabled', await pays.evaluateAll(a => a.map(b => !b.disabled)));
 const conts = p.locator('.gr-detail .gr-btn'); console.log('detail btns', await conts.evaluateAll(a => a.map(b => b.textContent + ':' + !b.disabled)));
 await p.reload(); await p.waitForTimeout(800); await h.nav(3);
 console.log('after reload pay buttons', await p.getByRole('button', { name: /^Pay / }).count(), await p.locator('.gr-detail .gr-btn').evaluateAll(a => a.map(b => b.textContent + ':' + !b.disabled)));
 // try clicking old detail continue -> new checkout?
 const d = p.locator('.gr-detail .gr-btn').first(); if (await d.isEnabled()) { await d.click(); await p.waitForTimeout(400); await say('old detail click') }
 // return flow + timer
 await h.ask('return my headphones', 900); await say('return'); const y = p.getByRole('button', { name: /return|Yes/i }).last(); await y.click().catch(()=>{}); await p.waitForTimeout(500); if (await p.$('.app-sheet')) await h.confirm(); await say('return started'); console.log(sum(await h.st()));
 await p.waitForTimeout(20000); await p.reload(); await p.waitForTimeout(15000); console.log('after 35s', sum(await h.st()));
 await h.nav(4); await h.shot('wallet'); console.log((await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0, 500));
 await h.close() })();
