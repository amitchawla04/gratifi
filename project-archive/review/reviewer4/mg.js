const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'UK', th = process.argv[3] || 'light';
  const h = await H.start(m, th); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  try {
    await h.nav(3); await X.bookFlight(h); await X.payLast(h); await S('booked');
    await h.ask('change my flight'); await h.full('change-ask'); await L('change-ask');
    const slots = p.locator('.gr-answer').last().locator('.gr-slot');
    console.log('SLOTS', await slots.allInnerTexts());
    await slots.nth(1).click(); await p.waitForTimeout(300); await L('change-picked');
    await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await h.full('change-next'); await L('change-next');
    const pay = p.getByRole('button', { name: /^Pay / }); if (await pay.count()) { await pay.last().click(); await h.shot('change-sheet'); console.log('SHEET', await h.sheetText()); await h.confirm(); await L('changed') }
    await S('changed');
    await h.ask('change my seats'); await h.full('seat-ask'); await L('seat-ask');
    const seats = p.locator('.gr-answer').last().locator('.gr-seat, button[aria-label*="eat"]');
    console.log('SEATCOUNT', await seats.count(), (await seats.evaluateAll(xs => xs.slice(0, 40).map(x => (x.getAttribute('aria-label') || x.textContent) + (x.disabled ? '(x)' : '')))).join(','));
    // click an extra legroom seat in row 14
    const s14 = p.locator('.gr-answer').last().locator('button[aria-label^="14"]:not([disabled])').first();
    if (await s14.count()) { await s14.click(); await p.waitForTimeout(200) }
    await h.full('seat-picked'); await L('seat-picked');
    await h.btn(/Save seats/); await p.waitForTimeout(400); await L('seat-saved');
    const pay2 = p.getByRole('button', { name: /^Pay / }); if (await pay2.count()) { await pay2.last().click(); console.log('SHEET2', await h.sheetText()); await h.confirm(); await L('seat-paid') }
    await S('seats');
    await h.ask('cancel my flight'); await h.full('cancel-ask'); await L('cancel-ask');
    await h.btn(/Yes, cancel|Cancel and refund|Confirm/); await h.full('cancelled'); await L('cancelled');
    await S('cancelled');
    await h.ask('cancel my flight'); await L('cancel-again');
    // re-tap old cancel button
    const old = p.getByRole('button', { name: /Yes, cancel/ });
    console.log('old yes-cancel buttons', await old.count(), await old.evaluateAll(xs => xs.map(x => x.disabled)));
    if (await old.count()) { await old.first().click({ force: true }).catch(e => console.log('click fail', e.message.split('\n')[0])); await p.waitForTimeout(400); await L('old-retap') }
    await S('after-retap');
    await h.nav(4); await h.full('wallet');
    await p.getByRole('button', { name: /^Past/ }).click().catch(() => {}); await p.waitForTimeout(300); await h.full('wallet-past');
    await h.nav(5); await h.full('me');
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
