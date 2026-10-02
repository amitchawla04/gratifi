module.exports = async (h) => { const { p, say, click, confirm, state, nav, full, sheet } = h
  const S = async (tag) => { const s = await state(); if (!s || !s.card) return console.log('nostate', tag); console.log(`STATE[${tag}] cardBal=${s.card.balance} due=${s.card.due} frozen=${s.card.frozen} pts=${s.balance} | ` + (s.bookings || []).map(b => `${b.title}:${b.status}`).join('; ')) }
  const demo = async (name) => { await nav(5); await click(name); await p.waitForTimeout(600); const t = await p.evaluate(() => document.querySelector('.app-toast, [role=status], .gr-toast')?.innerText || ''); console.log(`\nDEMO ${name} -> toast: ${t.replace(/\n/g, ' | ')}`); await h.shot('demo-' + name.replace(/\W+/g, '')) }
  await demo('Points come in (+5,000)'); await S('pts')
  await demo('A card payment'); await S('cardpay')
  await demo('Cancel my next flight'); await demo('Delay my order'); await demo('Deliver my order'); await demo('Return window ends'); await S('nobookings')
  await demo('Suspicious payment'); await S('susp'); await nav(3); console.log('CHAT AFTER SUSP:', (await h.last()).slice(0, 500)); await full('susp-chat')
  await say('that was me'); await say('unfreeze my card'); const s = await sheet(); console.log('SHEET', s); if (s) await confirm(); console.log('->', (await h.last()).slice(0, 300)); await S('unfrozen')
  // card declined toggle then buy
  await nav(5); await p.getByText('Card is declined').locator('xpath=ancestor::*[.//*[@role="switch"]][1]').locator('[role=switch]').first().click(); await nav(3)
  await say('Leather trainers'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await p.locator('.gr-answer').last().locator('.gr-chip').filter({ hasText: /^9$/ }).first().click(); await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().getByText('Card', { exact: true }).click(); await click(/^Pay /); await confirm(); console.log('DECLINED:', (await h.last()).slice(0, 500)); await full('declined'); await S('declined')
  await say('why was my payment declined?')
  await nav(5); await click('Reset demo'); await p.waitForTimeout(800); await S('reset'); await h.shot('after-reset')
}
