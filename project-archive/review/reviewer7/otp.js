const H=require('./h.js');
H('IN','otp', async ({p,shot,full,nav,ask,click,st,money,log,url,errs})=>{
  await nav(3); await ask('Milk, eggs and bread'); await click('Checkout'); await full('checkout');
  const m0=await money(); log('before', JSON.stringify(m0));
  await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(500); await shot('sheet');
  // type wrong code by keyboard
  await p.locator('.app-sheet input').first().focus(); await p.keyboard.type('111111',{delay:90}); await shot('typed');
  log('vals', await p.$$eval('.app-sheet input', xs=>xs.map(x=>x.value).join('')), 'focused', await p.evaluate(()=>document.activeElement.getAttribute('aria-label')));
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(300); await shot('wrong1');
  log('after wrong1', await p.locator('.app-sheet').innerText());
  await p.locator('.app-sheet input').first().click(); await p.keyboard.type('222222',{delay:90}); log('vals after wrong typing', await p.$$eval('.app-sheet input', xs=>xs.map(x=>x.value).join('')));
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(300); await shot('wrong2');
  log('after wrong2', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '));
  // close and reopen: does warning persist?
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); log('sheet after esc', !!(await p.$('.app-sheet')));
  log('money after esc', JSON.stringify(await money()));
  await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(500); await shot('reopen');
  log('reopen', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '));
  await p.locator('.app-sheet input').first().focus(); await p.keyboard.type('333333',{delay:90}); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(300); await shot('locked');
  log('locked', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '), 'disabled inputs', await p.$$eval('.app-sheet input', xs=>xs.filter(x=>x.disabled).length));
  await p.goto(url()); await p.waitForTimeout(600); await nav(3);
  await p.getByRole('button',{name:/^Pay /}).last().click().catch(e=>log('no pay btn after reload')); await p.waitForTimeout(500); await shot('reload-locked');
  log('after reload', (await p.locator('.app-sheet').innerText().catch(()=>'no sheet')).replace(/\n/g,' / '));
  log('money end', JSON.stringify(await money()));
  // Other actions while locked: pay bill? freeze/unfreeze
  await p.keyboard.press('Escape'); await ask('What do I owe?'); await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(400);
  log('paybill while locked', (await p.locator('.app-sheet').innerText().catch(()=>'no sheet')).replace(/\n/g,' / '));
  // simulate time +16 min
  await p.evaluate(()=>{ const k='gratifi-state-v3-IN'; const s=JSON.parse(localStorage.getItem(k)); s.seen.otp.at-=16*60000; localStorage.setItem(k,JSON.stringify(s)) });
  await p.goto(url()); await p.waitForTimeout(600); await nav(3);
  await p.getByRole('button',{name:/^Pay /}).last().click(); await p.waitForTimeout(500);
  log('after 16 min', (await p.locator('.app-sheet').innerText()).replace(/\n/g,' / '));
  // paste
  await p.locator('.app-sheet input').first().focus();
  await p.evaluate(()=>{ const dt=new DataTransfer(); dt.setData('text','482 193'); const e=new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}); document.activeElement.dispatchEvent(e) });
  await p.waitForTimeout(200); log('after paste', await p.$$eval('.app-sheet input', xs=>xs.map(x=>x.value).join('')), 'focus', await p.evaluate(()=>document.activeElement.getAttribute('aria-label')));
  await shot('pasted'); await p.keyboard.press('Enter'); await p.waitForTimeout(500); log('enter submits?', await p.locator('.app-sheet').innerText().then(t=>t.replace(/\n/g,' / ')).catch(()=>'gone'));
  await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForTimeout(1600); await shot('checking');
  await p.waitForSelector('.app-sheet',{state:'detached',timeout:9000}).catch(()=>errs.push('stuck'));
  await full('paid'); log('money paid', JSON.stringify(await money()));
});
