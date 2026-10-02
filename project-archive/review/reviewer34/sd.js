const P = f => '(' + f.toString() + ')';
const T = (q, topic) => ({ q, plan: P(new Function('return async (t,o,run)=>{ await run("card_and_account",{topic:' + JSON.stringify(topic) + '}); return "Here you go." }')()) });
module.exports = {
 d1: T('I think someone has my card details', 'someone has my card details'),
 d2: T('my card details were leaked in a data breach', 'card details leaked in a data breach'),
 d3: T('I gave my card number to a fake website', 'gave my card number to a fake website'),
 d4: T('pay the minimum', 'pay the minimum'),
 d5: T('set up direct debit for the minimum', 'set up direct debit for the minimum'),
 d6: T('change my direct debit to full balance', 'change direct debit to full balance'),
 d7: T('lift gambling block', 'lift the gambling block'),
 d8: T('what is my statement', 'statement'),
 d9: T('how much did I spend this month', 'spending this month'),
 d10: T('my card is not working abroad', 'card not working abroad'),
};
