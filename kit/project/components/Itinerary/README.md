# Itinerary

The whole journey leg by leg, with layovers in between; a tight connection turns amber.

## When to use

Before choosing a fare and in trip details.

## What you provide

```ts
Gratifi.Itinerary(props: { legs: {dep, arr, from, fromName, to, toName, airline, number, dur, cabin?, plane?}[]; layovers?: {text, short?}[] })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Itinerary } = window.Gratifi

<Itinerary legs={[{ dep: '06:35', arr: '08:45', from: 'LHR', fromName: 'London Heathrow', to: 'OPO', toName: 'Porto', airline: 'AU', number: 'AU 340', dur: '2h 10m' }, { dep: '09:30', arr: '10:25', from: 'OPO', fromName: 'Porto', to: 'LIS', toName: 'Lisbon', airline: 'AU', number: 'AU 1184', dur: '55m' }]} layovers={[{ text: '45 min in Porto · same terminal, tight', short: true }]} />
```

`Gratifi.demos.Itinerary()` renders every state on this card.
