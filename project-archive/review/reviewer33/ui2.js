const { open } = require('./h.js');
(async () => { const h = await open('IN', { tag: 'ui2' }); const { p } = h;
 await h.nav(3); await h.ask('pay ₹1000 off my bill', 900);
 const fill = async (code) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(code[i]); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(700); };
 for (let k = 1; k <= 3; k++) { await fill('111111'); console.log('try', k, ':', (await h.sheetText()).slice(0, 400)); await h.shot('otp' + k); }
 await p.reload(); await p.waitForTimeout(800); await h.nav(3);
 await h.ask('pay ₹500 off my bill', 900); console.log('after reload:', (await h.sheetText()).slice(0, 400), '| last:', (await h.lastText()).slice(0, 300)); await h.shot('otp-reload');
 const s = await h.st(); console.log('card bal', s.card.balance);
 await h.close() })();
