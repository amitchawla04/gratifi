const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`hand-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  await nav(3); await ask('I want to complain'); await click('Chat now'); await p.waitForTimeout(600); log('CHAT', await lastText());
  await ask('I want to complain'); await click('Call me'); await p.waitForTimeout(600); log('CALL', await lastText());
  await ask('I feel like ending it all'); await full('crisis'); log('CRISIS', await lastText());
  log('tel links', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.href+' '+a.innerText.replace(/\s+/g,' ')))));
  await ask('Voice'); await p.click('.gr-ask button[aria-label]').catch(()=>{}); await p.waitForTimeout(300); log('MIC', await lastText());
});
