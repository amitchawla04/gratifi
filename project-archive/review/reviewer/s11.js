const open = require('./h.js');
(async () => {
  const H = await open('UK', process.argv[2] || 'light', 'test.html', 's11'); const { p } = H;
  const audit = async (where) => {
    const r = await p.evaluate(() => {
      const out = { noName: [], small: [], lowContrast: [] };
      const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(x => { x = +x / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) }); return 0.2126 * r + 0.7152 * g + 0.0722 * b };
      const bgOf = el => { while (el) { const c = getComputedStyle(el).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) { const a = c.match(/[\d.]+/g); if (!a[3] || +a[3] > 0.9) return c } el = el.parentElement } return 'rgb(255,255,255)' };
      document.querySelectorAll('button, [role=button], [role=switch], [role=radio], input, a, [role=tab]').forEach(el => {
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
        const name = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || el.getAttribute('placeholder') || '').trim();
        if (!name && !(el.labels && el.labels.length)) out.noName.push(el.outerHTML.slice(0, 120));
        if ((r.height < 32 || r.width < 32) && el.type !== 'checkbox') out.small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${name.slice(0, 30) || el.className}`);
        if (el.type === 'checkbox' && (r.height < 24)) out.small.push(`checkbox ${Math.round(r.width)}x${Math.round(r.height)}`);
      });
      const w = document.createTreeWalker(document.querySelector('.app'), NodeFilter.SHOW_TEXT); let n; const seen = new Set();
      while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (!t) continue; const el = n.parentElement; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.5) continue; const fg = lum(cs.color), bg = lum(bgOf(el)); if (fg == null || bg == null) continue; const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05); const size = parseFloat(cs.fontSize); const need = size >= 18.66 || (size >= 14 && +cs.fontWeight >= 700) ? 3 : 4.5; if (ratio < need) { const k = t.slice(0, 30) + ' ' + ratio.toFixed(2) + ' ' + cs.color + ' on ' + bgOf(el) + ' ' + size + 'px'; if (!seen.has(k)) { seen.add(k); out.lowContrast.push(k) } } }
      return out
    });
    console.log('== ' + where); console.log(' noName:', r.noName.slice(0, 8)); console.log(' small:', [...new Set(r.small)].slice(0, 25).join(' ; ')); console.log(' lowContrast:', r.lowContrast.slice(0, 15).join('\n   '));
  };
  await audit('home'); await H.nav(2); await audit('explore'); await H.nav(3); await audit('chat-empty');
  await H.ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.btn(/Continue with/); await audit('seats');
  await H.btn('Continue', true); await audit('checkout');
  await H.nav(5); await audit('me');
  // keyboard focus visibility
  await H.nav(1); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  const f = await p.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return e.outerHTML.slice(0, 80) + ' outline=' + cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor + ' shadow=' + cs.boxShadow });
  console.log('FOCUS:', f); await H.shot('focus');
  const lang = await p.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, title: document.title, vp: document.querySelector('meta[name=viewport]')?.content }));
  console.log(lang);
  await H.close();
})();
