# Gratifi

Gratifi is a working prototype of an AI-first rewards and shopping assistant inside a bank's credit card app. It covers 19 categories in 7 markets (UK, EU, India, UAE, UAE in Arabic, Singapore, Malaysia). The bank, partners and brands are all fictional.

- Live prototype: https://claude.ai/artifact/PnL2cqt2NU8tFYp8MDMKaj
- Team handoff: https://claude.ai/code/artifact/f3fec621-39ab-455f-9952-26cd9d4f6d45

## Build

```
cd kit && npm install && cd ..
python3 gratifi/build.py
```

This writes `gratifi/build/gratifi.html` (the published page), `site/index.html` (the page Vercel serves), `test.html` (local testing) and `test-ai.html` (a pretend Claude for testing the AI plumbing). Open `test.html?m=UK` in a phone-sized window. The `m` parameter takes UK, EU, IN, AE, AR, SG or MY.

## Deploy

The Vercel project `gratifi` is linked to this repository. Every push builds the page from source using `vercel.json` (`npm ci --prefix kit`, then `python3 gratifi/build.py`) and serves `site/`. Pushes to `main` go to production. Other branches get preview URLs.

## Layout

| Path | What it holds |
| --- | --- |
| `gratifi/src/main.tsx` | App start and tab layout |
| `gratifi/src/screens.tsx` | Home, Explore, chat, Wallet, My card, demo controls |
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
- `gratifi/drives.sh`: 19 end-to-end journeys in every market
- `gratifi/engall.sh`: both of the above for all markets
- `node gratifi/review/ai.js`: Live AI plumbing against the pretend Claude

Demo codes: India one-time code 482193. Malaysia uses simulated bank-app approval.
