# FlightTracker

Live status: an arc for progress and three numbers for what changed.

## When to use

From check-in to landing.

## What you provide

```ts
Gratifi.FlightTracker(props: { number?; from?; to?; status?; tone?: 'good' | 'warn' | 'danger'; progress?: number; dep?; depWas?; arr?; gate?; note? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FlightTracker } = window.Gratifi

<FlightTracker status="On time" tone="good" depWas="" dep="07:25" arr="10:00" progress={0} />
<FlightTracker progress={0.55} status="In the air" tone="good" dep="08:00" depWas="" arr="10:35" note="Lands in 1h 10m. Your ride is booked for 10:50." />
```

`Gratifi.demos.FlightTracker()` renders every state on this card.
