const cats=['stays','airport','rides','experiences','dining','shopping','giftcards','subs','tickets'];
module.exports=cats.map(c=>({say:'show '+c, plan:`const r=await run('search_catalogue',{category:'${c}'}); window.__r0=r; return 'Here.'`, post: async h=>{console.log('   RAW:', JSON.stringify(await h.p.evaluate(()=>window.__r0)).slice(0,700))}}));
