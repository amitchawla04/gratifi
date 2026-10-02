module.exports = async (h) => {
  const { p, say, log, lastAnswer, setPlan, res } = h
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'pay the minimum payment'}); return 'Tap Pay to pay the minimum.' }`)
  await say('pay the minimum'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  PAY BUTTON: ' + await p.getByRole('button', { name: /^Pay / }).last().innerText().catch(() => 'none'))
  await setPlan(`async (t,o,run)=>{ await run('card_and_account',{topic:'pay 27.21 off my bill'}); return 'Confirm it.' }`)
  await say('pay 27.21'); log('  A: ' + (await lastAnswer()).slice(0, 300)); log('  RES ' + (await res()).slice(0, 300))
}
