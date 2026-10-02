const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-mic' }); const { p, ask, shot, st } = h;
  await h.nav(3); await ask('hello');
  await p.locator('.gr-ask button').last().click(); await p.waitForTimeout(600); await shot('mic'); console.log('after mic:', await p.evaluate(() => document.querySelector('.gr-ask').innerText), (await h.last()).slice(0,200));
  await p.getByRole('button', { name: 'Clear' }).click(); await p.waitForTimeout(400); await shot('clear'); const s = await st(); console.log('chat len after clear', s.chat.length);
  console.log(await h.done());
})();
