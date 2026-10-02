module.exports=[
{say:'cheapest direct return to Barcelona', plan:`const r=await run('search_flights',{destination:'Barcelona',direct_only:true,depart_date:'2026-10-02',return_date:'2026-10-04'}); return 'Here are direct flights.'`},
{say:'kids', plan:`const r=await run('search_flights',{destination:'Paris',travellers:2,children:2,depart_date:'2026-10-09',return_date:'2026-10-11'}); return 'OK.'`},
{say:'infants 3 with 1 adult', plan:`const r=await run('search_flights',{destination:'Paris',travellers:1,infants:3,depart_date:'2026-10-09'}); return 'OK.'`},
{say:'return before depart', plan:`const r=await run('search_flights',{destination:'Paris',travellers:1,depart_date:'2026-10-09',return_date:'2026-10-05'}); return 'OK.'`},
{say:'past date', plan:`const r=await run('search_flights',{destination:'Paris',depart_date:'2026-09-01'}); return 'OK.'`},
{say:'far future', plan:`const r=await run('search_flights',{destination:'Paris',depart_date:'2028-01-01'}); return 'OK.'`},
{say:'10 travellers', plan:`const r=await run('search_flights',{destination:'Paris',travellers:12,depart_date:'2026-10-09'}); return 'OK.'`},
{say:'0 adults 2 children', plan:`const r=await run('search_flights',{destination:'Paris',travellers:2,children:2,depart_date:'2026-10-09'}); return 'OK.'`},
];
