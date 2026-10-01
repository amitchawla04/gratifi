import { React, useState, cx } from './r'
import { useMarket } from './market'
import { Icon, Spark } from './icons'
import { ART } from './art'

/* ================= Foundations ================= */

/** Grey facts split by dots: "Direct · 2h 40m · 1 bag". */
export function Meta({ items, className }: { items: any[]; className?: string }) {
  const list = items.filter(Boolean)
  return <div className={cx('gr-meta', className)}>{list.map((x, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', columnGap: 6, whiteSpace: i > 0 ? 'nowrap' : undefined }}>{i > 0 && <span className="gr-dot" style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--ink-faint)', display: 'inline-block' }} />}<span style={{ whiteSpace: 'normal' }}>{x}</span></span>)}</div>
}

/** Small uppercase label above a group of facts. */
export function Label({ children }: any) { return <div className="gr-label">{children}</div> }

/** A price, with optional was-price, points alternative and per-person note. All numbers come from the supplier. */
export function Price({ amount, was, points, pointsCash, note, size, align = 'right' }: { amount: number; was?: number; points?: number; pointsCash?: number; note?: string; size?: 'lg'; align?: 'left' | 'right' }) {
  const M = useMarket(); const dp = amount % 1 ? 2 : 0
  return <div className={cx('gr-price', size === 'lg' && 'gr-lg', align === 'left' && 'gr-left')}>
    {was != null && <s>{M.money(was)}</s>}
    <b>{M.money(amount, dp)}</b>
    {points != null && <span className="gr-pts">{M.t('orPts', { n: M.num(points) })}{pointsCash ? ` + ${M.money(pointsCash)}` : ''}</span>}
    {note && <small>{note}</small>}
  </div>
}

/** Money or points back on top of the price. */
export function Back({ children }: any) { return <span className="gr-back"><Spark size={12} />{children}</span> }

export function Badge({ tone, icon, children }: { tone?: 'good' | 'warn' | 'danger' | 'accent' | 'ink'; icon?: string; children: any }) {
  return <span className={cx('gr-badge', tone && 'gr-' + tone)}>{icon && <Icon name={icon} size={13} stroke={2.2} />}{children}</span>
}

/** Live status with a word and a dot. The word carries the meaning; the colour repeats it. */
export function Status({ tone = 'good', live, children }: { tone?: 'good' | 'warn' | 'danger'; live?: boolean; children: any }) {
  const c = tone === 'good' ? 'var(--good)' : tone === 'warn' ? 'var(--warn)' : 'var(--danger)'
  return <span className={cx('gr-status', live && 'gr-live')} style={{ color: c }}><i />{children}</span>
}

export function Skeleton({ w = '100%', h = 14, r }: { w?: any; h?: number; r?: number }) { return <div className="gr-skel" style={{ width: w, height: h, borderRadius: r }} /> }

/* ================= Actions ================= */

export function Button({ variant = 'primary', size, block, icon, iconRight, loading, disabled, children, onClick, ...rest }: any) {
  return <button className={cx('gr-btn', 'gr-btn-' + variant, size && 'gr-btn-' + size, block && 'gr-btn-block')} disabled={disabled || loading} onClick={onClick} {...rest}>
    {loading ? <span className="gr-spin" aria-hidden="true" /> : icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.1} />}
    {children}
    {iconRight && !loading && <Icon name={iconRight} size={16} stroke={2.2} />}
  </button>
}

export function IconButton({ icon, label, dark, flat, small, dot, onClick }: any) {
  return <button className={cx('gr-ibtn', dark && 'gr-dark', flat && 'gr-flat', small && 'gr-sm')} aria-label={label} onClick={onClick}><Icon name={icon} size={small ? 18 : 20} stroke={2.1} />{dot && <span className="gr-badge-dot" />}</button>
}

/** Filter or choice chips. Controlled or self-managed. */
export function Chips({ items, value, multi, onChange, wrap }: { items: (string | { id: string; label: string; count?: number; icon?: string })[]; value?: string | string[]; multi?: boolean; onChange?: (v: any) => void; wrap?: boolean }) {
  const norm = items.map(x => typeof x === 'string' ? { id: x, label: x } : x)
  const [own, setOwn] = useState(value ?? (multi ? [] : null))
  const cur = value ?? own
  const on = (id: string) => multi ? (cur as string[]).includes(id) : cur === id
  const tap = (id: string) => { const next = multi ? (on(id) ? (cur as string[]).filter(x => x !== id) : [...(cur as string[]), id]) : (on(id) ? null : id); setOwn(next); onChange?.(next) }
  return <div className={cx('gr-chips', wrap && 'gr-wrap')} role="group">{norm.map(c => <button key={c.id} className="gr-chip" aria-pressed={on(c.id)} onClick={() => tap(c.id)}>{c.icon && <Icon name={c.icon} size={15} stroke={2.1} />}{c.label}{c.count != null && <span className="gr-count">{c.count}</span>}</button>)}</div>
}

