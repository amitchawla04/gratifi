const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-old' }); const { p, ask, btn, shot, st, last } = h;
  await h.nav(3); await ask('flights to Lisbon on 10 Oct back 11 Oct');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/); await btn('Continue', { exact: true }); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await h.nav(5); await btn('Cancel my next flight'); await h.nav(3); await btn('Next flight', { exact: true });
  const s1 = await st(); console.log('bal', s1.balance, s1.card.balance, s1.bookings.length);
  await p.reload(); await p.waitForTimeout(700); await h.nav(3);
  const live = await p.evaluate(() => [...document.querySelectorAll('.app-scroll button:not([disabled])')].filter(b => b.offsetParent && !b.closest('.gr-nav') && !b.closest('.gr-ask')).map(b => b.innerText.trim().replace(/\n/g, ' ').slice(0, 30)));
  console.log('live buttons after reload:', JSON.stringify(live));
  for (const name of ['Full refund', 'Next flight', 'Continue with Standard', 'Compensation']) { const l = p.getByRole('button', { name, exact: true }); const n = await l.count(); for (let i = 0; i < n; i++) { if (await l.nth(i).isEnabled()) { await l.nth(i).scrollIntoViewIfNeeded(); await l.nth(i).click(); await p.waitForTimeout(500); console.log('tapped old', name, '->', (await last()).slice(0, 200).replace(/\n/g, ' | ')) } } }
  // old flight card
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); console.log('old flight card ->', (await last()).slice(0, 150).replace(/\n/g, ' | '));
  const s2 = await st(); console.log('bal', s2.balance, s2.card.balance, s2.bookings.map(b => b.status + ':' + b.when).join(' / '));
  console.log('ERR', await h.done());
})();
