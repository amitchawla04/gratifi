const H = require('./h.js');
(async () => {
  const h = await H.open('AR', { q: '&tab=chat', tag: 'AR-vis' }); const { p } = h;
  for (const ph of require('./c2.json').slice(0, 13)) { await h.ask(ph, 400); const t = await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText : '' }); const lat = (t.match(/[A-Za-z][A-Za-z' ]{3,}/g) || []).filter(x => !/Gratifi|Coastline|Northway|Aurora|Hush|Byte|Cedar|Tunewave|Arlo|Grey|Sam|Taylor|Amit|Chawla|example|com|sara|Hotel|Air|Store|Lantern|House|Al Bahar|Harbour|Kanji|Salt|Ember|Green|Table|Maya|Leila|Priya/.test(x)); console.log('>', ph, '\n  ', t.replace(/\n/g, ' | ').slice(0, 260), '\n   LATIN:', lat.join(' ; ').slice(0, 200)); if (/طفل|لندن|قصيدة|تاكسي|فاتورتي|رسالة/.test(ph)) await h.shot(ph.slice(0, 6)) }
  console.log('missing', await p.evaluate(() => [...(window.__missing || [])]));
  console.log('ERR', await h.done());
})();
