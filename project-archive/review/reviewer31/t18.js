const H=require('./h.js');
H.run({market:'UK',name:'mycard'},async h=>{const p=h.p;await h.nav(3);await h.ask('remind me when my bill is due');await h.ask('alert me if I spend over £500 in a day'); h.log('alert2',(await h.lastText()).slice(0,200));
await h.nav(5);
await p.getByRole('button',{name:'Turn on'}).first().click(); await p.waitForTimeout(400); h.log('gamb on', await h.sheetText()); if(await p.$('.app-sheet')) await h.confirm();
await h.sh('gamb');
const lift=p.getByRole('button',{name:/^Lift/}).first(); await lift.click(); await p.waitForTimeout(300); h.log('lift sheet', await h.sheetText()); await h.confirm();
await h.full('lifting'); h.log('card area', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,900));
const keep=p.getByRole('button',{name:/Keep the block/}); h.log('keep btn', await keep.count()); if(await keep.count()){await keep.first().click(); await p.waitForTimeout(300); h.log('after keep sheet', await h.sheetText());}
await p.getByRole('button',{name:'Minimum'}).first().click(); await p.waitForTimeout(300); h.log('dd sheet', await h.sheetText()); await h.confirm();
h.log('after dd', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0,700));
await h.full('dd');
});
