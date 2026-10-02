const { run } = require('./lib.js');
run('IN-otp2', 'IN', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('what do I owe?'); await H.click(/^Pay /); await p.waitForTimeout(300);
  for (let k = 0; k < 3; k++) { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < ins.length; i++) await ins[i].fill('111111'[i]); if (ins.length === 1) await ins[0].fill('111111'); await p.locator('.app-sheet .gr-btn').last().click().catch(() => {}); await p.waitForTimeout(500) }
  H.log('t0', (await H.sheetText()).match(/Too many[^\n]*/)?.[0]);
  await p.waitForTimeout(62000); H.log('t+62s', (await H.sheetText())?.match(/Too many[^\n]*/)?.[0]);
  // try entering right code while locked
  const ins = await p.$$('.app-sheet input'); H.log('inputs disabled?', await Promise.all(ins.map(i => i.isDisabled())));
  const btn = p.locator('.app-sheet .gr-btn').last(); H.log('btn disabled', await btn.isDisabled(), await btn.textContent());
  // shift clock
  await p.evaluate(() => localStorage.setItem('tshift', String(16 * 60000)));
  await p.reload(); await p.waitForTimeout(800); await H.nav(3);
  await H.click(/^Pay /); await p.waitForTimeout(300); H.log('after shift', (await H.sheetText())?.replace(/\n/g, ' | ').slice(-200));
  const ok = await H.confirm(); H.log('paid', (await H.last()).text, JSON.stringify(await H.money()));
}, { init: () => { const s = +(localStorage.getItem('tshift') || 0); if (s) { const D = Date; const now = D.now; class X extends D { constructor(...a) { if (a.length) super(...a); else super(now() + s) } static now() { return now() + s } } window.Date = X } } });
