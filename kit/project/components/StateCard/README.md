# StateCard

One card for when things aren't as expected: price changed, sold out, can't reach, nothing found.

## When to use

Every exception in a journey, with the way forward as buttons.

## What you provide

```ts
Gratifi.StateCard(props: { kind?: 'price' | 'soldout' | 'error' | 'empty' | 'done'; title: string; body?; was?: string; now?: string; actions?: string[] })
```

## Rules

- Say what happened, then what was not affected ("Nothing has been booked"), then the choices.

## Example

Wrap the app in `className="gr"`, then:

```jsx
const { StateCard } = window.Gratifi

<StateCard kind="price" title="The fare went up since you looked" body="Coastline changed the price while you were choosing." was="£142" now="£166" actions={['Book at £166', 'Other flights']} />
<StateCard kind="soldout" title="15E has just gone" body="16C and 16D are free, side by side across the aisle." actions={['Take 16C and 16D']} />
<StateCard kind="error" title="Northway isn’t answering" body="Nothing has been booked or paid. Try again in a minute." actions={['Try again']} />
<StateCard kind="empty" title="No direct flights that morning" body="There are two after 12:00, or direct on Thursday." actions={['Show Thursday', 'After 12:00']} />
```

`Gratifi.demos.StateCard()` renders every state on this card.
