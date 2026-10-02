const run=require('./h.js');
run(`my`, 'MY', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const txt=async()=>(await p.locator('.app-sheet').innerText().catch(()=>'NONE')).replace(/\s+/g,' ');
  await nav(3); await ask('A hotel in Penang for 2 nights'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  await full('detail'); log('D', await lastText());
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await last().getByText('Points and card',{exact:true}).click(); await full('co'); log('CO', await lastText());
  await click(/^Pay /); await p.waitForTimeout(400); await shot('sheet1'); log('S1', await txt());
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(600); await shot('sheet2'); log('S2', await txt());
  let s=await st(); log('mid bal', s.balance, 'card', s.card.balance, s.bookings.length);
  // close during waiting
  await p.keyboard.press('Escape'); await p.waitForTimeout(3000); log('sheet?', !!(await p.$('.app-sheet'))); s=await st(); log('after close bal', s.balance, 'card', s.card.balance, s.bookings.length); await full('closed'); log('CL', await lastText());
  await click(/^Pay /); await p.waitForTimeout(400); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(500); await shot('wait'); log('W', await txt());
  await p.waitForSelector('.app-sheet',{state:'detached',timeout:20000}).catch(()=>log('still open 20s')); await shot('after'); log('W2', await txt());
  await full('done'); log('DONE', await lastText()); s=await st(); log('bal', s.balance, 'card', s.card.balance, JSON.stringify(s.bookings.map(b=>[b.title,b.total,b.pts,b.card,b.earned])));
});
