// init script: programmable fake Claude. window.__plan is an array of steps: {tool, args} or {say}
module.exports = () => {
  window.__plan = []; window.__results = []; window.__calls = [];
  window.claude = { use: async (n) => n !== 'sample' ? null : Object.assign(async function (turns, o) {
    window.__calls.push({ turns: JSON.parse(JSON.stringify(turns)), tools: o.tools.map(t => t.name), tier: o.modelTier });
    const steps = window.__plan.shift() || [{ say: 'OK.' }]; let text = '';
    for (const s of steps) {
      if (s.tool) { const t = o.tools.find(x => x.name === s.tool); try { const r = await t.execute(s.args, {}); window.__results.push({ tool: s.tool, r }) } catch (e) { window.__results.push({ tool: s.tool, err: String(e && e.message || e) }) } }
      if (s.say) { text = s.say; o.onText && o.onText({ text, delta: text }) }
      if (s.throw) throw s.throw;
    }
    return { text, truncated: false };
  }, { limits: async () => ({ maxInputBytes: 65536, tools: { maxCount: 16 } }) }) };
};
