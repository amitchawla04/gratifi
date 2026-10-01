# Markets

The same blocks in every market: currency, number grouping, how payment is confirmed and the words all come from the market, never from the component.

## When to use

Wrap the app, or any part of it, in `MarketProvider market="IN"`. Built in: UK, EU, IN, AE, SG, MY, and AR (UAE in Arabic, right to left). A bank can pass its own market object to override any setting.

## What you provide

```ts
Gratifi.Markets(props: { market?: 'UK' | 'EU' | 'IN' | 'AE' | 'SG' | 'MY' | 'AR' | Market; children })
```

## Rules

- Components never hard-code a currency, date format or word: they read `useMarket()`.
- Flight times stay 24-hour in every market, as airlines print them.
- Compensation amounts come from each bank’s legal team per market; the kit only names the rule.
- Arabic copy is a layout draft until a native writer signs it off.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Markets } = window.Gratifi

{['UK', 'EU', 'IN', 'AE', 'SG', 'MY', 'AR'].map(m => { const d = DEMO[m === 'AR' ? 'AE' : m]; return <MarketProvider key={m} market={m}><C t={MARKETS[m].name + ' · ' + MARKETS[m].currency + ' · ' + ({ faceid: 'Face ID', otp: 'one-time code', app: 'bank app approval' } as any)[MARKETS[m].auth]}><div className="gr-col" style={{ gap: 12, width: 340 }}><FlightCard {...(d.flights[0] as any)} best={undefined} back={undefined} tags={[]} bag={undefined} />
<PayWith points={d.balance} cash={d.fares.std * 2} rate={d.rate} mix={d.mixPts} card={d.card} />
</div></MarketProvider> })}
```

`Gratifi.demos.Markets()` renders every state on this card.
