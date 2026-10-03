# Gratifi – team handoff

Oct 1, 2026 · @Amit Chawla

## What it is

Gratifi is a working prototype of a rewards and shopping assistant that lives inside a bank's credit card app. The customer types or taps what they want, and the assistant books, buys, pays or changes card settings for them. Answers come back as cards that work like familiar apps.

- **Try it:** [Gratifi prototype](https://claude.ai/artifact/PnL2cqt2NU8tFYp8MDMKaj). Open it on a phone, or in a narrow browser window.
- **Code:** [github.com/amitchawla04/gratifi](https://github.com/amitchawla04/gratifi).
- **Status:** pilot-ready prototype. The bank, partners and brands are all made up. No real money moves and no real customer data is used.

**Install it like an app:** open [gratifi-main.vercel.app](https://gratifi-main.vercel.app) on a phone. On iPhone, tap Share, then Add to Home Screen. On Android, tap Install app. It opens full screen and works offline. On Vercel it runs on the built-in engine, because Live AI only works inside Claude.

The screens follow the approved 27 Sep design and lead with the card. Home opens on the card (balance, limit used, bill due, Pay and Freeze), quick actions and card benefits. It then opens out into points, Gratifi's note, Spend your points, offers and picks. My card holds payment and Direct Debit, spending, transactions, every benefit, controls and help. You (your initial) holds settings and the demo controls. The bell opens Alerts. The ask bar sits at the bottom of every screen, and all real work goes through the assistant.

## How to try it

Open the link and type in the ask bar at the bottom. Type a request the way a customer would, for example "flights to Dubai next Friday for 2 adults", or tap a banner on Home.

1. **Switch market:** You (your initial at the top of Home) → Market and language. Each market keeps its own demo bank, so balances and bookings stay separate.
2. **AI mode:** the label at the top of the chat shows the mode. "Live AI" means Claude is answering through the app's own tools. "Built-in engine" is the offline backup. The first message asks you to allow Claude; allow it to see the real product.
3. **Confirm sheet:** money, points and card changes only move after a confirm sheet that mimics the bank's check.
4. **Demo controls** (on You) mimic what the bank would send: points coming in, a card payment, a suspicious payment, a declined card, a supplier outage, a delayed or delivered order, a cancelled flight, and a return window ending.
5. **Reset demo** (on You) clears everything in the current market.

| Market | Language | How payments are approved |
| --- | --- | --- |
| UK | English | Face ID (simulated) |
| EU (Ireland) | English | Face ID (simulated) |
| India | English | One-time code. Demo code: 482193 |
| UAE | English | Face ID (simulated) |
| UAE (Arabic) | Arabic, right to left | Face ID (simulated) |
| Singapore | English | Face ID (simulated) |
| Malaysia | English | Approval in the bank app (simulated) |

In India, three wrong codes pause payments for 15 minutes, and the pause holds across reloads.

## What it covers

There are 19 categories, all handled end to end, in all 7 markets.

| Area | Categories |
| --- | --- |
| Card and help | My card (pay, freeze, statements, limits, Direct Debit, controls, disputes, lost or stolen, fraud), Card benefits, Concierge |
| Points | Points and miles transfers, Grow points (licensed partner, risk note), Give (donate points), Challenges |
| Travel | Flights, Stays, Airport (lounges, fast track), Rides and rail (rides, trains, car hire), Experiences, Travel essentials |
| Everyday | Dining, Groceries (15-minute delivery), Shopping, Gift cards, Subscriptions, Events |

**Two AI modes**

- **Live AI (main mode):** Claude answers through 16 app tools, such as search\_flights, prepare\_checkout, card\_control and talk\_to\_person. Claude only works through these tools. It cannot move money or change the card itself.
- **Built-in engine (backup):** a keyword engine for when Claude is unavailable. It covers the same flows, but it misreads more unusual wording.

**Care and safety:** in both modes, a fixed check runs before anything else. It spots crisis, overdose, emergency, abuse, coercion and scam messages, in English and in standard and Gulf Arabic. It then shows the market's helpline or emergency number (998 in the UAE). In Live AI mode, Claude runs a second check on top of this.

## Modules and the bank connection

Every service is a module that switches on only when the bank offers the APIs behind it. If an API is missing, the service is gone from the app: no screen, no button, and no chat answer offering it.

| Group | Modules | Bank APIs they need |
| --- | --- | --- |
| Card | Card overview, Pay your bill, Direct Debit, Statements, Transactions, Freeze and controls, Spending limits, Card details, PIN, Lost/stolen/damaged and replacement, Activation, Phone wallet, Travel notice, Gambling block, Credit limit, Disputes, Card benefits | Accounts, transactions, statements, bill payment, mandates, card controls, category limits, card details, PIN view, replacement, activation, tokenisation, travel notices, blocks, credit limit, disputes, benefits |
| Rewards | Points and tier, Card offers, Challenges, Points transfers, Grow points, Give | Points ledger, redemption, transfers, card-linked offers, challenges |
| Partners | Flights, Stays, Airport, Rides and rail, Travel essentials, Experiences, Dining, Events, Groceries, Shopping, Gift cards, Subscriptions, Concierge | Travel, lifestyle, retail, wealth and charity partners; concierge; travel essentials |

- **One filter for the chat.** Both the built-in engine and Live AI pass every answer through the same check, so the assistant can't offer a service the bank doesn't have. It says plainly that the service isn't available here and offers a person.
- **One bank layer.** Screens and flows call `gratifi/src/bank.ts`, not the store. It answers from a mock bank today. A real bank plugs in by implementing the same calls against its APIs (29 API ids in `modules.ts`).
- **Card screens.** My card now opens 14 servicing screens in the approved design language: pay (full, minimum, other amount), statements by month with download, all transactions with search and filters, payment detail, card number and security code behind a check, PIN, monthly spending limits by category, lost/stolen/damaged with freeze-first and a new card tracked to activation, disputes with reason, amount, notes and a receipt, your cases, credit limit (lower now, or ask for more), phone wallet, and travel notices.
- **Try it.** You, then Demo controls, then Bank connections: switch any API off, or pick Card only, Card and points, or Rewards only. Demo controls can also deliver a new card and have the bank decide disputes and limit requests.

**Live AI on the web.** The Vercel link (project-95d8n.vercel.app) reaches Claude through `api/claude.js`, a server function that holds the API key and picks the model: a fast model for short messages, a stronger one for longer requests. The app runs the tool loop and keeps every safety layer. Until `ANTHROPIC_API_KEY` is set in the Vercel project, the built-in engine answers. Set a monthly spend limit on the key: the endpoint has a per-IP rate limit but no customer sign-in yet.

**Chat answer cards.** Every answer in the chat now follows an approved screen: results as Hotels (Best match card, then picture rows), details as Cinema (picture, points line, orange-check bullets, one black button), a short checkout that opens the Confirm sheet, success as Booked, passes as Tickets with a code, problems as the yellow sticky note. Prices read "8,200 points" first with cash in grey. Each catalogue item has its own drawing (`gratifi/src/scenes.ts`).

**Voice and scrolling.** The mic opens the approved Listening screen and uses the phone's own speech recognition in the market's language; nothing is recorded. Each screen remembers where you scrolled, and a reload returns to the same screen.

## How it is built

The app is React 18 in TypeScript. It is bundled with esbuild into one self-contained HTML file of about 2 MB, with no server. The demo bank lives in the browser's local storage, kept separately for each market.

&#91;embedded content: how a message is handled · 2 AI modes, 1 safety check\]

A risky message gets a helpline or emergency card straight away. Anything that moves money or changes the card stops at the confirm sheet.

| File | What it does |
| --- | --- |
| `gratifi/src/main.tsx` | Starts the app and holds the tab layout |
| `gratifi/src/screens.tsx` | Home, Explore, chat, Wallet and My card screens, including demo controls |
| `gratifi/src/brain.ts` | Live AI mode: the Claude rules, the 16 tools, the second safety check, and the reply filters (no false "done" claims, no sales words) |
| `gratifi/src/flows.ts` | Built-in engine and all flow logic: the fixed safety check, search, checkout, bookings, card servicing, and validation |
| `gratifi/src/render.tsx` | The answer cards: flights, stays, baskets, checkout, confirm sheet, receipts, crisis and emergency cards |
| `gratifi/src/store.tsx` | Demo bank and app state: balance, points, ledger, bookings, card settings |
| `gratifi/src/catalog.ts` | Demo catalogue and prices for every market |
| `gratifi/src/ar.ts`, `ar-dict.ts` | Arabic: translating Arabic input to English, and the Arabic text shown on screen |
| `kit/src/*` | Shared design kit: components, icons, market formats (money, dates), strings, styles |

**Build:** run `npm install` in `kit`, then `python3 gratifi/build.py`. This writes `gratifi/build/gratifi.html` (the published page), `test.html` (for local testing) and `test-ai.html` (with a pretend Claude for testing the AI plumbing).

**Rules built into the code:**

- Every payment is checked against available credit.
- Amounts, dates, quantities and emails are checked on both the button and AI paths.
- Cancellation terms are enforced on a timer.
- Receipts are frozen at the moment of payment.
- Claude's replies are filtered as they stream, so it cannot say it booked, paid or froze something unless that actually happened.

## Testing

The last full test run (2 Oct, with the card hub, voice and the new chat cards) passed in every market. The engine tests ran 582 cases each in UK, EU, India, Singapore and Malaysia, and 755 each in UAE and UAE Arabic. All 140 journey scripts passed and no Arabic text was missing. Journey scripts were updated for the new card markup (offer rows, tiles, the risk switch instead of a tick box).

| Test | What it checks | How to run |
| --- | --- | --- |
| `gratifi/engine.js` | Types hundreds of customer phrases into the built-in engine, safety phrases included, and checks the answer card that comes back | `node engine.js UK` (or a comma-separated list of markets) |
| `gratifi/drive.js` + `scripts.js` | 20 end-to-end journeys per market: browse, flights, stays, dining, groceries, shopping, gifts, subscriptions, events, airport, rides, experiences, card, points, essentials, concierge, problems, managing bookings, and cards (every card servicing screen, then bank APIs switched off) | `./drives.sh` (all markets), or `node drive.js UK flight` |
| `gratifi/engall.sh` | Engine tests for all 7 markets, then all journeys | `./engall.sh` |
| `gratifi/review/ai.js` + `test-ai.html` | Live AI plumbing with a pretend Claude: tool calls, holding answers until the safety check, and reply filters | `node review/ai.js` |

The tests use Playwright and Chromium. The scripts load Playwright from a fixed install path on line 2. Change that line to `require('playwright')` once it is installed on your machine.

Independent review rounds scored the product 8.0 to 8.7 out of 10. Money and points scored 9 to 9.5 in every round.

## Known gaps and next steps

What holds the score below 9 is mostly the backup engine misreading unusual wording, plus a few gaps against the best consumer apps.

| Gap | Where | Next step |
| --- | --- | --- |
| Unusual phrasings, mostly in Gulf Arabic, get the wrong card | Built-in engine only | Turn the backup into a clearly labelled offline mode that relies on buttons and simple requests |
| Arabic text has not been checked by a native speaker | AR market | Native Gulf Arabic review of `ar-dict.ts` and `ar.ts` |
| Hotel lists show no price per night | Stays | Add a per-night price next to the total |
| Return trips show one-way prices on the flight rows | Flights | Show the return total on each row |
| Returns on two airlines are shown as one ticket | Flights | Label them as two separate tickets |
| Restaurant times that have already passed aren't greyed out | Dining | Grey out past slots |
| Rides show one vehicle at a time | Rides | Show vehicle options side by side |

Before a real pilot, the mock bank behind `store.tsx` and bank.ts needs connecting to the bank's real APIs (each call already names the API it needs), and the demo catalogue needs real partners.

- [ ] Decide whether to make the backup engine an offline mode
- [ ] Book a native Arabic review
- [ ] Fix the five product gaps above
- [ ] Run two more review rounds, scored on Live AI mode
