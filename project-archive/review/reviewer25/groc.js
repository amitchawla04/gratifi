const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`groc-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, shot } = h;
  await nav(3);
  await ask('Milk, eggs and bread'); log('A', await lastText()); await el(h, 'groc-basket');
  await ask('add 2 bananas and remove the bread, make the milk 3'); log('B', await lastText());
  await ask('actually no eggs, and add coffee'); log('C', await lastText());
  await ask('add 50 apples'); log('D', await lastText());
  await ask('add caviar'); log('E', await lastText());
  await btn('Checkout'); log('F', await lastText()); await el(h, 'groc-checkout');
  await btn(/^Pay /); log('SHEET', await confirm()); log('G', await lastText()); await el(h, 'groc-done');
  await ask('the milk was missing from my order'); log('H', await lastText()); await el(h, 'groc-claim');
}, {});
