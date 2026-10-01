/* The chat's answer cards, built only from the approved screens:
   Hotels (results), Cinema (detail), Confirm (the sheet), Booked (done), Tickets (passes),
   Main's Coming up and sticky note, Short's three ways, Offers rows, Rewards tiles, Claim's timeline.
   Prices read "8,200 points" in bold black; cash, when there is any, is grey and second. */
import { React, useState, useEffect } from '../../kit/src/r'
import { Icon } from '../../kit/src/icons'
import { useMarket } from '../../kit/src/market'
import * as D from './design'

/** "8,200 points" in bold, then the cash in grey, then the unit. */
export function Price({ pts, cash, unit, free, text }: { pts?: string; cash?: string; unit?: string; free?: string; text?: string }) {
  if (free) return <span className="ds-price"><b>{free}</b>{unit && <span>{unit}</span>}</span>
  if (text) return <span className="ds-price"><span>{text}</span></span>
  if (!pts && !cash) return null
  return <span className="ds-price">{pts ? <b>{pts}</b> : <b>{cash}</b>}{pts && cash && <span>{`or ${cash}`}</span>}{unit && <span className="ds-price-u">{unit}</span>}</span>
}

export type ResultItem = { key: string; art?: string; title: string; meta?: string[]; price?: any; cta?: string; onOpen: () => void; cls?: string; tag?: string }
/** The Hotels page: the best match as a big picture card with one black button, the rest as picture rows. */
export function Results({ items, filters, onFilter, count, sort }: { items: ResultItem[]; filters?: string[]; onFilter?: (f: string) => void; count?: string; sort?: string }) {
  const best = items[0]?.art ? items[0] : undefined
  const meta = (m?: string[]) => (m || []).filter(Boolean).join(' · ')
  return <div className="gr-col ds-results" style={{ gap: 12 }}>
    {filters && filters.length > 0 && <div className="ds-filters" role="group" aria-label="Refine"><span className="ds-filters-ic" aria-hidden="true"><Icon name="filter" size={16} stroke={2.2} /></span>{filters.map(f => <button key={f} className="ds-fchip" onClick={() => onFilter?.(f)}>{f}</button>)}</div>}
    {count && <div className="ds-rhead"><span>{count}</span>{sort && <b>{sort}</b>}</div>}
    {best && <div className="ds-best"><button className={'ds-best-ph ' + (best.cls || '')} onClick={best.onOpen} aria-label={best.title}><img src={best.art} alt="" /><span className="ds-best-tag">{best.tag || 'Best match'}</span></button><div className="ds-best-f"><div className="ds-best-b"><p className="ds-ip-t">{best.title}</p>{meta(best.meta) && <p className="ds-ip-s">{best.meta!.filter(Boolean).map((x, k) => <span key={k} className={k ? 'ds-ip-u' : undefined}>{x}</span>)}</p>}<p className="ds-ip-p">{best.price}</p></div>{best.cta && <button className="ds-btn40" onClick={best.onOpen}>{best.cta}</button>}</div></div>}
    {items.filter(i => i !== best).map(i => <button key={i.key} className={'ds-irow ' + (i.cls || '')} onClick={i.onOpen}><span className="ds-irow-ph">{i.art ? <img src={i.art} alt="" /> : <Icon name="grid" size={24} />}</span><span className="ds-irow-b"><span className="ds-ip-t">{i.title}</span>{meta(i.meta) && <span className="ds-ip-s">{i.meta!.filter(Boolean).map((x, k) => <span key={k} className={k ? 'ds-ip-u' : undefined}>{x}</span>)}</span>}<span className="ds-ip-p">{i.price}</span></span><Icon name="chev" size={18} stroke={2.2} /></button>)}
  </div>
}

/** Rewards tiles, two to a row: picture, name, points, one pill. */
export function Grid({ items }: { items: { key: string; art?: string; title: string; price: any; cta?: string; onOpen: () => void }[] }) {
  return <div className="ds-grid">{items.map(x => <button key={x.key} className="ds-rtile" onClick={x.onOpen}><span className="ds-rtile-ph">{x.art && <img src={x.art} alt="" />}</span><span className="ds-rtile-t">{x.title}</span><span className="ds-rtile-f"><span className="ds-rtile-p">{x.price}</span>{x.cta && <span className="ds-rtile-c">{x.cta}</span>}</span></button>)}</div>
}

