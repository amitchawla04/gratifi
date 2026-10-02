const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
module.exports = async (h) => { const { p, nav, ask, click, log, state, full } = h
  await nav(3); await ask('flights to Lisbon on 20 October for 3 people, back on the 25th'); await T(h, 'date')
  await p.locator('.gr-answer').last().locator('.gr-flight').nth(2).click(); await p.waitForTimeout(400); await T(h, 'fares3')
  await p.locator('.gr-answer').last().getByText('Flex').first().click().catch(e=>log('noflex')); await p.waitForTimeout(300)
  await click(/Continue with/); await T(h, 'seats3')
  await p.locator('.gr-answer').last().locator('button[aria-label*="14"]').first().click().catch(e=>log('no 14 seat'));
  await p.locator('.gr-answer').last().getByRole('button', { name: '+' }).or(p.locator('.gr-answer').last().locator('button[aria-label*="Add"]')).first().click().catch(e => log('no plus')); await p.waitForTimeout(300); await full('seats3b')
  await click('Continue', true); await T(h, 'chk3')
  await click(/^Pay /); await L.confirm(h); await T(h, 'booked3'); await h.summ('b3')
  await nav(4); await click('Show pass'); await full('passes3'); log('npasses', await p.locator('.gr-pass, .gr-bpass, [class*=pass]').count())
  await nav(3); await ask('cancel my flight'); await T(h, 'cancel'); await click('Yes, cancel'); await T(h, 'cancelled'); await h.summ('c3')
}
