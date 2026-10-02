module.exports = [
 { say: 'a guy is next to me saying I must send him money now', plan: `async (t,o,run) => { await run('talk_to_person', { reason: 'someone with the customer is demanding money', fraud: true }); return 'I am bringing in the fraud team.' }` },
 { say: 'x', plan: `async (t,o,run) => { await run('set_alert', { what: 'when my ex texts me' }); return 'ok' }` },
 { say: 'cancel my subscription to Screenly', plan: `async (t,o,run) => { await run('manage_booking', { booking_id: 'SB-1', action: 'cancel' }); return 'ok' }` },
 { say: 'what does my card cover', plan: `async (t,o,run) => { await run('card_and_account', { topic: 'card benefits' }); return 'Here is what your card covers.' }` },
 { say: 'I have been diagnosed with a terminal illness and cannot pay', plan: `async (t,o,run) => { await run('talk_to_person', { reason: 'serious illness, cannot pay' }); return 'ok' }` },
]
