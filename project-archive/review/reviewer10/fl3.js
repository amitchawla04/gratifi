const run=require('./h.js'); const book=require('./book.js'); const m=process.argv[2]||'UK';
run(`fl3-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await book(h);
  await full('receipt'); log('RECEIPT', await lastText());
  let s=await st(); log('bal',s.balance,'card',s.card.balance,'ledger',JSON.stringify(s.ledger.slice(0,4).map(l=>[l.label,l.pts])), 'bk', JSON.stringify(s.bookings[0].extra).slice(0,600));
  await nav(4); await full('wallet');
  await click(/Show pass|Boarding pass|pass/i); await full('pass'); log('PASS', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,800));
});
