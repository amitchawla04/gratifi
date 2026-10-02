const { run } = require('./lib.js');
run('UK-demo', 'UK', async (H) => {
  const { p } = H;
  const buy = async (q) => { await H.ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().getByRole('radio', { name: /^Card/ }).first().click().catch(() => {}); await H.click(/^Pay /); await H.confirm(); };
  await H.nav(3); await buy('Noise-cancelling headphones');
  H.log('m0', JSON.stringify(await H.money()));
  await H.nav(5); await H.click(/Points come in/); await H.nav(5); await H.click('A card payment'); await p.waitForTimeout(300);
  H.log('m1 after demo pts/card', JSON.stringify(await H.money()));
  await H.nav(5); await H.click('Deliver my order'); await p.waitForTimeout(300); await H.nav(5);
  // supplier down then try to return / cancel
  await p.locator('.app-demo [role=switch]').nth(1).click(); await H.nav(3);
  await H.ask('return my headphones'); await H.full('ret-down'); H.log('ret down', (await H.last()).text);
  if (await H.has(/Book (the )?collection|Book a collection|Return it/)) { await H.click(/Book (the )?collection|Book a collection|Return it/); await p.waitForTimeout(400); H.log('ret down2', (await H.last()).text); }
  await H.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await H.nav(3);
  await H.ask('return my headphones'); await H.full('ret'); H.log('ret', (await H.lastText()).replace(/\n+/g,' | ').slice(0, 400));
  const rb = p.locator('.gr-answer').last().locator('.gr-btn').last(); H.log('ret btn', await rb.textContent()); await rb.click(); await p.waitForTimeout(500); H.log('ret2', (await H.last()).text);
  await p.reload(); await p.waitForTimeout(1000); await H.nav(3);
  await p.waitForTimeout(32000); await H.full('ret-done'); H.log('after 32s', (await H.last()).text); H.log('m2', JSON.stringify(await H.money()));
  await H.nav(5); await H.click('Suspicious payment'); await H.full('susp'); H.log('susp', (await H.last()).text, JSON.stringify((await H.st()).card));
  await H.nav(5); await H.click('Return window ends').catch(e => H.log('rwe', e.message.slice(0, 60))); await p.waitForTimeout(300); H.log('rwe', (await H.last()).text);
  await H.nav(5); await H.click('Delay my order').catch(e => H.log('delay', e.message.slice(0, 60))); H.log('delay', (await H.last()).text);
});
