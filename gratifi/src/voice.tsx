/* Voice, as on the approved Listening screen: the tick dial around a black core, what you said in large type,
   and one black button to send. Speech is turned into text by the phone's own browser; nothing is recorded or kept. */
import { React, useState, useEffect, useRef } from '../../kit/src/r'
import { Icon } from '../../kit/src/icons'
import * as D from './design'

const W = window as any
const LANG: Record<string, string> = { UK: 'en-GB', EU: 'en-IE', IN: 'en-IN', AE: 'en-AE', AR: 'ar-AE', SG: 'en-SG', MY: 'en-MY' }
export const canListen = () => !!(W.SpeechRecognition || W.webkitSpeechRecognition)

export function Voice({ market, onSend, onClose, onType }: { market: string; onSend: (t: string) => void; onClose: () => void; onType: () => void }) {
  const [text, setText] = useState(''); const [fin, setFin] = useState('')
  const [state, setState] = useState<'listening' | 'stopped' | 'denied' | 'none' | 'error'>(canListen() ? 'listening' : 'none')
  const rec = useRef<any>(null); const sent = useRef(false); const latest = useRef('')
  const send = () => { const t = latest.current.trim(); if (sent.current) return; sent.current = true; try { rec.current?.stop() } catch (e) { } if (t) onSend(t); else onClose() }
  useEffect(() => {
    if (!canListen()) return
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition, r = new SR()
    r.lang = LANG[market] || 'en-GB'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1
    r.onresult = (e: any) => { let f = '', i = ''; for (let k = 0; k < e.results.length; k++) { const x = e.results[k]; if (x.isFinal) f += x[0].transcript; else i += x[0].transcript } setFin(f); setText(i); latest.current = (f + ' ' + i).replace(/\s+/g, ' ').trim() }
    r.onerror = (e: any) => setState(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'denied' : e.error === 'no-speech' ? 'stopped' : 'error')
    r.onend = () => { if (sent.current) return; if (latest.current.trim()) send(); else setState(s => (s === 'listening' ? 'stopped' : s)) }
    rec.current = r
    try { r.start() } catch (e) { setState('error') }
    return () => { sent.current = true; try { r.abort() } catch (e) { } }
  }, [])
  const again = () => { sent.current = false; latest.current = ''; setFin(''); setText(''); setState('listening'); try { rec.current?.start() } catch (e) { setState('error') } }
  const said = (fin + (text ? ' ' + text : '')).trim()
  const msg = state === 'none' ? 'This browser can\'t listen. Use the microphone on your keyboard, or type.' : state === 'denied' ? 'The microphone is off for this app. Allow it in your browser settings, or type instead.' : state === 'error' ? 'I couldn\'t start listening. Try again, or type instead.' : state === 'stopped' && !said ? 'I didn\'t catch that.' : ''
  return <div className="ds-voice" role="dialog" aria-label="Listening">
    <D.Head title={state === 'listening' ? 'Listening' : 'Voice'} right={<D.HBtn icon="close" label="Close" onClick={onClose} />} />
    <div className="ds-voice-dial" aria-hidden="true"><img src={D.ART.ring} alt="" /><span className={'ds-voice-core' + (state === 'listening' ? ' on' : '')}>{[0, 1, 2, 3, 4, 5, 6].map(i => <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />)}</span></div>
    <p className="ds-voice-t" aria-live="polite">{said ? <>{fin}{text && <span>{(fin ? ' ' : '') + text}</span>}</> : msg || 'Say what you need'}</p>
    <div className="ds-voice-f">
      {state === 'listening' || said ? <><button className="ds-voice-send" aria-label="Send" onClick={send}><Icon name="up" size={26} stroke={2.4} /></button><p>Tap when you're done</p></>
        : <div className="ds-btnrow" style={{ justifyContent: 'center' }}>{state !== 'none' && state !== 'denied' && <D.Pill primary icon="mic" onClick={again}>Try again</D.Pill>}<D.Pill onClick={onType}>Type instead</D.Pill></div>}
    </div>
  </div>
}
