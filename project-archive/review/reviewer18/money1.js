const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:700,tag:'M1'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance,'avail',s.card.limit-s.card.balance,'ledger',JSON.stringify(s.ledger.slice(0,3).map(x=>[x.label||x.title||x.t,x.pts||x.amount||x.v]))) };
await H.say('A hotel in Lisbon for 2 nights from 20 Oct');
await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(1).click(); await p.waitForTimeout(400);
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
console.log('CO', await H.last());
await H.click(/^Pay /); console.log('SH', await H.confirm()); console.log('RC', await H.last()); await B('after stay');
// spend points down so earned can't be clawed
await H.say('donate 30000 points to Clean Seas'); console.log('SH', await H.confirm()); await B('after donate');
await H.say('cancel my hotel'); console.log(await H.last()); await H.fullshot('cancel-ask');
await H.click('Yes, cancel'); console.log(await H.last()); await B('after cancel');
await H.say('cancel my hotel'); console.log(await H.last());
const s=await H.st(); console.log(JSON.stringify(s.ledger.slice(0,6)));
console.log(JSON.stringify(s.txns.slice(0,4)));
await H.done()})()
