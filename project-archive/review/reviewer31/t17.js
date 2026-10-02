const H=require('./h.js');
H.run({market:'UK',name:'trip'},async h=>{const p=h.p;await h.nav(3);
await h.ask('Flights to Lisbon 9 Oct back 11 Oct for two'); await p.locator('.gr-flight').first().click();await p.waitForTimeout(400);await h.click(/Continue with/);{const ins=h.last().locator('input.app-in');for(let i=0;i<await ins.count();i++){if(!(await ins.nth(i).inputValue()))await ins.nth(i).fill('Sam Taylor')}}await h.click('Continue',{exact:true});await h.click(/^Pay /);await h.confirm();
await h.click('Add a hotel'); h.log('chip', (await h.lastText()).slice(0,250)); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); h.log('chip detail sel', (await h.last().locator('[aria-pressed=true]').allInnerTexts()).join('|'));
await h.ask('book a hotel for my trip'); h.log('TXT',(await h.lastText()).slice(0,200)); await h.last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await h.sh('textdetail');
await h.click('Airport ride'); h.log('ride chip', (await h.lastText()).slice(0,300));
});