export function Segmented({ items, value, onChange, dark }: { items: string[]; value?: string; onChange?: (v: string) => void; dark?: boolean }) {
  const [own, setOwn] = useState(value ?? items[0]); const cur = value ?? own
  return <div className={cx('gr-seg', dark && 'gr-seg-dark')} role="tablist">{items.map(x => <button key={x} role="tab" aria-selected={cur === x} onClick={() => { setOwn(x); onChange?.(x) }}>{x}</button>)}</div>
}

export function Toggle({ on, onChange, label, disabled }: { on?: boolean; onChange?: (v: boolean) => void; label: string; disabled?: boolean }) {
  const [own, setOwn] = useState(!!on); const cur = on ?? own
  return <button role="switch" aria-checked={cur} aria-label={label} className="gr-toggle" disabled={disabled} onClick={() => { setOwn(!cur); onChange?.(!cur) }} />
}

export function Stepper({ value, min = 0, max = 9, onChange, label }: { value?: number; min?: number; max?: number; onChange?: (v: number) => void; label: string }) {
  const M = useMarket()
  const [own, setOwn] = useState(value ?? min); const cur = value ?? own
  const set = (v: number) => { setOwn(v); onChange?.(v) }
  return <div className="gr-stepper" role="group" aria-label={label}>
    <button aria-label={M.t('fewer', { x: label })} disabled={cur <= min} onClick={() => set(cur - 1)}><Icon name="minus" size={16} stroke={2.4} /></button>
    <output aria-live="polite">{M.num(cur)}</output>
    <button aria-label={M.t('more', { x: label })} disabled={cur >= max} onClick={() => set(cur + 1)}><Icon name="plus" size={16} stroke={2.4} /></button>
  </div>
}

/** The floating nav with a black pill on the current tab. */
export function NavBar({ items, current = 'home', onChange }: any) {
  const M = useMarket()
  items = items || [{ id: 'home', icon: 'home', label: M.t('home') }, { id: 'rewards', icon: 'gift', label: M.t('rewards') }, { id: 'trips', icon: 'plane', label: M.t('trips') }, { id: 'me', icon: 'user', label: M.t('me') }]
  const [own, setOwn] = useState(current); const cur = onChange ? current : own
  return <nav className="gr-nav" aria-label={M.t('main')}>{items.map((t: any) => <button key={t.id} aria-current={cur === t.id ? 'page' : undefined} aria-label={t.label} onClick={() => { setOwn(t.id); onChange?.(t.id) }}><Icon name={t.icon} size={20} stroke={2.1} />{cur === t.id && t.label}</button>)}</nav>
}

/* ================= Objects you can hold ================= */

export function PaperClip() {
  return <svg className="gr-clip" viewBox="0 0 40 96" aria-hidden="true"><path d="M28 30V76a10 10 0 0 1-20 0V16a12 12 0 0 1 24 0v54a4 4 0 0 1-8 0V30" fill="none" stroke="#9A9CA3" strokeWidth="4.5" strokeLinecap="round" /></svg>
}

/** A photo at a slight tilt, with a handwritten caption. For rewards, stays and places. */
export function Polaroid({ src, caption, tilt = -3, width = 200, clip }: { src: string; caption?: string; tilt?: number; width?: number; clip?: boolean }) {
  return <figure className="gr-polaroid" style={{ ['--tilt' as any]: tilt + 'deg', width, margin: 0 }}>{clip && <PaperClip />}<div className="gr-ph"><img src={src} alt={caption || ''} /></div>{caption && <figcaption className="gr-hand">{caption}</figcaption>}</figure>
}

/** Gratifi's note, pinned with a clip. One line in handwriting, a sentence of why, one yes and a not now. */
export function StickyNote({ title, children, tone = 'yellow', tilt = -1.2, action, secondary, onAction, onSecondary, from: fromIn, clip = true, width = 330 }: any) {
  const M = useMarket()
  const from = fromIn === undefined ? M.t(tone === 'blue' ? 'yourNote' : 'fromGratifi') : fromIn
  return <div className={cx('gr-sticky', tone === 'blue' && 'gr-blue')} style={{ ['--tilt' as any]: tilt + 'deg', maxWidth: width }}>
    {clip && <PaperClip />}
    <div className="gr-hand">{title}</div>
    {children && <p>{children}</p>}
    {(action || secondary) && <div className="gr-row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
      {action && <Button size="sm" onClick={onAction}>{action}</Button>}
      {secondary && <Button variant="ghost" size="sm" onClick={onSecondary}>{secondary}</Button>}
    </div>}
    {from && <div className="gr-from">{tone !== 'blue' && <Spark size={12} />}{from}</div>}
  </div>
}

/** A voucher or earned reward, collected like a postage stamp. */
export function Stamp({ art = ART.stampPlane, value, name, tilt = 2 }: { art?: string; value?: string; name?: string; tilt?: number }) {
  return <div className="gr-stamp" style={{ ['--tilt' as any]: tilt + 'deg' }}><div className="gr-art"><img src={art} alt="" /></div>{(value || name) && <div className="gr-sv"><span>{name}</span><span>{value}</span></div>}</div>
}

