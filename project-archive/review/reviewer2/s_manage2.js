const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
module.exports = async (h) => { const { p, nav, ask, click, full, last, summ, lastText, log } = h
  await nav(3); await ask('Milk, eggs and bread'); await T(h, 'basket')
  await click('Checkout'); await T(h, 'gcheckout'); await click(/^Pay /); await L.confirm(h); await T(h, 'gdone'); await summ('grocery')
  await ask('Track my order'); await T(h, 'track')
  await L.buy(h, 'Noise-cancelling headphones', 'hp', { method: 'Card' })
  await ask('my headphones arrived broken'); await T(h, 'broken')
  const bs = p.locator('.gr-answer').last().locator('button'); log('buttons:', await bs.allInnerTexts())
  await ask('return my headphones'); await T(h, 'return'); log('buttons:', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await click(/Yes|Return|Confirm|Book/).catch(e => log('no return btn')); await p.waitForTimeout(400); if (await p.$('.app-sheet')) await L.confirm(h); await T(h, 'returned'); await summ('after return')
  await L.buy(h, 'Rain shell jacket', 'jk')
  await ask('my jacket arrived damaged'); await T(h, 'claim'); log('buttons:', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await p.locator('.gr-answer').last().locator('button').nth(1).click().catch(()=>{}); await p.locator('.gr-answer').last().locator('textarea').fill('The zip is broken').catch(()=>log('no textarea')); await click('Send claim').catch(e=>log('no send claim')); await T(h, 'claim-sent'); await summ('after claim')
  await nav(4); await full('wallet-orders'); 
  for (const tab of ['Orders', 'Subscriptions', 'Requests', 'Past']) { await p.getByRole('tab', { name: tab }).click().catch(() => p.getByRole('button', { name: tab, exact: true }).click().catch(()=>log('no tab ' + tab))); await p.waitForTimeout(300); log('TAB', tab, (await p.locator('.app-main').innerText()).replace(/\n/g,' | ').slice(0, 700)); await full('wallet-' + tab) }
}
