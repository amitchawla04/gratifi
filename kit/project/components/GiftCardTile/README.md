# GiftCardTile

A gift card in the merchant's colour with its value and points.

## When to use

Vouchers and gift cards.

## What you provide

```ts
Gratifi.GiftCardTile(props: { brand?; amount?; color?; note? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { GiftCardTile } = window.Gratifi

<GiftCardTile note="6,250 pts" />
<GiftCardTile brand="Bloom" amount={25} color="#B5542B" note="3,125 pts" />
<GiftCardTile brand="Northway Air" amount={100} color="#1F3A5F" note="12,500 pts" />
```

`Gratifi.demos.GiftCardTile()` renders every state on this card.
