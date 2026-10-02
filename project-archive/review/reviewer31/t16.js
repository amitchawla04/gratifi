const H=require('./h.js');
const L=['move my flight to Saturday','change my return to Monday evening','I want a window seat','add a bag','where is my boarding pass','when does check-in open','can I change to the Coastline flight','cancel my return flight only','what happens if I cancel my flight','book a hotel for my trip','I need a ride to the airport for my flight','cancel my flight'];
H.run({market:'UK',name:'mgmt'},async h=>{const p=h.p;await h.nav(3);
await h.ask('Flights to Lisbon 9 Oct back 11 Oct for two'); await p.locator('.gr-flight').first().click();await p.waitForTimeout(400);await h.click(/Continue with/);{const ins=h.last().locator('input.app-in');for(let i=0;i<await ins.count();i++){if(!(await ins.nth(i).inputValue()))await ins.nth(i).fill('Sam Taylor')}}await h.click('Continue',{exact:true});await h.click(/^Pay /);await h.confirm();
for(const l of L){ if(await p.$('.app-sheet')){await p.keyboard.press('Escape');await p.waitForTimeout(200)} await h.ask(l,900); const t=await h.lastText(); const b=await h.last().locator('button').allInnerTexts(); console.log('\n>> '+l+'\n   '+t.slice(0,330)+'\n   [btns] '+b.map(x=>x.replace(/\s+/g,' ')).slice(0,8).join(' | '));}
await h.full('end');
});
