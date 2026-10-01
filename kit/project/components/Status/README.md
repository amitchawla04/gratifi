# Status

A coloured dot and a word for live state: On time, Delayed 35 min, Cancelled.

## When to use

Flight, order and booking state. `live` pulses the dot while the state can change.

## What you provide

```ts
Gratifi.Status(props: { tone?: 'good' | 'warn' | 'danger'; live?: boolean; children })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Status } = window.Gratifi

<Status live>On time</Status>
<Status tone="warn" live>Delayed 35 min</Status>
<Status tone="danger">Cancelled</Status>
```

`Gratifi.demos.Status()` renders every state on this card.
