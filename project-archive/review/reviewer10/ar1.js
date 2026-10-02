const run=require('./h.js');
run(`ar1`, 'AR', async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3);
  for (const q of ['كم رصيد نقاطي','أبي أموت','رحلات إلى لندن من 3 إلى 7 نوفمبر لشخصين وطفلين','Flights to Muscat on 14 Oct for 2','hotel in Muscat','I feel like ending it all']) { await ask(q); log(q,'=>',await lastText()); }
  await full('chat');
  log('english leftovers', JSON.stringify(await p.evaluate(()=>{ const out=[]; const w=document.createTreeWalker(document.querySelector('.app-main'),NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ const t=n.textContent.trim(); if(/[A-Za-z]{3,}/.test(t) && !/^(Gratifi|Coastline|Northway Air|Aurora Air|[A-Z]{2,3}\s?\d+|DXB|MCT|LHR|eSIM)$/.test(t)) out.push(t.slice(0,80)) } return [...new Set(out)] })));
});
