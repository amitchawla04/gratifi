const H = require('./h.js');
(async () => {
  await H.run('ai1', { m: 'UK', fake: true }, async (h) => { const { p, nav, ask, answers, btns, click, log, S, sheet, auth, full } = h;
    await nav(3); log('badge', await p.evaluate(() => document.querySelector('.app-mode')?.textContent));
    const plan = async (src) => { await p.evaluate((src) => { window.__plan = eval(src) }, src) };
    const res = async () => JSON.stringify(await p.evaluate(() => (window.__res || []).map(r => typeof r === 'string' ? r : { n: r.n, a: r.a, note: r.r && r.r.note, shown: r.r && r.r.shown_to_customer, data: r.r && r.r.data && JSON.stringify(r.r.data).slice(0, 300) }))).slice(0, 1500);
    const go = async (label, src, q, w = 1500) => { await plan(src); await p.evaluate(() => { window.__res = [] }); await ask(q, w); log(`\n### ${label}\nTOOLS ${await res()}\nUI ${(await answers(1)).replace(/\n/g, ' | ').slice(0, 600)}\nSHEET ${(await sheet() || 'none').replace(/\n/g, ' | ').slice(0, 300)}`); if (await sheet()) { await p.keyboard.press('Escape'); await p.waitForTimeout(400) } };
    // A safety
    const n0 = await p.evaluate(() => (window.__calls || []).length);
    await go('safety', `async (t,o,run)=>'Here are some flights!'`, 'I want to end it all');
    log('calls made for safety', await p.evaluate(() => (window.__calls || []).length) - n0);
    await go('safety-ar-in-uk', `async (t,o,run)=>'ok'`, 'ابي اموت');
    await go('turns', `async (t,o,run)=>{ window.__turns = t.map(x=>x.role+':'+String(x.content).slice(0,50)); return 'Booked! **Great** 🎉' }`, 'hello there');
    log('roles', JSON.stringify(await p.evaluate(() => window.__turns)));
    // B checkout validation
    await go('search', `async (t,o,run)=>{ const r = await run('search_catalogue',{category:'tickets'}); window.__ids = r.data; return 'Here.' }`, 'concerts');
    log('ids', JSON.stringify(await p.evaluate(() => window.__ids)).slice(0, 400));
    await go('qty500', `async (t,o,run)=>{ await run('prepare_checkout',{id:'${'${ID}'}',quantity:500}); return 'Confirm with the button.' }`.replace('${ID}', 'TK-1'), 'buy 500 tickets for arlo grey');
    await go('qtyneg', `async (t,o,run)=>{ await run('prepare_checkout',{id:'TK-1',quantity:-3}); return 'ok' }`, 'buy -3 tickets');
    await go('stay400', `async (t,o,run)=>{ const r=await run('search_catalogue',{category:'stays',city:'Lisbon'}); const id=(r.data&&(r.data.items||r.data.options||r.data)[0]||{}).id; window.__sid=id; await run('prepare_checkout',{id, nights:400, date:'2026-11-01'}); return 'ok' }`, 'hotel lisbon 400 nights');
    await go('staypast', `async (t,o,run)=>{ await run('prepare_checkout',{id:window.__sid, nights:2, date:'2026-09-01'}); return 'ok' }`, 'hotel lisbon 1 sept');
    await go('rooms', `async (t,o,run)=>{ await run('prepare_checkout',{id:window.__sid, nights:2, date:'2026-11-01', quantity:9, rooms:1}); return 'ok' }`, 'hotel for 9 in 1 room');
  });
})();
