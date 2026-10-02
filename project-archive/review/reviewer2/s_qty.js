const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 700)) }
module.exports = async (h) => { const { p, nav, ask, click, log } = h
  await nav(3); await ask('hotel in Barcelona for 3 nights from 16 Oct'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await T(h, 'hd')
  const plus = p.locator('.gr-answer').last().getByRole('button', { name: /increase|more|\+|Add/i })
  log('plus buttons', await plus.count(), await p.locator('.gr-answer').last().locator('button[aria-label]').evaluateAll(e => e.map(x => x.getAttribute('aria-label'))))
  await p.locator('.gr-answer').last().locator('button[aria-label]').nth(1).click(); await p.waitForTimeout(200); await p.locator('.gr-answer').last().getByText('Suite (+40%)').click(); await p.waitForTimeout(200); await T(h, 'hd2')
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await T(h, 'hchk')
  await click(/^Pay /); await p.waitForTimeout(300); log('SHEET', (await p.locator('.app-sheet').innerText()).replace(/\n/g, ' | ')); await p.locator('.app-sheet [aria-label=Close], .app-sheet button').first().click(); await p.waitForTimeout(400); log('sheet closed?', !(await p.$('.app-sheet')))
  await ask('Things to do in Barcelona'); await p.locator('.gr-answer').last().locator('.gr-itemrow').nth(1).click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('button[aria-label]').evaluateAll(e => e.map(x => x.getAttribute('aria-label'))).then(x => log('exp btns', x))
  await p.locator('.gr-answer').last().locator('button[aria-label*="ncrease"], button[aria-label*="Add"], button[aria-label*="More"]').first().click().catch(e => log('noinc')); await p.waitForTimeout(200); await T(h, 'exp2'); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await T(h, 'expchk')
  await ask('Groceries now'); await T(h, 'gro')
  await ask('a table for 2 at Kanji on Saturday at 8pm'); await T(h, 'kanji')
}
