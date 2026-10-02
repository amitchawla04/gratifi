module.exports = async (H) => { const { p, nav, say, full, click, confirm, sheet, state, last } = H; await nav(3);
 const S = async (tag) => { const s = await state(); console.log(`STATE ${tag}: pts=${s.balance} card=${s.card.balance} due=${s.card.due} min=${s.card.min} limit=${s.card.limit} frozen=${s.card.frozen} bookings=${s.bookings.map(b => b.ref + ':' + b.status + ':' + b.total).join(',')}`) };
 await say('What do I owe?'); await S('start');
 await say('13-inch laptop'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
 for (let i = 0; i < 7; i++) await p.locator('.gr-answer').last().getByRole('button', { name: /More|Increase|\+/ }).last().click().catch(() => {});
 await full('laptop8'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
 console.log('CHECKOUT:', (await last()).slice(0, 900)); await full('laptop-checkout');
 const opts = p.locator('.gr-answer').last().locator('[role=radio]'); const on = await opts.count(); console.log('pay opts', on);
 if (on) { await opts.last().click(); await p.waitForTimeout(300) }
 const pay = p.locator('.gr-answer').last().getByRole('button', { name: /^Pay / }); console.log('pay btn', await pay.count() ? await pay.last().innerText() + ' disabled=' + await pay.last().isDisabled() : 'none');
 if (await pay.count() && !(await pay.last().isDisabled())) { await pay.last().click(); await p.waitForTimeout(500); console.log('SHEET:', await sheet()); await full('laptop-after'); console.log('AFTER:', (await last()).slice(-500)); await p.keyboard.press('Escape') }
 await S('after-laptop');
 // buy headphones on card, then spend points, then cancel
 await say('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
 { const o = p.locator('.gr-answer').last().locator('[role=radio]'); await o.last().click(); await p.waitForTimeout(200); await p.locator('.gr-answer').last().getByRole('button', { name: /^Pay / }).last().click(); console.log('SHEET HP:', (await confirm())) }
 console.log('HP RECEIPT:', (await last()).slice(0, 600)); await S('after-hp-card');
 // spend nearly all points on gift card 200 x? use points transfer instead: donate most points
 const s1 = await state(); const n = s1.balance - 50;
 await say(`donate ${n} points to charity`); await full('donate'); console.log('DONATE LAST:', (await last()).slice(0,400));
 const b = p.locator('.gr-answer').last().locator('.gr-btn').first(); if (await b.count()) { await b.click(); await p.waitForTimeout(400); console.log('DON SHEET:', await confirm()) }
 await S('after-donate');
 await say('cancel my headphones'); await full('cancel-ask'); await click('Yes, cancel').catch(e => console.log('no yes cancel')); await full('cancelled'); console.log('CANCEL:', (await last()).slice(0, 700));
 await S('after-cancel');
 const led = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('gratifi-state')))); return (s.ledger || s.history || s.points || []).slice ? (s.ledger || s.history || []).slice(0, 8) : Object.keys(s) }); console.log('LEDGER/KEYS', JSON.stringify(led).slice(0, 900));
 await nav(5); await full('mycard-after');
}
