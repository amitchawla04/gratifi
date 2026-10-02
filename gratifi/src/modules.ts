/* Modules: every service in Gratifi is a module that needs one or more bank APIs.
   A bank that offers the APIs gets the module; a bank that doesn't never sees it — no button, no screen, no chat answer.
   In the demo the bank's APIs are mocked and can be switched off under You → Bank connections. */
import * as St from './store'
import * as F from './flows'

export type ApiId = string
/** The bank APIs a module can depend on. Names follow the shape of a typical card platform; the mock answers all of them. */
export const APIS: { id: ApiId; name: string; group: string }[] = [
  { id: 'accounts.read', name: 'Card account and balance', group: 'Card' },
  { id: 'transactions.read', name: 'Transactions', group: 'Card' },
  { id: 'statements.read', name: 'Statements', group: 'Card' },
  { id: 'payments.bill', name: 'Bill payment', group: 'Payments' },
  { id: 'payments.directdebit', name: 'Direct Debit mandates', group: 'Payments' },
  { id: 'cards.controls', name: 'Card controls: freeze, where and how the card works, limits, spending blocks, payment alerts', group: 'Card' },
  { id: 'cards.limits', name: 'Spending limits by category', group: 'Card' },
  { id: 'cards.details', name: 'Card number and security code', group: 'Card' },
  { id: 'cards.pin', name: 'PIN view', group: 'Card' },
  { id: 'cards.replace', name: 'Lost, stolen and replacement cards', group: 'Card' },
  { id: 'cards.activate', name: 'Card activation', group: 'Card' },
  { id: 'cards.tokenise', name: 'Phone wallet (Apple Pay, Google Pay)', group: 'Card' },
  { id: 'cards.travel', name: 'Travel notices', group: 'Card' },
  { id: 'cards.blocks', name: 'Gambling block', group: 'Card' },
  { id: 'credit.limit', name: 'Credit limit changes', group: 'Credit' },
  { id: 'disputes', name: 'Disputes and chargebacks', group: 'Credit' },
  { id: 'credit.plans', name: 'Monthly payment plans', group: 'Credit' },
  { id: 'credit.transfers', name: 'Balance transfers', group: 'Credit' },
  { id: 'cards.holders', name: 'Additional cardholders', group: 'Card' },
  { id: 'cards.products', name: 'Card product changes', group: 'Card' },
  { id: 'benefits.read', name: 'Card benefits', group: 'Card' },
  { id: 'loyalty.points', name: 'Points balance and ledger', group: 'Rewards' },
  { id: 'loyalty.redeem', name: 'Paying with points', group: 'Rewards' },
  { id: 'loyalty.transfer', name: 'Points transfers to partners', group: 'Rewards' },
  { id: 'loyalty.offers', name: 'Card-linked offers', group: 'Rewards' },
  { id: 'loyalty.challenges', name: 'Challenges', group: 'Rewards' },
  { id: 'partners.travel', name: 'Travel partners (flights, stays, airport, rides)', group: 'Partners' },
  { id: 'partners.lifestyle', name: 'Lifestyle partners (dining, events, experiences)', group: 'Partners' },
  { id: 'partners.retail', name: 'Retail partners (shopping, groceries, gift cards, subscriptions)', group: 'Partners' },
  { id: 'partners.wealth', name: 'Investing partner', group: 'Partners' },
  { id: 'partners.charity', name: 'Charity partners', group: 'Partners' },
  { id: 'service.concierge', name: 'Concierge desk', group: 'Service' },
  { id: 'service.essentials', name: 'Travel essentials (visa, cover, eSIM)', group: 'Service' },
]

