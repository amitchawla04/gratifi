const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`demo-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const S=async(t)=>{const s=await st(); log(t,'bal',s&&s.balance,'card',s&&s.card.balance,'bk',s&&s.bookings.length,'pending',JSON.stringify(s&&s.pending||[]))};
  await nav(5); await click(/Points come in/); await p.waitForTimeout(400); await S('after points in'); await shot('pts-in');
  await click('A card payment'); await p.waitForTimeout(400); await S('after card pay'); await shot('card-pay');
  await nav(1); await full('home-after'); await nav(3); await full('chat-after'); log('CHAT', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,1200));
  // affiliate
  await ask('Earn extra points shopping'); await full('aff-list'); log('AFF', await lastText());
  await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await full('aff-detail'); log('AFFD', await lastText());
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600); await full('aff-go'); log('AFFGO', await lastText());
  await S('after affiliate');
  await nav(5); await click('Return window ends'); await p.waitForTimeout(500); await S('after return window'); await nav(3); await full('aff-landed'); log('LANDED', await lastText());
  // supplier down
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click(); await S('supplier down on');
  await nav(3); await ask('A cabin suitcase'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  await full('sd-checkout'); log('SDCO', await lastText());
  await click(/^Pay /); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await confirm(); await full('sd-result'); log('SD', await lastText()); await S('after supplier down pay');
  await nav(5); await p.locator('.app-demo [role=switch]').nth(1).click();
  await click('Suspicious payment'); await p.waitForTimeout(500); await nav(3); await full('susp'); log('SUSP', await lastText()); await S('after susp');
  await nav(5); await click('Reset demo'); await p.waitForTimeout(500); await shot('reset'); await S('after reset');
});
