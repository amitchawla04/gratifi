const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tab: 'home' }); const { p, ask, last, btn, nav } = h;
  const audit = async (tag) => { const r = await p.evaluate(() => {
    const name = e => (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.innerText) || '').trim();
    const nb = [...document.querySelectorAll('button,a,[role=button],[role=switch],[role=radio],[role=tab]')].filter(e => e.offsetParent && !name(e)).map(e => e.outerHTML.slice(0, 120));
    const ni = [...document.querySelectorAll('input,select,textarea')].filter(e => e.offsetParent && !(e.getAttribute('aria-label') || e.labels?.length || e.getAttribute('aria-labelledby') || e.placeholder)).map(e => e.outerHTML.slice(0, 120));
    const small = [...document.querySelectorAll('button,[role=switch],[role=radio]')].filter(e => { const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.height < 24 || r.width < 24) }).map(e => (e.innerText || e.getAttribute('aria-label') || '').slice(0, 20) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
    const imgs = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
    const h1 = document.querySelectorAll('h1').length; const lang = document.documentElement.lang; const dir = document.documentElement.dir;
    return { nb: nb.slice(0, 5), nbCount: nb.length, ni, small: small.slice(0, 8), imgs, h1, lang, dir } }); console.log(tag, JSON.stringify(r)) };
  await audit('home'); await nav(2); await audit('explore'); await nav(4); await audit('wallet'); await nav(5); await audit('me');
  await nav(3); await ask('Flights to Lisbon next weekend for two', 900); await audit('flights');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await btn(/^Continue with/); await audit('seats');
  await p.fill('input[aria-label="Traveller 2 full name"], .gr-answer input.app-in >> nth=1', 'Sam Taylor').catch(()=>{}); 
  const ins = last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await btn('Continue', null, true); await btn(/^Pay /);
  const d = await p.evaluate(() => { const s = document.querySelector('.app-sheet'); const dlg = s?.closest('[role=dialog]') || document.querySelector('[role=dialog]'); const inertEls = [...document.querySelectorAll('[inert]')].map(e => e.className.slice(0, 30)); return { role: dlg?.getAttribute('role'), modal: dlg?.getAttribute('aria-modal'), labelled: dlg?.getAttribute('aria-labelledby') || dlg?.getAttribute('aria-label'), active: document.activeElement?.outerHTML.slice(0, 100), inertEls } }); console.log('sheet', JSON.stringify(d));
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); } console.log('after tabs focus inside sheet?', await p.evaluate(() => !!document.activeElement.closest('.app-sheet'), ));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('focus after close', await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 100)));
  console.log(h.errs); await h.b.close();
})();
