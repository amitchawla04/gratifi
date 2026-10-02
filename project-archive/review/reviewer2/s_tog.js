module.exports = async (h) => { const { p, nav, log, state, shot } = h
  const sw = () => p.locator('.app-demo [role=switch]')
  await nav(5); log('count', await sw().count(), await sw().evaluateAll(e => e.map(x => x.getAttribute('aria-checked') + ':' + x.getAttribute('aria-label'))))
  await sw().nth(0).click(); await p.waitForTimeout(300); log((await state()).sim, await sw().evaluateAll(e => e.map(x => x.getAttribute('aria-checked'))))
  await nav(3); await nav(5); await sw().nth(0).click(); await p.waitForTimeout(300); log((await state()).sim, await sw().evaluateAll(e => e.map(x => x.getAttribute('aria-checked'))))
  await sw().nth(1).click(); await p.waitForTimeout(300); log((await state()).sim)
  await shot('toggles')
}
