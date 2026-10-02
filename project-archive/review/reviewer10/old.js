const run=require('./h.js'); const book=require('./book.js');
run(`old-UK`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await book(h, 'Flights to Paris on 20 Oct back 23 Oct for 1', []);
  let s=await st(); log('after book', s.balance, s.card.balance, s.bookings.length);
  // re-tap first flight card in old results
  await p.locator('.gr-flight').nth(1).click(); await p.waitForTimeout(500); log('tap old flight ->', (await lastText()).slice(0,200));
  await p.reload(); await p.waitForTimeout(800); await nav(3);
  const enabled = await p.evaluate(()=>[...document.querySelectorAll('.gr-answer button:not([disabled])')].map(b=>b.innerText.trim()).filter(Boolean));
  log('enabled buttons after reload', JSON.stringify(enabled));
  // hotel: open detail, reload before continuing, then continue old one
  await ask('hotel in Paris'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  await ask('hotel in Lisbon'); // new message
  // go back to Paris detail and continue
  const cont = p.locator('.gr-detail .gr-btn:not([disabled])'); log('live detail CTAs', await cont.count());
  await cont.first().click(); await p.waitForTimeout(500); log('old detail continue ->', (await lastText()).slice(0,200));
  // double click pay
  const pay=p.getByRole('button',{name:/^Pay /}).last(); await pay.dblclick(); await p.waitForTimeout(400); log('sheets', await p.locator('.app-sheet').count());
  await confirm(); s=await st(); log('bk', s.bookings.length, s.balance);
  const pay2=p.getByRole('button',{name:/^Pay /}); log('pay buttons remaining enabled', await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/^Pay /.test(b.innerText)&&!b.disabled).length));
  await full('end');
});
