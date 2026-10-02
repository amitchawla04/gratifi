module.exports = [
  { say: 'كم نقاطي', plan: "async(t,o,run)=>{ await run('points_and_giving',{topic:'balance'}); return 'عندك 88,500 نقطة. صار لك 5,000 نقطة إضافية اليوم.' }", shot: 'mixed' },
  { say: 'أبي طاولة لشخصين الليلة', plan: "async(t,o,run)=>{ await run('search_catalogue',{category:'dining',guests:2}); return 'هذه أفضل المطاعم. أبشر، حجزت لك طاولة لشخصين الساعة 8 مساءً.' }", shot: 'mixed2' },
  { say: 'وش أحسن فندق في مسقط', plan: "async(t,o,run)=>{ await run('search_catalogue',{category:'stays',city:'Muscat'}); return 'هذه فنادق رائعة ومثالية لإقامتك في مسقط، تجربة لا تنسى.' }", shot: 'slop' },
];
