// shared helper: book a UK-style flight for n pax via chat
module.exports = async function bookFlight(h, q='Flights to Lisbon from 14 Oct to 18 Oct for 2 adults and 1 child', names=['Priya Chawla','Kabir Chawla'], payAll) {
  const {p,ask,click,last,confirm}=h;
  await ask(q); await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  await click(/Continue with/);
  const ins = last().locator('input.app-in'); const n=await ins.count(); for(let i=0;i<n;i++){ if(!(await ins.nth(i).inputValue())) await ins.nth(i).fill(names[i-1]||'Sam Taylor') }
  await last().locator('.gr-btn').last().click(); await p.waitForTimeout(600);
  if (payAll) { await last().getByText(payAll).first().click(); await p.waitForTimeout(300) }
  await click(/^Pay /); await confirm();
}
