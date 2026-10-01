# Price

A price in cash, with the points alternative and an optional was price or note.

## When to use

Wherever the customer pays. Always show cash; show points when the bank lets points pay for it.

## What you provide

```ts
Gratifi.Price(props: { amount: number; was?: number; points?: number; note?: string; size?: 'lg'; align?: 'left' | 'right' })
```

## Rules

- Prices include taxes and fees. Say so in `note` when it is not obvious.
- Points sit under the cash price in `accent-ink`.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Price } = window.Gratifi

<div className="gr-card"><Price amount={186} points={18600} />
</div><div className="gr-card"><Price amount={142} was={166} />
</div><div className="gr-card"><Price amount={496} size="lg" note="2 nights, taxes in" />
</div>
```

`Gratifi.demos.Price()` renders every state on this card.
