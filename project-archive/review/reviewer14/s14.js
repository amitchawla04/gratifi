const { run } = require('./lib.js');
run('UK-exit', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('flights to Lisbon 14 Oct back 18 Oct for 2 adults and a 7 year old');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.click(/Continue with/);
  const a = p.locator('.gr-answer').last();
  await a.getByRole('button', { name: /Child 1/ }).first().click().catch(e => H.log('chip', e.message.slice(0, 80)));
  const seats = a.locator('.gr-seat'); H.log('seats', await seats.count());
  const labels = await seats.evaluateAll(es => es.slice(0, 40).map(e => (e.getAttribute('aria-label') || '') + (e.disabled ? '[x]' : '')));
  H.log(labels.filter(l => /14/.test(l)).join(' ; '));
  const s14 = a.locator('.gr-seat[aria-label*="14A"], .gr-seat[aria-label*="14 A"]').first(); if (await s14.count()) { await s14.click({ force: true }); await p.waitForTimeout(300) }
  await H.full('child-exit'); H.log('text', (await H.lastText()).match(/[^\n]*(exit|Exit)[^\n]*/g));
  // Cedar 3x
  await H.ask('A hotel in Lisbon with a pool'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().getByRole('radio', { name: /^Card/ }).first().click(); await H.click(/^Pay /); await H.confirm();
  H.log('cedar', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 500));
  const s = await H.st(); H.log(JSON.stringify(s.ledger.slice(0, 2)));
});
