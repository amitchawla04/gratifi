# Gratifi

Gratifi is a working prototype of an AI-first rewards and shopping assistant inside a bank's credit card app. It covers 19 categories in 7 markets (UK, EU, India, UAE, UAE in Arabic, Singapore, Malaysia). The bank, partners and brands are all fictional.

- Live prototype: https://claude.ai/artifact/PnL2cqt2NU8tFYp8MDMKaj
- Team handoff: https://claude.ai/code/artifact/f3fec621-39ab-455f-9952-26cd9d4f6d45

## Install as an app

Gratifi is a progressive web app. Open the Vercel link on a phone: on iPhone tap Share, then Add to Home Screen; on Android tap Install app. It opens full screen, works offline, has long-press shortcuts (My card, Ask Gratifi, Rewards, Wallet) and shows a badge when Gratifi has news. `python3 gratifi/build.py` writes the installable site to `gratifi/build/site/` (copied to `site/` for Vercel).

## Modules and the bank connection

Every service is a module that needs one or more bank APIs (`gratifi/src/modules.ts`). A bank that offers the APIs gets the module; a bank that doesn't never sees it: no screen, no button, no chat answer. The chat filters every answer the same way, in both the built-in engine and Live AI, so it can't offer a service the bank doesn't have.

| Group | Modules |
| --- | --- |
| Card | Card overview, Pay your bill, Direct Debit, Statements, Transactions and spending, Freeze and controls, Spending limits, Card details, PIN, Lost/stolen/damaged and replacement, Activation, Phone wallet, Travel notice, Gambling block, Credit limit, Disputes, Card benefits |
| Rewards | Points and tier, Card offers, Challenges, Points transfers, Grow points, Give |
| Partners | Flights, Stays, Airport, Rides and rail, Travel essentials, Experiences, Dining, Events, Groceries, Shopping, Gift cards, Subscriptions, Concierge |

Screens and flows talk to `gratifi/src/bank.ts`, never to the store directly for card servicing. Today it answers from a mock bank in the browser; a real bank plugs in by implementing the same calls against its APIs. Each call names the API it needs, so a missing API fails with a plain message instead of half-working.

To see the app as a bank with fewer APIs would: You, then Demo controls, then Bank connections. Switch any API off, or use the presets (Card only, Card and points, Rewards only).

## Build

```
cd kit && npm install && cd ..
python3 gratifi/build.py
```

This writes `gratifi/build/gratifi.html` (the published page), `test.html` (local testing) and `test-ai.html` (a pretend Claude for testing the AI plumbing). Open `test.html?m=UK` in a phone-sized window. The `m` parameter takes UK, EU, IN, AE, AR, SG or MY.

## Layout

| Path | What it holds |
| --- | --- |
| `gratifi/src/main.tsx` | App start and tab layout |
| `gratifi/src/screens.tsx` | Home (card first, then earning, then rewards), My card, Rewards, chat, Wallet, You (settings, demo controls, bank connections), Offers, Alerts, Tier, bank entry |
| `gratifi/src/cardx.tsx` | Card servicing screens: pay, statements, transactions, card details, PIN, spending limits, lost/stolen/replace, activation, disputes, cases, credit limit, phone wallet, travel notice |
| `gratifi/src/modules.ts` | Module registry: bank APIs, which modules need which, and the filter on chat answers |
| `gratifi/src/bank.ts` | Bank connection layer (mock today): card data and card actions, each tied to its API |
| `gratifi/src/design.tsx` | Components taken from the approved 27 Sep screens (header buttons, points card, note, stamps, offers, polaroids, lists, segmented, switches), and card elements extrapolated from them (card face, tick meter, choice rows, fields, search, status track, card details, PIN boxes, limit rows, notes) |
| `gratifi/src/art/` | Artwork from the approved screens |
| `gratifi/src/brain.ts` | Live AI mode: Claude rules, 16 tools, second safety check, reply filters |
| `gratifi/src/flows.ts` | Built-in engine and flow logic: fixed safety check, search, checkout, bookings, card servicing |
| `gratifi/src/render.tsx` | Answer cards, confirm sheet, receipts |
| `gratifi/src/store.tsx` | Demo bank and app state, kept per market in local storage |
| `gratifi/src/catalog.ts` | Demo catalogue and prices per market |
| `gratifi/src/ar.ts`, `ar-dict.ts` | Arabic input and on-screen text |
| `kit/` | Shared design kit: components, icons, market formats, strings, styles, fonts |

## Tests

The tests use Playwright with Chromium. Line 2 of each script loads Playwright from a fixed path; change it to `require('playwright')` once it is installed locally.

- `node gratifi/engine.js UK`: types hundreds of customer phrases into the built-in engine and checks the answer card
- `gratifi/drives.sh`: 20 end-to-end journeys in every market, including `cards` (every card servicing screen, then switching bank APIs off)
- `gratifi/engall.sh`: both of the above for all markets
- `node gratifi/review/ai.js`: Live AI plumbing against the pretend Claude

Demo codes: India one-time code 482193. Malaysia uses simulated bank-app approval. Demo controls under You can deliver a new card and have the bank decide disputes and limit requests.
