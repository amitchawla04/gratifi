const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
module.exports = async (h) => { const { p, nav, ask, click, full, last, summ, lastText, log } = h
  await nav(3); await L.buy(h, 'Which subscriptions are included?', 'tune', { nth: 1 })
  await L.buy(h, 'Start a streaming subscription', 'scr', { nth: 0 })
  await ask('cancel my Screenly subscription'); await T(h, 'cancel-scr'); log('btns', await p.locator('.gr-answer').last().locator('button').allInnerTexts())
  await ask('pause Tunewave'); await T(h, 'pause-tune')
  await ask('what subscriptions do I have'); await T(h, 'mysubs')
  await nav(4); await p.getByRole('button', { name: 'Subscriptions', exact: true }).click().catch(()=>p.getByRole('tab', { name: 'Subscriptions' }).click()); await p.waitForTimeout(300); await full('wsubs'); log('WS', (await p.locator('.app-main').innerText()).replace(/\n/g,' | '))
  await click('Pause').catch(e=>log('no pause')); await p.waitForTimeout(400); await full('paused'); log('WS2', (await p.locator('.app-main').innerText()).replace(/\n/g,' | '))
  await click('Cancel').catch(e=>log('no cancel')); await p.waitForTimeout(400); await full('cancel-sub'); log('WS3', (await p.locator('.app-main').innerText()).replace(/\n/g,' | ').slice(0,800))
  if (await p.$('.app-sheet')) await L.confirm(h)
  const yes = p.getByRole('button', { name: /Yes, cancel/ }); if (await yes.count()) { await yes.last().click(); await p.waitForTimeout(400) }
  await full('cancelled-sub'); log('WS4', (await p.locator('.app-main').innerText()).replace(/\n/g,' | ').slice(0,1000)); await summ('subs end')
  await nav(3); await L.buy(h, 'A gift card for a friend', 'gift', { pre: async () => { const i = p.locator('.gr-answer').last().locator('input'); await i.nth(0).fill('Sam'); await i.nth(1).fill('not-an-email') } })
  await nav(4); await click('Show code').catch(e=>log('no show code')); await full('code'); log('CODE', (await p.locator('.app-main').innerText()).replace(/\n/g,' | ').slice(-600))
}
