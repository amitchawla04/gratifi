const H=require('./h.js');
H.run({market:'IN',name:'otp'},async h=>{const p=h.p;await h.nav(3);
await h.ask('What do I owe?');await h.click(/^Pay /);
const enter=async(c)=>{const ins=await p.$$('.app-sheet input'); for(let i=0;i<6;i++) await ins[i].fill(c[i]); await p.locator('.app-sheet .gr-btn').last().click().catch(e=>h.log('btn',e.message.slice(0,60))); await p.waitForTimeout(600); h.log('SHEET', await h.sheetText());};
await enter('111111'); await enter('222222'); await h.sh('2wrong'); await enter('333333'); await h.sh('locked');
await p.reload(); await p.waitForTimeout(600); await h.nav(3); await h.ask('What do I owe?'); await h.click(/^Pay /).catch(e=>h.log('pay',e.message.slice(0,60))); await p.waitForTimeout(400); h.log('AFTER RELOAD SHEET', await h.sheetText()); h.log('last', (await h.lastText()).slice(0,300)); await h.sh('reload');
await h.p.keyboard.press('Escape'); await h.ask('freeze my card'); h.log('freeze during lock', (await h.lastText()).slice(0,300));
await h.ask('unfreeze my card'); h.log('unfreeze', (await h.lastText()).slice(0,300), await h.sheetText());
});
