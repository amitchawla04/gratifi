module.exports = async (h) => { const { p, plan, nav } = h
  await nav(3)
  for (const tp of ["cash advance fee", "cash advance", "what does a cash advance cost", "card expiry date", "when does my card expire", "charged twice", "the cash machine kept my card", "my card was eaten by the cash machine", "what is the foreign transaction fee", "activate my new card", "add card to apple pay", "my new card hasn't arrived", "balance transfer", "will my card work in Japan", "why was my payment declined", "interest rate", "cancel my direct debit", "turn my card back on", "make my limit £3000", "the shop refunded me but it's not showing"]) {
    await plan(`async (turns,o,run) => { const r = await run('card_and_account', {topic:${JSON.stringify(tp)}}); window.__d = r; return '' }`)
    await h.ask('x', 900)
    const d = await p.evaluate(() => JSON.stringify(window.__d && { s: window.__d.shown_to_customer, n: window.__d.note }))
    console.log(`[${tp}] => ${d.slice(0, 330)}`)
    if (await h.sheet()) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  }
}
