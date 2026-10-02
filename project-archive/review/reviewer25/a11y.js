const run = require('./h.js'); const m = process.argv[2] || 'UK'; const th = process.argv[3] || 'light';
run(`a11y-${m}-${th}`, m, async h => {
  const { p, ask, last, btn, log, nav } = h;
  const audit = async (tag) => log(tag, JSON.stringify(await p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' };
    const name = e => (e.getAttribute('aria-label') || e.textContent || e.getAttribute('title') || '').trim();
    const nb = [...document.querySelectorAll('button, [role=button], a')].filter(vis).filter(e => !name(e)).map(e => e.outerHTML.slice(0, 90));
    const ni = [...document.querySelectorAll('input, textarea, select')].filter(vis).filter(e => !(e.getAttribute('aria-label') || e.labels?.length || e.getAttribute('aria-labelledby') || e.placeholder)).map(e => e.outerHTML.slice(0, 90));
    const small = [...document.querySelectorAll('button, [role=button], [role=switch], a, input[type=checkbox]')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return [name(e).slice(0, 20), Math.round(r.width), Math.round(r.height)] }).filter(x => x[1] < 24 || x[2] < 24);
    // contrast
    const lum = c => { const m = c.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]) };
    const bg = e => { while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; e = e.parentElement } return 'rgb(255,255,255)' };
    const low = []; document.querySelectorAll('.app *').forEach(e => { if (!vis(e) || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; const cs = getComputedStyle(e); const L1 = lum(cs.color), L2 = lum(bg(e)); const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05); const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.6 && +cs.fontWeight >= 700); if (r < (big ? 3 : 4.5)) low.push(e.textContent.trim().slice(0, 30) + ' ' + r.toFixed(2)) });
    return { noNameBtn: nb.slice(0, 6), noLabelInput: ni.slice(0, 6), smallTargets: small.slice(0, 12), lowContrast: [...new Set(low)].slice(0, 20), lang: document.documentElement.lang, dir: document.documentElement.dir };
  })));
  await audit('home'); await nav(5); await audit('me'); await nav(3);
  await ask('Hush headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await audit('detail');
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Pay /);
  log('sheet', JSON.stringify(await p.evaluate(() => { const s = document.querySelector('.app-sheet'); const d = s?.closest('[role=dialog]') || (s?.getAttribute('role') === 'dialog' ? s : null) || document.querySelector('[role=dialog]'); return { role: d?.getAttribute('role'), modal: d?.getAttribute('aria-modal'), label: d?.getAttribute('aria-labelledby') || d?.getAttribute('aria-label'), focusInSheet: !!s?.contains(document.activeElement), active: document.activeElement?.outerHTML.slice(0, 80), inert: [...document.querySelectorAll('[inert]')].map(e => e.className).slice(0, 4) } })));
  for (let i = 0; i < 6; i++) await p.keyboard.press('Tab'); log('after tabs, focus in sheet?', await p.evaluate(() => !!document.querySelector('.app-sheet')?.contains(document.activeElement)));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); log('focus after close', await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 80)));
  log('live regions', await p.evaluate(() => [...document.querySelectorAll('[aria-live]')].map(e => e.className + ':' + e.getAttribute('aria-live'))));
}, { theme: th });
