# TripFolder

A saved trip as a folder: photos peek out, the plan sits on the front with what is still to book.

## When to use

Trips and plans with several parts.

## What you provide

```ts
Gratifi.TripFolder(props: { title: string; dates: string; photos?: string[]; items?: {icon, title, meta, done?}[]; people?: {name}[]; onOpen? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { TripFolder } = window.Gratifi

<div style={{ width: 360, paddingTop: 40 }}><TripFolder title="Lisbon" dates="16 to 18 Oct" photos={[ART.lisbon, ART.pool, ART.food]} people={[{ name: 'Amit Chawla' }, { name: 'Sam Rao' }]} items={[{ icon: 'plane', title: 'NW 214 · 07:25', meta: 'Seats 15D, 15E', done: true }, { icon: 'hotel', title: 'Casa do Rio', meta: '2 nights', done: true }, { icon: 'car', title: 'Airport ride', meta: 'Fri 10:15' }]} />
</div>
```

`Gratifi.demos.TripFolder()` renders every state on this card.
