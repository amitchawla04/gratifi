const run=require('./h.js'); const book=require('./book.js'); const m=process.argv[2]||'UK';
run(`fl6-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await book(h);
  let s=await st(); log('after book card',s.card.balance,'bal',s.balance);
  for (const q of ['change the time of my outbound flight','I want a later flight out on the same day','move my flight to the evening','change my flight to 16 October']) { await ask(q); log('Q',q,'=>', (await lastText()).slice(0,400)); }
  await full('time');
  await ask('cancel my flight'); await full('cancel-ask'); log('CANCEL', await lastText());
  await click('Yes, cancel'); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await confirm(); await full('cancelled'); log('CANCELLED', await lastText());
  s=await st(); log('after cancel card',s.card.balance,'bal',s.balance, JSON.stringify(s.ledger.slice(0,4).map(l=>[l.label,l.pts])), JSON.stringify(s.txns.slice(0,2).map(t=>[t.merchant,t.amount,t.refund])));
  // re-tap old cancel button
  const n=await p.getByRole('button',{name:'Yes, cancel'}).count(); log('yes cancel buttons', n, n? await p.getByRole('button',{name:'Yes, cancel'}).first().isDisabled():'');
  await ask('cancel my flight'); log('CANCEL2', await lastText());
  await p.reload(); await p.waitForTimeout(800); await nav(3);
  const btns=p.getByRole('button',{name:/Yes, cancel|Pay /}); log('after reload live buttons', await btns.count());
  for (let i=0;i<await btns.count();i++) log(' btn', await btns.nth(i).innerText(), await btns.nth(i).isDisabled());
});
