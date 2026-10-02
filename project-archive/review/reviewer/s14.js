const open = require('./h.js');
(async () => {
  const H = await open('UK', 'light', 'test.html', 's14'); const { p } = H;
  await H.nav(5);
  await H.btn(/Points come in/); let S = await H.state(); console.log('pts', S.balance, 'ledger0', S.ledger[0].label);
  await H.btn('A card payment'); S = await H.state(); console.log('card bal', S.card.balance, 'due', S.card.due, 'pts', S.balance, 'tab', await p.evaluate(()=>document.querySelector('.app').dataset.tab));
  await H.btn('Cancel my next flight'); console.log('tab', await p.evaluate(()=>document.querySelector('.app').dataset.tab), 'LAST:', (await H.last()).slice(0,200));
  await H.nav(5); await H.btn('Delay my order'); console.log('DELAY none:', (await H.last()).slice(0,200));
  await H.nav(5); await H.btn('Suspicious payment'); console.log('FRAUD:', (await H.last()).replace(/\n/g,' | ')); await H.bottom('fraud');
  await H.btn('It was me'); S = await H.state(); console.log('IT WAS ME:', (await H.last()).slice(0,120), 'frozen', S.card.frozen);
  // toggle via demo panel switches while in AR? skip. Reset
  await H.nav(5); await H.btn('Reset demo'); await p.waitForTimeout(400); S = await H.state(); console.log('after reset pts', S.balance, 'chat', S.chat.length, 'bookings', S.bookings.length);
  // Home moment 'Not now' and bell
  await H.nav(1); await H.btn('Not now'); console.log('HOME after not now:', (await H.text()).split('\n').slice(0,14).join(' | '));
  await H.btn('Add'); console.log('offer add ->', (await H.text()).includes('Added'));
  await H.nav(2); await H.nav(1); console.log('offer persisted?', (await H.text()).includes('Added'));
  // bell
  await p.getByRole('button', { name: /Alerts|alerts/ }).click(); await p.waitForTimeout(300); console.log('bell -> tab', await p.evaluate(()=>document.querySelector('.app').dataset.tab));
  // Forget buttons
  await H.nav(5); const forget = p.getByRole('button', { name: 'Forget' }); await forget.nth(0).click(); await forget.nth(2).click(); await p.waitForTimeout(200);
  console.log('remembers:', (await H.text()).split('What Gratifi remembers')[1].split('Demo')[0].replace(/\n/g,' | '));
  // mic
  await H.nav(3); await p.locator('.gr-ask button').last().click(); await p.waitForTimeout(300); console.log('MIC:', (await H.last()).slice(0,100));
  await H.close();
})();
