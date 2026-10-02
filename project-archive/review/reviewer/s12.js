const open = require('./h.js');
(async () => {
  const H = await open('AR', 'light', 'test.html', 's12'); const { p } = H;
  console.log(await p.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, appdir: getComputedStyle(document.querySelector('.app')).direction, rootdir: document.querySelector('.app').closest('[dir]')?.getAttribute('dir'), rootlang: document.querySelector('[lang]')?.getAttribute('lang') })));
  // switch market to UK via Me chips and check leftover arabic
  await H.nav(5); await p.getByRole('button', { name: 'المملكة المتحدة' }).click().catch(e=>console.log('chip fail', e.message.slice(0,80))); await p.waitForTimeout(600);
  const ar = await p.evaluate(() => { const out=[]; const w=document.createTreeWalker(document.querySelector('.app'),NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(/[؀-ۿ]/.test(n.nodeValue)) out.push(n.nodeValue.trim()) } return {out: out.slice(0,20), dir: getComputedStyle(document.querySelector('.app')).direction} });
  console.log('after switch to UK arabic left:', ar);
  await H.shot('switched');
  for (const i of [1,2,3,4]) { await H.nav(i); }
  const ar2 = await p.evaluate(() => { const out=[]; const w=document.createTreeWalker(document.querySelector('.app'),NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(/[؀-ۿ]/.test(n.nodeValue)) out.push(n.nodeValue.trim()) } return out.slice(0,20) });
  console.log('after tabs:', ar2);
  await H.close();
})();
