Gratifi is a loyalty assistant a bank gives its customers. It answers in plain words, shows the proof on a card, and hands every decision back to the customer as a normal button. This kit holds every building block the conversation and the app are made from: 74 components with their states, and journeys that show how they fit, each in six markets.

One rule sits above the rest: **the assistant suggests, the member decides with a normal button.** Nothing spends money or points without the customer pressing a button that names the amount.

## How Gratifi talks

- Plain words, British English, sentence case. Write as one helpful person: "I've put Sam in 15D", "You may be owed up to £350".
- Lead with the answer, then the proof. "Three good options. **The 07:25 Northway** is the one I'd pick: direct, seats together, and it earns you £9 back."
- Numbers over adjectives. "£9 back", "2 left", "lands 14:15", never "great value" or "amazing".
- Say what wasn't affected when something goes wrong: "Nothing has been booked or paid."
- Buttons are verbs that say what happens: "Pay £72 with Face ID", "Move me to this flight", "Not now".
- Say "bank", never "card issuer". Say "points" and "money back".
- Never: emoji, exclamation marks in the product, "seamless", "unlock", "elevate", "delight", "journey" in customer copy, "safe" or "secure" as a promise.
- Figures in the kit are illustrative. Airlines are fictional (Northway Air, Coastline, Aurora Air); airport codes are real.

## Colour

- The ground is warm grey `ground`; screens are `screen`; every card is `card` on `shadow-card`. Cards never get borders: they separate by shadow.
- There is one hot colour, `accent`. It marks selection and progress: the calendar range, the chosen seat, the check, the dial ticks, the Toggle. Put `on-accent` (ink) on it, never white.
- Orange words use `accent-ink`: points under a price, money back.
- The black pill `pill` with `on-pill` is the primary button, the selected tab, the selected chip and the chosen payment row. It inverts in dark.
- Paper colours `sticky-yellow` and `sticky-blue` appear on notes only. Yellow is Gratifi's voice; blue is the customer's own.
- `good`, `warn` and `danger` always come with a word or an icon, on their `-soft` grounds. Never colour alone.
- A bank can replace `accent` with its brand colour. Nothing else changes.

## Type

- Geist for everything: `display` once per screen, `title` for card and sheet headlines, `time` for times and big prices, `heading` for names of things, `body` for answers, `meta` for grey facts, `label` for small uppercase labels.
- Gochi Hand (`hand`) only on sticky notes and polaroid captions. Never on buttons, prices or anything the customer has to read to decide.
- Geist Mono (`code`) for booking references, flight numbers, gates.
- Times and prices use tabular figures (`gr-num`).

## Shape and space

- Big radii: `radius-lg` for cards, `radius-xl` for sheets and hero cards, `radius-pill` for buttons, chips and the nav. Seats and calendar days use `radius-xs`.
- The screen gutter and card padding is `space-4`; between cards in a conversation `space-4` to `space-6`.
- Shadows are soft and wide: `shadow-card` for cards, `shadow-float` for anything that floats (ask bar, nav, sheets, toasts), `shadow-paper` for things you could hold.
- Touch targets are at least 44px. Small buttons (36px) extend their hit area.

## Objects you can hold

The kit's character comes from a few tactile objects, used sparingly: the **StickyNote** (Gratifi's proactive moment, clipped on), the **Polaroid** (a place or a reward), the **Stamp** (a collected reward), the **Sticker** (one fact on a photo), the **TripFolder** (a saved plan), the **Dial** (the points balance) and the orange **CheckPop** (done). One or two per screen. They tilt a degree or three; nothing else in the UI tilts.

## The shape of an answer

Every Gratifi reply is an **Answer**: two or three **Steps** that say what was checked, one answer line with the key fact in bold, the card that proves it (a FlightCard in a Rail, a Compare, a FareRules), and up to three next steps as buttons, then **Suggestions** as chips. Anything that moves money ends in a **ConfirmSheet** and a **Receipt**. Anything unexpected is a **StateCard** with the way forward.

## Markets

One kit serves every market. A market is data, never design: wrap the app in `MarketProvider` and every block picks up the market's currency, number grouping, dates, first day of the week, how a payment is confirmed, what automatic card payments are called, the tax name, the flight disruption rule and the words.

- Built in: `UK`, `EU` (English, euro), `IN`, `AE`, `SG`, `MY`, and `AR` (UAE in Arabic, right to left). A bank passes its own market object to change any setting.
- Confirming a payment follows the market: Face ID in the UK, EU, UAE and Singapore; a one-time code in India; approval in the bank's app in Malaysia.
- Never write a currency symbol, date or kit word into a component. Use `useMarket()`: `M.money()`, `M.num()`, `M.pts()`, `M.date()`, `M.t()`.
- Flight times stay 24-hour everywhere, as airlines print them.
- Compensation amounts appear only where the law sets them (UK261, EU261). Elsewhere Gratifi names the rule and the bank's legal team supplies the rest.
- Layout uses logical properties (start and end, not left and right), so right to left works without separate styles. Arrows, back buttons and the plane mirror automatically.
- The Arabic words in the kit are a layout draft. A native writer signs them off before launch. Arabic text uses IBM Plex Sans Arabic beside Geist.
- Journeys have market tabs, so each one can be checked in all six markets.

## Motion

- Short and physical: sheets rise in 350ms, the check pops once, the listening wave moves only while listening, live status dots pulse.
- Motion is off when the device asks for reduced motion. Every state reads without it.

## Iconography

- The kit's own 72 line icons (`Icon`), 24px grid, 1.9 stroke, round caps and joins, taking the text colour. `ICONS` lists the names.
- Gratifi's spark (`Spark`) marks anything the assistant said or added: the ask bar, money back, the note's "From Gratifi".
- Illustrations are flat scenes and stamps from the `Illustrations` and `Stamps` groups, carried in the bundle as `Gratifi.ART`.
- No emoji. No real brand logos: merchants and airlines show a monogram on their colour until the content provider supplies a licensed mark.

## Accessibility

- Text meets 4.5:1 on its ground in both themes; `ink-faint` is decorative only.
- Focus is a solid 2.5px `ink` ring with a 2px offset.
- Every icon-only control has a label; selection uses `aria-pressed` or `aria-checked`, not colour alone.
- Seats say their number and state when read aloud; calendar days say their price.

## Using the kit

Wrap the app in an element with class `gr` (the PhoneFrame and journeys do this themselves), load `tokens.css`, `bundle.css`, React 18 and `bundle.js`, then use `window.Gratifi.<Component>`. `Gratifi.demos.<Component>()` renders the states shown on each card.
