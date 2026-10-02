const H=require('./h.js');
const buy=async(h,q,mode)=>{const p=h.p;await h.ask(q);await h.last().locator('.gr-itemrow').first().click();await p.waitForTimeout(400);
 const b=h.last().locator('.gr-detail .gr-btn').last(); if(/Pick a size/.test(await b.innerText())){await h.last().locator('.gr-chip').nth(1).click()}
 await h.last().locator('.gr-detail .gr-btn').last().click();await p.waitForTimeout(400);
 const opts=h.last().locator('.gr-opt,[role=radio]'); if(mode==='card') await opts.last().click(); if(mode==='points') await opts.first().click(); if(mode==='mix') {await opts.nth(1).click(); const sl=h.last().locator('input[type=range], [role=slider]').first(); h.log('slider',await sl.count()); if(await sl.count()){await sl.focus(); await h.p.keyboard.press('End');}}
 await p.waitForTimeout(300); h.log('CO', (await h.lastText()).slice(-300)); await h.click(/^Pay /); const t=await h.confirm(); h.log('SHEET',t); h.log('DONE',(await h.lastText()).slice(0,300)); const s=await h.state(); h.log('pts',s.balance,'card',s.card.balance);};
H.run({market:'UK',name:'writeoff'},async h=>{await h.nav(3);
await buy(h,'Noise-cancelling headphones','card');
await buy(h,'13-inch laptop','mix');
await h.ask('cancel my headphones'); h.log('ASK',await h.lastText()); await h.click('Yes, cancel'); h.log('CANCELLED',await h.lastText()); const s=await h.state(); h.log('pts',s.balance,'card',s.card.balance, JSON.stringify(s.ledger||s.points||'').slice(0,600));
await h.nav(5); await h.full('me');
});
