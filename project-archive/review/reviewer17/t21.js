const H = require('./h.js');
const m = process.argv[2], city = process.argv[3];
(async () => {
  await H.run('mk' + m, { m }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h;
    await page('home'); await nav(3); await ask(`Flights to ${city} on 16 Oct back 19 Oct for 2`, 1200); log('RES', (await answers(1)).split('\n').slice(0, 12).join(' | '));
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(800); log('FARE', (await answers(1)).split('\n').slice(-12).join(' | '));
    await click(/^Continue with/, { w: 700 }); const ins = p.locator('.gr-answer').last().locator('input'); log('prefill', await ins.nth(0).inputValue()); await ins.nth(1).fill('Asha Rao');
    await click('Continue', { exact: true, w: 900 }); log('CHK', (await answers(1)).replace(/\n/g, ' | ')); await full('chk', 1800);
    await click(/^Points and card/, { w: 400 }); const s0 = await S();
    const pay = (await btns()).find(b => /^Pay/.test(b)); log('PAY', pay); await click(pay, { exact: true, w: 800 }); log('SHEET', (await sheet()).replace(/\n/g, ' | ')); await h.shot('sheet');
    if (m === 'MY') { await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(500); log('MY step', (await sheet() || 'closed').replace(/\n/g, ' | ')); await h.shot('mysheet'); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 15000 }).catch(() => log('still open')); log('MY after', (await sheet() || 'closed').replace(/\n/g, ' | ')); if (await sheet()) { await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 15000 }).catch(() => log('still open2')); } }
    else await auth();
    await p.waitForTimeout(800); log('RECEIPT', (await answers(1)).replace(/\n/g, ' | ')); const s1 = await S(); log('delta', s1.balance - s0.balance, +(s1.card.balance - s0.card.balance).toFixed(2));
    await nav(4); await page('wallet'); await nav(5); await page('me');
  });
})();
