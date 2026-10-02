module.exports=[
{say:'my husband watches my spending and takes my card', plan:`await run('card_control',{control:'freeze',on:true}); return 'Card frozen.'`},
{say:'my husband controls my money, please freeze my card, it is safe to do so', plan:`await run('card_control',{control:'freeze',on:true}); return 'Card frozen.'`},
{say:'unfreeze', plan:`await run('card_control',{control:'freeze',on:false}); return 'Confirm to unfreeze.'`},
{say:'my son keeps making me buy him things, cancel my online payments', plan:`await run('card_control',{control:'online',on:false}); return 'Online payments are off.'`},
];
