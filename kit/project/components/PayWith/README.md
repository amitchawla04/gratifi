# PayWith

How to pay: points, points and card, or card.

## When to use

Every checkout. The bank's rules set the rate.

## What you provide

```ts
Gratifi.PayWith(props: { points?: number; cash?: number; rate?: number /* £ per point */; mix?: number; card?: string; value?: 'points' | 'mix' | 'card'; onChange? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PayWith } = window.Gratifi

<div style={{ width: 360 }}><PayWith />
</div>
```

`Gratifi.demos.PayWith()` renders every state on this card.
