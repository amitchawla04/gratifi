const { open } = require('./h.js');
(async () => { const h = await open('UK'); const { p } = h; await h.nav(3);
 await h.ask('Book a lounge', 800); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
 console.log(await h.last().locator('button').evaluateAll(bs => bs.map(b => (b.getAttribute('aria-label') || '') + '|' + b.innerText.trim()).join(' ;; ')));
 await h.close() })();
