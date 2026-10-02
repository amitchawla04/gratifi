// Gratifi's brain for the demo.
// Deterministic: every number, eligibility rule and action comes from the account (acct) below.
// Probabilistic: only the wording. With a live model switched on, the model picks the intent and phrases
// the reply from the facts it is given; the screens it opens still show the system's own figures.
import { acct, State, fmtInt, FEES } from './store'
import { benefitsFor } from './benefits'
import { gbp, DUE, CONTENT, PROGRAMME, MEMBER, NEXT_STATEMENT, STATEMENT_ISO, Offer, Txn, dayLabel, CARDS } from './data'

type Acct = ReturnType<typeof acct>
export type Action = { label: string; push?: string; params?: any; tab?: string; ask?: string; dispatch?: any; primary?: boolean }
export type Moment = { id: string; title: string; body: string; actions: Action[] }

const NON_SPEND = ['Payment', 'Card fees', 'Transfers', 'Cashback']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const spentExtra = (a: Acct) => Math.max(0, a.cs.extra.filter(t => !NON_SPEND.includes(t.cat)).reduce((x, t) => x + t.amount, 0))
const postStatementSpend = (a: Acct) => a.c.txns.filter(t => t.date > STATEMENT_ISO && t.amount > 0 && !NON_SPEND.includes(t.cat)).reduce((x, t) => x + t.amount, 0)
/** When `left` is reached at `perMonth`, as "early/mid/late Month". */
export function paceText(left: number, perMonth: number) {
  const d = new Date(Date.parse('2026-09-28') + (left / perMonth) * 30.4 * 864e5)
  const day = d.getUTCDate(); return `${day <= 10 ? 'early' : day <= 20 ? 'mid' : 'late'} ${MONTHS[d.getUTCMonth()]}`
}
export const aviosWelcome = (a: Acct) => { const w = PROGRAMME.avios.welcome; const spent = w.spent + spentExtra(a); return { ...w, spent, left: Math.max(0, w.target - spent) } }
export const voucher = (a: Acct) => { const p = a.prog; const spent = p.yearSpend + spentExtra(a); const left = Math.max(0, p.voucherAt - spent); return { spent, at: p.voucherAt, left, by: p.yearEnds, pace: p.monthsIn ? paceText(left, p.yearSpend / p.monthsIn) : null } }
export const btPlan = (a: Acct) => { const monthly = Math.ceil(a.prog.bt / a.prog.btMonths); return { left: a.prog.bt, until: a.prog.btUntil, monthly, thisMonth: Math.max(0, Math.round((a.prog.purchases + monthly - a.cs.paid) * 100) / 100) } }
/** What to pay on top of a fixed Direct Debit (or in total, without one) to stay on the Platinum 0% plan. */
export const planTopUp = (a: Acct) => { const b = btPlan(a); const dd = a.cs.dd?.type === 'fixed' ? a.cs.dd.amount || 0 : 0; return Math.max(0, Math.round((b.thisMonth - dd) * 100) / 100) }
const r2 = (n: number) => Math.round(n * 100) / 100
/** Select Cashback: this statement month's spending, towards the £2,000 that reviews say monthly cashback needs. */
export const scMonth = (a: Acct) => { const p = a.prog; const spent = r2(postStatementSpend(a) + spentExtra(a)); return { spent, left: r2(Math.max(0, p.threshold - spent)), by: p.monthEnds, earned: r2(spent * 0.01), last: p.lastPaid as number } }
export const hasHotel = (a: Acct) => a.cs.bookings.some(b => b.status === 'booked' && (b.itemId.startsWith('h-') || b.itemId === 'b-hotel'))
export const tripName = (a: Acct) => a.c.business ? 'Amsterdam' : 'Lisbon'

/** Why Gratifi shows an offer, worked out from this card's own payments. Empty when there's no evidence. */
export function offerWhy(a: Acct, o: Offer): string {
  if (!o.merchant) return o.why
  const hits = a.c.txns.filter(t => t.merchant === o.merchant && t.amount > 0)
  if (!hits.length) return ''
  if (o.merchant === 'Northway Air') return a.c.business ? '' : o.why
  const l = dayLabel(hits[0].date); const short = l === 'Today' ? 'today' : l === 'Yesterday' ? 'yesterday' : 'on ' + l.replace(/^\w+\s/, '')
  return hits.length > 1 ? `You ${o.verb} ${hits.length === 2 ? 'twice' : hits.length + ' times'} this month.` : `You ${o.verb} ${short}.`
}

