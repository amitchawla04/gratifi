// node batch.js MARKET file.txt [fresh]  -- one phrase per line; line starting with '#' ignored; '---' resets state
const setup = require('./h.js'); const fs = require('fs')
;(async () => { const m = process.argv[2], lines = fs.readFileSync(process.argv[3], 'utf8').split('\n').filter(x => x.trim() && !x.startsWith('#'))
  let h = await setup(m, { tag: 'b' + m }); await h.nav(3)
  for (const l of lines) { if (l === '---') { await h.close(); h = await setup(m, { tag: 'b' + m }); await h.nav(3); continue }
    try { await h.p.keyboard.press('Escape'); await h.ask(l, 900); const t = await h.lastText(); const sheet = await h.p.$('.app-sheet'); console.log('>> ' + l + '\n   ' + t.slice(0, 330) + (sheet ? ' [SHEET OPEN]' : '')) } catch (e) { console.log('>> ' + l + '\n   ERR ' + e.message.slice(0, 100)) } }
  await h.close() })()
