module.exports = async (H) => { const { p, nav, say, full, click, confirm, sheet, state, last } = H; await nav(3);
 await say('Flights to Lisbon on 12 Oct back 19 Oct for 2 adults, a child aged 4 and a baby');
 await p.locator('.gr-flight').first().click(); await p.waitForTimeout(500);
 await click(/Continue with/); await full('pax');
 const A = p.locator('.gr-answer').last();
 const html = await A.evaluate(e => [...e.querySelectorAll('input,select,button')].map(x => x.tagName + ':' + (x.type||'') + ':' + (x.getAttribute('aria-label')||x.placeholder||x.innerText||'').slice(0,40) + ':' + (x.value||'')).join('\n')); console.log(html);
 const ins = A.locator('input'); const n = await ins.count(); console.log('inputs', n);
 // fill names: adult 2 cyrillic first
 const texts = A.locator('input.app-in:not([type=date])');
 const tn = await texts.count(); console.log('text inputs', tn);
 for (let i = 0; i < tn; i++) { const v = await texts.nth(i).inputValue(); if (!v) await texts.nth(i).fill(['Иван Петров', 'Mia Taylor', 'Leo Taylor', 'x'][i-1] || 'Sam Taylor') }
 const dates = A.locator('input[type=date]'); const dn = await dates.count(); console.log('date inputs', dn);
 if (dn >= 1) await dates.nth(0).fill('2023-01-15'); // child aged 4 claimed; this makes them 3
 if (dn >= 2) await dates.nth(1).fill('2024-10-15'); // infant turns 2 on 15 Oct during trip
 await p.waitForTimeout(300); await full('pax-filled'); console.log('ANS:', (await last()).slice(-900));
 // try clicking exit row seat for child
 const btn = A.locator('.gr-btn').last(); console.log('CTA:', await btn.innerText(), await btn.isDisabled());
}
