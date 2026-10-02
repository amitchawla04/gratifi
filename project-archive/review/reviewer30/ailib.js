module.exports = (H) => async (msg, planSrc, o = {}) => { const { p } = H;
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(150);
  await p.evaluate(([s, sr, sd]) => { window.__plan = eval(s); window.__safetyResp = sr; window.__safetyDelay = sd; window.__res = [] }, [planSrc || "async()=>''", o.safety || null, o.delay || 50]);
  const st0 = (await H.state()) || {};
  await H.ask(msg, o.wait || 1500); await p.waitForTimeout(o.extra || 300);
  const st1 = (await H.state()) || {}; const txt = await H.last(); const sh = await H.sheet(); const res = await H.res();
  const d = []; if (st0?.balance !== st1?.balance) d.push(`pts ${st0.balance}->${st1.balance}`); if (st0.card?.balance !== st1.card?.balance) d.push(`card ${st0.card?.balance}->${st1.card?.balance}`); if (st0.card?.frozen !== st1.card?.frozen) d.push('frozen->' + st1.card?.frozen); if ((st0.bookings||[]).length !== (st1.bookings||[]).length) d.push('bookings ' + (st0.bookings||[]).length + '->' + (st1.bookings||[]).length);
  console.log(`\n### [${msg}]${o.safety ? ' safety=' + JSON.stringify(o.safety) : ''}\n  TEXT: ${txt.slice(0, o.len || 600)}\n  SHEET: ${sh ? sh.slice(0, 300) : '-'}\n  DIFF: ${d.join('; ') || 'none'}\n  RES: ${JSON.stringify(res.map(r => typeof r === 'string' ? r : { n: r.n, a: r.a, shown: r.r?.shown_to_customer, note: r.r?.note })).slice(0, o.rlen || 700)}`);
  if (o.shot) await H.full(o.shot);
  return { txt, sh, res, st0, st1 } }
