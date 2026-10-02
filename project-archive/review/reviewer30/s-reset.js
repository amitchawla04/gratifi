module.exports = async (H) => { const { p, nav, say, state, full } = H; await nav(3); await say('freeze my card'); await say('transfer 5000 points to northway miles');
 let s = await state(); console.log('before', s.balance, s.card.frozen, s.chat.length);
 await nav(5); await p.locator('.app-demo').getByRole('button', { name: 'Reset demo' }).click(); await p.waitForTimeout(500); await full('reset-click'); console.log('SHEET', await H.sheet());
 const btns = await p.locator('.app-sheet .gr-btn, [role=dialog] button').allInnerTexts().catch(() => []); console.log('dialog buttons', btns);
 if (btns.length) { await p.locator('.app-sheet .gr-btn, [role=dialog] .gr-btn').last().click(); await p.waitForTimeout(1000) }
 s = await state(); console.log('after', s && s.balance, s && s.card.frozen, s && s.chat.length);
}
