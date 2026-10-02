// phrases from file PH (one per line; lines starting with '#RESET' reload with cleared storage; '#NAV n' nav)
module.exports = async (H) => { const { p, nav, say, url } = H; const L = require('fs').readFileSync(process.env.PH, 'utf8').split('\n').filter(x => x.trim());
  await nav(3);
  for (const l of L) { if (l.startsWith('#RESET')) { await p.goto(url()); await p.evaluate(() => localStorage.clear()); await p.goto(url()); await p.waitForTimeout(600); await nav(3); console.log('\n----RESET'); continue }
    if (l.startsWith('#SHOT')) { await H.full(l.slice(6).trim() || 'x'); continue }
    if (l.startsWith('#JS ')) { const r = await p.evaluate(l.slice(4)).catch(e => 'ERR ' + e.message); console.log('\n[JS] ' + JSON.stringify(r).slice(0, 600)); continue }
    await p.keyboard.press('Escape').catch(() => {}); await say(l) } }
