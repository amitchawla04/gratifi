const h=require('./h.js');(async()=>{const H=await h.open('UK',{tag:'wo'});const {p}=H;
const st=async(l)=>{const s=await H.state(); console.log(l,'pts',s.balance,'card',s.card.balance, 'ledger', JSON.stringify(s.ledger.slice(0,4).map(x=>[x.label,x.pts])))};
try{await H.nav(3);
await H.ask('Flights to Lisbon from 9 Oct to 12 Oct for one'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.btn(/Continue with/); await H.btn('Continue',true);
await p.locator('.gr-answer').last().getByText('Card',{exact:true}).click(); await p.waitForTimeout(300); await H.btn(/^Pay /); await H.confirm(); await st('after flight');
// spend all points via gift cards points-only: use Put points into gold with custom
await H.ask('Put points into gold'); console.log('INV', (await H.lastText()).replace(/\s+/g,' ').slice(0,500)); await H.full('invest');
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
