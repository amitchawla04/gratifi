const {setup}=require('./h.js');
(async()=>{const H=await setup('UK',{fake:true,len:400});const p=H.p;
await p.waitForTimeout(800); console.log('mode', await p.evaluate(()=>document.querySelector('.app-mode')?.textContent));
const plan=async(fn,t,w=900)=>{await p.evaluate(s=>{window.__plan=eval(s); window.__res=[]},fn); await p.evaluate(()=>window.__calls=[]); const r=await H.say(t,w); const res=await p.evaluate(()=>JSON.stringify((window.__res||[]).map(x=>typeof x==='string'?x:{n:x.n,a:x.a,r:x.r}))); console.log('   TOOLS:',res.slice(0,700)); const calls=await p.evaluate(()=>window.__calls.length); console.log('   sample calls:',calls, 'bal', JSON.stringify(await H.bal())); return r};
await plan(`async(t,o,run)=>{await run('prepare_checkout',{id:'x'});return 'ok'}`,'probe ids');
// find catalogue ids
await plan(`async(t,o,run)=>{await run('search_catalogue',{category:'stays',city:'Lisbon'});return 'Here are stays!! 🎉'}`,'hotels in lisbon');
await plan(`async(t,o,run)=>{await run('search_catalogue',{category:'shopping',query:'headphones'});return 'Here'}`,'headphones');
await plan(`async(t,o,run)=>{await run('search_catalogue',{category:'giftcards'});return 'Here'}`,'gift cards');
await plan(`async(t,o,run)=>{await run('search_catalogue',{category:'dining'});return 'Here'}`,'dining');
console.log(JSON.stringify((await H.st()).chat.flatMap(m=>(m.blocks||[]).filter(b=>b.kind==='items').map(b=>b.ids))));
await H.done()})()
