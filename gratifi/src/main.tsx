import { React, useState, useEffect, useRef } from '../../kit/src/r'
import * as K from '../../kit/src/base'
import * as T from '../../kit/src/talk'
import { MarketProvider, fmt } from '../../kit/src/market'
import * as St from './store'
import * as Br from './brain'
import * as FL from './flows'
import { ConfirmHost, InfoHost, setGoChat, setSendText } from './render'
import { Home, Explore, Chat, Wallet, Me, Offers, Alerts, Tier, Bank, Card, Tab, Nav } from './screens'
import { CardX } from './cardx'
import { ToastHost } from './design'
import { Voice } from './voice'
import { arabic, toEn } from './ar'

const W = window as any
function readLS(k: string) { try { return localStorage.getItem(k) } catch (e) { return null } }
function writeLS(k: string, v: string) { try { localStorage.setItem(k, v) } catch (e) { } }

const q = new URLSearchParams(location.search)
const startMarket = q.get('m') || readLS('gratifi-market') || 'UK'
St.boot(startMarket)
/* Where you were: the screen survives a refresh, and each screen remembers how far down you had scrolled. */
const ssGet = (k: string) => { try { return JSON.parse(sessionStorage.getItem(k) || 'null') } catch (e) { return null } }
const ssSet = (k: string, v: any) => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }
const saved = q.get('tab') ? null : ssGet('gratifi-route') as { t: Tab; c?: string } | null

