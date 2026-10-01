import { React, useState, useEffect } from '../../kit/src/r'
import * as K from '../../kit/src/base'
import * as T from '../../kit/src/talk'
import { MarketProvider, fmt } from '../../kit/src/market'
import * as St from './store'
import * as Br from './brain'
import * as FL from './flows'
import { ConfirmHost, setGoChat, setSendText } from './render'
import { Home, Explore, Chat, Wallet, Me, Tab } from './screens'
import { arabic, toEn } from './ar'

const W = window as any
function readLS(k: string) { try { return localStorage.getItem(k) } catch (e) { return null } }
function writeLS(k: string, v: string) { try { localStorage.setItem(k, v) } catch (e) { } }

const q = new URLSearchParams(location.search)
const startMarket = q.get('m') || readLS('gratifi-market') || 'UK'
St.boot(startMarket)

function App() {
  const s = St.useS(x => x)
  const [tab, setTab] = useState<Tab>((q.get('tab') as Tab) || 'home')
  const [cat, setCat] = useState<string | undefined>(q.get('cat') || undefined)
  const sysDark = W.matchMedia && W.matchMedia('(prefers-color-scheme: dark)').matches
  const [theme, setThemeS] = useState(q.get('theme') || readLS('gratifi-theme') || (sysDark ? 'dark' : 'light'))
  const setTheme = (t: string) => { setThemeS(t); writeLS('gratifi-theme', t) }
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  useEffect(() => { const f = fmt(s.market); document.documentElement.lang = f.locale; document.documentElement.dir = f.dir; W.__phoneEnd = ({ UK: '21', EU: '48', IN: '45', AE: '09', AR: '09', SG: '63', MY: '17' } as any)[s.market] }, [s.market])
  ;(window as any).__tab = tab
  const go = (t: Tab, c?: string) => { setTab(t); if (t === 'explore') setCat(c); const el = document.querySelector('.app-main .app-scroll'); if (el && t !== 'chat') el.scrollTop = 0 }
  W.__go = go; W.__M = fmt(s.market)
  useEffect(() => { setGoChat(() => setTab('chat')); setSendText((t: string) => { setTab('chat'); Br.ask(t) }) }, [])
  const unread = tab !== 'chat' && s.chat.length > 0 && s.chat[s.chat.length - 1].role === 'gr' && !s.seen['chat-' + s.chat[s.chat.length - 1].id]
  useEffect(() => { if (tab === 'chat' && s.chat.length) { const id = 'chat-' + s.chat[s.chat.length - 1].id; if (!s.seen[id]) St.set(x => ({ seen: { ...x.seen, [id]: true } })) } }, [tab, s.chat.length])
  const M = fmt(s.market)
  const nav = [{ id: 'home', icon: 'home', label: M.t('home') }, { id: 'explore', icon: 'grid', label: s.market === 'AR' ? 'استكشف' : 'Explore' }, { id: 'chat', icon: 'sparkle', label: 'Gratifi' }, { id: 'wallet', icon: 'wallet', label: s.market === 'AR' ? 'المحفظة' : 'Wallet' }, { id: 'me', icon: 'card', label: s.market === 'AR' ? 'بطاقتي' : 'My card' }]
  return <MarketProvider market={s.market}>
    <div className="app gr" data-tab={tab} key={s.market}>
      <main className="app-main">
        {tab === 'home' && <Home go={go} />}
        {tab === 'explore' && <Explore cat={cat} setCat={setCat} go={go} />}
        {tab === 'chat' && <Chat />}
        {tab === 'wallet' && <Wallet />}
        {tab === 'me' && <Me theme={theme} setTheme={setTheme} />}
      </main>
      <div className="app-dock">
        {<T.AskBar placeholder={tab === 'chat' ? undefined : 'Ask Gratifi for anything'} onSend={(t: string) => { setTab('chat'); Br.ask(t) }} onMic={() => { setTab('chat'); St.pushMsg({ role: 'gr', text: 'Voice works in the phone app. Type here for now.' }) }} />}
        <div className={unread ? 'app-navwrap app-unread' : 'app-navwrap'}><K.NavBar items={nav} current={tab} onChange={(t: Tab) => go(t)} /></div>
      </div>
      <ConfirmHost />
    </div>
  </MarketProvider>
}

W.ReactDOM.createRoot(document.getElementById('root')).render(<App />)
const reAR = arabic(document.getElementById('root') as HTMLElement); St.onChange(() => reAR())
Br.initBrain()
document.addEventListener('keydown', (e: KeyboardEvent) => { const r = (e.target as HTMLElement)?.closest?.('[role=radio]') as HTMLElement | null; if (!r || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return; const g = r.closest('[role=radiogroup]'); if (!g) return; const items = Array.from(g.querySelectorAll<HTMLElement>('[role=radio]')).filter(x => !(x as any).disabled); const i = items.indexOf(r), fwd = e.key === 'ArrowDown' || e.key === (document.documentElement.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'); const n = items[(i + (fwd ? 1 : -1) + items.length) % items.length]; if (n) { e.preventDefault(); n.focus(); n.click() } })
FL.tickDue(); FL.resumeTrackers(); setInterval(FL.tickDue, 3000)
