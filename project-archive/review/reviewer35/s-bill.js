const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'bill' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  const A = async (q) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(400) } await ask(q, 900); log('\n> ' + q + '\n  ' + (await lastText()).slice(0, 500)); if (await p.$('.app-sheet')) log('  SHEET ' + await h.sheetText()) };
  const S = async (l) => { const s = await state(); log('  STATE', l, JSON.stringify({ bal: s.card.balance, due: s.card.due, min: s.card.min, dd: s.card.autopay || s.card.dd })) };
  try {
    await nav(3); await A('pay £20 off my bill'); await confirm(); await S('after 20');
    await A('pay the minimum'); log('  PAYBILL CARD ' + (await lastText()));
    await A('pay £10'); await confirm(); await S('after 10');
    await A('what is the minimum now');
    await A('pay £5000'); 
    await A('pay £0.001');
    await A('set up a direct debit for the full balance'); await confirm(); await S('dd');
    await A('change my direct debit to the minimum'); if (await p.$('.app-sheet')) await confirm(); await S('dd2');
    await A('show my direct debit');
    await A('cancel my direct debit'); if (await p.$('.app-sheet')) await confirm(); 
    const y = p.getByRole('button', { name: /Yes|Cancel Direct Debit/ }); log('  yes btns', await y.count());
    await S('dd3');
    await nav(5); await full('me');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
