const H = require('./h.js');
(async () => { await H.run('x', { m: 'UK' }, async ({ p, nav, log }) => { await nav(3); await p.waitForTimeout(3500); log(await p.evaluate(() => Object.keys(localStorage).map(k => k + ' ' + localStorage.getItem(k).length))) }) })();
