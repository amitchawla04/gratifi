const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:700,tag:'M2'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance,'due',s.card.due,'avail',(s.card.limit-s.card.balance).toFixed(2)) };
await H.say('A hotel in Lisbon for 3 nights from 20 Oct');
await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(0).click(); await p.waitForTimeout(400);
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).last().click(); await p.waitForTimeout(300);
console.log('CO', await H.last());
await H.click(/^Pay /); console.log('SH', await H.confirm()); console.log('RC', await H.last()); await B('after stay');
await H.say('donate 48800 points to Clean Seas'); console.log('SH', await H.confirm()); await B('after donate');
await H.say('cancel my hotel'); console.log(await H.last()); await H.fullshot('cancel-ask');
await H.click('Yes, cancel'); console.log(await H.last()); await B('after cancel');
await H.nav(4); for (const t of ['Upcoming','Orders','Requests','Past']) { await p.getByRole('tab',{name:new RegExp('^'+t)}).click().catch(()=>p.getByRole('button',{name:new RegExp('^'+t)}).first().click()); await p.waitForTimeout(300); console.log('TAB',t,(await H.screen()).slice(0,400)) }
await H.nav(5); await H.fullshot('mecard'); console.log((await H.screen()).slice(0,900));
await H.done()})()
