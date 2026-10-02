module.exports = async (H) => { const { p, nav, say, full } = H; await nav(2); for (let i = 0; i < 19; i++) { await p.locator('.gr-cattile').nth(i).click(); await p.waitForTimeout(200); await p.locator('.app-main [aria-label]').first().click().catch(()=>{}); await p.waitForTimeout(150); await nav(2) }
 await nav(3); for (const q of ['أنشطة في مسقط', 'أشياء أسويها في مسقط', 'حوّل نقاطي إلى أميال', 'كم علي', 'وين راحت فلوسي', 'فقدت بطاقتي', 'ذكرني لما تنزل أسعار الرحلات إلى لندن', 'أبي أكلم موظف']) { await say(q); await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
 await nav(4); await full('ar-wallet'); await nav(5); await full('ar-me');
 const m = await p.evaluate(() => [...(window.__missing || [])]); console.log('MISSING', m.length, JSON.stringify(m.slice(0, 40)));
 const eng = await p.evaluate(() => { const out = new Set(); const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const t = n.textContent.trim(); if (/[a-z]{4,}/i.test(t) && !/[؀-ۿ]/.test(t) && t.length > 3) out.add(t.slice(0, 50)) } return [...out].slice(0, 80) }); console.log('ENGLISH TEXT NODES', JSON.stringify(eng));
}
