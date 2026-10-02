// Gratifi live model endpoint (Vercel serverless function).
// The app sends the member's question plus the only facts the model may use. The model picks one intent
// from a fixed list and writes the words. Numbers, rules and actions stay with the app: every action
// still needs the member to confirm it on screen. With no ANTHROPIC_API_KEY set, this returns 503 and
// the app answers with its built-in engine instead.
const EXTRA = ['hello', 'fallback']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(503).json({ error: 'Live model not configured' })
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {}
  const { q, facts, intents, history } = body
  if (typeof q !== 'string' || !q.trim() || q.length > 500 || typeof facts !== 'string' || facts.length > 12000 || !intents || typeof intents !== 'object') return res.status(400).json({ error: 'Bad request' })
  const allowed = [...Object.keys(intents), ...EXTRA]
  const system = [
    'You are Gratifi, the assistant inside a Barclaycard app. This is a concept demo built by Reward360.',
    'Answer the member using ONLY the FACTS below. Never invent numbers, dates, prices, rates, fees, partners or policies.',
    'If the facts do not contain the answer, say you can’t see that here and offer the closest thing you can help with.',
    'Never claim you have done something (paid, frozen, booked, cancelled, changed). The app shows a button so the member can confirm it.',
    'Write in British English. One to three short sentences. Plain words, no lists, no emoji, no exclamation marks, no filler.',
    'Pick the single best intent from INTENTS. Use "hello" for greetings and "fallback" if nothing fits.',
    'Reply with JSON only, exactly: {"intent":"<intent>","text":"<reply>"}',
    '', 'INTENTS:', ...Object.entries(intents).map(([k, v]) => `- ${k}: ${v}`), '- hello: greeting', '- fallback: nothing fits',
    '', 'FACTS:', facts,
  ].join('\n')
  const past = Array.isArray(history) ? history.filter(m => m && typeof m.text === 'string').slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text.slice(0, 800) })) : []
  while (past.length && past[0].role !== 'user') past.shift()
  const messages = [...past, { role: 'user', content: q }]
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5', max_tokens: 300, temperature: 0.3, system, messages }),
    })
    if (!r.ok) return res.status(502).json({ error: 'Model error', status: r.status })
    const j = await r.json()
    const raw = (j.content || []).map(c => c.text || '').join('')
    const m = raw.match(/\{[\s\S]*\}/)
    const out = m ? safeJson(m[0]) : null
    if (!out || typeof out.text !== 'string' || !allowed.includes(out.intent)) return res.status(502).json({ error: 'Unusable reply' })
    return res.status(200).json({ intent: out.intent, text: out.text.trim().slice(0, 600) })
  } catch (e) {
    return res.status(502).json({ error: 'Model unreachable' })
  }
}
function safeJson(s) { try { return JSON.parse(s) } catch { return null } }
