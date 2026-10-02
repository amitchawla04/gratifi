const H = require('./h.js');
(async () => {
  await H.run('susp', { m: 'UK' }, async (h) => { const { p, nav, click, answers, btns, log, S, sheet, auth } = h;
    await nav(5); await click('Suspicious payment', { w: 1000 }); await nav(3); await click("It wasn't me", { exact: true, w: 1000 }); log('NOTME', (await answers(1)).replace(/\n/g, ' | ')); log(await btns()); log('sheet', await sheet()); let s = await S(); log('frozen', s.card.frozen);
    await nav(5); await click('Suspicious payment', { w: 1000 }); await nav(3); await click('It was me', { exact: true, w: 1000 }); log('ME', (await answers(1)).replace(/\n/g, ' | ')); log('sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); s = await S(); log('frozen', s.card.frozen, s.card.balance); log((await answers(1)).replace(/\n/g, ' | '));
  });
})();
