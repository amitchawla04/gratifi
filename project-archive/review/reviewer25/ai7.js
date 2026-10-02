const run = require('./h.js'); const m = process.argv[2] || 'AR';
run(`ai7-${m}`, m, async h => {
  const { p, lastText, log, nav, state } = h;
  await nav(3);
  const T = async (txt, tools = '') => { await p.evaluate(([txt, tools]) => { window.__plan = eval(`async (t,o,run)=>{ ${tools}; return ${JSON.stringify(txt)} }`) }, [txt, tools]); await h.ask('طلب', 1000); if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } log(JSON.stringify(txt).slice(0, 60), '=>', (await lastText()).slice(0, 200)) };
  await T('هذه الخيارات، وحجزت لك الطاولة الساعة 8.');
  await T('وتم الدفع من نقاطك.');
  await T('الفندق جاهز وقد دفعت المبلغ.');
  await T('حجزتها لك.');
  await T('فحجزت لك الرحلة.');
  await T('The flights are here, and I booked the 07:25 for you.');
  await T('I went ahead and reserved it.');
  await T('Your seat 14A is confirmed now');
  await T('I have frozen your card.');
  await T('Payment taken: £229.');
  await T('Your order will arrive in 15 minutes.');
  const s = await state(); log('frozen', s.card.frozen);
}, { ai: true });
