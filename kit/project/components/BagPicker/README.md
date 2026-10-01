# BagPicker

What bags are included, then what can be added, priced per person per flight.

## When to use

After the fare.

## What you provide

```ts
Gratifi.BagPicker(props: { bags?: {icon, name, sub, incl?, price?}[] })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { BagPicker } = window.Gratifi

<BagPicker />
```

`Gratifi.demos.BagPicker()` renders every state on this card.
