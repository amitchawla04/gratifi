module.exports = async (h) => { const { p } = h
  const S = [
   "Your table at Kanji is ready for 8pm.", "Kanji has you at 8pm tonight.", "You're booked in at Kanji for 8pm.", "Your seats are 16C and 16B.", "That's your flight to Lisbon sorted.",
   "Enjoy your trip to Lisbon.", "I've got that sorted for you.", "Your order is on its way.", "I've paid your bill in full.", "Your bill has been cleared.",
   "The £50 gift card went to Sam.", "Sam will get the gift card by email in a minute.", "I've blocked gambling on your card.", "Your card won't work for now.", "Your card is now locked.",
   "I've switched off online payments.", "Payments abroad are now off.", "Your limit is now £5,000.", "I've dropped your limit to £5,000.", "Your Direct Debit is set up for the full balance.",
   "I've set a reminder for when Lisbon prices drop.", "You'll be reminded when prices drop.", "Your reminder is set.", "Your points are now in your Northway account.", "10,000 points are now with Northway.",
   "I put 5,000 points into gold for you.", "5,000 points went to the charity.", "Your refund of £229 is back on your card.", "I've cancelled Screenly.", "Screenly stops on 30 Oct.",
   "Your subscription is paused.", "The driver will pick you up at 6am.", "Your driver is on the way.", "Your jacket arrives Friday.", "Your jacket will arrive on Friday.",
   "Your new card will reach you in 3 to 5 days.", "A replacement card is coming.", "Done.", "All good, it's booked.", "I've placed the order.",
   "Your groceries arrive in 15 minutes.", "The lounge visit is yours.", "Your lounge pass is ready.", "Here's your boarding pass.", "Your flight now leaves at 09:40.",
   "I've moved your return to Sunday.", "Your return is Sunday now.", "Your points balance is 38,210.", "You now have 38,210 points.", "That cost 5,000 points.",
   "تم حجز الطاولة.", "حجزت لك الطاولة الساعة 8.", "طاولتك جاهزة الساعة 8.", "بطاقتك الحين مجمدة.", "دفعت الفاتورة كاملة.", "راح يوصلك الطلب خلال 15 دقيقة.", "وصل طلبك.", "الحجز مؤكد.", "أرسلنا بطاقة الهدية لسام.", "ما عليك، رتبتها لك."
  ]
  const out = await p.evaluate(S => S.map(s => [s, window.__guard(s, { money: false, frozen: false, listing: false, card: true })]), S)
  for (const [a, b] of out) console.log((a === b ? 'PASS-THROUGH ' : 'filtered     ') + a + (a === b ? '' : '  =>  ' + b))
}
