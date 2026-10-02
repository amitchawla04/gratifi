const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK';
run(`ride-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav } = h;
  await nav(3);
  await ask('A ride now'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  const d = last().locator('.gr-detail');
  log('btns', await d.locator('button').evaluateAll(xs => xs.map(x => x.textContent + (x.disabled ? '[dis]' : '') + (x.getAttribute('aria-pressed') === 'true' ? '[on]' : ''))));
  const B = d.locator('button');
  for (const i of [3, 4, 5]) { await B.nth(i).click({ timeout: 3000 }).catch(e => log('click fail', i)); await p.waitForTimeout(250); log(i, (await d.innerText()).replace(/\n+/g, ' | ').slice(-160)); }
  await el(h, 'ride-detail-airport');
  await B.nth(1).click({ timeout: 3000 }).catch(e => log('fail pick home')); await p.waitForTimeout(250);
  log('pick home, to airport', (await d.innerText()).replace(/\n+/g, ' | ').slice(-200));
  await B.nth(7).click({ timeout: 3000 }).catch(e => log('fail sched')); await p.waitForTimeout(300);
  log('sched', (await d.innerText()).replace(/\n+/g, ' | ').slice(-500)); await el(h, 'ride-detail-sched');
  await ask('a taxi to camden at 7pm tomorrow'); log('TXT1', await lastText());
  await ask('cab from the office to home now'); log('TXT2', await lastText());
  await ask('ride to the airport at 5am on friday'); log('TXT3', await lastText());
  await ask('uber to Heathrow'); log('TXT4', await lastText());
}, {});
