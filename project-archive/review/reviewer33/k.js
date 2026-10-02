const { open } = require('./h.js');
(async () => { const h = await open('UK'); await h.nav(3); await h.ask('hello'); 
 const s = await h.st(); console.log(Object.keys(s)); console.log(JSON.stringify(s.card), JSON.stringify(s.chat).slice(0,800));
 await h.close() })();
