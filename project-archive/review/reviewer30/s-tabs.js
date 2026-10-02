module.exports = async (H) => { const { full, nav, p } = H; await full('home'); await nav(2); await full('explore'); await nav(3); await full('chat'); await nav(4); await full('wallet'); await nav(5); await full('me');
 const txt = await p.evaluate(() => document.body.innerText); require('fs').writeFileSync(__dirname + '/tabs-' + H.market + '.txt', txt) }
