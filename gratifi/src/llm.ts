/* The Claude API line, shaped like the page's own Claude tool so the brain uses either one the same way.
   The server holds the key and picks the model; this side runs the tool loop, because the tools act on the
   bank data in the app. Every tool still only shows things or prepares a confirm sheet: nothing moves without the customer. */

type Tool = { name: string; description: string; inputSchema: any; execute: (a: any) => Promise<any> }
type Opts = { modelTier?: 'quick' | 'default' | 'complex'; tools?: Tool[]; signal?: AbortSignal; onText?: (x: { text: string; delta: string }) => void; system?: string; cache?: boolean }
const ENDPOINT = '/api/claude'
const MAX_ROUNDS = 6

const err = (code: string, text?: string) => Object.assign(new Error(code), { code, text })
const flat = (c: any) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map(x => (typeof x === 'string' ? x : x?.text || '')).join(' ') : String(c ?? ''))

/** Turns into the shape the API wants: text only, roles alternating, starting with the customer. */
function normalise(input: any): any[] {
  const list = typeof input === 'string' ? [{ role: 'user', content: input }] : input
  const out: any[] = []
  for (const m of list) {
    const role = m.role === 'assistant' ? 'assistant' : 'user', text = flat(m.content).trim()
    if (!text) continue
    const prev = out[out.length - 1]
    if (prev && prev.role === role && typeof prev.content === 'string') prev.content += '\n\n' + text
    else out.push({ role, content: text })
  }
  while (out.length && out[0].role !== 'user') out.shift()
  return out
}

async function call(body: any, signal?: AbortSignal) {
  let r: Response
  try { r = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal }) }
  catch (e: any) { throw err(e?.name === 'AbortError' ? 'cancelled' : 'network') }
  const j = await r.json().catch(() => ({}))
  if (r.status === 503) throw err('not_granted')
  if (r.status === 429) throw err('rate_limited')
  if (!r.ok) throw err(j?.code || 'upstream')
  return j as { content: any[]; stop_reason: string }
}

/** Is the line there, with a key set? */
export async function available(): Promise<boolean> {
  if (!/^https?:$/.test(location.protocol)) return false
  try { const r = await fetch(ENDPOINT, { method: 'GET' }); if (!r.ok) return false; const j = await r.json(); return !!j?.configured } catch (e) { return false }
}

export function makeSample() {
  const sample: any = async (input: any, opts: Opts = {}) => {
    const tier = opts.modelTier === 'quick' ? 'quick' : 'default'
    const tools = opts.tools || []
    const messages: any[] = normalise(input)
    if (!messages.length) throw err('empty_completion')
    let text = ''
    for (let round = 0; round < MAX_ROUNDS; round++) {
      if (opts.signal?.aborted) throw err('cancelled', text)
      const res = await call({ tier, system: opts.system, messages, tools: tools.map(t => ({ name: t.name, description: t.description, input_schema: t.inputSchema })) }, opts.signal).catch(e => { if (e.code === 'cancelled') e.text = text; throw e })
      const said = res.content.filter(b => b.type === 'text').map(b => b.text).join('')
      if (said) { const delta = (text ? ' ' : '') + said; text += delta; opts.onText?.({ text, delta }) }
      const uses = res.content.filter(b => b.type === 'tool_use')
      if (res.stop_reason !== 'tool_use' || !uses.length) break
      messages.push({ role: 'assistant', content: res.content.filter(b => b.type === 'text' || b.type === 'tool_use') })
      const results = []
      for (const u of uses) {
        const tool = tools.find(t => t.name === u.name)
        let out: any, isErr = false
        try { out = tool ? await tool.execute(u.input || {}) : { error: 'No such tool' }; if (!tool) isErr = true } catch (e: any) { out = { error: String(e?.message || e).slice(0, 300) }; isErr = true }
        results.push({ type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(out ?? null).slice(0, 8000), ...(isErr ? { is_error: true } : {}) })
      }
      messages.push({ role: 'user', content: results })
    }
    if (!text.trim() && !tools.length) throw err('empty_completion')
    return { text, truncated: false }
  }
  sample.json = async (input: any, opts: Opts = {}) => {
    const r = await sample(input, { ...opts, tools: [], system: 'Reply with one JSON object and nothing else.' })
    const m = String(r.text).match(/\{[\s\S]*\}/)
    if (!m) throw err('bad_json')
    return JSON.parse(m[0])
  }
  sample.limits = async () => ({ tools: { maxCount: 24 }, images: false })
  sample.__api = true
  return sample
}
