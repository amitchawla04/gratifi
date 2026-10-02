const H = require('./h.js');
(async () => {
  await H.run('pol', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth } = h; await nav(3);
    const A = () => p.locator('.gr-answer').last();
    await ask('hotel in Paris tomorrow for 2 nights', 1000); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600);
    log('D', (await answers(1)).split('\n').slice(-6).join(' | '));
    await click('Continue', { exact: true, w: 900 }); log('CHK policy', (await answers(1)).split('\n').filter(x => /cancel|refund/i.test(x)).join(' / '));
    await click(/^Pay /, { w: 800 }); await auth();
    await nav(4); await click('Cancel', { exact: true, w: 1000 }); log('CANCEL', (await answers(1)).replace(/\n/g, ' | '));
    await ask('Old town walking tour', 1000); await A().locator('.gr-itemrow').first().click().catch(()=>{}); await p.waitForTimeout(600); log('EXP', (await answers(1)).split('\n').slice(-5).join(' | '));
  });
})();
