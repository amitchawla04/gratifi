const H = require('./h.js');
(async () => {
  const h = await H.open('UK', { tag: 'UK-cal' }); const { p, ask } = h;
  await h.nav(3);
  for (const d of ['9 Oct', '2 Oct', '23 Oct']) { await ask('one way flights to Lisbon on ' + d); const prices = await p.evaluate(() => [...[...document.querySelectorAll('.gr-answer')].pop().querySelectorAll('.gr-flight')].map(f => f.innerText.replace(/\n/g, ' ').match(/(\d\d:\d\d).*?£(\d+)/).slice(1).join('@'))); console.log(d, prices.join(', ')) }
  await ask('cheaper dates?'); const cal = await p.evaluate(() => [...[...document.querySelectorAll('.gr-answer')].pop().querySelectorAll('button')].map(b => b.innerText.replace(/\n/g, ' ')).filter(x => /^(2|9|23) /.test(x))); console.log(cal);
  await h.done();
})();
