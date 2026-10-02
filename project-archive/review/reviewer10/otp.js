const run=require('./h.js');
run(`otp-IN`, 'IN', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('A hotel in Goa with a pool'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await full('detail'); log('DETAIL', await lastText());
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await full('checkout'); log('CO', await lastText());
  await last().getByText('Card',{exact:true}).click().catch(e=>log('nocard')); await p.waitForTimeout(200);
  await click(/^Pay /); await p.waitForTimeout(400); await shot('sheet'); log('SHEET', (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' '));
  const focused = await p.evaluate(()=>document.activeElement && (document.activeElement.outerHTML.slice(0,160))); log('focus', focused);
  // type wrong code via keyboard
  await p.keyboard.type('111111'); await p.waitForTimeout(300); await shot('typed');
  log('after type', (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' '), await p.evaluate(()=>[...document.querySelectorAll('.app-sheet input')].map(i=>i.value).join('')));
  await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await shot('wrong1'); log('WRONG1', (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' '));
  let s=await st(); log('card after wrong', s.card.balance, s.bookings.length);
  await p.keyboard.type('222222'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500); await shot('wrong2'); log('WRONG2', (await p.locator('.app-sheet').innerText()).replace(/\s+/g,' '));
  // Escape closes?
  await p.keyboard.press('Escape'); await p.waitForTimeout(400); log('sheet after esc', !!(await p.$('.app-sheet')));
  s=await st(); log('card after esc', s.card.balance, s.bookings.length);
  // reopen, paste correct
  await click(/^Pay /).catch(e=>log('no pay btn after esc')); await p.waitForTimeout(400); log('SHEET2', (await p.locator('.app-sheet').innerText().catch(()=>'none')).replace(/\s+/g,' '));
  await p.evaluate(()=>{ const i=document.querySelector('.app-sheet input'); i.focus(); const dt=new DataTransfer(); dt.setData('text/plain','482193'); i.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true})) });
  await p.waitForTimeout(300); log('after paste', await p.evaluate(()=>[...document.querySelectorAll('.app-sheet input')].map(i=>i.value).join('')));
  await shot('pasted'); await p.keyboard.press('Enter'); await p.waitForTimeout(2000); log('sheet open?', !!(await p.$('.app-sheet'))); await full('paid'); log('PAID', await lastText());
  s=await st(); log('card', s.card.balance, 'bal', s.balance, JSON.stringify(s.bookings.map(b=>[b.title,b.total,b.pts,b.card])));
});
