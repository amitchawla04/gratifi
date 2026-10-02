const run=require('./h.js');
run(`canc-UK`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('hotel in Lisbon tomorrow for 2 nights'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  log('DET', (await lastText()).slice(-260));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); log('CO', (await lastText()).slice(0,300)); await click(/^Pay /); await confirm();
  await ask('cancel my hotel'); log('CANCEL', await lastText()); await full('hotel-cancel');
  // light fare flight
  await ask('Flights to Paris on 20 Oct back 23 Oct'); await p.locator('.gr-flight').last().click(); await p.waitForTimeout(400);
  await last().getByText('Light',{exact:true}).first().click(); await p.waitForTimeout(200); await click(/Continue with/); log('SEATS', (await lastText()).slice(0,400));
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500); log('CO2', (await lastText()).slice(0,500)); await click(/^Pay /); await confirm();
  await ask('cancel my Paris flight'); log('CANCEL2', await lastText());
  await ask('change my seat'); log('SEAT', await lastText());
});
