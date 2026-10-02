module.exports = async (h) => {
  const { p, log } = h
  const m = async (l) => log(l + ' ' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.gr-nav button')].map(b => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), b.getAttribute('aria-label') || b.innerText] }))))
  await m('100%')
  await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(300)
  await m('200%')
  // a11y basics: buttons without names, images without alt, inputs without labels
  const a = await p.evaluate(() => { const r = { noname: [], inputs: [] }; document.querySelectorAll('button,[role=button]').forEach(b => { const n = (b.getAttribute('aria-label') || b.innerText || b.title || '').trim(); if (!n) r.noname.push(b.outerHTML.slice(0, 120)) }); document.querySelectorAll('input,textarea').forEach(i => { const n = i.getAttribute('aria-label') || i.placeholder || (i.id && document.querySelector(`label[for="${i.id}"]`)); if (!n) r.inputs.push(i.outerHTML.slice(0, 100)) }); r.lang = document.documentElement.lang; r.title = document.title; return r })
  log(JSON.stringify(a))
}
