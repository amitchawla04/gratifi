const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-a11y' }); const { p, ask, btn, shot } = h;
  const audit = async (label) => console.log(label, JSON.stringify(await p.evaluate(() => {
    const name = el => (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').trim();
    const unnamed = [...document.querySelectorAll('button,a,[role=button],input,select,textarea,[role=switch],[role=radio]')].filter(el => el.offsetParent !== null && !name(el) && !(el.labels && el.labels.length) && !el.getAttribute('placeholder')).map(el => el.outerHTML.slice(0, 120));
    const live = [...document.querySelectorAll('[aria-live],[role=status],[role=log],[role=alert]')].map(e => e.tagName + '.' + e.className + ':' + (e.getAttribute('aria-live') || e.getAttribute('role')));
    const imgs = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
    const smallTargets = [...document.querySelectorAll('button,a,[role=button]')].filter(el => { const r = el.getBoundingClientRect(); return el.offsetParent && r.width > 0 && (r.height < 24 || r.width < 24) }).map(el => name(el).slice(0, 20) + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height));
    return { unnamed: unnamed.slice(0, 8), nUnnamed: unnamed.length, live: live.slice(0, 6), imgsNoAlt: imgs, small: smallTargets.slice(0, 10), lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length };
  })));
  await audit('home'); await h.nav(2); await audit('explore'); await h.nav(4); await audit('wallet'); await h.nav(5); await audit('me');
  await h.nav(3); await ask('Flights to Lisbon next weekend for two'); await audit('chat-flights');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await audit('fares');
  console.log('radiogroups', await p.evaluate(() => [...document.querySelectorAll('[role=radiogroup],fieldset')].map(e => e.tagName + ':' + (e.getAttribute('aria-label') || (e.querySelector('legend') || {}).innerText || '')).slice(0, 8)));
  // keyboard only: tab through fare radios
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(400); console.log('enter on itemrow opened detail?', await p.locator('.gr-answer').last().locator('.gr-detail').count());
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300);
  await p.getByRole('button', { name: /^Pay / }).last().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const seq = []; for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => { const a = document.activeElement; return (a.closest('.app-sheet') ? 'IN:' : 'OUT:') + (a.getAttribute('aria-label') || a.innerText || a.tagName).slice(0, 20) })) } console.log('tab seq', seq.join(' | '));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('after esc focus', await p.evaluate(() => (document.activeElement.innerText || document.activeElement.tagName).slice(0, 30)), 'sheet', !!(await h.sheetText()));
  // text size 200%
  await p.evaluate(() => document.documentElement.style.fontSize = '200%'); await p.waitForTimeout(300); await shot('text200'); 
  console.log('hscroll', await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth, [...document.querySelectorAll('.gr-answer')].slice(-2).map(a => a.scrollWidth + '/' + a.clientWidth)]));
  await h.nav(1); await shot('home200'); await h.nav(4); await shot('wallet200');
  console.log('ERR', await h.done());
})();
