const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{len:700,tag:'DEMO2'});const p=H.p;
const B=async(l)=>{const s=await H.st(); console.log('   ##',l,'pts',s.balance,'card',s.card.balance.toFixed(2),'orders',s.bookings.length, 'txns',s.txns.length)};
const toggle=async(lbl)=>{await H.nav(5); const sw=p.getByRole('switch',{name:lbl}); if(await sw.count()){await sw.click()} else { const cb=p.getByLabel(lbl); await cb.click() } await p.waitForTimeout(300); await H.nav(3)};
const buyHeadphones=async(card)=>{await H.say('Hush 700 headphones'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); if(card) await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click(); console.log('CO',(await H.last()).slice(0,500)); await H.click(/^Pay /); const t=await H.confirm(); console.log('SHEET',t); console.log('AFTER',(await H.last()).slice(0,500)); };

await toggle('Price rises at the next checkout'); await buyHeadphones(false); await B('after price rise'); await H.shot('pricerise');
await toggle('Supplier is down'); await buyHeadphones(false); await B('after supplier down'); await H.shot('supplier'); await toggle('Supplier is down');
await toggle('Card is declined'); await buyHeadphones(true); await B('after declined'); await H.shot('declined'); await toggle('Card is declined');
await H.nav(5); await H.click('A card payment'); await H.click('Points come in (+5,000)'); await B('after card payment+points'); await H.nav(3); console.log('LAST', await H.last());
await H.nav(5); await H.click('Suspicious payment'); await H.nav(3); console.log('SUSP', await H.last()); await H.shot('susp');
const bs=await p.locator('.gr-answer').last().locator('button').allInnerTexts(); console.log('susp buttons',bs);
await H.click(bs.find(b=>/wasn|not me/i.test(b))||bs[bs.length-1]); console.log('AFTER SUSP', await H.last()); await B('after susp');
await H.done()})()
