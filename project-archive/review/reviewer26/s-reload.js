module.exports = async (h) => { const { p, say, click, confirm, state, nav, sheet } = h
  await nav(3); await say('Concerts this month'); await p.locator('.gr-answer').last().locator('.gr-itemrow').first().click(); await p.waitForTimeout(400)
  await p.locator('.gr-answer').last().locator('.gr-detail .gr-btn').last().click(); await p.waitForTimeout(400); await click(/^Pay /); console.log('sheet open', !!(await sheet()))
  await p.reload(); await p.waitForTimeout(900); await nav(3); console.log('after reload sheet', await sheet()); console.log('LAST', (await h.last()).slice(0, 400))
  const pays = p.getByRole('button', { name: /^Pay / }); console.log('pay buttons', await pays.count()); if (await pays.count()) { await pays.last().click(); await p.waitForTimeout(400); console.log('sheet2', (await sheet() || '').slice(0, 200)); if (await sheet()) await confirm(); console.log('->', (await h.last()).slice(0, 300)) }
  await p.reload(); await p.waitForTimeout(900); await nav(3); const pays2 = p.getByRole('button', { name: /^Pay / }); console.log('pay buttons after pay+reload', await pays2.count(), await pays2.evaluateAll(b => b.map(x => x.disabled)))
  // stale detail: go back to earlier detail card's CTA
  const ctas = p.locator('.gr-detail .gr-btn'); console.log('detail CTAs', await ctas.count(), await ctas.evaluateAll(b => b.map(x => x.textContent + ':' + x.disabled)))
  if (await ctas.count()) { await ctas.first().click().catch(e => console.log('cta', e.message.slice(0, 50))); await p.waitForTimeout(500); console.log('stale CTA ->', (await h.last()).slice(0, 300)) }
  const s = await state(); console.log('bookings', s.bookings.map(b => b.title + ':' + b.status).join('; '))
}
