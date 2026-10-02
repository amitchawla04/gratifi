const {setup}=require('./h.js');
(async()=>{const H=await setup('MY',{len:500,tag:'MY1'});const p=H.p;

await H.say('hotel in Penang for 3 nights from 16 Oct for 4 adults');
await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500);
console.log('DETAIL', await H.last()); await H.fullshot('detail');
const cta=p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await cta.click(); await p.waitForTimeout(500);
console.log('CHECKOUT', await H.last()); 
await p.getByRole('button',{name:/^Card/}).last().click().catch(e=>console.log('nocardopt')); await p.waitForTimeout(300);
await H.fullshot('checkout');
await H.click(/^Pay /); await p.waitForTimeout(500); console.log('SHEET', await H.sheetText()); await H.shot('sheet',false);
await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(600); console.log('SHEET2', await H.sheetText()); await H.shot('sheet2',false);
await p.waitForTimeout(4000); console.log('SHEET3', await H.sheetText()); await H.shot('sheet3',false);
console.log('RECEIPT', await H.last()); console.log(JSON.stringify(await H.bal()));
await H.nav(4); await H.fullshot('wallet'); console.log(await H.screen());
await H.done()})()
