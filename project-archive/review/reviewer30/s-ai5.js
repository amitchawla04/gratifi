module.exports = async (H) => { const { p, nav } = H; const T = require('./ailib.js')(H); await nav(3); await p.waitForTimeout(500);
 await p.evaluate(() => { window.__t0 = 0; });
 const r = await T('freeze my card', `async (t,o,run)=>{ const a=Date.now(); await run('card_control',{control:'freeze',on:true}); window.__waited = Date.now()-a; return 'Frozen as asked.' }`, { safety: { risk: 'none' }, delay: 3000, wait: 800, len: 300 });
 console.log('frozen at 1.1s?', r.st1.card?.frozen); await p.waitForTimeout(3000); console.log('waited ms', await p.evaluate(() => window.__waited), 'frozen now', (await H.state()).card.frozen, 'text', (await H.last()).slice(0, 200));
 await T('unfreeze', `async (t,o,run)=>{ await run('card_control',{control:'freeze',on:false}); return 'Tap the switch to unfreeze.' }`, { len: 300 });
 console.log('SHEET', await H.sheet()); await p.keyboard.press('Escape');
 // held text: long safety delay, check DOM before verdict
 await p.evaluate(() => { window.__plan = async () => 'Here is some text.'; window.__safetyResp = { risk: 'none' }; window.__safetyDelay = 2000 }); await p.fill('.gr-ask input', 'hello there'); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(700); console.log('TEXT at 0.7s:', JSON.stringify(await H.last())); await p.waitForTimeout(2000); console.log('TEXT at 2.7s:', JSON.stringify(await H.last()));
}
