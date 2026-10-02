const run=require('./h.js');
run(`offer-UK`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const S=async(t)=>{const s=await st(); log(t,'bal',s.balance,'card',s.card.balance,'lounge',s.loungeLeft,'chl',JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.done])),'ledger',JSON.stringify(s.ledger.slice(0,6).map(l=>[l.label,l.pts])))};
  await nav(3); await ask('Show me card offers'); await last().getByRole('button',{name:'Add'}).nth(1).click(); await p.waitForTimeout(400); log('ADD', await lastText());
  await ask('Ways to earn more'); await last().getByRole('button',{name:'Join'}).first().click(); await p.waitForTimeout(300); await last().getByRole('button',{name:'Join'}).first().click().catch(()=>log('no 2nd join')); await p.waitForTimeout(300); log('CHL', await lastText());
  await S('before');
  await ask('Flights to Paris on 20 Oct back 23 Oct for 2');
  // choose a Northway flight
  await p.locator('.gr-flight', {hasText:'Northway'}).first().click(); await p.waitForTimeout(400); await click(/Continue with/);
  const ins = last().locator('input.app-in'); for(let i=0;i<await ins.count();i++){ if(!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); await last().getByText('Card',{exact:true}).click(); await click(/^Pay /); await confirm();
  await full('paid'); log('RCPT', await lastText()); await S('after pay');
  await ask('cancel my flight'); log('CANCEL', await lastText()); await click('Yes, cancel'); await p.waitForTimeout(400); log('CANCELLED', await lastText()); await S('after cancel');
  await full('cancelled');
});
