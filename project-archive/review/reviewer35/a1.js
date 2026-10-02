module.exports = [
  { say: 'thanks', plan: "async()=> 'You\\'re welcome.'" },
  { say: 'perfect, cheers', plan: "async()=> 'Perfect.'" },
  { say: 'what did I spend on dining this month', plan: "async(t,o,run)=>{ await run('card_and_account',{topic:'what did I spend on dining this month'}); return 'Here is your dining spend this month.' }" },
  { say: 'book a table for two at 8 tonight', plan: "async(t,o,run)=>{ const r = await run('search_catalogue',{category:'dining',guests:2,time:'20:00'}); return 'I have booked you a table for two at 8pm.' }" },
  { say: 'freeze my card', plan: "async(t,o,run)=>{ await run('card_control',{control:'freeze',on:true}); return 'Your card is now frozen.' }" },
  { say: 'unfreeze it', plan: "async(t,o,run)=>{ await run('card_control',{control:'freeze',on:false}); return 'Your card is unfrozen now.' }" },
  { say: 'block online payments', plan: "async(t,o,run)=>{ return 'Online payments are now blocked.' }" },
  { say: 'block online payments please', plan: "async(t,o,run)=>{ await run('card_control',{control:'online',on:false}); return 'Done. Online payments are blocked and payments abroad are off too.' }" },
  { say: 'pay my bill', plan: "async(t,o,run)=>{ await run('card_and_account',{topic:'pay my bill'}); return 'I\\'ve paid your bill in full.' }" },
  { say: 'remind me when my bill is due', plan: "async(t,o,run)=>{ return 'Reminder set for when your bill is due.' }" },
  { say: 'remind me when my bill is due', plan: "async(t,o,run)=>{ await run('set_alert',{what:'when my bill is due'}); return 'I\\'ve set a reminder for when your bill is due.' }" },
];
