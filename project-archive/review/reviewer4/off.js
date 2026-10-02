const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'UK';
  const h = await H.start(m); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  try {
    await h.nav(3); await h.ask('Show me card offers'); await h.full('offers'); await L('offers');
    const adds = p.locator('.gr-answer').last().getByRole('button', { name: /^Add/ });
    console.log('add buttons', await adds.count());
    for (let i = 0; i < 4; i++) { const a = p.getByRole('button', { name: 'Add', exact: true }); if (!(await a.count())) break; await a.last().click({ timeout: 3000 }).catch(e => console.log('addfail', e.message.split('\n')[0])); await p.waitForTimeout(300); console.log('after add', (await h.lastText()).replace(/\n+/g,' | ').slice(0,300)) }
    await L('offers-added'); await S('offers-added');
    const s0 = await h.st(); console.log('seen', Object.keys(s0.seen).filter(k => k.startsWith('offer')));
    // grocery by card
    await h.ask('Milk, eggs and bread'); await h.btn('Checkout');
    await p.locator('.gr-answer').last().getByText(/^Card$/).first().click(); await p.waitForTimeout(200);
    await X.payLast(h); await L('grocery-card'); await S('grocery-card');
    await h.ask('cancel my groceries'); await L('cancel-ask'); await h.btn(/Yes, cancel/); await L('cancelled'); await S('grocery-cancelled');
    // shopping affiliate
    await h.ask('Earn extra points shopping'); await h.full('affiliate'); await L('affiliate');
    await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await L('aff-detail');
    await p.locator('.gr-answer').last().getByRole('button', { name: /Go to their site/ }).click(); await p.waitForTimeout(400); await L('aff-go');
    await p.locator('.gr-answer').nth(-2).getByRole('button', { name: /Go to their site/ }).click().catch(() => {}); await p.waitForTimeout(400);
    const s = await h.st(); console.log('pending', JSON.stringify(s.pending), 'chat tail', s.chat.slice(-3).map(x => x.text).join(' || '));
    await h.nav(5); await h.full('me-pending');
    console.log('ME TEXT has pending?', (await p.evaluate(() => document.body.innerText)).match(/pending[^\n]*/gi));
    // tech offer: headphones by card
    await h.nav(3); await h.ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
    await p.locator('.gr-answer').last().getByText(/^Card$/).first().click(); await p.waitForTimeout(200); await X.payLast(h); await L('hp'); await S('hp');
    // return it
    await h.ask('return my headphones'); await L('return-ask');
    await h.btn(/Book free collection/).catch(e => console.log('no collection btn')); await L('return-booked'); await S('return-booked');
    await h.ask('cancel my headphones'); await L('cancel-while-returning');
    console.log('waiting 27s for courier'); await p.waitForTimeout(27000); await S('after-return'); const s2 = await h.st(); console.log('last msg', s2.chat[s2.chat.length - 1].text);
    await h.full('return-done');
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
