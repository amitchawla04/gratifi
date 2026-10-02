const { open } = require('./h.js');
(async () => { for (const [tag, o] of [['dark', { theme: 'dark' }], ['z200', { zoom: '200%' }], ['ardark', { theme: 'dark' }]]) {
 const h = await open(tag === 'ardark' ? 'AR' : 'UK', { ...o, tag }); const { p } = h;
 await h.shot('home'); await h.nav(3); await h.ask(tag === 'ardark' ? 'ابي رحلة لمسقط يوم ١٠ أكتوبر' : 'Flights to Lisbon on 10 October', 1000); await h.shot('results');
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await h.shot('fares');
 await h.ask(tag === 'ardark' ? 'ابي تاكسي للمطار' : 'taxi to the airport', 900); await h.shot('ride');
 const c = h.last().locator('.gr-detail .gr-btn').last(); await c.click().catch(() => {}); await p.waitForTimeout(400); await h.click(/^(Pay |ادفع )/).catch(e => console.log('nopay')); await h.shot('sheet');
 const ov = await p.evaluate(() => { const out = []; document.querySelectorAll('.app *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('.gr-hscroll,[class*=scroll],[class*=carousel],[class*=rail]')) out.push(e.className + ':' + Math.round(r.left) + '-' + Math.round(r.right)) }); return [document.documentElement.scrollWidth, out.slice(0, 8)] }); console.log(tag, 'overflow', JSON.stringify(ov));
 await p.keyboard.press('Escape'); await h.nav(5); await h.shot('me');
 await h.close() } })();
