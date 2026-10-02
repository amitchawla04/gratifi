const H = require('./h.js');
(async () => {
  const m = process.argv[2] || 'UK', th = process.argv[3] || 'light';
  const h = await H.start(m, th); const { p } = h;
  const L = async (tag) => console.log('==' + tag + '==\n' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 1800));
  try {
    await h.nav(3); await h.ask('Flights to Lisbon on 16 Oct for 2, back 20 Oct');
    await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
    // pick a different return flight (3rd) to check price updates
    const before = await p.locator('.gr-answer').last().innerText();
    await p.locator('.gr-answer').last().getByRole('button', { name: /20:30/ }).first().click().catch(e => console.log('noret', e.message.split('\n')[0])); await p.waitForTimeout(400);
    const after = await p.locator('.gr-answer').last().innerText();
    console.log('RET CHANGE price', before.match(/2 travellers: [^\n]*/)?.[0], '->', after.match(/2 travellers: [^\n]*/)?.[0]);
    await h.btn(/Continue with/); await h.full('seats'); await L('seats');
    console.log('INPUTS', await p.locator('.gr-answer').last().locator('input').evaluateAll(xs => xs.map(x => `${x.type}|${x.value}|${x.getAttribute('aria-label') || x.placeholder}`)));
    const ins = p.locator('.gr-answer').last().locator('input.app-in');
    for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') }
    await h.btn('Continue', { exact: true }); await h.full('checkout'); await L('checkout');
    const s0 = await h.summ(); console.log('BEFORE', JSON.stringify(s0));
    await h.btn(/^Pay /); await h.shot('sheet'); console.log('SHEET', await h.sheetText());
    await h.confirm(); await h.full('receipt'); await L('receipt');
    const s1 = await h.summ(); console.log('AFTER', JSON.stringify(s1));
    await h.nav(4); await h.full('wallet');
    await h.btn(/Show pass|Boarding pass|pass/i); await h.full('pass'); await L('pass');
    console.log('PASSTEXT', await p.evaluate(() => document.body.innerText.slice(0, 1500)).then(x => x.replace(/\n+/g, ' | ')));
  } catch (e) { console.log('ERR', e.message.split('\n')[0]); await h.shot('fail') }
  console.log(h.errs); await h.b.close();
})();
