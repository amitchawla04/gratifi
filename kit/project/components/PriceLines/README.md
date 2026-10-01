# PriceLines

What the total is made of, with the total in bold.

## When to use

Checkout, receipts, changes.

## What you provide

```ts
Gratifi.PriceLines(props: { lines: [string, string][]; total: [string, string]; note?: string })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PriceLines } = window.Gratifi

<div className="gr-card" style={{ width: 360 }}><PriceLines lines={[['2 adults, Standard', '£372.00'], ['Seats 15D, 15E', 'Included'], ['Points used (30,000 pts)', '−£300.00']]} total={['On your card', '£72.00']} note="Taxes and fees included." />
</div>
```

`Gratifi.demos.PriceLines()` renders every state on this card.
