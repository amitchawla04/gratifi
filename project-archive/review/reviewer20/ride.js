const L = require('./lib.js');
(async () => {
  const h = await L('UK', {}); const { p, ask, last, text } = h;
  for (const q of ['a ride to Heathrow', 'a ride to Heathrow Airport', 'a ride to the airport', 'taxi to LHR', 'a ride to Gatwick', 'a ride to 1 Harbour Square', 'a ride to the office', 'a ride home', 'a ride to Paddington station']) {
    await ask(q); const t = await text(); const m = t.match(/£[\d.,]+(?=\s*or)/g); console.log(q, '->', t.slice(0, 90), '| prices', m && m.slice(-2));
    const c = last().locator('.gr-detail .gr-btn').last(); if (await c.count() && !(await c.isDisabled())) { await c.click(); await p.waitForTimeout(500); const t2 = await text(); console.log('   checkout:', (t2.match(/To .{0,30}|Total £[\d.,]+/g) || []).join(' | ')) } else console.log('   (continue disabled)')
  }
  await h.b.close();
})();
