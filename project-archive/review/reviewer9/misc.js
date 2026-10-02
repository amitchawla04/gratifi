const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-misc' }); const { p, ask, btn, shot, st, last } = h;
  await h.nav(3);
  await ask('hotel in Lisbon for 2 nights from Friday for 3 adults'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await shot('stay3'); console.log('STAY3:', (await last()).slice(-420).replace(/\n/g, ' | '));
  // bump guests to 5
  const plus = p.locator('.gr-answer').last().getByRole('button', { name: /Increase|more|\+/i }); console.log('plus buttons', await plus.count());
  await ask('Travel insurance'); await p.locator('.gr-answer').last().getByRole('button', { name: 'Get this cover' }).first().click(); await p.waitForTimeout(400); await shot('insfacts'); console.log('INS:', (await last()).slice(0, 700).replace(/\n/g, ' | '));
  // return with timer + reload
  await ask('Rain shell jacket'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await btn(/^Card/, { role: 'radio' }); await btn(/^Pay /); await btn(/Face ID/, { w: 2000 }); await p.waitForTimeout(2500);
  await h.nav(5); await btn('Deliver my order'); await h.nav(3); await ask('return my jacket'); console.log('RET:', (await last()).slice(0, 300).replace(/\n/g, ' | ')); await btn('Book free collection'); console.log('RET2:', (await last()).slice(0, 200).replace(/\n/g, ' | '));
  let s = await st(); console.log('before', s.balance, s.card.balance);
  await p.reload(); await p.waitForTimeout(1000); await p.close().catch(() => {});
  console.log('ERR', await h.done());
})();
