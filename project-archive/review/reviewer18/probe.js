const {setup}=require('./h.js');
const m=process.argv[2]||'UK'; const list=require(process.argv[3]);
(async()=>{const H=await setup(m,{len:+process.argv[4]||260});
for(const t of list){ try{ await H.say(t,350) }catch(e){console.log('ERR',t,e.message.split('\n')[0])} }
await H.done()})()
