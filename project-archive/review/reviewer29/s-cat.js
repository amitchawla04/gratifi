module.exports = async (h) => { const { p, plan, nav } = h
  await nav(3)
  for (const tp of ["the shop said they refunded me but I can't see it", "missing refund from a shop", "refund not showing", "I returned something to a shop and the refund hasn't come through", "charged twice", "card work abroad", "what is the foreign transaction fee", "cash advance fee", "card expiry date", "my card was eaten by the cash machine"]) {
    await plan(`async (turns,o,run) => { const r = await run('card_and_account', {topic:${JSON.stringify(tp)}}); return '' }`)
    await h.ask('x', 900)
    console.log(`[${tp}] => ${(await h.last()).slice(0, 260)}`)
    if (await h.sheet()) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  }
}
