const P = (s) => `async (turns,o,run) => { ${s} }`
module.exports = [
 { q: 'walking tour 1.5', plan: P(`await run('prepare_checkout', {id:'EX-London-0', quantity:1.5}); return 'x'`), post: async (h) => { await h.p.locator('.gr-answer').last().locator('.gr-slot').nth(2).click().catch(()=>{}); await h.p.waitForTimeout(200); console.log('  DETAIL NOW', (await h.last()).slice(-120)); await h.p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await h.p.waitForTimeout(500); console.log('  CHECKOUT', (await h.last()).slice(0, 500)) } },
 { q: 'laptop 9', plan: P(`await run('prepare_checkout', {id:'SH-3', quantity:9}); return 'x'`), post: async (h) => { await h.p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await h.p.waitForTimeout(500); console.log('  CHECKOUT', (await h.last()).slice(0, 400)) } },
]
