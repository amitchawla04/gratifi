const setup=require('./lib.js');
(async()=>{ const h=await setup('UK',{tag:'t13'}); const {p,nav,ask,full,lastText,log,btn,state,confirm,sheetText,shot}=h;
await nav(3);
// gift card bad email
await ask('A gift card for a friend'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
const A=()=>p.locator('.gr-answer').last();
log('G', (await A().innerText()).replace(/\n/g,' / ').slice(0,500));
const ins=A().locator('.app-in'); await ins.nth(0).fill('Sam'); await ins.nth(1).fill('sam@exa'); await p.waitForTimeout(200);
log('G btn', await A().locator('.gr-detail .gr-btn').last().evaluate(b=>b.textContent+(b.disabled?'[dis]':'')));
await ins.nth(1).fill('sam@example.com'); log('G btn2', await A().locator('.gr-detail .gr-btn').last().evaluate(b=>b.textContent+(b.disabled?'[dis]':'')));
// dining group
await ask('a table tonight'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
for (let i=0;i<15;i++) await A().locator('button[aria-label^="More"]').first().click({timeout:800}).catch(()=>{});
log('D', (await A().innerText()).replace(/\n/g,' / ').slice(-400));
// tickets quantity
await ask('Concerts this month'); await A().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400);
for (let i=0;i<15;i++) await A().locator('button[aria-label^="More"]').first().click({timeout:800}).catch(()=>{});
log('T', (await A().innerText()).replace(/\n/g,' / ').slice(-400));
// transfer bad membership
await ask('Transfer points to miles'); await A().locator('.gr-btn').first().click(); await p.waitForTimeout(400); log('TR', (await A().innerText()).replace(/\n/g,' / ').slice(0,500));
await A().locator('input.app-in').fill('12'); log('TRbtn', await A().locator('.gr-btn').last().evaluate(b=>b.textContent+(b.disabled?'[dis]':'')));
// invest without tick
await ask('Put points into gold'); log('INV', (await A().innerText()).replace(/\n/g,' / ').slice(0,900)); log('INVbtn', await A().getByRole('button',{name:/Continue with the partner/}).evaluate(b=>b.disabled));
await h.done() })()
