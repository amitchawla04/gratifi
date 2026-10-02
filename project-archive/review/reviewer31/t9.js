const H=require('./h.js');
H.run({market:'UK',name:'demo'},async h=>{const p=h.p;
await h.nav(5); const sw=p.locator('.app-demo [role=switch]'); h.log('switches', await sw.count()); await sw.nth(1).click(); await p.waitForTimeout(200);
await h.nav(3); const s0=await h.state();
await h.ask('Rain shell jacket');await h.last().locator('.gr-itemrow').first().click();await p.waitForTimeout(300);await h.last().locator('.gr-chip').nth(1).click();await h.last().locator('.gr-detail .gr-btn').last().click();await p.waitForTimeout(400);
await h.click(/^Pay /); await h.confirm(); h.log('supplier down:', (await h.lastText()).slice(0,400)); const s1=await h.state(); h.log('pts',s0.balance,s1.balance,'card',s0.card.balance,s1.card.balance,'bookings',s1.bookings.length);
await h.full('supplier');
// flights with supplier down
await h.ask('Flights to Paris 9 Oct back 11 Oct'); await p.locator('.gr-flight').first().click();await p.waitForTimeout(400);await h.click(/Continue with/);await h.click('Continue',{exact:true});await h.click(/^Pay /);await h.confirm(); h.log('flight supplier down:', (await h.lastText()).slice(0,300)); const s2=await h.state(); h.log('pts',s2.balance,'card',s2.card.balance,'bookings',s2.bookings.length);
// dining free with supplier down
await h.ask('A table tonight for two'); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-slot').nth(2).click(); await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); const fb=h.last().locator('.gr-card .gr-btn:not([disabled])').last(); h.log('dine btn', await fb.innerText()); await fb.click(); await p.waitForTimeout(500); h.log('dining supplier down:', (await h.lastText()).slice(0,300)); 
// points transfer with supplier down
await h.ask('Transfer 5000 points to Northway'); h.log('xfer', (await h.lastText()).slice(0,300));
// Points come in / card payment demo
await h.nav(5); await p.getByRole('button',{name:/Points come in/}).click(); await p.waitForTimeout(300); await p.getByRole('button',{name:/A card payment/}).click(); await p.waitForTimeout(300); const s3=await h.state(); h.log('after demo pts', s3.balance, 'card', s3.card.balance);
await p.getByRole('button',{name:/Suspicious payment/}).click(); await p.waitForTimeout(500); h.log('tab', await p.evaluate(()=>document.querySelector('.app').dataset.tab)); h.log('susp', (await h.lastText()).slice(0,400)); await h.full('susp');
});
