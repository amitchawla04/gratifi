module.exports = async (h) => { const { p, say, plan, nav } = h
  await nav(3)
  await plan(`async (turns,o,run) => { window.__o = {tools:o.tools.map(t=>({n:t.name,d:t.description,s:JSON.stringify(t.input_schema||t.inputSchema||t.parameters||{})})), turns: turns.map(t=>({role:t.role, c: typeof t.content==='string'?t.content:JSON.stringify(t.content)})), keys:Object.keys(o)}; return 'Hello there.' }`)
  await say('hi')
  const o = await p.evaluate(() => window.__o)
  console.log('KEYS', o.keys)
  for (const t of o.tools) console.log('\nTOOL', t.n, '::', t.d, '\n  SCHEMA', t.s.slice(0,1500))
  for (const t of o.turns) console.log('\nTURN', t.role, t.c.length, '\n', t.c)
  console.log(JSON.stringify(await p.evaluate(()=>window.__calls.map(c=>c.tier))))
}
