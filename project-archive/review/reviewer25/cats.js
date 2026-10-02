const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'UK'; const th = process.argv[3] || 'light';
const Q = { UK: { city: 'Lisbon' }, IN: { city: 'Goa' }, MY: { city: 'Penang' }, AR: { city: 'Muscat' }, AE: { city: 'Muscat' }, SG: { city: 'Bali' }, EU: { city: 'Rome' } }[m];
const L = m === 'AR' ? [['stay','فندق في مسقط فيه مسبح'],['dine','طاولة الليلة لشخصين'],['shop','سماعات عازلة للضوضاء'],['jacket','جاكيت مطر'],['gift','بطاقة هدية لصديق'],['subs','اشتراك بث'],['tix','حفلات هذا الشهر'],['lounge','احجز صالة'],['ride','توصيلة الآن'],['car','استئجار سيارة'],['exp','أشياء أسوي في مسقط'],['cinema','سينما']] : [
  ['stay', `A hotel in ${Q.city} with a pool`],
  ['dine', 'A table tonight for two'],
  ['shop', 'Noise-cancelling headphones'],
  ['jacket', 'Rain shell jacket'],
  ['gift', 'A gift card for a friend'],
  ['subs', 'Start a streaming subscription'],
  ['tix', 'Concerts this month'],
  ['lounge', 'Book a lounge'],
  ['ride', 'A ride now'],
  ['car', 'Hire a car'],
  ['train', 'Book a train'],
  ['exp', `Things to do in ${Q.city}`],
];
run(`cats-${m}-${th}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state } = h;
  await nav(3);
  for (const [tag, q] of L) {
    try {
      await ask(q); log(tag, 'LIST', (await lastText()).slice(0, 300)); await el(h, `c-${m}-${th}-${tag}-1list`);
      await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(450);
      const b = last().locator('.gr-detail .gr-btn').last();
      let bt = await b.innerText(); log(tag, 'DETAILBTN', bt);
      if (/size|المقاس/i.test(bt)) { await last().locator('.gr-chip').nth(1).click(); await p.waitForTimeout(200) }
      if (tag === 'gift') { const i = last().locator('.app-in'); await i.nth(0).fill('Sam'); await i.nth(1).fill('sam@example.com') }
      await el(h, `c-${m}-${th}-${tag}-2detail`); log(tag, 'DETAIL', (await lastText()).slice(0, 500));
      await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(450);
      log(tag, 'CHECKOUT', (await lastText()).slice(0, 500)); await el(h, `c-${m}-${th}-${tag}-3checkout`);
      const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last();
      if (await pay.count()) { await pay.scrollIntoViewIfNeeded(); await pay.click(); log(tag, 'SHEET', await confirm()) }
      else { const f = last().locator('.gr-card .gr-btn').last(); log(tag, 'FREEBTN', await f.innerText()); await f.click(); await p.waitForTimeout(450) }
      log(tag, 'DONE', (await lastText()).slice(0, 500)); await el(h, `c-${m}-${th}-${tag}-4done`);
    } catch (e) { log(tag, 'ERR', e.message.split('\n')[0]) }
  }
  const s = await state(); log('FINAL', s.balance, s.card.balance, s.bookings.map(b => b.title + ':' + b.total + ':' + b.pts + '+' + b.card).join(' ; '));
}, { theme: th });