export type ModuleId = string
export const MODULES: { id: ModuleId; name: string; group: 'Card' | 'Rewards' | 'Travel' | 'Everyday' | 'Help'; apis: ApiId[] }[] = [
  { id: 'card', name: 'Card overview', group: 'Card', apis: ['accounts.read'] },
  { id: 'card.pay', name: 'Pay your bill', group: 'Card', apis: ['accounts.read', 'payments.bill'] },
  { id: 'card.directdebit', name: 'Direct Debit', group: 'Card', apis: ['payments.directdebit'] },
  { id: 'card.statements', name: 'Statements', group: 'Card', apis: ['statements.read'] },
  { id: 'card.transactions', name: 'Transactions and spending', group: 'Card', apis: ['transactions.read'] },
  { id: 'card.controls', name: 'Card controls', group: 'Card', apis: ['cards.controls'] },
  { id: 'card.limits', name: 'Spending limits', group: 'Card', apis: ['cards.limits', 'transactions.read'] },
  { id: 'card.details', name: 'Card details', group: 'Card', apis: ['cards.details'] },
  { id: 'card.pin', name: 'PIN', group: 'Card', apis: ['cards.pin'] },
  { id: 'card.replace', name: 'Lost, stolen or damaged card', group: 'Card', apis: ['cards.replace', 'cards.controls'] },
  { id: 'card.activate', name: 'Activate a new card', group: 'Card', apis: ['cards.activate'] },
  { id: 'card.wallet', name: 'Phone wallet', group: 'Card', apis: ['cards.tokenise'] },
  { id: 'card.travel', name: 'Travel notice', group: 'Card', apis: ['cards.travel'] },
  { id: 'card.gambling', name: 'Gambling block', group: 'Card', apis: ['cards.blocks'] },
  { id: 'card.limit', name: 'Credit limit', group: 'Card', apis: ['credit.limit'] },
  { id: 'card.disputes', name: 'Disputes', group: 'Card', apis: ['disputes', 'transactions.read'] },
  { id: 'card.plans', name: 'Monthly payments', group: 'Card', apis: ['credit.plans', 'transactions.read'] },
  { id: 'card.transfer', name: 'Balance transfer', group: 'Card', apis: ['credit.transfers'] },
  { id: 'card.holders', name: 'Additional cardholders', group: 'Card', apis: ['cards.holders'] },
  { id: 'card.switch', name: 'Move to a different card', group: 'Card', apis: ['cards.products'] },
  { id: 'points.pay', name: 'Pay off purchases with points', group: 'Rewards', apis: ['loyalty.redeem', 'transactions.read'] },
  { id: 'benefits', name: 'Card benefits', group: 'Card', apis: ['benefits.read'] },
  { id: 'points', name: 'Points and tier', group: 'Rewards', apis: ['loyalty.points'] },
  { id: 'offers', name: 'Card offers', group: 'Rewards', apis: ['loyalty.offers'] },
  { id: 'moments', name: 'Challenges', group: 'Rewards', apis: ['loyalty.challenges'] },
  { id: 'points.transfer', name: 'Points transfers', group: 'Rewards', apis: ['loyalty.transfer'] },
  { id: 'invest', name: 'Grow points', group: 'Rewards', apis: ['loyalty.redeem', 'partners.wealth'] },
  { id: 'charity', name: 'Give', group: 'Rewards', apis: ['loyalty.redeem', 'partners.charity'] },
  { id: 'flights', name: 'Flights', group: 'Travel', apis: ['partners.travel'] },
  { id: 'stays', name: 'Stays', group: 'Travel', apis: ['partners.travel'] },
  { id: 'airport', name: 'Airport', group: 'Travel', apis: ['partners.travel'] },
  { id: 'rides', name: 'Rides and rail', group: 'Travel', apis: ['partners.travel'] },
  { id: 'docs', name: 'Travel essentials', group: 'Travel', apis: ['service.essentials'] },
  { id: 'experiences', name: 'Experiences', group: 'Everyday', apis: ['partners.lifestyle'] },
  { id: 'dining', name: 'Dining', group: 'Everyday', apis: ['partners.lifestyle'] },
  { id: 'tickets', name: 'Events', group: 'Everyday', apis: ['partners.lifestyle'] },
  { id: 'quick', name: 'Groceries', group: 'Everyday', apis: ['partners.retail'] },
  { id: 'shopping', name: 'Shopping', group: 'Everyday', apis: ['partners.retail'] },
  { id: 'giftcards', name: 'Gift cards', group: 'Everyday', apis: ['partners.retail'] },
  { id: 'subs', name: 'Subscriptions', group: 'Everyday', apis: ['partners.retail'] },
  { id: 'concierge', name: 'Concierge', group: 'Help', apis: ['service.concierge'] },
]

