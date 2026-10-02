const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 600)) }
module.exports = async (h) => { const { p, nav, ask, click, log, full } = h
  await nav(3); await ask('Put points into gold'); await p.locator('.gr-answer').last().locator('input[type=checkbox]').last().check(); await click('Continue with the partner'); await L.confirm(h); await h.summ('gold')
  await nav(4); await p.getByText('Requests', { exact: true }).click(); await p.waitForTimeout(300); log('W', (await p.locator('.app-main').innerText()).replace(/\n/g,' | ')); await p.locator('.app-main').getByRole('button', { name: 'Sell' }).click({ timeout: 4000 }); await p.waitForTimeout(500); log('sheet?', !!(await p.$('.app-sheet'))); await T(h, 'sell'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  const y = p.locator('.gr-answer').last().locator('.gr-btn').first(); if (await y.count()) { await y.click(); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h) } await T(h, 'sold'); await h.summ('sold')
  await nav(5); await p.locator('.app-demo [role=switch]').nth(2).click(); await nav(3)
  await ask('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(300); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(300); await p.getByText('Card', { exact: true }).last().click(); await click(/^Pay /); await L.confirm(h)
  await click('Pay with points instead'); await p.waitForTimeout(400); log('sheet after pay-with-points?', !!(await p.$('.app-sheet'))); await T(h, 'ppi'); if (await p.$('.app-sheet')) await L.confirm(h); else { const pb = p.getByRole('button', { name: /^Pay / }).last(); if (await pb.count()) { log('pay btn', await pb.innerText()); await pb.click(); await L.confirm(h) } } await T(h, 'ppi-done'); await h.summ('ppi')
}
