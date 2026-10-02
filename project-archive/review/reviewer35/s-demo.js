const { open } = require('./h.js');
(async () => {
  const [market = 'UK'] = process.argv.slice(2);
  const h = await open({ market, tag: 'demo' });
  const { p, full, nav, ask, click, confirm, log, errs, lastText, state } = h;
  const S = async (l) => { const s = await state(); if (!s) return log(l, 'no state'); log(l, JSON.stringify({ card: s.card.balance, due: s.card.due, avail: s.card.limit ? s.card.limit - s.card.balance : undefined, pts: s.balance, bk: s.bookings.map(b => [b.title, b.status, b.total, b.pts, b.card]), tx: (s.txns || []).slice(0, 3).map(t => [t.merchant, t.amount, t.refund]) })) };
  const demo = async (name) => { await nav(5); const b = p.locator('.app-demo').getByRole('button', { name, exact: false }).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(600) };
  const sw = async (i) => { await nav(5); const s = p.locator('.app-demo [role=switch]').nth(i); await s.scrollIntoViewIfNeeded(); await s.click(); await p.waitForTimeout(300) };
  try {
    await S('start');
    await demo('Points come in'); await S('after points in'); await full('pts-in');
    await demo('A card payment'); await S('after card payment'); await full('card-pay');
    // supplier down
    await sw(1); await nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
    await click(/^Pay /); const st = await confirm(); log('SHEET', st); await full('supplier-down'); log('AFTER SUPPLIER DOWN', await lastText()); await S('after supplier down');
    await sw(1);
    // book flight then cancel by airline
    await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/);
    { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
    await click('Continue', { exact: true });
    // pay by card only
    await p.locator('.gr-answer').last().getByText('Card', { exact: true }).last().click().catch(e => log('no card opt')); await p.waitForTimeout(300);
    await click(/^Pay /); log('SHEET', await confirm()); await S('after flight');
    await demo('Cancel my next flight'); await full('disrupt-me'); await nav(3); await full('disrupt-chat'); log('DISRUPT', await lastText());
    await click(/full refund|Refund/i); await p.waitForTimeout(500); await full('refund-ask'); log('REFUND ASK', await lastText());
    const yes = p.getByRole('button', { name: /Yes|Confirm|refund/i }).last(); if (await yes.count()) { await yes.click(); await p.waitForTimeout(600) }
    if (await p.$('.app-sheet')) log('SHEET2', await confirm());
    await full('refunded'); log('REFUNDED', await lastText()); await S('after refund');
    // suspicious payment
    await demo('Suspicious payment'); await full('susp'); await nav(3); await full('susp-chat'); log('SUSP', await lastText());
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await h.shot('fail') }
  log('errs', errs); await h.b.close();
})();
