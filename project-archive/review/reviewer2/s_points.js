const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 600)) }
module.exports = async (h) => { const { p, nav, ask, click, log, full } = h
  await nav(3); await ask('Transfer points to miles'); await p.locator('.gr-answer').last().locator('input[type=checkbox]').first().check(); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await L.confirm(h); await T(h, 'transferred'); await h.summ('tr')
  await ask('Put points into gold'); await p.locator('.gr-answer').last().locator('input[type=checkbox]').last().check(); await click('Continue with the partner'); await L.confirm(h); await T(h, 'gold'); await h.summ('gold')
  await ask('Donate points to charity'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(300); await T(h, 'don-pick'); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'donated'); await h.summ('donate')
  await nav(4); for (const tab of ['Requests', 'Past']) { await p.getByRole('button', { name: tab, exact: true }).click().catch(()=>p.getByRole('tab', { name: tab }).click()); await p.waitForTimeout(300); log('TAB', tab, (await p.locator('.app-main').innerText()).replace(/\n/g, ' | ').slice(0, 800)) }
  await nav(3); await ask('Get me a table at a sold-out restaurant'); await T(h, 'conc'); await p.fill('.app-ta', 'Saturday, 2 people, around 8pm').catch(()=>log('no ta')); await click('Send to the concierge'); await T(h, 'conc-sent')
  await ask('I want to complain'); await T(h, 'handoff'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts()); await p.locator('.gr-answer').last().locator('button').first().click().catch(()=>{}); await p.waitForTimeout(500); await T(h, 'handoff2')
  await ask('Money back on a purchase'); await T(h, 'moneyback')
  await ask('Show me card offers'); await T(h, 'offers'); await p.locator('.gr-answer').last().getByRole('button', { name: 'Add' }).first().click(); await p.waitForTimeout(300); await T(h, 'offer-added')
  await ask('Ways to earn more'); await T(h, 'earn'); await p.locator('.gr-answer').last().getByRole('button', { name: 'Join' }).first().click().catch(()=>log('nojoin')); await p.waitForTimeout(300); await T(h, 'joined')
  await ask('Split my laptop into instalments'); await T(h, 'inst'); await ask('increase my credit limit'); await T(h, 'limit'); await ask('download my statement'); await T(h, 'stmt'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
}
