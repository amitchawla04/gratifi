const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const m = process.argv[2] || 'UK';
  const h = await H.start(m); const { p } = h; const L = X.L(h);
  const S = async (t) => console.log('STATE ' + t, JSON.stringify(await h.summ()));
  const lastMsg = async () => { const s = await h.st(); const x = s.chat[s.chat.length - 1]; return x ? x.role + ': ' + (x.text || '') + ' [' + (x.blocks || []).map(b => b.kind).join(',') + ']' : '' };
  const tog = async (label) => { await h.nav(5); await p.getByRole('switch', { name: label }).click().catch(async () => { await p.locator(`[aria-label="${label}"]`).click() }); await p.waitForTimeout(200) };
  try {
    await h.nav(5); await S('start');
    await h.btn(/Points come in/); await S('points-in'); console.log('msg', await lastMsg());
    await h.nav(5); await h.btn('A card payment'); await p.waitForTimeout(300); console.log('tab after card payment', await p.$eval('.app', e => e.dataset.tab)); console.log('msg', await lastMsg()); await S('card-payment');
    // supplier down: try flight, grocery, bill, transfer
    await tog('Supplier is down'); await h.nav(3);
    await h.ask('Flights to Lisbon on 16 Oct'); console.log('SD flight:', await lastMsg());
    await h.ask('Milk, eggs and bread'); await h.btn('Checkout'); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(300);
    console.log('SD grocery sheet?', !!(await h.sheetText())); if (await h.sheetText()) await h.confirm(); await p.waitForTimeout(300); console.log('SD grocery:', await lastMsg()); await S('after SD grocery');
    await h.ask('Transfer points to miles'); await p.locator('.gr-ack input').first().check().catch(() => {}); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400);
    console.log('SD transfer sheet?', !!(await h.sheetText())); if (await h.sheetText()) await h.confirm(); console.log('SD transfer:', await lastMsg()); await S('after SD transfer');
    await h.ask('What do I owe?'); await h.btn(/^Pay /); console.log('SD bill sheet?', !!(await h.sheetText())); if (await h.sheetText()) await h.confirm(); console.log('SD bill:', await lastMsg()); await S('after SD bill');
    await h.ask('A table tonight for two'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); console.log('SD dining:', await lastMsg()); await S('after SD dining');
    await h.ask('Put points into gold'); await p.locator('.gr-ack input').last().check().catch(() => {}); await h.btn('Continue with the partner').catch(() => {}); if (await h.sheetText()) await h.confirm(); console.log('SD invest:', await lastMsg()); await S('after SD invest');
    await h.ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); if (await h.sheetText()) await h.confirm(); console.log('SD donate:', await lastMsg()); await S('after SD donate');
    await h.ask('Get me a table at a sold-out restaurant'); await p.fill('.app-ta', 'Saturday 2 people 8pm'); await h.btn('Send to the concierge'); console.log('SD concierge:', await lastMsg());
    await h.ask('Start a streaming subscription'); await h.full('sd-end');
    await tog('Supplier is down');
    // card declined
    await tog('Card is declined'); await h.nav(3);
    await h.ask('What do I owe?'); await h.btn(/^Pay /); if (await h.sheetText()) await h.confirm(); console.log('DECLINE bill:', await lastMsg()); await S('decline bill');
    await tog('Card is declined');
    // freeze then card purchase
    await h.nav(3); await h.ask('Freeze my card'); console.log('freeze:', await lastMsg());
    await h.ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
    await p.locator('.gr-answer').last().getByText(/^Card$/).first().click(); await p.waitForTimeout(200); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
    console.log('frozen sheet?', !!(await h.sheetText())); if (await h.sheetText()) await h.confirm(); console.log('FROZEN buy:', await lastMsg()); await h.full('frozen-buy');
    // unfreeze via toggle in controls
    await h.ask('unfreeze my card'); await h.shot('unfreeze'); console.log('UNFREEZE sheet', await h.sheetText()); if (await h.sheetText()) await h.confirm(); console.log('unfreeze:', await lastMsg()); await S('unfrozen');
    await h.ask('turn off online payments'); console.log(await lastMsg());
    await h.ask('turn on online payments'); await p.waitForTimeout(300); console.log('turn on:', await lastMsg(), 'sheet:', await h.sheetText());
    if (await h.sheetText()) { await p.keyboard.press('Escape'); }
    // toggle switch directly in controls block
    const sw = p.locator('.gr-answer').last().getByRole('switch');
    console.log('switches', await sw.count(), await sw.evaluateAll(xs => xs.map(x => (x.getAttribute('aria-label') || '') + ':' + x.getAttribute('aria-checked'))));
    // cancel my next flight w/o flight
    await h.nav(5); await h.btn('Cancel my next flight'); console.log('cancel no flight:', await lastMsg());
    await h.nav(5); await h.btn('Delay my order'); console.log('delay:', await lastMsg());
    await h.nav(5); await h.btn('Suspicious payment'); console.log('fraud:', await lastMsg()); await h.full('fraud');
    await h.btn('It was me'); await p.waitForTimeout(300); console.log('it was me:', await lastMsg(), 'sheet', await h.sheetText()); if (await h.sheetText()) await h.confirm(); await S('after-it-was-me');
    await h.nav(5); await h.btn('Reset demo'); await h.btn('Yes, reset'); await S('reset'); const s = await h.st(); console.log('chat after reset', s.chat.length);
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
