module.exports = async (h) => { const { p, nav, log } = h
  await nav(4); log('wallet tabs', await p.evaluate(() => { const e = [...document.querySelectorAll('.app-main *')].filter(x => x.childElementCount === 0 && x.textContent.trim() === 'Requests')[0]; let a = e, out = []; for (let i = 0; i < 3 && a; i++) { out.push(a.tagName + ' role=' + a.getAttribute('role') + ' tabindex=' + a.getAttribute('tabindex') + ' aria-selected=' + a.getAttribute('aria-selected')); a = a.parentElement } return out }))
  log('nav', await p.evaluate(() => [...document.querySelectorAll('.gr-nav button')].map(b => b.getAttribute('aria-label') + '|' + b.getAttribute('aria-current') + '|' + b.innerText)))
  log('headings', await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,[role=heading]')].map(e => e.tagName + ':' + e.innerText.slice(0, 30))))
  await nav(3); await h.ask('Flights to Lisbon next weekend for two'); log('flight card', await p.evaluate(() => { const f = document.querySelector('.gr-flight'); return f.tagName + ' role=' + f.getAttribute('role') + ' tabindex=' + f.getAttribute('tabindex') + ' label=' + f.getAttribute('aria-label') }))
  log('itemrow', await p.evaluate(() => { h = null; return 'n/a' }))
  log('seat', await p.evaluate(() => 'n/a'))
  log('ask input label', await p.evaluate(() => { const i = document.querySelector('.gr-ask input'); return [i.getAttribute('aria-label'), i.placeholder] }))
  log('mic', await p.evaluate(() => { const b = document.querySelector('.gr-ask button'); return b && [b.getAttribute('aria-label'), b.disabled] }))
  await p.click('.gr-ask button').catch(e => log('mic click fail')); await p.waitForTimeout(500); await h.shot('mic')
  log('after mic', await p.evaluate(() => document.body.innerText.slice(-300).replace(/\n/g, ' | ')))
}
