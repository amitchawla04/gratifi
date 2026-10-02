const C = require('./book.js').C
require('./lib.js')('UK', 'st3', async (h) => {
  const { p } = h
  await h.nav(3); await h.ask('hotel in lisbon for 3 nights from 16 oct for 2 adults'); await h.tail('list'); console.log('LIST', await h.text())
  await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); console.log('DETAIL', await h.text())
  await h.ask('hotel in lisbon for 3 nights from 16 oct, 2 rooms for 4 people'); console.log('LIST2', (await h.text()).slice(0,300))
  await C(h.last().locator('.gr-itemrow').first()); await p.waitForTimeout(300); console.log('DETAIL2', await h.text())
})
