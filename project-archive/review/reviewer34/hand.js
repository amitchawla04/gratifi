const { open } = require('./h.js');
(async () => { const h = await open('UK', { tag: 'hand' }); const { p } = h;
 await h.click('See flights'); await p.waitForTimeout(800); console.log('tab', await p.evaluate(() => document.querySelector('.app').dataset.tab), '|', (await h.lastText()).slice(0, 250));
 await h.nav(1); await p.locator('text=Tidewater House').first().click(); await p.waitForTimeout(800); console.log('featured ->', (await h.lastText()).slice(0, 250));
 await h.nav(1); await h.click('Add'); await p.waitForTimeout(500); console.log('offer add ->', (await p.locator('.app-main').innerText()).replace(/\s+/g,' ').slice(0, 200));
 await h.nav(2); await p.locator('.gr-cattile').nth(3).click(); await p.waitForTimeout(400); await p.getByRole('button', { name: 'Cabs, trains, cars' }).count(); const chip = p.locator('.app-main button').filter({ hasText: /Airport|Train/ }).first(); console.log('chip', await chip.innerText()); await chip.click(); await p.waitForTimeout(800); console.log('explore chip ->', await p.evaluate(() => document.querySelector('.app').dataset.tab), (await h.lastText()).slice(0, 250));
 await h.nav(1); await p.locator('[aria-label*=otif], [aria-label*=essage], .gr-bell').first().click().catch(e=>console.log('nobell')); await p.waitForTimeout(500); await h.shot('bell'); console.log('bell ->', (await p.locator('.app-main, .app-sheet').first().innerText()).replace(/\s+/g,' ').slice(0, 300));
 await h.close() })();
