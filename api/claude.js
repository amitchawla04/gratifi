/* Gratifi's line to the Claude API. The key lives only here, on the server, never in the app.
   The app asks for a tier ("quick" or "default"), not a model, so the model choice stays server-side.
   The app runs the tools itself (they act on the bank data in the app); this function only relays the model's turns.
   Set ANTHROPIC_API_KEY in the Vercel project's environment variables. */

const API = 'https://api.anthropic.com/v1/messages'
const MODELS = {
  quick: process.env.GRATIFI_MODEL_QUICK || 'claude-haiku-4-5-20251001',
  default: process.env.GRATIFI_MODEL_DEFAULT || 'claude-sonnet-5',
}
const MAX_TOKENS = { quick: 700, default: 1400 }
const LIMIT_PER_MIN = +(process.env.GRATIFI_RATE_PER_MIN || 30)
const MAX_BODY = 200 * 1024
const hits = new Map() /* best effort, per server instance */

function limited(ip) {
  const now = Date.now(), w = hits.get(ip) || []
  const recent = w.filter(t => now - t < 60000); recent.push(now); hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT_PER_MIN
}
const str = x => (typeof x === 'string' ? x : Array.isArray(x) ? x : JSON.stringify(x ?? ''))
function cleanMessages(list) {
  if (!Array.isArray(list)) return null
  const out = []
  for (const m of list.slice(-40)) {
    if (!m || !['user', 'assistant'].includes(m.role)) return null
    const content = Array.isArray(m.content) ? m.content.filter(b => b && ['text', 'tool_use', 'tool_result'].includes(b.type)) : str(m.content)
    if (Array.isArray(content) ? !content.length : !content.trim()) continue
    out.push({ role: m.role, content })
  }
  while (out.length && out[0].role !== 'user') out.shift()
  return out.length ? out : null
}
function cleanTools(list) {
  if (!Array.isArray(list)) return undefined
  return list.slice(0, 24).filter(t => t && /^[a-z_]{1,64}$/.test(t.name) && t.input_schema && typeof t.input_schema === 'object').map(t => ({ name: t.name, description: String(t.description || '').slice(0, 1500), input_schema: t.input_schema }))
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  const key = process.env.ANTHROPIC_API_KEY
  if (req.method === 'GET') return res.status(200).json({ ok: true, configured: !!key, tiers: Object.keys(MODELS) })
  if (req.method !== 'POST') return res.status(405).json({ code: 'method' })
  if (!key) return res.status(503).json({ code: 'not_configured' })

  const origin = req.headers.origin, host = req.headers['x-forwarded-host'] || req.headers.host
  if (origin && host && !origin.endsWith('//' + host)) return res.status(403).json({ code: 'origin' })
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown'
  if (limited(ip)) return res.status(429).json({ code: 'rate_limited' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch (e) { return res.status(400).json({ code: 'bad_json' }) } }
  if (!body || JSON.stringify(body).length > MAX_BODY) return res.status(413).json({ code: 'too_large' })
  const tier = body.tier === 'default' ? 'default' : 'quick'
  const messages = cleanMessages(body.messages)
  if (!messages) return res.status(400).json({ code: 'bad_messages' })
  const tools = cleanTools(body.tools)
  const system = body.system ? String(body.system).slice(0, 40000) : undefined

  const payload = {
    model: MODELS[tier],
    max_tokens: MAX_TOKENS[tier],
    messages,
    /* the stable rules and the tool list are cached, so each turn pays only for what changed */
    ...(system ? { system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }] } : {}),
    ...(tools && tools.length ? { tools: tools.map((t, i) => (i === tools.length - 1 ? { ...t, cache_control: { type: 'ephemeral' } } : t)) } : {}),
  }
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 45000)
  try {
    const r = await fetch(API, { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(payload) })
    const j = await r.json().catch(() => ({}))
    if (r.status === 429 || r.status === 529) return res.status(429).json({ code: 'rate_limited' })
    if (!r.ok) return res.status(502).json({ code: 'upstream', status: r.status, type: j?.error?.type || null })
    return res.status(200).json({ content: j.content || [], stop_reason: j.stop_reason, usage: j.usage ? { input: j.usage.input_tokens, output: j.usage.output_tokens, cached: j.usage.cache_read_input_tokens || 0 } : undefined })
  } catch (e) {
    return res.status(e && e.name === 'AbortError' ? 504 : 502).json({ code: e && e.name === 'AbortError' ? 'timeout' : 'upstream' })
  } finally { clearTimeout(timer) }
}
