const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t8'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
const open = async (q)=>{ await ask(q); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); const c=p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); await c.scrollIntoViewIfNeeded(); await c.click(); await p.waitForTimeout(500) };
await open('Noise-cancelling headphones');
await open('A cabin suitcase');
const pays = p.getByRole('button',{name:/^Pay /}); log('pay buttons', await pays.count());
// pay the first (older) one
await pays.first().scrollIntoViewIfNeeded(); await pays.first().click(); await p.waitForTimeout(400); log('S1', (await sheetText()).replace(/\n/g,' / ')); await confirm(); log('after1', (await lastText()).slice(0,300));
let s=await state(); log('bookings', s.bookings.map(b=>b.title+':'+b.total).join(' | '), 'bal', s.card.balance, s.balance);
log('pay buttons now', await p.getByRole('button',{name:/^Pay /}).count(), await p.getByRole('button',{name:/^Pay /}).evaluateAll(bs=>bs.map(b=>b.textContent+(b.disabled?'[dis]':''))));
// try clicking the old paid one again
const all = p.getByRole('button',{name:/^Pay /}); for (let i=0;i<await all.count();i++){ const d=await all.nth(i).isDisabled(); log('btn',i,d) }
await p.reload(); await p.waitForTimeout(800); await nav(3);
log('after reload pay buttons', await p.getByRole('button',{name:/^Pay /}).evaluateAll(bs=>bs.map(b=>b.textContent+(b.disabled?'[dis]':''))));
const b2 = p.getByRole('button',{name:/^Pay /}).last(); if (await b2.count()) { await b2.scrollIntoViewIfNeeded(); await b2.click(); await p.waitForTimeout(400); log('S2', (await sheetText()).replace(/\n/g,' / ')); await confirm(); log('after2', (await lastText()).slice(0,300)); }
s=await state(); log('bookings', s.bookings.map(b=>b.title+':'+b.total).join(' | '), 'bal', s.card.balance, s.balance);
// double tap test
await open('Leather trainers'); const pb=p.getByRole('button',{name:/^Pay /}).last(); await pb.scrollIntoViewIfNeeded(); await pb.dblclick(); await p.waitForTimeout(400); const sb=p.locator('.app-sheet .gr-btn').last(); await sb.dblclick().catch(()=>{}); await p.waitForTimeout(2500);
s=await state(); log('after dbl', s.bookings.map(b=>b.title+':'+b.total).join(' | '), 'bal', s.card.balance, s.balance, 'txns', s.txns.length);
await h.done() })()
