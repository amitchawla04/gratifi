const C = require('./book.js').C
require('./lib.js')('UK', 'shop', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('Noise-cancelling headphones'); await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300)
  console.log('DETAIL', await h.text()); console.log('DB', await h.buttons())
  await h.btn('Continue', { exact: true }); console.log('CK', await h.text()); console.log(await h.last().evaluate(e => [...e.querySelectorAll('button,select,[role=radio],input')].map(b => `${b.tagName}|${b.getAttribute('role')}|${b.getAttribute('aria-label')}|${b.textContent.trim().slice(0,30)}`).join('\n')))
  await h.shot('ck')
})
