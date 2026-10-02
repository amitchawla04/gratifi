const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'IN', th = process.argv[3] || 'light';
  const h = await H.start(m, th); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  const city = { IN: 'Goa', MY: 'Penang', SG: 'Bali', AE: 'Muscat', EU: 'Rome' }[m];
  const fill = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); };
  try {
    await h.nav(3); await X.bookFlight(h, `Flights to ${city} on 16 Oct for 2, back 20 Oct`);
    await h.full('checkout'); await L('checkout');
    await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); await h.shot('sheet');
    console.log('SHEET', (await h.sheetText() || '').replace(/\n/g, ' | '));
    if (m === 'IN') {
      await fill('111111'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(400); await h.shot('wrong1');
      console.log('AFTER WRONG', (await h.sheetText()).replace(/\n/g, ' | ')); await S('after-wrong');
      await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('sheet after esc', await h.sheetText());
      await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
      console.log('REOPEN', (await h.sheetText()).replace(/\n/g, ' | '));
      await fill('222222'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(300);
      await fill('333333'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(300);
      await h.shot('locked'); console.log('LOCKED', (await h.sheetText()).replace(/\n/g, ' | '));
      console.log('btn disabled', await p.locator('.app-sheet .gr-btn').last().isDisabled());
      // resend
      await p.getByRole('button', { name: /Resend|another code|Send/i }).first().click().catch(e => console.log('resend fail', e.message.split('\n')[0])); await p.waitForTimeout(300); console.log('AFTER RESEND', (await h.sheetText()).replace(/\n/g, ' | '));
      await p.keyboard.press('Escape'); await S('after-lock');
      await h.ask('Milk, eggs and bread'); await h.btn('Checkout'); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
      console.log('NEW PURCHASE SHEET', (await h.sheetText()).replace(/\n/g, ' | '));
      await h.confirm(); await L('grocery-done'); await S('grocery');
      // lock survives reload?
      await p.reload(); await p.waitForTimeout(600); await h.nav(3);
      await X.bookFlight(h, `Flights to ${city} on 16 Oct for 2, back 20 Oct`);
      await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
      console.log('AFTER RELOAD SHEET', (await h.sheetText()).replace(/\n/g, ' | '));
      await h.confirm(); await h.full('receipt'); await L('receipt'); await S('booked');
    } else {
      await h.confirm(); await h.full('receipt'); await L('receipt'); await S('booked');
      await h.ask('Milk, eggs and bread'); await h.btn('Checkout'); await h.full('gcheckout'); await L('gcheckout');
      await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); console.log('GSHEET', (await h.sheetText()).replace(/\n/g, ' | ')); await h.shot('gsheet');
      await h.confirm(); await L('gdone'); await S('grocery');
    }
    await h.ask('A hotel in ' + city); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
    // choose card
    await p.locator('.gr-answer').last().getByText(/^Card$/).first().click().catch(e => console.log('card opt', e.message.split('\n')[0])); await p.waitForTimeout(300);
    await h.full('hotel-checkout'); await L('hotel-checkout');
    await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400); console.log('HSHEET', (await h.sheetText()).replace(/\n/g, ' | '));
    await h.confirm(); await L('hotel-done'); await S('hotel');
    await h.nav(4); await h.full('wallet'); await h.nav(5); await h.full('me');
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
