const L = require('./lib.js');
(async () => {
  const h = await L('UK', {}); const { p, st, ask, text, confirm, btn, sheetText } = h;
  await ask('pay £10 off my bill'); console.log(await confirm()); console.log((await text()).slice(0, 200));
  await ask('what do I owe'); console.log((await text()).slice(0, 200));
  await ask('pay £900 off my bill'); console.log(await confirm()); await ask('what do I owe'); console.log((await text()).slice(0, 200));
  await ask('set up direct debit'); await btn(/Set up Direct Debit/); await p.waitForTimeout(400); console.log('DD:', (await text()).slice(0, 400), '| SHEET', await sheetText());
  const s = await st(); console.log(JSON.stringify(s.card));
  await h.b.close();
})();
