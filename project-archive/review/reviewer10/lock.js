const run=require('./h.js');
run(`lock-IN`, 'IN', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const txt=async()=>(await p.locator('.app-sheet').innerText().catch(()=>'NONE')).replace(/\s+/g,' ');
  await nav(3); await ask('What do I owe?'); await full('owe'); log('OWE', await lastText());
  await click(/^Pay /); await p.waitForTimeout(400);
  for (const c of ['111111','222222','333333']) { await p.keyboard.type(c); await p.keyboard.press('Enter'); await p.waitForTimeout(1500) }
  await shot('locked'); log('LOCKED', await txt());
  let s=await st(); log('card', s.card.balance);
  await p.reload(); await p.waitForTimeout(800); await nav(3);
  await click(/^Pay /).catch(e=>log('no pay')); await p.waitForTimeout(400); await shot('after-reload'); log('RELOAD', await txt());
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await ask('Freeze my card'); await full('freeze'); log('FRZ', await lastText());
  await ask('unfreeze my card'); await full('unfreeze'); log('UNF', await lastText());
  const b=p.getByRole('button',{name:/Unfreeze|Confirm/}).last(); if(await b.count()){ await b.click(); await p.waitForTimeout(400); log('UNF SHEET', await txt()); await shot('unf-sheet') }
});
