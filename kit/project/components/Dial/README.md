# Dial

The points balance in a black core, with orange ticks for progress to a goal.

## When to use

Home and wallet: the balance and what it gets you.

## What you provide

```ts
Gratifi.Dial(props: { value: number | string; label?: string; progress?: number /* 0 to 1 */; size?: number; goal?: string })
```

## Rules

- The goal line says what the balance buys, in words.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Dial } = window.Gratifi

<Dial value={48210} progress={0.78} goal="62,000 for Lisbon flights and hotel" />
<Dial value="£42" label="Back in Oct" progress={0.3} size={160} />
```

`Gratifi.demos.Dial()` renders every state on this card.
