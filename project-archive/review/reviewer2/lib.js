exports.confirm = async (h, code) => { const { p, shot, log } = h; await p.waitForTimeout(350); const s = await p.$('.app-sheet'); if (!s) { log('!! NO SHEET'); return false } log('SHEET:', (await p.locator('.app-sheet').innerText()).replace(/\n/g, ' | ')); await shot('sheet'); const ins = await p.$$('.app-sheet input'); if (ins.length) { const c = code || '482193'; if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(c[i]) } else await ins[0].fill(c) } await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('!! SHEET STILL OPEN')); await p.waitForTimeout(600); return true }
exports.buy = async (h, q, tag, o = {}) => {
  const { p, ask, full, log, lastText, summ } = h
  await ask(q); await full(tag + '-list'); log(`== ${tag} LIST:`, (await lastText()).replace(/\n/g, ' | ').slice(0, 900))
  const rows = p.locator('.gr-answer').last().locator('.gr-itemrow'); const nr = await rows.count(); if (!nr) { log('!! no rows'); return }
  await rows.nth(o.nth || 0).click(); await p.waitForTimeout(500)
  if (o.pre) await o.pre()
  await full(tag + '-detail'); log(`== ${tag} DETAIL:`, (await lastText()).replace(/\n/g, ' | ').slice(0, 900))
  const cta = p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last(); log('CTA:', await cta.innerText().catch(() => 'none')); await cta.scrollIntoViewIfNeeded(); await cta.click(); await p.waitForTimeout(500)
  await full(tag + '-checkout'); log(`== ${tag} CHECKOUT:`, (await lastText()).replace(/\n/g, ' | ').slice(0, 900))
  if (o.method) { await p.getByRole('radio', { name: o.method }).last().click().catch(() => p.getByText(o.method).last().click()); await p.waitForTimeout(300) }
  const pay = p.getByRole('button', { name: /^(Pay |ادفع |Book|Confirm|Send|Reserve)/ }).last()
  if (await pay.count()) { log('PAYBTN:', await pay.innerText()); await pay.scrollIntoViewIfNeeded(); await pay.click(); await exports.confirm(h, o.code) }
  else log('!! no pay button')
  await full(tag + '-done'); log(`== ${tag} DONE:`, (await lastText()).replace(/\n/g, ' | ').slice(0, 900))
  await summ(tag)
}
