const H = require('./h.js');
(async () => {
  await H.run('gro', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('Milk, eggs and bread', 1000); await ask('add 2 bananas and a butter', 1000); log('ADD', (await answers(1)).replace(/\n/g, ' | ').slice(-400));
    await ask('remove the eggs', 1000); log('REM', (await answers(1)).replace(/\n/g, ' | ').slice(-300));
    await ask('100 cheddar', 1000); log('100', (await answers(1)).replace(/\n/g, ' | ').slice(-300));
    await click('Checkout', { exact: true, w: 900 }); log('CHK', (await answers(1)).replace(/\n/g, ' | ').slice(0, 700));
    const s0 = await S();
    await click(/^Pay /); log('SHEET', (await sheet() || '').replace(/\n/g, ' | ')); await auth();
    log('DONE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 700)); await full('done', 1600);
    const s1 = await S(); log('delta', s1.balance - s0.balance, +(s1.card.balance - s0.card.balance).toFixed(2));
    await ask('some items were missing from my order', 1000); log('MISS', (await answers(1)).replace(/\n/g, ' | ').slice(0, 700)); log(await btns()); await full('claim', 1600);
  });
})();
