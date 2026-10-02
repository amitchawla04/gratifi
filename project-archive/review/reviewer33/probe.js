// node probe.js MARKET phrasesfile [ai] -> prints phrase => reply | kinds
const { open } = require('./h.js'); const fs = require('fs');
(async () => { const m = process.argv[2], lines = fs.readFileSync(process.argv[3], 'utf8').split('\n').filter(x => x.trim() && !x.startsWith('#'));
 const h = await open(m, { ai: process.argv[4] === 'ai', tag: 'pr-' + m }); await h.nav(3);
 for (const l of lines) { const shot = l.startsWith('!'); const q = l.replace(/^!/, '');
   if (q === 'RESET') { await h.p.evaluate(() => localStorage.clear()); await h.p.reload(); await h.p.waitForTimeout(600); await h.nav(3); continue }
   await h.ask(q, 900);
   const s = await h.st(); const msg = s.chat[s.chat.length - 1];
   const kinds = (msg.blocks || []).map(b => b.kind + (b.kind === 'items' ? ':' + b.cat + '[' + (b.ids || []).slice(0, 3).join(',') + ']' : b.kind === 'handoff' ? ':' + (b.team || '') : b.kind === 'suggest' ? ':' + (b.items || []).join('/') : '')).join(' ');
   const dom = (await h.last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
   console.log('>> ' + q + '\n   TEXT: ' + (msg.text || '') + '\n   BLOCKS: ' + kinds + '\n   DOM: ' + dom);
   if (shot) await h.full(q.slice(0, 20).replace(/\W+/g, '_'));
   if (await h.p.$('.app-sheet')) { console.log('   SHEET OPEN: ' + (await h.sheetText()).slice(0, 300)); await h.p.keyboard.press('Escape'); await h.p.waitForTimeout(300) }
 }
 await h.close() })();
