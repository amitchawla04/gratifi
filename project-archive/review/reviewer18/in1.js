const {setup}=require('./h.js');
(async()=>{const H=await setup('IN',{len:500,tag:'IN1'});const p=H.p;
await H.say('Flights to Goa next Friday for 2 adults and a 1 year old, back Sunday');
await H.shot('results');
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); console.log(await H.last()); await H.shot('fares');
await H.click(/Continue with/); await p.waitForTimeout(400); await H.fullshot('seats');
console.log(await H.last());
const ins=p.locator('.gr-answer').last().locator('input.app-in'); const n=await ins.count(); console.log('inputs',n);
for(let i=0;i<n;i++){ const ph=await ins.nth(i).getAttribute('placeholder'); const ty=await ins.nth(i).getAttribute('type'); console.log(i,ph,ty, await ins.nth(i).inputValue()) }

await ins.nth(1).fill('Priya Sharma'); await ins.nth(2).fill('Anaya Chawla'); await ins.nth(3).fill('2023-05-01'); await p.waitForTimeout(300);
console.log('DOB 2023:', await H.last().then(t=>t.slice(t.indexOf('Infant'),t.indexOf('Infant')+250)));
await H.shot('dob-old');
await ins.nth(3).fill('2025-11-20'); await p.waitForTimeout(300);
console.log('DOB 2025-11:', (await H.last()).slice(-300));
await ins.nth(3).fill('2025-02-01'); await p.waitForTimeout(300);
console.log('DOB 2025-02:', (await H.last()).slice(-200));
await H.click('Continue',true); await p.waitForTimeout(500); console.log('CHECKOUT', await H.last()); await H.fullshot('checkout');
await H.click(/^Pay /); await p.waitForTimeout(400); console.log('SHEET', await H.sheetText()); await H.shot('otp',false);
const enter=async(code)=>{const ins=await p.$$('.app-sheet input'); if(ins.length>=6){for(let i=0;i<6;i++) await ins[i].fill(code[i])} else await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(700); return H.sheetText()};
console.log('W1', await enter('111111')); console.log('W2', await enter('222222')); await H.shot('otp-last',false); console.log('W3', await enter('333333')); await H.shot('otp-locked',false);
console.log('BAL after lock', JSON.stringify(await H.bal()));
await p.reload(); await p.waitForTimeout(800); console.log('after reload screen:', (await H.screen()).slice(-400));
await p.keyboard.press('Escape');
const pay=p.getByRole('button',{name:/^Pay /}); console.log('pay buttons', await pay.count());
if(await pay.count()){ await pay.last().click(); await p.waitForTimeout(500); console.log('SHEET after reload', await H.sheetText()); await H.shot('otp-reload',false) }
await H.done()})()
