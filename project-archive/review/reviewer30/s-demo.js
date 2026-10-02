module.exports = async (H) => { const { p, nav, say, full, click, confirm, state, sheet, url, last } = H;
 const S = async (t) => { const s = await state(); if (s) console.log(`STATE ${t}: pts=${s.balance} card=${s.card.balance} frozen=${s.card.frozen} bk=${s.bookings.map(b => b.ref + ':' + b.cat + ':' + b.status).join(',')}`) };
 const demo = async (name) => { await nav(5); const b = p.locator('.app-demo').getByRole('button', { name }); if (!(await b.count())) { console.log('NO DEMO BTN', name); return } await b.first().click(); await p.waitForTimeout(700); await nav(3); await p.waitForTimeout(300); console.log(`\n[DEMO ${name}] => ${(await last()).slice(0, 600)}`) };
 const tog = async (i, name) => { await nav(5); await p.locator('.app-demo [role=switch]').nth(i).click(); await p.waitForTimeout(300); console.log('toggled', name) };
 await nav(3);
 // supplier down: try to buy headphones
 await tog(1, 'supplier'); await nav(3); await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
 await S('pre-supplier'); await click(/^Pay /); const sh = await sheet(); console.log('SUP SHEET', sh); if (sh) await confirm(); console.log('SUP RESULT', (await last()).slice(0, 500)); await S('post-supplier'); await full('supplier');
 await tog(1, 'supplier off');
 // old pay button after supplier failure: click it again
 await nav(3); const old = p.locator('.gr-answer').nth(-2).getByRole('button', { name: /^Pay / }); console.log('old pay count', await old.count(), await old.count() ? await old.first().isDisabled() : '');
 // buy headphones properly
 await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await click(/^Pay /); await confirm(); await S('bought hp');
 // reload and try old checkout pay button
 await p.goto(url()); await p.waitForTimeout(700); await nav(3); await full('after-reload');
 const pays = p.getByRole('button', { name: /^Pay / }); const n = await pays.count(); console.log('pay buttons after reload', n); for (let i = 0; i < n; i++) console.log(' pay', i, await pays.nth(i).innerText(), 'disabled', await pays.nth(i).isDisabled());
 if (n) { await pays.first().click({ force: true, timeout: 3000 }).catch(e => console.log('click err')); await p.waitForTimeout(500); console.log('SHEET after old pay', await sheet()); await p.keyboard.press('Escape') }
 await S('after old pay');
 await demo('Points come in'); await S('pts in'); await demo('A card payment'); await S('card pay');
 await demo('Delay my order'); await demo('Deliver my order'); await S('delivered');
 await say('return my headphones'); await full('return'); const rb = p.locator('.gr-answer').last().getByRole('button', { name: /Return|Start|Send|Book/ }); if (await rb.count()) { await rb.last().click(); await p.waitForTimeout(500); if (await sheet()) await confirm(); console.log('RETURN =>', (await last()).slice(0, 500)) }
 await S('return started'); await p.waitForTimeout(36000); await nav(4); await nav(3); await S('after 36s'); console.log('LAST after wait', (await last()).slice(0, 400));
 await demo('Return window ends'); await demo('Suspicious payment'); await S('susp');
 await click('It wasn\'t me').catch(() => console.log('no wasnt me')); console.log('SUSP2 =>', (await last()).slice(0, 500)); await S('susp2');
 await nav(4); await full('wallet-end'); await nav(5); await full('mycard-end');
 await nav(5); await p.locator('.app-demo').getByRole('button', { name: 'Reset demo' }).click(); await p.waitForTimeout(800); const s = await state(); console.log('after reset', s ? s.balance + ' ' + s.bookings.length : 'null');
}
