const H = require('./h.js');
(async () => {
  await H.run('gro2', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full, page } = h; await nav(3);
    await ask('Milk, eggs and bread', 1000);
    for (const q of ['remove the eggs', 'no eggs', 'take the bread out', 'actually I don\'t want milk', 'just one loaf', '2 more milk']) { await ask(q, 1000); const t = (await answers(1)).replace(/\n/g, ' | '); log(q, '=>', t.split('\n')[0], '|', (t.match(/(Milk, 2 litres|Sourdough loaf|Free-range eggs, 12) \| £[\d.]+ \| \d+/g) || []).join(' ; '), (t.match(/Total \| £[\d.]+/)||[''])[0]); }
    await click('Checkout', { exact: true, w: 900 }); await click(/^Pay /); await auth(); await p.waitForTimeout(2000);
    log('input disabled?', await p.locator('.gr-ask input').isDisabled(), await p.locator('.gr-ask input').getAttribute('placeholder'));
    await ask('some items were missing from my order', 2000);
    log('bubbles', await p.evaluate(() => [...document.querySelectorAll('.gr-msg, [class*=user]')].slice(-3).map(e => e.className + ':' + e.innerText.slice(0, 80))));
    log('MISS', (await answers(1)).replace(/\n/g, ' | ').slice(0, 700));
  });
})();
