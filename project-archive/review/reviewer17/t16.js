const H = require('./h.js'), B = require('./buy.js');
(async () => {
  await H.run('subs', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('Earn extra points shopping', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600);
    await click('Go to their site', { w: 800 }); await click('I bought something there (demo)', { w: 1000 }); log('AFF', (await answers(1)).replace(/\n/g, ' | ')); log('sheet', await sheet());
    const s = await S(); log('pending', JSON.stringify(s.pending));
    await B.buy(h, 'Which subscriptions are included?', { tag: 'inc', nth: 1 });
    await B.buy(h, 'Start a streaming subscription', { tag: 'scr' });
    await nav(4); await click('Subscriptions', { w: 500 }); await page('subs'); log('W', await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 1200)));
    await click('Pause', { exact: true, w: 1000 }); log('PAUSE', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600)); log(await btns());
    const pb = (await btns()).find(b => /pause/i.test(b)); if (pb) { await click(pb, { exact: true, w: 1000 }); log('PAUSED', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); }
    await nav(4); await click('Subscriptions', { w: 500 }); log('W2', await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 1200)));
    await click('Resume', { exact: true, w: 1000 }).catch(e => log('no resume')); log('RES', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); log('rsheet', (await sheet()||'').replace(/\n/g,' | ')); if (await sheet()) await auth(); log('RES2', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500));
    await nav(4); await click('Subscriptions', { w: 500 }); await click('Cancel', { exact: true, w: 1000 }).catch(e => log('no cancel')); log('CAN', (await answers(1)).replace(/\n/g, ' | ').slice(0, 600)); log(await btns());
    const cb = (await btns()).find(b => /^Yes|cancel/i.test(b)); if (cb) { await click(cb, { exact: true, w: 1000 }); log('CANCELLED', (await answers(1)).replace(/\n/g, ' | ').slice(0, 500)); }
    await nav(4); await click('Subscriptions', { w: 500 }); log('W3', await p.evaluate(() => document.querySelector('.app-main').innerText.slice(0, 1200))); await page('subs3');
    await nav(5); await page('me-pending'); log('ME', (await p.evaluate(() => document.querySelector('.app-main').innerText)).slice(0, 900));
  });
})();
