const H = require('./h.js');
(async () => {
  await H.run('a11y', { m: 'UK' }, async (h) => { const { p, nav, ask, click, log } = h;
    const audit = async (tag) => log(tag, JSON.stringify(await p.evaluate(() => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 };
      const unl = [...document.querySelectorAll('button, [role=button], a, input, [role=switch], [role=radio], [role=checkbox], [role=tab]')].filter(vis).filter(e => !(e.innerText || '').trim() && !e.getAttribute('aria-label') && !e.getAttribute('aria-labelledby') && !(e.id && document.querySelector(`label[for="${e.id}"]`)) && !e.closest('label') && !e.getAttribute('placeholder') && !e.title).map(e => e.outerHTML.slice(0, 120));
      const small = [...document.querySelectorAll('button, [role=button], [role=radio], [role=switch]')].filter(vis).filter(e => { const r = e.getBoundingClientRect(); return r.height < 24 || r.width < 24 }).map(e => (e.getAttribute('aria-label') || e.innerText || '').slice(0, 20) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
      const imgs = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
      const h1 = [...document.querySelectorAll('h1,h2,h3')].map(e => e.tagName + ':' + e.innerText.slice(0, 20)).slice(0, 8);
      const live = [...document.querySelectorAll('[aria-live],[role=status],[role=log]')].map(e => e.className + ':' + e.getAttribute('aria-live')).slice(0, 5);
      return { unlabelled: unl.slice(0, 8), nUnl: unl.length, small: small.slice(0, 12), nSmall: small.length, imgsNoAlt: imgs, headings: h1, live, lang: document.documentElement.lang };
    })));
    await audit('HOME'); await nav(3); await ask('Flights to Lisbon on 16 Oct back 20 Oct for 2', 1200); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(700); await click(/^Continue with/, { w: 700 });
    await audit('CHAT');
    const ins = p.locator('.gr-answer').last().locator('input'); await ins.nth(1).fill('Priya Chawla'); await click('Continue', { exact: true, w: 900 }); await click(/^Pay /, { w: 800 });
    log('SHEET', JSON.stringify(await p.evaluate(() => { const d = document.querySelector('[role=dialog]'); return { role: !!d, modal: d && d.getAttribute('aria-modal'), label: d && (d.getAttribute('aria-labelledby') || d.getAttribute('aria-label')), focusIn: d && d.contains(document.activeElement), active: document.activeElement && document.activeElement.outerHTML.slice(0, 100) } })));
    for (let i = 0; i < 8; i++) await p.keyboard.press('Tab');
    log('after tabs focus in dialog?', await p.evaluate(() => !!document.querySelector('[role=dialog]')?.contains(document.activeElement)), await p.evaluate(() => document.activeElement.outerHTML.slice(0, 80)));
    await p.keyboard.press('Escape'); await p.waitForTimeout(500); log('focus returned to', await p.evaluate(() => document.activeElement.outerHTML.slice(0, 100)));
    // keyboard nav in chat: tab to a flight row
    log('focus-visible style', await p.evaluate(() => { const b = document.querySelector('.gr-btn'); b.focus(); const cs = getComputedStyle(b); return cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.boxShadow.slice(0, 60) }));
  });
})();
