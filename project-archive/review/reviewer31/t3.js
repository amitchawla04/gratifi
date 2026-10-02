const H=require('./h.js');
H.run({market:'UK',name:'kids'},async h=>{const {p}=h;await h.nav(3);
await h.ask('flights to Paris 9 Oct back 11 Oct for me, my 5 year old and my baby');h.log(await h.lastText());
await p.locator('.gr-flight').first().click();await p.waitForTimeout(400);
await h.click(/Continue with/);await h.full('pax');
const ins=h.last().locator('input'); const n=await ins.count(); for(let i=0;i<n;i++){h.log(i, await ins.nth(i).getAttribute('type'), await ins.nth(i).getAttribute('aria-label'), await ins.nth(i).getAttribute('placeholder'), await ins.nth(i).inputValue())}
});
