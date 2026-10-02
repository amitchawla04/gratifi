const pc = (args) => `async(t,o,run)=>{ await run('prepare_checkout',${JSON.stringify(args)}); return 'Ready.' }`;
module.exports = [
  { say: 'ride to airport', plan: pc({ id: 'GT-1', destination: 'airport' }), dump: 1 },
  { say: 'ride home', plan: pc({ id: 'GT-1', destination: 'home' }), dump: 1 },
  { say: 'ride to Shoreditch', plan: pc({ id: 'GT-1', destination: 'Shoreditch' }), dump: 1 },
  { say: 'ride to Gatwick', plan: pc({ id: 'GT-1', destination: 'Gatwick Airport' }), dump: 1 },
  { say: 'ride to Oxford', plan: pc({ id: 'GT-1', destination: 'Oxford' }), dump: 1 },
  { say: 'ride to Brighton', plan: pc({ id: 'GT-1', destination: 'Brighton' }), dump: 1 },
  { say: 'larger ride home from office at 18:30 today', plan: pc({ id: 'GT-2', destination: 'home', pickup: 'office', pickup_time: '18:30', date: '2026-10-01' }), dump: 1 },
  { say: 'airport transfer', plan: pc({ id: 'GT-3' }), dump: 1 },
];
