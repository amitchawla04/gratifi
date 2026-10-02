module.exports = async (h) => {
  const { p, say, log, lastAnswer } = h
  for (const q of ['pay the minimum', 'pay the minimum payment on my card', 'pay £50 off my card', 'pay my full balance', 'set up a direct debit for the minimum']) {
    await say(q); log('  A: ' + (await lastAnswer()).slice(0, 300)); const b = await p.getByRole('button', { name: /^Pay / }).last().innerText().catch(() => 'none'); log('  PAY BUTTON: ' + b)
    const sh = await p.evaluate(() => { const s = document.querySelector('.app-sheet'); return s ? s.innerText.replace(/\s+/g, ' ').slice(0, 200) : null }); log('  SHEET: ' + sh)
    if (sh) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  }
}
