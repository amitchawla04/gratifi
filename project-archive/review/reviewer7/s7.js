const H=require('./h.js');
H('UK','s7', async (h)=>{ const {p,shot,full,nav,ask,click,log}=h;
  const audit = async (tag) => log(tag, JSON.stringify(await p.evaluate(() => {
    const name = el => (el.getAttribute('aria-label') || el.innerText || el.title || '').trim();
    const btns=[...document.querySelectorAll('button,[role=button],a')].filter(b=>b.offsetParent);
    const unnamed=btns.filter(b=>!name(b) && !b.getAttribute('aria-labelledby')).map(b=>b.outerHTML.slice(0,120));
    const inputs=[...document.querySelectorAll('input,textarea,select')].filter(i=>i.offsetParent && !i.getAttribute('aria-label') && !i.labels?.length && !i.getAttribute('aria-labelledby')).map(i=>i.outerHTML.slice(0,120));
    const live=[...document.querySelectorAll('[aria-live],[role=log],[role=status],[role=alert]')].map(e=>e.tagName+':'+(e.getAttribute('aria-live')||e.getAttribute('role'))+':'+e.className.slice(0,30));
    const small=[...document.querySelectorAll('button')].filter(b=>b.offsetParent).map(b=>b.getBoundingClientRect()).filter(r=>r.width>0&&(r.height<24||r.width<24)).length;
    const h1=[...document.querySelectorAll('h1,h2,h3')].map(e=>e.tagName+':'+e.innerText.slice(0,20));
    const nav=[...document.querySelectorAll('.gr-nav button')].map(b=>(b.getAttribute('aria-label')||b.innerText)+'|'+(b.getAttribute('aria-current')||b.getAttribute('aria-selected')||''));
    return {unnamed:unnamed.slice(0,6), nUnnamed:unnamed.length, inputs, live:live.slice(0,5), small, h1:h1.slice(0,5), nav, lang:document.documentElement.lang};
  })));
  await audit('home'); await nav(3); await ask('Flights to Lisbon next weekend for two'); await audit('chat');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(300); await audit('fares');
  // keyboard: can a flight card be reached/activated by keyboard?
  log('flight card focusable', await p.evaluate(()=>{const f=document.querySelector('.gr-flight'); return f.tagName+' tabindex='+f.tabIndex+' role='+f.getAttribute('role')}));
  log('seat focusable', await p.evaluate(()=>{const f=document.querySelector('.gr-seat'); return f? f.tagName+' '+f.getAttribute('aria-label'):'none'}));
  log('item row', await p.evaluate(()=>{const f=document.querySelector('.gr-itemrow,.gr-cattile'); return f? f.tagName+' tabindex='+f.tabIndex:'none'}));
  // grocery pay, test sheet focus trap with Tab
  await ask('Milk, eggs and bread'); await click('Checkout'); await p.getByRole('button',{name:/^Pay /}).last().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const seq=[]; for(let i=0;i<6;i++){ seq.push(await p.evaluate(()=>{const a=document.activeElement; return (a.getAttribute('aria-label')||a.innerText||a.tagName).slice(0,25)+(document.querySelector('.app-sheet').contains(a)?'':'(OUT)')})); await p.keyboard.press('Tab') }
  log('tab order in sheet', JSON.stringify(seq));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); log('focus after esc', await p.evaluate(()=>(document.activeElement.innerText||document.activeElement.tagName).slice(0,30)));
  // text size 200%
  await p.evaluate(()=>{document.documentElement.style.fontSize='200%'}); await nav(1); await shot('font200-home'); await nav(3); await shot('font200-chat');
  // Check horizontal overflow
  log('hscroll', await p.evaluate(()=>document.documentElement.scrollWidth+' vs '+innerWidth));
});
