module.exports = async (h) => { const { p, plan, nav, say } = h
  await nav(3)
  const T = [
    ["show hotels", "search_catalogue", {category:'stays', city:'Lisbon'}, "I've booked Tidewater House for you. It is a great choice!"],
    ["freeze", null, null, "Your card is now frozen."],
    ["pay bill", "card_and_account", {topic:'pay my bill'}, "Paid. Your balance is now zero."],
    ["table", "search_catalogue", {category:'dining'}, "Your table's confirmed for 8pm."],
    ["transfer", "points_and_giving", {topic:'transfer'}, "10,000 points have gone to Northway Miles."],
    ["gamble", "card_control", {control:'gambling', on:true}, "Gambling block is on, and online payments are off now."],
    ["limit", "card_and_account", {topic:'lower my limit to 5000'}, "Your limit is now £5,000."],
    ["ar", "search_catalogue", {category:'stays', city:'Lisbon'}, "تم حجز الفندق لك. أبشر، خلاص."],
    ["ar2", null, null, "حجزت لك طاولة الساعة 8."],
    ["alert", null, null, "I've set a reminder for when prices drop."],
    ["slop", null, null, "Absolutely! I'd be happy to help — here's a seamless, curated journey to unlock your perfect trip. Your payment is safe and secure."],
    ["ok", null, null, "Tap Pay to confirm, and the hotel will be booked once you confirm."],
    ["ride", "prepare_checkout", {id:'GT-1', destination:'Heathrow'}, "Your driver is on the way."],
    ["sent", null, null, "I've sent the gift card to Sam."],
    ["limitq", null, null, "Your credit limit is £8,000 and your balance is £906.98."],
  ]
  for (const [lab, tool, args, out] of T) {
    await plan(`async (turns,o,run) => { ${tool ? `await run(${JSON.stringify(tool)}, ${JSON.stringify(args)});` : ''} return ${JSON.stringify(out)} }`)
    await h.ask('g ' + lab, 900)
    const t = (await p.locator('.gr-answer').last().locator('.gr-say, p').first().innerText().catch(()=>'')).replace(/\n/g,' ')
    const s = await h.sheet(); if (s) { await p.keyboard.press('Escape'); await p.waitForTimeout(200) }
    console.log(`[${lab}] ${out}\n   => ${t}`)
  }
  console.log('state', JSON.stringify((await h.state()).card))
}
