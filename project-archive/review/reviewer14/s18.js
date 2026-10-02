const { run } = require('./lib.js');
run('UK-a11y', 'UK', async (H) => {
  const { p } = H;
  const nav = await p.$$eval('.gr-nav button', es => es.map(e => (e.getAttribute('aria-label') || e.innerText) + (e.getAttribute('aria-current') ? '*' : '')));
  H.log('nav', nav);
  const unl = await p.evaluate(() => [...document.querySelectorAll('button, [role=button], input, [role=switch]')].filter(e => !(e.getAttribute('aria-label') || e.innerText.trim() || e.getAttribute('aria-labelledby') || (e.labels && e.labels.length) || e.placeholder)).map(e => e.outerHTML.slice(0, 100)));
  H.log('unlabelled home', unl.length, unl.slice(0, 5));
  await H.nav(3); await H.ask('what do I owe?'); await H.click(/^Pay /); await p.waitForTimeout(400);
  const d = await p.evaluate(() => { const s = document.querySelector('[role=dialog]'); return s ? { modal: s.getAttribute('aria-modal'), label: s.getAttribute('aria-labelledby') || s.getAttribute('aria-label'), focusIn: s.contains(document.activeElement), active: document.activeElement.outerHTML.slice(0, 80) } : null });
  H.log('dialog', JSON.stringify(d));
  for (let i = 0; i < 12; i++) await p.keyboard.press('Tab');
  H.log('focus after 12 tabs in dialog', await p.evaluate(() => { const s = document.querySelector('[role=dialog]'); return s ? s.contains(document.activeElement) : 'closed' }));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); H.log('esc closes', !(await p.$('[role=dialog]')), await p.evaluate(() => document.activeElement.outerHTML.slice(0, 80)));
  const live = await p.$$eval('[aria-live]', es => es.map(e => e.className + ':' + e.getAttribute('aria-live')));
  H.log('live regions', live);
  const unl2 = await p.evaluate(() => [...document.querySelectorAll('.app-main button, .app-main input')].filter(e => !(e.getAttribute('aria-label') || e.innerText.trim() || e.getAttribute('aria-labelledby') || (e.labels && e.labels.length) || e.placeholder)).map(e => e.outerHTML.slice(0, 120)));
  H.log('unlabelled chat', unl2.length, unl2.slice(0, 5));
  H.log('lang/dir', await p.evaluate(() => document.documentElement.lang + '/' + document.documentElement.dir));
});
