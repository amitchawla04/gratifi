const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t11'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
const open = async (q)=>{ await ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); const c=p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await c.scrollIntoViewIfNeeded(); await c.click(); await p.waitForTimeout(500) };
await open('Rain shell jacket');
await p.locator('.gr-answer').last().getByRole('radio',{name:/^Card/}).click().catch(()=>p.locator('.gr-answer').last().getByText(/^Card$/).click());
await btn(/^Pay /); await confirm(); log('R', (await lastText()).replace(/\n/g,' / ').slice(0,300));
let s=await state(); log('s1', s.card.balance, s.balance);
await ask('I want to return my jacket'); log('early', (await lastText()).replace(/\n/g,' / ').slice(0,300));
await nav(5); await btn('Deliver my order'); await nav(3);
await ask('I want to return my jacket'); log('ret', (await lastText()).replace(/\n/g,' / ').slice(0,500));
const yes = p.getByRole('button',{name:/return|Return|Yes/}).last(); log('btns', await p.locator('.gr-answer').last().getByRole('button').evaluateAll(b=>b.map(x=>x.textContent)));
await p.locator('.gr-answer').last().getByRole('button').first().click(); await p.waitForTimeout(600); log('ret2', (await lastText()).replace(/\n/g,' / ').slice(0,500)); log('sheet', await sheetText());
if (await p.$('.app-sheet')) await confirm();
await p.reload(); await p.waitForTimeout(34000); await nav(4);
log('W', (await p.evaluate(()=>document.querySelector('.app-main').innerText)).replace(/\n/g,' / ').slice(0,700));
s=await state(); log('s2', s.card.balance, s.balance, JSON.stringify(s.ledger.slice(0,3)), JSON.stringify(s.txns.slice(0,2)), JSON.stringify(s.alerts?.slice?.(0,3)));
await h.done() })()
