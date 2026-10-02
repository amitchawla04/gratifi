const { run } = require('./lib.js');
run('UK-exit2', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('flights to Lisbon 14 Oct back 18 Oct for 2 adults and a 7 year old');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.click(/Continue with/);
  const a = p.locator('.gr-answer').last();
  const chips = await a.locator('button').evaluateAll(es => es.map(e => e.innerText).filter(t => /·/.test(t))); H.log('chips', chips);
  await a.locator('button', { hasText: 'Child 1 ·' }).first().click(); await p.waitForTimeout(200);
  await a.locator('.gr-seat[aria-label^="Seat 14E"]').click({ force: true }); await p.waitForTimeout(300);
  H.log('after', await a.locator('button').evaluateAll(es => es.map(e => e.innerText).filter(t => /·/.test(t))), (await H.lastText()).match(/[^\n]*(xit|children|Children)[^\n]*/g));
  await H.shot('x');
});
