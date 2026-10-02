const H=require('./h.js');
H.run({market:'UK',name:'prefill'},async h=>{const p=h.p;await h.nav(3);
await h.ask('a cab from the office to Heathrow tomorrow at 7am'); await h.full('cab'); const pressed=await h.last().locator('[aria-pressed=true],[aria-checked=true],.on,.sel').allInnerTexts(); h.log('selected', pressed.join('|'));
await h.last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); h.log('co', (await h.lastText()).slice(0,300));
await h.ask('a £50 Bloom gift card for sam@example.com'); const vals=await h.last().locator('input').evaluateAll(es=>es.map(e=>e.value)); h.log('inputs', vals.join('|'));
await h.full('gift');
});
