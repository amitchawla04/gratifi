const H=require('./h.js');
H.run({market:'UK',name:'offer'},async h=>{const p=h.p;
const b=p.getByRole('button',{name:'Add'}).first(); await b.scrollIntoViewIfNeeded(); await b.click(); await p.waitForTimeout(600); await h.sh('after-add'); h.log(await p.evaluate(()=>document.querySelector('.app').dataset.tab));
});
