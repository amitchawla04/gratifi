const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const DIR = __dirname
module.exports = async function setup(market = 'UK', opts = {}) {
  const b = await chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1, colorScheme: opts.dark ? 'dark' : 'light', permissions: ['clipboard-read', 'clipboard-write'] })
  const p = await ctx.newPage()
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CON ' + m.text()) })
  const file = opts.file || 'test.html'
  const url = (x = '') => `file://${DIR}/build/${file}?m=${market}${opts.theme ? '&theme=' + opts.theme : ''}${x}`
  await p.goto(url()); if (!opts.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url(opts.q || '')); await p.waitForTimeout(500)
  let n = 0; const tag = opts.tag || 'x'
  const shot = async (name, full = false) => { await p.waitForTimeout(350); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; if (full) { const el = await p.$('.app-main .app-scroll'); if (el) await el.evaluate(e => e.scrollTop = e.scrollHeight) ; await p.waitForTimeout(300) } await p.screenshot({ path: f }); return f }
  const tall = async (name) => { await p.waitForTimeout(350); const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 220) }); await p.waitForTimeout(300); const f = `shots/${tag}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f }
  const nav = async (i) => { await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) }
  const ask = async (t, w = 600) => { await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(w) }
  const btn = async (name, opt = {}) => { const l = p.getByRole('button', { name, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded(); await l.click(); await p.waitForTimeout(opt.w || 450) }
  const S = () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))))
  const last = async () => { const s = await S(); const m = s.chat[s.chat.length - 1]; return { text: m.text || '', kinds: (m.blocks || []).map(b => b.kind), blocks: m.blocks } }
  const money = async () => { const s = await S(); if (!s) return null; return { pts: s.balance, card: s.card.balance, due: s.card.due, ledger: s.ledger.length, txns: s.txns.length, book: s.bookings.map(b => b.title + ':' + b.status).join(' | ') } }
  const lastAnswer = () => p.locator('.gr-answer').last()
  const confirmSheet = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) return false; const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { await ins[0].click(); await p.keyboard.type(code) } await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => errs.push('SHEET STUCK')); await p.waitForTimeout(400); return true }
  const done = async () => { const e2 = await p.evaluate(() => window.__errs || []); if (errs.length || e2.length) console.log('ERRORS', [...errs, ...e2].join(' | ').slice(0, 1500)); await b.close() }
  return { b, ctx, p, url, shot, tall, nav, ask, btn, S, last, money, lastAnswer, confirmSheet, done, errs }
}
