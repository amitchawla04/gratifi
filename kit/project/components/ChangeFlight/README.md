# ChangeFlight

Change a booked flight: old against new, and the difference to pay.

## When to use

Date and time changes.

## What you provide

```ts
Gratifi.ChangeFlight(props: { was?: {day, time}; now?: {day, time}; fee?: number; diff?: number })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { ChangeFlight } = window.Gratifi

<ChangeFlight />
```

`Gratifi.demos.ChangeFlight()` renders every state on this card.
