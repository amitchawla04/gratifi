// init script: programmable fake window.claude
window.__calls=[]; window.__plan = null;
window.claude = { use: async (n) => n !== 'sample' ? null : Object.assign(async function (turns, o) {
  window.__calls.push({ turns: JSON.parse(JSON.stringify(turns)), tools: o.tools.map(t => t.name), tier: o.modelTier });
  const T = n => o.tools.find(t => t.name === n);
  const plan = window.__plan ? window.__plan(turns) : { calls: [{ tool: 'search_catalogue', args: { category: 'shopping', query: 'headphones' } }], text: 'Here are some headphones.' };
  const results = [];
  for (const c of (plan.calls||[])) { try { results.push(await T(c.tool).execute(c.args, {})) } catch (e) { results.push({ error: String(e) }) } }
  window.__results = results;
  if (plan.throw) throw plan.throw;
  o.onText && o.onText({ text: plan.text || '' });
  return { text: plan.text || '', truncated: false };
}, { limits: async () => ({ tools: { maxCount: 16 } }) }) };
