const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m = process.argv[2] || 'UK'; const phrases = require(require('path').resolve(process.argv[3]));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 880 } }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(`file:///tmp/claude-0/-home-claude/d2529b2f-e36e-5c22-8d08-213fa2f214ae/scratchpad/gratifi/review/test.html?m=${m}&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400)
  for (const ph of phrases) {
    if (ph === '!clear') { await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400); continue }
    await p.fill('.gr-ask input', ph); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(250)
    const r = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; const bl = msg.blocks || []; return { text: msg.text || '', kinds: bl.map(b => b.kind + (b.cat ? ':' + b.cat : '') + (b.city ? '@' + b.city : '') + (b.items ? '#' + (b.items.length) : '')) , first: bl[0] && bl[0].items ? bl[0].items.slice(0,3).map(i => i.title || i.name || i).join('; ') : '' } })
    console.log(`> ${ph}\n  [${r.kinds.join(',')}] ${r.text.slice(0, 200)} ${r.first ? '{' + r.first.slice(0,150) + '}' : ''}`)
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5).join(' | ')); await b.close()
})()
