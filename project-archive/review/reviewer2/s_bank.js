const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 600)) }
module.exports = async (h) => { const { p, nav, ask, click, log, full } = h
  const S = async (f) => { try { await f() } catch (e) { log('!! step failed', e.message.split('\n')[0]) } }
  await nav(3)
  await S(async () => { await ask('What do I owe?'); await p.locator('.gr-answer').last().getByText('Minimum', { exact: true }).click(); await p.waitForTimeout(200); await T(h, 'min'); await click(/^Pay /); await L.confirm(h); await T(h, 'paidmin'); await h.summ('min') })
  await S(async () => { await ask('Freeze my card'); await p.locator('.gr-answer').last().locator('[role=switch]').first().click(); await p.waitForTimeout(400); log('sheet?', !!(await p.$('.app-sheet'))); await T(h, 'frozen'); log('frozen', (await h.state()).card.frozen) })
  await S(async () => { await ask('is my card frozen?'); await T(h, 'isfrozen') })
  await S(async () => { await ask('unfreeze my card'); await T(h, 'unf'); log('sheet?', !!(await p.$('.app-sheet'))); await h.shot('unf-sheet'); if (await p.$('.app-sheet')) await L.confirm(h); log('frozen', (await h.state()).card.frozen) })
  await S(async () => { await ask('I lost my card'); await T(h, 'lost'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts()); await click('Send a replacement'); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'repl'); log('frozen', (await h.state()).card.frozen) })
  await S(async () => { await ask('I found my card'); await T(h, 'found') })
  await S(async () => { await ask('Someone took money I don\'t recognise'); await T(h, 'fraud') })
  await S(async () => { await nav(5); await click('Suspicious payment'); await click("It wasn't me"); await T(h, 'notme') })
  await S(async () => { await ask('Where did my money go?'); await T(h, 'spend'); await full('spend') })
  await S(async () => { await nav(5); await click('Statement'); await p.waitForTimeout(400); await T(h, 'statement-btn') })
  await S(async () => { await nav(5); await click('Benefits'); await p.waitForTimeout(400); await T(h, 'benefits-btn') })
  await S(async () => { await nav(5); await click('Forget'); await p.waitForTimeout(300); log('prefs', JSON.stringify((await h.state()).prefs)); await click('Use Office'); log('addr', (await h.state()).addr) })
  await S(async () => { await nav(5); await p.locator('[role=switch][aria-label="Every card payment"]').click(); await click('A card payment'); await p.waitForTimeout(500); await T(h, 'cardpay-note'); await full('cardpay') })
}
