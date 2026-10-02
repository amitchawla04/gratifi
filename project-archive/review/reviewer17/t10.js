const H = require('./h.js');
(async () => {
  await H.run('st', { m: 'UK' }, async (h) => { const { p, full, answers, btns, log, click, nav, ask, sheet, auth, S } = h;
    await nav(3); await ask('hotel in New York 31/12 for 400 nights', 1000);
    await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(800);
    const t = await answers(1); log(t.split('\n').slice(-14).join(' | '));
    await click('Continue', { exact: true, w: 900 }); log('CHK', (await answers(1)).split('\n').join(' | ').slice(0, 900));
    const pay = (await btns()).find(b => /^Pay/.test(b)); log(pay);
    await ask('a suite in Lisbon for 2 on 20 October for 2 nights', 1000);
    await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(800);
    log('SUITE', (await answers(1)).split('\n').slice(-16).join(' | '));
    await full('suite', 1800);
  });
})();
