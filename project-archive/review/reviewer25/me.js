const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
process.on('unhandledRejection',()=>{});run(`me-${m}`, m, async h => {
  h.p.setDefaultTimeout(4000); const { p, ask, last, lastText, btn, confirm, log, nav, state, sheetText, shot, full } = h;
  const meTxt = async () => (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ');
  await nav(5);
  await p.getByRole('button', { name: 'Minimum', exact: true }).first().click(); await p.waitForTimeout(400); log('DD sheet', await sheetText()); if (await p.$('.app-sheet')) await confirm(); log('   tab now', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5);
  log('DD after', (await meTxt()).match(/Direct Debit.{0,200}/)?.[0]);
  const ddBtns = await p.locator('.app-main').locator('button').allInnerTexts(); log('btns', ddBtns.slice(0, 20).join(' / '));
  await p.getByRole('button', { name: /Change to full balance|Full balance/ }).first().click().catch(() => log('no full')); await p.waitForTimeout(400); log('DD change sheet', await sheetText()); if (await p.$('.app-sheet')) await confirm(); log('   tab now', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5);
  log('DD after2', (await meTxt()).match(/Direct Debit.{0,200}/)?.[0]);
  await p.getByRole('button', { name: /^Cancel$/ }).first().click().catch(() => log('no dd cancel btn')); await p.waitForTimeout(400); log('DD cancel sheet', await sheetText()); if (await p.$('.app-sheet')) await confirm(); log('   tab now', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5);
  log('DD after3', (await meTxt()).match(/Direct Debit.{0,200}/)?.[0]);
  // gambling
  await p.getByRole('button', { name: 'Turn on' }).first().click(); await p.waitForTimeout(400); log('gamb sheet', await sheetText()); if (await p.$('.app-sheet')) await confirm(); log('   tab now', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5);
  log('gamb', (await meTxt()).match(/Gambling block.{0,200}/)?.[0]);
  await p.getByRole('button', { name: 'Lift' }).first().click().catch(() => log('no lift')); await p.waitForTimeout(400); log('lift sheet', await sheetText()); if (await p.$('.app-sheet')) await confirm(); log('   tab now', await p.evaluate(() => document.querySelector('.app')?.dataset.tab)); await nav(5);
  log('gamb2', (await meTxt()).match(/Gambling block.{0,250}/)?.[0]);
  await p.getByRole('button', { name: 'Keep the block' }).first().click().catch(() => log('no keep')); await p.waitForTimeout(400);
  log('gamb3', (await meTxt()).match(/Gambling block.{0,200}/)?.[0]);
  // demo controls
  let s = await state(); log('S0', s.balance, s.card.balance);
  await btn(/Points come in/); s = await state(); log('pts in', s.balance);
  await btn(/A card payment/); s = await state(); log('card pay', s.card.balance, (await meTxt()).match(/Balance.{0,80}/)?.[0]);
  await btn('Suspicious payment'); await p.waitForTimeout(400); log('susp tab', await p.evaluate(() => document.querySelector('.app')?.dataset.tab), (await lastText()).slice(0, 300));
  await nav(5); await btn('Reset demo'); await p.waitForTimeout(600); s = await state(); log('reset', s.balance, s.card.balance, s.card.frozen);
  await full('me-final');
  // limit decrease then available
  await nav(3); await ask('lower my limit to £2,000'); if (await p.$('.app-sheet')) log('lim', await confirm()); log('lim after', (await lastText()).slice(0, 200)); s = await state(); log('limit', s.card.limit, s.card.balance);
  await ask('13-inch laptop'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await last().locator('[role=radio]').last().click(); await btn(/^Pay /); log('over limit', (await lastText()).slice(0, 200), await sheetText());
}, {});
