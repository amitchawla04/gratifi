module.exports = async (h) => { const { p } = h
  const S = [
    "Your new limit is £5,000.", "Your limit is £5,000 now.", "The gambling block is in place.", "I've taken £45 from your card for the table.",
    "Your driver arrives in 4 minutes.", "Your cab is 3 minutes away.", "Your groceries arrive in 15 minutes.", "Enjoy your stay at Tidewater House.",
    "Northway Miles now has your 10,000 points.", "£45 has come off your card.", "You're all booked for Friday.", "Your table for two at 8pm is confirmed.",
    "Your card is stopped for now.", "Online payments are switched off.", "Your Direct Debit will now take the full balance each month.", "Direct Debit is on for the full balance.",
    "Your subscription is paused until November.", "I've cancelled Streamly for you.", "Your gift card has gone to sam@example.com.", "The hotel is expecting you on Friday.",
    "Your seats are 12A and 12B.", "You're on the 11:40 now.", "Your refund of £218 is back on your card.", "Your 5,000 points are now in gold.",
    "Your reminder for Lisbon prices is live.", "I'll let you know when prices drop.", "Your statement shows £906.98.", "Your card's locked.",
    "بطاقتك موقوفة الحين.", "بطاقتك متجمدة.", "طاولتك جاهزة الساعة 8.", "السائق جاي خلال 4 دقايق.", "حجزك في الفندق مؤكد.", "انخصم المبلغ من بطاقتك.", "وصلت النقاط إلى حسابك في نورثواي.", "الغيت اشتراكك.",
    "Payment's gone through.", "It's booked.", "That's done for you.", "Booked it.", "Ordered: milk and eggs, arriving 7:15.", "Your ride is booked for 6am tomorrow.",
  ]
  for (const s of S) { const r = await p.evaluate(s => window.__guard(s, { money: false, frozen: false, listing: false, card: true }), s); console.log((r === s ? 'PASS ' : 'CUT  ') + s + (r === s ? '' : '  => ' + r)) }
}
