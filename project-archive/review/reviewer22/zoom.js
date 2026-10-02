const h=require('./h.js');(async()=>{const M=process.argv[2]||'UK';const H=await h.open(M,{tag:'z-'+M,zoom:'32px',theme:process.argv[3]||'light'});const {p}=H;
try{await H.shot('home');await H.nav(2);await H.shot('explore');await H.nav(5);await H.shot('me');await H.nav(3);
await H.ask(M==='AR'?'فندق في مسقط':'A hotel in Lisbon with a pool',900); await H.shot('stays');
await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await H.shot('detail');
await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await H.shot('checkout');
await p.getByRole('button',{name:/^(Pay |ادفع )/}).last().click(); await p.waitForTimeout(500); await H.shot('sheet');
const ov=await p.evaluate(()=>{const W=document.documentElement.clientWidth;return [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+2||r.left<-2)&&getComputedStyle(e).position!=='fixed'&&!e.closest('[class*=scroll],[class*=chips],[class*=rail],.gr-hscroll')}).slice(0,15).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().right))});console.log('overflow',ov, await p.evaluate(()=>document.documentElement.scrollWidth));
}catch(e){console.log('ERR',e.message.split('\n')[0]);await H.shot('fail')}
console.log(H.errs);await H.close()})()
