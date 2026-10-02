const pc = (args, txt='Checkout is ready; confirm with the button.') => `async(t,o,run)=>{ await run('prepare_checkout',${JSON.stringify(args)}); return ${JSON.stringify(txt)} }`;
module.exports = [
  { say: 'cinema 3 tickets', plan: pc({ id: 'ET-4', quantity: 3, date: '2026-10-03' }), dump: 1 },
  { say: 'pay', click: /^Pay / }, { confirm: 1 },
  { say: 'x', js: "(()=>{const s=JSON.parse(localStorage.getItem('gratifi-state-v3-UK'));return [s.card.balance,s.balance,s.bookings.map(b=>[b.title,b.total,b.pts,b.card,b.sub])]})()" },
  { say: 'lounge for 4', plan: pc({ id: 'AP-1', quantity: 4 }), dump: 1 },
  { click: /^Pay / }, { confirm: 1 },
  { js: "(()=>{const s=JSON.parse(localStorage.getItem('gratifi-state-v3-UK'));return [s.card.balance,s.balance,s.loungeLeft,s.bookings.map(b=>[b.title,b.total,b.pts,b.card,b.sub])]})()" },
  { say: 'another lounge for 2', plan: pc({ id: 'AP-1', quantity: 2 }), dump: 1 },
];
