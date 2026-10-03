# Gratifi for Barclaycard: build and handover

Sep 28, 2026 · @Amit Chawla

## Summary

The Barclaycard concept app is live. You pick one of nine real Barclaycard cards, and the app becomes that member's credit card app, with Gratifi built into every screen. It covers the full customer journey:

- balance, payments, Direct Debit and statements
- card controls: freeze, PIN, card details, lost or stolen
- credit: limit, transfers and Instalment Plans
- benefits, rewards or Avios, offers and bookings
- an assistant that answers questions and books things

Member data is demo data. Card terms come from Barclaycard's public pages, checked on 28 Sep 2026.

| What | Link | Notes |
| --- | --- | --- |
| Live app | [project-95d8n.vercel.app/barclaycard](https://project-95d8n.vercel.app/barclaycard/) | Opens in a phone frame on desktop, full screen on a phone. Can be added to the Home Screen. |
| Earlier generic bank demo | [project-95d8n.vercel.app](https://project-95d8n.vercel.app/) | Unchanged, same project |
| Code | [amitchawla04/frontend-arsenal, branch gratifi-app](https://github.com/amitchawla04/frontend-arsenal/tree/gratifi-app) | App in `bcard/`, live model endpoint in `api/ask.js` |
| Pitch deck | [Gratifi by R360 deck](https://claude.ai/artifact/LP7MN2yBMkUbaXur4FEqas) | Separate artifact |

Status: built, put through three rounds of independent review, fixed, and deployed. The assistant runs on a built-in engine today. Adding one key in Vercel switches on a live model; section 7 explains how.

&#91;image: The app on desktop: the phone frame and demo controls\]

## How to open and demo it

Open the link on a phone, pick a card, and follow the eight steps below. The whole demo takes about five minutes.

**Install on an iPhone.** Open [the app](https://project-95d8n.vercel.app/barclaycard/) in Safari, tap Share, then Add to Home Screen. It installs as "Gratifi Card" and opens full screen. **On desktop,** the same link shows a phone frame, with buttons on the left to switch card or reset the demo.

**Reset.** In the app, go to More, then Reset this card, or Switch card. The demo remembers what you did on each card until you reset it.

**Demo script (Avios Plus):**

1. **Choose a card.** Tap Barclaycard Avios Plus, and a quick Face ID check opens it.
2. **Turn Gratifi on.** On Home, tap Turn on in the Meet Gratifi note. The yellow note changes to "£1,840 to go": the upgrade voucher progress, worked out from this card year's spending.
3. **Everyday banking.** Tap Pay, then choose Statement balance and confirm with Face ID. The balance and payment card update. Then tap Freeze and watch the card go frosted.
4. **Spending.** Open the Spending tab and tap Hearth & Co. Show Report a problem, then go back.
5. **Card tab.** Show card details and View PIN, both behind Face ID. Open Instalment Plans, spread the £649 Volt Electricals purchase over 6 months, and show the new monthly figure.
6. **Rewards.** Show the Avios balance and voucher progress, which come from the card. Then show the Added by Gratifi layer underneath: add an offer, open Hotels, pick Casa do Rio, choose 3 months at checkout, and confirm. The booked screen appears, with an 8-second Undo.
7. **Ask Gratifi.** Use the bar at the bottom of any screen. Try "When's my payment due?", "Spread the cost of my TV" and "Can I use this card in Lisbon?"
8. **Switch card.** Go to More, then Switch card, and pick Platinum, then Premium Plus. The same app turns into a balance transfer plan, then a business card with employee cards and an Amsterdam trip.

**What to say while demoing:** the servicing screens are what the bank's app already does, rebuilt. Anything with the orange spark or the "Added by Gratifi" label is what Reward360 brings.

## Research: the Barclaycard card range

Barclaycard sells nine personal and business cards in the UK that matter for this app. They split into four engagement types: Avios earners, cashback earners, low-rate cards with no rewards, and business cards. The app has one member profile per card below. Figures were checked on 28 Sep 2026 and change often, so re-check them before any external use.

| Card | Type | Fee | Earns | Headline terms | Source |
| --- | --- | --- | --- | --- | --- |
| [Barclaycard Avios Plus](https://www.barclaycard.co.uk/personal/credit-cards/avios-plus) | Avios, Mastercard | £20 a month | 1.5 Avios per £1 | 25,000 Avios for £3,000 spend in 3 months; upgrade voucher or 7,000 Avios at £10,000 spend in a card year; lounge passes at £18.50; 2.99% abroad; 29.9% purchase rate, 80.1% APR representative | Barclaycard |
| [Barclaycard Avios](https://www.barclaycard.co.uk/personal/credit-cards/avios) | Avios, Mastercard | None | 1 Avios per £1 | 5,000 Avios for £1,000 spend in 3 months; upgrade voucher or 7,000 Avios at £20,000 spend; 29.9% APR representative | Barclaycard |
| [Barclaycard Rewards](https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-rewards) | Cashback, Visa | None | 0.25% cashback | Cashback paid once a year or on request; no fees on spending or cash abroad; 28.9% APR representative | Barclaycard, ClearScore |
| [Amazon Barclaycard](https://www.barclaycard.co.uk/personal/help/credit-cards/amazon-earn-rates) | Cashback (Amazon), Visa | None | 1% at Amazon, 0.5% elsewhere (0.25% after 12 months) | Rewards move to Amazon in £5 steps; 0% on purchases for 6 months; £20 Amazon gift card welcome; Google Pay, no Apple Pay; app-only; 28.9% APR representative | Barclaycard |
| [Barclaycard Platinum](https://www.barclaycard.co.uk/personal/credit-cards) | No rewards, Visa | None | Nothing | Four variants: 0% balance transfers for 12, 20 or 29 months, or 21 months on purchases and transfers; transfer fees 0% to 3.45%; 24.9% APR representative | Barclaycard |
| [Barclaycard Forward](https://www.barclaycard.co.uk/personal/credit-cards/forward) | Credit building, Visa | None | Nothing | Price Promise: rate cut by 3% after year one and 2% more after year two; limits £50 to £1,200; 0% for 3 months; 33.9% APR representative | Barclaycard |
| [Premium Plus](https://www.barclaycard.co.uk/business/cards/credit-cards/premium-plus) | Business, Mastercard | £150 a year per account, extra cards free | 0.5% cashback, up to £400 a year | Travel insurance when the whole trip is on the card; purchase protection; misuse cover; 0.99% abroad; 19.6% purchase rate, 56.0% APR representative | Barclaycard |
| [Select Cashback](https://www.barclaycard.co.uk/business/cards/credit-cards/select-cashback) | Business, Mastercard | None | 1% cashback, uncapped, paid monthly | Reviews say cashback needs £2,000 in the month; purchase protection up to £6,000 a claim; free employee cards; 27.5% APR representative | Barclaycard, Head for Points |
| [Select Charge](https://www.barclaycard.co.uk/business/cards/charge-cards/select) | Business charge card, Mastercard | £42 a year | Nothing | Paid in full each month; up to 38 days interest-free; limit £1,000 to £50,000; 3.6% APR representative | Barclaycard |

All customers also get [Barclaycard Entertainment](https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-entertainment) (early access and 10% off tickets at named festivals, 5% off selected events, 10% off food and drink at O2 Academy venues). Visa customers can also use [Barclaycard Cashback Rewards](https://www.barclaycard.co.uk/personal/customer/barclaycard-cashback-rewards) (personalised retailer offers up to 15%, paid out from £5).

## Research: what the Barclaycard app does today

The Barclaycard app covers servicing well: balance, bills, statements, card controls and credit products. What it does not do is help a member get value from their card: no one tells them what their Avios or cashback can do, when a perk is about to matter, or what to book. That gap is where Gratifi sits. Every feature below is rebuilt in the concept app, so the demo feels like a complete card app before Gratifi is added.

| Area | Feature in the Barclaycard app | How the concept app does it | Source |
| --- | --- | --- | --- |
| Account | Check balance, see statements, review a transaction, review spend | Home balance card, Statements, transaction detail, Spending tab | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Payments | Pay your bill, Direct Debit, review payments | Pay flow (minimum, statement, full or custom), Direct Debit setup, payment history | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Card | View PIN, activate card, replacement card | Card tab: view PIN (Face ID step), replace card | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Card | Freeze the card in the app; lost or stolen reported via Help; replacement in seven working days | Freeze toggle, report lost or stolen with new card details shown straight away | [Barclaycard help](https://www.barclaycard.co.uk/personal/help/credit-cards/amazon-barclaycard-lost-stolen) |
| Credit | Request a credit limit change | Limit request with an instant demo decision | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Credit | Balance transfer, money transfer | Balance transfer offer and apply flow | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Credit | Instalment Plan: £100 to £5,000 purchases, 3 to 24 months, 0% interest plus a one-off fee, up to 10 plans | Spread a purchase from its transaction, with fee and new monthly payment shown | [Barclaycard help](https://www.barclaycard.co.uk/personal/help/spending-transactions/instalment-plan-benefits) |
| Credit | Experian Credit Score | Credit score card with a trend | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| People | Additional cardholder | Add a cardholder flow | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |
| Wallets | Apple Pay on Visa cards; Contactless Mobile on Android | Add to Apple Wallet button on the card | [Barclaycard Apple Pay](https://www.barclaycard.co.uk/personal/apple-pay) |
| Alerts | Payment due, balance, near-limit and statement alerts | Alerts settings and a notification centre | [Barclaycard Forward](https://www.barclaycard.co.uk/personal/credit-cards/forward) |
| Rewards | Barclaycard Cashback Rewards (Visa, register on a Visa-run site, up to 15%) | Offers inside the app, added in one tap, no separate site | [Cashback Rewards](https://www.barclaycard.co.uk/personal/customer/barclaycard-cashback-rewards) |
| Rewards | Barclaycard Entertainment (early access, 10% off festival tickets) | Tickets section with early-access events | [Barclaycard Entertainment](https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-entertainment) |
| Help | Contact us, update your details | Help screen and profile | [Barclaycard app](https://www.barclaycard.co.uk/personal/customer/barclaycard-app) |

## What Gratifi adds on top

Gratifi adds three things the Barclaycard app doesn't have:

- **A note on Home for each card.** The yellow note shows the one thing worth knowing today, worked out from that card's own figures.
- **An assistant.** The ask bar sits on every screen. It answers questions about the account and opens the right screen.
- **Offers and bookings, labelled "Added by Gratifi".** Partner offers and bookings are paid on the card, and the partner pays money back or extra Avios on top of what the card already earns.

For cards with no rewards, such as Platinum, Forward and Select Charge, this layer is the only way the member earns anything.

| Card | Gratifi's note on Home | What the Gratifi layer pays |
| --- | --- | --- |
| Avios Plus | £1,840 to the upgrade voucher, and when they'll get there at their usual pace | Extra Avios from partners, plus 1.5 Avios per £1 from the card |
| Avios | £360 to the 5,000 Avios welcome bonus before Sun 1 Nov | Extra Avios from partners, plus 1 Avios per £1 |
| Rewards | Lisbon in 18 days: no fees abroad, no hotel yet. Once the hotel is booked, it offers the £31.64 cashback | 5% back at partner hotels, on top of 0.25% cashback |
| Amazon | 0% on purchases ends Tue 10 Nov; clear the balance first | Partner cashback, on top of 1% or 0.5% |
| Platinum | £561 a month clears the £3,360.50 at 0% by Sun 14 Mar 2027. It spots that the £600 Direct Debit falls short and offers a top-up | Partner cashback on a card that earns nothing |
| Forward | 5 of 10 on-time payments; the rate drops from 33.9% to 30.9% from the March 2027 statement | Partner cashback on a card that earns nothing |
| Premium Plus | Amsterdam trip: flights are on the card, but the insurance needs the whole trip on it, so book the hotel on it too | Partner cashback on top of 0.5% |
| Select Cashback | £816.70 to the £2,000 that reviews say this month's 1% cashback needs, by Sun 18 Oct | Partner cashback on top of 1% |
| Select Charge | £1,640.80 due in full on Mon 12 Oct; the Direct Debit pays it | Partner cashback on a card that earns nothing |

**Content in the demo.** The partners and prices are invented:

- Lisbon: three hotels, a food tour, an airport ride, a spa day and a restaurant table
- Cinema tickets and a fashion gift card
- Business: an Amsterdam hotel, an airport transfer and a client dinner

Barclaycard's own programmes are shown as the card's, not as Gratifi's: Barclaycard Entertainment and Barclaycard Cashback Rewards.

&#91;image: Rewards tab, partner hotels, checkout with Instalment Plan options, and the booked screen\]

## Everything Barclaycard provides, per card

Each card now carries every benefit, protection and service Barclaycard publishes for it: 71 items in all, from 24 on Select Charge to 47 on Avios Plus. They live in one catalogue, `bcard/src/benefits.ts`, with the terms, the cards each applies to, the page it was checked on, and the screen that acts on it.

| Card | Items | Card | Items | Card | Items |
| --- | --- | --- | --- | --- | --- |
| Avios Plus | 47 | Amazon | 43 | Premium Plus | 29 |
| Avios | 46 | Platinum | 43 | Select Cashback | 27 |
| Rewards | 43 | Forward | 44 | Select Charge | 24 |

- **Where members find it.** "Everything with your card" on Home, the Card tab, the Rewards tab and More opens a searchable list grouped into nine areas: Rewards, Offers and entertainment, Protection, Travel, Credit and payments, Card and security, Alerts and statements, Business tools, and Help and support. Each item opens its terms, what to do, a Gratifi note where one helps, and links to where it is published.
- **Working screens added.** Barclays Cashback Rewards, moving Amazon rewards, airport lounges, Barclaycard Entertainment, going abroad and emergency help, security (approve a payment, PINsentry code, how to check it's us), a repayment calculator, changing the payment date, six alerts with settings, a rebuilt Help (money worries, accessibility, Power of Attorney, bereavement, complaints, closing the account), MyControls, Business Rewards, the Premium Plus insurance summary with a trip check, and the Select Cashback monthly tracker. Statements, credit limit and transfers gained paperless, limit preferences and the published rules.
- **Rules now as published.** Minimum payment is the higher of 1% of the balance plus interest and fees, or £5; the charge card is paid in full. Instalment Plan fees are 1% to 8% (6 months 2%, 12 months 4%, 24 months 8%). Transfers go up to 90% of available credit, from £100, and not from another Barclaycard.
- **Card range corrected.** Select and Flex are replaced by Select Cashback and Select Charge, the business cards Barclaycard sells today.
- **Labelled, not assumed.** Where only an independent source says something (the Select Cashback £2,000 month, transfers earning Avios, the Avios transfer day, online servicing closing), the app and the catalogue say so. Every item is listed with its status and source on the **Entitlement checklist** tab.

Full list, card by card: Entitlement checklist

&#91;image: Everything with your card: the hub, search, Section 75 and the Premium Plus insurance terms\]

&#91;image: Barclays Cashback Rewards, Amazon rewards, airport lounges, going abroad\]

&#91;image: Security, repayment calculator, alerts, help\]

&#91;image: Premium Plus insurance trip check, MyControls, Select Cashback tracker, Select Charge Home\]

## App map

The app has five tabs, each with the Gratifi ask bar above it, plus about 35 screens that open on top of them. Every card uses the same screens, filled with its own data. Code for each area is in `bcard/src/screens/`.

| Tab or area | Screens | What changes per card | File |
| --- | --- | --- | --- |
| Start | Card picker (nine cards in four groups), Face ID open | None | Picker.tsx |
| Home | Balance, payment due and Direct Debit, Gratifi note, quick actions, rewards summary, Everything with your card, Coming up, recent payments, trip ideas, notifications | Note, rewards summary, Coming up dates, trip (Lisbon or Amsterdam), fifth quick action, charge card shows the full amount due | Home.tsx |
| Spending | September total by category, search, filters, payment detail, Report a problem, statements with paperless and payment date, statement detail with PDF | Transactions, statement history from each card's opening date, CSV for business | Spend.tsx |
| Money | Pay, Direct Debit, credit limit and preferences, transfers, Instalment Plans, Price Promise, credit score, cashback, welcome bonus, upgrade voucher | Charge card pays in full only; Platinum plan; Forward promise; Avios bonus and voucher | Money.tsx |
| Card | Card art, freeze, card details and PIN (Face ID), phone wallet, security, MyControls, lost or stolen and activation, limit, transfers, plans, cardholders, rates and fees | Wallet (Apple Pay or Google Pay), fees, business controls | CardTab.tsx |
| Everything with your card | Searchable hub, a detail screen per item, and working screens: Cashback Rewards, Amazon rewards, lounges, Entertainment, going abroad, security, calculator, payment date, MyControls, Business Rewards, insurance, Select Cashback tracker | The items that apply to the card (24 to 47) | benefits.ts, Hub.tsx |
| Rewards | From your card (Avios, cashback or none, plus the card's own programmes), Added by Gratifi (offers, categories, trip ideas, bookings), checkout, bookings, Avios planner with Barclaycard's example prices | Programmes shown per card; business content | Rewards.tsx |
| More | Profile, payment date, calculator, Everything with your card, security, going abroad, six alerts, Gratifi settings and memory, Help and support, about, switch card, reset | Business profile, business help lines | More.tsx |
| Assistant | Chat with suggestions, voice input, answers with buttons into the right screen, including the new areas (security, money worries, Section 75, lounges, insurance, MyControls and more) | Suggestions and answers per card | Ask.tsx, engine.ts |

Everything that moves money or changes the card asks for Face ID: payments, Direct Debit, transfers, plans, limit changes, bookings, PIN and card details.

&#91;image: Start: picking a card, Home before and after Gratifi is turned on\]

&#91;image: Servicing: pay, statement, card details, lost or stolen\]

&#91;image: Credit: Instalment Plan, credit limit, transfers, payment detail\]

&#91;image: The assistant: first open, answers with next steps, hotel results, a longer conversation\]

&#91;image: Home on Avios Plus, Avios, Rewards and Amazon\]

&#91;image: Home on Platinum, Forward, Premium Plus and Select Cashback\]

## How the AI works

The systems decide every number and every action. The AI only chooses which answer fits and how to word it. This follows the deterministic versus probabilistic split agreed for Gratifi.

&#91;embedded content: how Gratifi answers · 7 steps, 1 decision\]

If the live model is off, slow (more than 9 seconds) or returns an intent that isn't on the list, the app answers with the built-in engine. The member never sees an error.

| Decided by systems (deterministic) | Decided by the AI (probabilistic) |
| --- | --- |
| Balances, payments, limits, rates, dates, fees | Which of 35 intents the question means |
| Eligibility: Instalment Plans £100 to £5,000, limit floor, transfer caps | The wording of the reply, from the facts it was given |
| Card notes and their figures (voucher, bonus, 0% plan, fee waiver, Price Promise) | Tone: British English, one to three sentences, no promises of actions |
| Offer reasons, taken from the card's own payments |  |
| Every action: it needs a button press and Face ID |  |

**The built-in engine.** It lives in `bcard/src/engine.ts` and matches whole words ("owe" never matches "lower"). It checks safety topics first: lost or stolen cards, freezing and fraud. Then it checks money, travel, spending, payments by name, rewards, offers and bookings. Every answer is worked out from the card's live state, so it changes after a payment, booking or freeze.

**The live model.** The endpoint is `api/ask.js`, a Vercel function. It sends the question, the last six messages, the list of intents and a facts sheet built by `facts()` in engine.ts. The facts sheet covers the balance, statement, Direct Debit, earning, benefits, card goals, trip, bookings, recent payments, offers and partner content. The model must reply as JSON `{intent, text}` using only those facts.

**Switching on the live model:**

1. In Vercel, open project **project-95d8n**, then Settings, then Environment Variables.
2. Add `ANTHROPIC_API_KEY` with a key from the Anthropic Console, for Production.
3. Optional: add `ANTHROPIC_MODEL`. The default is `claude-sonnet-5`, and `claude-haiku-4-5-20251001` is faster.
4. Redeploy. Until this is done, `/api/ask` returns 503 and the built-in engine answers.

**Tested questions.** 46 questions were run on all nine cards: 414 answers, checked by hand and by the reviewer. The test file is `bcard/engine.test.ts`.

## Code and deployment

The code lives on the `gratifi-app` branch of [amitchawla04/frontend-arsenal](https://github.com/amitchawla04/frontend-arsenal/tree/gratifi-app), and the latest commit is `7fd06a0`. The site is Vercel project **project-95d8n**, which serves two apps from one build:

- the earlier generic bank demo at `/`
- the Barclaycard concept at `/barclaycard/`

The stack is Vite 7, React 19, TypeScript and Motion, and the app installs on a phone as a PWA through vite-plugin-pwa. It has no backend beyond `api/ask.js`, and each browser keeps its own demo state (key `barclaycard-concept-v2`).

| Path | What's in it |
| --- | --- |
| `bcard/src/data.ts` | The nine cards with their terms and source links, each card's transactions, opening date, statements and programme figures, plus partner content and offers. **Start here to change any number.** |
| `bcard/src/store.tsx` | App state and every action (pay, freeze, plan, book, cancel and more), plus `acct()`, which works out balance, available credit, minimum and earnings |
| `bcard/src/engine.ts` | Gratifi: the card notes (`moment`), offer reasons, intent matching (`parse`), the facts sheet for the live model and the call to it |
| `bcard/src/screens/*.tsx` | The screens; section 6 lists which file holds what |
| `bcard/src/ui.tsx`, `styles.css` | Icons, card art, Face ID, sheets, toasts, design tokens |
| `api/ask.js` | The live model endpoint (Vercel function) |
| `vite.bcard.config.ts`, `vercel.json` | Build config for `/barclaycard/`, PWA manifest, rewrites and headers |
| `bcard/engine.test.ts` | Runs every sample question on every card |
| `src/` | The earlier generic bank demo, including `fit.ts`, which fixes the iOS home-screen bottom gap and is shared by both apps |

**Run it locally:**

```
git clone -b gratifi-app https://github.com/amitchawla04/frontend-arsenal gratifi && cd gratifi
npm install
npx vite -c vite.bcard.config.ts        # dev server; open /barclaycard/
npm run build && npx vite preview        # both apps, as deployed
npx esbuild bcard/engine.test.ts --bundle --platform=node --loader:.svg=text --outfile=/tmp/t.cjs && node /tmp/t.cjs
```

**Deploy.** Push to `gratifi-app` and redeploy project-95d8n to production. The build command is `npm run build` and the output folder is `dist`.

The app sits in an existing project because this session couldn't create a new Vercel project or GitHub repo: both returned permission errors. To move it, create an empty Vercel project and repo, then point them at this branch. No code needs to change.

## Quality review

Three independent review rounds scanned content, design and copy. The reviewer was a separate agent that hadn't seen the build. Scores went from 5, 6.5 and 7 in round 1 to 8.5, 8.5 and 9 in round 3. Everything the final round found has been fixed. What still stands between these scores and a 10 is real data from Barclays, listed under Known limits.

| Scan | Round 1 | Round 2 | Round 3 (final) | What was checked |
| --- | --- | --- | --- | --- |
| Content | 5 / 10 | 7.5 / 10 | 8.5 / 10 | Card terms against sources; every balance, statement, date and weekday; notes and offer reasons against each card's own payments; 46 assistant questions on all nine cards |
| Design | 6.5 / 10 | 8 / 10 | 8.5 / 10 | Every screen at iPhone 17 Pro size (402 × 874), a small phone (375 × 667) and desktop; overlaps, clipping, 44pt touch targets, date wrapping, carousels |
| Copy (slop) | 7 / 10 | 8 / 10 | 9 / 10 | Banned words (unlock, seamless, safe, secure and others), filler, machine phrasing, British English, promises that didn't match the numbers |

**Biggest fixes from the reviews:**

- **Hero notes.** Four card notes promised outcomes their own numbers didn't support: Avios, Amazon, Platinum and Select. All four are now worked out from the card's data.
- **Card data leaking between cards.** Trips, offer reasons and statement history were shared across cards. Each card now has its own opening date, payments and statements, and every statement reconciles with the next.
- **Claims about Barclaycard.** About 20 claims went beyond the sources. They were removed, verified (ClearScore, Barclaycard help pages, Head for Points) or labelled as demo.
- **Assistant matching.** Keyword collisions sent questions to the wrong answer: "lower" matched "owe" and "Spain" matched "spa". Matching now uses whole words, and travel, spending and merchant questions are checked in the right order.
- **Design.** The reviews found dates splitting across lines, carousels spilling out of their box, content showing between the bottom bars, and touch targets under 44pt. All are fixed.

Every date and weekday in the code was checked by script (81 dates). Balances reconcile to their transactions on all nine cards.

## Known limits and next steps

The app works end to end on demo data. Every item below is about real data, real integrations or brand, not missing screens.

| # | Item | Why it matters | Owner | Next step |
| --- | --- | --- | --- | --- |
| 1 | Live model is off until a key is added | The assistant uses the built-in engine today | Amit | Add `ANTHROPIC_API_KEY` in Vercel (section 7), redeploy, try the demo questions |
| 2 | Card terms were checked on 28 Sep 2026 | APRs and offers change often | R360 product team | Re-check the sources in section 3 before every external use |
| 3 | Illustrative figures: transfer offers, credit scores, Cashback Rewards and Business Rewards amounts, Select Cashback history, member balances (the minimum payment rule and Instalment Plan fees are now Barclaycard's published ones) | They're labelled demo in the app, but a banker will ask | R360 product team with Barclays | Replace with Barclays' real rules and data in a pilot build |
| 4 | Partners, offers and prices are invented | They show how the Gratifi layer works, not real inventory | R360 content team | Load real R360 partner content for the UK |
| 5 | Some actions end with "In the live app, this…" | Apple Wallet, messaging the team, calling, updating details, the Cashback Rewards site, booking with British Airways | Engineering, with Barclays APIs | Map each one to the real Barclaycard API or deep link |
| 6 | Business cards shown in the same app | In reality they use the separate Barclaycard for Business app | Amit | Keep for the pitch, or split into a second app for a business-banking meeting |
| 7 | No Barclays logo or brand assets | Keeps the concept from being mistaken for the real app | Amit | Add brand assets only in a private build, with Barclays' permission |
| 8 | Hosted inside an existing Vercel project and repo | This session couldn't create new ones | Amit | Create an empty Vercel project and GitHub repo; the branch moves over as is |
| 9 | Voice input needs the browser's speech recognition | Works in Safari and Chrome; other browsers ask the member to type | Engineering | No action for the pitch |
| 10 | Demo state lives in each browser | Two people demoing on different phones see different states | No action | Use Reset this card before each demo |
| 11 | Four items rest on independent sources only: the Select Cashback £2,000 month, transfers earning Avios, the Avios transfer day, online servicing closing | The app labels them, but they are not confirmed by Barclaycard's own pages | R360 product team | Confirm with Barclays, then update benefits.ts and the Entitlement checklist tab |
| 12 | Amazon card transfers and business balance transfers are not shown | No published offer was found for them, so the app leaves them out | R360 product team | Add if Barclays confirms they are offered |

## Change log

| Date | Commit | Change |
| --- | --- | --- |
| 28 Sep 2026 | 3186eb7, 7fd06a0 | Every entitlement per card: 71-item catalogue with terms and sources, searchable hub and detail screens, 13 new working screens, Select Cashback and Select Charge replace Select and Flex, published minimum payment and Instalment Plan rules, rebuilt Alerts and Help, new assistant intents. Independent content review: 22 findings fixed |
| 28 Sep 2026 | `008422d` | Final review fixes: Price Promise counted in due dates, lost-wallet questions routed to card replacement, Flex opening date, shorter offer reasons. Then `99f6bca` added the home-screen icons, which earlier commits had missed |
| 28 Sep 2026 | `c179270` | Statements label the minimum-payment rule as illustrative |
| 28 Sep 2026 | `63e201a` | Rounds 1 and 2 of review fixes: per-card data and statements, whole-word matching, Platinum plan, unverified claims removed, design fixes |
| 28 Sep 2026 | `40a313e` | Barclaycard concept app added at `/barclaycard/` with nine cards, full servicing, the Gratifi layer and the live-model endpoint |
| 28 Sep 2026 | `f5727bc` | Installed iPhone app now reaches the bottom of the screen (iOS 26 short-viewport fix, `src/fit.ts`) |
| 27 Sep 2026 | `88296c5` | Generic bank demo fills the screen in the installed app; Gratifi PWA and pitch deck (version 16) in place |

## Sources

Card terms and app features, opened 28 Sep 2026:

- [Barclaycard personal credit cards](https://www.barclaycard.co.uk/personal/credit-cards)
- [Barclaycard Avios Plus](https://www.barclaycard.co.uk/personal/credit-cards/avios-plus)
- [Barclaycard Avios](https://www.barclaycard.co.uk/personal/credit-cards/avios)
- [Barclaycard Forward](https://www.barclaycard.co.uk/personal/credit-cards/forward)
- [Barclaycard business credit cards](https://www.barclaycard.co.uk/business/cards/credit-cards)
- [Barclaycard app features](https://www.barclaycard.co.uk/personal/customer/barclaycard-app)
- [Barclaycard Cashback Rewards](https://www.barclaycard.co.uk/personal/customer/barclaycard-cashback-rewards)
- [Barclaycard Entertainment](https://www.barclaycard.co.uk/personal/credit-cards/barclaycard-entertainment)
- [Barclaycard Instalment Plan](https://www.barclaycard.co.uk/personal/help/spending-transactions/instalment-plan-benefits)
- [Barclaycard lost or stolen card help](https://www.barclaycard.co.uk/personal/help/credit-cards/amazon-barclaycard-lost-stolen)
- [Barclaycard with Apple Pay](https://www.barclaycard.co.uk/personal/apple-pay)
- [ClearScore: Barclaycard Rewards review](https://www.clearscore.com/learn/credit-cards/barclaycard-rewards-credit-card-review)
- [ClearScore: Barclaycard credit cards](https://www.clearscore.com/learn/credit-cards/barclaycard-credit-cards)
- [Head for Points: Barclaycard Avios Plus review (2026)](https://www.headforpoints.com/2026/06/09/review-barclaycard-avios-plus-mastercard-credit-card-5/)
