import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore, useNav, useAcct, acct, fmtInt, planFor } from '../store'
import { gbp, DUE, CONTENT, IMG, MEMBER } from '../data'
import { Header, Ic, Spark, Row } from '../ui'
import { parse, suggestions, askLive } from '../engine'
import { TxnRow, RewardsSummary } from './Home'
import { bonusText } from './Rewards'

const HANDLED = new Set<number>()

export function Ask({ q, voice }: { q?: string; voice?: boolean }) {
  const { s, d } = useStore(); const nav = useNav(); const a = useAcct()
  const route = s.stack[s.stack.length - 1]
  const chat = a.cs.chat
  const [thinking, setThinking] = useState<string[] | null>(null)
  const [text, setText] = useState(''); const [listening, setListening] = useState(false)
  const scroller = useRef<HTMLDivElement>(null); const rec = useRef<any>(null)

  const send = async (msg: string) => {
    const m = msg.trim(); if (!m) return
    setText('')
    d({ type: 'chat', msgs: [{ id: 'm' + Date.now(), role: 'me', text: m }] })
    const local = parse(m, s)
    setThinking(local.steps.length ? local.steps : ['Thinking'])
    const started = Date.now()
    const live = await askLive(m, s, chat.map(x => ({ role: x.role === 'me' ? 'user' : 'assistant', text: x.text })))
    const wait = Math.max(0, 700 + local.steps.length * 300 - (Date.now() - started))
    setTimeout(() => {
      setThinking(null)
      const intent = live?.intent || local.intent
      const params = live && live.intent !== local.intent ? undefined : local.params
      d({ type: 'chat', msgs: [{ id: 'a' + Date.now(), role: 'ai', text: live?.text || local.text, intent, steps: local.steps, params, live: !!live }] })
    }, wait)
  }
  useEffect(() => { if (q && route && !HANDLED.has(route.key)) { HANDLED.add(route.key); send(q) } }, [])
  useEffect(() => { if (voice && route && !HANDLED.has(-route.key)) { HANDLED.add(-route.key); listen() } }, [])
  useEffect(() => { scroller.current?.scrollTo({ top: 1e6, behavior: 'smooth' }) }, [chat.length, thinking])
  useEffect(() => () => { try { rec.current?.abort() } catch { /* ignore */ } }, [])

  function listen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { nav.toast('Voice needs a browser with speech recognition, such as Safari or Chrome. Type instead for now.'); return }
    if (listening) { rec.current?.stop(); return }
    const r = new SR(); rec.current = r; r.lang = 'en-GB'; r.interimResults = true; r.maxAlternatives = 1
    let final = ''
    r.onresult = (e: any) => { let t = ''; for (let i = 0; i < e.results.length; i++) { t += e.results[i][0].transcript; if (e.results[i].isFinal) final = t } setText(t) }
    r.onend = () => { setListening(false); if (final) send(final) }
    r.onerror = () => { setListening(false); nav.toast('I didn’t catch that. Try again, or type it.') }
    setListening(true); r.start()
  }

  return <div className="screen">
    <div className="scroll" ref={scroller}>
      <div className="pad" style={{ gap: 16 }}>
        <Header title="Gratifi" right={<button className="rbtn" aria-label="Start a new conversation" onClick={() => d({ type: 'clearChat' })}><Ic n="refresh" s={18} /></button>} />
        {chat.length === 0 && !thinking && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
          <img src={IMG.appIcon} alt="" style={{ width: 52, height: 52, borderRadius: 14 }} />
          <h1 className="h1">What can I help with, {MEMBER.first}?</h1>
          <p className="sub">Ask me about your {a.c.short} payments, benefits, rewards or offers. I won’t spend anything without asking you.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>{suggestions(s).map(x => <button key={x} className="chip" onClick={() => send(x)}>{x}</button>)}</div>
        </motion.div>}
        {chat.map(m => m.role === 'me'
          ? <motion.p key={m.id} className="bubble-me" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{m.text}</motion.p>
          : <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {m.steps && m.steps.length > 0 && <p className="step"><Ic n="tick" s={14} c="#FF6A1F" w={3} />{m.steps.join(' · ')}</p>}
            <p className="bubble-ai">{m.text}</p>
            <Result intent={m.intent!} params={m.params} send={send} />
          </motion.div>)}
        <AnimatePresence>{thinking && <motion.div key="t" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-live="polite">
          {thinking.map((x, i) => <motion.p key={x} className="step" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }}>
            <motion.span className="thinking-dot" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }} />{x}…</motion.p>)}
        </motion.div>}</AnimatePresence>
      </div>
      <div className="space-ask" />
    </div>
    <div className="composer-fade" />
    <form className="composer" onSubmit={e => { e.preventDefault(); send(text) }}>
      <Spark />
      <input aria-label="Ask Gratifi" placeholder={listening ? 'Listening…' : chat.length ? 'Reply or ask anything' : 'Ask or book anything'} value={text} onChange={e => setText(e.target.value)} enterKeyHint="send" />
      <button type="button" className={'mic' + (listening ? ' live' : '')} aria-label={listening ? 'Stop listening' : 'Speak instead'} aria-pressed={listening} onClick={listen}><Ic n="mic" c={listening ? '#C2410C' : '#0E1A2B'} /></button>
      <button type="submit" className="send" aria-label="Send" disabled={!text.trim()}><Ic n="up" s={18} c="#fff" w={2.4} /></button>
    </form>
  </div>
}

