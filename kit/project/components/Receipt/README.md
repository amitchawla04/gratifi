# Receipt

After it is done: the check, the reference, the facts, and what happens next.

## When to use

Every completed booking or order.

## What you provide

```ts
Gratifi.Receipt(props: { title?: string; reference?: string; lines?: [string, string][]; next?: string; actions?: string[] })
```

## Rules

- "Next" says what Gratifi will do and when.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Receipt } = window.Gratifi

<Receipt lines={[['Flights', 'Fri 16 to Sun 18 Oct'], ['Seats', '15D, 15E'], ['Paid', '30,000 pts + £72']]} next="Check-in opens Wed 14 Oct. I’ll do it and send the boarding passes." actions={['Add a hotel', 'Share trip']} />
```

`Gratifi.demos.Receipt()` renders every state on this card.
