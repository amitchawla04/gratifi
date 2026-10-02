const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const h = await H.start('AR'); const { p } = h;
  const found = new Map();
  const scan = async (where) => {
    const xs = await p.evaluate(() => {
      const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) { const t = n.textContent.trim(); if (/[A-Za-z]{3,}/.test(t) && !/^[A-Z0-9 ·\-,.:]+$/.test(t)) out.push(t.slice(0, 90)) }
      document.querySelectorAll('[aria-label],[placeholder]').forEach(e => { const t = (e.getAttribute('aria-label') || '') + '|' + (e.getAttribute('placeholder') || ''); if (/[A-Za-z]{3,}/.test(t)) out.push('ATTR ' + t.slice(0, 90)) });
      return out;
    });
    xs.forEach(x => { if (!found.has(x)) found.set(x, where) });
  };
  const flows = [
    ['nav', async () => { for (let i = 1; i <= 5; i++) { await h.nav(i); await scan('tab' + i) } }],
    ['explore', async () => { await h.nav(2); const n = await p.locator('.gr-cattile').count(); for (let i = 0; i < n; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(200); await scan('cat' + i); await p.locator('.app-main [aria-label], .app-main .gr-ibtn').first().click(); await p.waitForTimeout(150) } }],
  ];
  const asks = ['رحلات إلى مسقط نهاية الأسبوع القادم لشخصين', 'فندق في مسقط', 'احجز صالة', 'طاولة لشخصين الليلة', 'حليب وبيض وخبز', 'سماعات عازلة للضوضاء', 'بطاقة هدية لصديق', 'ما الاشتراكات المشمولة؟', 'حفلات هذا الشهر', 'تاكسي الآن', 'أشياء للقيام بها في مسقط', 'حوّل النقاط إلى أميال', 'استثمر النقاط في الذهب', 'تبرع بالنقاط', 'هل أحتاج إلى تأشيرة لمسقط؟', 'تأمين السفر', 'شريحة eSIM', 'ماذا تغطي بطاقتي؟', 'كم أدين؟', 'جمّد بطاقتي', 'فقدت بطاقتي', 'أين ذهبت أموالي؟', 'عروض البطاقة', 'طرق لكسب المزيد', 'أريد تقديم شكوى', 'طاولة في مطعم محجوز بالكامل', 'كشف الحساب', 'حد الائتمان', 'مرحبا', 'أين طلبي؟', 'ألغِ رحلتي'];
  try {
    for (const [n, f] of flows) await f();
    await h.nav(3);
    for (const a of asks) { await h.ask(a); await scan(a) }
    // open details in a few
    await h.ask('فندق في مسقط'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await scan('hotel detail');
    await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await scan('hotel checkout');
    await X.payLast(h); await scan('hotel receipt');
    await h.ask('ألغِ الفندق'); await scan('cancel hotel');
    await X.bookFlight(h, 'رحلات إلى مسقط يوم 16 أكتوبر لشخصين'); await scan('flight checkout'); await X.payLast(h); await scan('flight receipt');
    await h.ask('غيّر رحلتي'); await scan('change'); await h.ask('غيّر مقعدي'); await scan('seat');
    await h.nav(4); await scan('wallet'); await p.getByRole('button', { name: /اعرض التصريح|بطاقة الصعود/ }).first().click().catch(() => {}); await scan('pass');
    await h.nav(5); await h.btn(/دفعة مشبوهة/).catch(() => {}); await scan('fraud');
    await h.nav(5); await h.btn(/أخّر طلبي/).catch(() => {}); await scan('late');
    await h.nav(5); await h.btn(/ألغِ رحلتي القادمة/).catch(() => {}); await scan('disruption');
    await h.full('ar-end');
  } catch (e) { console.log('ERR', e.message.split('\n')[0]) }
  const brands = /Coastline|Northway|Aurora|Gratifi|Screenly|Tunewave|Pagebound|Daily Ledger|Fitloop|Cloudkeep|Byte Store|Stride|Glow|Pantry|Harbour|Bloom|Reel House|Table Collective|Lumen|Café|Cedar|Garden|Palm|Courtyard|Tidewater|Lantern|Clean Seas|Books for Every|Warm Homes|eSIM|GR-|GIFT-|Amit|Sam Taylor|AMIT|Sabr|Arlo|Riverside|Glass Garden|Ride Now|Fuel Stop/;
  for (const [t, w] of found) if (!brands.test(t)) console.log(`[${w}] ${t}`);
  console.log('---brand-ish count', [...found.keys()].filter(t => brands.test(t)).length);
  console.log(h.errs); await h.b.close();
})();
