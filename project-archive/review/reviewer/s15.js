const open = require('./h.js');
(async () => { for (const mk of ['EU','AE','SG']) {
  const H = await open(mk, 'light', 'test.html', 's15'); const { p } = H;
  await H.nav(1); console.log(mk,'HOME:', (await H.text()).split('\n').slice(0,8).join(' | '));
  await H.nav(3);
  for (const q of ['A table tonight', 'Milk, eggs and bread', 'A ride now', 'What do I owe?', 'Concerts this month', 'Travel insurance']) { await H.ask(q, 450); console.log(mk, q, '=>', (await H.last()).replace(/\n/g,' | ').slice(0, 330)) }
  await H.ask('Flights to ' + {EU:'Rome',AE:'Muscat',SG:'Bali'}[mk]); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); await H.btn(/Continue with/); await H.btn('Continue', true); await H.pay(); console.log(mk,'SHEET:', (await H.text('.app-sheet')).replace(/\n/g,' | ')); await H.confirm(); await p.waitForTimeout(2200);
  await H.close(); } })();
