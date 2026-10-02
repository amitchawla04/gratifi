const H = require('./h.js');
(async () => {
  await H.run('gam', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('block gambling', 1200); await click('Block gambling payments', { w: 800 });
    await ask('lift my gambling block', 1000); log('LIFT', (await answers(1)).replace(/\n/g, ' | '));
    for (const q of ['actually don\'t lift the gambling block', 'keep the block on', 'I changed my mind, leave the gambling block', 'stop the gambling block being removed', 'cancel the removal']) { await ask(q, 1000); log(q, '=>', (await answers(1)).replace(/\n/g, ' | ').slice(0, 200)); }
    await ask('card controls', 1000); log('CTRL', (await answers(1)).replace(/\n/g, ' | ')); await full('ctrl', 1600);
    await nav(5); await page('me');
    await nav(3); await ask('keep my gambling block', 1000); log('KEEP', (await answers(1)).replace(/\n/g, ' | '));
  });
})();
