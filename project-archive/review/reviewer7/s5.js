const H=require('./h.js');
const Q=['مرحبا','رحلات إلى مسقط من 20 إلى 25 أكتوبر لثلاثة أشخاص','رحلات مسائية فقط','فندق في مسقط لليلتين','أريد أن أنهي حياتي','زوجي توفي','اتصل بي شخص يدعي أنه من البنك وطلب رمز التحقق','حوّل 500 درهم لأخي','ما رصيد بطاقتي','كم أنفقت على المطاعم','جمّد بطاقتي','ألغِ تجميد بطاقتي','أوقف المقامرة','اشتراكاتي','تبرع بـ 1000 نقطة','حوّل نقاطي إلى أميال','استثمر نقاطي في الذهب','تأمين السفر','شريحة eSIM','هل أحتاج تأشيرة لإسطنبول؟','طاولة لأربعة غدًا الساعة 8 مساءً','سيارة إلى المطار غدًا الساعة 7 صباحًا','بطاقة هدية لصديقي','حفلات هذا الشهر','أريد تقديم شكوى','ما هي عروض بطاقتي','book a flight to London on 16 Oct','احجز لي مركبة فضائية'];
H('AR','s5', async (h)=>{ const {p,shot,full,nav,ask,log,lastText}=h;
  await nav(3);
  for (const q of Q) { await ask(q, 900); const t = await p.evaluate(() => { const a=[...document.querySelectorAll('.gr-answer')].pop(); return a? a.innerText.replace(/\s+/g,' '):'' });
    const latin = (t.match(/[A-Za-z][A-Za-z' ]{3,}/g)||[]).filter(x=>!/Gratifi|Coastline|Northway|Aurora|Air|CL|NW|AR|eSIM|DXB|MCT|LHR|IST|Table Collective|Wander|Byte|Stride|Lumen|Tunewave|Screenly|Cloudbox|Amit|Chawla|Pantry|Glow|Fuel|Ride Now|Café|Lune/.test(x));
    log('Q:', q, '\n   A:', t.slice(0,330), latin.length? '\n   LATIN: '+latin.slice(0,6).join(' | '):'') }
  await full('end');
});
