const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-hand' }); const { p, ask, btn, shot, st, last } = h;
  await h.nav(3); await ask('I want to complain'); await btn('Chat now'); await shot('chatnow'); console.log('CHAT:', (await last()).slice(0, 300));
  await ask('I want to complain'); await btn('Call me'); console.log('CALL:', (await last()).slice(0, 300));
  await ask('I feel like ending it all'); await shot('crisis'); console.log('CRISIS:', (await last()).slice(0, 400));
  console.log(await p.evaluate(() => [...document.querySelectorAll('.gr-answer:last-child a')].map(a => a.getAttribute('href') + ' ' + a.innerText)));
  // double cancel via typing
  await ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn('Confirm');
  let s = await st(); console.log('lounge left', s.loungeLeft);
  await ask('cancel my lounge'); await shot('cl-ask'); console.log('CL1:', (await last()).slice(0, 300));
  await btn('Yes, cancel'); s = await st(); console.log('lounge left after cancel', s.loungeLeft, (await last()).slice(0, 200));
  await ask('cancel my lounge'); console.log('CL2:', (await last()).slice(0, 300));
  // retap older Yes, cancel
  const n = await p.getByRole('button', { name: 'Yes, cancel' }).count(); console.log('live yes-cancel buttons', n);
  await p.reload(); await p.waitForTimeout(600); await h.nav(3);
  const n2 = await p.getByRole('button', { name: 'Yes, cancel' }).count(); console.log('after reload live yes-cancel', n2);
  // Keep it -> reload -> revived?
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await ask('cancel my headphones'); await btn('Keep it'); console.log('kept buttons live?', await p.getByRole('button', { name: 'Yes, cancel' }).count());
  await p.reload(); await p.waitForTimeout(600); await h.nav(3); console.log('after reload kept card live?', await p.getByRole('button', { name: 'Yes, cancel' }).count()); await shot('kept-reload');
  // old Pay button after paying, after reload
  console.log('old pay buttons', await p.getByRole('button', { name: /^Pay / }).count());
  // fare/continue old buttons
  console.log('ERR', await h.done());
})();
