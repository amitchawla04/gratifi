const L = require('./lib.js')
const CITY = { UK: 'Lisbon', EU: 'Rome', IN: 'Goa', AE: 'Muscat', AR: 'Muscat', SG: 'Bali', MY: 'Penang' }
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 900)) }
module.exports = async (h) => { const { p, nav, ask, click, log, state, full, shot, market } = h
  await nav(3); await ask(`Flights to ${CITY[market]} next weekend for two`); await T(h, 'res')
  await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await T(h, 'fares')
  await click(/Continue with/); await click('Continue', true); await T(h, 'chk')
  await click(/^Pay /); await p.waitForTimeout(400); await shot('sheet0'); log('SHEET:', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' | '))
  const ins = await p.$$('.app-sheet input'); log('inputs', ins.length, await p.locator('.app-sheet input').first().evaluate(e => [e.type, e.inputMode, e.autocomplete, e.getAttribute('aria-label'), e.maxLength]).catch(()=>null))
  if (ins.length) {
    const code = '111111'; if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else await ins[0].fill(code)
    await shot('otp-typed'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(1500); await shot('otp-wrong'); log('AFTER WRONG:', (await p.locator('.app-sheet').innerText().catch(()=>'SHEET CLOSED')).replace(/\n/g,' | ')); const s = await state(); log('bookings after wrong', s.bookings.length, s.balance)
    // try wrong again x3
    for (let k = 0; k < 3; k++) { const i2 = await p.$$('.app-sheet input'); if (!i2.length) break; if (i2.length >= 6) { for (let i = 0; i < 6; i++) await i2[i].fill('00000'+k[0]) } else await i2[0].fill('00000' + k); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(1200); log('WRONG', k, (await p.locator('.app-sheet').innerText().catch(()=>'SHEET CLOSED')).replace(/\n/g,' | ')) }
    await shot('otp-many')
    const i3 = await p.$$('.app-sheet input'); if (i3.length) { if (i3.length >= 6) { for (let i = 0; i < 6; i++) await i3[i].fill('482193'[i]) } else await i3[0].fill('482193'); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(()=>log('!! stuck')); await p.waitForTimeout(500) }
  } else { await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(500); await shot('approval'); log('AFTER CLICK:', (await p.locator('.app-sheet').innerText().catch(()=>'SHEET CLOSED')).replace(/\n/g,' | ')); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 12000 }).catch(() => log('!! sheet still open')) }
  await T(h, 'receipt'); await h.summ('booked')
  await L.buy(h, 'A table tonight for two', 'dine')
  await L.buy(h, 'Book a lounge', 'lounge')
  await L.buy(h, 'Noise-cancelling headphones', 'shop', { method: 'Points and card' })
  await ask('What do I owe?'); await T(h, 'owe'); await nav(4); await full('wallet'); await nav(5); await full('me'); await nav(1); await full('home')
}
