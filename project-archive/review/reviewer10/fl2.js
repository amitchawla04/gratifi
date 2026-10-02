const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`fl2-${m}`, m, async ({p,shot,full,nav,ask,click,last,lastText,st,confirm,log})=>{
  
  await nav(3); await ask('Flights to Lisbon from 14 Oct to 18 Oct for 2 adults and 1 child');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await click(/Continue with/);
  const ins = last().locator('input.app-in'); await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla');
  // traveller 3 -> exit row 14D
  await last().getByRole('radio').nth(2).click(); await p.locator('.gr-seat[aria-label*="14D"]').last().click();
  await last().getByRole('button',{name:'Flight back'}).click().catch(e=>log('noback',e.message)); await p.waitForTimeout(200);
  await last().getByRole('radio').nth(1).click().catch(()=>{}); 
  await p.locator('.gr-seat:not([disabled])').last().click();
  await last().locator('button[aria-label*="Add"], button[aria-label*="ncrease"], button:has-text("+")').first().click().catch(e=>log('nobag'));
  await full('seats'); log(await lastText());
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); await full('checkout'); log(await lastText());
});