export function moment(a: Acct): Moment | null {
  const c = a.c
  switch (c.id) {
    case 'avios-plus': { const v = voucher(a); if (v.left <= 0) return { id: 'v-done', title: 'Voucher earned', body: 'You’ve passed £10,000 this card year. Choose your cabin upgrade voucher, or 7,000 Avios.', actions: [{ label: 'See my voucher', push: 'voucher', primary: true }] }
      return { id: 'voucher', title: `${gbp(v.left, 0)} to go`, body: `You’ve spent ${gbp(v.spent, 0)} this card year. Spend ${gbp(v.left, 0)} more by ${v.by} and you get a cabin upgrade voucher, or 7,000 Avios if you’d rather. At your usual pace, that’s ${v.pace}.`, actions: [{ label: 'Show me how', push: 'voucher', primary: true }, { label: 'Plan my Avios', push: 'avios' }] } }
    case 'avios': { const w = aviosWelcome(a); if (w.left <= 0) return { id: 'w-done', title: '5,000 Avios on the way', body: 'You’ve spent £1,000 in your first three months, so your welcome bonus will be added.', actions: [{ label: 'Plan my Avios', push: 'avios', primary: true }] }
      const top = Math.max(...CONTENT.filter(i => i.cat === 'Hotels' && !i.biz).map(i => i.price))
      const tip = hasHotel(a) ? 'A week of everyday spending should do it.' : top >= w.left ? 'Your Lisbon hotel would get you there in one go.' : 'Your Lisbon hotel, from £258, gets you most of the way.'
      return { id: 'welcome', title: `${gbp(w.left, 0)} to 5,000 Avios`, body: `Spend ${gbp(w.left, 0)} more by ${w.by} and your welcome bonus is added. ${tip}`, actions: hasHotel(a) ? [{ label: 'Track it', push: 'welcome', primary: true }] : [{ label: 'See Lisbon hotels', push: 'browse', params: { cat: 'Hotels' }, primary: true }, { label: 'Track it', push: 'welcome' }] } }
    case 'rewards':
      if (hasHotel(a)) return a.cashback > 0
        ? { id: 'cash', title: `${gbp(a.cashback)} ready`, body: 'Your cashback is paid once a year, but you can ask for it now. It comes off your balance.', actions: [{ label: 'Take it now', push: 'cashback', primary: true }] }
        : { id: 'booked', title: 'Lisbon is booked', body: 'Flight and hotel are done. While you’re there, pay in euros: this card has no fees abroad.', actions: [{ label: 'Your bookings', push: 'bookings', primary: true }] }
      return { id: 'trip', title: 'Lisbon in 18 days', body: 'This card has no fees abroad, so pay in euros. You still need somewhere to stay: three partner hotels give 5% back on top of your cashback.', actions: [{ label: 'See hotels', push: 'browse', params: { cat: 'Hotels' }, primary: true }, ...(a.cashback > 0 ? [{ label: `Take ${gbp(a.cashback)} cashback`, push: 'cashback' }] : [])] }
    case 'amazon': return { id: 'zero', title: '0% ends Tue 10 Nov', body: `Your balance is ${gbp(a.balance)}. Clear it before Tue 10 Nov and none of it costs interest. After that, interest is charged on anything left.`, actions: [{ label: 'Make a payment', push: 'pay', primary: true }] }
    case 'platinum': { const b = btPlan(a); const top = planTopUp(a); const dd = a.cs.dd?.type === 'fixed' ? a.cs.dd.amount || 0 : 0
      return { id: 'bt', title: `${gbp(b.monthly, 0)} a month`, body: `${gbp(b.left)} is at 0% until ${b.until}. Pay off your new spending each month plus ${gbp(b.monthly, 0)} towards the transfer, and it’s cleared before interest starts.${dd && top > 0 ? ` Your ${gbp(dd, 0)} Direct Debit won’t cover this month on its own.` : ''}`, actions: [...(top > 0 ? [{ label: dd ? `Top up ${gbp(top)}` : `Pay ${gbp(top)}`, push: 'pay', params: { plan: true }, primary: true }] : []), { label: 'See the plan', push: 'bt', primary: top <= 0 }] } }
    case 'forward': { const p = a.prog; return { id: 'promise', title: `${p.needed - p.onTime} due dates to go`, body: `${p.onTime} payments on time so far. Keep paying on time and stay in your limit until ${p.anniversary}, and your rate drops from ${p.from}% to ${p.to}%.`, actions: [{ label: 'See my progress', push: 'promise', primary: true }] } }
    case 'premium-plus': return hasHotel(a)
      ? { id: 'ams-ok', title: 'Amsterdam is all on the card', body: 'Flights and hotel are both paid with this card, which the travel insurance needs. If anything goes wrong, claim within 45 days.', actions: [{ label: 'Policy summary', push: 'insurance', primary: true }] }
      : { id: 'ams', title: 'Amsterdam, Tue 6 Oct', body: 'Your flights are on this card. Its travel insurance only covers a trip paid in full with the card, so put the hotel on it too. A canal-side partner hotel gives 6% back.', actions: [{ label: 'See the hotel', push: 'item', params: { id: 'b-hotel' }, primary: true }, { label: 'Policy summary', push: 'insurance' }] }
    case 'select-cashback': { const m = scMonth(a); return m.left <= 0 ? { id: 'sc-done', title: 'Over £2,000 this month', body: `You’ve spent ${gbp(m.spent)} since your last statement, so about ${gbp(m.earned)} cashback is due on ${m.by}.`, actions: [{ label: 'This month’s cashback', push: 'sccash', primary: true }] }
      : { id: 'sc', title: `${gbp(m.left, 0)} to £2,000`, body: `You’ve spent ${gbp(m.spent)} since your statement on Fri 18 Sep. Reviews say the 1% cashback is paid in months you spend £2,000 or more, so ${gbp(m.left)} more by ${m.by} keeps it coming. Last month you got ${gbp(m.last)}.`, actions: [{ label: 'This month’s cashback', push: 'sccash', primary: true }, { label: 'See spending', tab: 'spend' }] } }
    case 'select-charge': return a.stmtLeft <= 0 ? { id: 'ch-paid', title: 'Statement paid', body: `Nothing more is due on ${DUE}. Spending from today goes on your ${NEXT_STATEMENT} statement.`, actions: [{ label: 'See spending', tab: 'spend', primary: true }] }
      : { id: 'charge', title: `${gbp(a.stmtLeft, 0)} due ${DUE}`, body: `This is a charge card, so the whole statement is paid each month. ${a.cs.dd ? 'Your Direct Debit pays it in full.' : 'You don’t have a Direct Debit, so pay it yourself by the due date.'} Spending from today goes on your ${NEXT_STATEMENT} statement.`, actions: a.cs.dd ? [{ label: 'See statement', push: 'statement', params: { which: 0 }, primary: true }] : [{ label: 'Set up Direct Debit', push: 'dd', primary: true }, { label: 'Pay now', push: 'pay' }] }
  }
  return null
}

// ---------- intents ----------
export const INTENTS: Record<string, string> = {
  balance: 'current balance, available credit, credit limit', due: 'minimum payment, due date, statement balance', pay: 'make a payment now', dd: 'set up or change a Direct Debit',
  statement: 'latest or past statements', spend: 'how much was spent, by category or month', txn: 'a specific transaction or merchant', freeze: 'freeze the card', unfreeze: 'unfreeze the card',
  lost: 'card lost, stolen or damaged, replacement card, activate a new card', pin: 'view PIN', details: 'card number, expiry, card details', limit: 'credit limit change', bt: 'balance transfer or money transfer, 0% period',
  spread: 'spread the cost of a purchase with an Instalment Plan', cardholder: 'additional cardholders or employee cards', wallet: 'Apple Pay or Google Pay', score: 'credit score',
  rewards: 'Avios or cashback balance, how the card earns', goal: 'progress to upgrade voucher, welcome bonus, monthly cashback threshold or Price Promise', avios: 'what Avios can be used for', cashback: 'take cashback now',
  fees: 'card fees, interest rate, APR', promo: 'when a 0% period ends', abroad: 'using the card abroad, foreign fees, travel', benefits: 'card benefits, insurance, lounges, protection',
  offers: 'offers and cashback deals', hotels: 'find or book a hotel', experiences: 'experiences, tours, spa, airport ride', dining: 'restaurant table booking', tickets: 'cinema or event tickets, Barclaycard Entertainment',
  gifts: 'gift cards', bookings: 'existing bookings, cancel a booking', alerts: 'notification and alert settings', help: 'talk to a person, complaints, accessibility, bereavement, closing the account, anything else',
  security: 'scams, approving a payment, PINsentry codes, how to check a message is from Barclaycard', moneyhelp: 'struggling to pay, money worries, debt help', calc: 'how long to pay off the balance, repayment calculator',
  duedate: 'change the monthly payment date', protection: 'Section 75, chargeback, faulty or undelivered goods', lounge: 'airport lounge passes', insurance: 'travel insurance and what the card covers on a trip',
  controls: 'business card controls (MyControls)', cbr: 'Barclays Cashback Rewards retailer offers', amazon: 'move Amazon rewards to an Amazon account',
}

