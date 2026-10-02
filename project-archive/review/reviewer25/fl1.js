const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`fl1-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, shot, log, nav, state } = h;
  await nav(3);
  await ask('Flights to Lisbon from 9 to 13 October for 2 adults and a child aged 7'); log('A', await lastText()); await shot('results');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); log('B', await lastText()); await shot('fares');
  await btn(/Continue with/); log('C', await lastText()); await shot('seats');
  const ins = last().locator('input'); log('inputs', await ins.count(), await ins.evaluateAll(xs => xs.map(x => x.type + ':' + (x.placeholder || x.getAttribute('aria-label')) + '=' + x.value)));
  await shot('seats2');
}, {});
