const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const h = await H.start('UK'); const { p } = h;
  const unl = () => p.evaluate(() => [...document.querySelectorAll('button, a, input, [role=button], [role=switch], [tabindex]')].filter(e => { const n = (e.getAttribute('aria-label') || e.innerText || e.getAttribute('placeholder') || e.title || '').trim(); return !n }).map(e => e.outerHTML.slice(0, 140)));
  console.log('HOME unlabelled', await unl());
  console.log('NAV', await p.$$eval('.gr-nav button', xs => xs.map(x => (x.getAttribute('aria-label') || x.innerText) + '|' + x.getAttribute('aria-current'))));
  console.log('lang/dir', await p.evaluate(() => document.documentElement.lang + ' ' + document.documentElement.dir + ' title=' + document.title));
  console.log('headings', await p.$$eval('h1,h2,h3', xs => xs.map(x => x.tagName + ':' + x.innerText).slice(0, 12)));
  await h.nav(3); await h.ask('Flights to Lisbon on 16 Oct for 2, back 20 Oct');
  console.log('chat live region', await p.evaluate(() => [...document.querySelectorAll('[aria-live],[role=log],[role=status]')].map(e => e.tagName + ':' + (e.getAttribute('role') || '') + ':' + e.getAttribute('aria-live') + ':' + e.className).slice(0, 5)));
  console.log('flight card', await p.$eval('.gr-flight', e => e.tagName + ' role=' + e.getAttribute('role') + ' tabindex=' + e.getAttribute('tabindex') + ' label=' + (e.getAttribute('aria-label') || '').slice(0, 80)));
  console.log('CHAT unlabelled', await unl());
  // keyboard: tab to first flight and press Enter
  await p.focus('.gr-ask input');
  const seq = [];
  for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const e = document.activeElement; return e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || '').slice(0, 30).replace(/\n/g, ' ') })) }
  console.log('TAB ORDER', seq.join(' > '));
  // focus visible style check
  console.log('focus outline', await p.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.boxShadow.slice(0, 40) }));
  // sheet: focus trap and escape
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await h.btn(/Continue with/);
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
  console.log('sheet focus', await p.evaluate(() => document.activeElement.outerHTML.slice(0, 120)));
  const seq2 = []; for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); seq2.push(await p.evaluate(() => { const e = document.activeElement; return (e.closest('.app-sheet') ? 'IN:' : 'OUT:') + e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || '').slice(0, 25).replace(/\n/g, ' ') })) }
  console.log('SHEET TAB', seq2.join(' > '));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200); console.log('after esc sheet', !!(await p.$('.app-sheet')), 'focus back to', await p.evaluate(() => document.activeElement.tagName + ':' + (document.activeElement.innerText || '').slice(0, 30)));
  // pay options radio semantics
  console.log('paywith', await p.evaluate(() => [...document.querySelectorAll('.gr-answer:last-child [role=radio], .gr-answer:last-child [aria-pressed], .gr-answer:last-child [aria-checked]')].map(e => e.tagName + ':' + (e.getAttribute('role') || '') + ':' + (e.innerText || '').slice(0, 20).replace(/\n/g, ' ')).slice(0, 8)));
  // slider label
  console.log('slider', await p.evaluate(() => [...document.querySelectorAll('input[type=range], [role=slider]')].map(e => e.outerHTML.slice(0, 200))));
  // steppers
  console.log('steppers', await p.evaluate(() => [...document.querySelectorAll('.gr-stepper button, [class*=step] button')].map(e => e.getAttribute('aria-label')).slice(0, 6)));
  // images alt
  console.log('imgs without alt', await p.evaluate(() => [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length), 'svgs w/o hidden', await p.evaluate(() => [...document.querySelectorAll('svg')].filter(s => !s.getAttribute('aria-hidden') && !s.getAttribute('role')).length));
  await h.b.close();
})();
