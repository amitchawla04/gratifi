exports.bookFlight = async (h, q = 'Flights to Lisbon on 16 Oct for 2, back 20 Oct', fare = null, name = 'Sam Taylor') => {
  const { p } = h;
  await h.ask(q);
  await p.locator('.gr-answer').last().locator('.gr-flight').first().click(); await p.waitForTimeout(500);
  if (fare) { await p.locator('.gr-answer').last().getByText(fare, { exact: true }).first().click(); await p.waitForTimeout(300) }
  await h.btn(/Continue with|تابع/);
  const ins = p.locator('.gr-answer').last().locator('input.app-in');
  for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill(name) }
  const c = p.locator('.gr-answer').last().locator('.gr-btn').last(); await c.click(); await p.waitForTimeout(500);
};
exports.L = (h) => async (tag) => console.log('==' + tag + '==\n' + (await h.lastText()).replace(/\n+/g, ' | ').slice(0, 1800));
exports.payLast = async (h, code) => { const { p } = h; const pay = p.getByRole('button', { name: /^(Pay |ادفع )/ }).last(); await pay.scrollIntoViewIfNeeded(); await pay.click(); await p.waitForTimeout(300); return h.confirm(code) };
