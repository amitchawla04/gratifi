const { run } = require('./lib.js');
run('UK-chl', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('show me challenges'); await H.full('chl');
  H.log(await H.lastText());
  const j = p.getByRole('button', { name: /Join/ }); H.log('join buttons', await j.count()); if (await j.count()) { await j.first().click(); await p.waitForTimeout(400) }
  H.log('m0', JSON.stringify(await H.money()));
  await H.ask('I lost my card'); await H.full('lost'); if (await H.has('Send a replacement')) { await H.click('Send a replacement'); if (await p.$('.app-sheet')) await H.confirm(); }
  await H.full('repl'); H.log('after replacement', JSON.stringify(await H.money()), (await H.last()).text);
  const s = await H.st(); H.log('chl', JSON.stringify(s.challenges.map(c => [c.id, c.joined, c.progress, c.done])), JSON.stringify(s.ledger.slice(0, 4)));
});
