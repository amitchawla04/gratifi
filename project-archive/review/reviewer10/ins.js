const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`ins-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('Travel insurance'); 
  await last().getByRole('button',{name:/Get this cover/}).first().click(); await p.waitForTimeout(500); await full('ins-next'); log('INS', await lastText());
  const b=last().locator('.gr-btn').last(); log('btn', await b.innerText(), await b.isDisabled());
  await ask('Challenges'); await full('chl'); log('CHL', await lastText());
  await ask('Show me card offers'); await full('offers'); log('OFF', await lastText());
});
