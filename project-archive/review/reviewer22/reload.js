const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'reload'});const {p}=H;
try{await H.nav(3); await H.ask('Noise-cancelling headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
await p.reload(); await p.waitForTimeout(800); await H.nav(3);
let pay=p.getByRole('button',{name:/^Pay /}).last(); console.log('pay after reload', await pay.count(), await pay.isEnabled().catch(()=>null)); await pay.click(); await p.waitForTimeout(400); console.log('sheet', !!(await H.sheetText())); await H.confirm(); 
const s1=await H.state(); console.log('bal', s1.balance, s1.card.balance, s1.bookings.length);
await p.reload(); await p.waitForTimeout(800); await H.nav(3);
pay=p.getByRole('button',{name:/^Pay /}); console.log('pay buttons after paid+reload', await pay.count());
for (let i=0;i<await pay.count();i++) console.log(' en', await pay.nth(i).isEnabled(), await pay.nth(i).innerText());
if(await pay.count() && await pay.last().isEnabled()){ await pay.last().click(); await p.waitForTimeout(500); console.log('sheet2', (await H.sheetText()).slice(0,100)); console.log('after', (await H.lastText()).slice(0,200)); }
const s2=await H.state(); console.log('bal', s2.balance, s2.card.balance, s2.bookings.length);
// cancel with supplier down
await H.nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await p.waitForTimeout(200); await H.nav(3);
await H.ask('cancel my headphones'); console.log('C', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); const y=p.getByRole('button',{name:/^Yes, cancel/}).last(); if(await y.count()){await y.click(); await p.waitForTimeout(500);} if(await H.sheetText()) await H.confirm(); console.log('C2', (await H.lastText()).replace(/\s+/g,' ').slice(0,300));
const s3=await H.state(); console.log('bal', s3.balance, s3.card.balance, s3.bookings[0].status);
await H.ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await p.getByRole('button',{name:/^Confirm/}).last().click(); await p.waitForTimeout(500); console.log('L', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); console.log('lounge', (await H.state()).loungeLeft);
await H.ask('donate 1000 points to charity'); console.log('D', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(400); if(await H.sheetText()) await H.confirm(); console.log('D2', (await H.lastText()).replace(/\s+/g,' ').slice(0,300)); console.log('bal', (await H.state()).balance);
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