/** Offers rows: a small picture, what it is, one line, and Add or a quiet status on the trailing side. */
export function Offers({ items, title }: { title?: string; items: { key: string; art?: string; title: string; sub?: string; price?: any; action?: string; onAction?: () => void; status?: string; onOpen?: () => void; primary?: boolean }[] }) {
  return <div className="ds-olist">{title && <div className="ds-ways-h"><D.SparkMark /><p>{title}</p></div>}{items.map(x => <div key={x.key} className="ds-orow">
    <button className="ds-orow-b" onClick={x.onOpen || x.onAction} disabled={!x.onOpen && !x.onAction}><span className="ds-orow-ph">{x.art && <img src={x.art} alt="" />}</span><span className="ds-row-b"><span className="ds-row-t">{x.title}</span>{x.sub && <span className="ds-row-s">{x.sub}</span>}{x.price && <span className="ds-orow-p">{x.price}</span>}</span></button>
    {x.status ? <span className="ds-added-s"><Icon name="check" size={13} stroke={2.6} />{x.status}</span> : x.action ? <button className={'ds-opill gr-btn' + (x.primary !== false ? ' primary' : '')} onClick={x.onAction}>{x.action}</button> : null}
  </div>)}</div>
}

/** The Cinema page as a card: the picture, the name, the points line, orange-check bullets, a sticky note, one black button. */
export function Detail({ art, title, sub, price, checks = [], note, children, cta, ctaIcon, onCta, disabled, caption, badge, tall, done }: { done?: string; art?: string; title: string; sub?: string; price?: any; checks?: string[]; note?: { title: string; body: any }; children?: any; cta: string; ctaIcon?: string; onCta: () => void; disabled?: boolean; caption?: string; badge?: string; tall?: boolean }) {
  return <div className="ds-cine gr-detail">
    {art && <div className={'ds-cine-ph' + (tall ? ' tall' : '')}><img src={art} alt="" />{badge && <span className="ds-best-tag">{badge}</span>}</div>}
    <div className="ds-cine-b">
      <p className="ds-cine-t">{title}</p>
      {(price || sub) && <p className="ds-cine-p">{price}{sub && <span className={"ds-cine-s" + (price ? " ds-dotb" : "")}>{sub}</span>}</p>}
      {checks.length > 0 && <ul className="ds-checks">{checks.filter(Boolean).map(c => <li key={c}><Icon name="check" size={16} stroke={2.6} />{c}</li>)}</ul>}
      {children}
      {note && <D.Note title={note.title}>{note.body}</D.Note>}
      {done ? <p className="ds-cine-done"><Icon name="check" size={16} stroke={2.6} />{done}</p> : <button className="ds-btn48 gr-btn ds-cine-cta" disabled={disabled} onClick={onCta}>{ctaIcon && <Icon name={ctaIcon} size={20} stroke={2} />}{cta}</button>}
      {caption && !done && <p className="ds-cine-cap">{caption}</p>}
    </div>
  </div>
}
/** A small grey label over a row of choices inside a detail card. */
export function Opt({ label, children, id }: { label: string; children: any; id?: string }) { return <div className="ds-opt"><span className="ds-opt-l" id={id}>{label}</span>{children}</div> }
/** How many, as a row of chips instead of a stepper. */
export function Count({ label, value, min = 1, max = 8, onChange, fmt }: { label: string; value: number; min?: number; max?: number; onChange: (n: number) => void; fmt?: (n: number) => string }) {
  const n = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  return <Opt label={label}><div className="app-days ds-count" role="radiogroup" aria-label={label}>{n.map(x => <button key={x} className="gr-slot" role="radio" aria-checked={value === x} onClick={() => onChange(x)}>{fmt ? fmt(x) : String(x)}</button>)}</div></Opt>
}

