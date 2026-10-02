const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'lim'});const {p}=H;
try{await H.nav(3); await H.ask('13-inch laptop'); 
const rows=p.locator('.gr-answer').last().locator('.gr-itemrow'); const n=await rows.count(); for(let i=0;i<n;i++){ if(/laptop/i.test(await rows.nth(i).innerText())){await rows.nth(i).click();break}} await p.waitForTimeout(400);
const plus=p.locator('.gr-answer').last().locator('.gr-detail .gr-stepper button:last-child'); console.log('plus', await plus.count());
for(let i=0;i<10;i++) { if(await plus.last().isEnabled()) await plus.last().click({timeout:2000}) };
await H.full('detail'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
// choose card
await p.locator('.gr-answer').last().getByText('Card',{exact:true}).click().catch(e=>console.log('nocard',e.message.slice(0,80))); await p.waitForTimeout(300);
await H.full('checkout'); console.log((await H.lastText()).replace(/\s+/g,' ').slice(-500));
const pay=p.getByRole('button',{name:/^Pay /}).last(); console.log('pay enabled', await pay.isEnabled(), await pay.innerText()); await pay.click(); await p.waitForTimeout(500); console.log('sheet', (await H.sheetText()).replace(/\s+/g,' ')); if(await H.sheetText()) await H.confirm(); await H.full('after'); console.log('AFTER',(await H.lastText()).replace(/\s+/g,' ').slice(-400));
const s=await H.state(); console.log(JSON.stringify(s.card), s.balance, s.bookings.length);
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
