const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'wo2',ai:true});const {p}=H;
const st=async(l)=>{const s=await H.state(); console.log(l,'pts',s.balance,'card',s.card.balance, 'ledger', JSON.stringify(s.ledger.slice(0,4).map(x=>[x.label,x.pts])), 'txn', JSON.stringify(s.txns.slice(0,2).map(x=>[x.merchant,x.amount])))};
const plan=async(f)=>p.evaluate(src=>{window.__plan=eval(src)}, f.toString());
try{await p.waitForTimeout(500); await H.nav(3);
await plan(async (t,o,run)=>{await run('search_flights',{destination:'Lisbon',depart_date:'2026-10-09',return_date:'2026-10-12',travellers:1}); return 'Here.'});
await H.ask('flights to lisbon 9-12 oct',1200); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.btn(/Continue with/); await H.btn('Continue',true);
await p.locator('.gr-answer').last().getByText('Card',{exact:true}).click(); await p.waitForTimeout(300); await H.btn(/^Pay /); await H.confirm(); await st('after flight');
const bal=(await H.state()).balance;
await p.evaluate(b=>{window.__plan=async(t,o,run)=>{await run('points_and_giving',{topic:'invest',points:b-73,to:'gold'}); return 'Tick the box and confirm.'}}, bal);
await H.ask('put almost all my points in gold',1200); await p.locator('.gr-answer').last().locator('.gr-ack input').check(); await p.waitForTimeout(200); await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); console.log('sheet', (await H.sheetText()).replace(/\s+/g,' ').slice(0,200)); await H.confirm(); await st('after invest');
await H.nav(4); await p.getByRole('button',{name:'Cancel',exact:true}).first().click(); await p.waitForTimeout(500); console.log('CA',(await H.lastText()).replace(/\s+/g,' ').slice(0,400));
await p.getByRole('button',{name:/^Yes, cancel/}).last().click(); await p.waitForTimeout(500); if(await H.sheetText()) await H.confirm(); console.log('CB',(await H.lastText()).replace(/\s+/g,' ').slice(0,500)); await st('after cancel'); await H.full('cancelled');
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
