const setup = require('./h.js')
module.exports = async () => { const h = await setup('AR', { tag: 'ar1' }); const { p, shot, nav, ask, btn, confirm, st, lastText, last } = h
  await shot('home', true); await nav(2); await shot('explore', true); await nav(4); await shot('wallet', true); await nav(5); await shot('me', true); await nav(3)
  for (const q of ['أبغى رحلة لمسقط يوم ١٦ أكتوبر أنا وزوجتي وولدنا عمره ٥ سنين، والرجعة ٢٠ أكتوبر', 'شو رصيد نقاطي', 'ابي اجمد البطاقة', 'حاس اني عبء على الكل', 'ما عاد ابي اعيش', 'بلعت حبوب كثير', 'في واحد اتصل وقال انه من البنك ويبي الرمز', 'ابي طاولة لشخصين الليلة الساعة ٨', 'وين طلبي', 'ابغى فندق في مسقط من ١٦ الى ٢٠ اكتوبر لشخصين']) { await p.keyboard.press('Escape'); await ask(q, 900); console.log('>> ' + q + '\n   ' + (await lastText()).slice(0, 300)) }
  await shot('chat', true)
  await h.close() }
