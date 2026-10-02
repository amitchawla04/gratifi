const { open } = require('./h.js');
(async () => {
  const [market = 'UK', theme = 'light'] = process.argv.slice(2);
  const h = await open({ market, theme, tag: 'tabs-' + theme });
  const { p, full, nav, log, errs } = h;
  for (const [i, n] of [[1, 'home'], [2, 'explore'], [3, 'chat'], [4, 'wallet'], [5, 'me']]) { await nav(i); await full(n); }
  log('errs', errs); await h.b.close();
})();
