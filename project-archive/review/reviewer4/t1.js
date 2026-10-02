const H = require('./h.js');
(async () => {
  const m = process.argv[2] || 'UK', th = process.argv[3] || 'light';
  const h = await H.start(m, th);
  await h.full('home'); await h.nav(2); await h.full('explore'); await h.nav(3); await h.full('chat'); await h.nav(4); await h.full('wallet'); await h.nav(5); await h.full('me');
  console.log(h.errs); await h.b.close();
})();
