const H = require('./h.js');
const Q = process.argv.slice(3); const m = process.argv[2];
(async () => {
  await H.run('q' + m, { m }, async (h) => { const { p, answers, btns, log, nav, ask } = h;
    await nav(3);
    for (const q of Q) { if (q === '/clear') { await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(500); await nav(3); continue } await ask(q, 1100); const a = await answers(1); log('\n>>> ' + q + '\n' + a.split('\n').slice(0, 14).join(' | ').slice(0, 900)); const sh = await h.sheet(); if (sh) { log('   [SHEET] ' + sh.replace(/\n/g, ' | ').slice(0, 300)); await p.keyboard.press('Escape'); await p.waitForTimeout(400); if (await h.sheet()) { await p.locator('.app-sheet button[aria-label]').first().click().catch(()=>{}); await p.waitForTimeout(300) } } }
  });
})();
