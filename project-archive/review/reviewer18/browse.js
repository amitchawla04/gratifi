const {setup}=require('./h.js');
const m=process.argv[2]||'UK', th=process.argv[3]||'light';
(async()=>{const H=await setup(m,{len:300,tag:'BR-'+m+'-'+th,tab:'home',theme:th});const p=H.p;
await H.fullshot('home');
// banners
const cards=await p.locator('.app-scroll button, .app-scroll [role=button]').allInnerTexts(); console.log('HOME BUTTONS', JSON.stringify(cards.map(s=>s.replace(/\n/g,' / ').slice(0,60))));
await H.nav(2); await H.fullshot('explore');
const tiles=await p.locator('.app-catgrid > *').count(); console.log('tiles',tiles);
for(let i=0;i<tiles;i++){ await H.nav(2); const t=p.locator('.app-catgrid > *').nth(i); const lbl=(await t.innerText()).split('\n')[0]; await t.click(); await p.waitForTimeout(350);
  const scr=await H.screen(); console.log('\nCAT',lbl,'::',scr.slice(0,500));
  if([0,1,5,6,9,17].includes(i)) await H.fullshot('cat-'+lbl.replace(/\W/g,''));
  const chips=p.locator('.app-subcats button'); const n=await chips.count();
  if(n){ const c=chips.nth(0); const cl=await c.innerText(); await c.click(); await p.waitForTimeout(700); console.log('  SUB',cl,'->',(await H.last()).slice(0,300)); }
}
await H.done()})()
