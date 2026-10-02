const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 700)) }
module.exports = async (h) => { const { p, nav, ask, log, state, full, shot } = h
  const tr = (t) => p.evaluate(t => window.__tr ? window.__tr(t) : t, t)
  const cl = async (t, exact) => { const a = await tr(t); const l = p.getByRole('button', { name: a, exact: !!exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(450) }
  const payBtn = async () => { const l = p.locator('.gr-answer').last().getByRole('button', { name: /^(ادفع|Pay)/ }).last(); await l.click(); await L.confirm(h) }
  await nav(3); await ask('رحلات إلى مسقط نهاية الأسبوع القادم لشخصين'); await T(h, 'res'); await full('res-full')
  await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400); await T(h, 'fares')
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await T(h, 'seats')
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400); await T(h, 'chk')
  await payBtn(); await T(h, 'receipt'); await h.summ('ar flight')
  await nav(4); await full('wallet'); await p.locator('.app-main').getByRole('button').filter({ hasText: /بطاق|Show pass|عرض/ }).first().click().catch(e=>log('no pass btn')); await p.waitForTimeout(400); await full('pass')
  await nav(3); await ask('ألغِ رحلتي'); await T(h, 'cancel-ask'); await full('cancel-ask-full')
  await p.locator('.gr-answer').last().locator('.gr-btn').first().click(); await p.waitForTimeout(500); await T(h, 'cancelled'); await h.summ('ar cancel')
  await ask('فندق في مسقط'); await T(h, 'hotel'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await T(h, 'hotel-d'); await full('hotel-full')
  await ask('كم أدين؟'); await T(h, 'owe'); await payBtn(); await T(h, 'paid')
  await ask('جمّد بطاقتي'); await T(h, 'freeze'); await full('freeze-full')
  await ask('حليب وبيض وخبز'); await T(h, 'groc'); await full('groc-full')
  await ask('أريد أن أشتكي'); await T(h, 'complain')
  await ask('asdf qwer'); await T(h, 'nonsense')
  await ask('Flights to London'); await T(h, 'english')
  await nav(5); await p.locator('.app-demo .gr-btn').nth(4).click().catch(e=>log('no fraud btn')); await p.waitForTimeout(400); await T(h, 'fraud')
  const miss = await p.evaluate(() => [...(window.__missing || [])]); log('MISSING', JSON.stringify(miss))
  // english leftovers in DOM
  const eng = await p.evaluate(() => { const out = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const t = n.nodeValue.trim(); if (/[A-Za-z]{3,}/.test(t) && !/[؀-ۿ]/.test(t)) out.add(t) } return [...out] }); log('ENGLISH TEXT NODES', JSON.stringify(eng))
}
