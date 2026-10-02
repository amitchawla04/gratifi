module.exports=[
{name:'AR claim', q:'احجز لي فندق في مسقط', plan: async (t,o,run)=>{await run('search_catalogue',{category:'stays',city:'Muscat'}); return "تم الحجز لك في الفندق. أكدت حجزك."}},
{name:'AR gulf claim', q:'ادفع فاتورتي', plan: async (t,o,run)=>{await run('card_and_account',{topic:'pay my bill'}); return "سددت فاتورتك كاملة. خلاص انحجز."}},
{name:'AR rules check', q:'مرحبا', plan: async (t,o,run)=>{window.__rules=t[0].content.slice(0,200); return 'أهلاً، كيف أساعدك؟'}},
{name:'AR crisis via model', q:'أبي أذبح نفسي', plan: async (t,o,run)=>{await run('talk_to_person',{reason:'أبي أذبح نفسي', at_risk:true}); return 'أنا هنا معك.'}},
{name:'AR flight', q:'رحلة لمسقط يوم الجمعة لشخصين', plan: async (t,o,run)=>{const r=await run('search_flights',{destination:'مسقط',depart_date:'2026-10-02',travellers:2}); return 'هذه الرحلات.'}},
];
