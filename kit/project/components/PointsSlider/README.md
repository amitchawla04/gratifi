# PointsSlider

Slide between points and cash; both totals update as you move.

## When to use

When the customer wants to choose the split.

## What you provide

```ts
Gratifi.PointsSlider(props: { total?: number; rate?: number; balance?: number; start?: number })
```

## Rules

- The slider never invents a rate: pass the bank's.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { PointsSlider } = window.Gratifi

<PointsSlider />
```

`Gratifi.demos.PointsSlider()` renders every state on this card.
