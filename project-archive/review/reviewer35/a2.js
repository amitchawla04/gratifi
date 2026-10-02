module.exports = [
  { say: 'flights to lisbon next friday', plan: "async(t,o,run)=>{ await run('search_flights',{destination:'Lisbon',depart_date:'2026-10-09'}); return 'Here are flights to Lisbon on Friday 9 October.' }" },
  { say: 'thanks', plan: "async()=> 'You\\'re welcome.'", shot: 'thanks' },
];