function App() {
  const s = St.useS(x => x)
  const [tab, setTab] = useState<Tab>((q.get('tab') as Tab) || saved?.t || 'home')
  const [cat, setCat] = useState<string | undefined>(q.get('cat') || (saved?.t === 'explore' ? saved.c : undefined))
  const [voice, setVoice] = useState(false)
  const sysDark = W.matchMedia && W.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setThemeS] = useState(q.get('theme') || readLS('gratifi-theme') || (sysDark ? 'dark' : 'light'))
  const setTheme = (t: string) => { setThemeS(t); writeLS('gratifi-theme', t) }
  useEffect(() => { document.documentElement.dataset.theme = theme; document.querySelectorAll('meta[name=theme-color]').forEach(m => m.setAttribute('content', theme === 'dark' ? '#232326' : '#F4F4F3')) }, [theme])
  useEffect(() => { const f = fmt(s.market); document.documentElement.lang = f.locale; document.documentElement.dir = f.dir; W.__phoneEnd = ({ UK: '21', EU: '48', IN: '45', AE: '09', AR: '09', SG: '63', MY: '17' } as any)[s.market] }, [s.market])
  ;(window as any).__tab = tab
  const [hist, setHist] = useState<{ t: Tab; c?: string }[]>([])
  const [wstart, setWstart] = useState<string | undefined>()
  const [cfocus, setCfocus] = useState<string | undefined>()
  const [cx, setCx] = useState<string>(q.get('to') || (saved?.t === 'cardx' ? saved.c || '' : ''))
  const scroller = () => document.querySelector('.app-main .app-scroll') as HTMLElement | null
  const top = () => { const el = scroller(); if (el) el.scrollTop = 0 }
  const mem = useRef<Record<string, number>>(ssGet('gratifi-scroll') || {})
  const keyOf = (t: Tab, c?: string) => t + ':' + (t === 'explore' || t === 'cardx' ? c || '' : '')
  const curKey = keyOf(tab, tab === 'explore' ? cat : tab === 'cardx' ? cx : undefined)
  const remember = () => { if (tab === 'chat') return; const el = scroller(); if (el) { mem.current[curKey] = el.scrollTop; ssSet('gratifi-scroll', mem.current) } }
  /* Going back, or closing to a screen you were on, returns you to the same spot; going deeper starts at the top. */
  const land = (k: string, restore: boolean) => { if (k.startsWith('chat:')) return; const y = restore ? mem.current[k] || 0 : 0; const put = () => { const el = scroller(); if (el) el.scrollTop = y }; put(); requestAnimationFrame(put); setTimeout(put, 60) }
  const [dir, setDir] = useState<string>('')
  const depth = (t: Tab) => t === 'bank' ? -1 : t === 'home' ? 0 : t === 'chat' ? 1 : t === 'cardx' ? 3 : 2
  /* Screens move like a native app: deeper slides in from the side, back slides away, Gratifi itself rises from the bank app. */
  const move = (d: string, fn: () => void) => {
    const doc: any = document, reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduce) { setDir(d); fn(); return }
    document.documentElement.dataset.nav = d
    const v = doc.startViewTransition(() => W.ReactDOM.flushSync(() => { setDir(d); fn() }))
    v.finished.finally(() => { if (document.documentElement.dataset.nav === d) delete document.documentElement.dataset.nav })
  }
  const go = (t: Tab, c?: string) => {
    if (t === tab && !(t === 'explore' && c !== cat) && !(t === 'cardx' && c !== cx)) { if (t === 'explore') setCat(c); if (t === 'card') setCfocus(c); return }
    const d = tab === 'bank' ? 'up' : t === 'bank' ? 'down' : depth(t) >= depth(tab) && t !== 'home' ? 'push' : 'pop'
    remember()
    move(d, () => { if (t !== tab || t === 'cardx') setHist(h => [...h.slice(-20), { t: tab, c: tab === 'cardx' ? cx : cat }]); setTab(t); if (t === 'explore') setCat(c); if (t === 'wallet') setWstart(c); if (t === 'card') setCfocus(c); if (t === 'cardx') setCx(c || ''); if (t !== 'chat' && !(t === 'card' && c)) land(keyOf(t, c), d === 'pop' || d === 'down') })
  }
  const back = () => { const h = hist[hist.length - 1]; remember(); move('pop', () => { setHist(hist.slice(0, -1)); if (!h) { const t0: Tab = tab === 'cardx' ? 'card' : 'home'; setTab(t0); land(keyOf(t0), true); return } setTab(h.t); if (h.t === 'explore') setCat(h.c); if (h.t === 'cardx') setCx(h.c || ''); land(keyOf(h.t, h.c), true) }) }
  useEffect(() => { ssSet('gratifi-route', { t: tab, c: tab === 'explore' ? cat : tab === 'cardx' ? cx : undefined }) }, [tab, cat, cx])
  useEffect(() => { land(curKey, true) }, [])
  useEffect(() => { const el = scroller(); if (!el) return; let t: any = 0; const f = () => { clearTimeout(t); t = setTimeout(remember, 150) }; el.addEventListener('scroll', f, { passive: true }); return () => { el.removeEventListener('scroll', f); clearTimeout(t) } }, [curKey])
  const nav: Nav = { go, back }
  W.__back = back
  useEffect(() => {
    let x0 = 0, y0 = 0, on = false
    const rtl = () => document.documentElement.dir === 'rtl'
    const start = (e: TouchEvent) => { const t = e.touches[0], edge = rtl() ? window.innerWidth - t.clientX : t.clientX; on = edge < 24 && !document.querySelector('.app-sheet'); x0 = t.clientX; y0 = t.clientY }
    const end = (e: TouchEvent) => { if (!on) return; on = false; const t = e.changedTouches[0], dx = (t.clientX - x0) * (rtl() ? -1 : 1), dy = Math.abs(t.clientY - y0); if (dx > 70 && dy < 60 && (W.__tab !== 'home' && W.__tab !== 'bank')) W.__back() }
    document.addEventListener('touchstart', start, { passive: true }); document.addEventListener('touchend', end, { passive: true })
    return () => { document.removeEventListener('touchstart', start); document.removeEventListener('touchend', end) }
  }, [])
  W.__go = go; W.__M = fmt(s.market)
  W.__setApis = (o: Record<string, boolean>) => St.set(x => ({ seen: { ...x.seen, apisOff: o } }))
  useEffect(() => { setGoChat(() => W.__go('chat')); setSendText((t: string) => { W.__go('chat'); Br.ask(t) }) }, [])
  const unread0 = tab !== 'chat' && s.chat.length > 0 && s.chat[s.chat.length - 1].role === 'gr' && !s.seen['chat-' + s.chat[s.chat.length - 1].id]
  const unread = unread0
  useEffect(() => { const n: any = navigator; try { if (unread && n.setAppBadge) n.setAppBadge(1); else if (n.clearAppBadge) n.clearAppBadge() } catch (e) { } }, [unread])
  useEffect(() => { if (tab === 'chat' && s.chat.length) { const id = 'chat-' + s.chat[s.chat.length - 1].id; if (!s.seen[id]) St.set(x => ({ seen: { ...x.seen, [id]: true } })) } }, [tab, s.chat.length])
  const M = fmt(s.market)
  const ph: Record<string, string> = { home: 'Ask or book anything', explore: 'Ask or book anything', chat: 'Reply or ask anything', wallet: 'Ask about your bookings', me: 'Ask or book anything', card: 'Ask about your card', cardx: 'Ask about your card', offers: 'Ask about offers', alerts: 'Ask or book anything', tier: 'Ask about your tier' }
  return <MarketProvider market={s.market}>
    <div className={unread ? 'app gr app-unread' : 'app gr'} data-tab={tab} key={s.market}>
      {tab === 'bank' ? <main className="app-main ds-bankwrap" data-dir={dir}><Bank nav={nav} /></main> : <div className="ds-sheet">
        <div className="ds-grab"><i /></div>
        <main className="app-main" data-dir={dir} key={tab === 'cardx' ? 'cx' + cx : tab}>
          {tab === 'home' && <Home nav={nav} />}
          {tab === 'explore' && <Explore cat={cat} setCat={setCat} nav={nav} />}
          {tab === 'chat' && <Chat nav={nav} />}
          {tab === 'wallet' && <Wallet nav={nav} start={wstart} key={wstart || 'w'} />}
          {tab === 'me' && <Me nav={nav} theme={theme} setTheme={setTheme} />}
          {tab === 'offers' && <Offers nav={nav} />}
          {tab === 'alerts' && <Alerts nav={nav} />}
          {tab === 'tier' && <Tier nav={nav} />}
          {tab === 'card' && <Card nav={nav} focus={cfocus} />}
          {tab === 'cardx' && <CardX nav={nav} to={cx} key={cx} />}
        </main>
        <div className="app-dock">
          <T.AskBar key={tab} placeholder={ph[tab]} onSend={(t: string) => { go('chat'); Br.ask(t) }} onMic={() => setVoice(true)} />
        </div>
      </div>}
      <ToastHost />
      {voice && <Voice market={s.market} onClose={() => setVoice(false)} onSend={(t: string) => { setVoice(false); go('chat'); Br.ask(t) }} onType={() => { setVoice(false); setTimeout(() => (document.querySelector('.gr-ask input') as HTMLInputElement | null)?.focus(), 60) }} />}
      <ConfirmHost />
      <InfoHost />
    </div>
  </MarketProvider>
}

W.ReactDOM.createRoot(document.getElementById('root')).render(<App />)
const reAR = arabic(document.getElementById('root') as HTMLElement); St.onChange(() => reAR())
Br.initBrain()
document.addEventListener('keydown', (e: KeyboardEvent) => { const r = (e.target as HTMLElement)?.closest?.('[role=radio]') as HTMLElement | null; if (!r || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return; const g = r.closest('[role=radiogroup]'); if (!g) return; const items = Array.from(g.querySelectorAll<HTMLElement>('[role=radio]')).filter(x => !(x as any).disabled); const i = items.indexOf(r), fwd = e.key === 'ArrowDown' || e.key === (document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'); const n = items[(i + (fwd ? 1 : -1) + items.length) % items.length]; if (n) { e.preventDefault(); n.focus(); n.click() } })
FL.tickDue(); FL.resumeTrackers(); setInterval(FL.tickDue, 3000)
document.addEventListener('click', (e: MouseEvent) => { const el = (e.target as HTMLElement)?.closest?.('.gr-btn-primary, .ds-btn40, .ds-pill, .ds-add, .ds-added, [role=switch], .gr-send'); if (el && (navigator as any).vibrate) try { (navigator as any).vibrate(8) } catch (x) { } }, true)
