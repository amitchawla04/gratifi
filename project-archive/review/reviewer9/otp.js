const H = require('./h.js');
(async () => {
  const h = await H.open('IN', { tag: 'IN-otp' }); const { p, ask, btn, shot, st, sheetText } = h;
  await h.nav(3); await ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  await btn(/^Card/, { role: 'radio' }); await shot('checkout');
  const s0 = await st(); console.log('before bal', s0.balance, 'card', s0.card.balance, 'bookings', s0.bookings.length);
  await btn(/^Pay /); await shot('sheet'); console.log('SHEET:', await sheetText());
  console.log('focused', await p.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label')));
  // wrong code typed
  await p.keyboard.type('111111'); await shot('typed-wrong'); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await shot('wrong1'); console.log('after wrong1:', await sheetText());
  console.log('focused after wrong', await p.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label')));
  // second wrong via paste
  await p.evaluate(() => { const i = document.querySelector('.app-sheet input'); const dt = new DataTransfer(); dt.setData('text', '222 222'); i.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })) }); await p.waitForTimeout(200);
  console.log('vals after paste', await p.evaluate(() => [...document.querySelectorAll('.app-sheet input')].map(i => i.value).join('')));
  await p.keyboard.press('Enter'); await p.waitForTimeout(300); await shot('wrong2'); console.log('after wrong2:', await sheetText());
  // close and reload, check counter survives
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); console.log('sheet closed?', (await sheetText()) === null);
  const s1 = await st(); console.log('after close bal', s1.balance, 'card', s1.card.balance, 'bookings', s1.bookings.length, 'otp', JSON.stringify(s1.seen.otp));
  await p.reload(); await p.waitForTimeout(600); await h.nav(3);
  await btn(/^Pay /); console.log('reopen after reload:', await sheetText()); await shot('reopen');
  await p.keyboard.type('333333'); await p.keyboard.press('Enter'); await p.waitForTimeout(300); await shot('locked'); console.log('after wrong3:', await sheetText());
  console.log('inputs disabled', await p.evaluate(() => [...document.querySelectorAll('.app-sheet input')].every(i => i.disabled)));
  await p.keyboard.press('Escape'); await p.reload(); await p.waitForTimeout(600); await h.nav(3); await btn(/^Pay /); console.log('after reload locked:', await sheetText());
  // time travel 16 min
  await p.keyboard.press('Escape');
  await p.evaluate(() => { const k = 'gratifi-state-v3-IN'; const s = JSON.parse(localStorage.getItem(k)); s.seen.otp.at -= 16 * 60000; localStorage.setItem(k, JSON.stringify(s)) });
  await p.reload(); await p.waitForTimeout(600); await h.nav(3); await btn(/^Pay /); console.log('after 16 min:', await sheetText());
  // correct code via typing one box at a time using fill
  await p.keyboard.type('482193'); await p.waitForTimeout(100); console.log('vals', await p.evaluate(() => [...document.querySelectorAll('.app-sheet input')].map(i => i.value).join('')));
  await p.keyboard.press('Enter'); await p.waitForTimeout(500); await shot('scanning'); await p.waitForTimeout(2500); await shot('after', true);
  const s2 = await st(); console.log('after pay bal', s2.balance, 'card', s2.card.balance, 'bookings', s2.bookings.length, s2.bookings[0] && JSON.stringify({ t: s2.bookings[0].title, card: s2.bookings[0].card, pts: s2.bookings[0].pts, earned: s2.bookings[0].earned }));
  console.log('ERR', await h.done());
})();
