const run = require('./h.js'); const [m, th] = [process.argv[2] || 'UK', process.argv[3] || 'light'];
run(`tabs-${m}-${th}`, m, async h => { await h.full('home'); await h.nav(2); await h.full('explore'); await h.nav(3); await h.full('chat'); await h.nav(4); await h.full('wallet'); await h.nav(5); await h.full('me') }, { theme: th });
