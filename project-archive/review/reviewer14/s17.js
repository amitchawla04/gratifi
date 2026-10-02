const { run } = require('./lib.js');
run('UK-aff', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('Earn extra points shopping'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await H.full('aff'); H.log('aff', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 500));
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600);
  await H.full('aff2'); H.log('aff2', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 400), (await H.st()).pending);
  await H.nav(5); await H.click('Return window ends'); await p.waitForTimeout(400); H.log('rwe', (await H.last()).text, JSON.stringify(await H.money()));
  await H.nav(4); await H.full('wallet');
});
