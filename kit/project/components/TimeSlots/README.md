# TimeSlots

A grid of times; full ones are struck through.

## When to use

Tables, tours, appointments.

## What you provide

```ts
Gratifi.TimeSlots(props: { slots?: [string, string][]; value?: string })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { TimeSlots } = window.Gratifi

<div className="gr-card" style={{ width: 360 }}><div className="gr-heading">Saturday 17 Oct</div>
<TimeSlots />
</div>
```

`Gratifi.demos.TimeSlots()` renders every state on this card.
