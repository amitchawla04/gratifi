# Back

The orange "money back" chip with Gratifi's spark: "£9 back on your card".

## When to use

For what the customer earns on top: cashback, bonus points, a multiplier.

## What you provide

```ts
Gratifi.Back(props: { children })
```

## Rules

- Only for money or points coming back, never for discounts.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Back } = window.Gratifi

<Back>£9 back on your card</Back>
<Back>3× points</Back>
```

`Gratifi.demos.Back()` renders every state on this card.
