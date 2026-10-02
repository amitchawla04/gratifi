const { run } = require('./lib.js');
run('UK-fam', 'UK', async (H) => {
  const { p } = H;
  await H.nav(3); await H.ask('flights to Lisbon 14 Oct back 18 Oct for 2 adults, a 7 year old and a baby');
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400);
  await H.click(/Continue with/);
  const ins = p.locator('.gr-answer').last().locator('input');
  const n = await ins.count(); const info = [];
  for (let i = 0; i < n; i++) info.push(await ins.nth(i).evaluate(e => e.type + ':' + (e.getAttribute('aria-label') || e.placeholder) + '=' + e.value));
  H.log('inputs', info.join(' | '));
  // names
  let k = 0;
  for (let i = 0; i < n; i++) { const t = await ins.nth(i).getAttribute('type'); if (t === 'date') continue; if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(['Sam Taylor', 'Mia Taylor', 'Leo Taylor'][k++]) }
  const dates = p.locator('.gr-answer').last().locator('input[type=date]');
  H.log('date inputs', await dates.count());
  // infant who will be 2 by return: born 16 Oct 2024 -> 2 on 16 Oct 2026, return 18 Oct
  await dates.nth(0).fill('2019-05-01'); await dates.nth(1).fill('2024-10-16'); await p.waitForTimeout(300);
  await H.full('dob-over2');
  H.log('msg', (await H.lastText()).match(/[^\n]*(2 |under|turns|older)[^\n]*/g));
  await dates.nth(1).fill('2025-06-01'); await p.waitForTimeout(300);
  // child aged 1? test child DOB too young
  await dates.nth(0).fill('2025-01-01'); await p.waitForTimeout(300); H.log('child too young', (await H.lastText()).match(/[^\n]*(child|Child)[^\n]*/g));
  await dates.nth(0).fill('2019-05-01'); await p.waitForTimeout(300);
  // try exit row for child: click Child chip then exit seat 14A
  await H.full('seats');
  const cont = H.btn(/^Continue/); H.log('continue label', await cont.textContent());
  await cont.click(); await p.waitForTimeout(500); await H.full('checkout');
  H.log('checkout', (await H.lastText()).slice(0, 900));
  await H.click(/^Pay /); await H.confirm(); await H.full('receipt');
  H.log('money', JSON.stringify(await H.money()));
  // change return date via free text
  await H.ask('move my return flight to the 20th'); await H.full('chg-ret');
  H.log('chg', (await H.last()).text);
});
