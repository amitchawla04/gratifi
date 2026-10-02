const H = require('./h.js');
(async () => {
  await H.run('gift', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log } = h; await nav(3);
    await ask('A gift card for a friend', 1000); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(600);
    const ins = p.locator('.gr-answer').last().locator('input'); await ins.nth(0).fill('Sam'); await ins.nth(1).fill('not-an-email'); await p.waitForTimeout(300);
    const cta = p.locator('.gr-answer').last().locator('.gr-btn').last(); log('cta', await cta.innerText(), await cta.isDisabled());
  });
})();
