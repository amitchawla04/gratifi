const { open } = require('./h.js');
(async () => {
  const h = await open({ market: 'UK', tag: 'rcpt' });
  const { p, full, nav, ask, click, confirm, log, errs, shot, lastText, state } = h;
  try {
    await nav(3); await ask('Flights to Lisbon on 9 Oct back 11 Oct for two'); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await click(/Continue with/);
    { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
    await click('Continue', { exact: true }); await click(/^Pay /); await confirm();
    const rc = async () => p.evaluate(() => [...document.querySelectorAll('.gr-answer')].map(a => a.innerText).find(t => /Confirmed|Booked/.test(t) && /Paid/.test(t))?.replace(/\s+/g, ' ').slice(0, 600));
    log('RECEIPT0', await rc());
    await ask('move my return flight to the 13th', 900); const b = p.locator('.gr-answer').last().locator('.gr-btn:not([disabled])').last(); await b.click(); await p.waitForTimeout(600); if (await p.$('.app-sheet')) await confirm();
    log('RECEIPT after change', await rc());
    await nav(4); await nav(3); await p.reload(); await p.waitForTimeout(800); await nav(3);
    log('RECEIPT after reload', await rc());
    await full('chat');
  } catch (e) { log('FAIL', e.message.split('\n')[0]); await shot('fail') }
  log('errs', errs); await h.b.close();
})();
