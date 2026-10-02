module.exports = async (h) => {
  const { p, say, log, click, sheet, st, nav, shot, url } = h
  await say('what do I owe'); await click(/^Pay /)
  const a = await p.evaluate(() => { const s = document.querySelector('.app-sheet'); const d = s && (s.closest('[role=dialog]') || s.querySelector('[role=dialog]') || (s.getAttribute('role') === 'dialog' && s)); const main = document.querySelector('.app-main'); return { dialog: !!d, modal: d && d.getAttribute('aria-modal'), label: d && (d.getAttribute('aria-labelledby') || d.getAttribute('aria-label')), inert: main && (main.inert || !!main.closest('[inert]')), focusIn: s && s.contains(document.activeElement) } })
  log('dialog ' + JSON.stringify(a))
  const wrong = async (c) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(c[i]); await p.locator('.app-sheet .gr-btn').last().click().catch(() => {}); await p.waitForTimeout(700); log('  after ' + c + ': ' + (await sheet() || '').slice(0, 260)) }
  await wrong('111111'); await wrong('222222'); await shot('otp2'); await wrong('333333'); await shot('otp3')
  await p.keyboard.press('Escape'); await p.reload(); await p.waitForTimeout(800); await nav(3)
  await say('pay the minimum'); await click(/^Pay /).catch(() => {}); log('  after reload: ' + (await sheet() || 'no sheet').slice(0, 300)); await shot('otp-reload')
  const s = await st(); log('  bal ' + s.card.balance)
}
