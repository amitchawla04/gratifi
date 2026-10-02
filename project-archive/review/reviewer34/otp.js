const { open } = require('./h.js');
(async () => { const h = await open('IN', { tag: 'otp' }); const { p } = h;
 await h.nav(3); await h.ask('pay ₹500 off my card', 900);
 for (let i = 0; i < 3; i++) { const ins = await p.$$('.app-sheet input'); if (!ins.length) { console.log('no inputs', await h.sheetText()); break } if (ins.length >= 6) for (let k = 0; k < 6; k++) await ins[k].fill('111111'[k]); else await ins[0].fill('111111'); await p.locator('.app-sheet .gr-btn').last().click().catch(e => console.log('btn', e.message.slice(0, 60))); await p.waitForTimeout(700); console.log('try', i + 1, '::', (await h.sheetText()).slice(0, 300)); if (i === 1) await h.shot('lasttry') }
 await h.shot('locked');
 await p.reload(); await p.waitForTimeout(800); await h.nav(3); await h.ask('pay ₹500 off my card', 900); console.log('after reload ::', (await h.sheetText()).slice(0, 300), '|', (await h.lastText()).slice(0, 200)); await h.shot('reload');
 const s = await h.st(); console.log('card', s.card.balance);
 await h.close() })();
