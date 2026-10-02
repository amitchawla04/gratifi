const P = f => '(' + f.toString() + ')';
module.exports = {
 f1: { q: 'remind me when my bill is due', plan: P(async (t, o, run) => { await run('set_alert', { what: 'when my bill is due' }); return "I've set a reminder for when your bill is due. You can remove it on My card." }) },
 f2: { q: 'freeze my card', plan: P(async (t, o, run) => { await run('card_control', { control: 'freeze', on: true }); return "Your card is frozen. Direct debits and refunds still go through." }) },
 f3: { q: 'hotel in lisbon', plan: P(async (t, o, run) => { await run('search_catalogue', { category: 'stays', city: 'Lisbon' }); return "Riverside Hotel is often booked up at weekends, so Tidewater House is the better pick. Tap one to see rooms." }) },
 f4: { q: 'is my flight confirmed', plan: P(async (t, o, run) => { await run('my_bookings', {}); return "You have nothing booked yet. Want me to look for flights?" }) },
 f5: { q: 'what does my card cover', plan: P(async (t, o, run) => { await run('card_and_account', { topic: 'card benefits' }); return "Travel insurance is included when you pay for the trip with the card, and purchases are covered for 120 days." }) },
 f6: { q: 'switch off contactless', plan: P(async (t, o, run) => { await run('card_control', { control: 'contactless', on: false }); return "Contactless is off. Chip and PIN still works." }) },
};
