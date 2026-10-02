const { run } = require('./lib.js');
const book = async (H, q) => { const { p } = H; await H.ask(q); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await H.click(/Continue with/); const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } await H.click('Continue', { exact: true }); await H.click(/^Pay /); await H.confirm(); };
module.exports = book;
if (require.main === module) run('UK-mng', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await book(H, 'flights to Lisbon 14 Oct back 18 Oct for two');
  H.log('m0', JSON.stringify(await H.money()));
  await H.ask('move my return flight to the 20th'); await H.full('chg-ret');
  H.log('A', (await H.lastText()).slice(0, 700));
  await p.locator('.gr-answer').last().locator('.gr-slot, .gr-flight, [role=radio]').nth(1).click(); await p.waitForTimeout(400); await H.full('chg-pick');
  H.log('B', (await H.lastText()).slice(0, 800));
  await p.locator('.gr-answer').last().locator('.gr-btn').last().click(); await p.waitForTimeout(600); await H.full('chg-next');
  H.log('C', (await H.lastText()).slice(0, 800));
  if (await H.has(/^Pay /)) { await H.click(/^Pay /); await H.confirm(undefined, 'chg-sheet'); }
  await H.full('changed'); H.log('D', (await H.last()).text);
  H.log('m1', JSON.stringify(await H.money()));
  const s = await H.st(); H.log('booking', JSON.stringify(s.bookings[0].detail), s.bookings[0].when, JSON.stringify(s.bookings[0].extra.back));
  // outbound time later same day via free text
  await H.ask('can I get a later outbound flight on the same day'); await H.full('later-out'); H.log('E', (await H.lastText()).slice(0, 900));
});
