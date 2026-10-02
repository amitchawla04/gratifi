const H = require('./h.js');
(async () => {
  await H.run('reset', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, page } = h;
    await nav(5); await click('Points come in (+5,000)', { w: 800 }); log((await S()).balance);
    await click('Reset demo', { w: 1000 }); await page('after-reset'); log('texts', (await p.evaluate(() => document.querySelector('.app-main').innerText)).split('\n').filter(x => /reset|sure|clear/i.test(x)));
    log(await p.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText).filter(t => /reset|yes|confirm/i.test(t))));
    await p.waitForTimeout(1500); log('after', (await S())?.balance, await p.evaluate(() => Object.keys(localStorage)));
  });
})();