/** Which APIs this bank offers. The demo bank offers all of them unless switched off in Bank connections. */
export function apiOn(id: ApiId) { const off = (St.get().seen.apisOff || {}) as Record<string, boolean>; return !off[id] }
export function on(id: ModuleId) { const k = id === 'bank' ? 'card' : id, m = MODULES.find(x => x.id === k); return !m || m.apis.every(apiOn) }
export function useOn() { St.useS(s => s.seen.apisOff); return on }
export const nameOf = (id: ModuleId) => MODULES.find(x => x.id === id)?.name || id
/** The plain sentence shown wherever a service the bank doesn't offer is asked for. */
export const unavailable = (id: ModuleId) => { const n = nameOf(id); return `${n} ${/s$/.test(n) ? 'aren\'t' : 'isn\'t'} available in this app` }

/* What each answer card needs, so a chat answer can't show a service the bank doesn't offer. */
const KIND: Record<string, ModuleId> = {
  flights: 'flights', fares: 'flights', seats: 'flights', calendar: 'flights', changeflight: 'flights', seatchange: 'flights', disruption: 'flights',
  grocery: 'quick', paybill: 'card.pay', directdebit: 'card.directdebit', statement: 'card.statements', txns: 'card.transactions', spend: 'card.transactions',
  controls: 'card.controls', gambling: 'card.gambling', benefits: 'benefits', programmes: 'points.transfer', member: 'points.transfer', invest: 'invest', charities: 'charity',
  offers: 'offers', challenges: 'moments', visa: 'docs', insurance: 'docs', esim: 'docs', essentials: 'docs', conciergeform: 'concierge', balance: 'card', points: 'points',
}
const ACT: Record<string, ModuleId> = { payBill: 'card.pay', ddSet: 'card.directdebit', ddOff: 'card.directdebit', unfreeze: 'card.controls', cardSet: 'card.controls', limitSet: 'card.limit', gamblingLift: 'card.gambling', replaceCardDo: 'card.replace', transferDo: 'points.transfer', investDo: 'invest', donate: 'charity' }
const SAFE = new Set(['crisis', 'emergency', 'handoff', 'state', 'suggest', 'action'])

/** Removes or replaces anything in an answer that needs a module this bank doesn't offer. */
export function guard<R extends { say?: string; blocks: any[]; confirm?: any; suggest?: string[] }>(r: R): R {
  if (!St.get().seen.apisOff) return r
  let missing: ModuleId | undefined
  const blocks = r.blocks.map(b => {
    if (SAFE.has(b.kind)) return b
    if (b.kind === 'items' && Array.isArray(b.ids)) { const ids = b.ids.filter((i: string) => { const it = F.findItem(i); return !it || on(it.cat) }); if (!ids.length) { missing = missing || (F.findItem(b.ids[0])?.cat); return null } return { ...b, ids } }
    if ((b.kind === 'detail' || b.kind === 'checkout') && b.id) { const it = F.findItem(b.id); if (it && !on(it.cat)) { missing = missing || it.cat; return null } }
    const need = KIND[b.kind]; if (need && !on(need)) { missing = missing || need; return null }
    return b
  }).filter(Boolean)
  const cf = r.confirm?.kind === 'action' ? ACT[r.confirm.act?.f] : undefined
  if (cf && !on(cf)) missing = missing || cf
  if (!missing) return { ...r, blocks }
  if (blocks.some(b => b.kind !== 'suggest')) return { ...r, blocks, confirm: cf && !on(cf) ? undefined : r.confirm }
  return { say: `${unavailable(missing)}. Your bank's app or a person at the bank can help with it.`, blocks: [], suggest: ['Talk to a person'] } as any
}
