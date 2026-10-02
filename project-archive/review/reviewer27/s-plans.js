// node r.js s-plans.js UK light 1 plansA
module.exports = async (h) => { const { p, plan, res, nav, sheet, state } = h
  const P = require(__dirname + '/' + (process.env.PLANS || 'plansA') + '.js')
  await nav(3)
  for (const x of P) {
    if (x.pre) await x.pre(h)
    await plan(x.plan); await h.ask(x.q, x.w || 900)
    const r = await res(); const s = await sheet()
    const txt = (await h.last()).slice(0, 900)
    console.log(`\n[${x.q}]\n  TOOLS: ${JSON.stringify(r.map(y => y.r ? { n: y.n, a: y.a, shown: y.r.shown_to_customer, note: y.r.note } : y)).slice(0, 900)}\n  SHEET: ${s ? s.slice(0, 400) : '-'}\n  UI: ${txt}`)
    if (s) { if (x.confirm) { await h.confirm(); console.log('  AFTER CONFIRM:', (await h.last()).slice(0,500)) } else { await p.keyboard.press('Escape'); await p.waitForTimeout(300) } }
    if (x.post) await x.post(h)
    if (x.shot) await h.full(x.shot)
  }
  const st = await state(); console.log('\nSTATE card', JSON.stringify(st.card), 'pts', st.balance, 'lounge', st.loungeLeft, '\n', (st.bookings || []).map(b => b.title + ':' + b.status + ':' + b.total + ':' + b.pts + '/' + b.card).join('; '))
}