function Go({ label, onClick, light }: { label: string; onClick: () => void; light?: boolean }) {
  return <button className={'btn sm' + (light ? ' light' : '')} style={{ alignSelf: 'flex-start' }} onClick={onClick}>{label}<Ic n="chev" s={14} c={light ? '#0E1A2B' : '#fff'} w={2.4} /></button>
}
function Items({ cat }: { cat: string }) {
  const nav = useNav(); const a = useAcct(); const list = CONTENT.filter(i => i.cat === cat && !!i.biz === !!a.c.business).slice(0, 3)
  return <>{list.map(i => <button key={i.id} className="card" style={{ borderRadius: 20, padding: 10, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }} onClick={() => nav.push('item', { id: i.id })}>
    <img src={i.img} alt="" style={{ width: 60, height: 60, objectFit: 'cover', objectPosition: i.pos || 'center', borderRadius: 12 }} />
    <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{i.title}</p><p className="small">{i.sub}</p><p style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{i.price ? gbp(i.price, 0) : 'Free to book'} · <span className="gtag">{bonusText(a.c, i)}</span></p></div>
    <Ic n="chev" s={16} c="#8A94A3" /></button>)}</>
}

function Result({ intent, params, send }: { intent: string; params?: any; send: (q: string) => void }) {
  const { s, d } = useStore(); const nav = useNav(); const a = acct(s); const { c, cs } = a
  switch (intent) {
    case 'balance': return <><div className="list"><div className="kv"><span>Balance</span><span className="num">{gbp(a.balance)}</span></div><div className="kv"><span>Available</span><span className="num">{gbp(a.available)}</span></div><div className="kv"><span>Limit</span><span className="num">{gbp(a.limit, 0)}</span></div></div><Go light label="See spending" onClick={() => nav.home('spend')} /></>
    case 'due': if (c.charge) return <><div className="list"><div className="kv"><span>Due in full</span><span className="num">{gbp(a.stmtLeft)}</span></div><div className="kv"><span>Due</span><span>{DUE}</span></div></div>{a.stmtLeft > 0 && <Go label="Make a payment" onClick={() => nav.push('pay')} />}</>
      return <><div className="list"><div className="kv"><span>Minimum</span><span className="num">{gbp(a.minLeft)}</span></div><div className="kv"><span>Statement balance</span><span className="num">{gbp(a.stmtLeft)}</span></div><div className="kv"><span>Due</span><span>{DUE}</span></div></div>{(a.minLeft > 0 || a.stmtLeft > 0) && <Go label="Make a payment" onClick={() => nav.push('pay')} />}</>
    case 'pay': return <Go label="Make a payment" onClick={() => nav.push('pay')} />
    case 'dd': return <Go label={cs.dd ? 'Change Direct Debit' : 'Set up a Direct Debit'} onClick={() => nav.push('dd')} />
    case 'statement': return <div className="list"><Row ic="doc" t="September 2026" s={`Fri 18 Sep · ${gbp(c.stmt)}`} onClick={() => nav.push('statement', { which: 0 })} /><Row ic="doc" t="All statements" onClick={() => nav.push('statements')} /></div>
    case 'spend': { const list = a.purchases(a.txns).filter(t => !params?.cat || t.cat === params.cat || (params.cat === 'Eating out' && t.cat === 'Client meals')).slice(0, 4)
      return <>{list.length > 0 && <div className="list">{list.map(t => <TxnRow key={t.id} t={t} earn={a.earnOn(t)} onClick={() => nav.push('txn', { id: t.id })} />)}</div>}<Go light label="See all spending" onClick={() => nav.home('spend')} /></> }
    case 'txn': { const t = a.txns.find(x => x.id === params?.id); if (!t) return <Go light label="See your payments" onClick={() => nav.home('spend')} />
      return <><div className="list"><TxnRow t={t} earn={a.earnOn(t)} onClick={() => nav.push('txn', { id: t.id })} /></div>{params?.report && <Go label="Report a problem" onClick={() => nav.push('txn', { id: t.id, report: true })} />}</> }
    case 'freeze': return cs.frozen ? <Go light label="Manage card" onClick={() => nav.home('card')} /> : <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => { d({ type: 'freeze', on: true }); nav.toast('Card frozen. Unfreeze it whenever you’re ready.') }}><Ic n="snow" s={16} c="#fff" />Freeze card</button>
    case 'unfreeze': return cs.frozen ? <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => { d({ type: 'freeze', on: false }); nav.toast('Card unfrozen. You can pay again.') }}>Unfreeze card</button> : null
    case 'lost': return params?.activate ? <Go label="Open Card" onClick={() => nav.home('card')} /> : <Go label="Block card and get a new one" onClick={() => nav.push('lost')} />
    case 'pin': case 'details': return <Go label={intent === 'pin' ? 'View PIN' : 'Show card details'} onClick={() => nav.home('card')} />
    case 'limit': return <Go label="Change my limit" onClick={() => nav.push('limit')} />
    case 'bt': return <Go label={c.id === 'platinum' ? 'See the plan' : 'See transfer offers'} onClick={() => nav.push('bt')} />
    case 'spread': { const t = a.txns.find(x => x.id === params?.id); if (!t) return <Go light label="Instalment Plans" onClick={() => nav.push('spread')} />
      return <div className="list">{[3, 6, 12].map(m => { const p = planFor(t.amount, m); return <Row key={m} ic="split" t={`${m} months · ${gbp(p.monthly)} a month`} s={`One-off fee ${gbp(p.fee)}`} onClick={() => nav.push('spread', { id: t.id })} /> })}</div> }
    case 'cardholder': return <Go label={c.business ? 'Employee cards' : 'Add a cardholder'} onClick={() => nav.push('cardholders')} />
    case 'wallet': return c.id === 'amazon' ? <Go label="Add to Google Pay" onClick={() => nav.toast('In the live app, this opens Google Pay with your card ready to add.')} /> : <Go label="Add to Apple Wallet" onClick={() => nav.toast('In the live app, this opens Apple Wallet with your card ready to add.')} />
    case 'score': return <Go label="See my credit score" onClick={() => nav.push('score')} />
    case 'rewards': return c.reward === 'none' ? <Go label="See offers" onClick={() => nav.push('offers')} /> : <RewardsSummary />
    case 'goal': return <Go label="See progress" onClick={() => c.id === 'forward' ? nav.push('promise') : c.id === 'avios' ? nav.push('welcome') : c.id === 'avios-plus' ? nav.push('voucher') : c.id === 'select-cashback' ? nav.push('sccash') : nav.home('spend')} />
    case 'avios': return <Go label="What my Avios could do" onClick={() => nav.push('avios')} />
    case 'cashback': return a.cashback > 0 ? <Go label={`Take ${gbp(a.cashback)} now`} onClick={() => nav.push('cashback')} /> : null
    case 'fees': case 'promo': return <><div className="list"><div className="kv"><span>Purchases</span><span>{c.purchaseRate}</span></div><div className="kv"><span>Card fee</span><span>{c.fee}</span></div>{a.prog.zeroUntil && <div className="kv"><span>0% on purchases</span><span>Until {a.prog.zeroUntil}</span></div>}</div><Go light label="Rates and fees" onClick={() => nav.home('card')} /></>
    case 'abroad': return <><Go label="Using your card abroad" onClick={() => nav.push('abroad')} />{!c.business && <Items cat="Hotels" />}</>
    case 'benefits': return <><div className="list">{c.benefits.map(b => <Row key={b.t} ic={b.ic} t={b.t} s={b.s} chev={false} />)}</div><Go label="Everything with your card" onClick={() => nav.push('benefits')} /></>
    case 'offers': return <><Go label={`See all ${a.offersFor.length} offers`} onClick={() => nav.push('offers')} /></>
    case 'hotels': return <Items cat="Hotels" />
    case 'experiences': return <Items cat="Experiences" />
    case 'dining': return <Items cat="Dining" />
    case 'tickets': return <>{!c.business && <Items cat="Tickets" />}<Go light label="Barclaycard Entertainment" onClick={() => nav.push('entertainment')} /></>
    case 'gifts': return <Items cat="Gift cards" />
    case 'bookings': return cs.bookings.some(b => b.status === 'booked') ? <Go label="Your bookings" onClick={() => nav.push('bookings')} /> : <Go light label="See what’s on" onClick={() => nav.home('rewards')} />
    case 'alerts': return <Go label="Alert settings" onClick={() => nav.push('alerts')} />
    case 'help': return <Go label="Help and support" onClick={() => nav.push('help')} />
    case 'security': return <Go label="Open Security" onClick={() => nav.push('security')} />
    case 'moneyhelp': return <Go label="Get support" onClick={() => nav.push('help')} />
    case 'calc': return <Go label="Open the calculator" onClick={() => nav.push('calc')} />
    case 'duedate': return <Go label="Change my payment date" onClick={() => nav.push('duedate')} />
    case 'protection': return <><Go label={c.business ? 'Purchase protection' : 'Section 75'} onClick={() => nav.push('benefit', { id: c.business ? 'biz-purchase' : 's75' })} /><Go light label="See my payments" onClick={() => nav.home('spend')} /></>
    case 'lounge': return <Go label="Lounge passes" onClick={() => nav.push('lounge')} />
    case 'insurance': return <Go label="Policy summary" onClick={() => nav.push('insurance')} />
    case 'controls': return <Go label="Open MyControls" onClick={() => nav.push('controls')} />
    case 'cbr': return <Go label="Open Cashback Rewards" onClick={() => nav.push('cbr')} />
    case 'amazon': return <Go label="Move rewards to Amazon" onClick={() => nav.push('amazon')} />
    default: return <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>{suggestions(s).slice(0, 4).map(x => <button key={x} className="chip" onClick={() => send(x)}>{x}</button>)}</div>
  }
}
