# Travellers

Adults, children and infants with steppers; infants never outnumber adults.

## When to use

Before searching flights or stays.

## What you provide

```ts
Gratifi.Travellers(props: { adults?: number; children?: number; infants?: number })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Travellers } = window.Gratifi

<Travellers adults={2} infants={1} />
```

`Gratifi.demos.Travellers()` renders every state on this card.
