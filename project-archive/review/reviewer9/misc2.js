const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-misc2', keep: true }); const { p, st, last } = h;
  await p.waitForTimeout(32000); await h.nav(3);
  const s = await st(); console.log('after 32s reopen', s.balance, s.card.balance, s.bookings.map(b => b.title + ':' + b.status).join(' / ')); console.log('LAST:', (await last()).slice(0, 300).replace(/\n/g, ' | '));
  await h.done();
})();
