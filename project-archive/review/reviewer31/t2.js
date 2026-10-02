const H=require('./h.js');
H.run({market:'UK',name:'credit'},async h=>{const {p}=h;await h.nav(3);
await h.ask('8 laptops');await h.p.locator('.gr-answer').last().locator('.gr-itemrow').first().click().catch(()=>{});await p.waitForTimeout(400);
h.log(await h.lastText());
await h.full('laptop-detail');
const cta=h.last().locator('.gr-detail .gr-btn').last();await cta.click();await p.waitForTimeout(500);
await h.full('laptop-checkout'); h.log(await h.lastText());
// choose card
const card=h.last().locator('.gr-opt,[role=radio]').last(); await card.click().catch(e=>h.log('noopt',e.message)); await p.waitForTimeout(300);
h.log('AFTER CARD', await h.lastText());
const pay=p.getByRole('button',{name:/^Pay /}).last(); h.log('pay disabled?', await pay.isDisabled().catch(()=>'none'));
await pay.click().catch(e=>h.log('payclick',e.message)); await p.waitForTimeout(500); h.log('SHEET',await h.sheetText()); await h.sh('sheet');
if(await p.$('.app-sheet')){await h.confirm(); h.log('after confirm',await h.lastText()); const s=await h.state(); h.log('bal',s.card.balance,'pts',s.balance);} await h.full('end');
});
