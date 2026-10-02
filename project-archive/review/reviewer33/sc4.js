const P = f => '(' + f.toString() + ')';
const S = { dom: 1 };
module.exports = {
 c11: { ...S, q: 'hotel', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'ST-Lisbon-0', date: '2026-10-20', nights: 3, quantity: 5, option: 'Suite' }); return 'x' }) },
 c14: { ...S, q: 'cinema', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'ET-4', quantity: 3, option: '19:15' }); return 'x' }) },
 c22: { ...S, q: 'lounge', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'AP-1', quantity: 5 }); return 'x' }) },
 c31: { ...S, q: 'train', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-R1', option: '07:15', quantity: 2, date: '2026-10-01' }); return 'x' }) },
 c18: { ...S, q: 'ride', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-1', destination: 'airport', date: '2026-10-02', pickup_time: '06:00', pickup: 'home' }); return 'x' }) },
 c35: { ...S, q: 'ride', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-1', destination: 'Birmingham' }); return 'x' }) },
 c36: { ...S, q: 'ride', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-1', destination: 'Soho' }); return 'x' }) },
 c37: { ...S, q: 'ride', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-1', destination: 'office', pickup: 'home' }); return 'x' }) },
 c38: { ...S, q: 'ride', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'GT-1', destination: 'Heathrow', pickup: 'office', pickup_time: '03:00', date: '2026-10-01' }); return 'x' }) },
 c39: { ...S, q: 'sub', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'SB-2' }); return 'x' }) },
 c40: { ...S, q: 'meet', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'AP-3', quantity: 4 }); return 'x' }) },
 c41: { ...S, q: 'grocery', plan: P(async (t, o, run) => { await run('groceries', { items: '5 paracetamol' }); return 'x' }) },
 c42: { ...S, q: 'theatre', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'ET-3', quantity: 2 }); return 'x' }) },
 c43: { ...S, q: 'stay', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'ST-Lisbon-0', date: '2026-10-02', nights: 2, quantity: 2 }); return 'x' }) },
 c44: { ...S, m: 'IN', q: 'lounge', plan: P(async (t, o, run) => { await run('prepare_checkout', { id: 'AP-1', quantity: 3 }); return 'x' }) },
};
