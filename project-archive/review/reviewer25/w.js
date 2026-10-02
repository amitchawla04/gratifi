const run = require('./h.js');
run('w', 'UK', async h => { await h.nav(4); console.log(await h.p.locator('.app-main').evaluate(e => e.innerHTML.slice(0, 1500))); });
