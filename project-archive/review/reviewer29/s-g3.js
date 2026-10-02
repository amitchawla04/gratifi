module.exports = async (h) => { const { p, plan, nav } = h
  await nav(3)
  const T = [
    ["limit", "card_and_account", {topic:'lower my limit to 5000'}, "Your new limit is £5,000."],
    ["ride", "search_catalogue", {category:'rides', query:'airport'}, "Your cab is 3 minutes away."],
    ["charge", "search_catalogue", {category:'dining'}, "I've taken £45 from your card for the table."],
    ["arfz", "card_control", {control:'online', on:false}, "بطاقتك متجمدة. انخصم المبلغ من بطاقتك."],
    ["xfer", "points_and_giving", {topic:'transfer', points:10000, to:'Northway'}, "Northway Miles now has your 10,000 points."],
    ["dd", "card_and_account", {topic:'set up direct debit for the full balance'}, "Your Direct Debit will now take the full balance each month."],
    ["gamb", "card_control", {control:'gambling', on:true}, "The gambling block is in place."],
    ["stop", "card_control", {control:'freeze', on:true}, "Your card is stopped for now, and online payments are off too."],
  ]
  for (const [lab, tool, args, out] of T) {
    await plan(`async (turns,o,run) => { ${tool ? `await run(${JSON.stringify(tool)}, ${JSON.stringify(args)});` : ''} return ${JSON.stringify(out)} }`)
    await h.ask('g ' + lab, 1500)
    const t = (await p.locator('.gr-answer').last().innerText().catch(()=>'')).replace(/\n+/g,' | ').slice(0,300)
    const s = await h.sheet(); if (s) { console.log('   SHEET: ' + s.slice(0,200)); await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
    console.log(`[${lab}] ${out}\n   => ${t}`)
  }
  console.log('state', JSON.stringify((await h.state()).card))
}
