# FareRules

The fare's rules in plain words: green is free, amber costs, grey isn't possible.

## When to use

Before paying and in trip details.

## What you provide

```ts
Gratifi.FareRules(props: { rules?: ['ok' | 'fee' | 'nope', string, string][] })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { FareRules } = window.Gratifi

<FareRules />
```

`Gratifi.demos.FareRules()` renders every state on this card.
