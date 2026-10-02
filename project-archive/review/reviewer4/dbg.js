const H = require('./h.js'), X = require('./lib.js');
(async () => {
  const h = await H.start('UK'); const { p } = h; const L = X.L(h);
  await h.nav(3); await X.bookFlight(h); await X.payLast(h);
  await h.ask('change my flight'); await p.waitForTimeout(1000);
  const s = await h.st(); console.log(s.chat.slice(-3).map(m => m.role + ':' + (m.text || '') + ' [' + (m.blocks || []).map(b => b.kind) + ']').join('\n'));
  console.log('input value:', await p.inputValue('.gr-ask input'));
  await h.shot('dbg');
  await h.b.close();
})();
