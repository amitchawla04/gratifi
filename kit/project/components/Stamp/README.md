# Stamp

A reward or category collected like a postage stamp, with its name and value below.

## When to use

Collections of earned rewards, categories, vouchers.

## What you provide

```ts
Gratifi.Stamp(props: { art?: string /* ART.stampPlane */; name?: string; value?: string; tilt?: number })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Stamp } = window.Gratifi

<Stamp name="Flights" value="13,000" />
<Stamp art={ART.stampHotel} name="Stays" value="3×" tilt={-3} />
<Stamp art={ART.stampDining} name="Dining" value="£20" tilt={4} />
<Stamp art={ART.stampTicket} name="Cinema" value="2 for 1" tilt={-1} />
```

`Gratifi.demos.Stamp()` renders every state on this card.
