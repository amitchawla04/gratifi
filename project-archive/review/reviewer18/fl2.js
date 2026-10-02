const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:700,tag:'FL2'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance.toFixed(2))};
const book=async(q,fare)=>{await H.say(q); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400);
 if(fare){await p.locator('.gr-answer').last().getByRole('radio',{name:new RegExp('^'+fare)}).first().click().catch(e=>console.log('nofare'))}
 await H.click(/Continue with/); const ins=p.locator('.gr-answer').last().locator('input.app-in'); for(let i=0;i<await ins.count();i++){ if(!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor')} await H.click('Continue',true);
 await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click(); await H.click(/^Pay /); await H.confirm(); console.log('RC', (await H.last()).slice(0,400)); await B('booked')};
await book('flights to Paris on 14 Oct back 17 Oct for 2','Light');
await H.say('move my return flight to the evening'); 
await H.say('can I move my outbound to an Aurora Air flight instead?');
await H.say('change my flight to the 15th');
await H.say('cancel my Paris flight'); await H.fullshot('cancel-light');
await H.say('the airline cancelled my flight to Paris');
await H.nav(5); await H.click('Cancel my next flight'); await H.nav(3); console.log('AFTER DEMO', await H.last());
await H.click('Full refund'); console.log('REFUND?', await H.last()); await H.shot('refund-ask');
const yes=p.getByRole('button',{name:/Yes|Confirm|refund/i}); console.log('buttons', await p.locator('.gr-answer').last().locator('button').allInnerTexts());
await H.done()})()
