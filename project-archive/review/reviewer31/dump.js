const H=require('./h.js');const fs=require('fs');
H.run({market:process.argv[2]||'UK',name:'dump',ai:true},async h=>{await h.nav(3);
await h.p.evaluate(()=>{window.__plan=async(turns,o)=>{window.__dump={rules:turns[0].content,tools:o.tools.map(t=>({name:t.name,description:t.description,schema:t.inputSchema||t.input_schema||t.parameters}))};return 'ok'}});
await h.ask('hello',1500);const d=await h.p.evaluate(()=>window.__dump);fs.writeFileSync('dump.json',JSON.stringify(d,null,1));console.log(d.rules.length,d.tools.length, await h.p.evaluate(()=>document.querySelector('.app-mode')?.textContent));});
