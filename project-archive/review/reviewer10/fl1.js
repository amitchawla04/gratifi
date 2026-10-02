const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`fl1-${m}`, m, async ({p,full,nav,ask,click,last,lastText,st,confirm,log})=>{
  await nav(3); await ask('Flights to Lisbon from 14 Oct to 18 Oct for 2 adults and 1 child'); await full('results'); log(await lastText());
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); await full('fares'); log(await lastText());
  await click(/Continue with/); await full('after-fare'); log(await lastText());
});
