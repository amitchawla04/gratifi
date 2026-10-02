const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tab: 'me' }); const { p } = h;
  console.log(await p.evaluate(() => { const box = [...document.querySelectorAll('*')].find(e => /^Demo controls/.test(e.innerText || '') && e.children.length > 2); return box ? box.outerHTML.replace(/<svg.*?<\/svg>/g, '').slice(0, 2500) : 'none' }));
  await h.b.close();
})();
