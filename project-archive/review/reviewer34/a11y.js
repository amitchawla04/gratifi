const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'a11y' }); const { p } = h;
 const audit = async (label) => console.log(label, JSON.stringify(await p.evaluate(() => {
  const unl = [...document.querySelectorAll('button, [role=button], a, input, [role=switch], [role=radio], [role=checkbox]')].filter(e => e.offsetParent !== null && !(e.getAttribute('aria-label') || e.textContent.trim() || e.getAttribute('title') || (e.labels && e.labels.length) || e.getAttribute('placeholder') || e.getAttribute('aria-labelledby'))).map(e => e.tagName + '.' + e.className.toString().slice(0, 40));
  const imgs = [...document.querySelectorAll('img, svg')].filter(e => e.offsetParent !== null && e.tagName === 'IMG' && !e.hasAttribute('alt')).length;
  const small = [...document.querySelectorAll('button')].filter(e => { const r = e.getBoundingClientRect(); return e.offsetParent && r.width > 0 && (r.height < 24 || r.width < 24) }).map(e => (e.textContent.trim() || e.getAttribute('aria-label') || '').slice(0, 20) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
  const live = [...document.querySelectorAll('[aria-live]')].map(e => e.getAttribute('aria-live') + ':' + e.className.toString().slice(0, 30));
  return { unl: unl.slice(0, 10), nUnl: unl.length, imgsNoAlt: imgs, small: small.slice(0, 10), live, lang: document.documentElement.lang, dir: document.documentElement.dir, h1: [...document.querySelectorAll('h1,h2')].map(e => e.textContent.slice(0, 20)).slice(0, 5) } })));
 await audit('home'); await h.nav(3); await h.ask('flights to lisbon on 10 october', 900); await audit('chat');
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await audit('fares');
 await h.ask('pay my bill', 800); await p.getByRole('button', { name: /^Pay / }).last().click(); await p.waitForTimeout(400);
 console.log('sheet', JSON.stringify(await p.evaluate(() => { const s = document.querySelector('.app-sheet'); const d = s && (s.closest('[role=dialog]') || s.querySelector('[role=dialog]') || (s.getAttribute('role') === 'dialog' ? s : null)); return { role: d && d.getAttribute('role'), modal: d && d.getAttribute('aria-modal'), label: d && (d.getAttribute('aria-label') || d.getAttribute('aria-labelledby')), active: document.activeElement && (document.activeElement.textContent || document.activeElement.className).slice(0, 40), inert: [...document.querySelectorAll('[inert]')].map(e => e.className.toString().slice(0, 30)) } })));
 for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); } console.log('focus after tabs:', await p.evaluate(() => { const a = document.activeElement; return (a.textContent || a.getAttribute('aria-label') || a.tagName).slice(0, 30) + ' insheet=' + !!a.closest('.app-sheet') }));
 await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('after esc focus:', await p.evaluate(() => (document.activeElement.textContent || document.activeElement.tagName).slice(0, 30)));
 await h.nav(5); await audit('me');
 await h.close() })();
