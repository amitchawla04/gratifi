const { run } = require('./lib.js');
run('UK-limit', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('hotel in Lisbon for 14 nights from 16 Oct for 8 people');
  await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(3).click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().getByRole('button', { name: /Suite/ }).click().catch(() => {});
  for (let i = 0; i < 20; i++) await p.locator('.gr-answer').last().getByRole('button', { name: /more nights|Increase nights|Add a night|\+/ }).first().click().catch(() => {});
  await H.full('detail'); H.log('detail', (await H.lastText()).replace(/\n+/g, ' | ').slice(-300));
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().getByRole('radio', { name: /^Card/ }).first().click().catch(e => H.log('radio', e.message.slice(0, 60)));
  await p.waitForTimeout(300); await H.full('checkout'); H.log('checkout', (await H.lastText()).replace(/\n+/g, ' | ').slice(0, 500));
  await H.click(/^Pay /); await H.confirm(); await H.full('paid');
  H.log('after', (await H.last()).text.slice(0, 200), JSON.stringify(await H.money()));
  await H.nav(5); await H.full('me');
});
