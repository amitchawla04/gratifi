const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 700)) }
module.exports = async (h) => { const { p, nav, ask, click, log, state, full, shot } = h
  await nav(3); await ask('hello'); await p.evaluate(() => { const k = 'gratifi-state-v3-UK'; const s = JSON.parse(localStorage.getItem(k)); s.balance = 121; s.chat = []; localStorage.setItem(k, JSON.stringify(s)) }); await p.reload(); await p.waitForTimeout(600); await nav(3); log('bal', (await state()).balance)
  await ask('Transfer points to miles'); await T(h, 'tr'); await p.locator('.gr-answer').last().locator('input[type=checkbox]').first().check().catch(e=>log('nocheck')); await p.waitForTimeout(200)
  log('btn disabled?', await p.locator('.gr-answer').last().locator('.gr-btn').first().isDisabled())
  await p.locator('.gr-answer').last().locator('.gr-btn').first().click({ timeout: 3000 }).catch(e=>log('click failed')); await p.waitForTimeout(400); log('sheet?', !!(await p.$('.app-sheet'))); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'tr2'); log('bal after', (await state()).balance)
  await ask('Donate points to charity'); await T(h, 'don'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click({ timeout: 3000 }).catch(e=>log('click failed')); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'don2'); log('bal after', (await state()).balance)
  await ask('Put points into gold'); await T(h, 'gold'); await full('gold')
  await L.buy(h, 'Leather trainers', 'low')
  await ask('Use my expiring points on a gift card'); await T(h, 'exp')
}