/** Checkout, short: what it is, the total in points, how to pay, one black button. The confirm sheet does the rest. */
export function Pay({ art, title, sub, rows, choices, value, onChange, cta, onPay, disabled, warn, note }: { art?: string; title: string; sub?: string; rows: [string, any][]; choices?: { key: string; title: string; sub: string; disabled?: boolean }[]; value?: string; onChange?: (k: string) => void; cta: string; onPay: () => void; disabled?: boolean; warn?: string; note?: string }) {
  return <div className="ds-paycard">
    <div className="ds-pay-h">{art ? <img src={art} alt="" /> : <span className="ds-coming-ph" />}<span className="ds-coming-b"><span className="ds-coming-t">{title}</span>{sub && <span className="ds-coming-s">{sub}</span>}</span></div>
    <div className="ds-pay-rows">{rows.map(([k, v]) => <div key={k} className="ds-kv-r"><span>{k}</span><b>{v}</b></div>)}</div>
    {choices && choices.length > 1 && <div className="ds-pay-ch" role="radiogroup" aria-label="Pay with">{choices.map(c => <button key={c.key} role="radio" aria-checked={value === c.key} aria-disabled={c.disabled} className="ds-row ds-pickrow-l" onClick={() => { if (!c.disabled) onChange?.(c.key) }}><span className="ds-row-b"><span className="ds-row-t">{c.title}</span><span className="ds-row-s">{c.sub}</span></span><span className="ds-tick" aria-hidden="true">{value === c.key && <Icon name="check" size={14} stroke={2.6} />}</span></button>)}</div>}
    {note && <p className="ds-row-s" style={{ margin: 0 }}>{note}</p>}
    {warn && <D.AssistantNote>{warn}</D.AssistantNote>}
    <button className="ds-btn48 gr-btn" disabled={disabled} onClick={onPay}>{cta}</button>
  </div>
}

/** You're booked: the orange check, a big headline, the four-row table and the sparkle line. */
export function Booked({ headline, title, sub, rows, line, actions }: { headline: string; title?: string; sub?: string; rows: [string, any][]; line?: string; actions?: any }) {
  return <div className="ds-booked">
    <D.DoneCheck />
    <p className="ds-booked-h">{headline}</p>
    {title && <p className="ds-booked-t">{title}</p>}
    {sub && <p className="ds-booked-s">{sub}</p>}
    {rows.length > 0 && <div className="ds-kv-card ds-booked-kv">{rows.map(([k, v]) => <div key={k} className="ds-kv-r"><span>{k}</span><b>{v}</b></div>)}</div>}
    {line && <div className="ds-spark-line"><D.SparkMark size={16} /><p>{line}</p></div>}
    {actions}
  </div>
}

