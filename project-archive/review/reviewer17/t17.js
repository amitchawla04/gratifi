const H = require('./h.js');
(async () => {
  await H.run('bank', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('my card is cracked and won\'t tap', 1000); log('DMG', (await answers(1)).replace(/\n/g, ' | ')); let s = await S(); log('frozen?', s && s.card.frozen);
    await click('Send a replacement', { w: 700 }); log('sheet', (await sheet() || '').replace(/\n/g, ' | ')); await auth(); log('AFTER', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300)); s = await S(); log('frozen?', s.card.frozen);
    await ask('block gambling', 1200); log('GBQ', (await answers(1)).replace(/\n/g, ' | ')); log(await btns()); await click('Block gambling payments', { w: 800 }); log('sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) await auth(); log('GB', (await answers(1)).replace(/\n/g, ' | '));
    await ask('remove the gambling block', 900); log('LIFT', (await answers(1)).replace(/\n/g, ' | ')); log(await btns());
    const lb = (await btns()).find(b => /lift|remove|unblock/i.test(b)); if (lb) { await click(lb, { exact: true, w: 800 }); if (await sheet()) { log('lsheet', (await sheet()).replace(/\n/g, ' | ')); await auth() } log('LIFT2', (await answers(1)).replace(/\n/g, ' | ')); log(await btns()); }
    await nav(5); await page('me-gamble'); log('ME', (await p.evaluate(() => document.querySelector('.app-main').innerText)).split('\n').filter(x => /gambl|48|lift/i.test(x)));
    await nav(3); await ask('cancel the gambling block removal', 900); log('KEEP', (await answers(1)).replace(/\n/g, ' | ')); log(await btns());
    await ask('reduce my limit to 500', 900); log('LIM', (await answers(1)).replace(/\n/g, ' | ')); log('sheet', (await sheet() || 'none').replace(/\n/g, ' | ')); if (await sheet()) { await auth(); log('LIM2', (await answers(1)).replace(/\n/g, ' | ')); }
    s = await S(); log('limit', s.card.limit, 'bal', s.card.balance);
    await ask('reduce my limit to 50', 900); log('LIM3', (await answers(1)).replace(/\n/g, ' | ')); if (await sheet()) { log('sheet3', (await sheet()).replace(/\n/g, ' | ')); await p.keyboard.press('Escape'); }
  });
})();
