const { run } = require('./lib.js');
run('UK-stay', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('hotel in Lisbon for 3 nights from 16 Oct for 5 people'); await H.full('list');
  H.log('say', (await H.last()).text); H.log('list', (await H.lastText()).slice(0, 700));
  await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(1).click(); await p.waitForTimeout(400); await H.full('detail');
  H.log('detail', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 900));
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await H.full('checkout');
  H.log('checkout', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 900));
  await H.click(/^Pay /); await H.confirm(undefined, 'sheet'); await H.full('receipt');
  H.log('receipt', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 700));
  H.log('m', JSON.stringify(await H.money()));
  await H.ask('cancel my hotel'); await H.full('cancel'); H.log('cancel', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 500));
  await H.ask('hotel in Lisbon from 20 September for 2 nights'); H.log('past', (await H.last()).text);
  await H.ask('hotel in Lisbon tonight'); H.log('tonight', (await H.last()).text);
  await H.ask('a suite in Lisbon for 4 people 10 Oct for 2 nights'); H.log('suite', (await H.last()).text);
});
