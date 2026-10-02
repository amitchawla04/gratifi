const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'UK';
  const h = await H.start(m); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  try {
    await h.nav(3); await X.bookFlight(h); await X.payLast(h); await S('booked');
    // seat change to extra legroom
    await h.ask('change my seats');
    await p.locator('.gr-answer').last().getByRole('button', { name: /^Seat 14A$/ }).click(); await p.waitForTimeout(200);

    await h.shot('seat14'); await L('seat14');
    await h.btn(/Save seats/); await L('seat-saved');
    const pay2 = p.getByRole('button', { name: /^Pay / }); if (await pay2.count()) { await pay2.last().click(); console.log('SHEET2', await h.sheetText()); await h.confirm(); await L('seat-paid') }
    await S('seats');
    // go back and click the booked checkout Pay again (first checkout)
    const pays = p.getByRole('button', { name: /^Pay / });
    console.log('pay buttons', await pays.count(), await pays.evaluateAll(xs => xs.map(x => x.disabled + ':' + x.textContent)));
    // cancel
    await h.ask('cancel my flight'); await h.btn(/Yes, cancel/); await L('cancelled'); await S('cancelled');
    // old booking card buttons
    const oldBtns = ['Change date', 'Change seats', 'Boarding pass', 'Cancel'];
    for (const b of oldBtns) {
      const l = p.getByRole('button', { name: b, exact: true });
      const n = await l.count(); console.log('old', b, n, await l.evaluateAll(xs => xs.map(x => x.disabled)));
      if (n) { await l.first().scrollIntoViewIfNeeded(); await l.first().click().catch(e => console.log('x', e.message.split('\n')[0])); await p.waitForTimeout(500); await L('retap ' + b) }
    }
    await S('end');
    await h.full('end');
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
