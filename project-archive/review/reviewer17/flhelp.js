exports.toTravellers = async (h, q = 'Flights to Lisbon on 16 Oct back 20 Oct for 2 adults, a 7 year old and a baby') => {
  const { p, nav, ask } = h; await nav(3); await ask(q, 1200);
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(800);
  await h.click(/^Continue with/); await p.waitForTimeout(600);
};
exports.inputs = async (p) => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')]; const l = a[a.length - 1]; return [...l.querySelectorAll('input,select')].map(i => i.tagName + ':' + i.type + ':' + (i.getAttribute('aria-label') || i.placeholder || i.name) + '=' + i.value) });
exports.fillFamily = async (h) => { const { p } = h; const ins = p.locator('.gr-answer').last().locator('input');
  await ins.nth(1).fill('Priya Chawla'); await ins.nth(2).fill('Kabir Chawla'); await ins.nth(3).fill('2019-05-01'); await ins.nth(4).fill('Anya Chawla'); await ins.nth(5).fill('2025-03-01'); await p.waitForTimeout(300) };
exports.bookFamily = async (h, q) => { const { p, click, auth } = h; await exports.toTravellers(h, q); await exports.fillFamily(h);
  await click('Continue', { exact: true, w: 900 }); await click(/^Pay /); await auth(); await p.waitForTimeout(1200) };
exports.bookSimple = async (h, q = 'Flights to Lisbon on 16 Oct back 20 Oct for 2', names = ['Priya Chawla']) => { const { p, click, auth, nav, ask } = h; await nav(3); await ask(q, 1200);
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(800); await click(/^Continue with/); await p.waitForTimeout(600);
  const ins = p.locator('.gr-answer').last().locator('input'); for (let i = 0; i < names.length; i++) await ins.nth(i + 1).fill(names[i]);
  await click('Continue', { exact: true, w: 900 }); await click(/^Pay /); await auth(); await p.waitForTimeout(1200) };
