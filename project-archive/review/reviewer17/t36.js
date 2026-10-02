const H = require('./h.js');
(async () => {
  await H.run('stay', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full } = h; await nav(3);
    const A = () => p.locator('.gr-answer').last();
    await ask('hotel in Paris from 14 Nov for 3 nights for 2', 1000); log('LIST', (await answers(1)).split('\n').slice(3, 12).join(' | '));
    await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600);
    const tail = async () => (await answers(1)).split('\n').slice(-12).join(' | ');
    log('D0', await tail());
    await click('More Guests', { w: 200 }); await click('More Guests', { w: 200 }); await click('More Guests', { w: 200 }); log('5 guests', await tail());
    await click('Suite (+40%)', { w: 200 }); log('suite', await tail());
    await click('Fewer Rooms', { w: 200 }).catch(() => log('no fewer rooms')); log('fewer rooms', await tail());
    await click('Twin', { w: 200 }); await click('More Rooms', { w: 200 }); log('twin more rooms', await tail());
    await click('Continue', { exact: true, w: 900 }); log('CHK', (await answers(1)).replace(/\n/g, ' | ').slice(0, 700));
    await click(/^Pay /, { w: 800 }); log('SHEET', (await sheet() || '').replace(/\n/g, ' | ')); await auth(); log('RC', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600));
    await full('stay', 1800);
  });
})();
