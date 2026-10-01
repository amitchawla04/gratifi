# RideOption

A ride choice with arrival time, seats and price.

## When to use

Airport transfers and rides.

## What you provide

```ts
Gratifi.RideOption(props: { name?; eta?; seats?; price?; checked?; note?; onPick? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { RideOption } = window.Gratifi

<div className="gr-col" role="radiogroup" aria-label="Rides" style={{ gap: 10, width: 360 }}><RideOption checked />
<RideOption name="Larger" eta="7 min away" seats={6} price={52} note="Room for 4 bags" />
</div>
```

`Gratifi.demos.RideOption()` renders every state on this card.
