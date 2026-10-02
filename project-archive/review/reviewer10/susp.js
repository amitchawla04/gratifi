const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`susp-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(5); await click(m==='AR'?'دفعة مشبوهة':'Suspicious payment'); await p.waitForTimeout(500); await nav(3);
  log('S', await lastText()); let s=await st(); log('frozen', s.card.frozen);
  await click(m==='AR'?'لم أكن أنا':"It wasn't me"); await p.waitForTimeout(500); log('NOTME', await lastText()); await full('notme');
  await nav(5); await click(m==='AR'?'دفعة مشبوهة':'Suspicious payment'); await p.waitForTimeout(500); await nav(3);
  await click(m==='AR'?'كنت أنا':'It was me'); await p.waitForTimeout(500); log('ME', await lastText()); if (await p.$('.app-sheet')) { log('sheet', (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' ')); await confirm() } log('ME2', await lastText());
  s=await st(); log('frozen', s.card.frozen, 'card', s.card.balance); await full('wasme');
});
