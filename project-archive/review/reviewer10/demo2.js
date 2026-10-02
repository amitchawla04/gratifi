const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`demo2-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const S=async(t)=>{const s=await st(); log(t,'bal',s&&s.balance,'card',s&&s.card.balance,'bk',JSON.stringify((s&&s.bookings||[]).map(b=>[b.title,b.status,b.pts,b.card])),'pending',JSON.stringify(s&&s.pending||[]))};
  await nav(3); await ask('Earn extra points shopping'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600); await click('I bought something there (demo)'); await full('bought'); log('BOUGHT', await lastText()); await S('bought');
  await nav(5); await full('me-pending'); log('ME', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,700));
  await click('Return window ends'); await p.waitForTimeout(600); await S('window ended'); await nav(3); log('LANDED', await lastText()); await full('landed');
  // price rise
  await nav(5); await p.locator('.app-demo [role=switch]').nth(0).click(); await nav(3);
  await ask('A cabin suitcase'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  await click(/^Pay /); await p.waitForTimeout(500); log('sheet?', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) { await shot('rise-sheet'); log('RSHEET',(await p.locator('.app-sheet').innerText()).replace(/\s+/g,' ')); await confirm() }
  await full('rise'); log('RISE', await lastText()); await S('after rise');
  const cont=p.getByRole('button',{name:/^Continue at/}); if (await cont.count()) { await cont.last().click(); await p.waitForTimeout(500); await full('rise-reopen'); log('REOPEN', await lastText()); await click(/^Pay /); await confirm(); await full('rise-paid'); log('RPAID', await lastText()); await S('rise paid') }
  // declined
  await nav(5); await p.locator('.app-demo [role=switch]').nth(2).click(); await nav(3);
  await ask('Leather trainers'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  await last().getByText('Card',{exact:true}).click(); await p.waitForTimeout(200);
  await click(/^Pay /); await p.waitForTimeout(300); if (await p.$('.app-sheet')) await confirm(); await full('declined'); log('DECL', await lastText()); await S('after decline');
  // pay with points while declined
  const pts=p.getByRole('button',{name:/points/i}).last(); log('decline buttons', JSON.stringify(await last().getByRole('button').allInnerTexts()));
});
