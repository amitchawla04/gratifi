const H = require('./h.js'), B = require('./buy.js');
(async () => {
  await H.run('cat2', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('A table tonight for two', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(700);
    await click('Choose this time', { w: 800 }); await click('Book the table', { w: 1000 }); log('DINE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600)); log(await sheet());
    await ask('table for 14 people on Saturday', 1000); log('BIG', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500));
    await ask('table for 12 on Saturday at 8pm', 1000); log('12', (await answers(1)).replace(/\n/g, ' | ').slice(0, 300));
    await ask('Book a lounge', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(700);
    await click('Use a free visit', { w: 800 }); await click('Confirm', { exact: true, w: 1000 }); log('LOUNGE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); log('sheet', await sheet());
    const s = await S(); log('loungeLeft', s.loungeLeft, s.bookings.map(b => b.title + ':' + b.status).join('; '));
    await nav(4); await page('wallet');
    await click('Cancel', { exact: true, w: 900 }); log('CANCEL1', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); log(await btns());
  });
})();
