const L = require('./lib.js');
(async () => {
  const h = await L('UK', { tag: 'sc1' }); const { p, st, ask, last, btn, confirm, text, shot, nav, sheetText } = h;
  const log = async (tag) => { const s = await st(); console.log(tag, 'pts', s.balance, 'card', s.card.balance, 'bookings', s.bookings.map(b => `${b.title}:${b.status}:${b.total}`).join(';')) };
  // A credit limit
  await ask('13-inch laptop'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(500);
  const plus = last().locator('.gr-stepper button').last(); for (let i = 0; i < 7; i++) { await plus.click(); await p.waitForTimeout(80) }
  await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(600);
  console.log('CHECKOUT:', (await text()).slice(-400));
  console.log('ROLES', await p.evaluate(() => [...document.querySelectorAll('.gr-answer:last-of-type [role]')].map(e => e.getAttribute('role')+':'+e.innerText.replace(/\s+/g,' ').slice(0,30)).slice(0,12)));
  await btn(/^Pay /); console.log('SHEET:', await sheetText()); console.log('AFTER PAY:', (await text()).slice(-300)); await shot('laptop8-pay');
  await log('A');
  // max points slider: points and card
  await h.esc();
  // B supplier down
  await nav(5); await p.getByText('Supplier is down').locator('..').locator('..').locator('button,[role=switch],input').first().click().catch(e => console.log('toggle fail', e.message.slice(0, 80)));
  await p.waitForTimeout(300); await nav(3);
  await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  await btn(/^Pay /); console.log('SHEET:', await sheetText()); const c = await confirm(); console.log('confirm', c); console.log('SUPPLIER DOWN:', (await text()).slice(-300)); await shot('supplier');
  await log('B');
  await nav(5); await p.getByText('Supplier is down').locator('..').locator('..').locator('button,[role=switch],input').first().click(); await nav(3);
  // C pay then click old pay again
  await ask('Noise-cancelling headphones'); await last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(500);
  const payBtn = p.getByRole('button', { name: /^Pay / }).last(); await payBtn.click(); await p.waitForTimeout(300); console.log('confirm', await confirm()); await log('C1');
  const oldPays = await p.getByRole('button', { name: /^Pay / }).count(); console.log('pay buttons still present:', oldPays);
  for (let i = 0; i < oldPays; i++) { const b = p.getByRole('button', { name: /^Pay / }).nth(i); console.log('  pay', i, await b.isDisabled(), await b.innerText()) }
  // reload and try clicking any Pay / Continue
  await p.reload(); await p.waitForTimeout(800);
  const cnt = await p.getByRole('button', { name: /^Pay |Continue|Buy|Book|Subscribe/ }).count(); console.log('after reload actionable', cnt);
  for (let i = 0; i < cnt; i++) { const b = p.getByRole('button', { name: /^Pay |Continue|Buy|Book|Subscribe/ }).nth(i); console.log('  ', await b.innerText(), 'disabled=', await b.isDisabled()) }
  await log('C2');
  console.log('ERRS', h.errs); await h.b.close();
})();
