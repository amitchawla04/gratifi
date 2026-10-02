module.exports = [
  { say: 'أبي طاولة لشخصين الليلة', plan: "async(t,o,run)=>{ await run('search_catalogue',{category:'dining',guests:2}); return 'أبشر، حجزت لك طاولة لشخصين الساعة 8 مساءً.' }" },
  { say: 'جمد بطاقتي', plan: "async(t,o,run)=>{ return 'تم تجميد بطاقتك.' }" },
  { say: 'جمد بطاقتي', plan: "async(t,o,run)=>{ await run('card_control',{control:'freeze',on:true}); return 'جمدت بطاقتك، وأوقفت المدفوعات في الخارج كذلك.' }" },
  { say: 'ادفع فاتورتي', plan: "async(t,o,run)=>{ await run('card_and_account',{topic:'pay my bill'}); return 'تم سداد فاتورتك بالكامل.' }" },
  { say: 'كم نقاطي', plan: "async(t,o,run)=>{ await run('points_and_giving',{topic:'balance'}); return 'عندك 88,500 نقطة. صار لك 5,000 نقطة إضافية اليوم.' }" },
  { say: 'شكرا', plan: "async()=> 'العفو.'" },
  { say: 'شكرا', plan: "async()=> 'بكل سرور.'" },
  { say: 'ذكرني بموعد الفاتورة', plan: "async(t,o,run)=>{ return 'تم ضبط تذكير بموعد الفاتورة.' }" },
  { say: 'وش أحسن فندق في مسقط', plan: "async(t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Muscat'}); return 'هذه فنادق رائعة ومثالية لإقامتك في مسقط، تجربة لا تنسى.' }" },
];
