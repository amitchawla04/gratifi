module.exports = async (h) => { const { p, plan, nav, sheet, state } = h
  await nav(3)
  const txt = async () => (await p.locator('.gr-answer').last().innerText().catch(() => '')).replace(/\n+/g, ' | ')
  const C = [
    ['stays 45n', {id:'ST-Lisbon-0', nights:45}],
    ['stays past', {id:'ST-Lisbon-0', date:'2026-09-20', nights:2}],
    ['stays today', {id:'ST-Lisbon-0', date:'2026-09-30', nights:2}],
    ['stays 5 guests', {id:'ST-Lisbon-0', quantity:5, nights:2}],
    ['stays suite text', {id:'ST-Lisbon-0', option:'suite', nights:3, quantity:4}],
    ['dining 14', {id:'DN-London-0', quantity:14, option:'19:00'}],
    ['dining past time', {id:'DN-London-0', quantity:2, date:'2026-09-30', option:'07:00'}],
    ['dining 3am', {id:'DN-London-0', quantity:2, date:'2026-10-02', option:'03:00'}],
    ['jacket no size', {id:'SH-4'}],
    ['jacket size XXXL', {id:'SH-4', option:'XXXL'}],
    ['jacket size M', {id:'SH-4', option:'M'}],
    ['trainers size 44', {id:'SH-5', option:'44'}],
    ['gift no email', {id:'GC-0', option:'50', recipient:'Sam'}],
    ['gift bad email', {id:'GC-0', option:'50', recipient:'Sam', email:'sam@'}],
    ['gift odd amount', {id:'GC-0', option:'37', recipient:'Sam', email:'sam@example.com'}],
    ['gift ok', {id:'GC-0', option:'50', recipient:'Sam', email:'sam@example.com'}],
    ['cinema 3', {id:'ET-4', quantity:3}],
    ['cinema 4', {id:'ET-4', quantity:4}],
    ['cinema next wk', {id:'ET-4', quantity:2, date:'2026-10-09'}],
    ['cinema sat', {id:'ET-4', quantity:2, date:'2026-10-03'}],
    ['cinema today 10:00', {id:'ET-4', quantity:2, date:'2026-09-30', option:'10:00'}],
    ['concert 50', {id:'ET-1', quantity:50}],
    ['concert -2', {id:'ET-1', quantity:-2}],
    ['concert 1.5', {id:'ET-1', quantity:1.5}],
    ['lounge 4', {id:'AP-1', quantity:4}],
    ['lounge past', {id:'AP-1', quantity:1, date:'2026-09-01'}],
    ['ride heathrow', {id:'GT-1', destination:'Heathrow'}],
    ['ride home', {id:'GT-1', destination:'home'}],
    ['ride office from home', {id:'GT-1', destination:'office', pickup:'home'}],
    ['ride manchester', {id:'GT-1', destination:'Manchester'}],
    ['ride 25:00', {id:'GT-1', destination:'Heathrow', pickup_time:'25:00', date:'2026-10-01'}],
    ['ride past time', {id:'GT-1', destination:'Heathrow', pickup_time:'06:00', date:'2026-09-30'}],
    ['ride tmrw 07:00', {id:'GT-1', destination:'Heathrow', pickup_time:'07:00', date:'2026-10-01'}],
    ['car 4 days', {id:'GT-4', days:4}],
    ['car 7 days', {id:'GT-4', days:7}],
    ['car 30 days', {id:'GT-4', days:30}],
    ['train 3', {id:'GT-R1', quantity:3}],
    ['exp past', {id:'EX-London-0', date:'2026-09-01', quantity:2}],
    ['exp 2031', {id:'EX-London-0', date:'2031-09-01', quantity:2}],
    ['sub included', {id:'SB-2'}],
    ['bad id', {id:'XX-9'}],
  ]
  for (const [label, a] of C) {
    await plan(`async (turns,o,run) => { const r = await run('prepare_checkout', ${JSON.stringify(a)}); window.__d = r; return 'Confirm with the button.' }`)
    await h.ask('go ' + label)
    const d = await p.evaluate(() => JSON.stringify(window.__d && { s: window.__d.shown_to_customer, n: window.__d.note }))
    const t = await txt(); const sh = await sheet()
    console.log(`\n=== ${label} ${JSON.stringify(a)}\n RES ${d}\n CARD ${t.slice(0, 520)}${sh ? '\n SHEET ' + sh.slice(0,200) : ''}`)
    if (sh) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
  }
  await plan(`async (turns,o,run) => { const r = await run('groceries', {items:'5 packs of paracetamol, 3 ibuprofen and 2 milk'}); window.__d = r; return 'Basket ready.' }`)
  await h.ask('groceries meds'); console.log('\n=== groc meds', await txt())
}
