const L = require('./lib.js')
const T = async (h, tag) => { await h.last(tag); h.log(`== ${tag}:`, (await h.lastText()).replace(/\n/g,' | ').slice(0, 600)) }
module.exports = async (h) => { const { p, nav, ask, log, state, full, shot } = h
  const S = async (f) => { try { await f() } catch (e) { log('!! step failed', e.message.split('\n')[0]) } }
  const payBtn = async () => { const l = p.locator('.gr-answer').last().getByRole('button', { name: /^(ادفع|Pay)/ }).last(); await l.click({ timeout: 5000 }); await L.confirm(h) }
  await nav(3); await ask('رحلات إلى مسقط نهاية الأسبوع القادم لشخصين')
  await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(400)
  await payBtn(); await full('receipt-full')
  await S(async () => { await nav(4); await full('wallet'); log('WALLET', (await p.locator('.app-main').innerText()).replace(/\n/g, ' | ')); await p.locator('.app-main .gr-btn').first().click({ timeout: 5000 }); await p.waitForTimeout(400); await full('pass') })
  await nav(3)
  for (const q of ['ألغِ رحلتي', 'إلغاء رحلتي', 'الغاء الحجز', 'غيّر مقعدي', 'أين طلبي؟', 'سماعاتي وصلت مكسورة']) { await ask(q); await T(h, 'q') }
  await S(async () => { await nav(4); await p.locator('.app-main').getByRole('button', { name: /إلغاء|ألغ/ }).first().click({ timeout: 5000 }); await p.waitForTimeout(500); await T(h, 'cancel-ask'); await full('cancel-full'); await p.locator('.gr-answer').last().locator('.gr-btn').first().click({ timeout: 5000 }); await p.waitForTimeout(500); await T(h, 'cancelled'); await h.summ('ar cancel') })
  await S(async () => { await ask('فندق في مسقط'); await T(h, 'hotel'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400); await full('hotel-full') })
  await S(async () => { await ask('كم أدين؟'); await T(h, 'owe'); await payBtn(); await T(h, 'paid') })
  await S(async () => { await ask('جمّد بطاقتي'); await T(h, 'freeze'); await full('freeze-full') })
  await S(async () => { await ask('حليب وبيض وخبز'); await T(h, 'groc'); await full('groc-full') })
  await S(async () => { await ask('أريد أن أشتكي'); await T(h, 'complain') })
  await S(async () => { await ask('asdf qwer'); await T(h, 'nonsense') })
  await S(async () => { await ask('Flights to London'); await T(h, 'english') })
  await S(async () => { await ask('ما هي عروض بطاقتي؟'); await T(h, 'offers'); await ask('حوّل النقاط إلى أميال'); await T(h, 'transfer'); await full('transfer-full'); await ask('تبرع بالنقاط'); await T(h, 'donate'); await ask('استثمر نقاطي'); await T(h, 'invest'); await full('invest-full') })
  await S(async () => { await nav(5); await p.locator('.app-demo .gr-btn').nth(4).click({ timeout: 5000 }); await p.waitForTimeout(400); await T(h, 'fraud'); await full('fraud-full') })
  await nav(2); await full('explore')
  const miss = await p.evaluate(() => [...(window.__missing || [])]); log('MISSING', JSON.stringify(miss))
  await nav(3)
  const eng = await p.evaluate(() => { const out = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const t = n.nodeValue.trim(); if (/[A-Za-z]{3,}/.test(t) && !/[؀-ۿ]/.test(t)) out.add(t) } return [...out] }); log('ENGLISH TEXT NODES', JSON.stringify(eng))
  const aria = await p.evaluate(() => [...new Set([...document.querySelectorAll('[aria-label],[placeholder],[title]')].map(e => e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.getAttribute('title')).filter(t => /[A-Za-z]{3,}/.test(t) && !/[؀-ۿ]/.test(t)))]); log('ENGLISH ATTRS', JSON.stringify(aria))
}