/** A made-up but steady QR picture for a reference: three corner squares and cells from the code. */
export function QR({ code, size = 168 }: { code: string; size?: number }) {
  const N = 25; let h = 2166136261; for (const c of code) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 }
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >> 17; h ^= h << 5; h >>>= 0; return h / 4294967296 }
  const finder = (x: number, y: number) => x < 8 && y < 8 || x >= N - 8 && y < 8 || x < 8 && y >= N - 8
  const cells: string[] = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() < 0.48) cells.push(`M${x} ${y}h1v1h-1z`)
  const fp = (x: number, y: number) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`
  return <svg className="ds-qr" width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`} role="img" aria-label={`Code ${code}`} shapeRendering="crispEdges"><rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" /><path d={fp(0, 0) + fp(N - 7, 0) + fp(0, N - 7)} fill="#141416" fillRule="evenodd" /><path d={cells.join('')} fill="#141416" /></svg>
}
/** The Tickets card: name and count, a dashed line, the big code, one caption. Before it opens, the code area says when. */
export function Ticket({ title, count, code, caption, lines, closed, onWallet, wallet = 'Add to Apple Wallet' }: { title: string; count?: string; code: string; caption?: string; lines?: [string, string][]; closed?: string; onWallet?: () => void; wallet?: string }) {
  return <div className="ds-ticket">
    <div className="ds-ticket-h"><b>{title}</b>{count && <span>{count}</span>}</div>
    <div className="ds-ticket-perf" />
    {lines && lines.length > 0 && <div className="ds-ticket-l">{lines.map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</div>}
    {closed ? <div className="ds-ticket-closed"><Icon name="clock" size={22} stroke={2} /><span>{closed}</span></div> : <QR code={code} />}
    {caption && <p className="ds-ticket-c">{caption}</p>}
    {onWallet && !closed && <button className="ds-opill primary ds-ticket-w" onClick={onWallet}><Icon name="wallet" size={16} stroke={2} />{wallet}</button>}
  </div>
}

/** When something isn't as expected: the yellow sticky note, a handwritten title, one plain line and up to two pills. */
export function StateNote({ title, body, was, now, actions = [], used, gone, onAct }: { title: string; body?: any; was?: string; now?: string; actions?: { label: string }[]; used?: string; gone?: boolean; onAct?: (i: number) => void }) {
  return <div className="ds-note gr-state" role="status"><div className="ds-note-in"><p className="ds-note-t">{title}</p>{body && <p className="ds-note-b">{body}</p>}
    {was && now && <p className="ds-note-diff"><s>{was}</s><Icon name="arrow" size={16} stroke={2.2} /><b>{now}</b></p>}
    {actions.length > 0 && !gone && <div className="ds-note-a">{(used ? actions.filter(a => a.label === used) : actions.slice(0, 3)).map((a, i) => used ? <span key={a.label} className="ds-note-done"><Icon name="check" size={14} stroke={2.6} />{a.label}</span> : <button key={a.label} className={'ds-btn40 gr-btn' + (i > 0 ? ' ds-white' : '')} onClick={() => onAct?.(actions.indexOf(a))}>{a.label}</button>)}</div>}
    </div><img className="ds-clip" src={D.ART.clip} alt="" /></div>
}

/** Next steps as the Book again chips, each with its category stamp. */
export function Next({ items, onPick, artFor }: { items: string[]; onPick: (s: string) => void; artFor: (s: string) => string | undefined }) {
  return <div className="ds-again ds-next">{items.slice(0, 3).map(s => <button key={s} className="gr-chip gr-suggest" onClick={() => onPick(s)}>{artFor(s) ? <img src={artFor(s)} alt="" /> : <span className="ds-next-sp"><D.SparkMark size={14} /></span>}{s}</button>)}</div>
}

/** The Confirm sheet, as approved: picture tile, title and one line, three rows, a yellow strip, the black button and a text link.
    How the customer confirms follows the market: Face ID, a one-time code, or the bank's own app. Done turns into the Booked page. */
export function ConfirmSheet({ art, icon, title, summary, rows, strip, cta, auth, phone = '21', onConfirm, onClose, validCode, done, attempts = 0, onWrong, lockedUntil, link, onLink }: { art?: string; icon?: string; title: string; summary?: string; rows: [string, string][]; strip?: string; cta?: string; auth?: string; phone?: string; onConfirm: () => boolean | void; onClose: () => void; validCode?: string; done: () => { headline: string; rows: [string, string][]; line?: string; title?: string; sub?: string }; attempts?: number; onWrong?: (n: number) => void; lockedUntil?: number; link?: string; onLink?: () => void }) {
  const M = useMarket(); const how = auth || M.auth
  const [s, setS] = useState<'ready' | 'scanning' | 'done'>('ready')
  const [code, setCode] = useState(''); const [err, setErr] = useState(attempts); const [resent, setResent] = useState(false)
  const boxes = React.useRef<HTMLDivElement>(null); const focusBox = (i: number) => setTimeout(() => (boxes.current?.querySelectorAll('input')[i] as HTMLInputElement | undefined)?.focus(), 0)
  const [, tick] = useState(0)
  useEffect(() => { if (err < 3 || !lockedUntil) return; const t = setInterval(() => { if (Date.now() >= lockedUntil) { setErr(0); setCode('') } tick(x => x + 1) }, 5000); return () => clearInterval(t) }, [err, lockedUntil])
  const mins = lockedUntil ? Math.max(1, Math.ceil((lockedUntil - Date.now()) / 6e4)) : 15
  useEffect(() => { if (s === 'scanning') { const t = setTimeout(() => { const ok = onConfirm(); if (ok !== false) setS('done') }, how === 'app' ? 2600 : 1300); return () => clearTimeout(t) } }, [s])
  const label = cta || (how === 'otp' ? M.t('confirmWithCode', { amt: rows[0]?.[1] || '' }) : how === 'app' ? M.t('payApp') : 'Confirm with Face ID')
  const go = () => { if (how === 'otp' && validCode && code !== validCode) { setErr(err + 1); onWrong?.(err + 1); setCode(''); if (err + 1 < 3) focusBox(0); return } setErr(0); setS('scanning'); setTimeout(() => (document.querySelector('.gr-sheet') as HTMLElement | null)?.focus(), 0) }
  return <div className="gr-sheetwrap"><div className="gr-sheet ds-csheet" role="dialog" aria-modal="true" tabIndex={-1} data-state={s} aria-label={title}>
    <div className="gr-grab" />
    {s === 'done' ? (() => { const x = done(); return <Booked headline={x.headline} title={x.title ?? title} sub={x.sub ?? summary} rows={x.rows} line={x.line} /> })() : <>
      <div className="ds-cs-h">{art ? <img className="ds-cs-ph" src={art} alt="" /> : <span className="ds-cs-ph ds-cs-ic"><Icon name={icon || 'check'} size={26} stroke={2} /></span>}<div className="ds-cs-b"><p className="ds-cs-t">{title}</p>{summary && <p className="ds-cs-s">{summary}</p>}</div><button className="ds-cs-x" aria-label={M.t('close')} onClick={onClose}><Icon name="close" size={16} stroke={2.4} /></button></div>
      <div className="ds-cs-rows">{rows.map(([k, v], i) => <div key={k + i} className="ds-cs-r"><span>{k}</span><b>{v}</b></div>)}</div>
      {strip && <div className="ds-cs-strip"><D.SparkMark size={15} /><span>{strip}</span></div>}
      {how === 'otp' && <div className="gr-otp">
        <div className="gr-meta">{M.t('otpSent', { d: phone })}</div>
        <div className="gr-otp-boxes" dir="ltr" ref={boxes}>{[0, 1, 2, 3, 4, 5].map(i => <input key={i} inputMode="numeric" pattern="[0-9]*" autoComplete={i === 0 ? 'one-time-code' : 'off'} disabled={err >= 3} aria-label={M.t('otpDigit', { n: i + 1 })} value={code[i] || ''}
          onFocus={(e: any) => e.target.select()}
          onPaste={(e: any) => { const d = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (d) { e.preventDefault(); setCode(d); focusBox(Math.min(5, d.length)) } }}
          onKeyDown={(e: any) => { const box = (k: number) => (boxes.current?.querySelectorAll('input')[k] as HTMLInputElement | undefined); if (/^\d$/.test(e.key)) { e.preventDefault(); setCode(prev => (prev.slice(0, i).padEnd(i, ' ') + e.key + prev.slice(i + 1)).replace(/ /g, '').slice(0, 6)); if (i < 5) box(i + 1)?.focus() } else if (e.key === 'Enter') { e.preventDefault(); go() } else if (e.key === 'Backspace' && !code[i] && i > 0) { e.preventDefault(); setCode(code.slice(0, i - 1)); box(i - 1)?.focus() } else if (e.key === 'ArrowLeft' && i > 0) box(i - 1)?.focus(); else if (e.key === 'ArrowRight' && i < 5) box(i + 1)?.focus() }}
          onChange={(e: any) => { const d = e.target.value.replace(/\D/g, ''); if (!d) { setCode(code.slice(0, i) + code.slice(i + 1)); return } if (d.length > 1) { const nc = (code.slice(0, i) + d).slice(0, 6); setCode(nc); focusBox(Math.min(5, nc.length)); return } const nc = (code.slice(0, i) + d + code.slice(i + 1)).slice(0, 6); setCode(nc); if (i < 5) focusBox(i + 1) }} />)}</div>
        {err > 0 && <div className="ds-cs-err" role="alert">{err >= 3 ? M.t('codeLocked', { n: mins }) : err === 2 ? M.t('wrongCodeLast') : M.t('wrongCode')}</div>}
        {err < 3 && <button className="gr-link" style={{ alignSelf: 'flex-start' }} onClick={() => { setResent(true); setCode('') }}>{M.t('otpResend')}</button>}
        {resent && err < 3 && <div className="gr-meta" role="status">{M.t('otpResent')}</div>}
      </div>}
      {how === 'app' && s === 'scanning' && <div className="ds-cs-wait" role="status">{M.t('appWaiting')}</div>}
      <button className={'ds-btn48 gr-btn ds-cs-cta' + (s === 'scanning' ? ' busy' : '')} disabled={(how === 'otp' && code.length < 6) || err >= 3 || s === 'scanning'} onClick={go}>{s === 'scanning' ? <span className="ds-spin" aria-hidden="true" /> : <Icon name={how === 'faceid' ? 'faceid' : how === 'app' ? 'phone' : 'lock'} size={20} stroke={2} />}{s === 'scanning' ? M.t('checking') : label}</button>
      <button className="ds-cs-link" onClick={onLink || onClose}>{link || 'Not now'}</button>
    </>}
  </div></div>
}
