const open = require('./h.js');
(async () => {
  const H = await open('AR', 'light', 'test.html', 's6'); const { p } = H;
  const latin = new Map();
  const scan = async (where) => { const runs = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (/[A-Za-z]{2,}/.test(t)) out.push(t) } document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e => ['placeholder', 'aria-label', 'title'].forEach(a => { const v = e.getAttribute(a); if (v && /[A-Za-z]{2,}/.test(v)) out.push('@' + a + ':' + v) })); return out }); runs.forEach(r => { if (!latin.has(r)) latin.set(r, where) }) };
  for (const i of [1, 2, 3, 4, 5]) { await H.nav(i); await scan('tab' + i) }
  await H.nav(2); const n = await p.locator('.gr-cattile').count();
  for (let i = 0; i < n; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(250); await scan('cat' + i); await p.locator('.app-main .gr-ibtn').first().click(); await p.waitForTimeout(150) }
  await H.nav(3);
  const asks = ['رحلات إلى مسقط نهاية الأسبوع القادم لشخصين', 'طاولة الليلة', 'حليب وبيض وخبز', 'بطاقة هدية لصديق', 'جمّد بطاقتي', 'كم أدين؟', 'أين ذهبت أموالي؟', 'فقدت بطاقتي', 'حوّل النقاط إلى أميال', 'تأمين السفر', 'هل أحتاج تأشيرة لإسطنبول؟', 'اشتراكات', 'حفلات هذا الشهر', 'صالة المطار', 'تاكسي الآن', 'أشياء للقيام بها في مسقط', 'تبرع بالنقاط', 'استثمر النقاط في الذهب', 'أريد تقديم شكوى', 'احجز لي مركبة فضائية', 'Flights to Muscat', 'what can you do'];
  for (const a of asks) { await H.ask(a, 600); await scan('ask:' + a); console.log('ASK', a, '=>', (await H.last()).split('\n').filter(x => x.trim()).slice(0, 3).join(' | ').slice(0, 200)) }
  // go through a purchase: flight
  await H.ask('رحلات إلى مسقط يوم 16 أكتوبر', 600);
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await scan('fares'); await H.bottom('fares');
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await scan('seats'); await H.bottom('seats');
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await scan('checkout'); await H.bottom('checkout');
  await H.pay(); await scan('sheet'); await H.shot('sheet'); await H.confirm(); await p.waitForTimeout(2300); await scan('receipt'); await H.bottom('receipt');
  await H.nav(4); await scan('wallet'); await H.shot('wallet');
  await H.btn(/بطاقة|الصعود|عرض/).catch(() => { }); await scan('pass'); await H.bottom('pass');
  await H.nav(5); await H.btn(await p.evaluate(() => window.__tr('Cancel my next flight'))); await scan('disruption'); await H.bottom('disruption');
  console.log('\n=== LATIN TEXT IN AR ===');
  for (const [k, v] of latin) console.log(v.padEnd(14).slice(0, 30), '|', k.slice(0, 140));
  await H.close();
})();
