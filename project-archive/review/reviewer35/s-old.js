const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'old' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, state } = h;
  const S = async (l) => { const s = await state(); log(l, s.card.balance, s.balance, s.bookings.map(b => b.title + ':' + b.status).join('|')) };
  try {
    await nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
    // open two checkouts: ask again for the same item
    await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
    const pays = p.getByRole('button', { name: /^Pay / }); log('pay buttons', await pays.count());
    await pays.first().click(); await p.waitForTimeout(400); log('sheet from first', await h.sheetText()); await confirm(); await S('after first');
    log('pay buttons now', await p.getByRole('button', { name: /^Pay / }).count());
    const pp = p.getByRole('button', { name: /^Pay / }); if (await pp.count()) { await pp.last().click(); await p.waitForTimeout(400); log('second sheet', await h.sheetText()); if (await p.$('.app-sheet')) await confirm(); await S('after second') }
    await full('two-checkouts');
    // reload, any live buttons?
    await p.reload(); await p.waitForTimeout(800); await nav(3);
    const btns = await p.$$eval('.gr-answer button:not([disabled])', bs => bs.map(b => b.innerText.trim()).filter(Boolean)); log('live buttons after reload', JSON.stringify(btns));
    await full('reloaded');
    // click an old Continue in detail card
    const cont = p.locator('.gr-detail .gr-btn:not([disabled])'); log('old detail live', await cont.count());
    if (await cont.count()) { await cont.first().click(); await p.waitForTimeout(500); await full('old-continue') }
    // cancel then press old cancel again
    await ask('cancel my headphones'); await full('cancel-ask'); await click('Yes, cancel'); await S('after cancel'); 
    const yc = p.getByRole('button', { name: 'Yes, cancel' }); log('Yes cancel still live', await yc.count(), await yc.last().isEnabled().catch(() => 'n/a'));
    await ask('cancel my headphones'); await full('cancel-again'); log('cancel again', await h.lastText());
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
