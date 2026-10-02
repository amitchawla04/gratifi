(() => {
  const s = async function (turns, o) {
    window.__calls = window.__calls || []; window.__calls.push({ turns, tools: o.tools.map(t => t.name), tier: o.modelTier });
    const T = n => o.tools.find(t => t.name === n); const res = [];
    const run = async (n, a) => { const t = T(n); if (!t) { res.push(n + ': NO TOOL'); return } try { const r = await t.execute(a, {}); res.push({ n, a, r }); return r } catch (e) { res.push(n + ' THREW ' + e.message) } };
    window.__res = res;
    const plan = window.__plan || (async () => 'no plan');
    const text = await plan(turns, o, run);
    if (o.onText) o.onText({ text: text || '', delta: text || '' });
    return { text: text || '', truncated: false };
  };
  const c = { use: async n => n !== 'sample' ? null : Object.assign(s, { limits: async () => ({ maxInputBytes: 65536, tools: { maxCount: 16 } }), json: async (input, jo) => ((window.__json = window.__json || []).push(String(input).slice(-400)), window.__safetyResp ? (await new Promise(r => setTimeout(r, window.__safetyDelay || 50)), window.__safetyResp) : ({})) }) };
  Object.defineProperty(window, 'claude', { get: () => c, set: () => {}, configurable: false });
})();
