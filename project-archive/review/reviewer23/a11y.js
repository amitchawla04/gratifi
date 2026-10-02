const H = require('./h.js')
const m = process.argv[2] || 'UK'
H.run(async (h) => {
  const { p, ask, click, full, shot, confirm, log, nav } = h
  const audit = async (tag) => { const r = await p.evaluate(() => { const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden' }; const name = e => (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || (e.getAttribute('aria-labelledby') && document.getElementById(e.getAttribute('aria-labelledby'))?.innerText) || '').trim(); const out = { noName: [], inputsNoLabel: [], smallTargets: [], imgNoAlt: 0, svgs: 0 }; document.querySelectorAll('button,[role=button],a,[role=switch],[role=tab],[role=radio]').forEach(e => { if (!vis(e)) return; if (!name(e)) out.noName.push(e.outerHTML.slice(0, 90)); const b = e.getBoundingClientRect(); if (b.width < 24 || b.height < 24) out.smallTargets.push((name(e) || e.className).slice(0, 30) + ` ${Math.round(b.width)}x${Math.round(b.height)}`) }); document.querySelectorAll('input,textarea,select').forEach(e => { if (!vis(e)) return; const id = e.id; const lab = e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || (id && document.querySelector(`label[for="${id}"]`)) || e.closest('label'); if (!lab) out.inputsNoLabel.push(e.outerHTML.slice(0, 100)) }); document.querySelectorAll('img').forEach(e => { if (!e.hasAttribute('alt')) out.imgNoAlt++ }); out.lang = document.documentElement.lang; out.dir = document.documentElement.dir; out.live = document.querySelectorAll('[aria-live]').length; out.h1 = document.querySelectorAll('h1').length; return out }); log(tag, JSON.stringify(r).slice(0, 1500)) }
  await audit('home'); await nav(2); await audit('explore'); await nav(3)
  await ask('Flights to Lisbon next weekend for two'); await audit('flights')
  await p.locator('.gr-flight').first().click(); await p.waitForTimeout(400); await click(/Continue with/); await audit('seats')
  { const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) { if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor') } }
  await click('Continue', { exact: true }); await click(/^Pay /)
  const f = await p.evaluate(() => ({ active: document.activeElement?.outerHTML.slice(0, 120), dialog: !!document.querySelector('[role=dialog][aria-modal=true]') || !!document.querySelector('[role=dialog]'), labelled: document.querySelector('[role=dialog]')?.getAttribute('aria-labelledby') || document.querySelector('[role=dialog]')?.getAttribute('aria-label'), inertMain: document.querySelector('.app-main')?.hasAttribute('inert') }))
  log('sheet focus', JSON.stringify(f))
  for (let i = 0; i < 8; i++) await p.keyboard.press('Tab')
  log('after tabs active', await p.evaluate(() => (document.activeElement?.closest('[role=dialog]') ? 'inside dialog: ' : 'OUTSIDE: ') + document.activeElement?.outerHTML.slice(0, 80)))
  await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  log('after esc focus', await p.evaluate(() => document.activeElement?.outerHTML.slice(0, 100)))
  await nav(4); await audit('wallet'); await nav(5); await audit('me')
}, { m, tag: 'a11y' })