/** A die-cut sticker for one short fact: "5% back", "Last room". */
export function Sticker({ children, tone = 'accent', tilt = -6, icon }: { children: any; tone?: 'accent' | 'ink' | 'paper'; tilt?: number; icon?: string }) {
  return <span className={cx('gr-sticker', tone !== 'accent' && 'gr-' + tone)} style={{ ['--tilt' as any]: tilt + 'deg' }}>{icon && <Icon name={icon} size={14} stroke={2.4} />}{children}</span>
}

/** A saved plan: photos peek out of the folder, the summary sits on the front. */
export function TripFolder({ title, dates, photos = [], items = [], people = [], onOpen }: any) {
  const M = useMarket()
  const spots = [{ left: '46%', r: -8 }, { left: '62%', r: 4 }, { left: '78%', r: 12 }]
  return <div className="gr-folder">
    {photos.slice(0, 3).map((p: string, i: number) => <div key={i} className="gr-peek" style={{ left: spots[i].left, transform: `rotate(${spots[i].r}deg)`, zIndex: i }}><img src={p} alt="" /></div>)}
    <div className="gr-tab" />
    <button className="gr-fbody" onClick={onOpen} style={{ textAlign: 'start', width: '100%' }}>
      <div className="gr-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="gr-col" style={{ gap: 2 }}><div className="gr-title">{title}</div><Meta items={[dates, M.t('nOfBooked', { a: items.filter((i: any) => i.done).length, b: items.length })]} /></div>
        {people.length > 0 && <AvatarStack people={people} />}
      </div>
      <div className="gr-col" style={{ gap: 8 }}>{items.map((it: any, i: number) => <div key={i} className="gr-row" style={{ gap: 10 }}><span className="gr-ibtn gr-flat gr-sm" style={{ width: 32, height: 32 }}><Icon name={it.icon} size={16} /></span><div className="gr-grow"><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{it.title}</div><div className="gr-meta">{it.meta}</div></div>{it.done ? <Icon name="check" size={18} color="var(--good)" stroke={2.4} /> : <Badge tone="warn">{M.t('toBook')}</Badge>}</div>)}</div>
    </button>
  </div>
}

/** Points dial: the balance in the black centre, orange ticks for progress to a goal. */
export function Dial({ value, label, progress = 0.6, size = 200, goal }: { value: number | string; label?: string; progress?: number; size?: number; goal?: string }) {
  const M = useMarket()
  label = label ?? M.t('points')
  const n = 48, r1 = size / 2 - 6, r2 = size / 2 - 20, c = size / 2
  const ticks = Array.from({ length: n }, (_, i) => { const a = (-220 + (i / (n - 1)) * 260) * Math.PI / 180; const on = i / (n - 1) <= progress; return <line key={i} x1={c + r1 * Math.cos(a)} y1={c + r1 * Math.sin(a)} x2={c + r2 * Math.cos(a)} y2={c + r2 * Math.sin(a)} stroke={on ? 'var(--accent)' : 'var(--ink-faint)'} strokeWidth={on ? 3.2 : 2.2} strokeLinecap="round" /> })
  const core = size * 0.58
  return <div className="gr-dial" style={{ width: `min(${size / 16}rem, 100%)`, aspectRatio: '1', marginBottom: goal ? '1.9rem' : 0 }} role="img" aria-label={`${value} ${label}${goal ? ', ' + goal : ''}`}>
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%' }}>{ticks}</svg>
    <div className="gr-core" style={{ width: '58%', height: '58%' }}><b style={{ fontSize: `${Math.min(26, Math.floor(core * 0.84 / Math.max(5, String(typeof value === 'number' ? M.num(value) : value).length) * 1.75)) / 16}rem`, lineHeight: 1.1 }}>{typeof value === 'number' ? M.num(value) : value}</b><span>{label}</span></div>
    {goal && <div className="gr-meta" style={{ position: 'absolute', top: '100%', marginTop: 6, justifyContent: 'center', textAlign: 'center', width: 'calc(100% + 60px)', left: -30 }}>{goal}</div>}
  </div>
}

/** The orange check that confirms something happened. It pops once. */
export function CheckPop({ size = 64, animate = true }: { size?: number; animate?: boolean }) {
  const M = useMarket()
  return <span className={cx('gr-check', animate && 'gr-pop')} style={{ ['--size' as any]: size + 'px' }} role="img" aria-label={M.t('done')}><svg width={size * 0.55} height={size * 0.55} viewBox="0 0 100 100"><path d="M24 52 42 69 76 34" fill="none" stroke="var(--on-accent)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
}

export function AvatarStack({ people, max = 3 }: { people: { name: string; src?: string }[]; max?: number }) {
  const shown = people.slice(0, max), more = people.length - shown.length
  return <div className="gr-avatars" aria-label={people.map(p => p.name).join(', ')}>{shown.map(p => <span key={p.name} className="gr-av">{p.src ? <img src={p.src} alt="" /> : p.name.split(' ').map(s => s[0]).join('').slice(0, 2)}</span>)}{more > 0 && <span className="gr-av gr-more">+{more}</span>}</div>
}
