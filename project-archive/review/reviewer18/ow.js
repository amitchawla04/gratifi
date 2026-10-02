const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:300,tag:'OW'});const p=H.p;
await H.say('flights to Paris on 14 Oct for 1 one way'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); console.log('FARES', await H.last());
await H.say('flights to Paris on 14 Oct back 17 Oct for 1'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); console.log('FARES RT', await H.last());
await H.done()})()
