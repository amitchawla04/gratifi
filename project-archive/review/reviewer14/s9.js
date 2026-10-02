const { run } = require('./lib.js');
run('UK-ai2', 'UK', async (H) => {
  const { p } = H;
  const plan = async (steps, text, w = 900) => { await p.evaluate(s => { window.__plan.push(s) }, steps); await H.ask(text, w); return p.evaluate(() => window.__results.slice(-1)) };
  await H.nav(3);
  await plan([{ tool: 'prepare_checkout', args: { id: 'GC-1', option: '£50', recipient: 'Sam', email: 'sam@example.com' } }, { say: 'Checkout is ready.' }], 'a £50 gift card for Sam');
  await H.click(/^Pay /); await p.waitForTimeout(400); H.log('nan sheet', JSON.stringify(await H.sheetText()));
  if (await p.$('.app-sheet')) await H.confirm();
  await H.full('nan-paid'); H.log('after nan', (await H.last()).text, JSON.stringify(await H.money()));
  await plan([{ tool: 'prepare_checkout', args: { id: 'GC-1', option: '25000', recipient: 'Sam', email: 'sam@example.com' } }, { say: 'Checkout is ready.' }], 'a 25000 gift card for Sam');
  await p.locator('.gr-answer').last().getByRole('radio', { name: /^Card/ }).first().click().catch(e => H.log('radio', e.message.slice(0, 60)));
  await p.waitForTimeout(300); await H.click(/^Pay /); await H.confirm(undefined, 'big-sheet'); await H.full('big-paid');
  H.log('after big', (await H.last()).text, JSON.stringify(await H.money()));
  const s = await H.st(); H.log('card', JSON.stringify(s.card));
}, { init: require('./fake.js') });
