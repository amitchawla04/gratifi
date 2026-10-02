module.exports = async (h) => {
  const { p, say, log, lastAnswer, click, st } = h
  for (const q of ['50 pints of milk', 'make the milk 99', 'are there any fees abroad?', 'do you charge for using the card in Spain', 'what did I spend last week', 'yes it was me', 'it wasn\'t me', 'show my alerts', 'remove my alert', 'what can you do', 'is this safe?', 'are you a real person?']) { await say(q); log('  A: ' + (await lastAnswer()).slice(0, 300)) }
  await click('Checkout').catch(() => log('no checkout')); log('  CO: ' + (await lastAnswer()).slice(0, 300))
}
