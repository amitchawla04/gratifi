# Rail

A horizontal rail of cards that snaps, with a heading and See all.

## When to use

Options to browse: flights, hotels, offers. Show three, then See all.

## What you provide

```ts
Gratifi.Rail(props: { title?: string; more?: string; onMore?; children })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { Rail } = window.Gratifi

<div style={{ width: 380, overflow: 'hidden', padding: '0 16px' }}><Rail title="Offers on your card" more="See all 24">{[['Harbour & Co', 'H', '#2E5E4E', '10% back'], ['Northway Air', 'N', '#1F3A5F', '5% back'], ['Bloom', 'B', '#B5542B', '£5 off £30']].map(([b, m, c, r]) => <div key={b} style={{ width: 300 }}><OfferCard brand={b} mono={m} color={c} rate={r} sub="Until 31 Oct" />
</div>)}</Rail></div>
```

`Gratifi.demos.Rail()` renders every state on this card.
