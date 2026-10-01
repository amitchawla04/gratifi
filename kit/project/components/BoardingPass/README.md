# BoardingPass

The boarding pass: big airport codes, the four numbers people look for, and the code to scan.

## When to use

Day of travel. Stays dark in both themes.

## What you provide

```ts
Gratifi.BoardingPass(props: { name?; airline?; number?; from?; fromCity?; to?; toCity?; date?; boards?; gate?; seat?; group?; dep? })
```

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { BoardingPass } = window.Gratifi

<BoardingPass />
```

`Gratifi.demos.BoardingPass()` renders every state on this card.