export type Parsed = { intent: string; text: string; steps: string[]; params?: any }
const CATS: Record<string, string[]> = { 'Eating out': ['eat', 'eating', 'restaurant', 'food', 'coffee', 'café', 'cafe', 'dining', 'lunch', 'dinner', 'meals'], Groceries: ['grocer*', 'supermarket', 'food shop'], Transport: ['transport', 'train', 'rail', 'tube'], Travel: ['travel', 'flight', 'trip'], Shopping: ['shopping', 'clothes', 'amazon'], Bills: ['bill', 'energy', 'utilit*'], Subscriptions: ['subscription', 'streaming'], Home: ['home', 'homeware'], Software: ['software', 'saas'], Office: ['office', 'cowork*'] }
const SPEND_EXCL = ['Payment', 'Card fees', 'Transfers', 'Refund', 'Cashback']
const onDay = (iso: string) => { const l = dayLabel(iso); return l === 'Today' ? 'today' : l === 'Yesterday' ? 'yesterday' : 'on ' + l }

export function parse(q: string, s: State): Parsed {
  const a = acct(s); const c = a.c
  const t = ' ' + q.toLowerCase().replace(/[’']/g, '').replace(/[?!.,]/g, ' ') + ' '
  // A keyword must start at a word boundary, so "owe" doesn't match "lower" and "due" doesn't match "reduce".
  // Whole words only (plus common endings), so "owe" doesn't match "lower" and "spa" doesn't match "Spain". A trailing * allows any ending.
  const has = (...w: string[]) => w.some(x => { const k = x.trim(); const pre = k.endsWith('*'); const body = (pre ? k.slice(0, -1) : k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return new RegExp('(^|[^a-z0-9£%])' + body + (pre ? '' : '(s|es|d|ed|led|ing|ling|er)?(?=[^a-z0-9]|$)')).test(t) })
  const R = (intent: string, text: string, steps: string[] = [], params?: any): Parsed => ({ intent, text, steps, params })
  // A payment is mentioned when its full name appears, or a distinctive first word does ("Volt", "Hive"), not "card" or "city".
  const STOP = ['card', 'city', 'corner', 'paper', 'client', 'monthly', 'cashback']
  const names = (x: Txn) => { const full = x.merchant.toLowerCase().replace(/[,.]/g, ''); const first = full.split(/[ &]+/)[0]; return t.includes(' ' + full) || (first.length >= 4 && !STOP.includes(first) && has(first)) }

  // safety-critical first
  if (has('activate')) return R('lost', a.cs.newCard && !a.cs.newCard.activated ? `Your new card ending ${a.cs.newCard.last4} is ready to activate in Card.` : 'Your card is already active.', ['Checked your card'], { activate: true })
  if (has('stolen', 'lost my wallet', 'lost my purse', 'lost my bag', 'lost my card', 'lost card', 'cant find my card', 'missing card', 'damaged', 'broken card', 'replace my card', 'new card')) return R('lost', `Sorry about that. I can block this card and send you a new one. The new card’s details show in the app ${c.id === 'amazon' ? 'straight away' : 'within 24 hours'}, so you can keep paying online.`, ['Checked your card'])
  if (has('pin') && has('unlock', 'locked', 'blocked')) return R('pin', 'If your PIN is locked after three wrong tries, you can unlock it in the app or at a UK cash machine.', [])
  if (has('unfreeze', 'unlock', 'defrost')) return R('unfreeze', a.cs.frozen ? 'Your card is frozen. Unfreeze it and you can pay again straight away.' : 'Your card isn’t frozen, so it’s ready to use.', ['Checked your card'])
  if (has('freeze', 'lock my card', 'block my card', 'pause my card')) return R('freeze', a.cs.frozen ? 'Your card is already frozen. Payments are blocked until you unfreeze it.' : 'I can freeze your card now. Payments in shops, online and on your phone stop until you unfreeze it.', ['Checked your card'])
  if (has('fraud', 'dont recognise', 'dont recognize', 'didnt make', 'charged twice', 'wrong amount', 'dispute')) {
    const m = a.txns.find(x => x.amount > 0 && x.by !== 'gratifi' && names(x))
    return R('txn', m ? `Here’s the ${m.merchant} payment. If it isn’t right, report it and we’ll look into it.` : 'Open the payment you don’t recognise and choose Report a problem. If you think someone else has your card, freeze it first.', ['Checked your recent payments'], { id: m?.id, report: true })
  }
  if (has('pin')) return R('pin', 'You can see your PIN after a quick Face ID check.', [])
  if (has('card number', 'card details', 'expiry', 'cvv', 'security code', 'long number')) return R('details', 'Your card details show after Face ID, so you can pay online without the card to hand.', [])

  // everything else Barclaycard provides with the card
  if (has('scam', 'phishing', 'really barclaycard', 'really from barclaycard', 'suspicious', 'pinsentry', 'approve', 'passcode')) return R('security', 'Barclaycard never asks for your PIN, your login details or your full passcode. Payments waiting for your approval, and PINsentry codes, are in Security.', ['Checked your security settings'])
  if (has('struggling', 'cant pay', 'money worries', 'hardship', 'behind on', 'in debt', 'debt help', 'cant afford')) return R('moneyhelp', c.business ? 'Call the cardholder line on 0800 008 008, at any time. Talking early gives you more options.' : 'If paying is getting hard, talk to Barclaycard early: 0800 056 1411, or send a message from Help. Free advice is also available from StepChange, National Debtline and MoneyHelper.', [])
  if (has('how long to pay off', 'how long will it take', 'pay off faster', 'pay it off quicker', 'repayment calculator', 'calculator')) return c.charge ? R('pay', `This card is paid in full each month, so there’s no interest to work out. ${gbp(a.stmtLeft)} is due ${DUE}.`, ['Checked your statement']) : R('calc', `At ${c.purchaseRate.split(' ')[0]} a year, paying more each month clears ${gbp(a.balance)} sooner and costs less interest. Try some amounts.`, ['Checked your balance and rate'])
  if (has('payment date', 'due date', 'pay date') && has('change', 'move', 'different', 'another')) return c.business ? R('help', 'Call the cardholder line on 0800 008 008 to change your payment date.', []) : R('duedate', 'Your payment is due on the 12th. You can ask to change the date up to twice in 12 months, and get a reply within 24 hours.', ['Checked your account'])
  if (has('section 75', 'chargeback', 'purchase protection', 'faulty', 'never arrived', 'didnt arrive', 'went bust', 'broken item', 'not as described')) return R('protection', c.business ? 'Chargeback works for any amount, usually within 120 days: open the payment and choose Report a problem. This card also has purchase protection against accidental damage and theft.' : 'Two ways to get your money back. Section 75 covers purchases from £100 to £30,000 bought directly from the seller. Chargeback works for any amount, usually within 120 days. Open the payment and choose Report a problem.', ['Checked your card protection'])
  if (has('lounge', 'dragonpass')) return c.id === 'avios-plus' ? R('lounge', 'Over 1,000 airport lounges at £18.50 a pass, through DragonPass Premier+. For Lisbon, two passes cost £37.', ['Checked your card benefits']) : R('benefits', 'Lounge passes at £18.50 come with the Avios Plus card, not this one.', ['Checked your card benefits'])
  if (has('insurance', 'am i covered', 'travel cover') || (c.id === 'premium-plus' && has('cover', 'covered'))) return c.id === 'premium-plus'
    ? R('insurance', hasHotel(a) ? 'Flights and hotel are both on this card, which the travel insurance needs. Medical cover is up to £2m and cancellation up to £6,000. Claim within 45 days.' : 'The travel insurance only covers a trip paid in full with this card. Your flights are on it, so put the hotel on it too. Medical cover is up to £2m and cancellation up to £6,000.', ['Found your trip', 'Checked your policy'])
    : R('benefits', c.business ? 'This card doesn’t include travel insurance. It does have purchase protection and cardholder misuse cover.' : 'This card doesn’t include travel insurance. Section 75 protects purchases from £100 to £30,000.', ['Checked your card benefits'])
  if (c.business && has('mycontrols', 'controls', 'restrict', 'block spending', 'block category', 'stop employee')) return R('controls', 'In MyControls you can switch online, in-shop and cash machine use on or off for each card, and block types of spending.', ['Checked your cards'])
  if (has('cashback rewards', 'retailer cashback', 'retailer offers')) return ['rewards', 'platinum', 'forward'].includes(c.id) ? R('cbr', `Barclays Cashback Rewards gives up to 15% back at selected retailers. You have ${gbp(Math.max(0, 12.6 - (a.cs.cbr?.redeemed || 0)))} ready to use.`, ['Checked your cashback']) : R('offers', 'Barclays Cashback Rewards is for personal Visa cards. Gratifi’s offers still work on this card.', ['Checked your offers'])
  if (c.id === 'amazon' && has('move my rewards', 'transfer my rewards', 'use my rewards', 'spend my rewards', 'amazon gift card', 'redeem')) return R('amazon', `You have ${gbp(a.prog.earned - (a.cs.amazonMoved || 0))} ready to move to your Amazon account, in £5 steps. It usually arrives within two hours.`, ['Checked your rewards'])
  if (has('emergency cash', 'stuck abroad', 'lost abroad')) return R('abroad', c.business ? 'Block the card in the app, then call the cardholder line on 0800 008 008, at any time.' : 'Call +44 1604 230 230, at any time. You can get emergency cash of up to £1,000 a week, usually within 24 hours, and a temporary card within three working days.', ['Checked emergency help'])
  if (has('paperless', 'paper statement')) return c.business ? R('statement', 'Statements are in the app, to download as PDF or CSV.', ['Checked your statements']) : R('statement', a.cs.paperless === false ? 'Your statements come by post as well as in the app. You can go paperless in Statements.' : 'Your statements are paperless, in the app. You can ask for paper copies in Statements, free.', ['Checked your statement settings'])
  if (has('automatic increase', 'stop limit increase', 'limit increase offer', 'dont want more credit')) return c.business ? R('limit', 'Your account administrator sets limits. You can ask for a change in Credit limit.', ['Checked your settings']) : R('limit', 'Choose how limit increases work in Credit limit: automatic, ask each time, or none.', ['Checked your settings'])
  if (has('accessib*', 'braille', 'sign language', 'bsl', 'large print', 'text relay', 'blind', 'deaf')) return c.business ? R('help', 'Call the cardholder line on 0800 008 008 to ask for statements or letters in another format.', []) : R('help', 'Statements and PIN reminders come in braille, large print or audio: 0800 161 5326. There’s British Sign Language through SignVideo, and Text Relay on 18001 0800 161 5276.', [])
  if (has('bereave*', 'passed away', 'died', 'death', 'power of attorney')) return c.business ? R('help', 'I’m sorry. Call the cardholder line on 0800 008 008 and the team will help.', []) : R('help', 'I’m sorry. You can tell Barclaycard through the Death Notification Service or on 0800 161 5199. A Power of Attorney can be registered too.', [])
  if (has('complain*')) return R('help', c.business ? 'Call the cardholder line on 0800 008 008 to make a complaint.' : 'Send a message and you’ll get a reply within 24 hours. You get an update at 4 weeks and a final response by 8 weeks; after that you can go to the Financial Ombudsman Service.', [])
  if (has('close my account', 'close the account', 'cancel my card', 'close my card')) return R('help', 'Message or call the team and they’ll close it once the balance is paid.', [])

  // money
  if (has('direct debit', 'dd', 'autopay', 'automatic payment')) return R('dd', a.cs.dd ? `Your Direct Debit pays ${a.cs.dd.type === 'full' ? 'your full statement balance' : a.cs.dd.type === 'min' ? 'the minimum' : gbp(a.cs.dd.amount || 0)} each month. You can change it here.` : 'You don’t have a Direct Debit yet. Set one up and it pays on the due date each month.', ['Checked your payments'])
  if (c.charge && has('pay my', 'pay off', 'make a payment', 'pay the', 'pay bill', 'clear my balance', 'pay it', 'minimum', 'due', 'when do i pay', 'next payment', 'how much do i owe', 'owe')) return R('pay', a.stmtLeft > 0 ? `The full ${gbp(a.stmtLeft)} is due ${DUE}: this card is paid in full each month.${a.cs.dd ? ' Your Direct Debit will pay it.' : ''}` : `Your statement is paid. Nothing more is due on ${DUE}.`, ['Checked your statement'])
  if (has('pay my', 'pay off', 'make a payment', 'pay the', 'pay bill', 'clear my balance', 'pay it')) return R('pay', `Your statement balance is ${gbp(a.stmtLeft)} and the minimum is ${gbp(a.minLeft)}, due ${DUE}.`, ['Checked your statement'])
  if (has('minimum', 'due', 'when do i pay', 'next payment', 'how much do i owe', 'owe')) return R('due', a.minLeft > 0 ? `Your minimum payment is ${gbp(a.minLeft)}, due ${DUE}. Your statement balance is ${gbp(a.stmtLeft)}.${a.cs.dd ? ' Your Direct Debit will pay it.' : ''}` : (a.stmtLeft > 0 ? `You’ve paid this month’s minimum. Clearing the other ${gbp(a.stmtLeft)} by ${DUE} avoids interest on purchases.` : `Your statement is paid in full. Nothing more is due on ${DUE}.`), ['Checked your statement'])
  if (has('statement')) return R('statement', `Your latest statement is from Fri 18 Sep, for ${gbp(c.stmt)}. The next one is on ${NEXT_STATEMENT}.`, ['Found your statements'])
  if (has('limit', 'more credit', 'increase')) return R('limit', `Your limit is ${gbp(a.limit, 0)} and you have ${gbp(a.available)} available. Ask for a change and you usually get a decision straight away, or within 24 hours.`, ['Checked your account'])
  if (has('balance transfer', 'transfer a balance', 'money transfer', 'move money', 'transfer')) {
    if (c.id === 'platinum') return R('bt', `${gbp(a.prog.bt)} is at 0% until ${a.prog.btUntil}. Pay your new spending each month plus ${gbp(btPlan(a).monthly, 0)} towards the transfer and it’s cleared in time.`, ['Checked your 0% balance'])
    if (c.business) return R('help', 'Transfers aren’t part of this demo for business cards.', [])
    if (c.id === 'amazon') return R('help', 'Transfers aren’t shown for the Amazon Barclaycard in this demo.', [])
    return R('bt', 'Here’s your transfer offer (demo figures): move a balance from another card, or send money to your bank account. You see the fee and 0% period before you confirm.', ['Checked your offers'])
  }
  if (has('spread', 'instalment', 'installment', 'split the cost', 'pay monthly', 'pay over')) {
    if (c.business) return R('help', 'Instalment Plans are shown for personal Barclaycards in this demo.', [])
    const ok = (x: Txn) => x.amount >= 100 && x.amount <= 5000 && !x.pending && !SPEND_EXCL.includes(x.cat) && !a.cs.plans.some(p => p.txnId === x.id)
    const wantsTv = has('tv', 'television', 'telly')
    const onPlan = a.cs.plans.find(p => wantsTv ? p.merchant === 'Volt Electricals' : names({ merchant: p.merchant } as Txn))
    if (onPlan) return R('spread', `Your ${onPlan.merchant} purchase is already on an Instalment Plan: ${gbp(onPlan.monthly)} a month for ${onPlan.months} months.`, ['Checked your plans'])
    const named = a.txns.find(x => ok(x) && (wantsTv ? x.merchant === 'Volt Electricals' : names(x)))
    const big = a.txns.filter(ok).sort((x, y) => y.amount - x.amount)[0]
    if (named) return R('spread', `Your ${named.merchant} purchase of ${gbp(named.amount)} can go on an Instalment Plan: 0% interest over 3 to 24 months, with a one-off fee.`, ['Checked purchases over £100'], { id: named.id })
    if (wantsTv) return R('spread', big ? `I can’t see a TV on this card. Your largest recent purchase, ${big.merchant} at ${gbp(big.amount)}, could go on an Instalment Plan instead.` : 'I can’t see a TV on this card, and none of your recent purchases are over £100.', ['Checked purchases over £100'], { id: big?.id })
    return R('spread', big ? `Your largest recent purchase, ${big.merchant} at ${gbp(big.amount)}, can go on an Instalment Plan: 0% interest over 3 to 24 months, with a one-off fee.` : 'Purchases from £100 to £5,000 can go on an Instalment Plan. None of your recent ones qualify yet.', ['Checked purchases over £100'], { id: big?.id })
  }
  if (has('balance', 'how much have i got', 'available', 'can i spend', 'afford')) return R('balance', `Your balance is ${gbp(a.balance)}. You have ${gbp(a.available)} available of your ${gbp(a.limit, 0)} limit.`, ['Checked your account'])
  if (has('credit score', 'experian', 'score')) return c.business ? R('help', 'The credit score is shown for personal cards in this demo.', []) : R('score', `Your Experian score is ${c.id === 'forward' ? '735, Fair, and up 86 points since April' : '884, Good'}.`, ['Checked your credit score'])

  // spending
  for (const [cat, words] of Object.entries(CATS)) if (has(...words) && has('spend', 'spent', 'much')) {
    const list = a.purchases(a.txns).filter(x => x.cat === cat || (cat === 'Eating out' && x.cat === 'Client meals'))
    const total = list.reduce((x, y) => x + y.amount, 0)
    return R('spend', list.length ? `You’ve spent ${gbp(total)} on ${cat.toLowerCase()} this month, across ${list.length} payment${list.length === 1 ? '' : 's'}.` : `No ${cat.toLowerCase()} spending on this card this month.`, ['Checked this month’s spending'], { cat })
  }
  if (has('spend', 'spent', 'spending', 'where does my money go')) {
    const total = a.purchases(a.txns).filter(x => x.date >= '2026-09-01').reduce((x, y) => x + y.amount, 0)
    return R('spend', `You’ve spent ${gbp(total)} on this card in September so far.`, ['Checked this month’s spending'])
  }
  // travel comes before merchant matching, so a Lisbon booking doesn't swallow "Lisbon" questions
  const other = c.business ? has('lisbon', 'portugal') : has('amsterdam', 'netherlands')
  if (other) return R('abroad', `I can’t see a trip there on this card. Your next trip is ${c.business ? 'Amsterdam on Tue 6 Oct' : 'Lisbon on Fri 16 Oct'}.`, ['Checked your trips'])
  const fxLine = c.id === 'rewards' ? 'This card has no fees on spending or cash withdrawals abroad, so pay in the local currency.' : c.id === 'avios-plus' ? 'This card adds a 2.99% fee on spending in other currencies. Pay in the local currency, not pounds, to avoid a worse exchange rate.' : c.id === 'premium-plus' ? 'This card charges 0.99% on spending in other currencies, instead of the usual 2.99%. Pay in the local currency, not pounds.' : 'This card adds a 2.99% fee on spending in other currencies. Pay in the local currency, not pounds, to avoid a worse exchange rate.'
  if (has('spain', 'france', 'italy', 'germany', 'greece', 'usa', 'america', 'new york', 'paris', 'rome', 'madrid', 'barcelona', 'europe', 'dubai', 'india')) return R('abroad', `Yes, you can use it abroad. ${fxLine}`, ['Checked your card terms'])
  if (has('abroad', 'foreign', 'euro', 'holiday', 'lisbon', 'portugal', 'amsterdam', 'overseas', 'travel')) {
    if (has('hotel', 'stay')) return hotelReply()
    const fx = c.id === 'rewards' ? 'This card has no fees on spending or cash withdrawals abroad, so pay in euros.' : c.id === 'avios-plus' ? 'This card adds a 2.99% fee on spending in other currencies. Pay in euros, not pounds, to avoid a worse exchange rate.' : c.id === 'premium-plus' ? 'This card charges 0.99% on spending in other currencies, instead of 2.99%, and its travel insurance covers trips paid in full with it.' : 'This card adds a 2.99% fee on spending in other currencies. Pay in euros, not pounds, to avoid a worse exchange rate.'
    return R('abroad', `${c.business ? 'Amsterdam on Tue 6 Oct' : 'Lisbon on Fri 16 Oct'}. ${fx}`, ['Found your trip', 'Checked your card terms'])
  }

  const merch = a.txns.find(x => x.amount > 0 && x.by !== 'gratifi' && x.cat !== 'Card fees' && names(x))
  const elsewhere = !merch && CARDS.flatMap(x => x.txns).find(x => x.cat !== 'Card fees' && names(x))
  if (elsewhere && !has('book', 'offer', 'deal')) return R('txn', `There’s no ${elsewhere.merchant} payment on this card.`, ['Checked your payments'])
  if (merch && !has('book')) return R('txn', `${merch.merchant}, ${gbp(merch.amount)} ${onDay(merch.date)}${merch.pending ? ', still pending' : ''}.`, ['Found the payment'], { id: merch.id })

  // rewards and programme
  if (has('cashback now', 'take my cashback', 'take cashback', 'redeem cashback', 'cash back now')) {
    if (c.reward === 'amazon') return R('rewards', `You’ve earned ${gbp(a.prog.earned)} back so far: 1% at Amazon and 0.5% everywhere else.`, ['Checked your rewards'])
    if (c.reward === 'biz-cashback') return R('rewards', `You’ve earned ${gbp(a.prog.cashback)} cashback this year, towards the £400 yearly cap.`, ['Checked your cashback'])
    if (c.reward === 'biz-monthly') return R('rewards', `Cashback is added to your statement each month, so there’s nothing to claim. About ${gbp(scMonth(a).earned)} so far this month.`, ['Checked your cashback'])
    return c.reward === 'cashback' ? R('cashback', a.cashback > 0 ? `You have ${gbp(a.cashback)} cashback. Take it now and it comes off your balance.` : 'You’ve already taken this year’s cashback. New cashback builds up from today.', ['Checked your cashback']) : R('rewards', 'This card doesn’t earn cashback, but offers in the app pay money back when you use it.', [])
  }
  if (c.charge && has('lower rate', 'rate drop', 'reduce my interest', 'less interest', 'avoid interest', 'interest', 'apr')) return R('fees', `There’s no interest on this card: the balance is paid in full each month. The fee is ${c.fee.split(',')[0]}.`, ['Checked your rates'])
  if (c.id !== 'forward' && has('lower rate', 'rate drop', 'rate go down', 'reduce my interest', 'less interest', 'avoid interest')) return R('fees', `Purchases are charged at ${c.purchaseRate}. Pay your full statement balance by the due date each month and you won’t pay interest on purchases.`, ['Checked your rates'])
  if (has('voucher', 'upgrade', 'companion', 'welcome bonus', 'bonus', 'threshold', 'price promise', 'rate drop', 'rate go down', 'lower rate', 'reduce my interest', 'less interest', 'avoid interest')) {
    if (c.id === 'avios-plus') { const v = voucher(a); return R('goal', v.left > 0 ? `You’ve spent ${gbp(v.spent, 0)} of £10,000 this card year. ${gbp(v.left, 0)} more by ${v.by} earns your cabin upgrade voucher.` : 'You’ve earned your upgrade voucher.', ['Checked your card year']) }
    if (c.id === 'avios') { const w = aviosWelcome(a); return R('goal', w.left > 0 ? `${gbp(w.left, 0)} more by ${w.by} and your 5,000 Avios welcome bonus is added. For the upgrade voucher you need £20,000 in a card year.` : 'You’ve earned your welcome bonus.', ['Checked your welcome bonus']) }
    if (c.id === 'select-cashback') { const m = scMonth(a); return R('goal', m.left > 0 ? `You’ve spent ${gbp(m.spent)} this statement month. Reviews say cashback is paid in months over £2,000, so ${gbp(m.left)} more by ${m.by}.` : `You’re over £2,000 this month, so about ${gbp(m.earned)} cashback is due on ${m.by}.`, ['Checked this month’s spending']) }
    if (c.id === 'forward') return R('goal', `${a.prog.onTime} payments on time so far. Keep paying on time and stay in your limit until ${a.prog.anniversary}, and your rate drops to ${a.prog.to}%. ${a.prog.needed - a.prog.onTime} due dates to go.`, ['Checked your payments'])
    return R('rewards', 'This card doesn’t have a spend goal, but offers and partner bookings in the app pay money back.', [])
  }
  if (has('what can i do with my avios', 'use my avios', 'spend avios', 'redeem avios', 'avios for')) return c.reward === 'avios' ? R('avios', `You have ${fmtInt(a.prog.aviosBalance)} Avios in your British Airways account. Here’s what that could cover. Reward flights are booked with British Airways.`, ['Checked your Avios']) : R('rewards', 'This card doesn’t collect Avios.', [])
  if (has('avios', 'points', 'rewards', 'cashback', 'earn', 'how much have i earned')) {
    if (c.reward === 'avios') return R('rewards', `You have ${fmtInt(a.prog.aviosBalance)} Avios, earning ${c.rateText} on this card.`, ['Checked your Avios'])
    if (c.reward === 'cashback') return R('rewards', `You’ve built up ${gbp(a.cashback)} cashback this year at 0.25%. It’s paid once a year, or when you ask.`, ['Checked your cashback'])
    if (c.reward === 'amazon') return R('rewards', `You’ve earned ${gbp(a.prog.earned)} back: 1% at Amazon and 0.5% everywhere else.`, ['Checked your rewards'])
    if (c.reward === 'biz-cashback') return R('rewards', `You’ve earned ${gbp(a.prog.cashback)} cashback this year. The cap is £400, so ${gbp(a.prog.cap - a.prog.cashback)} is still to earn.`, ['Checked your cashback'])
    if (c.reward === 'biz-monthly') { const m = scMonth(a); return R('rewards', `1% cashback, no cap, added each month. You’ve spent ${gbp(m.spent)} since your last statement, about ${gbp(m.earned)} back. ${m.left > 0 ? `Reviews say you need £2,000 in the month: ${gbp(m.left)} to go by ${m.by}.` : 'That’s over the £2,000 reviews say is needed.'} Last month you got ${gbp(m.last)}.`, ['Checked this month’s spending']) }
    return R('offers', 'This card doesn’t earn rewards. Offers in the app still pay money back when you use it.', ['Checked your offers'])
  }
  if (has('0%', 'zero percent', 'interest free', 'promo', 'promotional')) {
    if (c.id === 'platinum') return R('bt', `${gbp(a.prog.bt)} is at 0% until ${a.prog.btUntil}.`, ['Checked your 0% balance'])
    if (a.prog.zeroUntil) return R('promo', `0% on purchases runs until ${a.prog.zeroUntil}.`, ['Checked your rates'])
    return R('fees', 'This card has no 0% period running at the moment.', ['Checked your rates'])
  }
  if (has('fee', 'interest', 'apr', 'rate')) return R('fees', `${c.fee.startsWith('No') ? 'There’s ' + c.fee.toLowerCase() : 'The card fee is ' + c.fee}. ${c.charge ? 'There’s no interest: the balance is paid in full each month.' : `Purchases are charged at ${c.purchaseRate}.`}${c.business ? '' : ' Paying late costs £12.'}`, ['Checked your rates and fees'])
  if (has('cover', 'benefit', 'perk', 'protection', 'come with', 'comes with', 'entitled', 'what do i get')) return R('benefits', `${benefitsFor(c.id).length} things come with your ${c.short} card. Here are the main ones.`, ['Checked your card benefits'])
  if (has('offer', 'deal', 'discount', 'money back')) return R('offers', `${a.offersFor.length} offers for you. Add one and it applies when you pay with this card.`, ['Checked your offers'])
  if (has('hotel', 'stay', 'room')) return hotelReply()
  if (has('tour', 'experience', 'spa', 'things to do', 'taxi', 'ride', 'airport')) return c.business ? R('experiences', 'For Amsterdam there’s an airport transfer at Schiphol, with the invoice sent to your business.', ['Found your trip', 'Checked partner experiences']) : R('experiences', 'A few things for your Lisbon weekend, each with money back when you book here.', ['Found your trip', 'Checked partner experiences'])
  if (has('restaurant', 'table', 'dinner', 'eat out')) return R('dining', c.business ? 'A table for four in the Jordaan on Wed 7 Oct. Free to book, with 10% back when you pay with your card.' : 'A table for two in Alfama on Sat 17 Oct. Free to book, with 10% back when you pay with your card.', ['Checked restaurant partners'])
  if (has('cinema', 'film', 'movie', 'ticket', 'concert', 'festival', 'gig', 'entertainment', 'presale')) return c.business ? R('tickets', 'Barclaycard Entertainment gives business Mastercard holders early access and 10% off tickets at selected festivals.', ['Checked Barclaycard Entertainment']) : R('tickets', 'Barclaycard Entertainment gives early access and 10% off at selected festivals. Cinema tickets are here too.', ['Checked Barclaycard Entertainment', 'Checked partner tickets'])
  if (has('gift card', 'gift', 'present')) return c.business ? R('fallback', 'Gift cards aren’t part of the business offers in this demo.', []) : R('gifts', 'A gift card that arrives by email in minutes, with 6% back.', ['Checked partner gift cards'])
  if (has('cancel', 'my booking', 'bookings', 'refund')) return R('bookings', a.cs.bookings.some(b => b.status === 'booked') ? 'Here’s what you’ve booked. Open one to cancel it.' : 'You haven’t booked anything with Gratifi yet.', ['Checked your bookings'])
  if (has('apple pay', 'google pay', 'wallet', 'phone to pay')) return R('wallet', c.id === 'amazon' ? 'This card works with Google Pay, not Apple Pay. Contactless payments go up to £100.' : c.reward === 'avios' ? 'This card works with Apple Pay and Google Pay. Contactless payments go up to £100.' : c.business ? 'Business cards work with Apple Pay. Add your card to Apple Wallet and pay with your phone or watch.' : has('google', 'android') ? 'Google Pay isn’t available on this card. On Android, use Barclaycard Contactless Mobile instead.' : 'Add your card to Apple Wallet and pay with your phone or watch. On Android, use Barclaycard Contactless Mobile.', [])
  if (has('cardholder', 'add my partner', 'second card', 'employee', 'extra card')) return R('cardholder', c.business ? (a.cs.cardholders.length ? `You have ${a.cs.cardholders.length} employee card${a.cs.cardholders.length === 1 ? '' : 's'}. You can add another and set its limit.` : 'You don’t have any employee cards yet. You can add one and set its limit.') : 'You can add a cardholder. Their spending shows on your statement and counts towards your limit.', ['Checked your cardholders'])
  if (has('alert', 'notification', 'remind', 'reminder')) return R('alerts', 'Choose which alerts you get.', [])
  if (has('human', 'person', 'agent', 'call', 'complain', 'help', 'speak to')) return R('help', 'I can put you through to the Barclaycard team, or you can message them here.', [])
  if (has('hello', 'hi', 'hey', 'what can you do', 'who are you')) return R('hello', `Hi ${MEMBER.first}. Ask me about your balance, payments, benefits, rewards or offers, or ask me to book something. I won’t spend anything without asking you.`, [])
  return R('fallback', 'I’m not sure I’ve got that. Did you mean one of these?', [])

  function hotelReply(): Parsed {
    if (c.business) return R('hotels', hasHotel(a) ? 'Your Amsterdam hotel is booked. Here it is.' : 'One canal-side partner hotel for your Amsterdam trip, Tue 6 to Thu 8 Oct, with 6% back.', ['Found your trip', 'Checked partner hotels'])
    const back = c.reward === 'avios' ? 'Each gives extra Avios when you book here.' : 'Each gives 5% back when you book here.'
    return R('hotels', hasHotel(a) ? 'Your Lisbon hotel is booked. Here are the others anyway.' : `Three partner hotels for Lisbon, Fri 16 to Sun 18 Oct. ${back}`, ['Found your trip', 'Checked partner hotels'])
  }
}

export function suggestions(s: State): string[] {
  const c = acct(s).c
  const base = ['When’s my payment due?', 'Freeze my card']
  const byCard: Record<string, string[]> = {
    'avios-plus': ['How close am I to my upgrade voucher?', 'What can I do with my Avios?', 'Find a hotel in Lisbon'],
    avios: ['How close am I to my welcome bonus?', 'Find a hotel in Lisbon', 'What can I do with my Avios?'],
    rewards: ['Can I use this card in Lisbon?', 'Take my cashback now', 'Find a hotel in Lisbon'],
    amazon: ['When does my 0% end?', 'How much have I earned?', 'Any offers for me?'],
    platinum: ['How do I clear my balance transfer?', 'Spread the cost of my TV', 'Any offers for me?'],
    forward: ['When does my rate go down?', 'What’s my credit score?', 'Any offers for me?'],
    'premium-plus': ['What does my card cover for Amsterdam?', 'Book a hotel in Amsterdam', 'How much cashback have I earned?'],
    'select-cashback': ['Will we get cashback this month?', 'How much did we spend on software?', 'Any offers for us?'],
    'select-charge': ['What does the card cover?', 'How much did we spend on software?', 'Add an employee card'],
  }
  return [...byCard[c.id], ...base]
}

/** The facts a live model may use. Nothing outside this list may appear in its reply. */
export function facts(s: State) {
  const a = acct(s); const c = a.c
  const f: string[] = [
    `Member: ${MEMBER.first}. Today: Monday 28 September 2026.`,
    `Card: ${c.name}${c.business ? ` (business, ${MEMBER.company})` : ''}, ending ${a.cardLast4}. ${a.cs.frozen ? 'Card is FROZEN.' : 'Card is active.'}`,
    `Balance ${gbp(a.balance)}; available ${gbp(a.available)}; limit ${gbp(a.limit, 0)}.`,
    `Statement Fri 18 Sep: ${gbp(c.stmt)}; left to pay ${gbp(a.stmtLeft)}; minimum left ${gbp(a.minLeft)}; due ${DUE}. Next statement ${NEXT_STATEMENT}.`,
    `Direct Debit: ${a.cs.dd ? a.cs.dd.type + (a.cs.dd.amount ? ' ' + gbp(a.cs.dd.amount) : '') : 'none'}.`,
    `Earns: ${c.rateText}. Fee: ${c.fee}. Purchase rate: ${c.purchaseRate}. ${c.id === 'rewards' ? 'No fees abroad.' : c.id === 'premium-plus' ? 'Foreign fee 0.99%.' : 'Foreign fee 2.99%.'}`,
    `Benefits: ${c.benefits.map(b => `${b.t} (${b.s})`).join('; ')}.`,
  ]
  const p = a.prog
  if (c.reward === 'avios') f.push(`Avios in British Airways account: ${fmtInt(p.aviosBalance)}. Card-year spend ${gbp(voucher(a).spent, 0)} of ${gbp(p.voucherAt, 0)} for the upgrade voucher, by ${p.yearEnds}.`)
  if (c.id === 'avios') { const w = aviosWelcome(a); f.push(`Welcome bonus: ${gbp(w.spent, 0)} of £1,000 spent; ${gbp(w.left, 0)} to go by ${w.by} for 5,000 Avios.`) }
  if (c.reward === 'cashback') f.push(`Cashback built up this year: ${gbp(a.cashback)}.`)
  if (c.id === 'amazon') f.push(`Rewards earned ${gbp(p.earned)}. 0% on purchases until ${p.zeroUntil}. Rate elsewhere drops to 0.25% on ${p.rateDrops}.`)
  if (c.id === 'platinum') f.push(`Balance transfer: ${gbp(p.bt)} at 0% until ${p.btUntil}. Plan: pay new spending each month plus ${gbp(btPlan(a).monthly, 0)} towards the transfer.`)
  if (c.id === 'forward') f.push(`Price Promise: ${p.onTime} payments on time so far, ${p.needed - p.onTime} due dates left before ${p.anniversary}; if all are on time and within the limit, the rate falls from ${p.from}% to ${p.to}%. Credit score 735, Fair.`)
  if (!c.business && c.id !== 'forward') f.push('Credit score 884, Good.')
  if (c.id === 'premium-plus') f.push(`Cashback ${gbp(p.cashback)} of £400 cap. Employee cards: ${a.cs.cardholders.map(x => `${x.name} ending ${x.last4}`).join(', ')}.`)
  if (c.id === 'premium-plus') f.push('Travel insurance only applies when the whole trip is paid with the card. Claims within 45 days.')
  if (c.id === 'select-cashback') { const m = scMonth(a); f.push(`Cashback 1%, uncapped, credited monthly. This statement month (since your statement on Fri 18 Sep): ${gbp(m.spent)} spent, about ${gbp(m.earned)} cashback. Reviews (not Barclaycard) say cashback needs £2,000 of spend in the month: ${gbp(m.left)} to go by ${m.by}. Last month's cashback ${gbp(m.last)}.`) }
  if (c.charge) f.push('Charge card: the statement is paid in full each month, with up to 38 days interest-free. No interest. £42 a year.')
  f.push(`Trip: ${c.business ? 'Amsterdam, flights paid on this card, Tue 6 to Thu 8 Oct' : 'Lisbon, flight paid on this card, Fri 16 to Sun 18 Oct'}; hotel ${hasHotel(a) ? 'booked with Gratifi' : 'not booked yet'}.`)
  f.push(`Bookings with Gratifi: ${a.cs.bookings.filter(b => b.status === 'booked').map(b => CONTENT.find(i => i.id === b.itemId)?.title).join(', ') || 'none'}.`)
  f.push(`Recent payments: ${a.txns.slice(0, 8).map(x => `${x.merchant} ${gbp(x.amount)} ${x.date}${x.pending ? ' pending' : ''}`).join('; ')}.`)
  f.push(`Offers: ${a.offersFor.map(o => `${o.rate} at ${o.brand}`).join('; ')}.`)
  f.push(`Partner content (added by Gratifi, paid by card): ${CONTENT.filter(i => !!i.biz === !!c.business).map(i => `${i.title} ${i.price ? gbp(i.price, 0) : 'free to book'}, ${Math.round(i.partnerRate * 100)}% back`).join('; ')}.`)
  f.push(`Instalment Plan fees: ${Object.entries(FEES).map(([m, r]) => `${m} months ${Math.round(r * 100)}%`).join(', ')}; purchases £100 to £5,000; up to 10 plans; personal cards only.`)
  f.push(`Everything with this card: ${benefitsFor(c.id).map(b => `${b.title} (${b.line})`).join('; ')}.`)
  f.push(`Phone: ${c.business ? 'cardholder line 0800 008 008 (24/7); fraud 0800 015 9059' : 'customer services 0800 151 0900; from abroad +44 1604 230 230 (24/7); fraud 0800 318 665; money worries 0800 056 1411'}.`)
  f.push(`Minimum payment rule: the higher of 1% of the balance plus interest and fees, or £5.${c.charge ? ' Not for this card: it is paid in full.' : ''}`)
  return f.join('\n')
}

export async function askLive(q: string, s: State, history: { role: string; text: string }[]): Promise<{ intent: string; text: string } | null> {
  try {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 9000)
    const r = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q, facts: facts(s), intents: INTENTS, history: history.slice(-6) }), signal: ctl.signal })
    clearTimeout(tm)
    if (!r.ok) return null
    const j = await r.json()
    if (!j || typeof j.text !== 'string' || (!INTENTS[j.intent] && !['hello', 'fallback'].includes(j.intent))) return null
    return { intent: j.intent, text: j.text }
  } catch { return null }
}
