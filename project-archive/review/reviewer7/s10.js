const H=require('./h.js');
H('UK','s10', async (h)=>{ const {p,shot,full,nav,ask,click,st,log,last}=h;
  await nav(3); await ask('flights to Lisbon on 9 Oct back 10 Oct for one'); log(await last(1));
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  const a=p.locator('.gr-answer').last(); const opts = await a.locator('.gr-slot, .gr-opt, button').allInnerTexts(); log('opts', JSON.stringify(opts.slice(0,12)));
  const early = a.locator('button').filter({hasText:/^0[0-9]:/}).first(); if(await early.count()){ await early.click(); await p.waitForTimeout(200) }
  await click(/Continue with/); const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
  await click('Continue', { exact: true }); await p.getByRole('button',{name:/^Pay /}).last().click(); await h.faceConfirm();
  let b=(await st()).bookings[0]; log('booked', b.when);
  await nav(5); await click('Cancel my next flight'); await nav(3); log(await last(1)); await click('Next flight',{exact:true}); log(await last(1));
  b=(await st()).bookings[0]; log('after rebook', b.when); await full('rebook');
});
