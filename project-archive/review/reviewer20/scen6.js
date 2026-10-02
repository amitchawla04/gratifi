const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc6' }); const { p, st, ask, last, btn, confirm, text, shot } = h;
  await ask('a hotel in Paris for 3 nights from 21 October for 4 people'); console.log('LIST:', (await text()).slice(0, 400));
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500); console.log('DETAIL:', (await text()).slice(-420));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); console.log('CHECKOUT:', (await text()).slice(0, 600));
  await btn(/^Pay /); console.log('SHEET:', await h.sheetText()); await confirm(); console.log('RECEIPT:', (await text()).slice(0, 500));
  // suite from text
  await ask('a suite in Lisbon for 2 nights from 9 Oct for 3 people'); console.log('LIST2:', (await text()).slice(0, 300));
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500); console.log('DETAIL2:', (await text()).slice(-420));
  // flight then hotel there
  await ask('Flights to Lisbon from 12 to 15 October for two'); await p.locator('.gr-flight').last().click(); await p.waitForTimeout(500);
  await btn(/^Continue with/); const ins = last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await btn('Continue', null, true); await btn(/^Pay /); await confirm();
  await ask('add a hotel'); console.log('HOTEL AFTER FLIGHT:', (await text()).slice(0, 300));
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500); console.log('DETAIL3:', (await text()).slice(-300));
  console.log(h.errs); await h.b.close();
})();
