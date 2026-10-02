const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const m = process.argv[2] || 'UK';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 420, height: 900 } }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await ctx.addInitScript(() => {
    window.__calls = [];
    window.claude = { use: async (n) => n !== 'sample' ? null : Object.assign(async function (turns, o) {
      window.__calls.push({ turns: turns.map(t => ({ role: t.role, c: String(t.content).slice(0, 300) })), tools: o.tools.map(t => t.name) });
      const plan = (window.__plan || []).shift() || [];
      const T = n => o.tools.find(t => t.name === n); const res = [];
      for (const [name, args] of plan) { try { res.push([name, await T(name).execute(args, {})]) } catch (e) { res.push([name, 'ERR ' + e.message]) } }
      window.__res = res;
      return { text: window.__say || 'OK.', truncated: false }
    }, { limits: async () => ({ maxInputBytes: 65536, tools: { maxCount: 16 } }) }) };
  });
  const url = `file://${__dirname}/build/test.html?m=${m}&tab=chat`;
  await p.goto(url); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(700);
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))));
  const turn = async (text, plan, say) => { await p.evaluate(([pl, s]) => { window.__plan = [pl]; window.__say = s }, [plan, say]); await p.fill('.gr-ask input', text); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(900); const r = await p.evaluate(() => window.__res); const s = await st(); const msg = s.chat[s.chat.length - 1]; const sheet = await p.evaluate(() => document.querySelector('.app-sheet')?.innerText || ''); console.log('>', text, '\n  res:', JSON.stringify(r).slice(0, 700), '\n  msg:', (msg.text || '').slice(0, 200), '[' + (msg.blocks || []).map(b => b.kind).join(',') + ']', '\n  bal:', s.balance, s.card.balance, 'frozen', s.card.frozen, '\n  sheet:', sheet.replace(/\n/g, ' | ').slice(0, 300)); return { r, s, sheet } };
  console.log('mode', await p.textContent('.app-mode').catch(() => '?'));
  await turn('show me gift cards', [['search_catalogue', { category: 'giftcards' }]]);
  const s0 = await st(); const ids = s0.chat[s0.chat.length - 1].blocks.find(x => x.kind === 'items')?.ids || []; console.log('ids', ids);
  await turn('buy the first one for £50 for Sam sam@x.com', [['prepare_checkout', { id: ids[0], option: '50', recipient: 'Sam', email: 'sam@x.com' }]]);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); const cl = await p.$('.app-sheet [aria-label=Close], .app-sheet .gr-ibtn'); if (cl) await cl.click(); await p.waitForTimeout(300);
  await turn('send 5000 points to Northway miles', [['points_and_giving', { topic: 'transfer', points: 5000, to: 'Northway' }]]);
  if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
  await turn('freeze', [['card_control', { control: 'freeze', on: true }]]);
  await turn('unfreeze', [['card_control', { control: 'freeze', on: false }]]);
  if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
  await turn('I feel really low', [['talk_to_person', { reason: 'customer feels low', at_risk: true }]], 'I am sorry you feel this way.');
  await turn('invest 20000 points in gold', [['points_and_giving', { topic: 'invest', points: 20000, to: 'gold' }]]);
  if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
  await turn('book flights', [['search_flights', { destination: 'Lisbon', depart_date: '2026-10-14', return_date: '2026-10-18', travellers: 2, children: 1, infants: 1 }]]);
  await turn('bad tool', [['show_item', { id: 'NOPE' }], ['manage_booking', { booking_id: 'X', action: 'cancel' }], ['search_flights', { destination: 'Atlantis' }]]);
  await turn('pay my bill', [['card_and_account', { topic: 'pay bill in full' }]]);
  await turn('scam text', [], 'ok');
  const last = await p.evaluate(() => window.__calls[window.__calls.length - 1]); console.log('LAST CALL turns', JSON.stringify(last.turns).slice(0, 1500));
  console.log('errs', errs);
  await b.close();
})();
