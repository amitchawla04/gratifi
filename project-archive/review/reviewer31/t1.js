const H=require('./h.js');const m=process.argv[2]||'UK',th=process.argv[3]||'light';
H.run({market:m,theme:th,name:'tabs-'+m+'-'+th},async h=>{await h.full('home');await h.nav(2);await h.full('explore');await h.nav(3);await h.full('chat');await h.nav(4);await h.full('wallet');await h.nav(5);await h.full('me');});
