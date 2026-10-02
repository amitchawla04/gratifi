const H=require('./h.js');const m=process.argv[2]||'UK';
H.run({market:m,name:'z200-'+m,zoom:200},async h=>{const p=h.p;await h.sh('home');await h.nav(3);
await h.ask('Flights to Lisbon next weekend for two',1200);await h.sh('flights');
await p.locator('.gr-flight').first().click();await p.waitForTimeout(400);await h.sh('fares');
await h.click(/Continue with|تابع بالدرجة/);await h.sh('seats');
{const ins=h.last().locator('input.app-in');for(let i=0;i<await ins.count();i++){if(!(await ins.nth(i).inputValue()))await ins.nth(i).fill('Sam Taylor')}}
await h.click(m==='AR'?'متابعة':'Continue',{exact:true}).catch(e=>h.log(e.message.slice(0,80)));await h.sh('checkout');
await h.click(/^Pay |^ادفع /);await h.sh('sheet');
const ov=await p.evaluate(()=>{const out=[];document.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>0&&(r.right>innerWidth+2)&&getComputedStyle(e).position!=='fixed'){out.push(e.className+':'+Math.round(r.right))}});return [document.documentElement.scrollWidth,innerWidth,out.slice(0,10)]});h.log('overflow',JSON.stringify(ov));
await p.keyboard.press('Escape');await h.nav(5);await h.sh('me');await h.nav(4);await h.sh('wallet');
});
