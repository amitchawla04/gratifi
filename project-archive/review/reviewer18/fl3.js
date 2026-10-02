const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:900,tag:'FL3'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance.toFixed(2))};
await H.say('Flights to Barcelona on Fri 16 Oct after 6pm, back on the 20th, 2 adults and a child aged 8'); await H.shot('results');
await H.say('earlier'); await H.say('cheaper'); await H.say('what about Thursday');
await H.say('Flights to Barcelona on Fri 16 Oct back 20 Oct for 2 adults and a child aged 8');
await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(500); await H.fullshot('fares'); console.log('FARES', await H.last());
await p.locator('.gr-answer').last().getByRole('radio',{name:/^Flex/}).first().click().catch(e=>console.log('noflex'));
await H.click(/Continue with/); await H.fullshot('seats'); console.log('SEATS', await H.last());
const ins=p.locator('.gr-answer').last().locator('input'); const n=await ins.count(); for(let i=0;i<n;i++){console.log('in',i,await ins.nth(i).getAttribute('placeholder'),await ins.nth(i).getAttribute('type'),await ins.nth(i).getAttribute('aria-label'))}
// try non-latin name
const tx=p.locator('.gr-answer').last().locator('input.app-in');
await tx.nth(1).fill('Zoë Müller'); await tx.nth(2).fill('Jo'); await p.waitForTimeout(300); console.log('NAMES', (await H.last()).slice(-400)); await H.fullshot('names-bad');
await tx.nth(1).fill('Zoe Muller'); await tx.nth(2).fill('Jo Muller'); 
const dob=p.locator('.gr-answer').last().locator('input[type=date]'); if(await dob.count()){ await dob.first().fill('2024-01-01'); await p.waitForTimeout(300); console.log('DOB2024', (await H.last()).slice(-300)); await dob.first().fill('2018-03-03'); }
// try exit row seat for child
const exitSeats=p.locator('.gr-answer').last().locator('button[aria-label*="xit"], .gr-seat.exit, [data-exit]'); console.log('exit seat els', await exitSeats.count());
await H.click('Continue',true); await H.fullshot('checkout'); console.log('CO', await H.last());
await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click(); await H.click(/^Pay /); console.log('SH',await H.confirm()); console.log('RC', await H.last()); await B('booked');
await H.say('show my boarding passes'); await H.shot('passes');
await H.say('move my return flight to the evening'); await H.shot('chg-ret');
await H.say('can I switch my outbound to Aurora Air instead?');
await H.say('change my outbound to Saturday 17 Oct'); await H.shot('chg-out');
await H.say('change my seats'); await H.shot('seats2');
await H.say('cancel my Barcelona flight'); await H.fullshot('cancel-ask');
await H.click('Yes, cancel'); console.log(await H.last()); await B('after cancel');
await H.say('cancel my Barcelona flight'); 
await H.done()})()
