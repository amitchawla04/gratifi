module.exports=[
{say:'he is making me lower my limit', safety:{risk:'coercion',who:'self'}, delay:1500, wait:3000, plan:`await run('card_and_account',{topic:'lower my credit limit to 500'}); return 'Check the new limit, then confirm.'`},
{say:'freeze it now, my partner is watching', safety:{risk:'coercion',who:'self'}, delay:1000, wait:3000, plan:`await run('card_control',{control:'freeze',on:true}); return 'Card frozen.'`},
{say:'buy the headphones', safety:{risk:'suicide',who:'self'}, delay:4000, wait:6000, plan:`await run('prepare_checkout',{id:'SH-1'}); return 'Here is the checkout.'`},
{say:'book the lounge for me', safety:{risk:'medical',who:'other'}, delay:3500, wait:5000, plan:`await run('prepare_checkout',{id:'AP-1',quantity:1}); return 'Tap pay.'`, shot:'med'},
{say:'tell me a joke', safety:null, plan:`return 'I can help with your card, points and bookings.'`},
{say:'cancel my alert', safety:{risk:'scam',who:'self'}, delay:3000, wait:4500, plan:`await run('set_alert',{what:'when my bill is due'}); return 'Alert set.'`},
];
