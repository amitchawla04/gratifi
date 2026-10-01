# RoomOption

A room to pick, with its size, bed, cancellation and total.

## When to use

Choosing a room.

## What you provide

```ts
Gratifi.RoomOption(props: { src; name; facts: string[]; price; cancel?; checked?; onPick? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { RoomOption } = window.Gratifi

<div className="gr-col" role="radiogroup" aria-label="Rooms" style={{ gap: 12 }}><RoomOption src={ART.room} name="Double, river view" facts={['22m²', 'King bed']} price={248} cancel="Free cancellation to 13 Oct" checked />
<RoomOption src={ART.room} name="Junior suite" facts={['34m²', 'Balcony']} price={342} />
</div>
```

`Gratifi.demos.RoomOption()` renders every state on this card.
