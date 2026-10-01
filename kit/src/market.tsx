import { React } from './r'
import { STRINGS } from './strings'

/* A market is data, never design. Every component reads it through useMarket(); a new market is one more entry here
   (or one object passed to MarketProvider), with no component changes. The bank's own settings override these defaults. */

export type Market = {
  id: string; name: string
  locale: string            // number and date formatting
  lang: string              // which strings pack
  dir: 'ltr' | 'rtl'
  currency: string
  symbol?: string           // shown before the amount in English packs, e.g. 'S$', 'RM', 'AED '
  auth: 'faceid' | 'otp' | 'app'   // how a customer confirms a payment in this market
  directDebit: string       // what customers call an automatic card payment here
  tax: string               // VAT, GST, SST
  flightRule: { name: string; note: string }   // what disruption compensation is called; amounts come from the bank's legal team
  hour12: boolean           // everyday times; flight times are always 24-hour
  firstDay: 1 | 6 | 7       // first day of the week in calendars: Monday, Saturday or Sunday
}

export const MARKETS: Record<string, Market> = {
  UK: { id: 'UK', name: 'United Kingdom', locale: 'en-GB', lang: 'en', dir: 'ltr', currency: 'GBP', symbol: '£', auth: 'faceid', directDebit: 'Direct Debit', tax: 'VAT', flightRule: { name: 'UK rules', note: 'UK261' }, hour12: false, firstDay: 1 },
  EU: { id: 'EU', name: 'Eurozone (English)', locale: 'en-IE', lang: 'en', dir: 'ltr', currency: 'EUR', symbol: '€', auth: 'faceid', directDebit: 'direct debit', tax: 'VAT', flightRule: { name: 'EU rules', note: 'EU261' }, hour12: false, firstDay: 1 },
  IN: { id: 'IN', name: 'India', locale: 'en-IN', lang: 'en', dir: 'ltr', currency: 'INR', symbol: '₹', auth: 'otp', directDebit: 'auto-debit', tax: 'GST', flightRule: { name: 'DGCA rules', note: 'DGCA passenger charter' }, hour12: true, firstDay: 7 },
  AE: { id: 'AE', name: 'UAE', locale: 'en-AE', lang: 'en', dir: 'ltr', currency: 'AED', symbol: 'AED ', auth: 'faceid', directDebit: 'direct debit', tax: 'VAT', flightRule: { name: 'the airline’s policy', note: 'to confirm with the bank' }, hour12: true, firstDay: 1 },
  AR: { id: 'AR', name: 'UAE (Arabic)', locale: 'ar-AE', lang: 'ar', dir: 'rtl', currency: 'AED', auth: 'faceid', directDebit: 'الخصم المباشر', tax: 'ضريبة القيمة المضافة', flightRule: { name: 'سياسة شركة الطيران', note: 'to confirm with the bank' }, hour12: true, firstDay: 1 },
  SG: { id: 'SG', name: 'Singapore', locale: 'en-SG', lang: 'en', dir: 'ltr', currency: 'SGD', symbol: 'S$', auth: 'faceid', directDebit: 'GIRO', tax: 'GST', flightRule: { name: 'the airline’s policy', note: 'no statutory scheme' }, hour12: true, firstDay: 7 },
  MY: { id: 'MY', name: 'Malaysia', locale: 'en-MY', lang: 'en', dir: 'ltr', currency: 'MYR', symbol: 'RM', auth: 'app', directDebit: 'auto-debit', tax: 'SST', flightRule: { name: 'Malaysian aviation rules', note: 'Malaysian Aviation Consumer Protection Code 2016, enforced by CAAM' }, hour12: true, firstDay: 1 },
}

export type Fmt = Market & {
  money: (n: number, dp?: number) => string
  num: (n: number) => string
  pts: (n: number) => string
  date: (d: Date | string, style?: 'short' | 'long' | 'day') => string
  time: (hhmm: string) => string
  /** Everyday times (tables, pick-ups): 12-hour where the market reads them that way. */
  clock: (hhmm: string) => string
  t: (key: string, vars?: Record<string, any>) => string
  monthLabel: (y: number, m: number) => string
  dows: () => string[]
}

