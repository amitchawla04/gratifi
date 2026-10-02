// node probe.js MARKET file.txt [fresh]  -- each line a query; prints reply text + block kinds
const { open } = require('./h.js'); const fs = require('fs');
const [M, file, mode] = process.argv.slice(2);
const qs = fs.readFileSync(file, 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
(async () => {
  let h = await open(M, { tag: 'pr' }); await h.nav(3);
  for (const q of qs) {
    if (mode === 'fresh') { const c = h.p.getByRole('button', { name: /^(Clear|مسح)$/ }); if (await c.count()) { await c.first().click(); await h.p.waitForTimeout(300); const y = h.p.getByRole('button', { name: /^(Clear|Yes, clear|مسح|نعم)/ }); if (await h.p.$('.app-sheet')) { await h.p.locator('.app-sheet .gr-btn').last().click(); await h.p.waitForTimeout(300) } } }
    try { await h.ask(q, 900) } catch (e) { console.log('ASKFAIL', q, e.message.split('\n')[0]); continue }
    const s = await h.st(); const m = s.chat[s.chat.length - 1];
    const bl = (m.blocks || []).map(b => b.kind + (b.team ? ':' + b.team : '') + (b.cat ? ':' + b.cat : '')).join(' ');
    const dom = (await h.lastText()).slice(0, 260);
    const sheet = await h.p.$('.app-sheet') ? ' [SHEET OPEN]' : '';
    console.log('Q: ' + q + '\n  A: ' + (m.text || '').replace(/\s+/g, ' ').slice(0, 330) + '\n  B: ' + bl + sheet + '\n  D: ' + dom.replace(/\s+/g,' ') + '\n');
    if (sheet) { await h.p.keyboard.press('Escape'); await h.p.waitForTimeout(300) }
  }
  await h.close();
})();
