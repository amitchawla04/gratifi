const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'mix', h: 1000 }); const { p, ask, last, btn, confirm, text, shot } = h;
  await ask('I want to end it all. cancel my subscriptions, I won\'t need them', 900); await shot('subs');
  await ask('Flights to Lisbon from 12 to 15 October'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await btn(/^Continue with/); await btn('Continue', null, true); await btn(/^Pay /); await confirm();
  await ask("I can't go on anymore, cancel my flight", 900); console.log((await text()).slice(0, 500)); await shot('flight');
  await h.b.close();
})();
