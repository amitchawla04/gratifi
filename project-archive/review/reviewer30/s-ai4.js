module.exports = async (H) => { const { p, nav, click, confirm, full, state } = H; const T = require('./ailib.js')(H); await nav(3); await p.waitForTimeout(500);
 const ar = H.market === 'AR';
 if (!ar) {
 await T('slop', `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon'}); return "Absolutely! Great question. Here are some amazing hotels — perfect for your journey. Your payment is completely safe and secure. I hope this helps!" }`, { len: 300 });
 await T('slop2', `async ()=> "Certainly. Tidewater House is a stunning, hand-picked gem with breathtaking views; don't miss out. Let me know if there's anything else I can help with."`, { len: 300 });
 await T('slop3', `async ()=> "**Here are your options:**\\n- Option one\\n- Option two\\n\\nI've got you covered 😊"`, { len: 300 });
 // full AI flight path
 const r = await T('flights to lisbon 9 oct back 11 oct for 2', `async (t,o,run)=>{ const x = await run('search_flights',{destination:'Lisbon',depart_date:'2026-10-09',return_date:'2026-10-11',travellers:2}); window.__fid = x.data?.options?.[1]?.id || JSON.stringify(x.data).slice(0,200); return 'The 20:30 is the cheapest direct.' }`, { len: 200 });
 const fid = await p.evaluate(() => window.__fid); console.log('FID', fid);
 await T('the second one', `async (t,o,run)=>{ await run('choose_flight',{flight_id:${JSON.stringify(fid)}}); return 'Pick a fare.' }`, { len: 400, shot: 'ai-fares' });
 // continue via UI
 await click(/Continue with/); const ins = p.locator('.gr-answer').last().locator('input.app-in'); for (let i = 0; i < await ins.count(); i++) if (!(await ins.nth(i).inputValue())) await ins.nth(i).fill('Sam Taylor'); await click('Continue', { exact: true }); await click(/^Pay /); await confirm();
 const s = await state(); const fb = s.bookings.find(b => b.cat === 'flights'); console.log('BOOKED', fb && fb.id, fb && fb.ref, fb && fb.title, fb && fb.when);
 await T('what have i booked', `async (t,o,run)=>{ await run('my_bookings',{}); return 'You have a flight to Lisbon booked for Friday.' }`, { len: 300 });
 await T('move my return to the 12th', `async (t,o,run)=>{ await run('manage_booking',{booking_id:${JSON.stringify(fb && fb.id)},action:'change date',leg:'return'}); return 'Pick a new date for your return.' }`, { len: 600, shot: 'ai-change' });
 await T('change my seat', `async (t,o,run)=>{ await run('manage_booking',{booking_id:${JSON.stringify(fb && fb.id)},action:'change seat'}); return 'Your seat is changed to 12A.' }`, { len: 300 });
 await T('and a hotel there', `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Lisbon'}); return 'Here are hotels for your trip.' }`, { len: 400 });
 await T('cancel my flight', `async (t,o,run)=>{ await run('manage_booking',{booking_id:${JSON.stringify(fb && fb.id)},action:'cancel'}); return 'I have cancelled your flight and refunded you.' }`, { len: 700, shot: 'ai-cancel' });
 await T('pay my bill', `async (t,o,run)=>{ await run('card_and_account',{topic:'pay the minimum'}); return 'Your bill is paid.' }`, { len: 400 });
 console.log('SHEET', await H.sheet()); await p.keyboard.press('Escape');
 await T('lower my limit to 2000', `async (t,o,run)=>{ await run('card_and_account',{topic:'lower my credit limit to 2000'}); return 'Done, your limit is now £2,000.' }`, { len: 400 });
 console.log('SHEET', await H.sheet()); await p.keyboard.press('Escape');
 await T('invest 5000 in gold', `async (t,o,run)=>{ await run('points_and_giving',{topic:'invest',points:5000,to:'gold'}); return 'Tick the box and confirm.' }`, { len: 400 });
 await T('send 3000 points to northway', `async (t,o,run)=>{ await run('points_and_giving',{topic:'transfer',points:3000,to:'Northway'}); return 'Confirm the transfer.' }`, { len: 400 });
 console.log('SHEET', await H.sheet()); await p.keyboard.press('Escape');
 await T('unfreeze my card', `async (t,o,run)=>{ await run('card_control',{control:'freeze',on:false}); return 'Your card is unfrozen.' }`, { len: 300 });
 await T('lift gambling block', `async (t,o,run)=>{ await run('card_control',{control:'gambling',on:false}); return 'The block is lifted.' }`, { len: 300 });
 console.log('SHEET', await H.sheet()); await p.keyboard.press('Escape');
 } else {
 await T('ar slop', `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Muscat'}); return "بالتأكيد! يسعدني مساعدتك. إليك فنادق رائعة ومذهلة — مثالية لرحلتك. آمل أن يساعدك هذا!" }`, { len: 300 });
 await T('ar claim', `async ()=> "تمام، دفعت لك الفاتورة كاملة."`, { len: 300 });
 await T('ar claim2', `async ()=> "حجزتها لك يا الغالي، الرحلة مؤكدة."`, { len: 300 });
 await T('ar claim3', `async ()=> "Your flight is booked."`, { len: 300 });
 await T('ar safety', `async (t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Muscat'}); return 'فنادق' }`, { len: 400, safety: { risk: 'suicide', who: 'self' }, delay: 300 });
 await T('ar english reply', `async ()=> "Here are your options."`, { len: 300 });
 }
}
