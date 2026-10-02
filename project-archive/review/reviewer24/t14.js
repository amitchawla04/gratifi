module.exports = async (h) => {
  const { p, say, log, click, confirm, nav, text, setPlan } = h
  await say('what do I owe'); await click('Set up Direct Debit'); await confirm()
  await say('remind me when prices to Lisbon drop')
  await nav(5); const t = await text(); log(t.split('\n').filter(x => /Direct|Alert|alert|remind|Lisbon|Cancel|Stop/i.test(x)).join(' | '))
  await say('cancel direct debit'); log((await h.last(1)).slice(0, 300))
  await say('change my direct debit to the minimum'); log((await h.last(1)).slice(0, 300))
}
