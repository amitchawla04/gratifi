module.exports = async (H) => { const { p, nav, say, full, click, sheet, url } = H; await nav(3);
 const fill = async (c) => { const ins = await p.$$('.app-sheet input'); for (let i = 0; i < 6; i++) await ins[i].fill(c[i]); await p.waitForTimeout(200); const b = p.locator('.app-sheet .gr-btn').last(); if (!(await b.isDisabled())) await b.click(); await p.waitForTimeout(700); console.log('SHEET after', c, '=>', (await sheet() || 'closed').slice(0, 400)) };
 await say('pay the minimum'); await click(/^Pay /); await p.waitForTimeout(400); console.log('SHEET0', await sheet());
 await fill('111111'); await fill('222222'); await full('otp-2wrong'); await fill('333333'); await full('otp-3wrong');
 await p.keyboard.press('Escape'); await p.goto(url()); await p.waitForTimeout(800); await nav(3);
 await say('pay the minimum'); await click(/^Pay /).catch(e => console.log('no pay btn')); await p.waitForTimeout(400); console.log('SHEET after reload', await sheet()); await full('otp-reload');
 await p.keyboard.press('Escape');
 await say('pay £100'); console.log('LAST', (await H.last()).slice(0, 400));
 await say('lower my limit to £3000'); console.log('LAST', (await H.last()).slice(0, 400));
}
