const H=require('./h.js');
H.run({market:'UK',name:'live'},async h=>{const p=h.p;await h.nav(3);await h.ask('What do I owe?');
h.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[aria-live],[role=status],[role=log],[role=alert]')].map(e=>e.tagName+'.'+e.className.slice(0,30)+':'+(e.getAttribute('aria-live')||e.getAttribute('role'))))));
// check contrast of orange points text
h.log(await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>/pts$/.test(x.innerText||'')&&x.children.length===0);if(!e)return 'none';const cs=getComputedStyle(e);return cs.color+' on '+getComputedStyle(document.body).backgroundColor+' size '+cs.fontSize}));
});
