const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'UK';
  const h = await H.start(m); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  const lastMsg = async () => { const s = await h.st(); const x = s.chat[s.chat.length - 1]; return x ? x.role + ': ' + (x.text || '') + ' [' + (x.blocks || []).map(b => b.kind).join(',') + ']' : '' };
  try {
    await h.nav(3);
    // grocery: pay then re-tap Checkout in the old basket
    await h.ask('Milk, eggs and bread'); await h.btn('Checkout'); await X.payLast(h); await S('groc1');
    const s1 = await h.st(); console.log('basket after pay', JSON.stringify(s1.basket));
    const co = p.getByRole('button', { name: 'Checkout', exact: true }); console.log('old Checkout buttons', await co.count());
    if (await co.count()) { await co.first().click(); await p.waitForTimeout(400); console.log('retap checkout ->', await lastMsg()) }
    // flight booked, then re-tap old result card
    await X.bookFlight(h); await X.payLast(h); await S('flight1');
    await p.locator('.gr-flight').first().scrollIntoViewIfNeeded(); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); console.log('retap old flight ->', await lastMsg());
    await h.btn(/Continue with/); console.log('after continue ->', await lastMsg());
    // light fare booking one-way solo
    await h.ask('One way to Paris on 20 Oct'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400);
    await p.locator('.gr-answer').last().getByText('Light', { exact: true }).first().click(); await p.waitForTimeout(200);
    await h.btn(/Continue with/); await h.full('light-seats'); await L('light-seats');
    await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await L('light-checkout');
    await X.payLast(h); await L('light-receipt');
    await h.ask('change my paris flight'); console.log('light change ->', await lastMsg());
    await h.ask('cancel my paris flight'); console.log('light cancel ->', await lastMsg());
    await h.ask('cancel my flight'); console.log('which flight ->', await lastMsg()); await h.full('which');
    // wallet passes for light
    await h.nav(4); await h.full('wallet-2flights');
    // reload and check disabled buttons persist
    await p.reload(); await p.waitForTimeout(700); await h.nav(3);
    const cont = p.getByRole('button', { name: /Continue with/ });
    console.log('after reload continue buttons', await cont.count(), await cont.evaluateAll(xs => xs.map(x => x.disabled)));
    const pays = p.getByRole('button', { name: /^Pay / }); console.log('after reload pay buttons', await pays.count());
    await h.full('after-reload');
    // stepper limits
    await h.ask('A hotel in Lisbon'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
    const plus = p.locator('.gr-answer').last().getByRole('button', { name: /More guests|more Guests|Guests/i }).last();
    console.log('guest plus label', await plus.getAttribute('aria-label'));
    for (let i = 0; i < 10; i++) await plus.click().catch(() => {});
    await L('hotel-10-guests');
    // 9 travellers
    await h.ask('flights to Lisbon on 20 Oct for 9 people'); console.log('9 pax ->', await lastMsg());
    await h.ask('flights to Lisbon on 20 Oct for 12 people'); console.log('12 pax ->', await lastMsg());
    await h.ask('flights to Lisbon yesterday'); console.log('past ->', await lastMsg());
    await h.ask('flights to Lisbon on 31 Feb'); console.log('bad date ->', await lastMsg());
    await h.ask('flights to Lisbon on 20 Oct back 18 Oct'); console.log('back before out ->', await lastMsg());
    await h.ask('flights to Lisbon in December 2027'); console.log('far ->', await lastMsg());
    await h.ask('hotel in Lisbon for 0 nights'); console.log('0 nights ->', await lastMsg());
    await h.ask('<script>alert(1)</script>'); console.log('xss ->', await lastMsg());
    await h.ask('a'.repeat(600)); console.log('long ->', (await lastMsg()).slice(0, 120));
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
