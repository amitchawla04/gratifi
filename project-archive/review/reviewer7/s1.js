const H=require('./h.js');
const bookFlight = async (h, q, method, opts={}) => { const {p,ask,click,full}=h;
  await ask(q); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  if(opts.fare) { await p.getByText(opts.fare,{exact:true}).last().click(); await p.waitForTimeout(200) }
  await click(/Continue with/);
  const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(['Sam Taylor','Jo Taylor','Al Taylor'][i%3]) }
  await click('Continue', { exact: true }); await p.waitForTimeout(300);
  if(method) { await p.locator('.gr-answer').last().getByText(method,{exact:true}).click(); await p.waitForTimeout(300) }
  if(opts.shot) await full(opts.shot);
  await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm(); };
module.exports.bookFlight=bookFlight;
if(require.main===module) H('UK','s1', async (h)=>{ const {p,shot,full,nav,ask,click,st,money,log,url,lastText,last}=h;
  await nav(3); await ask('Ways to earn more'); await p.getByRole('button',{name:/Join/}).first().click(); await p.waitForTimeout(300);
  let s=await st(); log('challenges', JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.target,c.done])), 'lounge', s.loungeLeft);
  log('m0', JSON.stringify(await money()));
  await bookFlight(h,'Flights to Lisbon next weekend for two','Card',{shot:'checkout'}); await full('booked');
  s=await st(); log('after flight: challenges', JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.target,c.done])), 'lounge', s.loungeLeft);
  log('m1', JSON.stringify(await money())); log(await last(4));
  log('ledger', JSON.stringify(s.ledger.slice(0,6).map(l=>l.label+' '+l.pts)));
  await ask('cancel my flight'); log(await lastText()); await full('cancel-ask');
  await click('Yes, cancel'); await full('cancelled'); log(await last(1));
  s=await st(); log('after cancel: challenges', JSON.stringify(s.challenges.map(c=>[c.id,c.joined,c.progress,c.target,c.done])), 'lounge', s.loungeLeft);
  log('m2', JSON.stringify(await money())); log('ledger', JSON.stringify(s.ledger.slice(0,8).map(l=>l.label+' '+l.pts))); log('txns', JSON.stringify(s.txns.slice(0,3).map(t=>t.merchant+' '+t.amount+(t.refund?' R':''))));
  await ask('cancel my flight'); log('2nd cancel:', await last(1));
  await p.goto(url()); await p.waitForTimeout(600); await nav(3);
  const yc = await p.getByRole('button',{name:'Yes, cancel'}).count(); log('live Yes cancel buttons after reload', yc);
  const pays = p.getByRole('button',{name:/^Pay /}); log('live pay buttons after reload', await pays.count(), await pays.evaluateAll(xs=>xs.map(x=>x.disabled)));
  if(await pays.count()){ await pays.last().click(); await p.waitForTimeout(500); log('retap old pay:', await p.locator('.app-sheet').count(), await last(1)); await p.keyboard.press('Escape'); }
  await nav(4); await full('wallet');
  await nav(5); await full('me');
});
