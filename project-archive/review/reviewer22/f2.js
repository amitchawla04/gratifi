const h=require('./h.js');(async()=>{const M=process.argv[2]||'UK';const H=await h.open(M,{tag:'f2-'+M});const {p}=H;
const city={UK:'Lisbon',EU:'Rome',IN:'Goa',AE:'Muscat',AR:'Muscat',SG:'Bali',MY:'Penang'}[M];
try{
await H.nav(3); await H.ask(`Flights to ${city} from 9 Oct to 12 Oct for 2 adults and a child aged 7`);
await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
await H.btn(/Continue with/);
const ins=p.locator('.gr-answer').last().locator('input.app-in');
console.log('inputs', await ins.count());
await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla');
const d=p.locator('.gr-answer').last().locator('input[type=date]');
await d.fill('2025-03-01'); await p.waitForTimeout(300); console.log('DOB infant ->', (await H.lastText()).slice(-300));
await d.fill('2010-03-01'); await p.waitForTimeout(300); console.log('DOB 16 ->', (await H.lastText()).slice(-300));
await d.fill('2019-03-01'); await p.waitForTimeout(300);
// try exit seat for child
await ins.nth(2).fill('Kabir Chawla');
await H.full('seats-filled');
await H.btn('Continue',true); await H.full('checkout'); console.log('CHK', await H.lastText());
const bal0=(await H.state())?.card; 
await H.btn(/^Pay /); console.log('SHEET', await H.sheetText()); await H.shot('sheet'); await H.confirm(); await H.full('receipt'); console.log('RCPT', await H.lastText());
const s=await H.state(); console.log('card', JSON.stringify(s.card), 'pts', s.balance, 'bk', JSON.stringify(s.bookings[0]).slice(0,800));
}catch(e){console.log('ERR',e.message.split('\n')[0]); await H.shot('fail')}
console.log(H.errs); await H.close()})()
