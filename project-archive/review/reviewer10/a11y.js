const run=require('./h.js'); const m=process.argv[2]||'UK';
run(`a11y-${m}`, m, async (h)=>{ const {p,shot,full,nav,ask,click,last,lastText,st,confirm,log}=h;
  const unnamed = async (t)=> log(t, 'unnamed', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button,a,input,[role=button],[role=switch],[role=radio],textarea,select')].filter(e=>{ const n=(e.getAttribute('aria-label')||e.innerText||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim(); const lab=e.id&&document.querySelector(`label[for="${e.id}"]`); const wrap=e.closest('label'); return !n && !lab && !wrap && e.offsetParent }).map(e=>e.outerHTML.slice(0,140)))));
  await unnamed('home');
  log('live regions', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[aria-live],[role=log],[role=status],[role=alert]')].map(e=>e.tagName+'.'+e.className+' '+(e.getAttribute('aria-live')||e.getAttribute('role'))))));
  // keyboard: tab through home
  const seq=[]; for(let i=0;i<12;i++){ await p.keyboard.press('Tab'); seq.push(await p.evaluate(()=>{const e=document.activeElement; return (e.getAttribute('aria-label')||e.innerText||e.tagName).slice(0,30).replace(/\s+/g,' ')})) } log('tab seq', JSON.stringify(seq));
  await shot('focus'); 
  await nav(3); await unnamed('chat');
  log('chat live', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[aria-live],[role=log],[role=status]')].map(e=>e.className+' '+(e.getAttribute('aria-live')||e.getAttribute('role'))))));
  await ask('A hotel in Lisbon with a pool'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await unnamed('detail');
  log('radiogroups', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[role=radiogroup]')].map(g=>(g.getAttribute('aria-label')||g.getAttribute('aria-labelledby')||'NOLABEL')+':'+g.querySelectorAll('[role=radio]').length))));
  log('pressed chips not radio', await p.evaluate(()=>document.querySelectorAll('.gr-slot:not([role=radio])').length));
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400);
  await click(/^Pay /); await p.waitForTimeout(500);
  log('sheet role', await p.evaluate(()=>{const s=document.querySelector('.app-sheet'); return s && (s.getAttribute('role')+' modal='+s.getAttribute('aria-modal')+' label='+(s.getAttribute('aria-label')||s.getAttribute('aria-labelledby')))}));
  log('focus in sheet', await p.evaluate(()=>!!document.activeElement.closest('.app-sheet')), await p.evaluate(()=>document.activeElement.outerHTML.slice(0,100)));
  const inside=[]; for(let i=0;i<8;i++){ await p.keyboard.press('Tab'); inside.push(await p.evaluate(()=>!!document.activeElement.closest('.app-sheet')+':'+(document.activeElement.getAttribute('aria-label')||document.activeElement.innerText||'').slice(0,20))) } log('tab in sheet', JSON.stringify(inside));
  const back=[]; for(let i=0;i<4;i++){ await p.keyboard.press('Shift+Tab'); back.push(await p.evaluate(()=>!!document.activeElement.closest('.app-sheet'))) } log('shift-tab in sheet', JSON.stringify(back));
  await p.keyboard.press('Escape'); await p.waitForTimeout(400); log('sheet after esc', !!(await p.$('.app-sheet')), 'focus back to', await p.evaluate(()=>(document.activeElement.innerText||document.activeElement.tagName).slice(0,30)));
  // Enter on pay button with keyboard
  await p.focus('.gr-ask input'); 
  // text size 200%
  await p.evaluate(()=>document.documentElement.style.fontSize='200%'); await p.waitForTimeout(300); await nav(1); await shot('big-home'); await nav(3); await shot('big-chat'); await nav(5); await shot('big-me');
  log('hscroll', await p.evaluate(()=>[document.documentElement.scrollWidth, document.documentElement.clientWidth, (document.querySelector('.app-main .app-scroll')||{}).scrollWidth]));
});
