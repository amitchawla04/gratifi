# LoungePass

An airport lounge pass with where, when and the code.

## When to use

Card benefits used at the airport.

## What you provide

```ts
Gratifi.LoungePass(props: { name?; where?; valid?; guests? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { LoungePass } = window.Gratifi

<LoungePass />
```

`Gratifi.demos.LoungePass()` renders every state on this card.
