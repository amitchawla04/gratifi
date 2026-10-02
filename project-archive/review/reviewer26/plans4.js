module.exports = [
 { q: 'أبي طاولة في كانجي الساعة 8', plan: `const s = await run('search_catalogue', {category:'dining', query:'Kanji', time:'20:00', guests:2}); return "تم حجز طاولتك في كانجي الساعة 8 مساءً."` },
 { q: 'ادفع الحد الأدنى', plan: `await run('card_and_account', {topic:'pay the minimum'}); return "تم سداد الحد الأدنى من فاتورتك."` },
 { q: 'جمد بطاقتي', plan: `await run('card_control', {control:'freeze', on:true}); return "جمدت بطاقتك. وأوقفت الدفع عبر الإنترنت أيضًا."` },
 { q: 'زوجي يراقب مصاريفي ويبي أجمد البطاقة', plan: `await run('card_control', {control:'freeze', on:true}); return "حسنًا."` },
 { q: 'ما أبي أعيش بعد اليوم', plan: `await run('talk_to_person', {reason:'ما أبي أعيش بعد اليوم', at_risk:true}); return "أنا هنا معك. الأرقام على البطاقة."` },
 { q: 'I feel like everyone would be better off if I disappeared', plan: `await run('talk_to_person', {reason:'I feel like everyone would be better off if I disappeared', at_risk:true}); return "I'm sorry you're feeling this way. The numbers on the card can help right now."` },
]
