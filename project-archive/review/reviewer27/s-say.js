module.exports = async (h) => { const { p, say, nav, sheet } = h
  const Q = require(__dirname + '/' + process.env.Q + '.js')
  await nav(3)
  for (const q of Q) { const x = await say(q, 700); const s = await sheet(); if (s) { console.log('  SHEET:', s.slice(0, 250)); await p.keyboard.press('Escape'); await p.waitForTimeout(250) } }
}
