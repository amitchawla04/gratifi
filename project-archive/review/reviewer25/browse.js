const run = require('./h.js'); const m = process.argv[2] || 'UK';
run(`browse-${m}`, m, async h => {
  const { p, log, nav, shot, full, lastText } = h;
  await nav(2);
  const n = await p.locator('.gr-cattile').count(); log('tiles', n);
  for (let i = 0; i < n; i++) {
    await nav(2); await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(400);
    const tab = await p.evaluate(() => document.querySelector('.app')?.dataset.tab);
    const t = (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 420);
    log(i, tab, t);
    if (i === 0 || i === 7 || i === 16) await full('cat' + i);
    // tap first subcategory
    const sub = p.locator('.app-main .gr-chip, .app-main .gr-subcat, .app-main .gr-itemrow, .app-main .gr-card button').first();
    if (tab !== 'chat' && await sub.count()) { const st = await sub.innerText().catch(() => ''); await sub.click().catch(() => { }); await p.waitForTimeout(600); const tab2 = await p.evaluate(() => document.querySelector('.app')?.dataset.tab); log('   sub', JSON.stringify(st.slice(0, 40)), '->', tab2, tab2 === 'chat' ? (await lastText()).slice(0, 200) : '') }
  }
  await nav(1); await p.getByRole('button', { name: 'See flights' }).click(); await p.waitForTimeout(700); log('banner', await p.evaluate(() => document.querySelector('.app')?.dataset.tab), (await lastText()).slice(0, 300));
  await nav(1); await p.getByRole('button', { name: 'Show ideas' }).click(); await p.waitForTimeout(700); log('ideas', (await lastText()).slice(0, 300));
  await nav(1); await p.getByRole('button', { name: 'Add' }).first().click(); await p.waitForTimeout(700); log('offer add', await p.evaluate(() => document.querySelector('.app')?.dataset.tab), (await p.locator('.app-main').innerText()).replace(/\n+/g, ' | ').slice(0, 200));
}, {});
