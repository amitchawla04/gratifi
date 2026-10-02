const run=require('./h.js');
run(`stay2`, 'UK', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('hotel in Edinburgh for 5 adults from 16 Oct for 3 nights'); log('L', (await lastText()).slice(0,200)); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
  const t=await lastText(); log('D', t.replace(/CHECK IN.*?NIGHTS/,'CHECK IN [...] NIGHTS'));
  await full('detail');
  await last().getByText('Suite (+40%)').click(); await p.waitForTimeout(300); log('SUITE', (await lastText()).slice(-250));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); log('CO', (await lastText()).slice(0,400));
});
