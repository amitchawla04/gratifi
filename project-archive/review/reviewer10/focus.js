const run=require('./h.js'); const m=process.argv[2]||'UK'; const theme=process.argv[3]||'light';
run(`focus-${m}-${theme}`, m, async (h)=>{ const {p,shot,log}=h;
  for(let i=0;i<3;i++) await p.keyboard.press('Tab'); await shot('usepoints');
  log(await p.evaluate(()=>{const e=document.activeElement; const s=getComputedStyle(e); return e.innerText+' outline='+s.outline+' shadow='+s.boxShadow}));
  for(let i=0;i<8;i++) await p.keyboard.press('Tab'); await shot('tile');
  log(await p.evaluate(()=>{const e=document.activeElement; const s=getComputedStyle(e); return e.innerText.slice(0,20)+' outline='+s.outline+' shadow='+s.boxShadow}));
},{theme});
