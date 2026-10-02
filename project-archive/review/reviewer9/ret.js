const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-ret' }); const { p, ask, btn, st, last, shot } = h;
  await h.nav(3);
  await ask('Rain shell jacket'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Card/, { role: 'radio' }); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await h.nav(5); await btn('Deliver my order'); await h.nav(3); await ask('return my jacket'); await btn('Book free collection');
  let s = await st(); console.log('before', s.balance, s.card.balance);
  await p.goto('about:blank'); await p.waitForTimeout(31000); await p.goto(h.url); await p.waitForTimeout(1500); await h.nav(3);
  s = await st(); console.log('after reload', s.balance, s.card.balance, s.bookings.map(b => b.title + ':' + b.status + JSON.stringify(b.refunded || {})).join(' / ')); console.log('LAST:', (await last()).slice(0, 300).replace(/\n/g, ' | ')); await shot('after');
  // claim flow on a second item
  await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Card/, { role: 'radio' }); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await h.nav(5); await btn('Deliver my order'); await h.nav(3); await ask('my headphones arrived broken'); await btn('Send claim');
  s = await st(); console.log('claim before', s.balance, s.card.balance);
  await p.waitForTimeout(42000); s = await st(); console.log('claim after', s.balance, s.card.balance, s.bookings.map(b => b.title.slice(0, 20) + ':' + b.status).join(' / ')); console.log('LAST:', (await last()).slice(0, 300).replace(/\n/g, ' | '));
  console.log('ledger', JSON.stringify(s.ledger.slice(0, 5).map(l => l.label + ' ' + l.pts)));
  console.log('ERR', await h.done());
})();
