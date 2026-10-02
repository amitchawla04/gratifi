const setup = require('./h.js')
module.exports = async () => { const h = await setup('UK', { tag: 'uk0' }); const { p, shot, nav, st, keys } = h
  console.log(await keys()); const s = await st(); console.log(JSON.stringify(s).slice(0, 1500))
  await shot('home', true); await nav(2); await shot('explore', true); await nav(3); await shot('chat', true); await nav(4); await shot('wallet', true); await nav(5); await shot('me', true)
  await h.close() }
