const { run } = require('./lib.js');
run('UK-stale', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  // open two checkouts of same draft? pay once
  await H.click(/^Pay /); await H.confirm();
  const m0 = await H.money();
  await p.reload(); await p.waitForTimeout(800); await H.nav(3);
  const pays = p.getByRole('button', { name: /^Pay / }); H.log('pay buttons after reload', await pays.count(), await pays.evaluateAll(es => es.map(e => e.disabled)));
  // detail Continue button again -> new checkout -> duplicate purchase?
  const cont = p.locator('.gr-detail .gr-btn').last(); H.log('detail continue disabled', await cont.isDisabled());
  // ask subscription flows
  await H.ask('Start a streaming subscription'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  H.log('sub detail', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 300));
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  H.log('sub checkout', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 400));
  await H.click(/^Pay /); await H.confirm(); H.log('sub done', (await H.last()).text);
  await H.ask('pause my subscription'); H.log('pause', (await H.last()).text);
  await H.ask('resume my subscription'); H.log('resume', (await H.last()).text, await H.sheetText());
  if (await p.$('.app-sheet')) await H.confirm(); H.log('resumed', (await H.last()).text);
  await H.ask('cancel my subscription'); H.log('cancel', (await H.last()).text);
  if (await H.has(/Yes, cancel/)) await H.click(/Yes, cancel/); H.log('cancelled', (await H.last()).text);
  H.log('money', JSON.stringify(await H.money()));
  // Clear chat
  await H.click('Clear'); await p.waitForTimeout(300); H.log('after clear', (await H.st()).chat.length, await H.sheetText());
  await H.full('cleared');
});
