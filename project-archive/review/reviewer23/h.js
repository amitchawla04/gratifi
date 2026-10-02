// Flexible harness: const H = require('./h.js'); H.run(async (h) => {...}, {m:'UK', ai:false, theme:'light', tag:'x'})
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const fs = require('fs')
const DIR = __dirname
async function run(fn, o = {}) {
  const m = o.m || 'UK', theme = o.theme || 'light', tag = o.tag || 'x'
  const b = await chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 420, height: 880 }, deviceScaleFactor: 1 })
  if (o.ai) await ctx.addInitScript({ path: DIR + '/fake.js' })
  const p = await ctx.newPage()
  const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', x => { if (x.type() === 'error') errs.push('CON ' + x.text()) })
  const url = (x = '') => `file://${DIR}/../gratifi/review/test.html?m=${m}&theme=${theme}${x}`
  await p.goto(url()); if (!o.keep) await p.evaluate(() => localStorage.clear()); await p.goto(url(o.q || '')); await p.waitForTimeout(700)
  let n = 0
  const log = (...a) => { console.log(`[${m}${o.ai ? '/ai' : ''}]`, ...a) }
  const shot = async (name) => { await p.waitForTimeout(300); const f = `shots/${tag}-${m}-${String(++n).padStart(2, '0')}-${name}.png`; await p.screenshot({ path: f }); return f }
  const full = async (name) => { await p.waitForTimeout(300); const f = `shots/${tag}-${m}-${String(++n).padStart(2, '0')}-${name}.png`; if (await p.$('.app[data-tab=chat]')) { await p.setViewportSize({ width: 420, height: 1300 }); await p.waitForTimeout(150); await p.evaluate(() => { const e = document.querySelector('.app-main .app-scroll'); e.scrollTop = e.scrollHeight }); await p.waitForTimeout(500); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f } const el = await p.$('.app-main .app-scroll'); const h = el ? await el.evaluate(e => e.scrollHeight) : 880; await p.setViewportSize({ width: 420, height: Math.min(5000, h + 200) }); await p.waitForTimeout(250); await p.screenshot({ path: f }); await p.setViewportSize({ width: 420, height: 880 }); return f }
  const nav = async (i) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.click(`.gr-nav button:nth-child(${i})`); await p.waitForTimeout(300) }
  const ask = async (t, wait = 700) => { if (await p.$('.app-sheet')) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) } await p.fill('.gr-ask input', t); await p.press('.gr-ask input', 'Enter'); await p.waitForTimeout(wait); for (let i = 0; i < 30 && await p.$('.gr-thinking, [data-thinking=true]'); i++) await p.waitForTimeout(200) }
  const click = async (text, opt = {}) => { const l = p.getByRole(opt.role || 'button', { name: text, exact: !!opt.exact }).last(); await l.scrollIntoViewIfNeeded({ timeout: 4000 }); await l.click({ timeout: 4000 }); await p.waitForTimeout(opt.wait || 400) }
  const has = async (text, opt = {}) => (await p.getByRole(opt.role || 'button', { name: text, exact: !!opt.exact }).count()) > 0
  const sheet = async () => { const s = await p.$('.app-sheet'); return s ? (await s.innerText()) : null }
  const confirm = async (code = '482193') => { await p.waitForTimeout(300); const s = await p.$('.app-sheet'); if (!s) { log('NO SHEET'); return false } const ins = await p.$$('.app-sheet input'); if (ins.length >= 6) { for (let i = 0; i < 6; i++) await ins[i].fill(code[i]) } else if (ins.length) await ins[0].fill(code); await p.locator('.app-sheet .gr-btn').last().click(); await p.waitForSelector('.app-sheet', { state: 'detached', timeout: 9000 }).catch(() => log('SHEET STUCK')); await p.waitForTimeout(400); return true }
  const st = async () => p.evaluate(() => JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))))
  const lastMsg = async () => p.evaluate(() => { const s = JSON.parse(localStorage.getItem('gratifi-state-v3-' + new URLSearchParams(location.search).get('m'))); const msg = s.chat[s.chat.length - 1]; return { text: msg.text || '', kinds: (msg.blocks || []).map(b => b.kind), steps: msg.steps } })
  const lastText = async () => p.evaluate(() => { const a = [...document.querySelectorAll('.gr-answer')].pop(); return a ? a.innerText : '' })
  const money = async () => { const s = await st(); if (!s) return null; return { pts: s.balance, bal: s.card.balance, due: s.card.due, avail: s.card.limit - s.card.balance, bookings: s.bookings.length } }
  const plan = async (src) => p.evaluate(src)
  const h = { p, b, ctx, m, shot, full, nav, ask, click, has, sheet, confirm, st, lastMsg, lastText, money, log, errs, url, plan }
  try { await fn(h) } catch (e) { log('SCRIPT ERR ' + e.message.split('\n')[0]); await shot('fail').catch(() => {}) }
  const e2 = await p.evaluate(() => window.__errs || []).catch(() => [])
  if (errs.length || e2.length) log('ERRORS: ' + [...errs, ...e2].join(' | ').slice(0, 1500))
  await b.close()
}
module.exports = { run }
