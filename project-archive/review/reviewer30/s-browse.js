module.exports = async (H) => { const { p, nav, last, full } = H;
 for (const c of ['Barcelona', 'New York', 'Edinburgh']) { await nav(2); await p.locator('.gr-cattile').first().click(); await p.waitForTimeout(300); await p.getByText(c, { exact: true }).first().click(); await p.waitForTimeout(1200); console.log(`\n[${c}] ${(await last()).slice(0, 1400)}`) }
 await nav(1); await p.getByText('Tidewater House').first().click(); await p.waitForTimeout(1000); console.log('\n[featured] ' + (await last()).slice(0, 300));
 await nav(1); await p.getByRole('button', { name: 'Add' }).first().click(); await p.waitForTimeout(800); console.log('\n[offer add] ' + (await p.evaluate(() => document.body.innerText)).slice(0, 200).replace(/\n/g, ' | '));
 await nav(1); await p.getByRole('button', { name: 'Show ideas' }).click(); await p.waitForTimeout(1000); console.log('\n[ideas] ' + (await last()).slice(0, 500)); await full('ideas');
 await nav(1); await p.getByRole('button', { name: 'See flights' }).click(); await p.waitForTimeout(1000); console.log('\n[see flights] ' + (await last()).slice(0, 300));
}
