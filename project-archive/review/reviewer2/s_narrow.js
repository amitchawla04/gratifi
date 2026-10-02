module.exports = async (h) => { const { p, nav, ask, click, shot, log } = h
  await p.setViewportSize({ width: 360, height: 780 }); await p.waitForTimeout(300)
  log('hscroll', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]))
  await shot('home360'); await nav(3); await ask('Flights to Lisbon next weekend for two'); await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(300); await click(/Continue with/); await click('Continue', true); await p.waitForTimeout(300)
  await p.locator('.app-main .app-scroll').evaluate(e => e.scrollTop = e.scrollHeight); await shot('chk360')
  log('overflowing', await p.evaluate(() => [...document.querySelectorAll('.app-main *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && !e.closest('.gr-hscroll, [class*=scroll], [class*=rail], [class*=carousel]') }).map(e => e.className + ':' + (e.innerText||'').slice(0, 20)).slice(0, 10)))
  await nav(5); await shot('me360'); await nav(4); await shot('wallet360')
}
