# Stepper

Minus, a number, plus: for counts like travellers and bags.

## When to use

Small whole numbers with a clear minimum and maximum.

## What you provide

```ts
Gratifi.Stepper(props: { value?: number; min?: number; max?: number; label: string; onChange?: (v: number) => void })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Stepper } = window.Gratifi

<Stepper label="adults" value={2} min={1} />
<Stepper label="bags" />
```

`Gratifi.demos.Stepper()` renders every state on this card.
