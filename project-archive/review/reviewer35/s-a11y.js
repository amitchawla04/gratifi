const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'a11y' });
  const { p, nav, ask, click, log, errs } = h;
  try {
    const unnamed = await p.evaluate(() => [...document.querySelectorAll('button,a,[role=button],input,[role=switch]')].filter(e => { const n = (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || e.getAttribute('placeholder') || '').trim(); return !n && !e.labels?.length }).map(e => e.outerHTML.slice(0, 120)));
    log('unnamed home', unnamed.length, JSON.stringify(unnamed.slice(0, 8)));
    log('landmarks', await p.evaluate(() => ({ main: document.querySelectorAll('main,[role=main]').length, nav: document.querySelectorAll('nav,[role=navigation]').length, h1: [...document.querySelectorAll('h1')].map(x => x.innerText), lang: document.documentElement.lang })));
    await nav(5);
    const un2 = await p.evaluate(() => [...document.querySelectorAll('button,[role=switch],input')].filter(e => { const n = (e.getAttribute('aria-label') || e.innerText || '').trim(); const lb = e.getAttribute('aria-labelledby'); return !n && !lb && !e.labels?.length }).map(e => e.outerHTML.slice(0, 160)));
    log('unnamed me', un2.length, JSON.stringify(un2.slice(0, 8)));
    await nav(3); await ask('pay £50 off my bill'); 
    log('sheet', await p.evaluate(() => { const s = document.querySelector('.app-sheet'); const d = s?.closest('[role=dialog]') || s; return { role: d?.getAttribute('role'), modal: d?.getAttribute('aria-modal'), label: d?.getAttribute('aria-labelledby') || d?.getAttribute('aria-label'), active: document.activeElement?.outerHTML.slice(0, 100), inert: [...document.querySelectorAll('[inert]')].map(x => x.className.slice(0, 30)) } }));
    for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); log('tab', i, await p.evaluate(() => (document.activeElement?.closest('.app-sheet') ? 'IN ' : 'OUT ') + (document.activeElement?.innerText || document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName).slice(0, 40))) }
    await p.keyboard.press('Escape'); await p.waitForTimeout(300); log('after esc focus', await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 100)));
    log('live region', await p.evaluate(() => [...document.querySelectorAll('[aria-live],[role=log],[role=status]')].map(e => e.className.slice(0, 30) + ':' + (e.getAttribute('aria-live') || e.getAttribute('role'))).slice(0, 6)));
  } catch (e) { log('FAIL', e.message.split('\n')[0]) }
  log('errs', errs); await h.b.close();
})();