const cache: Record<string, Fmt> = {}
export function fmt(m: Market | string = 'UK'): Fmt {
  const mk: Market = typeof m === 'string' ? (MARKETS[m] || MARKETS.UK) : m
  const key = JSON.stringify(mk)
  if (cache[key]) return cache[key]
  const nf = (dp: number) => new Intl.NumberFormat(mk.locale, { minimumFractionDigits: dp, maximumFractionDigits: dp })
  const pack = { ...STRINGS.en, ...(STRINGS[mk.lang] || {}) }
  const f: Fmt = {
    ...mk,
    money: (n, dp = 0) => {
      if (mk.currency === 'INR' && dp > 0 && Math.abs(n - Math.round(n)) < 0.005) dp = 0 /* whole rupees show without paise */
      if (mk.symbol) return (n < 0 ? '−' : '') + mk.symbol + nf(dp).format(Math.abs(n))
      return new Intl.NumberFormat(mk.locale, { style: 'currency', currency: mk.currency, minimumFractionDigits: dp, maximumFractionDigits: dp }).format(n)
    },
    num: n => nf(0).format(Math.round(n)),
    pts: n => Math.round(n) === 1 && pack.ptsN === '{n} pts' ? '1 pt' : pack.ptsN.replace('{n}', nf(0).format(Math.round(n))),
    date: (d, style = 'short') => {
      const x = typeof d === 'string' ? new Date(d + 'T12:00:00') : d
      const o: any = style === 'long' ? { weekday: 'long', day: 'numeric', month: 'long' } : style === 'day' ? { day: 'numeric', month: 'short' } : { weekday: 'short', day: 'numeric', month: 'short' }
      if (Math.abs(x.getTime() - Date.now()) > 300 * 864e5) o.year = 'numeric' /* far-off or past dates carry the year so nobody books the wrong one */
      return new Intl.DateTimeFormat(mk.locale, o).format(x).replace(',', '').replace(/\bSept\b/, 'Sep')
    },
    monthLabel: (y, m) => new Intl.DateTimeFormat(mk.locale, { month: 'long', year: 'numeric' }).format(new Date(y, m, 15)),
    dows: () => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(mk.locale, { weekday: 'narrow' }).format(new Date(2026, 5, 7 + ((mk.firstDay % 7) + i)))),
    time: hhmm => hhmm, // flight times stay 24-hour in every market, as airlines and airports print them
    clock: hhmm => { if (!mk.hour12 || mk.lang === 'ar' || !/^\d\d:\d\d$/.test(hhmm)) return hhmm; const h = +hhmm.slice(0, 2), mm = hhmm.slice(3); const pm = h >= 12, h12 = h % 12 || 12; return mk.lang === 'ar' ? `${h12}:${mm} ${pm ? 'م' : 'ص'}` : `${h12}:${mm} ${pm ? 'pm' : 'am'}` },
    t: (key, vars) => {
      let k = key
      if (vars && vars.n != null) { const n = Number(String(vars.n).replace(/[^0-9.]/g, '')); const cat = new Intl.PluralRules(mk.lang).select(n); if (pack[key + '_' + cat] != null) k = key + '_' + cat }
      let s = pack[k] ?? pack[key] ?? key
      if (vars) for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]))
      return s
    },
  }
  cache[key] = f
  return f
}

const Ctx = React.createContext(fmt('UK'))

/** Wrap any part of the app to set its market. Sets the text direction too. */
export function MarketProvider({ market = 'UK', children, className, style }: { market?: Market | string; children?: any; className?: string; style?: any }) {
  const f = fmt(market)
  return <Ctx.Provider value={f}><div className={className} dir={f.dir} lang={f.locale} style={{ display: 'contents', ...style }}>{children}</div></Ctx.Provider>
}

export function useMarket(): Fmt { return React.useContext(Ctx) }
