const H=require('./h.js');
H.run({market:'UK',name:'old'},async h=>{const p=h.p;await h.nav(3);
await h.ask('Rain shell jacket');await h.last().locator('.gr-itemrow').first().click();await p.waitForTimeout(300);
await h.last().locator('.gr-chip').nth(1).click();await h.last().locator('.gr-detail .gr-btn').last().click();await p.waitForTimeout(400);
// now open checkout 1; then ask another thing; then reload
await h.ask('Leather trainers'); await p.reload(); await p.waitForTimeout(700); await h.nav(3);
const pays=p.getByRole('button',{name:/^Pay /}); h.log('pay buttons after reload', await pays.count(), await pays.first().isDisabled().catch(()=>'-'));
if(await pays.count()){await pays.first().scrollIntoViewIfNeeded(); await pays.first().click().catch(e=>h.log(e.message.slice(0,50))); await p.waitForTimeout(400); h.log('sheet', await h.sheetText()); if(await p.$('.app-sheet')) await h.confirm(); h.log('last', (await h.lastText()).slice(0,200));}
const s=await h.state(); h.log('bookings', s.bookings.map(b=>b.title+':'+b.status).join(','));
// try pay again on same old card
const pays2=p.getByRole('button',{name:/^Pay /}); h.log('pay buttons now', await pays2.count(), await pays2.first().isDisabled().catch(()=>'-'));
if(await pays2.count() && !(await pays2.first().isDisabled())){await pays2.first().click(); await p.waitForTimeout(400); h.log('sheet2', await h.sheetText());}
// open detail with size pick in old detail card
const conts=p.getByRole('button',{name:/^Continue$/}); h.log('old continue enabled', await conts.count(), await conts.first().isDisabled().catch(()=>'-'));
await h.full('end');
});
