const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 900 } }); const p = await ctx.newPage();
  await ctx.addInitScript(() => { window.claude = { use: async (n) => n !== 'sample' ? null : Object.assign(async function (turns, o) { const plan = (window.__plan || []).shift() || []; const T = n => o.tools.find(t => t.name === n); const res = []; for (const [name, args] of plan) res.push([name, await T(name).execute(args, {})]); window.__res = res; return { text: 'OK.' } }, { limits: async () => ({ tools: { maxCount: 16 } }) }) } });
  await p.goto(`file://${__dirname}/build/test.html?m=UK&tab=chat`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(700);
  const turn = async (text, plan) => { await p.evaluate(pl => { window.__plan = [pl] }, plan); await p.fill('.gr-ask input', text); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(900); const r = await p.evaluate(() => window.__res); console.log('>', text, JSON.stringify(r).slice(0, 600)); console.log('   VIS:', (await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')]; return a[a.length - 1].innerText })).replace(/\n/g, ' | ').slice(0, 600)) };
  await turn('hotel in Lisbon for 4 adults 2 rooms 2 nights from 20 Oct', [['search_catalogue', { category: 'stays', city: 'Lisbon', date: '2026-10-20', nights: 2, guests: 4 }]]);
  const id = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); return s.chat[s.chat.length - 1].blocks.find(b => b.kind === 'items').ids[0] });
  await turn('book the first', [['prepare_checkout', { id, quantity: 4, nights: 2, date: '2026-10-20' }]]);
  await turn('table for 20 tonight', [['search_catalogue', { category: 'dining', guests: 20, time: '20:00' }]]);
  const did = await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-UK')); return s.chat[s.chat.length - 1].blocks.find(b => b.kind === 'items')?.ids?.[0] });
  if (did) await turn('book it', [['prepare_checkout', { id: did, quantity: 20, option: '20:00' }]]);
  await turn('flights 0 travellers', [['search_flights', { destination: 'Lisbon', depart_date: '2026-09-01', travellers: 40 }]]);
  await b.close();
})();
