exports.buy = async (h, q, { nth = 0, pre, tag = 'b', method } = {}) => {
  const { p, ask, answers, btns, click, sheet, auth, S, log, full } = h;
  const s0 = await S().catch(() => null);
  await ask(q, 1100); const list = await answers(1);
  const row = p.locator('.gr-answer').last().locator('.gr-itemrow').nth(nth);
  const rowTxt = await row.innerText().catch(() => 'NOROW'); log(`\n##### ${q}\nLIST: ${list.split('\n').slice(0, 4).join(' | ')}\nROW: ${rowTxt.replace(/\n/g, ' | ')}`);
  if (rowTxt === 'NOROW') return;
  await row.click(); await p.waitForTimeout(800);
  if (pre) await pre();
  const det = await answers(1); log('DETAIL tail: ' + det.split('\n').slice(-8).join(' | '));
  await full(tag + '-detail', 1800);
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn, .gr-btn').last(); const ctaT = await cta.innerText(); log('CTA', ctaT, await cta.isDisabled());
  if (await cta.isDisabled()) return;
  await cta.click(); await p.waitForTimeout(900);
  const chk = await answers(1); log('CHECKOUT: ' + chk.split('\n').join(' | ').slice(0, 1000));
  if (method) await click(method, { w: 400 });
  const pay = (await btns()).find(b => /^Pay/.test(b)); log('PAYBTN', pay);
  if (pay) { await click(pay, { exact: true, w: 700 }); const sh = await sheet(); log('SHEET: ' + (sh || 'none').replace(/\n/g, ' | ')); if (sh) await auth(); await p.waitForTimeout(1200); }
  else { const b = (await btns()); log('BTNS', b.slice(-5)); }
  const rc = await answers(1); log('RECEIPT: ' + rc.split('\n').join(' | ').slice(0, 900)); await full(tag + '-done', 1800);
  const s1 = await S(); if (s0) log('DELTA pts', s1.balance - s0.balance, 'card', +(s1.card.balance - s0.card.balance).toFixed(2), 'bookings', s1.bookings.length);
  else log('NOW pts', s1.balance, 'card', s1.card.balance);
};
