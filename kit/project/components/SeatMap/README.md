# SeatMap

A cabin section; orange is your pick, black is who you travel with, blue has extra legroom.

## When to use

Seat selection.

## What you provide

```ts
Gratifi.SeatMap(props: { rows?; exitAfter?; taken?: string[]; extra?: number[]; mates?: string[]; picked?: string; extraPrice?: number; onPick? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { SeatMap } = window.Gratifi

<SeatMap />
```

`Gratifi.demos.SeatMap()` renders every state on this card.
