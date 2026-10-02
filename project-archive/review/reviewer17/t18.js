const H = require('./h.js');
(async () => {
  await H.run('inert', { m: 'UK' }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth } = h; await nav(3);
    await ask('my card is cracked and won\'t tap', 1000); await click('Send a replacement', { w: 700 }); await auth();
    for (let i = 0; i < 8; i++) { const st = await p.evaluate(() => ({ inert: [...document.querySelectorAll('[inert]')].map(e => e.className).join(','), val: document.querySelector('.gr-ask input').value, dis: document.querySelector('.gr-ask input').disabled, busy: document.querySelector('.gr-ask')?.className, sheet: !!document.querySelector('.app-sheet') })); log(i, JSON.stringify(st)); await p.waitForTimeout(500); }
    await p.fill('.gr-ask input', 'block gambling'); log('val', await p.inputValue('.gr-ask input')); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(1200);
    log('val after', await p.inputValue('.gr-ask input')); log((await answers(1)).slice(0, 200));
  });
})();
