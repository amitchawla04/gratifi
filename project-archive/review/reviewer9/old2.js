const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-old2' }); const { p, ask, btn, shot } = h;
  await h.nav(3); await ask('flights to Lisbon on 10 Oct back 11 Oct');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await btn(/Continue with/); await btn('Continue', { exact: true });
  const fares = p.locator('.gr-answer').filter({ hasText: 'RETURN ON' }).last();
  await fares.getByRole('radio').first().click().catch(e => console.log('radio', e.message.slice(0, 60))); await p.waitForTimeout(300);
  await fares.locator('button', { hasText: '09:40' }).click().catch(e => console.log('ret', e.message.slice(0, 60))); await p.waitForTimeout(300);
  await fares.scrollIntoViewIfNeeded(); await p.screenshot({ path: 'p/UK-old2-fares-after-lock.png' });
  console.log(await fares.innerText());
  await h.done();
})();
