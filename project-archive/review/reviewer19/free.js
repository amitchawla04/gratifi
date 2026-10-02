const M = process.argv[2] || 'UK'; const file = process.argv[3]
const L = require('fs').readFileSync(file, 'utf8').split('\n').filter(Boolean)
require('./h.js')(M, async (h) => {
  const { p, ask, nav, st } = h
  await nav(3)
  for (const t of L) {
    if (t.startsWith('#RESET')) { await p.evaluate(() => localStorage.clear()); await p.goto(h.url('&tab=chat')); await p.waitForTimeout(400); continue }
    if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(150) }
    await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(350)
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind + (b.cat ? ':' + b.cat : '')) } })
    const sh = await p.$('.app-sheet') ? ' [SHEET]' : ''
    console.log(`> ${t}\n   [${r.kinds.join(',')}]${sh} ${r.text.replace(/\n/g, ' ').slice(0, 260)}`)
  }
}, { name: 'free', q: '&tab=chat' })
