# ProductCard

A product or voucher with image, price and points.

## When to use

Rewards catalogue and shopping results.

## What you provide

```ts
Gratifi.ProductCard(props: { src: string; name: string; meta?: string[]; price: number; points?: number; badge?: string; back?: string })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { ProductCard } = window.Gratifi

<div style={{ width: 200 }}><ProductCard src={ART.jacket} name="Rain shell jacket" meta={['Outdoor', 'Free delivery']} price={120} points={15000} badge="New" />
</div><div style={{ width: 200 }}><ProductCard src={ART.cinema} name="Cinema for two" meta={['Any Friday']} price={24} points={3000} back="2 for 1" />
</div>
```

`Gratifi.demos.ProductCard()` renders every state on this card.
