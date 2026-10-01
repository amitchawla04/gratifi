# OfferCard

A merchant offer the customer adds to their card: rate, brand, when it ends, Add.

## When to use

Card-linked offers. `why` replaces the end date when Gratifi picked it for them.

## What you provide

```ts
Gratifi.OfferCard(props: { brand: string; mono: string; color?: string; rate: string; sub?: string; why?: string; added?: boolean; onAdd? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { OfferCard } = window.Gratifi

<div style={{ width: 360 }}><OfferCard brand="Harbour & Co" mono="H" color="#2E5E4E" rate="10% back" sub="Until 31 Oct · up to £15" />
</div><div style={{ width: 360 }}><OfferCard brand="Northway Air" mono="N" color="#1F3A5F" rate="5% back" why="You fly with them most" added />
</div>
```

`Gratifi.demos.OfferCard()` renders every state on this card.
