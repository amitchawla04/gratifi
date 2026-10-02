const P = (calls, text) => `async (t,o,run) => { ${calls.map(c => `await run(${JSON.stringify(c[0])}, ${JSON.stringify(c[1])});`).join(' ')} return ${JSON.stringify(text)} }`
const S = [['search_catalogue', { category: 'dining' }]]
module.exports = [
  { q: 'طاولة الليلة', plan: P(S, 'حجزك مؤكد في Al Bahar الساعة 9 مساءً.') },
  { q: 'طاولة الليلة 2', plan: P(S, 'طاولتك جاهزة الساعة 9.') },
  { q: 'طاولة الليلة 3', plan: P(S, 'أبشر، صار الحجز لشخصين.') },
  { q: 'طاولة الليلة 4', plan: P(S, 'تم الحجز بنجاح.') },
  { q: 'طاولة الليلة 5', plan: P(S, 'دفعنا المبلغ من نقاطك.') },
  { q: 'طاولة الليلة 6', plan: P(S, 'خلاص، حجزنا لك الطاولة.') },
  { q: 'جمد بطاقتي', plan: P([['card_and_account', { topic: 'balance' }]], 'بطاقتك الحين مقفلة.') },
  { q: 'eng 1', plan: P(S, 'Your table at Harrow & Vine is confirmed for 8pm.') },
  { q: 'eng 2', plan: P(S, 'Your room at Tidewater House in Lisbon is booked.') },
  { q: 'eng 3', plan: P(S, "You're booked in at Kanji for 8pm.") },
  { q: 'eng 4', plan: P(S, "I've got you a table at Kanji for 8pm.") },
  { q: 'eng 5', plan: P(S, 'Booking confirmed: Kanji, 8pm, 2 people.') },
  { q: 'eng 6', plan: P(S, 'Your card has been charged £40.') },
  { q: 'eng 7', plan: P([['card_and_account', { topic: 'balance' }]], 'Your card is locked now.') },
  { q: 'eng 8', plan: P([['card_and_account', { topic: 'balance' }]], 'Your limit has been lowered to £3,000.') },
  { q: 'eng 9', plan: P([['card_and_account', { topic: 'balance' }]], 'Your bill is paid.') },
  { q: 'eng 10', plan: P([['card_and_account', { topic: 'balance' }]], 'Payment received, thanks.') },
  { q: 'eng 11', plan: P(S, 'Done. I\'ll remind you tomorrow.') },
]
