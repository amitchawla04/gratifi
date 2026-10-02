const run = require('./h.js'); const el = run.el; const m = process.argv[2] || 'IN';
const CITY = { UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'مسقط', SG: 'Bali', MY: 'Penang' }[m];
const Q = m === 'AR' ? `رحلات إلى ${CITY} الأسبوع الجاي لشخصين` : `Flights to ${CITY} next weekend for two`;
run(`flm-${m}`, m, async h => {
  const { p, ask, last, lastText, btn, confirm, log, nav, state, shot } = h;
  await nav(3);
  await ask(Q); log('A', (await lastText()).slice(0, 600)); await el(h, `flm-${m}-1`);
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500); log('B', (await lastText()).slice(0, 700)); await el(h, `flm-${m}-2`);
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500);
  const ins = last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor');
  log('C', (await lastText()).slice(0, 500)); await el(h, `flm-${m}-3`);
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(500);
  log('D', await lastText()); await el(h, `flm-${m}-4`);
  await p.getByRole('button', { name: /^(Pay |ادفع )/ }).last().click(); await p.waitForTimeout(300); await shot('sheet');
  log('SHEET', await confirm()); log('E', await lastText()); await el(h, `flm-${m}-5`);
  const s = await state(); log('S', s.balance, s.card.balance);
  await nav(4); await shot('wallet');
}, {});
