const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:500,tag:'OLD'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance.toFixed(2),'bookings',s.bookings.length)};
await H.say('Hush 700 headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300);
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
const payBtn=p.getByRole('button',{name:/^Pay /}).last(); await payBtn.click(); await H.confirm(); await B('paid once');
console.log('pay buttons now', await p.getByRole('button',{name:/^Pay /}).count(), 'disabled?', await p.getByRole('button',{name:/^Pay /}).evaluateAll(bs=>bs.map(b=>b.disabled||b.getAttribute('aria-disabled'))));
// click old detail CTA again
const cta=p.locator('.gr-detail .gr-btn').last(); console.log('detail cta', await cta.innerText(), await cta.isDisabled()); await cta.click({force:true}).catch(e=>console.log('cta click err')); await p.waitForTimeout(400); console.log('after old cta', (await H.last()).slice(0,200));
await p.reload(); await p.waitForTimeout(800); await B('after reload');
const pb=p.getByRole('button',{name:/^Pay /}); console.log('pay after reload', await pb.count()); if(await pb.count()){ await pb.last().click({force:true}).catch(()=>{}); await p.waitForTimeout(400); console.log('sheet?', await H.sheetText()); }
// sheet open then reload mid-auth
await H.say('pay £50 off my card'); console.log('sheet', (await H.sheetText()).slice(0,100)); await p.reload(); await p.waitForTimeout(800); await B('reload mid sheet'); console.log('sheet after reload', await H.sheetText());
// old flight result after booking: click first flight in an old results card
await H.say('flights to Paris on 14 Oct for 1 one way'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400);
await H.click(/Continue with/); await H.click('Continue',true); await p.locator('.gr-answer').last().getByRole('radio',{name:/^Points$/}).click().catch(()=>{}); await H.click(/^Pay /); await H.confirm(); await B('flight booked');
const old=p.locator('.gr-answer').filter({has:p.locator('.gr-flight')}).first().locator('.gr-flight').nth(1); await old.click({force:true}).catch(()=>{}); await p.waitForTimeout(400); console.log('old flight click ->', (await H.last()).slice(0,300));
const oldCont=p.getByRole('button',{name:/Continue with/}).first(); console.log('old continue disabled', await oldCont.isDisabled().catch(()=>'n/a'));
await H.done()})()
