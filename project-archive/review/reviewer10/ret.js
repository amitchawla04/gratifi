const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`ret-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const S=async(t)=>{const s=await st(); log(t,'bal',s.balance,'card',s.card.balance,'bk',JSON.stringify(s.bookings.map(b=>[b.title,b.status,b.pts,b.card,b.earned,b.refunded])),'ledger',JSON.stringify(s.ledger.slice(0,3).map(l=>[l.label,l.pts])))};
  await nav(3);
  for (const [q,pay] of [['Rain shell jacket','Card'],['Leather trainers','Card']]) { await ask(q); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500); await last().getByText(pay,{exact:true}).click(); await click(/^Pay /); await confirm(); }
  await S('bought');
  await nav(5); await click('Deliver my order'); await nav(5); await click('Deliver my order'); await nav(3); await full('delivered'); log('DEL', await lastText()); await S('delivered');
  await ask('return my jacket'); await full('ret-ask'); log('RET', await lastText());
  const b=last().getByRole('button'); log('ret buttons', JSON.stringify(await b.allInnerTexts()));
  await last().locator('.gr-btn').first().click(); await p.waitForTimeout(500); if (await p.$('.app-sheet')) await confirm(); await full('ret-started'); log('RET2', await lastText()); await S('return started');
  await ask('my trainers arrived damaged'); await last().getByRole('button',{name:'It arrived damaged'}).click().catch(()=>log('no dmg btn')); await click('Send claim'); await full('claim'); log('CLAIM', await lastText());
  await p.waitForTimeout(15000); await p.reload(); await p.waitForTimeout(1000); await nav(3); await S('reloaded 15s');
  await p.waitForTimeout(32000); await S('after 47s'); await nav(3); await full('after'); log('AFTER', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(-1500));
  await nav(4); await full('wallet'); 
});
