module.exports = async (h) => { const { p, nav, log, shot, full, url } = h
  const btns = await p.locator('.app-main button').evaluateAll(e => e.map(x => (x.getAttribute('aria-label') || x.innerText).trim().replace(/\n/g, ' ')))
  log('home buttons', JSON.stringify(btns))
  for (let i = 0; i < btns.length; i++) {
    await p.goto(url()); await p.waitForTimeout(400)
    const b = p.locator('.app-main button').nth(i); const name = btns[i]
    const before = await p.evaluate(() => document.querySelector('.app')?.getAttribute('data-tab') + '|' + document.body.innerText.length)
    await b.scrollIntoViewIfNeeded().catch(()=>{}); await b.click({ timeout: 3000 }).catch(e => log('click fail', name)); await p.waitForTimeout(700)
    const after = await p.evaluate(() => document.querySelector('.app')?.getAttribute('data-tab') + '|' + document.body.innerText.length + '|' + (document.querySelector('.app-sheet') ? 'SHEET' : ''))
    const la = await p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')]; return a.length ? a[a.length - 1].innerText.replace(/\n/g, ' | ').slice(0, 160) : (document.querySelector('.app-sheet')?.innerText || '').replace(/\n/g,' | ').slice(0,160) })
    log(`[${name}] ${before} -> ${after} :: ${la}`)
    if (/bell|Notif|UK|Messages/i.test(name)) await shot('btn-' + i)
  }
}
