const run=require('./h.js'); const [m,theme]=[process.argv[2]||'UK',process.argv[3]||'light'];
run(`tabs-${m}-${theme}`, m, async ({full,nav})=>{ await full('home'); await nav(2); await full('explore'); await nav(3); await full('chat'); await nav(4); await full('wallet'); await nav(5); await full('me') },{theme});
