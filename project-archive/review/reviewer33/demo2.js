const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'demo2' }); const { p } = h;
 await h.nav(5); await h.click('Points come in (+5,000)'); await h.nav(5);
 await h.click('Reset demo'); await p.waitForTimeout(1500); await h.shot('after-reset');
 const s = await h.st(); console.log('after reset bal', s && s.balance, s && s.chat.length, 'url', p.url());
 await h.close() })();
