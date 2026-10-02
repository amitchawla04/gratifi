const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'lounge'});const {p}=H;
const lv=async()=>(await H.state())?.loungeLeft;
try{await H.nav(3);
for (const [q,d] of [['lounge for 2 on 9 October','2 people'],['lounge on 12 October','1']]){
await H.ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click().catch(()=>{}); await p.waitForTimeout(400);
console.log('DETAIL', (await H.lastText()).replace(/\s+/g,' ').slice(-300));
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
console.log('CHK', (await H.lastText()).replace(/\s+/g,' ').slice(-400));
const pay=p.getByRole('button',{name:/^Pay |^Book|^Confirm/}).last(); console.log('btn', await pay.innerText()); await pay.click(); await p.waitForTimeout(400); if(await H.sheetText()) { console.log('SHEET', (await H.sheetText()).replace(/\s+/g,' ')); await H.confirm(); }
console.log('RCPT',(await H.lastText()).replace(/\s+/g,' ').slice(0,300)); console.log('loungeLeft', await lv());
}
await H.ask('cancel my lounge'); console.log('C1',(await H.lastText()).replace(/\s+/g,' ').slice(0,400)); await p.locator('.gr-answer').last().getByRole('button',{name:'Cancel',exact:true}).first().click(); await p.waitForTimeout(500); console.log('C2',(await H.lastText()).replace(/\s+/g,' ').slice(0,400)); const y=p.getByRole('button',{name:/^Yes, cancel/}).last(); await y.click(); await p.waitForTimeout(500); if(await H.sheetText()) await H.confirm(); console.log('C3',(await H.lastText()).replace(/\s+/g,' ').slice(0,400)); console.log('loungeLeft', await lv()); await H.ask('Book a lounge'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click().catch(()=>{}); await p.waitForTimeout(400); console.log('D3',(await H.lastText()).replace(/\s+/g,' ').slice(-200));
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
