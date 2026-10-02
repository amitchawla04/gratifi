const H = require('./h.js'), F = require('./flhelp.js');
const big = process.argv[2] === 'big';
(async () => {
  await H.run(big ? 'big' : 'dark', { m: 'UK', theme: big ? 'light' : 'dark', init: big ? () => { document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = '200%' }) } : undefined }, async (h) => { const { p, page, full, nav, log, click, ask } = h;
    if (big) await p.evaluate(() => document.documentElement.style.fontSize = '200%');
    await page('home'); await nav(2); await page('explore');
    await nav(3); await ask('Flights to Lisbon on 16 Oct back 20 Oct for 2', 1200); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(800);
    await full('fares', 2200); await click(/^Continue with/, { w: 700 }); await full('seats', 2200);
    const ins = p.locator('.gr-answer').last().locator('input'); await ins.nth(1).fill('Priya Chawla'); await click('Continue', { exact: true, w: 900 }); await full('chk', 2200);
    await click(/^Pay /, { w: 800 }); await h.shot('sheet');
    const over = await p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('.app *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > W + 2) && !e.closest('.gr-rail,.app-rail,[class*=scroll-x],[class*=rail],.gr-fares,[class*=carousel]') }).slice(0, 10).map(e => e.className + ' ' + (e.innerText || '').slice(0, 30)) }); log('overflow', over);
    await p.keyboard.press('Escape'); await nav(4); await page('wallet'); await nav(5); await page('me');
  });
})();
